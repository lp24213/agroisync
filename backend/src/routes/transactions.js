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
    const { type, itemId, itemModel, total, shipping, paymentMethods, deliveryOptions, notes } =
      req.body;

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
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao criar transação:', error);
    }
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

    // Paginação
    const skip = (page - 1) * limit;

    // Buscar transações
    const transactions = await Transaction.find(filters)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

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
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar transações:', error);
    }
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
    const { userId } = req.user;

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
    if (
      transaction.buyerId._id.toString() !== userId &&
      transaction.sellerId._id.toString() !== userId
    ) {
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
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar transação:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /:id/status - Atualizar status da transação
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, reason, notes } = req.body;
    const { userId } = req.user;

    // Buscar transação
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar permissões
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para alterar esta transação'
      });
    }

    // Verificar se a mudança de status é válida
    if (!transaction.canChangeToStatus(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Mudança de status inválida: ${transaction.status} → ${newStatus}`
      });
    }

    // Salvar status anterior
    const oldStatus = transaction.status;

    // Atualizar status
    transaction.status = newStatus;

    // Adicionar ao histórico
    await transaction.addStatusHistory(newStatus, userId, reason, notes);

    // Atualizar campos relacionados ao escrow se necessário
    if (newStatus.startsWith('ESCROW_')) {
      transaction.usesEscrow = true;
      transaction.escrowStatus = newStatus.replace('ESCROW_', '');
    }

    // Salvar transação
    await transaction.save();

    // Buscar transação atualizada com populações
    const updatedTransaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId')
      .populate('escrowTransactionId');

    res.json({
      success: true,
      message: 'Status da transação atualizado com sucesso',
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
      console.error('Erro ao atualizar status da transação:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /:id/escrow/enable - Habilitar escrow para transação
router.post('/:id/escrow/enable', async (req, res) => {
  try {
    const { id } = req.params;
    const { autoReleaseDays, requiresConfirmation, allowDisputes, maxDisputeDays } = req.body;
    const { userId } = req.user;

    // Buscar transação
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar permissões (apenas comprador pode habilitar escrow)
    if (transaction.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o comprador pode habilitar escrow'
      });
    }

    // Verificar se já tem escrow habilitado
    if (transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow já está habilitado para esta transação'
      });
    }

    // Verificar se o status permite habilitar escrow
    if (!['PENDING', 'NEGOTIATING', 'AGREED'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: 'Status da transação não permite habilitar escrow'
      });
    }

    // Atualizar configurações de escrow
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

    // Adicionar ao histórico
    await transaction.addStatusHistory(
      'ESCROW_PENDING',
      userId,
      'Escrow habilitado',
      'Escrow habilitado pelo comprador'
    );

    // Salvar transação
    await transaction.save();

    // Buscar transação atualizada
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
      console.error('Erro ao habilitar escrow:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /:id/escrow/disable - Desabilitar escrow para transação
router.post('/:id/escrow/disable', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { userId } = req.user;

    // Buscar transação
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar permissões (apenas comprador pode desabilitar escrow)
    if (transaction.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o comprador pode desabilitar escrow'
      });
    }

    // Verificar se escrow está habilitado
    if (!transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow não está habilitado para esta transação'
      });
    }

    // Verificar se pode desabilitar (apenas se ainda não foi fundado)
    if (
      ['FUNDED', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'DISPUTED', 'RELEASED'].includes(
        transaction.escrowStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível desabilitar escrow após o valor ser depositado'
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

    // Adicionar ao histórico
    await transaction.addStatusHistory(
      'AGREED',
      userId,
      'Escrow desabilitado',
      reason || 'Escrow desabilitado pelo comprador'
    );

    // Salvar transação
    await transaction.save();

    // Buscar transação atualizada
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
      console.error('Erro ao desabilitar escrow:', error);
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

    // Buscar transação
    const transaction = await Transaction.findById(id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('itemId')
      .populate('escrowTransactionId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar permissões
    if (
      transaction.buyerId._id.toString() !== userId &&
      transaction.sellerId._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para visualizar esta transação'
      });
    }

    // Verificar se escrow está habilitado
    if (!transaction.usesEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Escrow não está habilitado para esta transação'
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

    // Adicionar dados da transação de escrow se existir
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
      console.error('Erro ao obter status do escrow:', error);
    }
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
    const { userId } = req.user;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar se o usuário tem acesso a esta transação
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
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
      console.error('Erro ao buscar mensagens:', error);
    }
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
    const { userId } = req.user;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar se o usuário tem acesso a esta transação
    if (transaction.buyerId.toString() !== userId && transaction.sellerId.toString() !== userId) {
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
      console.error('Erro ao enviar mensagem:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /conversations - Buscar conversas ativas do usuário
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 20 } = req.query;

    // Buscar conversas ativas
    const conversations = await TransactionMessage.findActiveConversations(
      userId,
      parseInt(limit, 10)
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
      console.error('Erro ao buscar conversas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /stats - Estatísticas das transações
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.user;

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
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar estatísticas:', error);
    }
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
      .limit(parseInt(limit, 10));

    const total = await Transaction.countDocuments(filters);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
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
        message: 'Transação não encontrada'
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
