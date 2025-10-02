import express from 'express';
import mongoose from 'mongoose';
import PartnershipMessage from '../models/PartnershipMessage.js';
import Partner from '../models/Partner.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import { sanitizeInput } from '../utils/sanitizer.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE VALIDAÇÃO =====

// Validação para mensagens de parceiros
const validatePartnershipMessage = (req, res, next) => {
  const { partnerId, subject, content, messageType, category, priority } = req.body;

  if (!partnerId || !subject || !content) {
    return res.status(400).json({
      success: false,
      message: 'ID do parceiro, assunto e conteúdo são obrigatórios'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    return res.status(400).json({
      success: false,
      message: 'ID do parceiro inválido'
    });
  }

  if (subject.trim().length < 5 || subject.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Assunto deve ter entre 5 e 200 caracteres'
    });
  }

  if (content.trim().length < 10 || content.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Conteúdo deve ter entre 10 e 5000 caracteres'
    });
  }

  // Validar tipo de mensagem
  const validMessageTypes = [
    'partnership_request',
    'business_proposal',
    'collaboration',
    'support',
    'general',
    'urgent'
  ];
  if (messageType && !validMessageTypes.includes(messageType)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de mensagem inválido'
    });
  }

  // Validar categoria
  const validCategories = [
    'agriculture',
    'technology',
    'finance',
    'logistics',
    'marketing',
    'research',
    'other'
  ];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Categoria inválida'
    });
  }

  // Validar prioridade
  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Prioridade inválida'
    });
  }

  next();
};

// ===== ROTAS DE MENSAGENS DE PARCEIROS =====

