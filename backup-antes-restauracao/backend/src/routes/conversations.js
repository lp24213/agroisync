import express from 'express';
import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import d1Client from '../db/d1Client.js';
let useD1 = process.env.USE_D1 === 'true';
let ConversationDao, UserDao, ProductDao, FreightDao, MessageDao;
if (useD1) {
  // dynamic import of DAOs
   
  ConversationDao = require('../daos/ConversationDao.js');
   
  UserDao = require('../daos/UserDao.js');
   
  ProductDao = require('../daos/ProductDao.js');
   
  FreightDao = require('../daos/FreightDao.js');
   
  MessageDao = require('../daos/MessageDao.js');
}
import AuditLog from '../models/AuditLog.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  requireProductMessagingAccess,
  requireFreightMessagingAccess
} from '../middleware/requirePaidAccess.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== VALIDAÃ‡ÃƒO DE DADOS =====

const validateConversationData = (req, res, next) => {
  const { serviceType, serviceId, participants } = req.body;

  if (!serviceType || !['product', 'freight'].includes(serviceType)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_service_type',
      message: 'Tipo de serviÃ§o deve ser "product" ou "freight"'
    });
  }

  if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_service_id',
      message: 'ID do serviÃ§o invÃ¡lido'
    });
  }

  if (!participants || !Array.isArray(participants) || participants.length < 2) {
    return res.status(400).json({
      ok: false,
      error: 'invalid_participants',
      message: 'Deve haver pelo menos 2 participantes'
    });
  }

  // Verificar se o usuÃ¡rio atual estÃ¡ nos participantes
  if (!participants.includes(req.user.userId)) {
    return res.status(400).json({
      ok: false,
      error: 'unauthorized_participant',
      message: 'VocÃª deve ser um dos participantes da conversa'
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
      message: 'Mensagem nÃ£o pode estar vazia'
    });
  }

  if (content.trim().length > 5000) {
    return res.status(400).json({
      ok: false,
      error: 'message_too_long',
      message: 'Mensagem deve ter no mÃ¡ximo 5000 caracteres'
    });
  }

  next();
};

// ===== ROTAS DE CONVERSAS =====

// GET /api/conversations - Listar conversas do usuÃ¡rio
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { serviceType, page = 1, limit = 20, status } = req.query;

    const skip = (parseInt(page, 10, 10) - 1) * parseInt(limit, 10, 10);

    // If using D1 DAOs
    if (useD1 && ConversationDao) {
      const query = { participants: userId };
      if (serviceType && ['product', 'freight'].includes(serviceType)) query.type = serviceType;
      if (status && ['active', 'archived', 'closed', 'blocked'].includes(status))
        query.status = status;

      const all = await ConversationDao.find(query, { skip, limit: parseInt(limit, 10, 10) });
      const total = await ConversationDao.count(query);
      // naive pagination
      const conversations = all.slice(skip, skip + parseInt(limit, 10, 10));

      // Log de acesso (kept same)
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

      return res.json({
        ok: true,
        data: {
          conversations,
          pagination: {
            currentPage: parseInt(page, 10, 10),
            totalPages: Math.ceil(total / parseInt(limit, 10, 10)),
            totalItems: total,
            itemsPerPage: parseInt(limit, 10, 10)
          }
        }
      });
    }

    // Fallback: mongoose path
    const { userId: uid } = req.user;
    const { serviceType: st, page: p = 1, limit: l = 20, status: s } = req.query;
    const skipFallback = (parseInt(p, 10, 10) - 1) * parseInt(l, 10, 10);
    const query = {
      participants: uid,
      status: { $ne: 'deleted' }
    };
    if (st && ['product', 'freight'].includes(st)) query.serviceType = st;
    if (s && ['active', 'archived', 'closed', 'blocked'].includes(s)) query.status = s;

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip(skipFallback)
      .limit(parseInt(l, 10, 10))
      .populate('participants', 'name email company.name')
      .populate('lastMessage.senderId', 'name email')
      .populate('serviceId', 'name title origin destination price images');

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
          currentPage: parseInt(page, 10, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10, 10)
        }
      }
    });
  } catch (error) {
    logger.error('Error listing conversations:', error);
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

    // Verificar se o serviÃ§o existe
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
        message: 'ServiÃ§o nÃ£o encontrado'
      });
    }

    // Verificar se jÃ¡ existe conversa entre estes usuÃ¡rios para este serviÃ§o
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
        message: 'Conversa jÃ¡ existe para este serviÃ§o',
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

    // Log de criaÃ§Ã£o
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error creating conversation:', error);
    }
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

