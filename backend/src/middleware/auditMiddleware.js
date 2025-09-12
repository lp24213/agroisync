import { createAuditLog, createDataModificationLog } from '../utils/securityLogger.js';

// ===== MIDDLEWARE DE AUDITORIA =====

/**
 * Middleware para auditoria de ações de usuário
 */
export const auditUserAction = (action, resource) => {
  return async (req, res, next) => {
    try {
      // Capturar dados da requisição
      const originalSend = res.send;
      const startTime = Date.now();

      // Interceptar resposta para logging
      res.send = function (data) {
        const responseTime = Date.now() - startTime;

        // Log da ação
        createAuditLog(action, resource, req, req.user?.userId, {
          responseTime,
          statusCode: res.statusCode,
          responseSize: data ? data.length : 0,
          method: req.method,
          url: req.originalUrl,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de modificação de dados
 */
export const auditDataModification = resource => {
  return async (req, res, next) => {
    try {
      // Capturar dados originais se for uma modificação
      if (['PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const originalSend = res.send;

        res.send = function (data) {
          // Log da modificação
          createDataModificationLog(resource, req.method, req, req.user?.userId, {
            changes: req.body,
            statusCode: res.statusCode,
            responseSize: data ? data.length : 0
          });

          originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria de dados:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de acesso a dados sensíveis
 */
export const auditSensitiveDataAccess = resource => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log do acesso a dados sensíveis
        createAuditLog('SENSITIVE_DATA_ACCESS', resource, req, req.user?.userId, {
          method: req.method,
          url: req.originalUrl,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria de dados sensíveis:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de transações financeiras
 */
export const auditFinancialTransaction = transactionType => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log da transação financeira
        createAuditLog('FINANCIAL_TRANSACTION', transactionType, req, req.user?.userId, {
          amount: req.body.amount,
          currency: req.body.currency || 'BRL',
          method: req.body.method,
          status: res.statusCode === 200 ? 'success' : 'failed',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria financeira:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de ações administrativas
 */
export const auditAdminAction = (action, resource) => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log da ação administrativa
        createAuditLog(`ADMIN_${action.toUpperCase()}`, resource, req, req.user?.userId, {
          adminAction: action,
          targetResource: resource,
          targetUserId: req.body.targetUserId || req.params.userId,
          reason: req.body.reason,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria administrativa:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de autenticação
 */
export const auditAuthentication = authType => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log da autenticação
        createAuditLog(`AUTH_${authType.toUpperCase()}`, 'authentication', req, req.user?.userId, {
          authType,
          success: res.statusCode === 200,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria de autenticação:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de exportação de dados
 */
export const auditDataExport = dataType => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log da exportação
        createAuditLog('DATA_EXPORT', dataType, req, req.user?.userId, {
          exportType: dataType,
          dataSize: data ? data.length : 0,
          format: req.query.format || 'JSON',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria de exportação:', error);
      next();
    }
  };
};

/**
 * Middleware para auditoria de exclusão de dados
 */
export const auditDataDeletion = dataType => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;

      res.send = function (data) {
        // Log da exclusão
        createAuditLog('DATA_DELETION', dataType, req, req.user?.userId, {
          deletionType: dataType,
          reason: req.body.reason,
          dataTypes: req.body.dataTypes,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });

        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria de exclusão:', error);
      next();
    }
  };
};

export default {
  auditUserAction,
  auditDataModification,
  auditSensitiveDataAccess,
  auditFinancialTransaction,
  auditAdminAction,
  auditAuthentication,
  auditDataExport,
  auditDataDeletion
};
