import auditService from '../services/auditService.js';

/**
 * Middleware para capturar informações de sessão para auditoria
 */
export const captureSessionInfo = (req, res, next) => {
  // Capturar informações básicas da sessão
  req.sessionInfo = {
    ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
    userAgent: req.get('User-Agent') || 'unknown',
    country: req.get('CF-IPCountry') || 'unknown', // Cloudflare
    city: req.get('CF-IPCity') || 'unknown', // Cloudflare
    isp: req.get('CF-IPISP') || 'unknown' // Cloudflare
  };

  // Capturar informações adicionais se disponíveis
  if (req.headers['x-forwarded-for']) {
    req.sessionInfo.ip = req.headers['x-forwarded-for'].split(',')[0];
  }

  if (req.headers['x-real-ip']) {
    req.sessionInfo.ip = req.headers['x-real-ip'];
  }

  // Capturar informações de geolocalização se disponíveis
  if (req.headers['x-geo-country']) {
    req.sessionInfo.country = req.headers['x-geo-country'];
  }

  if (req.headers['x-geo-city']) {
    req.sessionInfo.city = req.headers['x-geo-city'];
  }

  next();
};

/**
 * Middleware para capturar metadados da requisição
 */
export const captureRequestMetadata = (req, res, next) => {
  const startTime = Date.now();

  // Capturar metadados da requisição
  req.requestMetadata = {
    endpoint: req.originalUrl,
    method: req.method,
    timestamp: startTime,
    headers: {
      'content-type': req.get('Content-Type'),
      'content-length': req.get('Content-Length'),
      'accept': req.get('Accept'),
      'accept-language': req.get('Accept-Language'),
      'accept-encoding': req.get('Accept-Encoding')
    }
  };

  // Interceptar resposta para capturar metadados
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Adicionar metadados de resposta
    req.requestMetadata.responseTime = responseTime;
    req.requestMetadata.statusCode = res.statusCode;
    req.requestMetadata.dataSize = data ? data.length : 0;

    // Chamar método original
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware para capturar dados PII em requisições
 */
export const capturePIIData = (req, res, next) => {
  // Campos que podem conter dados PII
  const piiFields = [
    'cpf', 'cnpj', 'rg', 'passport',
    'email', 'phone', 'address',
    'taxId', 'businessId', 'personalId',
    'bankAccount', 'creditCard', 'ssn'
  ];

  // Capturar dados PII do body da requisição
  if (req.body) {
    req.piiData = {};
    
    for (const field of piiFields) {
      if (req.body[field]) {
        req.piiData[field] = req.body[field];
      }
    }
  }

  // Capturar dados PII dos parâmetros da query
  if (req.query) {
    for (const field of piiFields) {
      if (req.query[field]) {
        req.piiData = req.piiData || {};
        req.piiData[field] = req.query[field];
      }
    }
  }

  next();
};

/**
 * Middleware para registrar ações de auditoria automaticamente
 */
export const autoAuditLog = (options = {}) => {
  return async (req, res, next) => {
    try {
      // Verificar se deve registrar a ação
      const shouldLog = options.actions?.includes(req.method.toLowerCase()) || 
                       options.resources?.includes(req.route?.path) ||
                       options.always;

      if (!shouldLog) {
        return next();
      }

      // Capturar dados antes da ação
      const beforeData = req.method.toLowerCase() === 'put' || 
                        req.method.toLowerCase() === 'patch' ? 
                        req.body : null;

      // Interceptar resposta para capturar dados após a ação
      const originalSend = res.send;
      res.send = function(data) {
        // Registrar ação de auditoria
        if (req.user && res.statusCode < 400) {
          auditService.logAction({
            userId: req.user.id,
            action: req.method.toLowerCase(),
            resource: options.resource || req.route?.path || 'unknown',
            resourceId: req.params.id || null,
            beforeData,
            afterData: res.statusCode === 200 ? data : null,
            sessionInfo: req.sessionInfo,
            metadata: req.requestMetadata,
            status: res.statusCode < 400 ? 'success' : 'failed',
            errorMessage: res.statusCode >= 400 ? data : null,
            sensitivityLevel: options.sensitivityLevel || 'medium',
            containsPII: !!req.piiData
          }).catch(error => {
            console.error('Erro ao registrar log de auditoria:', error);
          });
        }

        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de auditoria:', error);
      next();
    }
  };
};

/**
 * Middleware para registrar acesso a dados PII
 */
export const auditPIIAccess = (fields = []) => {
  return async (req, res, next) => {
    try {
      if (req.user && fields.length > 0) {
        // Verificar se algum campo PII foi acessado
        const accessedFields = fields.filter(field => 
          req.body?.[field] || req.query?.[field] || req.params?.[field]
        );

        if (accessedFields.length > 0) {
          await auditService.logPIIAccess({
            userId: req.user.id,
            resource: req.route?.path || 'unknown',
            resourceId: req.params.id || null,
            fieldsAccessed: accessedFields,
            sessionInfo: req.sessionInfo,
            metadata: req.requestMetadata
          });
        }
      }

      next();
    } catch (error) {
      console.error('Erro ao registrar acesso a dados PII:', error);
      next();
    }
  };
};

/**
 * Middleware para registrar criptografia de dados PII
 */
export const auditPIIEncryption = (fields = []) => {
  return async (req, res, next) => {
    try {
      if (req.user && fields.length > 0) {
        // Verificar se algum campo PII foi criptografado
        const encryptedFields = fields.filter(field => 
          req.body?.[field] && typeof req.body[field] === 'object' && 
          req.body[field].encrypted
        );

        if (encryptedFields.length > 0) {
          await auditService.logPIIEncryption({
            userId: req.user.id,
            resource: req.route?.path || 'unknown',
            resourceId: req.params.id || null,
            fieldsEncrypted: encryptedFields,
            sessionInfo: req.sessionInfo,
            metadata: req.requestMetadata
          });
        }
      }

      next();
    } catch (error) {
      console.error('Erro ao registrar criptografia de dados PII:', error);
      next();
    }
  };
};

/**
 * Middleware para registrar descriptografia de dados PII
 */
export const auditPIIDecryption = (fields = []) => {
  return async (req, res, next) => {
    try {
      if (req.user && fields.length > 0) {
        // Verificar se algum campo PII foi descriptografado
        const decryptedFields = fields.filter(field => 
          req.body?.[field] && typeof req.body[field] === 'object' && 
          req.body[field].decrypted
        );

        if (decryptedFields.length > 0) {
          await auditService.logPIIDecryption({
            userId: req.user.id,
            resource: req.route?.path || 'unknown',
            resourceId: req.params.id || null,
            fieldsDecrypted: decryptedFields,
            sessionInfo: req.sessionInfo,
            metadata: req.requestMetadata
          });
        }
      }

      next();
    } catch (error) {
      console.error('Erro ao registrar descriptografia de dados PII:', error);
      next();
    }
  };
};

export default {
  captureSessionInfo,
  captureRequestMetadata,
  capturePIIData,
  autoAuditLog,
  auditPIIAccess,
  auditPIIEncryption,
  auditPIIDecryption
};
