import crypto from 'crypto';
import logger from '../utils/logger.js';

class PIIEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
    
    // Chave de criptografia (deve vir de variável de ambiente)
    this.encryptionKey = process.env.PII_ENCRYPTION_KEY;
    
    if (!this.encryptionKey) {
      logger.warn('PII_ENCRYPTION_KEY não configurada, usando chave temporária');
      this.encryptionKey = crypto.randomBytes(this.keyLength).toString('hex');
    }
    
    // Converter chave para buffer se necessário
    if (typeof this.encryptionKey === 'string') {
      this.encryptionKey = Buffer.from(this.encryptionKey, 'hex');
    }
  }

  /**
   * Criptografar dados PII
   */
  encrypt(text) {
    try {
      if (!text) return null;
      
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
      cipher.setAAD(Buffer.from('agroisync-pii', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combinar IV + tag + dados criptografados
      const combined = Buffer.concat([
        iv,
        tag,
        Buffer.from(encrypted, 'hex')
      ]);
      
      return combined.toString('base64');
    } catch (error) {
      logger.error('Erro ao criptografar dados PII:', error);
      throw new Error('Falha na criptografia de dados sensíveis');
    }
  }

  /**
   * Descriptografar dados PII
   */
  decrypt(encryptedData) {
    try {
      if (!encryptedData) return null;
      
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extrair componentes
      const iv = combined.subarray(0, this.ivLength);
      const tag = combined.subarray(this.ivLength, this.ivLength + this.tagLength);
      const encrypted = combined.subarray(this.ivLength + this.tagLength);
      
      const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
      decipher.setAAD(Buffer.from('agroisync-pii', 'utf8'));
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, null, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      logger.error('Erro ao descriptografar dados PII:', error);
      throw new Error('Falha na descriptografia de dados sensíveis');
    }
  }

  /**
   * Criptografar objeto com campos PII
   */
  encryptObject(obj, piiFields = []) {
    try {
      const encrypted = { ...obj };
      
      piiFields.forEach(field => {
        if (obj[field] && typeof obj[field] === 'string') {
          encrypted[field] = this.encrypt(obj[field]);
        }
      });
      
      return encrypted;
    } catch (error) {
      logger.error('Erro ao criptografar objeto PII:', error);
      throw error;
    }
  }

  /**
   * Descriptografar objeto com campos PII
   */
  decryptObject(obj, piiFields = []) {
    try {
      const decrypted = { ...obj };
      
      piiFields.forEach(field => {
        if (obj[field] && typeof obj[field] === 'string') {
          decrypted[field] = this.decrypt(obj[field]);
        }
      });
      
      return decrypted;
    } catch (error) {
      logger.error('Erro ao descriptografar objeto PII:', error);
      throw error;
    }
  }

  /**
   * Gerar hash para auditoria
   */
  generateAuditHash(data, userId, action) {
    try {
      const timestamp = new Date().toISOString();
      const dataString = JSON.stringify(data);
      
      const hash = crypto.createHash('sha256')
        .update(`${dataString}:${userId}:${action}:${timestamp}`)
        .digest('hex');
      
      return {
        hash,
        timestamp,
        userId,
        action
      };
    } catch (error) {
      logger.error('Erro ao gerar hash de auditoria:', error);
      throw error;
    }
  }

  /**
   * Verificar integridade dos dados
   */
  verifyIntegrity(originalHash, data, userId, action) {
    try {
      const currentHash = this.generateAuditHash(data, userId, action);
      return currentHash.hash === originalHash;
    } catch (error) {
      logger.error('Erro ao verificar integridade:', error);
      return false;
    }
  }
}

// Middleware para criptografar dados PII automaticamente
export const encryptPII = (fields = []) => {
  return (req, res, next) => {
    const piiEncryption = new PIIEncryption();
    
    // Armazenar instância no request para uso posterior
    req.piiEncryption = piiEncryption;
    
    // Interceptar dados antes de salvar
    const originalSend = res.send;
    res.send = function(data) {
      if (data && typeof data === 'object') {
        try {
          const encryptedData = piiEncryption.encryptObject(data, fields);
          return originalSend.call(this, encryptedData);
        } catch (error) {
          logger.error('Erro ao criptografar resposta:', error);
          return originalSend.call(this, data);
        }
      }
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Middleware para descriptografar dados PII automaticamente
export const decryptPII = (fields = []) => {
  return (req, res, next) => {
    const piiEncryption = new PIIEncryption();
    
    // Armazenar instância no request
    req.piiEncryption = piiEncryption;
    
    // Interceptar dados antes de enviar resposta
    const originalSend = res.send;
    res.send = function(data) {
      if (data && typeof data === 'object') {
        try {
          const decryptedData = piiEncryption.decryptObject(data, fields);
          return originalSend.call(this, decryptedData);
        } catch (error) {
          logger.error('Erro ao descriptografar resposta:', error);
          return originalSend.call(this, data);
        }
      }
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Middleware para auditoria de acesso a dados PII
export const auditPIIAccess = (action) => {
  return (req, res, next) => {
    const piiEncryption = new PIIEncryption();
    const userId = req.user?.id || 'anonymous';
    
    // Log de acesso
    const auditLog = {
      timestamp: new Date(),
      userId,
      action,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      method: req.method
    };
    
    logger.info('Acesso a dados PII:', auditLog);
    
    // Armazenar log de auditoria
    req.auditLog = auditLog;
    
    next();
  };
};

export default new PIIEncryption();
