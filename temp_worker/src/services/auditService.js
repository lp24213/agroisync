// Sistema de Logs e Auditoria Completo - AGROISYNC
// Logging centralizado, auditoria de seguranÃ§a e monitoramento de atividades

import mongoose from 'mongoose';
import winston from 'winston';
import { createWriteStream } from 'fs';
import { join } from 'path';
import AuditLog from '../models/AuditLog.js';
import SecurityLog from '../models/SecurityLog.js';

import logger from '../utils/logger.js';
// ===== CONFIGURAÃ‡ÃƒO DE LOGS =====

const logConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
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
      maxFiles: 10
    }),

    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 20
    })
  ]
};

// Criar logger interno para o sistema de auditoria (evitar conflito com o logger global importado)
const auditLogger = winston.createLogger(logConfig);

// ===== SISTEMA DE AUDITORIA =====

class AuditSystem {
  constructor() {
    this.logger = auditLogger;
    this.securityLogger = winston.createLogger({
      ...logConfig,
      transports: [
        new winston.transports.File({
          filename: 'logs/security-audit.log',
          maxsize: 5242880,
          maxFiles: 30
        })
      ]
    });
  }

  // Log de atividade do usuÃ¡rio
  async logUserActivity(userId, action, resource, details = {}) {
    try {
      const auditEntry = {
        userId,
        userEmail: details.userEmail || 'unknown',
        action,
        resource,
        resourceId: details.resourceId || null,
        details: JSON.stringify(details),
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown',
        timestamp: new Date(),
        metadata: {
          sessionId: details.sessionId,
          requestId: details.requestId,
          duration: details.duration
        }
      };

      // Salvar no banco de dados
      await AuditLog.create(auditEntry);

      // Log no arquivo
      this.logger.info('User Activity', auditEntry);

      return auditEntry;
    } catch (error) {
      this.logger.error('Error logging user activity:', error);
      throw error;
    }
  }

  // Log de seguranÃ§a
  async logSecurityEvent(eventType, severity, description, details = {}) {
    try {
      const securityEntry = {
        eventType,
        severity,
        description,
        userId: details.userId || null,
        ipAddress: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown',
        requestMethod: details.method || null,
        requestUrl: details.url || null,
        requestHeaders: details.headers || {},
        requestBody: details.body ? JSON.stringify(details.body).substring(0, 1000) : null,
        details: JSON.stringify(details),
        timestamp: new Date(),
        threatLevel: details.threatLevel || 'low'
      };

      // Salvar no banco de dados
      await SecurityLog.create(securityEntry);

      // Log no arquivo de seguranÃ§a
      this.securityLogger.warn('Security Event', securityEntry);

      // Log no console se for crÃ­tico
      if (severity === 'critical') {
        if (process.env.NODE_ENV !== 'production') {
          logger.error('ðŸš¨ CRITICAL SECURITY EVENT:', securityEntry);
        }
      }

      return securityEntry;
    } catch (error) {
      this.logger.error('Error logging security event:', error);
      throw error;
    }
  }

  // Log de performance
  async logPerformance(operation, duration, details = {}) {
    try {
      const perfEntry = {
        operation,
        duration,
        timestamp: new Date(),
        details: JSON.stringify(details),
        metadata: {
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          uptime: process.uptime()
        }
      };

      // Log no arquivo
      this.logger.info('Performance', perfEntry);

      // Alertar se performance estiver ruim
      if (duration > 5000) {
        // 5 segundos
        this.logger.warn('Slow Operation', perfEntry);
      }

      return perfEntry;
    } catch (error) {
      this.logger.error('Error logging performance:', error);
      throw error;
    }
  }

