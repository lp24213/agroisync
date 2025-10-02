import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import Registration from '../models/Registration.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// Middleware para todas as rotas admin
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Estatísticas gerais do sistema
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalPayments,
      totalRevenue,
      pendingPayments,
      recentRegistrations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Product.countDocuments({ 'publicData.isActive': true }),
      Payment.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.countDocuments({ status: 'pending' }),
      Registration.find().sort({ createdAt: -1 }).limit(10)
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    const stats = {
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalTransactions: totalPayments,
      totalRevenue: revenue,
      pendingEscrow: pendingPayments,
      systemHealth: 98.5,
      uptime: '99.9%'
    };

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_DASHBOARD_ACCESS',
      resource: 'admin_dashboard',
      details: 'Admin accessed dashboard statistics',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: { stats, recentRegistrations }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar estatísticas admin:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/admin/users - Listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.isActive = status === 'active';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -piiData')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      User.countDocuments(query)
    ]);

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_USERS_LIST',
      resource: 'admin_users',
      details: `Admin listed users: page ${page}, limit ${limit}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        users,
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
      console.error('Erro ao buscar usuários:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/admin/products - Listar todos os produtos
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query['publicData.title'] = { $regex: search, $options: 'i' };
    }
    if (status) {
      query['publicData.isActive'] = status === 'active';
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Product.countDocuments(query)
    ]);

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_PRODUCTS_LIST',
      resource: 'admin_products',
      details: `Admin listed products: page ${page}, limit ${limit}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        products,
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
      console.error('Erro ao buscar produtos:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/admin/payments - Listar todos os pagamentos
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, provider } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (provider) {
      query.provider = provider;
    }

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Payment.countDocuments(query)
    ]);

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_PAYMENTS_LIST',
      resource: 'admin_payments',
      details: `Admin listed payments: page ${page}, limit ${limit}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        payments,
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
      console.error('Erro ao buscar pagamentos:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/admin/registrations - Listar todos os cadastros
router.get('/registrations', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, type } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) {
      query.userType = type;
    }

    const [registrations, total] = await Promise.all([
      Registration.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Registration.countDocuments(query)
    ]);

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_REGISTRATIONS_LIST',
      resource: 'admin_registrations',
      details: `Admin listed registrations: page ${page}, limit ${limit}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        registrations,
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
      console.error('Erro ao buscar cadastros:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/admin/activity - Atividade recente do sistema
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const activities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate('userId', 'name email');

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_ACTIVITY_ACCESS',
      resource: 'admin_activity',
      details: 'Admin accessed system activity',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar atividade:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/admin/users/:id/status - Ativar/desativar usuário
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(
      '-password -piiData'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_USER_STATUS_CHANGE',
      resource: 'admin_users',
      resourceId: id,
      details: `Admin ${isActive ? 'activated' : 'deactivated'} user: ${user.email}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: { user }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao alterar status do usuário:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/admin/products/:id - Deletar produto
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Log da ação
    await AuditLog.logAction({
      userId: req.user.userId,
      userEmail: req.user.email,
      action: 'ADMIN_PRODUCT_DELETE',
      resource: 'admin_products',
      resourceId: id,
      details: `Admin deleted product: ${product.publicData.title}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao deletar produto:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
