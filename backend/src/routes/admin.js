import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Product } from '../models/Product.js';
import { Freight } from '../models/Freight.js';
import { Payment } from '../models/Payment.js';
import { AuditLog } from '../models/AuditLog.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';

const router = express.Router();

// Apply rate limiting mais restritivo para admin
router.use(apiLimiter);
router.use(requireAdmin);

// ===== MIDDLEWARE DE VALIDAÇÃO ADMIN =====

const validateAdminAction = (req, res, next) => {
  const { action, reason } = req.body;
  
  if (!action || !reason) {
    return res.status(400).json({
      ok: false,
      error: 'missing_fields',
      message: 'Ação e motivo são obrigatórios para operações administrativas'
    });
  }

  if (reason.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_reason',
      message: 'Motivo deve ter pelo menos 10 caracteres'
    });
  }

  next();
};

// ===== ROTAS ADMINISTRATIVAS =====

// GET /admin/dashboard - Dashboard principal do admin
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // Estatísticas gerais
    const stats = await Promise.all([
      User.countDocuments(),
      Conversation.countDocuments(),
      Message.countDocuments(),
      Product.countDocuments(),
      Freight.countDocuments(),
      Payment.countDocuments(),
      AuditLog.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }) // Últimas 24h
    ]);

    // Atividades recentes
    const recentActivities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email')
      .populate('resourceId');

    // Logs suspeitos
    const suspiciousLogs = await AuditLog.find({ isSuspicious: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    // Log de acesso ao dashboard
    await AuditLog.log({
      userId: userId,
      userEmail: userEmail,
      action: 'admin_dashboard_accessed',
      resource: 'admin',
      resourceType: 'Admin',
      details: 'Accessed admin dashboard',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { stats: stats.join(',') }
    });

    res.json({
      ok: true,
      data: {
        stats: {
          totalUsers: stats[0],
          totalConversations: stats[1],
          totalMessages: stats[2],
          totalProducts: stats[3],
          totalFreights: stats[4],
          totalPayments: stats[5],
          activitiesLast24h: stats[6]
        },
        recentActivities,
        suspiciousLogs
      }
    });
  } catch (error) {
    console.error('Error accessing admin dashboard:', error);
    
    await createSecurityLog('system_error', 'high', `Admin dashboard error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/conversations - Todas as conversas (com filtros)
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50, serviceType, status, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (serviceType && ['product', 'freight'].includes(serviceType)) {
      query.serviceType = serviceType;
    }
    
    if (status && ['active', 'archived', 'closed', 'blocked'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'participants.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar conversas
    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('participants', 'name email company.name')
      .populate('serviceId', 'name title origin destination price');

    // Contar total
    const total = await Conversation.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_conversations_listed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Listed ${conversations.length} conversations`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { serviceType, status, search, page, limit, total }
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
    console.error('Error listing admin conversations:', error);
    
    await createSecurityLog('system_error', 'high', `Admin conversations error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/conversations/:id/messages - Mensagens de uma conversa específica
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa inválido'
      });
    }

    // Buscar conversa
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name email company.name')
      .populate('serviceId', 'name title origin destination price');

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        error: 'conversation_not_found',
        message: 'Conversa não encontrada'
      });
    }

    // Buscar mensagens
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email company.name')
      .populate('receiverId', 'name email company.name');

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_conversation_messages_accessed',
      resource: 'admin',
      resourceId: conversationId,
      resourceType: 'Admin',
      details: `Accessed ${messages.length} messages from conversation`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      ok: true,
      data: {
        conversation,
        messages: messages.reverse() // Ordem cronológica
      }
    });
  } catch (error) {
    console.error('Error accessing admin conversation messages:', error);
    
    await createSecurityLog('system_error', 'high', `Admin conversation messages error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/users - Listar usuários
router.get('/users', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50, status, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (status && ['active', 'inactive', 'banned'].includes(status)) {
      query.isActive = status === 'active';
      if (status === 'banned') query.isBanned = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar usuários
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await User.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_users_listed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Listed ${users.length} users`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { status, search, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error listing admin users:', error);
    
    await createSecurityLog('system_error', 'high', `Admin users error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
 });

// PUT /admin/users/:id - Atualizar usuário (banir/desbanir, etc.)
router.put('/users/:id', validateAdminAction, async (req, res) => {
  try {
    const adminUserId = req.user.userId;
    const targetUserId = req.params.id;
    const { action, reason, fields } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID do usuário inválido'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        ok: false,
        error: 'user_not_found',
        message: 'Usuário não encontrado'
      });
    }

    // Executar ação
    let updateData = {};
    let actionDetails = '';

    switch (action) {
      case 'ban':
        updateData = { isBanned: true, isActive: false, bannedAt: new Date(), banReason: reason };
        actionDetails = 'User banned';
        break;
      case 'unban':
        updateData = { isBanned: false, isActive: true, bannedAt: undefined, banReason: undefined };
        actionDetails = 'User unbanned';
        break;
      case 'deactivate':
        updateData = { isActive: false, deactivatedAt: new Date(), deactivationReason: reason };
        actionDetails = 'User deactivated';
        break;
      case 'activate':
        updateData = { isActive: true, deactivatedAt: undefined, deactivationReason: undefined };
        actionDetails = 'User activated';
        break;
      case 'update':
        if (fields && typeof fields === 'object') {
          updateData = fields;
          actionDetails = 'User updated';
        }
        break;
      default:
        return res.status(400).json({
          ok: false,
          error: 'invalid_action',
          message: 'Ação inválida'
        });
    }

    // Atualizar usuário
    await User.findByIdAndUpdate(targetUserId, updateData);

    // Log da ação administrativa
    await AuditLog.log({
      userId: adminUserId,
      userEmail: req.user.email,
      action: 'admin_user_action',
      resource: 'user',
      resourceId: targetUserId,
      resourceType: 'User',
      details: `${actionDetails}: ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { action, reason, targetUserEmail: targetUser.email, updateData }
    });

    res.json({
      ok: true,
      message: 'Usuário atualizado com sucesso',
      data: { action, reason, userId: targetUserId }
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    
    await createSecurityLog('system_error', 'high', `Admin user update error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/products - Listar produtos
router.get('/products', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50, status, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar produtos
    const products = await Product.find(query)
      .populate('ownerId', 'name email company.name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Product.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_products_listed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Listed ${products.length} products`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { status, search, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error listing admin products:', error);
    
    await createSecurityLog('system_error', 'high', `Admin products error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/freights - Listar fretes
router.get('/freights', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50, status, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (status && ['active', 'inactive', 'completed'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { origin: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar fretes
    const freights = await Freight.find(query)
      .populate('ownerId', 'name email company.name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Freight.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_freights_listed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Listed ${freights.length} freights`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { status, search, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        freights,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error listing admin freights:', error);
    
    await createSecurityLog('system_error', 'high', `Admin freights error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/payments - Listar pagamentos
router.get('/payments', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50, status, provider, startDate, endDate } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (status && ['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      query.status = status;
    }
    
    if (provider && ['stripe', 'metamask', 'crypto'].includes(provider)) {
      query.provider = provider;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Buscar pagamentos
    const payments = await Payment.find(query)
      .populate('userId', 'name email company.name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Payment.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_payments_listed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Listed ${payments.length} payments`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { status, provider, startDate, endDate, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error listing admin payments:', error);
    
    await createSecurityLog('system_error', 'high', `Admin payments error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// GET /admin/auditlogs - Logs de auditoria
router.get('/auditlogs', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 100, action, resource, userId: targetUserId, startDate, endDate, suspicious } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = {};
    
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (targetUserId) query.userId = targetUserId;
    if (suspicious === 'true') query.isSuspicious = true;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Buscar logs
    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await AuditLog.countDocuments(query);

    // Log de acesso
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_auditlogs_accessed',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Accessed ${logs.length} audit logs`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { action, resource, targetUserId, startDate, endDate, suspicious, page, limit, total }
    });

    res.json({
      ok: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error accessing admin audit logs:', error);
    
    await createSecurityLog('system_error', 'high', `Admin audit logs error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

// POST /admin/export - Exportar dados (CSV)
router.post('/export', validateAdminAction, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dataType, filters, format = 'csv' } = req.body;

    if (!['users', 'conversations', 'messages', 'products', 'freights', 'payments', 'auditlogs'].includes(dataType)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_data_type',
        message: 'Tipo de dados inválido para exportação'
      });
    }

    // Log da tentativa de exportação
    await AuditLog.log({
      userId: userId,
      userEmail: req.user.email,
      action: 'admin_export_attempted',
      resource: 'admin',
      resourceType: 'Admin',
      details: `Export attempt for ${dataType}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { dataType, filters, format }
    });

    // Por enquanto, retornar sucesso (implementar exportação real depois)
    res.json({
      ok: true,
      message: 'Exportação solicitada com sucesso',
      data: { 
        dataType, 
        format, 
        status: 'queued',
        estimatedTime: '5-10 minutos'
      }
    });
  } catch (error) {
    console.error('Error requesting admin export:', error);
    
    await createSecurityLog('system_error', 'high', `Admin export error: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
