import AuditLog from '../models/AuditLog.js';

// Middleware para validar ações administrativas
export const validateAdminAction = async (req, res, next) => {
  try {
    const { action, reason } = req.body;

    // Validar se ação e motivo foram fornecidos
    if (!action || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Ação e motivo são obrigatórios para operações administrativas'
      });
    }

    // Validar se o motivo tem pelo menos 10 caracteres
    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Motivo deve ter pelo menos 10 caracteres'
      });
    }

    // Validar se a ação é válida
    const validActions = ['ban', 'activate', 'update', 'delete', 'export'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Ação administrativa inválida'
      });
    }

    // Log da validação da ação administrativa
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'ADMIN_ACTION_VALIDATED',
      resource: 'admin_validation',
      details: `Admin action validated: ${action} - ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    console.error('Erro na validação da ação administrativa:', error);

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
      message: 'Erro na validação da ação administrativa'
    });
  }
};
