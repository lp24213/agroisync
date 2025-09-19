import AuditLog from '../models/AuditLog.js';
import crypto from 'crypto';

class AuditService {
  constructor() {
    this.encryptionKey = process.env.AUDIT_ENCRYPTION_KEY || 'default-audit-key-change-in-production';
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Criptografa dados sensíveis para armazenamento
   */
  encryptData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
      cipher.setAAD(Buffer.from('audit-data', 'utf8'));
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Erro ao criptografar dados de auditoria:', error);
      return data;
    }
  }

  /**
   * Descriptografa dados sensíveis
   */
  decryptData(encryptedData) {
    if (!encryptedData || typeof encryptedData !== 'object') {
      return encryptedData;
    }

    try {
      const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
      decipher.setAAD(Buffer.from('audit-data', 'utf8'));
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erro ao descriptografar dados de auditoria:', error);
      return encryptedData;
    }
  }

  /**
   * Registra uma ação de auditoria
   */
  async logAction({
    userId,
    action,
    resource,
    resourceId = null,
    beforeData = null,
    afterData = null,
    sessionInfo = {},
    metadata = {},
    status = 'success',
    errorMessage = null,
    sensitivityLevel = 'medium',
    containsPII = false
  }) {
    try {
      // Criptografar dados sensíveis se necessário
      let encryptedBeforeData = null;
      let encryptedAfterData = null;

      if (beforeData && containsPII) {
        encryptedBeforeData = this.encryptData(beforeData);
      }

      if (afterData && containsPII) {
        encryptedAfterData = this.encryptData(afterData);
      }

      // Criar log de auditoria
      const auditLog = new AuditLog({
        userId,
        action,
        resource,
        resourceId,
        beforeData: encryptedBeforeData,
        afterData: encryptedAfterData,
        sessionInfo: {
          ip: sessionInfo.ip || 'unknown',
          userAgent: sessionInfo.userAgent || 'unknown',
          country: sessionInfo.country || 'unknown',
          city: sessionInfo.city || 'unknown',
          isp: sessionInfo.isp || 'unknown'
        },
        metadata: {
          endpoint: metadata.endpoint || 'unknown',
          method: metadata.method || 'unknown',
          statusCode: metadata.statusCode || 200,
          responseTime: metadata.responseTime || 0,
          dataSize: metadata.dataSize || 0,
          encryptionUsed: containsPII,
          fieldsEncrypted: metadata.fieldsEncrypted || [],
          fieldsDecrypted: metadata.fieldsDecrypted || []
        },
        status,
        errorMessage,
        sensitivityLevel,
        containsPII
      });

      await auditLog.save();
      
      console.log(`Audit log created: ${action} on ${resource} by user ${userId}`);
      
      return auditLog;
    } catch (error) {
      console.error('Erro ao criar log de auditoria:', error);
      throw error;
    }
  }

  /**
   * Registra acesso a dados PII
   */
  async logPIIAccess({
    userId,
    resource,
    resourceId,
    fieldsAccessed,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'pii_access',
      resource,
      resourceId,
      afterData: { fieldsAccessed },
      sessionInfo,
      metadata: {
        ...metadata,
        fieldsDecrypted: fieldsAccessed
      },
      sensitivityLevel: 'high',
      containsPII: true
    });
  }

  /**
   * Registra criptografia de dados PII
   */
  async logPIIEncryption({
    userId,
    resource,
    resourceId,
    fieldsEncrypted,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'pii_encrypt',
      resource,
      resourceId,
      afterData: { fieldsEncrypted },
      sessionInfo,
      metadata: {
        ...metadata,
        fieldsEncrypted
      },
      sensitivityLevel: 'high',
      containsPII: true
    });
  }

  /**
   * Registra descriptografia de dados PII
   */
  async logPIIDecryption({
    userId,
    resource,
    resourceId,
    fieldsDecrypted,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'pii_decrypt',
      resource,
      resourceId,
      beforeData: { fieldsDecrypted },
      sessionInfo,
      metadata: {
        ...metadata,
        fieldsDecrypted
      },
      sensitivityLevel: 'critical',
      containsPII: true
    });
  }

  /**
   * Registra login de usuário
   */
  async logLogin({
    userId,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'login',
      resource: 'user',
      resourceId: userId,
      sessionInfo,
      metadata,
      sensitivityLevel: 'medium',
      containsPII: false
    });
  }

  /**
   * Registra logout de usuário
   */
  async logLogout({
    userId,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'logout',
      resource: 'user',
      resourceId: userId,
      sessionInfo,
      metadata,
      sensitivityLevel: 'low',
      containsPII: false
    });
  }

  /**
   * Registra mudança de senha
   */
  async logPasswordChange({
    userId,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'password_change',
      resource: 'user',
      resourceId: userId,
      sessionInfo,
      metadata,
      sensitivityLevel: 'high',
      containsPII: false
    });
  }

  /**
   * Registra acesso ao painel administrativo
   */
  async logAdminAccess({
    userId,
    resource,
    resourceId = null,
    sessionInfo,
    metadata = {}
  }) {
    return this.logAction({
      userId,
      action: 'admin_access',
      resource,
      resourceId,
      sessionInfo,
      metadata,
      sensitivityLevel: 'high',
      containsPII: false
    });
  }

  /**
   * Obtém logs de auditoria por usuário
   */
  async getUserAuditLogs(userId, limit = 100) {
    return AuditLog.findByUser(userId, limit);
  }

  /**
   * Obtém logs de acesso a dados PII
   */
  async getPIIAccessLogs(userId = null, limit = 100) {
    return AuditLog.findPIIAccess(userId, limit);
  }

  /**
   * Obtém estatísticas de auditoria
   */
  async getAuditStats(startDate, endDate) {
    return AuditLog.getAuditStats(startDate, endDate);
  }

  /**
   * Obtém logs próximos do vencimento
   */
  async getExpiringLogs() {
    return AuditLog.findExpiringLogs();
  }

  /**
   * Limpa logs expirados
   */
  async cleanExpiredLogs() {
    try {
      const result = await AuditLog.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      
      console.log(`Cleaned ${result.deletedCount} expired audit logs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Erro ao limpar logs expirados:', error);
      throw error;
    }
  }

  /**
   * Verifica integridade dos logs
   */
  async verifyLogIntegrity(logId) {
    try {
      const log = await AuditLog.findById(logId);
      if (!log) {
        throw new Error('Log não encontrado');
      }

      return log.verifyIntegrity();
    } catch (error) {
      console.error('Erro ao verificar integridade do log:', error);
      return false;
    }
  }

  /**
   * Exporta logs de auditoria para análise
   */
  async exportAuditLogs({
    startDate,
    endDate,
    userId = null,
    action = null,
    resource = null,
    containsPII = null
  }) {
    try {
      const query = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };

      if (userId) query.userId = userId;
      if (action) query.action = action;
      if (resource) query.resource = resource;
      if (containsPII !== null) query.containsPII = containsPII;

      const logs = await AuditLog.find(query)
        .sort({ createdAt: -1 })
        .limit(10000); // Limite para evitar exportações muito grandes

      return logs.map(log => ({
        id: log._id,
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        status: log.status,
        sensitivityLevel: log.sensitivityLevel,
        containsPII: log.containsPII,
        createdAt: log.createdAt,
        sessionInfo: log.sessionInfo,
        metadata: log.metadata
        // Não incluir dados criptografados na exportação
      }));
    } catch (error) {
      console.error('Erro ao exportar logs de auditoria:', error);
      throw error;
    }
  }
}

export default new AuditService();
