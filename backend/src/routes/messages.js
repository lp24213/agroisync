import express from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { authenticateToken, requireActivePlan, requireMessagingAccess } from '../middleware/auth.js';
import { validateMessage } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE VALIDAÇÃO =====

// Validação específica para mensagens
const validateMessageData = (req, res, next) => {
  const { subject, content, receiverId, messageType } = req.body;
  
  if (!subject || !content || !receiverId) {
    return res.status(400).json({
      success: false,
      message: 'Assunto, conteúdo e destinatário são obrigatórios'
    });
  }

  if (subject.trim().length < 3 || subject.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Assunto deve ter entre 3 e 200 caracteres'
    });
  }

  if (content.trim().length < 10 || content.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Conteúdo deve ter entre 10 e 5000 caracteres'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({
      success: false,
      message: 'ID do destinatário inválido'
    });
  }

  next();
};

// ===== ROTAS DE MENSAGENS PRIVADAS =====

// GET /api/messages - Listar mensagens do usuário (conversas) - REQUER PLANO ATIVO
router.get('/', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar conversas do usuário
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
          status: { $ne: 'deleted' }
        }
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId']
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          },
          totalMessages: { $sum: 1 }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Populate user information
    const populatedConversations = await Message.populate(conversations, [
      { path: '_id', select: 'name company.name email' },
      { path: 'lastMessage.senderId', select: 'name company.name email' },
      { path: 'lastMessage.receiverId', select: 'name company.name email' }
    ]);

    // Contar total de conversas
    const totalConversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
          status: { $ne: 'deleted' }
        }
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId']
          }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const total = totalConversations[0]?.total || 0;

    // Log de segurança
    await createSecurityLog('data_access', 'low', 'User accessed messages list', req, userId);

    res.json({
      success: true,
      data: {
        conversations: populatedConversations,
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
    
    // Log de erro de segurança
    await createSecurityLog('system_error', 'high', `Error fetching messages: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/conversation/:otherUserId - Obter conversa com usuário específico
router.get('/conversation/:otherUserId', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const otherUserId = req.params.otherUserId;
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validar ID do outro usuário
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário inválido'
      });
    }

    // Verificar se o outro usuário existe
    const otherUser = await User.findById(otherUserId).select('name email company.name');
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar mensagens da conversa
    const messages = await Message.getConversation(userId, otherUserId, parseInt(limit), skip);

    // Contar total de mensagens na conversa
    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ],
      status: { $ne: 'deleted' }
    });

    // Log de segurança
    await createSecurityLog('data_access', 'low', 'User accessed conversation', req, userId, { otherUserId });

    res.json({
      success: true,
      data: {
        messages,
        otherUser,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / parseInt(limit)),
          totalItems: totalMessages,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    
    await createSecurityLog('system_error', 'high', `Error fetching conversation: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/messages - Enviar nova mensagem
router.post('/', authenticateToken, requireMessagingAccess, validateMessageData, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { receiverId, subject, content, messageType, relatedProduct, relatedFreight, priority, tags } = req.body;

    // Verificar se o destinatário existe
    const receiver = await User.findById(receiverId).select('name email company.name');
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Destinatário não encontrado'
      });
    }

    // Verificar se não está enviando para si mesmo
    if (userId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível enviar mensagem para si mesmo'
      });
    }

    // Criar mensagem
    const message = new Message({
      senderId: userId,
      receiverId,
      subject: subject.trim(),
      content: content.trim(),
      messageType: messageType || 'general',
      relatedProduct,
      relatedFreight,
      priority: priority || 'normal',
      tags: tags || []
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate([
      { path: 'senderId', select: 'name company.name email' },
      { path: 'receiverId', select: 'name company.name email' }
    ]);

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'User sent message', req, userId, { receiverId, messageId: message._id });

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: { message }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    
    await createSecurityLog('system_error', 'high', `Error sending message: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/:id - Obter mensagem específica
router.get('/:id', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await Message.findById(messageId)
      .populate('senderId', 'name company.name email')
      .populate('receiverId', 'name company.name email')
      .populate('relatedProduct', 'name price images')
      .populate('relatedFreight', 'origin destination price');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário tem acesso à mensagem
    if (message.senderId._id.toString() !== userId && message.receiverId._id.toString() !== userId) {
      await createSecurityLog('unauthorized_access', 'medium', 'User attempted to access message they don\'t own', req, userId, { messageId });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Marcar como lida se o usuário for o destinatário
    if (message.receiverId._id.toString() === userId && !message.isRead) {
      await message.markAsRead();
    }

    // Log de segurança
    await createSecurityLog('data_access', 'low', 'User accessed message', req, userId, { messageId });

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    
    await createSecurityLog('system_error', 'high', `Error fetching message: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messages/:id/read - Marcar mensagem como lida
router.put('/:id/read', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário é o destinatário
    if (message.receiverId.toString() !== userId) {
      await createSecurityLog('unauthorized_access', 'medium', 'User attempted to mark message as read without permission', req, userId, { messageId });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    await message.markAsRead();

    // Log de segurança
    await createSecurityLog('data_modification', 'low', 'User marked message as read', req, userId, { messageId });

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    
    await createSecurityLog('system_error', 'high', `Error marking message as read: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messages/:id - Atualizar mensagem
router.put('/:id', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;
    const { subject, content, priority, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário é o remetente
    if (message.senderId.toString() !== userId) {
      await createSecurityLog('unauthorized_access', 'medium', 'User attempted to edit message they don\'t own', req, userId, { messageId });
      
      return res.status(403).json({
        success: false,
        message: 'Apenas o remetente pode editar a mensagem'
      });
    }

    // Verificar se a mensagem pode ser editada (não lida pelo destinatário)
    if (message.isRead) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível editar mensagens já lidas'
      });
    }

    // Atualizar campos permitidos
    if (subject) message.subject = subject.trim();
    if (content) message.content = content.trim();
    if (priority) message.priority = priority;
    if (tags) message.tags = tags;

    await message.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'User edited message', req, userId, { messageId });

    res.json({
      success: true,
      message: 'Mensagem atualizada com sucesso',
      data: { message }
    });
  } catch (error) {
    console.error('Error updating message:', error);
    
    await createSecurityLog('system_error', 'high', `Error updating message: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/messages/:id - Excluir mensagem
router.delete('/:id', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário tem permissão para excluir
    if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
      await createSecurityLog('unauthorized_access', 'medium', 'User attempted to delete message they don\'t own', req, userId, { messageId });
      
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Soft delete - marcar como excluída
    message.status = 'deleted';
    await message.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'User deleted message', req, userId, { messageId });

    res.json({
      success: true,
      message: 'Mensagem excluída com sucesso'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    
    await createSecurityLog('system_error', 'high', `Error deleting message: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/unread/count - Contar mensagens não lidas
router.get('/unread/count', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
      status: { $nin: ['deleted', 'archived'] }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/search - Buscar mensagens por texto
router.get('/search/:term', authenticateToken, requireMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.params.term;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Termo de busca deve ter pelo menos 2 caracteres'
      });
    }

    const messages = await Message.searchMessages(userId, searchTerm.trim(), parseInt(limit));
    const total = messages.length;

    // Log de segurança
    await createSecurityLog('data_access', 'low', 'User searched messages', req, userId, { searchTerm });

    res.json({
      success: true,
      data: {
        messages: messages.slice(skip, skip + parseInt(limit)),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    
    await createSecurityLog('system_error', 'high', `Error searching messages: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
