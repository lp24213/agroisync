import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import TransactionMessage from '../models/TransactionMessage.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import User from '../models/User.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
// Todas as rotas requerem autenticação
router.use(authenticateToken);

// ===== ROTAS DE TRANSACÕES =====

// POST / - Criar nova transação de intermediação
router.post('/', async (req, res) => {
  try {
    const {
      type,
      itemId,
      itemModel,
      total,
      shipping,
      paymentMethods,
      deliveryOptions,
      notes
    } = req.body;

    const buyerId = req.user.userId;

    // Validações básicas
    if (!type || !itemId || !itemModel || !total) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: type, itemId, itemModel, total'
      });
    }

    // Validar tipo de transação
    if (!['PRODUCT', 'FREIGHT', 'SERVICE'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de transação inválido'
      });
    }

    // Validar modelo do item
    if (!['Product', 'Freight', 'Service'].includes(itemModel)) {
      return res.status(400).json({
        success: false,
        message: 'Modelo de item inválido'
      });
    }

    // Buscar o item para obter sellerId e detalhes
    let item, sellerId;
    
    switch (itemModel) {
      case 'Product':
        item = await Product.findById(itemId);
        if (!item) {
          return res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }
        sellerId = item.seller;
        break;
        
      case 'Freight':
        item = await Freight.findById(itemId);
        if (!item) {
          return res.status(404).json({
            success: false,
            message: 'Frete não encontrado'
          });
        }
        sellerId = item.carrier;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Modelo de item não suportado'
        });
    }

    // Verificar se não está tentando comprar de si mesmo
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível criar transação consigo mesmo'
      });
    }

    // Verificar se já existe uma transação pendente para este item
    const existingTransaction = await Transaction.findOne({
      itemId,
      itemModel,
      buyerId,
      status: { $in: ['PENDING', 'NEGOTIATING'] }
    });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: 'Já existe uma transação pendente para este item',
        transactionId: existingTransaction.id
      });
    }

    // Criar transação
    const transaction = new Transaction({
      type,
      buyerId,
      sellerId,
      itemId,
      itemModel,
      total,
      shipping: shipping || {},
      paymentMethods: paymentMethods || [],
      deliveryOptions: deliveryOptions || [],
      notes: notes || {},
      createdBy: buyerId
    });

    // Adicionar detalhes do item
    if (item) {
      transaction.itemDetails = {
        name: item.name || item.title,
        description: item.description,
        price: item.price,
        quantity: item.quantity || item.stock,
        unit: item.unit,
        category: item.category,
        location: item.location || item.origin
      };
    }

    await transaction.save();

    // Populate dados do usuário para resposta
    await transaction.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'sellerId', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transação criada com sucesso',
      transaction: {
        id: transaction.id,
        type: transaction.type,
        status: transaction.status,
        buyer: transaction.buyerId,
        seller: transaction.sellerId,
        item: transaction.itemDetails,
        total: transaction.total,
        createdAt: transaction.createdAt,
        negotiationDeadline: transaction.negotiationDeadline
      }
    });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

  // GET / - Listar transações do usuário
  router.get('/', async (req, res) => {
    try {
      const userId = req.user.userId;
    const { type, status, page = 1, limit = 20 } = req.query;

    // Construir filtros
    const filters = {
      $or: [
        { buyerId: userId },
        { sellerId: userId }
      ]
    };

    if (type) filters.type = type;
    if (status) filters.status = status;

    // Paginação
    const skip = (page - 1) * limit;

    // Buscar transações
    const transactions = await Transaction.find(filters)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Transaction.countDocuments(filters);

    // Separar por tipo (compras vs vendas)
    const purchases = transactions.filter(t => t.buyerId._id.toString() === userId);
    const sales = transactions.filter(t => t.sellerId._id.toString() === userId);

    res.json({
      success: true,
      data: {
        transactions,
        purchases,
        sales,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

  // GET /:id - Buscar transação por ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

    const transaction = await Transaction.findById(id)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar se o usuário tem acesso a esta transação
    if (transaction.buyerId._id.toString() !== userId && 
        transaction.sellerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta transação'
      });
    }

    res.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

  // PATCH /:id/status - Atualizar status da transação
  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.userId;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar se o usuário tem permissão para atualizar
    if (transaction.buyerId.toString() !== userId && 
        transaction.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta transação'
      });
    }

    // Validar mudança de status
    const validTransitions = {
      'PENDING': ['NEGOTIATING', 'CANCELLED'],
      'NEGOTIATING': ['AGREED', 'CANCELLED'],
      'AGREED': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [],
      'CANCELLED': []
    };

    if (!validTransitions[transaction.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Transição de status inválida: ${transaction.status} → ${status}`
      });
    }

    // Atualizar status
    transaction.status = status;
    transaction.updatedBy = userId;

    // Adicionar notas
    if (notes) {
      if (transaction.buyerId.toString() === userId) {
        transaction.notes.buyer = notes;
      } else {
        transaction.notes.seller = notes;
      }
    }

    await transaction.save();

    // Populate para resposta
    await transaction.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'sellerId', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      transaction
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

  // GET /:id/messages - Buscar mensagens da transação
  router.get('/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const transaction = await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      // Verificar se o usuário tem acesso a esta transação
      if (transaction.buyerId.toString() !== userId && 
          transaction.sellerId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta transação'
        });
      }

      // Buscar mensagens da transação
      const messages = await TransactionMessage.findByTransaction(id, {
        limit: 100,
        sort: { createdAt: 1 }
      });

      // Marcar mensagens como lidas se o usuário for o destinatário
      const unreadMessages = messages.filter(msg => 
        msg.to.toString() === userId && msg.status !== 'read'
      );

      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(msg => msg.markAsRead(userId))
        );
      }

      res.json({
        success: true,
        messages: messages.map(msg => msg.getDisplayData(userId)),
        transactionId: id
      });

    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  });

  // POST /:id/messages - Adicionar mensagem à transação
  router.post('/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const { message, attachments, type = 'text', metadata } = req.body;
      const userId = req.user.userId;

      const transaction = await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      // Verificar se o usuário tem acesso a esta transação
      if (transaction.buyerId.toString() !== userId && 
          transaction.sellerId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta transação'
        });
      }

      // Verificar se a transação não está cancelada ou concluída
      if (['CANCELLED', 'COMPLETED'].includes(transaction.status)) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível enviar mensagens para transações canceladas ou concluídas'
        });
      }

      // Se for a primeira mensagem e o status for PENDING, mudar para NEGOTIATING
      if (transaction.status === 'PENDING') {
        transaction.status = 'NEGOTIATING';
        transaction.updatedBy = userId;
        await transaction.save();
      }

      // Determinar destinatário
      const toUserId = transaction.buyerId.toString() === userId 
        ? transaction.sellerId 
        : transaction.buyerId;

      // Criar mensagem
      const newMessage = new TransactionMessage({
        transactionId: id,
        from: userId,
        to: toUserId,
        body: message,
        type: type,
        attachments: attachments || [],
        metadata: metadata || {}
      });

      await newMessage.save();

      // Marcar como entregue
      await newMessage.markAsDelivered();

      // Populate dados para resposta
      await newMessage.populate([
        { path: 'from', select: 'name email phone' },
        { path: 'to', select: 'name email phone' }
      ]);

      res.json({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: newMessage.getDisplayData(userId)
      });

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  });

  // GET /conversations - Buscar conversas ativas do usuário
  router.get('/conversations', async (req, res) => {
    try {
      const userId = req.user.userId;
      const { limit = 20 } = req.query;

      // Buscar conversas ativas
      const conversations = await TransactionMessage.findActiveConversations(userId, parseInt(limit));

      res.json({
        success: true,
        conversations: conversations.map(conv => ({
          transactionId: conv._id,
          transaction: conv.transaction,
          lastMessage: conv.lastMessage,
          messageCount: conv.messageCount,
          unreadCount: conv.unreadCount,
          fromUser: conv.fromUser,
          toUser: conv.toUser
        }))
      });

    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  });

  // GET /stats - Estatísticas das transações
  router.get('/stats', async (req, res) => {
    try {
      const userId = req.user.userId;

    // Estatísticas gerais
    const totalTransactions = await Transaction.countDocuments({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    });

    const pendingTransactions = await Transaction.countDocuments({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      status: 'PENDING'
    });

    const negotiatingTransactions = await Transaction.countDocuments({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      status: 'NEGOTIATING'
    });

    const completedTransactions = await Transaction.countDocuments({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      status: 'COMPLETED'
    });

    // Valor total das transações
    const totalValue = await Transaction.aggregate([
      {
        $match: {
          $or: [{ buyerId: userId }, { sellerId: userId }],
          status: { $in: ['COMPLETED', 'AGREED'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalTransactions,
        pending: pendingTransactions,
        negotiating: negotiatingTransactions,
        completed: completedTransactions,
        totalValue: totalValue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN =====

// GET /admin/all - Listar todas as transações (admin only)
router.get('/admin/all', requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filters)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filters);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transações (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /admin/:id/status - Atualizar status como admin
router.patch('/admin/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Admin pode mudar para qualquer status
    transaction.status = status;
    transaction.notes.admin = notes || '';
          transaction.updatedBy = req.user.userId;

    await transaction.save();

    await transaction.populate([
      { path: 'buyerId', 'name email phone' },
      { path: 'sellerId', 'name email phone' }
    ]);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso (admin)',
      transaction
    });

  } catch (error) {
    console.error('Erro ao atualizar status (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
