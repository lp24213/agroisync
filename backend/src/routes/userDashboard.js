import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import Payment from '../models/Payment.js';
import PrivateMessage from '../models/PrivateMessage.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// GET /api/user/dashboard - Dashboard do usuário
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Buscar dados do usuário
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Contar produtos do usuário
    const productsCount = await Product.countDocuments({ owner: userId });
    const publicProductsCount = await Product.countDocuments({ 
      owner: userId, 
      visibility: 'public' 
    });

    // Contar fretes do usuário
    const freightsCount = await Freight.countDocuments({ owner: userId });
    const publicFreightsCount = await Freight.countDocuments({ 
      owner: userId, 
      visibility: 'public' 
    });

    // Contar conversas ativas
    const activeConversations = await PrivateMessage.distinct('conversationId', {
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    // Buscar pagamentos recentes
    const recentPayments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('itemId', 'name');

    // Buscar mensagens não lidas
    const unreadMessages = await PrivateMessage.countDocuments({
      receiverId: userId,
      isRead: false
    });

    // Estatísticas do usuário
    const stats = {
      products: {
        total: productsCount,
        public: publicProductsCount,
        private: productsCount - publicProductsCount
      },
      freights: {
        total: freightsCount,
        public: publicFreightsCount,
        private: freightsCount - publicFreightsCount
      },
      messages: {
        activeConversations: activeConversations.length,
        unread: unreadMessages
      },
      payments: {
        recent: recentPayments.length,
        total: await Payment.countDocuments({ userId })
      }
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          userType: user.userType,
          plan: user.plan,
          createdAt: user.createdAt
        },
        stats
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/user/items - Itens do usuário (produtos e fretes)
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { type = 'all', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let items = [];

    if (type === 'all' || type === 'products') {
      const products = await Product.find({ owner: userId })
        .select('name category location price visibility status createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      items = items.concat(products.map(product => ({
        ...product.toObject(),
        type: 'product'
      })));
    }

    if (type === 'all' || type === 'freights') {
      const freights = await Freight.find({ owner: userId })
        .select('origin destination value vehicleType visibility status createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      items = items.concat(freights.map(freight => ({
        ...freight.toObject(),
        type: 'freight'
      })));
    }

    // Ordenar por data de criação
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Erro ao buscar itens do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/user/statistics - Estatísticas detalhadas do usuário
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { period = '30d' } = req.query;

    // Calcular data de início baseada no período
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Estatísticas de produtos
    const productsStats = await Product.aggregate([
      { $match: { owner: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          public: { $sum: { $cond: [{ $eq: ['$visibility', 'public'] }, 1, 0] } },
          private: { $sum: { $cond: [{ $eq: ['$visibility', 'private'] }, 1, 0] } }
        }
      }
    ]);

    // Estatísticas de fretes
    const freightsStats = await Freight.aggregate([
      { $match: { owner: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          public: { $sum: { $cond: [{ $eq: ['$visibility', 'public'] }, 1, 0] } },
          private: { $sum: { $cond: [{ $eq: ['$visibility', 'private'] }, 1, 0] } }
        }
      }
    ]);

    // Estatísticas de mensagens
    const messagesStats = await PrivateMessage.aggregate([
      { 
        $match: { 
          $or: [{ senderId: userId }, { receiverId: userId }],
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: null,
          sent: { $sum: { $cond: [{ $eq: ['$senderId', userId] }, 1, 0] } },
          received: { $sum: { $cond: [{ $eq: ['$receiverId', userId] }, 1, 0] } },
          unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] }, 1, 0] } }
        }
      }
    ]);

    // Estatísticas de pagamentos
    const paymentsStats = await Payment.aggregate([
      { $match: { userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          amount: { $sum: '$amount' },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        products: productsStats[0] || { total: 0, public: 0, private: 0 },
        freights: freightsStats[0] || { total: 0, public: 0, private: 0 },
        messages: messagesStats[0] || { sent: 0, received: 0, unread: 0 },
        payments: paymentsStats[0] || { total: 0, amount: 0, completed: 0, pending: 0 }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/user/profile - Perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/user/profile - Atualizar perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    // Remover campos que não devem ser atualizados diretamente
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: user
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
