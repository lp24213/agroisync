import express from 'express';
import User from '../models/User.js';
import SecurityLog from '../models/SecurityLog.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Helper function to create security log
const createSecurityLog = async (
  eventType,
  severity,
  description,
  req,
  userId,
  additionalData = {}
) => {
  try {
    await SecurityLog.create({
      eventType,
      severity,
      description,
      userId,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: req.headers,
      geolocation: {
        country: req.headers['cf-ipcountry'] || 'Unknown',
        region: req.headers['cf-ipregion'] || 'Unknown',
        city: req.headers['cf-ipcity'] || 'Unknown'
      },
      cloudflare: {
        rayId: req.headers['cf-ray'] || null,
        country: req.headers['cf-ipcountry'] || null,
        threatScore: parseInt(req.headers['cf-threat-score'], 10) || 0,
        botScore: parseInt(req.headers['cf-bot-score'], 10) || 0
      },
      details: additionalData
    });
  } catch (error) {
    console.error('Error creating security log:', error);
  }
};

// GET /api/v1/users/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('-password -securityLogs').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Create security log
    await createSecurityLog('data_access', 'low', 'User profile accessed', req, userId);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          company: user.company,
          isActive: user.isActive,
          isVerified: user.isVerified,
          subscriptions: user.subscriptions,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Get profile error: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil'
    });
  }
});

// PUT /api/v1/users/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, phone, company } = req.body;

    // Validate input
    if (name && (name.length < 2 || name.length > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Nome deve ter entre 2 e 100 caracteres'
      });
    }

    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Telefone inválido'
      });
    }

    // Update user profile
    const updateData = {};
    if (name) {
      updateData.name = name.trim();
    }
    if (phone) {
      updateData.phone = phone.trim();
    }
    if (company) {
      if (company.name && company.name.length >= 2 && company.name.length <= 100) {
        updateData['company.name'] = company.name.trim();
      }
      if (company.cnpj && /^\d{14}$/.test(company.cnpj)) {
        updateData['company.cnpj'] = company.cnpj.trim();
      }
      if (company.address) {
        if (
          company.address.street &&
          company.address.street.length >= 5 &&
          company.address.street.length <= 200
        ) {
          updateData['company.address.street'] = company.address.street.trim();
        }
        if (
          company.address.city &&
          company.address.city.length >= 2 &&
          company.address.city.length <= 100
        ) {
          updateData['company.address.city'] = company.address.city.trim();
        }
        if (company.address.state && company.address.state.length === 2) {
          updateData['company.address.state'] = company.address.state.trim();
        }
        if (company.address.zipCode && /^\d{5}-?\d{3}$/.test(company.address.zipCode)) {
          updateData['company.address.zipCode'] = company.address.zipCode.trim();
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum dado válido para atualizar'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -securityLogs');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Create security log
    await createSecurityLog('data_modification', 'medium', 'User profile updated', req, userId, {
      updatedFields: Object.keys(updateData)
    });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          company: user.company,
          isActive: user.isActive,
          isVerified: user.isVerified,
          subscriptions: user.subscriptions,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Update profile error: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
});

// GET /api/v1/users/subscriptions - Get user subscriptions
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('subscriptions').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Create security log
    await createSecurityLog('data_access', 'low', 'User subscriptions accessed', req, userId);

    res.json({
      success: true,
      data: {
        subscriptions: user.subscriptions,
        summary: {
          store: {
            hasActivePlan: user.subscriptions.store.status === 'active',
            planName: user.subscriptions.store.plan,
            maxAds: user.subscriptions.store.maxAds,
            currentAds: user.subscriptions.store.currentAds,
            remainingAds: Math.max(
              0,
              user.subscriptions.store.maxAds - user.subscriptions.store.currentAds
            ),
            daysRemaining: user.subscriptions.store.endDate
              ? Math.ceil(
                  (new Date(user.subscriptions.store.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                )
              : 0
          },
          freight: {
            hasActivePlan: user.subscriptions.freight.status === 'active',
            planName: user.subscriptions.freight.plan,
            maxFreights: user.subscriptions.freight.maxFreights,
            currentFreights: user.subscriptions.freight.currentFreights,
            remainingFreights: Math.max(
              0,
              user.subscriptions.freight.maxFreights - user.subscriptions.freight.currentFreights
            ),
            daysRemaining: user.subscriptions.freight.endDate
              ? Math.ceil(
                  (new Date(user.subscriptions.freight.endDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Get subscriptions error: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro ao obter assinaturas'
    });
  }
});

// PUT /api/v1/users/subscriptions - Update subscription preferences
router.put('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { store, freight } = req.body;

    const updateData = {};

    // Update store subscription preferences
    if (store) {
      if (store.notifications !== undefined) {
        updateData['subscriptions.store.notifications'] = store.notifications;
      }
      if (store.autoRenew !== undefined) {
        updateData['subscriptions.store.autoRenew'] = store.autoRenew;
      }
    }

    // Update freight subscription preferences
    if (freight) {
      if (freight.notifications !== undefined) {
        updateData['subscriptions.freight.notifications'] = freight.notifications;
      }
      if (freight.autoRenew !== undefined) {
        updateData['subscriptions.freight.autoRenew'] = freight.autoRenew;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma preferência válida para atualizar'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('subscriptions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Create security log
    await createSecurityLog(
      'data_modification',
      'low',
      'User subscription preferences updated',
      req,
      userId,
      { updatedFields: Object.keys(updateData) }
    );

    res.json({
      success: true,
      message: 'Preferências de assinatura atualizadas com sucesso',
      data: {
        subscriptions: user.subscriptions
      }
    });
  } catch (error) {
    console.error('Update subscriptions error:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Update subscriptions error: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar preferências de assinatura'
    });
  }
});

// DELETE /api/v1/users/account - Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, reason } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Senha é obrigatória para deletar a conta'
      });
    }

    // Verify password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await createSecurityLog(
        'suspicious_activity',
        'medium',
        'Failed account deletion attempt - invalid password',
        req,
        userId
      );

      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Soft delete - mark as inactive instead of actually deleting
    user.isActive = false;
    user.deletedAt = new Date();
    user.deletionReason = reason || 'User requested deletion';
    await user.save();

    // Create security log
    await createSecurityLog('data_modification', 'high', 'User account deactivated', req, userId, {
      reason: reason || 'User requested deletion'
    });

    res.json({
      success: true,
      message:
        'Conta desativada com sucesso. Você pode reativá-la entrando em contato com o suporte.',
      data: {
        deactivatedAt: user.deletedAt,
        reason: user.deletionReason
      }
    });
  } catch (error) {
    console.error('Delete account error:', error);

    await createSecurityLog(
      'system_error',
      'high',
      `Delete account error: ${error.message}`,
      req,
      req.user?.userId
    );

    res.status(500).json({
      success: false,
      message: 'Erro ao deletar conta'
    });
  }
});

export default router;
