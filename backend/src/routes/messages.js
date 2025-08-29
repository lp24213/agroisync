import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { requirePaidAccess } from "../middleware/requirePaidAccess.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import AuditLog from "../models/AuditLog.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Freight from "../models/Freight.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Middleware para verificar se o usuário tem acesso à mensageria
const checkMessagingAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Verificar se o usuário tem plano ativo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // Verificar se tem plano ativo ou pagamento recente
    const hasActivePlan = user.subscriptions && (
      (user.subscriptions.store && user.subscriptions.store.status === 'active') ||
      (user.subscriptions.agroconecta && user.subscriptions.agroconecta.status === 'active')
    );

    // Verificar pagamentos recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPayment = await Payment.findOne({
      userId: userId,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (!hasActivePlan && !recentPayment) {
      return res.status(403).json({
        success: false,
        message: "🔒 Para acessar esta mensageria, finalize o pagamento de sua assinatura.",
        requiresPayment: true,
        plans: {
          store: "R$25/mês - Mensageria de Produtos",
          agroconecta: "R$50/mês - Mensageria de Fretes"
        }
      });
    }

    req.userHasAccess = true;
    next();
  } catch (error) {
    console.error('Erro ao verificar acesso à mensageria:', error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// ===== ROTAS DE MENSAGERIA =====

// POST /api/messages - Enviar mensagem
router.post("/", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { destinatarioId, tipo, servicoId, conteudo } = req.body;
    const remetenteId = req.user.id;

    // Validações
    if (!destinatarioId || !tipo || !servicoId || !conteudo) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios"
      });
    }

    if (!['product', 'freight'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo deve ser 'product' ou 'freight'"
      });
    }

    if (conteudo.trim().length === 0 || conteudo.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Conteúdo deve ter entre 1 e 2000 caracteres"
      });
    }

    // Verificar se o destinatário existe
    const destinatario = await User.findById(destinatarioId);
    if (!destinatario) {
      return res.status(404).json({
        success: false,
        message: "Destinatário não encontrado"
      });
    }

    // Verificar se o serviço existe e é do tipo correto
    let servico;
    if (tipo === 'product') {
      servico = await Product.findById(servicoId);
    } else {
      servico = await Freight.findById(servicoId);
    }

    if (!servico) {
      return res.status(404).json({
        success: false,
        message: "Serviço não encontrado"
      });
    }

    // Verificar se o usuário tem permissão para enviar mensagem para este serviço
    if (tipo === 'product' && servico.ownerId.toString() !== destinatarioId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para enviar mensagem para este produto"
      });
    }

    if (tipo === 'freight' && servico.ownerId.toString() !== destinatarioId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para enviar mensagem para este frete"
      });
    }

    // Criar metadados baseados no tipo
    const metadata = {};
    if (tipo === 'product') {
      metadata.productTitle = servico.title;
      metadata.productPrice = servico.price;
    } else {
      metadata.freightOrigin = servico.origin;
      metadata.freightDestination = servico.destination;
      metadata.freightPrice = servico.price;
    }

    // Criar a mensagem
    const message = new Message({
      remetente: remetenteId,
      destinatario: destinatarioId,
      conteudo: conteudo.trim(),
      tipo: tipo,
      servico_id: servicoId,
      metadata: metadata,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await message.save();

    // Log da ação
    await AuditLog.logAction({
      userId: remetenteId,
      userEmail: req.user.email,
      action: 'MESSAGE_SENT',
      resource: 'message',
      resourceId: message._id,
      details: `Message sent to ${destinatario.email} about ${tipo} service`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Populate dados para retorno
    await message.populate('remetente', 'name email');
    await message.populate('destinatario', 'name email');

    res.status(201).json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: message
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'MESSAGE_SEND_ERROR',
      resource: 'message',
      details: `Error sending message: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'SEND_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/messages - Listar mensagens do usuário
router.get("/", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, servicoId, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Construir query
    let query = {
      $or: [
        { remetente: userId },
        { destinatario: userId }
      ],
      deletedAt: { $exists: false }
    };

    if (tipo) {
      query.tipo = tipo;
    }

    if (servicoId) {
      query.servico_id = servicoId;
    }

    // Buscar mensagens
    const messages = await Message.find(query)
      .populate('remetente', 'name email')
      .populate('destinatario', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Message.countDocuments(query);

    // Log da ação
    await AuditLog.logAction({
      userId: userId,
      userEmail: req.user.email,
      action: 'MESSAGES_LISTED',
      resource: 'message',
      details: `Listed ${messages.length} messages`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar mensagens:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'MESSAGES_LIST_ERROR',
      resource: 'message',
      details: `Error listing messages: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'LIST_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/messages/conversations - Listar conversas do usuário
router.get("/conversations", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Buscar conversas únicas
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { remetente: userId },
            { destinatario: userId }
          ],
          deletedAt: { $exists: false }
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ['$remetente', userId] },
              '$destinatario',
              '$remetente'
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            otherUser: '$otherUser',
            tipo: '$tipo',
            servico_id: '$servico_id'
          },
          lastMessage: { $first: '$$ROOT' },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$destinatario', userId] },
                    { $in: ['$status', ['sent', 'delivered']] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Populate dados dos usuários e serviços
    for (let conv of conversations) {
      const otherUser = await User.findById(conv._id.otherUser).select('name email');
      conv.otherUser = otherUser;

      if (conv._id.tipo === 'product') {
        const product = await Product.findById(conv._id.servico_id).select('title price images');
        conv.service = product;
      } else {
        const freight = await Freight.findById(conv._id.servico_id).select('origin destination price');
        conv.service = freight;
      }
    }

    // Contar total de conversas
    const totalConversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { remetente: userId },
            { destinatario: userId }
          ],
          deletedAt: { $exists: false }
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ['$remetente', userId] },
              '$destinatario',
              '$remetente'
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            otherUser: '$otherUser',
            tipo: '$tipo',
            servico_id: '$servico_id'
          }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const total = totalConversations[0]?.total || 0;

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar conversas:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CONVERSATIONS_LIST_ERROR',
      resource: 'message',
      details: `Error listing conversations: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'CONVERSATIONS_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/messages/conversation/:otherUserId/:tipo/:servicoId - Obter conversa específica
router.get("/conversation/:otherUserId/:tipo/:servicoId", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { otherUserId, tipo, servicoId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    // Verificar se o outro usuário existe
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // Buscar mensagens da conversa
    const messages = await Message.findConversation(userId, otherUserId, tipo, servicoId)
      .populate('remetente', 'name email')
      .populate('destinatario', 'name email')
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Message.countDocuments({
      $or: [
        { remetente: userId, destinatario: otherUserId },
        { remetente: otherUserId, destinatario: userId }
      ],
      tipo: tipo,
      servico_id: servicoId,
      deletedAt: { $exists: false }
    });

    // Marcar mensagens como lidas
    await Message.updateMany(
      {
        destinatario: userId,
        remetente: otherUserId,
        tipo: tipo,
        servico_id: servicoId,
        status: { $in: ['sent', 'delivered'] }
      },
      { status: 'read' }
    );

    res.json({
      success: true,
      data: {
        messages,
        otherUser: {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CONVERSATION_FETCH_ERROR',
      resource: 'message',
      details: `Error fetching conversation: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'FETCH_ERROR',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// PUT /api/messages/:messageId/read - Marcar mensagem como lida
