import SecurityLog from '../models/SecurityLog.js';
import { getClientIP } from './ipUtils.js';

// ===== LOGGER DE SEGURANÇA =====

/**
 * Criar log de segurança
 * @param {string} eventType - Tipo do evento
 * @param {string} severity - Severidade (low, medium, high, critical)
 * @param {string} description - Descrição do evento
 * @param {Object} req - Objeto de requisição Express
 * @param {string} userId - ID do usuário (opcional)
 * @param {Object} additionalData - Dados adicionais (opcional)
 */
export const createSecurityLog = async (eventType, severity, description, req, userId = null, additionalData = {}) => {
  try {
    // Validar parâmetros
    if (!eventType || !severity || !description) {
      console.error('Security log: Parâmetros inválidos', { eventType, severity, description });
      return;
    }

    // Validar severidade
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      console.error('Security log: Severidade inválida', { severity });
      return;
    }

    // Obter informações da requisição
    const requestInfo = req ? {
      method: req.method,
      url: req.originalUrl,
      headers: sanitizeHeaders(req.headers),
      userAgent: req.get('User-Agent'),
      ipAddress: getClientIP(req),
      timestamp: new Date()
    } : null;

    // Criar log de segurança
    const securityLog = new SecurityLog({
      eventType,
      severity,
      description,
      userId,
      ipAddress: requestInfo?.ipAddress || 'unknown',
      userAgent: requestInfo?.userAgent || 'unknown',
      requestMethod: requestInfo?.method || 'unknown',
      requestUrl: requestInfo?.url || 'unknown',
      requestHeaders: requestInfo?.headers || {},
      geolocation: requestInfo ? getGeolocation(req) : {},
      cloudflare: requestInfo ? getCloudflareInfo(req) : {},
      details: {
        ...additionalData,
        timestamp: requestInfo?.timestamp || new Date()
      }
    });

    await securityLog.save();

    // Log no console para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 Security Log [${severity.toUpperCase()}]: ${eventType} - ${description}`);
    }

  } catch (error) {
    console.error('Error creating security log:', error);
    
    // Fallback: log no console se não conseguir salvar no banco
    console.error(`🔒 SECURITY LOG ERROR [${severity?.toUpperCase()}]: ${eventType} - ${description}`);
    console.error('Additional data:', additionalData);
    console.error('Error:', error.message);
  }
};

/**
 * Criar log de segurança sem requisição (para eventos do sistema)
 * @param {string} eventType - Tipo do evento
 * @param {string} severity - Severidade
 * @param {string} description - Descrição do evento
 * @param {Object} additionalData - Dados adicionais
 */