// GET /api/partnership-messages - Listar mensagens de parceiros (admin apenas)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category, partnerId, assignedTo } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};

    // Filtros
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (category) {
      query.category = category;
    }
    if (partnerId) {
      query.partnerId = partnerId;
    }
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const messages = await PartnershipMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('partnerId', 'name company category')
      .populate('assignedTo', 'name email')
      .populate('readBy', 'name email')
      .populate('repliedBy', 'name email');

    const total = await PartnershipMessage.countDocuments(query);

    // Log de acesso
    await createSecurityLog(
      'admin_action',
      'low',
      'Admin accessed partnership messages',
      req,
      req.user.userId
    );

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching partnership messages:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching partnership messages: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/partnership-messages - Criar nova mensagem de parceiro
router.post('/', authenticateToken, requireAdmin, validatePartnershipMessage, async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { partnerId, subject, content, messageType, category, priority, tags, assignedTo } =
      req.body;

    // Verificar se o parceiro existe
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    // Criar mensagem
    const message = new PartnershipMessage({
      partnerId,
      subject: sanitizeInput(subject.trim()),
      content: sanitizeInput(content.trim()),
      messageType: messageType || 'general',
      category: category || 'other',
      priority: priority || 'normal',
      tags: tags || [],
      assignedTo: assignedTo || adminId
    });

    await message.save();

    // Populate informações
    await message.populate([
      { path: 'partnerId', select: 'name company category' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    // Log de criação
    await createSecurityLog(
      'admin_action',
      'medium',
      'Admin created partnership message',
      req,
      adminId,
      {
        partnerId,
        messageId: message._id,
        messageType
      }
    );

    res.status(201).json({
      success: true,
      message: 'Mensagem de parceiro criada com sucesso',
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating partnership message:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error creating partnership message: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partnership-messages/:id - Obter mensagem específica
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await PartnershipMessage.findById(messageId)
      .populate('partnerId', 'name company category contact')
      .populate('assignedTo', 'name email')
      .populate('readBy', 'name email')
      .populate('repliedBy', 'name email')
      .populate('flaggedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Log de acesso
    await createSecurityLog(
      'admin_action',
      'low',
      'Admin accessed specific partnership message',
      req,
      req.user.userId,
      {
        messageId
      }
    );

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching partnership message:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching partnership message: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/partnership-messages/:id - Atualizar mensagem
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminId = req.user.userId;
    const messageId = req.params.id;
    const { subject, content, messageType, category, priority, tags, adminNotes, assignedTo } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await PartnershipMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Atualizar campos permitidos
    if (subject) {
      message.subject = sanitizeInput(subject.trim());
    }
    if (content) {
      message.content = sanitizeInput(content.trim());
    }
    if (messageType) {
      message.messageType = messageType;
    }
    if (category) {
      message.category = category;
    }
    if (priority) {
      message.priority = priority;
    }
    if (tags) {
      message.tags = tags;
    }
    if (adminNotes) {
      message.adminNotes = sanitizeInput(adminNotes.trim());
    }
    if (assignedTo) {
      message.assignedTo = assignedTo;
    }

    await message.save();

    // Log de atualização
    await createSecurityLog(
      'admin_action',
      'medium',
      'Admin updated partnership message',
      req,
      adminId,
      {
        messageId,
        updatedFields: Object.keys(req.body)
      }
    );

    res.json({
      success: true,
      message: 'Mensagem atualizada com sucesso',
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating partnership message:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error updating partnership message: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/partnership-messages/:id/status - Atualizar status da mensagem
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminId = req.user.userId;
    const messageId = req.params.id;
    const { status, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await PartnershipMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Executar ação baseada no status
    switch (action) {
      case 'mark_read':
        await message.markAsRead(adminId);
        break;
      case 'mark_in_progress':
        await message.markInProgress(adminId);
        break;
      case 'reply':
        if (!req.body.replyContent) {
          return res.status(400).json({
            success: false,
            message: 'Conteúdo da resposta é obrigatório'
          });
        }
        await message.reply(req.body.replyContent, adminId);
        break;
      case 'close':
        await message.close(adminId);
        break;
      case 'archive':
        await message.archive(adminId);
        break;
      case 'flag':
        if (!req.body.flagReason) {
          return res.status(400).json({
            success: false,
            message: 'Motivo da sinalização é obrigatório'
          });
        }
        await message.flag(req.body.flagReason, adminId);
        break;
      case 'unflag':
        await message.unflag();
        break;
      default:
        if (status) {
          message.status = status;
          await message.save();
        }
    }

    // Log de ação
    await createSecurityLog(
      'admin_action',
      'medium',
      `Admin performed action on partnership message: ${action}`,
      req,
      adminId,
      {
        messageId,
        action,
        newStatus: message.status
      }
    );

    res.json({
      success: true,
      message: 'Ação executada com sucesso',
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating partnership message status:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error updating partnership message status: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/partnership-messages/:id - Excluir mensagem
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminId = req.user.userId;
    const messageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da mensagem inválido'
      });
    }

    const message = await PartnershipMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Soft delete - marcar como arquivada
    message.status = 'archived';
    message.assignedTo = adminId;
    message.assignedAt = new Date();
    await message.save();

    // Log de exclusão
    await createSecurityLog(
      'admin_action',
      'medium',
      'Admin archived partnership message',
      req,
      adminId,
      {
        messageId
      }
    );

    res.json({
      success: true,
      message: 'Mensagem arquivada com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error archiving partnership message:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error archiving partnership message: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partnership-messages/stats - Estatísticas das mensagens
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await PartnershipMessage.getMessageStats();

    // Contar mensagens por prioridade
    const priorityStats = await PartnershipMessage.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Contar mensagens por categoria
    const categoryStats = await PartnershipMessage.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Contar mensagens não lidas
    const unreadCount = await PartnershipMessage.countDocuments({
      isRead: false,
      status: { $nin: ['closed', 'archived'] }
    });

    // Log de acesso às estatísticas
    await createSecurityLog(
      'admin_action',
      'low',
      'Admin accessed partnership messages statistics',
      req,
      req.user.userId
    );

    res.json({
      success: true,
      data: {
        statusStats: stats,
        priorityStats: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        categoryStats: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        unreadCount
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching partnership messages stats:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error fetching partnership messages stats: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partnership-messages/search/:term - Buscar mensagens
router.get('/search/:term', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Termo de busca deve ter pelo menos 2 caracteres'
      });
    }

    const messages = await PartnershipMessage.searchMessages(
      searchTerm.trim(),
      parseInt(limit, 10)
    );
    const total = messages.length;

    // Log de busca
    await createSecurityLog(
      'admin_action',
      'low',
      'Admin searched partnership messages',
      req,
      req.user.userId,
      {
        searchTerm
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.slice(skip, skip + parseInt(limit, 10)),
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error searching partnership messages:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error searching partnership messages: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