  // Log de erro
  async logError(error, context = {}) {
    try {
      const errorEntry = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        context: JSON.stringify(context),
        metadata: {
          url: context.url,
          method: context.method,
          userId: context.userId,
          ip: context.ip,
          userAgent: context.userAgent
        }
      };

      // Log no arquivo de erro
      this.logger.error('Application Error', errorEntry);

      // Salvar no banco se for crÃ­tico
      if (context.severity === 'critical') {
        await SecurityLog.create({
          eventType: 'system_error',
          severity: 'critical',
          description: `Critical error: ${error.message}`,
          details: JSON.stringify(errorEntry),
          timestamp: new Date()
        });
      }

      return errorEntry;
    } catch (logError) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Error logging error:', logError);
      }
      throw logError;
    }
  }

  // Log de transaÃ§Ã£o financeira
  async logFinancialTransaction(transactionId, type, amount, details = {}) {
    try {
      const transactionEntry = {
        transactionId,
        type,
        amount,
        currency: details.currency || 'BRL',
        userId: details.userId,
        userEmail: details.userEmail,
        paymentMethod: details.paymentMethod,
        status: details.status,
        timestamp: new Date(),
        details: JSON.stringify(details),
        ip: details.ip,
        userAgent: details.userAgent
      };

      // Salvar no banco
      await AuditLog.create({
        userId: details.userId,
        userEmail: details.userEmail,
        action: 'FINANCIAL_TRANSACTION',
        resource: 'payment',
        resourceId: transactionId,
        details: JSON.stringify(transactionEntry),
        ip: details.ip,
        userAgent: details.userAgent,
        timestamp: new Date()
      });

      // Log no arquivo
      this.logger.info('Financial Transaction', transactionEntry);

      return transactionEntry;
    } catch (error) {
      this.logger.error('Error logging financial transaction:', error);
      throw error;
    }
  }

  // Log de acesso a dados sensÃ­veis
  async logDataAccess(userId, dataType, action, details = {}) {
    try {
      const accessEntry = {
        userId,
        userEmail: details.userEmail,
        dataType,
        action,
        timestamp: new Date(),
        details: JSON.stringify(details),
        ip: details.ip,
        userAgent: details.userAgent,
        reason: details.reason || 'Business need'
      };

      // Salvar no banco
      await AuditLog.create({
        userId,
        userEmail: details.userEmail,
        action: 'DATA_ACCESS',
        resource: dataType,
        resourceId: details.resourceId,
        details: JSON.stringify(accessEntry),
        ip: details.ip,
        userAgent: details.userAgent,
        timestamp: new Date()
      });

      // Log no arquivo
      this.logger.info('Data Access', accessEntry);

      return accessEntry;
    } catch (error) {
      this.logger.error('Error logging data access:', error);
      throw error;
    }
  }

  // Log de mudanÃ§a de configuraÃ§Ã£o
  async logConfigurationChange(userId, configKey, oldValue, newValue, details = {}) {
    try {
      const configEntry = {
        userId,
        userEmail: details.userEmail,
        configKey,
        oldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue,
        newValue: typeof newValue === 'object' ? JSON.stringify(newValue) : newValue,
        timestamp: new Date(),
        details: JSON.stringify(details),
        ip: details.ip,
        userAgent: details.userAgent
      };

      // Salvar no banco
      await AuditLog.create({
        userId,
        userEmail: details.userEmail,
        action: 'CONFIGURATION_CHANGE',
        resource: 'system_config',
        resourceId: configKey,
        details: JSON.stringify(configEntry),
        ip: details.ip,
        userAgent: details.userAgent,
        timestamp: new Date()
      });

      // Log no arquivo
      this.logger.info('Configuration Change', configEntry);

      return configEntry;
    } catch (error) {
      this.logger.error('Error logging configuration change:', error);
      throw error;
    }
  }

  // Obter logs de auditoria
  async getAuditLogs(filters = {}) {
    try {
      const query = {};

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.action) {
        query.action = filters.action;
      }

      if (filters.resource) {
        query.resource = filters.resource;
      }

      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(filters.limit || 100)
        .skip(filters.skip || 0);

      return logs;
    } catch (error) {
      this.logger.error('Error getting audit logs:', error);
      throw error;
    }
  }

  // Obter logs de seguranÃ§a
  async getSecurityLogs(filters = {}) {
    try {
      const query = {};

      if (filters.eventType) {
        query.eventType = filters.eventType;
      }

      if (filters.severity) {
        query.severity = filters.severity;
      }

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const logs = await SecurityLog.find(query)
        .sort({ timestamp: -1 })
        .limit(filters.limit || 100)
        .skip(filters.skip || 0);

      return logs;
    } catch (error) {
      this.logger.error('Error getting security logs:', error);
      throw error;
    }
  }

  // Gerar relatÃ³rio de auditoria
  async generateAuditReport(startDate, endDate, filters = {}) {
    try {
      const query = {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.action) {
        query.action = filters.action;
      }

      // AgregaÃ§Ã£o para estatÃ­sticas
      const stats = await AuditLog.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            action: '$_id',
            count: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        }
      ]);

      // Logs detalhados
      const logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(1000);

      return {
        period: { startDate, endDate },
        statistics: stats,
        logs,
        totalLogs: logs.length,
        generatedAt: new Date()
      };
    } catch (error) {
      this.logger.error('Error generating audit report:', error);
      throw error;
    }
  }

  // Limpar logs antigos
  async cleanupOldLogs(retentionDays = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      // Limpar logs de auditoria antigos
      const auditResult = await AuditLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      // Limpar logs de seguranÃ§a antigos
      const securityResult = await SecurityLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      this.logger.info('Log cleanup completed', {
        auditLogsDeleted: auditResult.deletedCount,
        securityLogsDeleted: securityResult.deletedCount,
        cutoffDate
      });

      return {
        auditLogsDeleted: auditResult.deletedCount,
        securityLogsDeleted: securityResult.deletedCount
      };
    } catch (error) {
      this.logger.error('Error cleaning up old logs:', error);
      throw error;
    }
  }

  // Exportar logs
  async exportLogs(startDate, endDate, format = 'json') {
    try {
      const query = {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const auditLogs = await AuditLog.find(query).sort({ timestamp: -1 });
      const securityLogs = await SecurityLog.find(query).sort({ timestamp: -1 });

      const exportData = {
        auditLogs,
        securityLogs,
        exportedAt: new Date(),
        period: { startDate, endDate }
      };

      if (format === 'csv') {
        // Implementar exportaÃ§Ã£o CSV
        return this.exportToCSV(exportData);
      }

      return exportData;
    } catch (error) {
      this.logger.error('Error exporting logs:', error);
      throw error;
    }
  }

  // Exportar para CSV
  exportToCSV(data) {
    // Implementar exportaÃ§Ã£o CSV
    const csv = this.convertToCSV(data);
    return csv;
  }

  // Converter para CSV
  convertToCSV(data) {
    // Implementar conversÃ£o para CSV
    return JSON.stringify(data, null, 2);
  }
}