// GET /api/conversations/:id - Obter conversa especÃ­fica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const conversationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_id',
        message: 'ID da conversa invÃ¡lido'
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
        message: 'Conversa nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio Ã© participante
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching conversation:', error);
    }
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
        message: 'ID da conversa invÃ¡lido'
      });
    }

    if (useD1 && ConversationDao) {
      const conv = await ConversationDao.findById(conversationId);
      if (!conv)
        return res
          .status(404)
          .json({ ok: false, error: 'conversation_not_found', message: 'Conversa não encontrada' });

      if (!conv.participants.includes(userId)) {
        await createSecurityLog(
          'unauthorized_access',
          'medium',
          "User attempted to update conversation they don't participate in",
          req,
          userId
        );
        return res
          .status(403)
          .json({ ok: false, error: 'access_denied', message: 'Acesso negado a esta conversa' });
      }

      const updateObj = {};
      if (title !== undefined) updateObj.title = title;
      if (status !== undefined && ['active', 'archived', 'closed'].includes(status))
        updateObj.status = status;

      const updated = await ConversationDao.update(conversationId, updateObj);

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

      return res.json({
        ok: true,
        message: 'Conversa atualizada com sucesso',
        data: { conversation: updated }
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error updating conversation:', error);
    }
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

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

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
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Message.countDocuments({ conversationId });

    // Log de acesso
    await AuditLog.log({
      userId,
      userEmail: req.user.email,
      action: 'messages_listed',
      resource: 'conversation',
      resourceId: conversationId,
      resourceType: 'Conversation',
      details: `Listed ${messages.length} messages`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { page, limit, total }
    });

    return res.json({
      ok: true,
      data: {
        messages: messages.reverse(), // Ordem cronológica
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
      logger.error('Error fetching messages:', error);
    }
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
        message: 'ID da conversa invÃ¡lido'
      });
    }

    // If using D1 DAOs
    if (useD1 && MessageDao && ConversationDao) {
      const conversation = await ConversationDao.findById(conversationId);
      if (!conversation)
        return res
          .status(404)
          .json({ ok: false, error: 'conversation_not_found', message: 'Conversa não encontrada' });
      if (!conversation.participants.includes(userId)) {
        await createSecurityLog(
          'unauthorized_access',
          'medium',
          "User attempted to send message to conversation they don't participate in",
          req,
          userId
        );
        return res
          .status(403)
          .json({ ok: false, error: 'access_denied', message: 'Acesso negado a esta conversa' });
      }
      if (conversation.status === 'blocked')
        return res
          .status(403)
          .json({
            ok: false,
            error: 'conversation_blocked',
            message: 'Esta conversa foi bloqueada'
          });

      const recipientId = conversation.participants.find(p => p !== userId);

      const messageDoc = await MessageDao.createMessage({
        senderId: userId,
        content: content.trim(),
        type: 'text',
        related: conversationId
      });

      // Atualizar conversa: lastMessageAt, unreadCount
      await ConversationDao.update(conversationId, {
        lastMessageAt: new Date(),
        lastMessage: { senderId: userId, content: content.trim() }
      });
      await ConversationDao.incrementUnread(conversationId, 1);

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
          messageId: messageDoc._id,
          contentLength: content.length,
          attachmentsCount: attachments.length
        }
      });

      return res
        .status(201)
        .json({ ok: true, message: 'Mensagem enviada com sucesso', data: { message: messageDoc } });
    }

    // Fallback mongoose path
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error sending message:', error);
    }
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

// ===== ROTAS DE ESTATÃSTICAS =====

// GET /api/conversations/stats - EstatÃ­sticas das conversas
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const stats = await Conversation.getStats(userId);

    res.json({
      ok: true,
      data: { stats }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching conversation stats:', error);
    }
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
