import AuditLog from '../models/AuditLog.js';

import logger from '../utils/logger.js';
// Middleware para validar aÃ§Ãµes administrativas
export const validateAdminAction = async (req, res, next) => {
  try {
    const { action, reason } = req.body;

    // Validar se aÃ§Ã£o e motivo foram fornecidos
    if (!action || !reason) {
      return res.status(400).json({
        success: false,
        message: 'AÃ§Ã£o e motivo sÃ£o obrigatÃ³rios para operaÃ§Ãµes administrativas'
      });
    }

    // Validar se o motivo tem pelo menos 10 caracteres
    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Motivo deve ter pelo menos 10 caracteres'
      });
    }

    // Validar se a aÃ§Ã£o Ã© vÃ¡lida
    const validActions = ['ban', 'activate', 'update', 'delete', 'export'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'AÃ§Ã£o administrativa invÃ¡lida'
      });
    }

    // Log da validaÃ§Ã£o da aÃ§Ã£o administrativa
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'ADMIN_ACTION_VALIDATED',
      resource: 'admin_validation',
      details: `Admin action validated: ${action} - ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o da aÃ§Ã£o administrativa:', error);
    }
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'ADMIN_ACTION_VALIDATION_ERROR',
      resource: 'admin_validation',
      details: `Validation error: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'VALIDATION_ERROR',
      errorMessage: error.message
    });

    return res.status(500).json({
      success: false,
      message: 'Erro na validaÃ§Ã£o da aÃ§Ã£o administrativa'
    });
  }
};