router.put("/:messageId/read", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada"
      });
    }

    // Verificar se o usuário é o destinatário
    if (message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para marcar esta mensagem como lida"
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: "Mensagem marcada como lida"
    });

  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// DELETE /api/messages/:messageId - Deletar mensagem (soft delete)
router.delete("/:messageId", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada"
      });
    }

    // Verificar se o usuário é o remetente ou destinatário
    if (message.remetente.toString() !== userId && message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para deletar esta mensagem"
      });
    }

    await message.softDelete(userId);

    // Log da ação
    await AuditLog.logAction({
      userId: userId,
      userEmail: req.user.email,
      action: 'MESSAGE_DELETED',
      resource: 'message',
      resourceId: messageId,
      details: 'Message soft deleted by user',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: "Mensagem deletada com sucesso"
    });

  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/messages/:messageId/report - Reportar mensagem
router.post("/:messageId/report", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Motivo deve ter pelo menos 10 caracteres"
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada"
      });
    }

    // Verificar se o usuário é o destinatário
    if (message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para reportar esta mensagem"
      });
    }

    await message.report(reason.trim());

    // Log da ação
    await AuditLog.logAction({
      userId: userId,
      userEmail: req.user.email,
      action: 'MESSAGE_REPORTED',
      resource: 'message',
      resourceId: messageId,
      details: `Message reported: ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: "Mensagem reportada com sucesso"
    });

  } catch (error) {
    console.error('Erro ao reportar mensagem:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/messages/stats - Estatísticas das mensagens do usuário
router.get("/stats", authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Message.getMessageStats(userId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

export default router;
