import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import EscrowTransaction from '../models/EscrowTransaction.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE ESCROW =====

// GET /api/escrow - Listar transações de escrow do usuário
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type = 'all' // 'all', 'payer', 'payee'
    } = req.query;

    const userId = req.user.userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query baseada no tipo
    let query = {};
    if (type === 'payer') {
      query.payerId = userId;
    } else if (type === 'payee') {
      query.payeeId = userId;
    } else {
      query.$or = [{ payerId: userId }, { payeeId: userId }];
    }

    if (status) {
      query.status = status;
    }

    // Buscar transações de escrow
    const escrowTransactions = await EscrowTransaction.find(query)
      .populate('payerId', 'name email')
      .populate('payeeId', 'name email')
      .populate('transactionId', 'type status itemDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EscrowTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        escrowTransactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transações de escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/escrow/:id - Obter transação de escrow específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      $or: [{ payerId: userId }, { payeeId: userId }]
    })
    .populate('payerId', 'name email phone')
    .populate('payeeId', 'name email phone')
    .populate('transactionId', 'type status itemDetails total shipping')
    .populate('disputes.raisedBy', 'name email');

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada'
      });
    }

    res.json({
      success: true,
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao buscar transação de escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/escrow - Criar nova transação de escrow
router.post('/', async (req, res) => {
  try {
    const {
      transactionId,
      amount,
      currency = 'BRL',
      paymentMethod,
      autoReleaseDays = 7,
      disputePeriod = 3
    } = req.body;

    const userId = req.user.userId;

    // Validar dados obrigatórios
    if (!transactionId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'transactionId, amount e paymentMethod são obrigatórios'
      });
    }

    // Verificar se a transação existe e se o usuário é o comprador
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    if (transaction.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o comprador pode criar escrow'
      });
    }

    // Verificar se já existe escrow para esta transação
    const existingEscrow = await EscrowTransaction.findOne({ transactionId });
    if (existingEscrow) {
      return res.status(400).json({
        success: false,
        message: 'Já existe escrow para esta transação'
      });
    }

    // Calcular taxa (2.5% por padrão)
    const fee = amount * 0.025;
    const totalAmount = amount + fee;

    // Criar transação de escrow
    const escrowTransaction = new EscrowTransaction({
      transactionId,
      payerId: userId,
      payeeId: transaction.sellerId,
      amount,
      currency,
      fee,
      totalAmount,
      paymentDetails: {
        method: paymentMethod
      },
      autoReleaseDays,
      disputePeriod,
      metadata: {
        source: 'agrosync',
        category: transaction.type.toLowerCase()
      }
    });

    await escrowTransaction.save();

    // Populate para retorno
    await escrowTransaction.populate([
      { path: 'payerId', select: 'name email' },
      { path: 'payeeId', select: 'name email' },
      { path: 'transactionId', select: 'type status itemDetails' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transação de escrow criada com sucesso',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao criar transação de escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/fund - Marcar como fundado (depósito realizado)
router.patch('/:id/fund', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      payerId: userId,
      status: 'PENDING'
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser fundada'
      });
    }

    // Marcar como fundado
    await escrowTransaction.fund();

    res.json({
      success: true,
      message: 'Escrow marcado como fundado',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao marcar como fundado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/deliver - Marcar como entregue
router.patch('/:id/deliver', async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingCode, carrier } = req.body;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      payeeId: userId,
      status: 'FUNDED'
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser marcada como entregue'
      });
    }

    if (!trackingCode || !carrier) {
      return res.status(400).json({
        success: false,
        message: 'trackingCode e carrier são obrigatórios'
      });
    }

    // Marcar como entregue
    await escrowTransaction.deliver(trackingCode, carrier);

    res.json({
      success: true,
      message: 'Escrow marcado como entregue',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao marcar como entregue:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/confirm - Confirmar recebimento
router.patch('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      payerId: userId,
      status: 'DELIVERED'
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser confirmada'
      });
    }

    // Confirmar recebimento
    await escrowTransaction.confirm();

    res.json({
      success: true,
      message: 'Recebimento confirmado',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao confirmar recebimento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/release - Liberar valor para vendedor
router.patch('/:id/release', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      payerId: userId,
      status: 'CONFIRMED'
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser liberada'
      });
    }

    // Liberar valor
    await escrowTransaction.release(reason || 'Liberação manual pelo comprador');

    res.json({
      success: true,
      message: 'Valor liberado para o vendedor',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao liberar valor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/refund - Solicitar reembolso
router.patch('/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      payerId: userId,
      status: { $in: ['FUNDED', 'DELIVERED'] }
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser reembolsada'
      });
    }

    // Solicitar reembolso
    await escrowTransaction.refund(reason || 'Reembolso solicitado pelo comprador');

    res.json({
      success: true,
      message: 'Reembolso solicitado',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao solicitar reembolso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/escrow/:id/dispute - Criar disputa
router.post('/:id/dispute', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, description, evidence } = req.body;
    const userId = req.user.userId;

    // Validar dados obrigatórios
    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'reason e description são obrigatórios'
      });
    }

    const escrowTransaction = await EscrowTransaction.findOne({
      _id: id,
      $or: [{ payerId: userId }, { payeeId: userId }],
      status: { $in: ['FUNDED', 'DELIVERED'] }
    });

    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada ou não pode ser disputada'
      });
    }

    // Verificar se ainda pode ser disputada
    if (!escrowTransaction.canBeDisputed) {
      return res.status(400).json({
        success: false,
        message: 'Período para disputa expirou'
      });
    }

    // Criar disputa
    await escrowTransaction.addDispute({
      raisedBy: userId,
      reason,
      description,
      evidence: evidence || []
    });

    res.json({
      success: true,
      message: 'Disputa criada com sucesso',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao criar disputa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/escrow/:id/dispute/:disputeId/resolve - Resolver disputa (admin)
router.patch('/:id/dispute/:disputeId/resolve', async (req, res) => {
  try {
    const { id, disputeId } = req.params;
    const { resolution, adminNotes } = req.body;
    const userId = req.user.userId;

    // Verificar se é admin
    const user = await User.findById(userId);
    if (!user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem resolver disputas'
      });
    }

    // Validar dados obrigatórios
    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: 'resolution é obrigatório'
      });
    }

    const escrowTransaction = await EscrowTransaction.findById(id);
    if (!escrowTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação de escrow não encontrada'
      });
    }

    // Resolver disputa
    await escrowTransaction.resolveDispute(disputeId, resolution, adminNotes, userId);

    res.json({
      success: true,
      message: 'Disputa resolvida com sucesso',
      data: escrowTransaction
    });

  } catch (error) {
    console.error('Erro ao resolver disputa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/escrow/stats/overview - Estatísticas do escrow
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Estatísticas por status
    const stats = await EscrowTransaction.aggregate([
      {
        $match: {
          $or: [{ payerId: userId }, { payeeId: userId }]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Estatísticas por tipo de usuário
    const payerStats = await EscrowTransaction.aggregate([
      {
        $match: { payerId: userId }
      },
      {
        $group: {
          _id: null,
          totalAsPayer: { $sum: 1 },
          totalAmountAsPayer: { $sum: '$amount' }
        }
      }
    ]);

    const payeeStats = await EscrowTransaction.aggregate([
      {
        $match: { payeeId: userId }
      },
      {
        $group: {
          _id: null,
          totalAsPayee: { $sum: 1 },
          totalAmountAsPayee: { $sum: '$amount' }
        }
      }
    ]);

    const result = {
      byStatus: stats,
      asPayer: payerStats[0] || { totalAsPayer: 0, totalAmountAsPayer: 0 },
      asPayee: payeeStats[0] || { totalAsPayee: 0, totalAmountAsPayee: 0 }
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN (APENAS PARA ADMINISTRADORES) =====

// Middleware para verificar se é admin
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// GET /api/escrow/admin/all - Listar todas as transações de escrow (admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      userId
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query
    const query = {};
    if (status) query.status = status;
    if (userId) {
      query.$or = [{ payerId: userId }, { payeeId: userId }];
    }

    // Buscar transações de escrow
    const escrowTransactions = await EscrowTransaction.find(query)
      .populate('payerId', 'name email')
      .populate('payeeId', 'name email')
      .populate('transactionId', 'type status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EscrowTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        escrowTransactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar todas as transações de escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/escrow/admin/auto-release - Processar liberações automáticas (admin)
router.post('/admin/auto-release', adminAuth, async (req, res) => {
  try {
    // Buscar transações que podem ser liberadas automaticamente
    const pendingAutoRelease = await EscrowTransaction.findPendingAutoRelease();

    let processed = 0;
    for (const escrow of pendingAutoRelease) {
      try {
        await escrow.release('Liberação automática após período de confirmação');
        processed++;
      } catch (error) {
        console.error(`Erro ao processar liberação automática para ${escrow.id}:`, error);
      }
    }

    res.json({
      success: true,
      message: `${processed} transações processadas para liberação automática`,
      processed
    });

  } catch (error) {
    console.error('Erro ao processar liberações automáticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/escrow/admin/stats - Estatísticas gerais (admin)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    // Estatísticas gerais
    const stats = await EscrowTransaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalFees: { $sum: '$fee' },
          byStatus: {
            $push: {
              status: '$status',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    // Estatísticas por status
    const statusStats = await EscrowTransaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const result = {
      general: stats[0] || { total: 0, totalAmount: 0, totalFees: 0 },
      byStatus: statusStats
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
