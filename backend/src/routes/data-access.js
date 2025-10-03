const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Payment } = require('../models/Payment');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { AuditLog } = require('../models/AuditLog');
const { SecurityLog } = require('../models/SecurityLog');

const logger = require('../utils/logger.js');
// Verificar se usuÃ¡rio tem acesso aos dados de um anÃºncio
router.get('/check-access/:adId', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    // Verificar se existe pagamento aprovado para este anÃºncio
    const payment = await Payment.findOne({
      userId,
      adId,
      status: 'succeeded',
      type: 'individual'
    });

    const hasAccess = !!payment;

    // Log de auditoria
    await AuditLog.create({
      userId,
      action: 'check_data_access',
      resource: `ad_${adId}`,
      details: { hasAccess, adId },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ hasAccess, adId });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar acesso:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Liberar dados apÃ³s pagamento confirmado
router.post('/unlock-data', auth, async (req, res) => {
  try {
    const { userId, adId } = req.body;
    const currentUserId = req.user.id;

    // Verificar se o usuÃ¡rio tem permissÃ£o
    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Verificar se existe pagamento aprovado
    const payment = await Payment.findOne({
      userId,
      adId,
      status: 'succeeded',
      type: 'individual'
    });

    if (!payment) {
      return res.status(400).json({ error: 'Pagamento nÃ£o encontrado ou nÃ£o aprovado' });
    }

    // Marcar dados como liberados
    payment.dataUnlocked = true;
    payment.unlockedAt = new Date();
    await payment.save();

    // Buscar dados do anÃºncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'AnÃºncio nÃ£o encontrado' });
    }

    // Log de auditoria
    await AuditLog.create({
      userId,
      action: 'unlock_data_access',
      resource: `ad_${adId}`,
      details: { adId, paymentId: payment._id },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Log de seguranÃ§a
    await SecurityLog.create({
      userId,
      action: 'data_unlock',
      resource: `ad_${adId}`,
      severity: 'medium',
      details: { adId, paymentId: payment._id },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Dados liberados com sucesso',
      unlockedAt: payment.unlockedAt,
      adData: {
        title: product.title,
        userName: product.userName,
        phone: product.phone,
        email: product.email,
        location: product.location,
        description: product.description
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao liberar dados:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter dados liberados de um anÃºncio
router.get('/unlocked-data/:adId', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    // Verificar se usuÃ¡rio tem acesso
    const payment = await Payment.findOne({
      userId,
      adId,
      status: 'succeeded',
      type: 'individual',
      dataUnlocked: true
    });

    if (!payment) {
      return res.status(403).json({ error: 'Acesso negado aos dados' });
    }

    // Buscar dados do anÃºncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'AnÃºncio nÃ£o encontrado' });
    }

    // Log de auditoria
    await AuditLog.create({
      userId,
      action: 'access_unlocked_data',
      resource: `ad_${adId}`,
      details: { adId },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      adData: {
        title: product.title,
        userName: product.userName,
        phone: product.phone,
        email: product.email,
        location: product.location,
        description: product.description,
        images: product.images,
        price: product.price,
        category: product.category
      },
      unlockedAt: payment.unlockedAt,
      paymentId: payment._id
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter dados liberados:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Configurar opÃ§Ãµes de liberaÃ§Ã£o para anunciante
router.post('/configure-release/:adId', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;
    const {
      autoRelease = false,
      releaseDelay = 0,
      requireVerification = true,
      customMessage = ''
    } = req.body;

    // Verificar se o usuÃ¡rio Ã© o dono do anÃºncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'AnÃºncio nÃ£o encontrado' });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Atualizar configuraÃ§Ãµes de liberaÃ§Ã£o
    product.releaseSettings = {
      autoRelease,
      releaseDelay,
      requireVerification,
      customMessage,
      updatedAt: new Date()
    };

    await product.save();

    // Log de auditoria
    await AuditLog.create({
      userId,
      action: 'configure_data_release',
      resource: `ad_${adId}`,
      details: {
        autoRelease,
        releaseDelay,
        requireVerification,
        customMessage
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'ConfiguraÃ§Ãµes de liberaÃ§Ã£o atualizadas',
      releaseSettings: product.releaseSettings
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao configurar liberaÃ§Ã£o:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatÃ­sticas de liberaÃ§Ã£o de dados
router.get('/release-stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // EstatÃ­sticas do usuÃ¡rio
    const totalPayments = await Payment.countDocuments({
      userId,
      status: 'succeeded',
      type: 'individual'
    });

    const unlockedData = await Payment.countDocuments({
      userId,
      status: 'succeeded',
      type: 'individual',
      dataUnlocked: true
    });

    const totalSpent = await Payment.aggregate([
      {
        $match: {
          userId,
          status: 'succeeded',
          type: 'individual'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // EstatÃ­sticas dos anÃºncios do usuÃ¡rio
    const userProducts = await Product.find({ userId });
    const productIds = userProducts.map(p => p._id);

    const paymentsReceived = await Payment.countDocuments({
      adId: { $in: productIds },
      status: 'succeeded',
      type: 'individual'
    });

    const totalEarned = await Payment.aggregate([
      {
        $match: {
          adId: { $in: productIds },
          status: 'succeeded',
          type: 'individual'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      buyerStats: {
        totalPayments,
        unlockedData,
        totalSpent: totalSpent[0]?.total || 0
      },
      sellerStats: {
        totalProducts: userProducts.length,
        paymentsReceived,
        totalEarned: totalEarned[0]?.total || 0
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter estatÃ­sticas:', error);
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
