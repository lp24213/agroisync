import express from 'express';
import Escrow from '../models/Escrow.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// POST /api/escrow/create - Criar escrow
router.post(
  '/create',
  authenticateToken,
  [
    body('itemId').isMongoId().withMessage('ID do item invÃ¡lido'),
    body('itemType').isIn(['product', 'freight']).withMessage('Tipo de item invÃ¡lido'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
    body('description').notEmpty().withMessage('DescriÃ§Ã£o Ã© obrigatÃ³ria')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { itemId, itemType, amount, description } = req.body;
      const buyerId = req.user.id;

      // Buscar item
      let item;
      if (itemType === 'product') {
        item = await Product.findById(itemId);
      } else {
        item = await Freight.findById(itemId);
      }

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item nÃ£o encontrado'
        });
      }

      // Verificar se o comprador nÃ£o Ã© o prÃ³prio vendedor
      if (item.owner.toString() === buyerId) {
        return res.status(400).json({
          success: false,
          message: 'VocÃª nÃ£o pode comprar seu prÃ³prio item'
        });
      }

      // Verificar se jÃ¡ existe escrow ativo para este item
      const existingEscrow = await Escrow.findOne({
        itemId,
        itemType,
        buyerId,
        status: { $in: ['pending', 'funded'] }
      });

      if (existingEscrow) {
        return res.status(400).json({
          success: false,
          message: 'JÃ¡ existe uma transaÃ§Ã£o em andamento para este item'
        });
      }

      // Criar escrow
      const escrow = new Escrow({
        itemId,
        itemType,
        sellerId: item.owner,
        buyerId,
        amount: parseFloat(amount),
        description,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      });

      await escrow.save();

      // Buscar dados do vendedor
      const seller = await User.findById(item.owner).select('name email company');

      res.json({
        success: true,
        message: 'Escrow criado com sucesso',
        data: {
          escrowId: escrow._id,
          item: {
            id: item._id,
            name: item.name || `${item.origin} â†’ ${item.destination}`,
            type: itemType
          },
          seller: {
            id: seller._id,
            name: seller.name,
            company: seller.company
          },
          amount: escrow.amount,
          status: escrow.status,
          expiresAt: escrow.expiresAt
        }
      });
    } catch (error) {
      logger.error('Erro ao criar escrow:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/escrow/fund - Financiar escrow
router.post(
  '/fund',
  authenticateToken,
  [
    body('escrowId').isMongoId().withMessage('ID do escrow invÃ¡lido'),
    body('paymentMethod')
      .isIn(['stripe', 'metamask'])
      .withMessage('MÃ©todo de pagamento invÃ¡lido'),
    body('paymentData').isObject().withMessage('Dados de pagamento sÃ£o obrigatÃ³rios')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { escrowId, paymentMethod, paymentData } = req.body;
      const userId = req.user.id;

      // Buscar escrow
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) {
        return res.status(404).json({
          success: false,
          message: 'Escrow nÃ£o encontrado'
        });
      }

      // Verificar se o usuÃ¡rio Ã© o comprador
      if (escrow.buyerId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se escrow ainda estÃ¡ pendente
      if (escrow.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Escrow nÃ£o estÃ¡ mais pendente'
        });
      }

      // Verificar se nÃ£o expirou
      if (escrow.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Escrow expirado'
        });
      }

      // Processar pagamento baseado no mÃ©todo
      let paymentResult;
      if (paymentMethod === 'stripe') {
        paymentResult = await processStripePayment(escrow, paymentData);
      } else if (paymentMethod === 'metamask') {
        paymentResult = await processMetaMaskPayment(escrow, paymentData);
      }

      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          message: paymentResult.message || 'Erro ao processar pagamento'
        });
      }

      // Atualizar escrow
      escrow.status = 'funded';
      escrow.paymentId = paymentResult.paymentId;
      escrow.paymentMethod = paymentMethod;
      escrow.fundedAt = new Date();
      await escrow.save();

      // Criar registro de pagamento
      const payment = new Payment({
        userId: escrow.buyerId,
        amount: escrow.amount,
        currency: 'BRL',
        status: 'completed',
        provider: paymentMethod,
        purpose: 'escrow_funding',
        metadata: {
          escrowId: escrow._id,
          itemId: escrow.itemId,
          itemType: escrow.itemType
        }
      });
      await payment.save();

      res.json({
        success: true,
        message: 'Escrow financiado com sucesso',
        data: {
          escrowId: escrow._id,
          status: escrow.status,
          fundedAt: escrow.fundedAt,
          paymentId: payment._id
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao financiar escrow:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// POST /api/escrow/release - Liberar pagamento
router.post(
  '/release',
  authenticateToken,
  [
    body('escrowId').isMongoId().withMessage('ID do escrow invÃ¡lido'),
    body('action').isIn(['release', 'dispute']).withMessage('AÃ§Ã£o invÃ¡lida'),
    body('reason').optional().isString().withMessage('Motivo deve ser texto')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { escrowId, action, reason } = req.body;
      const userId = req.user.id;

      // Buscar escrow
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) {
        return res.status(404).json({
          success: false,
          message: 'Escrow nÃ£o encontrado'
        });
      }

      // Verificar se o usuÃ¡rio Ã© o comprador ou vendedor
      if (escrow.buyerId.toString() !== userId && escrow.sellerId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se escrow estÃ¡ financiado
      if (escrow.status !== 'funded') {
        return res.status(400).json({
          success: false,
          message: 'Escrow nÃ£o estÃ¡ financiado'
        });
      }

      if (action === 'release') {
        // Liberar pagamento para o vendedor
        escrow.status = 'released';
        escrow.releasedAt = new Date();
        escrow.releasedBy = userId;
        escrow.releaseReason = reason || 'Pagamento liberado pelo comprador';

        // Buscar vendedor
        const seller = await User.findById(escrow.sellerId);
        if (seller) {
          // Aqui vocÃª implementaria a lÃ³gica de transferÃªncia real
          // Por enquanto, apenas marcar como liberado
          seller.balance = (seller.balance || 0) + escrow.amount;
          await seller.save();
        }

        await escrow.save();

        res.json({
          success: true,
          message: 'Pagamento liberado com sucesso',
          data: {
            escrowId: escrow._id,
            status: escrow.status,
            releasedAt: escrow.releasedAt
          }
        });
      } else if (action === 'dispute') {
        // Abrir disputa
        escrow.status = 'disputed';
        escrow.disputedAt = new Date();
        escrow.disputedBy = userId;
        escrow.disputeReason = reason || 'Disputa aberta';

        await escrow.save();

        res.json({
          success: true,
          message: 'Disputa aberta com sucesso',
          data: {
            escrowId: escrow._id,
            status: escrow.status,
            disputedAt: escrow.disputedAt
          }
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao processar escrow:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// GET /api/escrow/:id - Obter detalhes do escrow
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const escrow = await Escrow.findById(id)
      .populate('sellerId', 'name email company')
      .populate('buyerId', 'name email company');

    if (!escrow) {
      return res.status(404).json({
        success: false,
        message: 'Escrow nÃ£o encontrado'
      });
    }

    // Verificar se o usuÃ¡rio tem acesso
    if (
      escrow.buyerId._id.toString() !== userId &&
      escrow.sellerId._id.toString() !== userId &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Buscar item
    let item;
    if (escrow.itemType === 'product') {
      item = await Product.findById(escrow.itemId);
    } else {
      item = await Freight.findById(escrow.itemId);
    }

    res.json({
      success: true,
      data: {
        escrow: {
          id: escrow._id,
          status: escrow.status,
          amount: escrow.amount,
          description: escrow.description,
          createdAt: escrow.createdAt,
          expiresAt: escrow.expiresAt,
          fundedAt: escrow.fundedAt,
          releasedAt: escrow.releasedAt,
          disputedAt: escrow.disputedAt
        },
        item: {
          id: item._id,
          name: item.name || `${item.origin} â†’ ${item.destination}`,
          type: escrow.itemType
        },
        seller: escrow.sellerId,
        buyer: escrow.buyerId
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar escrow:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/escrow/user/:userId - Listar escrows do usuÃ¡rio
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Verificar se o usuÃ¡rio pode acessar
    if (userId !== currentUserId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    const escrows = await Escrow.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
      .populate('sellerId', 'name email company')
      .populate('buyerId', 'name email company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: escrows
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao listar escrows:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// FunÃ§Ãµes auxiliares para processamento de pagamento
function processStripePayment(escrow, paymentData) {
  try {
    // Implementar lÃ³gica real do Stripe
    // Por enquanto, simular sucesso
    return {
      success: true,
      paymentId: `stripe_${Date.now()}`
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao processar pagamento Stripe'
    };
  }
}

function processMetaMaskPayment(escrow, paymentData) {
  try {
    // Implementar verificaÃ§Ã£o real da blockchain
    // Por enquanto, simular sucesso
    return {
      success: true,
      paymentId: `metamask_${Date.now()}`
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao processar pagamento MetaMask'
    };
  }
}

export default router;