// ===== MIDDLEWARE DE LOGGING =====

export const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  // Adicionar request ID ao request
  req.requestId = requestId;

  // Log da requisiÃ§Ã£o
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date()
  });

  // Interceptar resposta
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    // Log da resposta
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      responseSize: data ? data.length : 0,
      userId: req.user?.id
    });

    return originalSend.call(this, data);
  };

  next();
};

// ===== MIDDLEWARE DE AUDITORIA =====

export const auditMiddleware = (action, resource) => {
  return async (req, res, next) => {
    try {
      const auditSystem = new AuditSystem();

      // Log da aÃ§Ã£o
      await auditSystem.logUserActivity(req.user?.id, action, resource, {
        userEmail: req.user?.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.originalUrl,
        requestId: req.requestId,
        body: req.body,
        params: req.params,
        query: req.query
      });

      next();
    } catch (error) {
      logger.error('Error in audit middleware:', error);
      next();
    }
  };
};

// ===== MIDDLEWARE DE SEGURANÃ‡A =====

export const securityLoggingMiddleware = (req, res, next) => {
  const auditSystem = new AuditSystem();

  // Detectar atividade suspeita
  const suspiciousPatterns = [
    /union\s+select/i,
    /<script/i,
    /javascript:/i,
    /\.\.\//i,
    /eval\s*\(/i
  ];

  const requestData = JSON.stringify({
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    headers: req.headers
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));

  if (isSuspicious) {
    auditSystem.logSecurityEvent(
      'suspicious_activity',
      'high',
      'Suspicious pattern detected in request',
      {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
        headers: req.headers,
        threatLevel: 'high'
      }
    );
  }

  next();
};

// Instância única do sistema de auditoria
const auditSystem = new AuditSystem();

// Expor funções utilitárias via named exports para compatibilidade
export const logUserActivity = (...args) => auditSystem.logUserActivity(...args);
export const logSecurityEvent = (...args) => auditSystem.logSecurityEvent(...args);
export const logPerformance = (...args) => auditSystem.logPerformance(...args);
export const logError = (...args) => auditSystem.logError(...args);
export const logFinancialTransaction = (...args) => auditSystem.logFinancialTransaction(...args);
export const logDataAccess = (...args) => auditSystem.logDataAccess(...args);
export const getAuditLogs = (...args) => auditSystem.getAuditLogs(...args);
export const getSecurityLogs = (...args) => auditSystem.getSecurityLogs(...args);
export const getAuditStats = (...args) => auditSystem.getAuditStats(...args);
export const cleanupOldLogs = (...args) => auditSystem.cleanupOldLogs(...args);

export default auditSystem;
