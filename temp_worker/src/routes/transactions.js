import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import TransactionMessage from '../models/TransactionMessage.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import User from '../models/User.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

import logger from '../utils/logger.js';
const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE AUTENTICAÃ‡ÃƒO =====
// Todas as rotas requerem autenticaÃ§Ã£o
router.use(authenticateToken);

// ===== ROTAS DE TRANSACÃ•ES =====

// POST / - Criar nova transaÃ§Ã£o de intermediaÃ§Ã£o
router.post('/', async (req, res) => {
  try {
    const { type, itemId, itemModel, total, shipping, paymentMethods, deliveryOptions, notes } =
      req.body;

    const buyerId = req.user.userId;

    // ValidaÃ§Ãµes bÃ¡sicas
    if (!type || !itemId || !itemModel || !total) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatÃ³rios: type, itemId, itemModel, total'
      });
    }

    // Validar tipo de transaÃ§Ã£o
    if (!['PRODUCT', 'FREIGHT', 'SERVICE'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de transaÃ§Ã£o invÃ¡lido'
      });
    }

    // Validar modelo do item
    if (!['Product', 'Freight', 'Service'].includes(itemModel)) {
      return res.status(400).json({
        success: false,
        message: 'Modelo de item invÃ¡lido'
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
            message: 'Produto nÃ£o encontrado'
          });
        }
        sellerId = item.seller;
        break;

      case 'Freight':
        item = await Freight.findById(itemId);
        if (!item) {
          return res.status(404).json({
            success: false,
            message: 'Frete nÃ£o encontrado'
          });
        }
        sellerId = item.carrier;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Modelo de item nÃ£o suportado'
        });
    }

    // Verificar se nÃ£o estÃ¡ tentando comprar de si mesmo
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'NÃ£o Ã© possÃ­vel criar transaÃ§Ã£o consigo mesmo'
      });
    }

    // Verificar se jÃ¡ existe uma transaÃ§Ã£o pendente para este item
    const existingTransaction = await Transaction.findOne({
      itemId,
      itemModel,
      buyerId,
      status: { $in: ['PENDING', 'NEGOTIATING'] }
    });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: 'JÃ¡ existe uma transaÃ§Ã£o pendente para este item',
        transactionId: existingTransaction.id
      });
    }

    // Criar transaÃ§Ã£o
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

    // Populate dados do usuÃ¡rio para resposta
    await transaction.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'sellerId', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'TransaÃ§Ã£o criada com sucesso',
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao criar transaÃ§Ã£o:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET / - Listar transaÃ§Ãµes do usuÃ¡rio
router.get('/', async (req, res) => {
  try {
    const { userId } = req.user;
    const { type, status, page = 1, limit = 20 } = req.query;

    // Construir filtros
    const filters = {
      $or: [{ buyerId: userId }, { sellerId: userId }]
    };

    if (type) {
      filters.type = type;
    }
    if (status) {
      filters.status = status;
    }

    // PaginaÃ§Ã£o
    const skip = (page - 1) * limit;

    // Buscar transaÃ§Ãµes
    const transactions = await Transaction.find(filters)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10, 10));

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
          page: parseInt(page, 10, 10),
          limit: parseInt(limit, 10, 10),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar transaÃ§Ãµes:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /:id - Buscar transaÃ§Ã£o por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const transaction = await Transaction.findById(id)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio tem acesso a esta transaÃ§Ã£o
    if (
      transaction.buyerId._id.toString() !== userId &&
      transaction.sellerId._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta transaÃ§Ã£o'
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar transaÃ§Ã£o:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /:id/status - Atualizar status da transaÃ§Ã£o
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, reason, notes } = req.body;
    const { userId } = req.user;

    // Buscar transaÃ§Ã£o
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar permissÃµes
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para alterar esta transaÃ§Ã£o'
      });
    }

    // Verificar se a mudanÃ§a de status Ã© vÃ¡lida
    if (!transaction.canChangeToStatus(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `MudanÃ§a de status invÃ¡lida: ${transaction.status} â†’ ${newStatus}`
      });
    }

    // Salvar status anterior
    const oldStatus = transaction.status;

    // Atualizar status
    transaction.status = newStatus;

    // Adicionar ao histÃ³rico
    await transaction.addStatusHistory(newStatus, userId, reason, notes);

    // Atualizar campos relacionados ao escrow se necessÃ¡rio
    if (newStatus.startsWith('ESCROW_')) {
      transaction.usesEscrow = true;
      transaction.escrowStatus = newStatus.replace('ESCROW_', '');
    }

    // Salvar transaÃ§Ã£o
    await transaction.save();

    // Buscar transaÃ§Ã£o atualizada com populaÃ§Ãµes
    const updatedTransaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId')
      .populate('escrowTransactionId');

    res.json({
      success: true,
      message: 'Status da transaÃ§Ã£o atualizado com sucesso',
      data: {
        transaction: updatedTransaction,
        oldStatus,
        newStatus,
        escrowBadge: updatedTransaction.getEscrowBadge(),
        timeRemaining: updatedTransaction.getTimeRemaining()
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao atualizar status da transaÃ§Ã£o:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /:id/escrow/enable - Habilitar escrow para transaÃ§Ã£o
router.post('/:id/escrow/enable', async (req, res) => {
  try {
    const { id } = req.params;
    const { autoReleaseDays, requiresConfirmation, allowDisputes, maxDisputeDays } = req.body;
    const { userId } = req.user;

    // Buscar transaÃ§Ã£o
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar permissÃµes (apenas comprador pode habilitar escrow)
    if (transaction.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o comprador pode habilitar escrow'
      });
    }

    // Verificar se jÃ¡ tem escrow habilitado
    if (transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow jÃ¡ estÃ¡ habilitado para esta transaÃ§Ã£o'
      });
    }

    // Verificar se o status permite habilitar escrow
    if (!['PENDING', 'NEGOTIATING', 'AGREED'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: 'Status da transaÃ§Ã£o nÃ£o permite habilitar escrow'
      });
    }

    // Atualizar configuraÃ§Ãµes de escrow
    transaction.usesEscrow = true;
    transaction.escrowSettings = {
      enabled: true,
      autoReleaseDays: autoReleaseDays || 7,
      requiresConfirmation: requiresConfirmation !== false,
      allowDisputes: allowDisputes !== false,
      maxDisputeDays: maxDisputeDays || 3
    };

    // Mudar status para ESCROW_PENDING
    transaction.status = 'ESCROW_PENDING';
    transaction.escrowStatus = 'PENDING';

    // Adicionar ao histÃ³rico
    await transaction.addStatusHistory(
      'ESCROW_PENDING',
      userId,
      'Escrow habilitado',
      'Escrow habilitado pelo comprador'
    );

    // Salvar transaÃ§Ã£o
    await transaction.save();

    // Buscar transaÃ§Ã£o atualizada
    const updatedTransaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId');

    res.json({
      success: true,
      message: 'Escrow habilitado com sucesso',
      data: {
        transaction: updatedTransaction,
        escrowBadge: updatedTransaction.getEscrowBadge(),
        escrowSettings: updatedTransaction.escrowSettings
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao habilitar escrow:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /:id/escrow/disable - Desabilitar escrow para transaÃ§Ã£o
router.post('/:id/escrow/disable', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { userId } = req.user;

    // Buscar transaÃ§Ã£o
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar permissÃµes (apenas comprador pode desabilitar escrow)
    if (transaction.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o comprador pode desabilitar escrow'
      });
    }

    // Verificar se escrow estÃ¡ habilitado
    if (!transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow nÃ£o estÃ¡ habilitado para esta transaÃ§Ã£o'
      });
    }

    // Verificar se pode desabilitar (apenas se ainda nÃ£o foi fundado)
    if (
      ['FUNDED', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'DISPUTED', 'RELEASED'].includes(
        transaction.escrowStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'NÃ£o Ã© possÃ­vel desabilitar escrow apÃ³s o valor ser depositado'
      });
    }

    // Desabilitar escrow
    transaction.usesEscrow = false;
    transaction.escrowSettings.enabled = false;
    transaction.escrowStatus = 'NONE';

    // Voltar para status anterior
    if (transaction.status.startsWith('ESCROW_')) {
      transaction.status = 'AGREED';
    }

    // Adicionar ao histÃ³rico
    await transaction.addStatusHistory(
      'AGREED',
      userId,
      'Escrow desabilitado',
      reason || 'Escrow desabilitado pelo comprador'
    );

    // Salvar transaÃ§Ã£o
    await transaction.save();

    // Buscar transaÃ§Ã£o atualizada
    const updatedTransaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId');

    res.json({
      success: true,
      message: 'Escrow desabilitado com sucesso',
      data: {
        transaction: updatedTransaction,
        escrowBadge: updatedTransaction.getEscrowBadge()
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao desabilitar escrow:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /:id/escrow/status - Obter status detalhado do escrow
router.get('/:id/escrow/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Buscar transaÃ§Ã£o
    const transaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId')
      .populate('escrowTransactionId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar permissÃµes
    if (
      transaction.buyerId._id.toString() !== userId &&
      transaction.sellerId._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para visualizar esta transaÃ§Ã£o'
      });
    }

    // Verificar se escrow estÃ¡ habilitado
    if (!transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow nÃ£o estÃ¡ habilitado para esta transaÃ§Ã£o'
      });
    }

    // Preparar dados de resposta
    const escrowData = {
      enabled: transaction.usesEscrow,
      status: transaction.escrowStatus,
      statusText: transaction.getEscrowStatusText(),
      badge: transaction.getEscrowBadge(),
      settings: transaction.escrowSettings,
      timeRemaining: transaction.getTimeRemaining(),
      isOverdue: transaction.isOverdue()
    };

    // Adicionar dados da transaÃ§Ã£o de escrow se existir
    if (transaction.escrowTransactionId) {
      escrowData.escrowTransaction = {
        id: transaction.escrowTransactionId._id,
        amount: transaction.escrowTransactionId.amount,
        currency: transaction.escrowTransactionId.currency,
        fee: transaction.escrowTransactionId.fee,
        totalAmount: transaction.escrowTransactionId.totalAmount,
        fundedAt: transaction.escrowTransactionId.fundedAt,
        deliveredAt: transaction.escrowTransactionId.deliveredAt,
        confirmedAt: transaction.escrowTransactionId.confirmedAt,
        releasedAt: transaction.escrowTransactionId.releasedAt
      };
    }

    res.json({
      success: true,
      data: escrowData
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter status do escrow:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /:id/messages - Buscar mensagens da transaÃ§Ã£o
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio tem acesso a esta transaÃ§Ã£o
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta transaÃ§Ã£o'
      });
    }

    // Buscar mensagens da transaÃ§Ã£o
    const messages = await TransactionMessage.findByTransaction(id, {
      limit: 100,
      sort: { createdAt: 1 }
    });

    // Marcar mensagens como lidas se o usuÃ¡rio for o destinatÃ¡rio
    const unreadMessages = messages.filter(
      msg => msg.to.toString() === userId && msg.status !== 'read'
    );

    if (unreadMessages.length > 0) {
      await Promise.all(unreadMessages.map(msg => msg.markAsRead(userId)));
    }

    res.json({
      success: true,
      messages: messages.map(msg => msg.getDisplayData(userId)),
      transactionId: id
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar mensagens:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /:id/messages - Adicionar mensagem Ã  transaÃ§Ã£o
router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, attachments, type = 'text', metadata } = req.body;
    const { userId } = req.user;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio tem acesso a esta transaÃ§Ã£o
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta transaÃ§Ã£o'
      });
    }

    // Verificar se a transaÃ§Ã£o nÃ£o estÃ¡ cancelada ou concluÃ­da
    if (['CANCELLED', 'COMPLETED'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: 'NÃ£o Ã© possÃ­vel enviar mensagens para transaÃ§Ãµes canceladas ou concluÃ­das'
      });
    }

    // Se for a primeira mensagem e o status for PENDING, mudar para NEGOTIATING
    if (transaction.status === 'PENDING') {
      transaction.status = 'NEGOTIATING';
      transaction.updatedBy = userId;
      await transaction.save();
    }

    // Determinar destinatÃ¡rio
    const toUserId =
      transaction.buyerId.toString() === userId ? transaction.sellerId : transaction.buyerId;

    // Criar mensagem
    const newMessage = new TransactionMessage({
      transactionId: id,
      from: userId,
      to: toUserId,
      body: message,
      type,
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao enviar mensagem:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /conversations - Buscar conversas ativas do usuÃ¡rio
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 20 } = req.query;

    // Buscar conversas ativas
    const conversations = await TransactionMessage.findActiveConversations(
      userId,
      parseInt(limit, 10, 10)
    );

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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar conversas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /stats - EstatÃ­sticas das transaÃ§Ãµes
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.user;

    // EstatÃ­sticas gerais
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

    // Valor total das transaÃ§Ãµes
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
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar estatÃ­sticas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN =====

// GET /admin/all - Listar todas as transaÃ§Ãµes (admin only)
router.get('/admin/all', requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;

    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (type) {
      filters.type = type;
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filters)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10, 10));

    const total = await Transaction.countDocuments(filters);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page, 10, 10),
          limit: parseInt(limit, 10, 10),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // Console log removido:', error);
    }
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
        message: 'TransaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Admin pode mudar para qualquer status
    transaction.status = status;
    transaction.notes.admin = notes || '';
    transaction.updatedBy = req.user.userId;

    await transaction.save();

    await transaction.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'sellerId', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso (admin)',
      transaction
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // Console log removido:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
