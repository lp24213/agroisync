import express from 'express';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// GET /api/visibility/products/public - Listar produtos com dados públicos apenas
router.get('/products/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, location } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = { status: 'active' };
    if (category) {
      query.category = category;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const products = await Product.find(query)
      .select('name location category image createdAt')
      .populate('owner', 'name company')
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar produtos públicos:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/visibility/freights/public - Listar fretes com dados públicos apenas
router.get('/freights/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, origin, destination } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = { status: 'active' };
    if (origin) {
      query.origin = { $regex: origin, $options: 'i' };
    }
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    const freights = await Freight.find(query)
      .select('origin destination value vehicleType createdAt')
      .populate('owner', 'name company')
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });

    const total = await Freight.countDocuments(query);

    res.json({
      success: true,
      data: freights,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar fretes públicos:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/visibility/products/:id/full - Obter dados completos do produto (após pagamento)
router.get('/products/:id/full', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Verificar se o usuário pagou para ver os dados completos
    const payment = await Payment.findOne({
      userId,
      itemId: id,
      itemType: 'product',
      status: 'completed'
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: 'Pagamento necessário para acessar dados completos',
        paymentRequired: true,
        amount: 29.9 // Preço para liberar dados do produto
      });
    }

    const product = await Product.findById(id).populate(
      'owner',
      'name email phone company cnpj ie address city state'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar dados completos do produto:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/visibility/freights/:id/full - Obter dados completos do frete (após pagamento)
router.get('/freights/:id/full', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Verificar se o usuário pagou para ver os dados completos
    const payment = await Payment.findOne({
      userId,
      itemId: id,
      itemType: 'freight',
      status: 'completed'
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: 'Pagamento necessário para acessar dados completos',
        paymentRequired: true,
        amount: 19.9 // Preço para liberar dados do frete
      });
    }

    const freight = await Freight.findById(id).populate(
      'owner',
      'name email phone company cnpj ie address city state'
    );

    if (!freight) {
      return res.status(404).json({
        success: false,
        error: 'Frete não encontrado'
      });
    }

    res.json({
      success: true,
      data: freight
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar dados completos do frete:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/visibility/unlock - Liberar dados após pagamento
router.post('/unlock', authenticateToken, async (req, res) => {
  try {
    const { itemId, itemType, paymentMethod } = req.body;
    const { userId } = req.user;

    // Verificar se já existe pagamento
    const existingPayment = await Payment.findOne({
      userId,
      itemId,
      itemType,
      status: 'completed'
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: 'Dados já liberados',
        paymentId: existingPayment._id
      });
    }

    // Criar novo pagamento
    const amount = itemType === 'product' ? 29.9 : 19.9;

    const payment = new Payment({
      userId,
      itemId,
      itemType,
      amount,
      paymentMethod,
      status: 'pending',
      purpose: 'unlock_data'
    });

    await payment.save();

    // Simular confirmação de pagamento (em produção, seria confirmado pelo gateway)
    payment.status = 'completed';
    await payment.save();

    res.json({
      success: true,
      message: 'Dados liberados com sucesso',
      paymentId: payment._id
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao liberar dados:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
