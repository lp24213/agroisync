import express from 'express';
import PrivateMessage from '../models/PrivateMessage.js';
import ContactMessage from '../models/ContactMessage.js';
import PartnershipMessage from '../models/PartnershipMessage.js';
import User from '../models/User.js';
import { validateMessage } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, requireActivePlan } from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== PRIVATE MESSAGES (requires active subscription) =====

// GET /api/messaging/conversations - Get user's conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if user has any active plan
    const user = await User.findById(userId);
    if (!user.hasActivePlan('store') && !user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    // Get conversations (simplified - you might want to implement a more sophisticated approach)
    const conversations = await PrivateMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
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
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user information
    const populatedConversations = await PrivateMessage.populate(conversations, [
      { path: '_id', select: 'name company.name' },
      { path: 'lastMessage.senderId', select: 'name company.name' },
      { path: 'lastMessage.receiverId', select: 'name company.name' }
    ]);

    res.json({
      success: true,
      data: { conversations: populatedConversations }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messaging/conversation/:otherUserId - Get conversation with specific user
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { otherUserId } = req.params;

    // Check if user has any active plan
    const user = await User.findById(userId);
    if (!user.hasActivePlan('store') && !user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    const messages = await PrivateMessage.getConversation(userId, otherUserId, 100);

    res.json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/messaging/send - Send private message
router.post('/send', authenticateToken, validateMessage, async (req, res) => {
  try {
    const { userId } = req.user;
    const { receiverId, subject, content, messageType, relatedProduct, relatedFreight } = req.body;

    // Check if user has any active plan
    const user = await User.findById(userId);
    if (!user.hasActivePlan('store') && !user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para enviar mensagens privadas'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Destinatário não encontrado'
      });
    }

    // Create message
    const message = new PrivateMessage({
      senderId: userId,
      receiverId,
      subject,
      content,
      messageType: messageType || 'general',
      relatedProduct,
      relatedFreight
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate([
      { path: 'senderId', select: 'name company.name' },
      { path: 'receiverId', select: 'name company.name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: { message }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messaging/:messageId/read - Mark message as read
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { messageId } = req.params;

    // Check if user has any active plan
    const user = await User.findById(userId);
    if (!user.hasActivePlan('store') && !user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    const message = await PrivateMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Check if user is the receiver
    if (message.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messaging/unread - Get unread messages count
router.get('/unread', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if user has any active plan
    const user = await User.findById(userId);
    if (!user.hasActivePlan('store') && !user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano ativo necessário para acessar mensagens privadas'
      });
    }

    const unreadMessages = await PrivateMessage.getUnreadMessages(userId);
    const unreadCount = unreadMessages.length;

    res.json({
      success: true,
      data: { unreadCount, unreadMessages }
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== CONTACT FORM (public, goes to admin) =====

// POST /api/messaging/contact - Send contact message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem deve ter pelo menos 10 caracteres'
      });
    }

    // Create contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Mensagem de contato enviada com sucesso'
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== PARTNERSHIP INQUIRIES (public, goes to admin) =====

// POST /api/messaging/partnership - Send partnership inquiry
router.post('/partnership', async (req, res) => {
  try {
    const { company, contactPerson, email, phone, partnershipType, description } = req.body;

    // Basic validation
    if (!company || !contactPerson || !email || !partnershipType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Descrição deve ter pelo menos 20 caracteres'
      });
    }

    // Create partnership message
    const partnershipMessage = new PartnershipMessage({
      company,
      contactPerson,
      email,
      phone,
      partnershipType,
      description
    });

    await partnershipMessage.save();

    res.status(201).json({
      success: true,
      message: 'Solicitação de parceria enviada com sucesso'
    });
  } catch (error) {
    console.error('Error sending partnership inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ADMIN ROUTES (protected) =====

// GET /api/messaging/admin/contact - Get contact messages (admin only)
router.get('/admin/contact', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Privilégios de administrador necessários.'
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};
    if (status) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await ContactMessage.countDocuments(query);

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
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messaging/admin/partnership - Get partnership messages (admin only)
router.get('/admin/partnership', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Privilégios de administrador necessários.'
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};
    if (status) {
      query.status = status;
    }

    const messages = await PartnershipMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await PartnershipMessage.countDocuments(query);

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
    console.error('Error fetching partnership messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messaging/admin/private - Get private messages (admin only)
router.get('/admin/private', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Privilégios de administrador necessários.'
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};
    if (status) {
      query.status = status;
    }

    const messages = await PrivateMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('senderId', 'name email company.name')
      .populate('receiverId', 'name email company.name')
      .lean();

    const total = await PrivateMessage.countDocuments(query);

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
    console.error('Error fetching private messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messaging/admin/contact/:id/status - Update contact message status (admin only)
router.put('/admin/contact/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Privilégios de administrador necessários.'
      });
    }

    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    if (status === 'replied' && adminResponse) {
      message.adminResponse = adminResponse;
      message.repliedAt = new Date();
      message.repliedBy = req.user.userId;
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      message: 'Status da mensagem atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating contact message status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messaging/admin/partnership/:id/status - Update partnership message status (admin only)
router.put('/admin/partnership/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Privilégios de administrador necessários.'
      });
    }

    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const message = await PartnershipMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    if (status === 'contacted' && adminResponse) {
      message.adminResponse = adminResponse;
      message.contactedAt = new Date();
      message.contactedBy = req.user.userId;
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      message: 'Status da mensagem atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating partnership message status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
