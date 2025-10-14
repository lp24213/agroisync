import { createAuditLog } from '../utils/securityLogger.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Freight from '../models/Freight.js';
import Message from '../models/Message.js';
import Transaction from '../models/Transaction.js';
import Payment from '../models/Payment.js';

import logger from '../utils/logger.js';
// ===== MIDDLEWARE DE PRIVACIDADE LGPD =====

/**
 * Middleware para verificar consentimento LGPD
 */
export const checkGDPRConsent = (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    // Verificar se usuÃ¡rio deu consentimento LGPD
    if (!req.user.gdprConsent) {
      return res.status(403).json({
        success: false,
        message: 'Consentimento LGPD necessÃ¡rio para continuar',
        requiresConsent: true,
        consentUrl: '/privacy/consent'
      });
    }

    // Verificar se consentimento nÃ£o expirou
    if (req.user.gdprConsentExpiry && new Date() > new Date(req.user.gdprConsentExpiry)) {
      return res.status(403).json({
        success: false,
        message: 'Consentimento LGPD expirado. Renove seu consentimento.',
        requiresConsent: true,
        consentUrl: '/privacy/consent'
      });
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na verificaÃ§Ã£o LGPD:', error);
    }
    next();
  }
};

/**
 * Middleware para registrar consentimento LGPD
 */
export const recordGDPRConsent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o autenticado'
      });
    }

    const { consent, preferences } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Consentimento Ã© obrigatÃ³rio'
      });
    }

    // Atualizar usuÃ¡rio com consentimento
    const user = await User.findById(req.user.userId);
    user.gdprConsent = consent;
    user.gdprConsentDate = new Date();
    user.gdprConsentExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano
    user.gdprPreferences = preferences || {};

    await user.save();

    // Log do consentimento
    await createAuditLog('GDPR_CONSENT_GIVEN', 'user_privacy', req, req.user.userId, {
      consent,
      preferences,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao registrar consentimento LGPD:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar consentimento'
    });
  }
};

/**
 * Middleware para verificar se dados podem ser processados
 */
export const canProcessData = dataType => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'UsuÃ¡rio nÃ£o autenticado'
        });
      }

      const user = await User.findById(req.user.userId);

      // Verificar se usuÃ¡rio deu consentimento para o tipo de dado
      if (!user.gdprConsent || !user.gdprPreferences[dataType]) {
        return res.status(403).json({
          success: false,
          message: `Consentimento necessÃ¡rio para processamento de ${dataType}`,
          requiresConsent: true,
          dataType
        });
      }

      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro na verificaÃ§Ã£o de processamento de dados:', error);
      }
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// ===== FUNÃ‡Ã•ES DE EXPORTAÃ‡ÃƒO DE DADOS =====

/**
 * Exportar dados do usuÃ¡rio (Direito de Portabilidade)
 */
export const exportUserData = async (req, res) => {
  try {
    const { userId } = req.user;

    // Buscar todos os dados do usuário
    const user = await User.findById(userId).select('-password -resetToken -resetTokenExpiry');
    const products = await Product.find({ seller: userId });
    const freights = await Freight.find({ carrier: userId });
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    });
    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }]
    });
    const payments = await Payment.find({ userId });

    // Estruturar dados para exportaÃ§Ã£o
    const exportData = {
      user: {
        profile: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          cpf: user.cpf,
          cnpj: user.cnpj,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        preferences: user.preferences,
        gdprConsent: {
          consent: user.gdprConsent,
          date: user.gdprConsentDate,
          preferences: user.gdprPreferences
        }
      },
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        location: p.location,
        createdAt: p.createdAt,
        status: p.status
      })),
      freights: freights.map(f => ({
        id: f._id,
        origin: f.origin,
        destination: f.destination,
        price: f.price,
        vehicle: f.vehicle,
        createdAt: f.createdAt,
        status: f.status
      })),
      messages: messages.map(m => ({
        id: m._id,
        content: m.content,
        sender: m.sender,
        recipient: m.recipient,
        timestamp: m.timestamp,
        read: m.read
      })),
      transactions: transactions.map(t => ({
        id: t._id,
        product: t.product,
        buyer: t.buyer,
        seller: t.seller,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt
      })),
      payments: payments.map(p => ({
        id: p._id,
        amount: p.amount,
        method: p.method,
        status: p.status,
        createdAt: p.createdAt
      })),
      exportInfo: {
        exportedAt: new Date(),
        dataTypes: ['profile', 'products', 'freights', 'messages', 'transactions', 'payments'],
        format: 'JSON',
        version: '1.0'
      }
    };

    // Log da exportaÃ§Ã£o
    await createAuditLog('DATA_EXPORT_REQUESTED', 'user_data', req, userId, {
      dataTypes: exportData.exportInfo.dataTypes,
      exportFormat: 'JSON'
    });

    res.json({
      success: true,
      message: 'Dados exportados com sucesso',
      data: exportData
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na exportaÃ§Ã£o de dados:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao exportar dados'
    });
  }
};

