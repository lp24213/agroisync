import express, { Router } from 'express';
import { authenticateToken, requireActivePlan } from '../middleware/auth.js';
import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';

const router = Router();

// GET /api/messaging/conversations - Listar conversas do usuário
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { module } = req.query;

    // Verificar se o usuário tem plano ativo para o módulo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário tem plano ativo para o módulo solicitado
    if (module && !user.plans[module] || user.plans[module].status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    const conversations = await Conversation.findByUser(userId, module);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar conversas'
    });
  }
});

// GET /api/messaging/conversations/:id - Obter conversa específica
router.get('/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o usuário tem plano ativo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário tem pelo menos um plano ativo
    const hasActivePlan = Object.values(user.plans).some(plan => plan.status === 'active');
    if (!hasActivePlan) {
      return res.status(403).json({
        success: false,
        error: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email')
      .populate('listing.id');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversa não encontrada'
      });
    }

    // Verificar se o usuário é participante
    if (!conversation.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado'
      });
    }

    // Marcar mensagens como lidas
    await conversation.markAsRead(userId);

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar conversa'
    });
  }
});

// POST /api/messaging/conversations - Criar nova conversa
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { participants, listing, module, subject, initialMessage } = req.body;
    const senderId = req.user.id;

    if (!participants || !listing || !module || !subject || !initialMessage) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Verificar se o usuário tem plano ativo para o módulo
    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário tem plano ativo para o módulo
    if (!user.plans[module] || user.plans[module].status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Plano ativo necessário para enviar mensagens privadas'
      });
    }

    // Verificar se já existe uma conversa entre os participantes para este listing
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
      'listing.id': listing.id,
      'listing.type': listing.type,
      module,
      isActive: true
    });

    if (existingConversation) {
      // Adicionar mensagem à conversa existente
      await existingConversation.addMessage(senderId, initialMessage);
      
      return res.json({
        success: true,
        data: existingConversation,
        message: 'Mensagem adicionada à conversa existente'
      });
    }

    // Criar nova conversa
    const conversation = new Conversation({
      participants,
      listing,
      module,
      subject
    });

    // Adicionar mensagem inicial
    await conversation.addMessage(senderId, initialMessage);

    const savedConversation = await conversation.save();

    // Popular dados para retorno
    await savedConversation.populate('participants', 'name email');
    await savedConversation.populate('listing.id');

    res.status(201).json({
      success: true,
      data: savedConversation,
      message: 'Conversa criada com sucesso'
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar conversa'
    });
  }
});

// POST /api/messaging/conversations/:id/messages - Enviar mensagem
router.post('/conversations/:id/messages', authenticateToken, requireActivePlan('store'), async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Conteúdo da mensagem é obrigatório'
      });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversa não encontrada'
      });
    }

    // Verificar se o usuário é participante
    if (!conversation.participants.some(p => p.toString() === senderId)) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado'
      });
    }

    // Adicionar mensagem
    await conversation.addMessage(senderId, content, attachments || []);

    // Popular dados para retorno
    await conversation.populate('participants', 'name email');
    await conversation.populate('listing.id');

    res.json({
      success: true,
      data: conversation,
      message: 'Mensagem enviada com sucesso'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    });
  }
});

// PUT /api/messaging/conversations/:id/status - Atualizar status da conversa
router.put('/conversations/:id/status', authenticateToken, requireActivePlan('store'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['active', 'archived', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido'
      });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversa não encontrada'
      });
    }

    // Verificar se o usuário é participante
    if (!conversation.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado'
      });
    }

    conversation.status = status;
    await conversation.save();

    res.json({
      success: true,
      data: conversation,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status'
    });
  }
});

// GET /api/messaging/unread-count - Obter contador de mensagens não lidas
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findByUser(userId);
    let totalUnread = 0;

    conversations.forEach(conversation => {
      const unreadCount = conversation.unreadCount.get(userId.toString()) || 0;
      totalUnread += unreadCount;
    });

    res.json({
      success: true,
      data: { totalUnread }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contador de não lidas'
    });
  }
});

export default router;
