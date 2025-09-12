import express from 'express';
import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import AuditLog from '../models/AuditLog.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  requireProductMessagingAccess,
  requireFreightMessagingAccess
} from '../middleware/requirePaidAccess.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== VALIDAÇÃO DE DADOS =====

const validateConversationData = (req, res, next) => {
  const { serviceType, serviceId, participants } = req.body;

  if (!serviceType || !['product', 'freight'].includes(serviceType)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_service_type',
      message: 'Tipo de serviço deve ser "product" ou "freight"'
    });
  }

  if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_service_id',
      message: 'ID do serviço inválido'
    });
  }

  if (!participants || !Array.isArray(participants) || participants.length < 2) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_participants',
      message: 'Deve haver pelo menos 2 participantes'
    });
  }

  // Verificar se o usuário atual está nos participantes
  if (!participants.includes(req.user.userId)) {
    return res.status(400).json({
      ok: false,
      error: 'unauthorized_participant',
      message: 'Você deve ser um dos participantes da conversa'
    });
  }

  next();
};

const validateMessageData = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'empty_message',
      message: 'Mensagem não pode estar vazia'
    });
  }

  if (content.trim().length > 5000) {
    return res.status(400).json({
      ok: false,
      error: 'message_too_long',
      message: 'Mensagem deve ter no máximo 5000 caracteres'
    });
  }

  next();
};

// ===== ROTAS DE CONVERSAS =====