/**
 * Excluir dados do usuÃ¡rio (Direito ao Esquecimento)
 */
export const deleteUserData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { dataTypes, reason } = req.body;

    if (!dataTypes || !Array.isArray(dataTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Tipos de dados para exclusÃ£o sÃ£o obrigatÃ³rios'
      });
    }

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Motivo da exclusÃ£o deve ter pelo menos 10 caracteres'
      });
    }

    const deletionResults = {};

    // Excluir produtos
    if (dataTypes.includes('products')) {
      const result = await Product.deleteMany({ seller: userId });
      deletionResults.products = result.deletedCount;
    }

    // Excluir fretes
    if (dataTypes.includes('freights')) {
      const result = await Freight.deleteMany({ carrier: userId });
      deletionResults.freights = result.deletedCount;
    }

    // Excluir mensagens
    if (dataTypes.includes('messages')) {
      const result = await Message.deleteMany({
        $or: [{ sender: userId }, { recipient: userId }]
      });
      deletionResults.messages = result.deletedCount;
    }

    // Excluir transaÃ§Ãµes
    if (dataTypes.includes('transactions')) {
      const result = await Transaction.deleteMany({
        $or: [{ buyer: userId }, { seller: userId }]
      });
      deletionResults.transactions = result.deletedCount;
    }

    // Excluir pagamentos
    if (dataTypes.includes('payments')) {
      const result = await Payment.deleteMany({ userId });
      deletionResults.payments = result.deletedCount;
    }

    // Anonimizar perfil se solicitado
    if (dataTypes.includes('profile')) {
      await User.findByIdAndUpdate(userId, {
        name: '[REMOVIDO]',
        email: `removed_${Date.now()}@deleted.com`,
        phone: '[REMOVIDO]',
        cpf: '[REMOVIDO]',
        cnpj: '[REMOVIDO]',
        isActive: false,
        gdprConsent: false,
        dataDeletedAt: new Date(),
        deletionReason: reason
      });
      deletionResults.profile = 'anonymized';
    }

    // Log da exclusÃ£o
    await createAuditLog('DATA_DELETION_REQUESTED', 'user_data', req, userId, {
      dataTypes,
      reason,
      deletionResults,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Dados excluÃ­dos com sucesso',
      deletionResults,
      dataTypes
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na exclusÃ£o de dados:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir dados'
    });
  }
};

/**
 * Obter status de privacidade do usuÃ¡rio
 */
export const getPrivacyStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select(
      'gdprConsent gdprConsentDate gdprConsentExpiry gdprPreferences dataDeletedAt'
    );

    const privacyStatus = {
      hasConsent: !!user.gdprConsent,
      consentDate: user.gdprConsentDate,
      consentExpiry: user.gdprConsentExpiry,
      preferences: user.gdprPreferences || {},
      isDataDeleted: !!user.dataDeletedAt,
      dataDeletedAt: user.dataDeletedAt,
      rights: {
        rightToAccess: true,
        rightToPortability: true,
        rightToRectification: true,
        rightToErasure: true,
        rightToRestriction: true,
        rightToObject: true
      }
    };

    res.json({
      success: true,
      privacyStatus
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter status de privacidade:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter status de privacidade'
    });
  }
};

/**
 * Atualizar preferÃªncias de privacidade
 */
export const updatePrivacyPreferences = async (req, res) => {
  try {
    const { userId } = req.user;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'PreferÃªncias de privacidade sÃ£o obrigatÃ³rias'
      });
    }

    // Validar preferÃªncias
    const validPreferences = [
      'marketing_emails',
      'push_notifications',
      'sms_notifications',
      'data_sharing',
      'analytics_tracking',
      'third_party_cookies'
    ];

    const validatedPreferences = {};
    validPreferences.forEach(pref => {
      if (Object.prototype.hasOwnProperty.call(preferences, pref)) {
        validatedPreferences[pref] = !!preferences[pref];
      }
    });

    // Atualizar usuÃ¡rio
    await User.findByIdAndUpdate(userId, {
      gdprPreferences: validatedPreferences,
      gdprConsentDate: new Date()
    });

    // Log da atualizaÃ§Ã£o
    await createAuditLog('PRIVACY_PREFERENCES_UPDATED', 'user_privacy', req, userId, {
      preferences: validatedPreferences
    });

    res.json({
      success: true,
      message: 'PreferÃªncias de privacidade atualizadas',
      preferences: validatedPreferences
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao atualizar preferÃªncias de privacidade:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar preferÃªncias'
    });
  }
};

export default {
  checkGDPRConsent,
  recordGDPRConsent,
  canProcessData,
  exportUserData,
  deleteUserData,
  getPrivacyStatus,
  updatePrivacyPreferences
};
