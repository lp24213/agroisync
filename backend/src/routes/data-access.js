const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Payment } = require('../models/Payment');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { AuditLog } = require('../models/AuditLog');
const { SecurityLog } = require('../models/SecurityLog');

// Verificar se usuário tem acesso aos dados de um anúncio
router.get('/check-access/:adId', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    // Verificar se existe pagamento aprovado para este anúncio
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
    console.error('Erro ao verificar acesso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Liberar dados após pagamento confirmado
router.post('/unlock-data', auth, async (req, res) => {
  try {
    const { userId, adId } = req.body;
    const currentUserId = req.user.id;

    // Verificar se o usuário tem permissão
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
      return res.status(400).json({ error: 'Pagamento não encontrado ou não aprovado' });
    }

    // Marcar dados como liberados
    payment.dataUnlocked = true;
    payment.unlockedAt = new Date();
    await payment.save();

    // Buscar dados do anúncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
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

    // Log de segurança
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
    console.error('Erro ao liberar dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter dados liberados de um anúncio
router.get('/unlocked-data/:adId', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    // Verificar se usuário tem acesso
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

    // Buscar dados do anúncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
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
    console.error('Erro ao obter dados liberados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Configurar opções de liberação para anunciante
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

    // Verificar se o usuário é o dono do anúncio
    const product = await Product.findById(adId);
    if (!product) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    if (product.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Atualizar configurações de liberação
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
      message: 'Configurações de liberação atualizadas',
      releaseSettings: product.releaseSettings
    });
  } catch (error) {
    console.error('Erro ao configurar liberação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de liberação de dados
router.get('/release-stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Estatísticas do usuário
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

    // Estatísticas dos anúncios do usuário
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
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