// GET /api/conversations - Listar conversas do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { serviceType, page = 1, limit = 20, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query
    const query = {
      participants: userId,
      status: { $ne: 'deleted' }
    };

    if (serviceType && ['product', 'freight'].includes(serviceType)) {
      query.serviceType = serviceType;
    }

    if (status && ['active', 'archived', 'closed', 'blocked'].includes(status)) {
      query.status = status;
    }

    // Buscar conversas
    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('participants', 'name email company.name')
      .populate('lastMessage.senderId', 'name email')
      .populate('serviceId', 'name title origin destination price images');

    // Contar total
    const total = await Conversation.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'conversations_listed',
      resource: 'conversation',
      resourceType: 'Conversation',
      details: `Listed ${conversations.length} conversations`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { serviceType, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        conversations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error listing conversations:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error listing conversations: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/conversations - Criar nova conversa
router.post('/', authenticateToken, validateConversationData, async (req, res) => {
  try {
    const { userId } = req.user;
    const { serviceType, serviceId, participants, title } = req.body;

    // Verificar se o serviço existe
    let service;
    if (serviceType === 'product') {
      service = await Product.findById(serviceId);
    } else {
      service = await Freight.findById(serviceId);
    }

    if (!service) {
      return res.status(404).json({
        ok: false,
        error: 'service_not_found',
        message: 'Serviço não encontrado'
      });
    }

    // Verificar se já existe conversa entre estes usuários para este serviço
    const existingConversation = await Conversation.findBetweenUsers(
      participants[0],
      participants[1],
      serviceId,
      serviceType
    );

    if (existingConversation) {
      return res.status(409).json({
        ok: false,
        error: 'conversation_exists',
        message: 'Conversa já existe para este serviço',
        data: { conversationId: existingConversation._id }
      });
    }

    // Criar conversa
    const conversation = await Conversation.createConversation(
      participants,
      serviceId,
      serviceType,
      title
    );

    // Populate dados
    await conversation.populate([
      { path: 'participants', select: 'name email company.name' },
      { path: 'serviceId', select: 'name title origin destination price images' }
    ]);

    // Log de criação
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'conversation_created',
      resource: 'conversation',
      resourceId: conversation._id,
      resourceType: 'Conversation',
      details: `Created conversation for ${serviceType} service`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { serviceType, serviceId, participants }
    });

    res.status(201).json({
      ok: true,
      message: 'Conversa criada com sucesso',
      data: { conversation }
    });
  } catch (error) {
    console.error('Error creating conversation:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error creating conversation: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/conversations/:id - Obter conversa específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const conversationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa inválido'
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name email company.name')
      .populate('serviceId', 'name title origin destination price images')
      .populate('lastMessage.senderId', 'name email');

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        error: 'conversation_not_found',
        message: 'Conversa não encontrada'
      });
    }

    // Verificar se o usuário é participante
    if (!conversation.participants.some(p => p._id.toString() === userId)) {
      await createSecurityLog(
        'unauthorized_access',
        'medium',
        "User attempted to access conversation they don't participate in",
        req,
        userId
      );

      return res.status(403).json({
        ok: false,
        error: 'access_denied',
        message: 'Acesso negado a esta conversa'
      });
    }

    // Log de acesso
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'conversation_accessed',
      resource: 'conversation',
      resourceId: conversationId,
      resourceType: 'Conversation',
      details: 'Accessed conversation details',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      ok: true,
      data: { conversation }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching conversation: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/conversations/:id - Atualizar conversa
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const conversationId = req.params.id;
    const { title, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa inválido'
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        error: 'conversation_not_found',
        message: 'Conversa não encontrada'
      });
    }

    // Verificar se o usuário é participante
    if (!conversation.participants.includes(userId)) {
      await createSecurityLog(
        'unauthorized_access',
        'medium',
        "User attempted to update conversation they don't participate in",
        req,
        userId
      );

      return res.status(403).json({
        ok: false,
        error: 'access_denied',
        message: 'Acesso negado a esta conversa'
      });
    }

    // Atualizar campos permitidos
    if (title !== undefined) {
      conversation.title = title;
    }
    if (status !== undefined && ['active', 'archived', 'closed'].includes(status)) {
      conversation.status = status;
    }

    await conversation.save();

    // Log de atualização
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'conversation_updated',
      resource: 'conversation',
      resourceId: conversationId,
      resourceType: 'Conversation',
      details: 'Updated conversation',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { title, status }
    });

    res.json({
      ok: true,
      message: 'Conversa atualizada com sucesso',
      data: { conversation }
    });
  } catch (error) {
    console.error('Error updating conversation:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error updating conversation: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE MENSAGENS =====

// GET /api/conversations/:id/messages - Listar mensagens de uma conversa
router.get('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const conversationId = req.params.id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa inválido'
      });
    }

    // Verificar se a conversa existe e se o usuário é participante
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        error: 'conversation_not_found',
        message: 'Conversa não encontrada'
      });
    }

    if (!conversation.participants.includes(userId)) {
      await createSecurityLog(
        'unauthorized_access',
        'medium',
        "User attempted to access messages from conversation they don't participate in",
        req,
        userId
      );

      return res.status(403).json({
        ok: false,
        error: 'access_denied',
        message: 'Acesso negado a esta conversa'
      });
    }

    // Buscar mensagens
    const messages = await Message.find({
      conversationId,
      status: { $ne: 'deleted' }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('senderId', 'name email company.name')
      .populate('receiverId', 'name email company.name');

    // Contar total
    const total = await Message.countDocuments({
      conversationId,
      status: { $ne: 'deleted' }
    });

    // Marcar mensagens como lidas se o usuário for o destinatário
    const unreadMessages = messages.filter(
      msg => msg.receiverId._id.toString() === userId && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { $set: { isRead: true, readAt: new Date() } }
      );
    }

    // Log de acesso
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'messages_accessed',
      resource: 'conversation',
      resourceId: conversationId,
      resourceType: 'Conversation',
      details: `Accessed ${messages.length} messages`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { page, limit, total, unreadCount: unreadMessages.length }
    });

    res.json({
      ok: true,
      data: {
        messages: messages.reverse(), // Ordem cronológica
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching messages: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/conversations/:id/messages - Enviar mensagem
router.post('/:id/messages', authenticateToken, validateMessageData, async (req, res) => {
  try {
    const { userId } = req.user;
    const conversationId = req.params.id;
    const { content, attachments = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa inválido'
      });
    }

    // Verificar se a conversa existe e se o usuário é participante
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        error: 'conversation_not_found',
        message: 'Conversa não encontrada'
      });
    }

    if (!conversation.participants.includes(userId)) {
      await createSecurityLog(
        'unauthorized_access',
        'medium',
        "User attempted to send message to conversation they don't participate in",
        req,
        userId
      );

      return res.status(403).json({
        ok: false,
        error: 'access_denied',
        message: 'Acesso negado a esta conversa'
      });
    }

    // Verificar se a conversa não está bloqueada
    if (conversation.status === 'blocked') {
      return res.status(403).json({
        ok: false,
        error: 'conversation_blocked',
        message: 'Esta conversa foi bloqueada'
      });
    }

    // Encontrar destinatário (outro participante)
    const recipientId = conversation.participants.find(p => p.toString() !== userId);

    // Criar mensagem
    const message = new Message({
      conversationId,
      senderId: userId,
      receiverId: recipientId,
      content: content.trim(),
      attachments,
      messageType: conversation.serviceType === 'product' ? 'product_inquiry' : 'freight_request',
      messagingCategory: conversation.serviceType === 'product' ? 'products' : 'freights'
    });

    await message.save();

    // Atualizar conversa
    await conversation.updateLastMessage(content, userId);
    conversation.unreadCount += 1;
    await conversation.save();

    // Populate dados da mensagem
    await message.populate([
      { path: 'senderId', select: 'name email company.name' },
      { path: 'receiverId', select: 'name email company.name' }
    ]);

    // Log de envio
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'message_sent',
      resource: 'conversation',
      resourceId: conversationId,
      resourceType: 'Conversation',
      details: 'Sent message in conversation',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        messageId: message._id,
        contentLength: content.length,
        attachmentsCount: attachments.length
      }
    });

    res.status(201).json({
      ok: true,
      message: 'Mensagem enviada com sucesso',
      data: { message }
    });
  } catch (error) {
    console.error('Error sending message:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error sending message: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE ESTATÍSTICAS =====

// GET /api/conversations/stats - Estatísticas das conversas
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const stats = await Conversation.getStats(userId);

    res.json({
      ok: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Error fetching conversation stats:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching conversation stats: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
