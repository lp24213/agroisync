import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import UserReputation from '../models/UserReputation.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE GAMIFICAÇÃO =====

// GET /api/gamification/profile - Obter perfil de reputação do usuário
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.user;

    let userReputation = await UserReputation.findOne({ userId }).populate(
      'userId',
      'name email avatar'
    );

    if (!userReputation) {
      // Criar perfil de reputação se não existir
      userReputation = new UserReputation({ userId });
      await userReputation.save();
    }

    res.json({
      success: true,
      data: userReputation
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar perfil de reputação:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/gamification/leaderboard - Obter ranking global
router.get('/leaderboard', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category = 'global', // 'global', 'regional', 'category'
      region = null
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};

    // Filtrar por região se especificado
    if (region && category === 'regional') {
      query['userId.region'] = region;
    }

    // Buscar ranking
    const leaderboard = await UserReputation.find(query)
      .populate('userId', 'name email avatar region')
      .sort({ totalScore: -1, level: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await UserReputation.countDocuments(query);

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / parseInt(limit, 10))
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar ranking:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/gamification/badges - Obter badges disponíveis
router.get('/badges', async (req, res) => {
  try {
    const { userId } = req.user;

    const userReputation = await UserReputation.findOne({ userId });
    if (!userReputation) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de reputação não encontrado'
      });
    }

    // Calcular novos badges
    const newBadges = userReputation.calculateBadges();

    // Adicionar novos badges se houver
    if (newBadges.length > 0) {
      userReputation.badges.push(...newBadges);
      await userReputation.save();
    }

    res.json({
      success: true,
      data: {
        earnedBadges: userReputation.badges,
        newBadges
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar badges:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/gamification/points - Adicionar pontos (para ações do usuário)
router.post('/points', async (req, res) => {
  try {
    const { userId } = req.user;
    const { action, points, description, metadata } = req.body;

    if (!action || !points || !description) {
      return res.status(400).json({
        success: false,
        message: 'Ação, pontos e descrição são obrigatórios'
      });
    }

    let userReputation = await UserReputation.findOne({ userId });
    if (!userReputation) {
      userReputation = new UserReputation({ userId });
    }

    // Adicionar pontos
    userReputation.addPoints(points, action, description, metadata);

    // Calcular novos badges
    const newBadges = userReputation.calculateBadges();
    if (newBadges.length > 0) {
      userReputation.badges.push(...newBadges);
    }

    await userReputation.save();

    res.json({
      success: true,
      data: {
        newScore: userReputation.totalScore,
        newLevel: userReputation.level,
        newBadges,
        levelUp: newBadges.length > 0
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao adicionar pontos:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/gamification/stats - Obter estatísticas do usuário
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.user;

    const userReputation = await UserReputation.findOne({ userId });
    if (!userReputation) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de reputação não encontrado'
      });
    }

    // Calcular estatísticas adicionais
    const stats = {
      ...userReputation.toObject(),
      progressToNextLevel: {
        current: userReputation.experience,
        required: userReputation.experienceToNextLevel,
        percentage: Math.round(
          (userReputation.experience / userReputation.experienceToNextLevel) * 100
        )
      },
      ranking: {
        global:
          (await UserReputation.countDocuments({
            totalScore: { $gt: userReputation.totalScore }
          })) + 1,
        regional:
          (await UserReputation.countDocuments({
            totalScore: { $gt: userReputation.totalScore },
            'userId.region': userReputation.userId?.region
          })) + 1
      }
    };

    res.json({
      success: true,
      data: stats
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

// PUT /api/gamification/notifications - Atualizar configurações de notificações
router.put('/notifications', async (req, res) => {
  try {
    const { userId } = req.user;
    const { notifications } = req.body;

    if (!notifications || typeof notifications !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Configurações de notificações são obrigatórias'
      });
    }

    const userReputation = await UserReputation.findOne({ userId });
    if (!userReputation) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de reputação não encontrado'
      });
    }

    // Atualizar configurações
    userReputation.notifications = {
      ...userReputation.notifications,
      ...notifications
    };

    await userReputation.save();

    res.json({
      success: true,
      data: userReputation.notifications
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao atualizar notificações:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/gamification/achievements - Obter conquistas disponíveis
router.get('/achievements', async (req, res) => {
  try {
    const achievements = [
      {
        id: 'FIRST_TRANSACTION',
        name: 'Primeira Transação',
        description: 'Completou sua primeira transação',
        icon: '🎯',
        category: 'TRANSACTION',
        rarity: 'COMMON',
        requirement: '1 transação',
        points: 50
      },
      {
        id: 'ACTIVE_SELLER',
        name: 'Vendedor Ativo',
        description: 'Cadastrou 10 ou mais produtos',
        icon: '🏪',
        category: 'PRODUCT',
        rarity: 'RARE',
        requirement: '10 produtos',
        points: 200
      },
      {
        id: 'TRANSPORTER',
        name: 'Transportador',
        description: 'Completou 5 ou mais fretes',
        icon: '🚚',
        category: 'FREIGHT',
        rarity: 'RARE',
        requirement: '5 fretes',
        points: 200
      },
      {
        id: 'TRUSTED_USER',
        name: 'Usuário Confiável',
        description: 'Alta avaliação e muitas transações bem-sucedidas',
        icon: '⭐',
        category: 'SPECIAL',
        rarity: 'EPIC',
        requirement: '4.5+ rating, 20+ transações',
        points: 500
      },
      {
        id: 'TOP_SELLER',
        name: 'Top Vendedor',
        description: 'Vendeu mais de R$ 10.000 em produtos',
        icon: '👑',
        category: 'SPECIAL',
        rarity: 'LEGENDARY',
        requirement: 'R$ 10.000+ em vendas',
        points: 1000
      }
    ];

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar conquistas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
