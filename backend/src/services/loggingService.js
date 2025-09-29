import winston from 'winston';
import { AuditLog } from '../models/AuditLog.js';

// Configuração do Winston Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agroisync-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),

    // File transports
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Adicionar transport para MongoDB em produção
if (process.env.NODE_ENV === 'production') {
  const MongoDBTransport = require('winston-mongodb').MongoDB;

  logger.add(
    new MongoDBTransport({
      db: process.env.MONGODB_URI,
      collection: 'logs',
      options: {
        useUnifiedTopology: true
      },
      level: 'info'
    })
  );
}

export class LoggingService {
  // Log de informações gerais
  static info(message, meta = {}) {
    logger.info(message, meta);
  }

  // Log de avisos
  static warn(message, meta = {}) {
    logger.warn(message, meta);
  }

  // Log de erros
  static error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name
          }
        : null
    };
    logger.error(message, errorMeta);
  }

  // Log de debug
  static debug(message, meta = {}) {
    logger.debug(message, meta);
  }

  // Log de requisições HTTP
  static logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.userId || null,
      userEmail: req.user?.email || null
    };

    if (res.statusCode >= 400) {
      this.warn('HTTP Request Error', logData);
    } else {
      this.info('HTTP Request', logData);
    }
  }

  // Log de autenticação
  static logAuth(action, userId, email, success, details = {}) {
    const logData = {
      action,
      userId,
      email,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`Auth Success: ${action}`, logData);
    } else {
      this.warn(`Auth Failed: ${action}`, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: userId || 'anonymous',
      userEmail: email,
      action: `AUTH_${action.toUpperCase()}`,
      resource: '/api/auth',
      details: JSON.stringify(details),
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown',
      isSuspicious: !success,
      riskLevel: success ? 'LOW' : 'MEDIUM'
    }).catch(err => {
      this.error('Failed to save auth log to database', err);
    });
  }

  // Log de pagamentos
  static logPayment(action, userId, amount, currency, success, details = {}) {
    const logData = {
      action,
      userId,
      amount,
      currency,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`Payment Success: ${action}`, logData);
    } else {
      this.error(`Payment Failed: ${action}`, null, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: userId || 'system',
      userEmail: details.userEmail,
      action: `PAYMENT_${action.toUpperCase()}`,
      resource: '/api/payments',
      details: JSON.stringify(details),
      ip: details.ip || 'system',
      userAgent: details.userAgent || 'system',
      isSuspicious: !success,
      riskLevel: success ? 'LOW' : 'HIGH'
    }).catch(err => {
      this.error('Failed to save payment log to database', err);
    });
  }

  // Log de transações de escrow
  static logEscrow(action, transactionId, userId, amount, success, details = {}) {
    const logData = {
      action,
      transactionId,
      userId,
      amount,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`Escrow Success: ${action}`, logData);
    } else {
      this.error(`Escrow Failed: ${action}`, null, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: userId || 'system',
      userEmail: details.userEmail,
      action: `ESCROW_${action.toUpperCase()}`,
      resource: '/api/escrow',
      details: JSON.stringify(details),
      ip: details.ip || 'system',
      userAgent: details.userAgent || 'system',
      isSuspicious: !success,
      riskLevel: success ? 'LOW' : 'HIGH'
    }).catch(err => {
      this.error('Failed to save escrow log to database', err);
    });
  }

  // Log de mensageria
  static logMessaging(action, fromUserId, toUserId, messageId, success, details = {}) {
    const logData = {
      action,
      fromUserId,
      toUserId,
      messageId,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`Messaging Success: ${action}`, logData);
    } else {
      this.warn(`Messaging Failed: ${action}`, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: fromUserId || 'system',
      userEmail: details.fromEmail,
      action: `MESSAGING_${action.toUpperCase()}`,
      resource: '/api/messaging',
      details: JSON.stringify(details),
      ip: details.ip || 'system',
      userAgent: details.userAgent || 'system',
      isSuspicious: false,
      riskLevel: 'LOW'
    }).catch(err => {
      this.error('Failed to save messaging log to database', err);
    });
  }

  // Log de sistema
  static logSystem(action, component, success, details = {}) {
    const logData = {
      action,
      component,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`System Success: ${action}`, logData);
    } else {
      this.error(`System Error: ${action}`, null, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: 'system',
      userEmail: 'system@agroisync.com',
      action: `SYSTEM_${action.toUpperCase()}`,
      resource: `/system/${component}`,
      details: JSON.stringify(details),
      ip: 'system',
      userAgent: 'system',
      isSuspicious: false,
      riskLevel: success ? 'LOW' : 'HIGH'
    }).catch(err => {
      this.error('Failed to save system log to database', err);
    });
  }

  // Log de performance
  static logPerformance(operation, duration, success, details = {}) {
    const logData = {
      operation,
      duration: `${duration}ms`,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success && duration < 1000) {
      this.info(`Performance: ${operation}`, logData);
    } else if (success && duration >= 1000) {
      this.warn(`Slow Operation: ${operation}`, logData);
    } else {
      this.error(`Performance Error: ${operation}`, null, logData);
    }
  }

  // Log de segurança
  static logSecurity(action, userId, ip, userAgent, riskLevel, details = {}) {
    const logData = {
      action,
      userId,
      ip,
      userAgent,
      riskLevel,
      timestamp: new Date(),
      ...details
    };

    if (riskLevel === 'HIGH') {
      this.error(`Security Alert: ${action}`, null, logData);
    } else if (riskLevel === 'MEDIUM') {
      this.warn(`Security Warning: ${action}`, logData);
    } else {
      this.info(`Security Event: ${action}`, logData);
    }

    // Salvar no banco de dados
    AuditLog.logAction({
      userId: userId || 'anonymous',
      userEmail: details.userEmail,
      action: `SECURITY_${action.toUpperCase()}`,
      resource: details.resource || '/api/security',
      details: JSON.stringify(details),
      ip,
      userAgent,
      isSuspicious: riskLevel !== 'LOW',
      riskLevel
    }).catch(err => {
      this.error('Failed to save security log to database', err);
    });
  }

  // Log de API externa
  static logExternalApi(
    service,
    endpoint,
    method,
    statusCode,
    responseTime,
    success,
    details = {}
  ) {
    const logData = {
      service,
      endpoint,
      method,
      statusCode,
      responseTime: `${responseTime}ms`,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`External API Success: ${service}`, logData);
    } else {
      this.error(`External API Error: ${service}`, null, logData);
    }
  }

  // Log de email
  static logEmail(action, to, template, success, details = {}) {
    const logData = {
      action,
      to,
      template,
      success,
      timestamp: new Date(),
      ...details
    };

    if (success) {
      this.info(`Email Success: ${action}`, logData);
    } else {
      this.error(`Email Failed: ${action}`, null, logData);
    }
  }

  // Log de banco de dados
  static logDatabase(operation, collection, success, duration, details = {}) {
    const logData = {
      operation,
      collection,
      success,
      duration: `${duration}ms`,
      timestamp: new Date(),
      ...details
    };

    if (success && duration < 100) {
      this.debug(`Database Success: ${operation}`, logData);
    } else if (success && duration >= 100) {
      this.warn(`Slow Database Operation: ${operation}`, logData);
    } else {
      this.error(`Database Error: ${operation}`, null, logData);
    }
  }

  // Método para obter logs por período
  static async getLogsByPeriod(startDate, endDate, level = null, limit = 100) {
    try {
      const query = {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      };

      if (level) {
        query.level = level;
      }

      const logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(limit).lean();

      return logs;
    } catch (error) {
      this.error('Failed to retrieve logs from database', error);
      throw error;
    }
  }

  // Método para obter estatísticas de logs
  static async getLogStatistics(startDate, endDate) {
    try {
      const pipeline = [
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: {
              action: '$action',
              riskLevel: '$riskLevel'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.action',
            total: { $sum: '$count' },
            byRiskLevel: {
              $push: {
                riskLevel: '$_id.riskLevel',
                count: '$count'
              }
            }
          }
        }
      ];

      const stats = await AuditLog.aggregate(pipeline);
      return stats;
    } catch (error) {
      this.error('Failed to get log statistics', error);
      throw error;
    }
  }
}

export default LoggingService;