export const createSystemSecurityLog = async (eventType, severity, description, additionalData = {}) => {
  try {
    const securityLog = new SecurityLog({
      eventType,
      severity,
      description,
      ipAddress: 'system',
      userAgent: 'system',
      requestMethod: 'SYSTEM',
      requestUrl: 'SYSTEM',
      requestHeaders: {},
      geolocation: {},
      cloudflare: {},
      details: {
        ...additionalData,
        timestamp: new Date(),
        source: 'system'
      }
    });

    await securityLog.save();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 System Security Log [${severity.toUpperCase()}]: ${eventType} - ${description}`);
    }

  } catch (error) {
    console.error('Error creating system security log:', error);
    console.error(`🔒 SYSTEM SECURITY LOG ERROR [${severity?.toUpperCase()}]: ${eventType} - ${description}`);
  }
};

/**
 * Criar log de auditoria
 * @param {string} action - Ação realizada
 * @param {string} resource - Recurso afetado
 * @param {Object} req - Objeto de requisição
 * @param {string} userId - ID do usuário
 * @param {Object} changes - Mudanças realizadas
 */
export const createAuditLog = async (action, resource, req, userId, changes = {}) => {
  try {
    const auditLog = new SecurityLog({
      eventType: 'audit',
      severity: 'low',
      description: `${action} em ${resource}`,
      userId,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: sanitizeHeaders(req.headers),
      geolocation: getGeolocation(req),
      cloudflare: getCloudflareInfo(req),
      details: {
        action,
        resource,
        changes,
        timestamp: new Date()
      }
    });

    await auditLog.save();

    if (process.env.NODE_ENV === 'development') {
      console.log(`📋 Audit Log: ${action} em ${resource} por usuário ${userId}`);
    }

  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

/**
 * Criar log de acesso
 * @param {string} resource - Recurso acessado
 * @param {Object} req - Objeto de requisição
 * @param {string} userId - ID do usuário
 * @param {Object} metadata - Metadados adicionais
 */
export const createAccessLog = async (resource, req, userId, metadata = {}) => {
  try {
    const accessLog = new SecurityLog({
      eventType: 'data_access',
      severity: 'low',
      description: `Acesso a ${resource}`,
      userId,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: sanitizeHeaders(req.headers),
      geolocation: getGeolocation(req),
      cloudflare: getCloudflareInfo(req),
      details: {
        resource,
        ...metadata,
        timestamp: new Date()
      }
    });

    await accessLog.save();

  } catch (error) {
    console.error('Error creating access log:', error);
  }
};

/**
 * Criar log de modificação de dados
 * @param {string} resource - Recurso modificado
 * @param {string} action - Ação realizada
 * @param {Object} req - Objeto de requisição
 * @param {string} userId - ID do usuário
 * @param {Object} changes - Mudanças realizadas
 */
export const createDataModificationLog = async (resource, action, req, userId, changes = {}) => {
  try {
    const modificationLog = new SecurityLog({
      eventType: 'data_modification',
      severity: 'medium',
      description: `${action} em ${resource}`,
      userId,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: sanitizeHeaders(req.headers),
      geolocation: getGeolocation(req),
      cloudflare: getCloudflareInfo(req),
      details: {
        resource,
        action,
        changes,
        timestamp: new Date()
      }
    });

    await modificationLog.save();

    if (process.env.NODE_ENV === 'development') {
      console.log(`✏️ Data Modification Log: ${action} em ${resource} por usuário ${userId}`);
    }

  } catch (error) {
    console.error('Error creating data modification log:', error);
  }
};

// ===== FUNÇÕES AUXILIARES =====

/**
 * Sanitizar headers da requisição (remover dados sensíveis)
 * @param {Object} headers - Headers da requisição
 * @returns {Object} Headers sanitizados
 */
const sanitizeHeaders = (headers) => {
  const sanitized = { ...headers };
  
  // Remover headers sensíveis
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'x-csrf-token'
  ];
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Obter informações de geolocalização
 * @param {Object} req - Objeto de requisição
 * @returns {Object} Informações de geolocalização
 */
const getGeolocation = (req) => {
  return {
    country: req.headers['cf-ipcountry'] || req.headers['x-forwarded-country'] || 'Unknown',
    region: req.headers['cf-ipregion'] || req.headers['x-forwarded-region'] || 'Unknown',
    city: req.headers['cf-ipcity'] || req.headers['x-forwarded-city'] || 'Unknown',
    timezone: req.headers['cf-timezone'] || 'Unknown'
  };
};

/**
 * Obter informações do Cloudflare
 * @param {Object} req - Objeto de requisição
 * @returns {Object} Informações do Cloudflare
 */
const getCloudflareInfo = (req) => {
  return {
    rayId: req.headers['cf-ray'] || null,
    country: req.headers['cf-ipcountry'] || null,
    threatScore: parseInt(req.headers['cf-threat-score']) || 0,
    botScore: parseInt(req.headers['cf-bot-score']) || 0,
    visitor: req.headers['cf-visitor'] || null,
    cacheStatus: req.headers['cf-cache-status'] || null
  };
};

/**
 * Obter estatísticas de logs de segurança
 * @param {Object} filters - Filtros para as estatísticas
 * @returns {Object} Estatísticas dos logs
 */
export const getSecurityLogStats = async (filters = {}) => {
  try {
    const matchStage = {};
    
    if (filters.eventType) matchStage.eventType = filters.eventType;
    if (filters.severity) matchStage.severity = filters.severity;
    if (filters.userId) matchStage.userId = filters.userId;
    if (filters.startDate) matchStage.createdAt = { $gte: new Date(filters.startDate) };
    if (filters.endDate) {
      if (matchStage.createdAt) {
        matchStage.createdAt.$lte = new Date(filters.endDate);
      } else {
        matchStage.createdAt = { $lte: new Date(filters.endDate) };
      }
    }

    const stats = await SecurityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          bySeverity: {
            $push: {
              severity: '$severity',
              description: '$description',
              timestamp: '$createdAt'
            }
          }
        }
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          bySeverity: 1,
          criticalCount: {
            $size: {
              $filter: {
                input: '$bySeverity',
                cond: { $eq: ['$$this.severity', 'critical'] }
              }
            }
          },
          highCount: {
            $size: {
              $filter: {
                input: '$bySeverity',
                cond: { $eq: ['$$this.severity', 'high'] }
              }
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  } catch (error) {
    console.error('Error getting security log stats:', error);
    return [];
  }
};

/**
 * Limpar logs antigos (manutenção)
 * @param {number} daysToKeep - Número de dias para manter
 * @returns {number} Número de logs removidos
 */
export const cleanupOldLogs = async (daysToKeep = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await SecurityLog.deleteMany({
      createdAt: { $lt: cutoffDate },
      severity: { $in: ['low', 'medium'] } // Manter logs críticos e de alta severidade
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`🧹 Cleaned up ${result.deletedCount} old security logs`);
    }

    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    return 0;
  }
};

export default {
  createSecurityLog,
  createSystemSecurityLog,
  createAuditLog,
  createAccessLog,
  createDataModificationLog,
  getSecurityLogStats,
  cleanupOldLogs
};


