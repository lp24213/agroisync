import rateLimit from 'express-rate-limit';
import { createSecurityLog } from '../utils/securityLogger.js';

// ===== PROTEÇÃO DDoS =====

// Rate limiting específico para APIs sensíveis
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições para esta API. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('rate_limit_exceeded', 'high', 'API rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Muitas requisições para esta API. Tente novamente em alguns minutos.'
    });
  }
});

// Rate limiting para autenticação
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('auth_rate_limit_exceeded', 'high', 'Auth rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    });
  }
});

// Rate limiting para pagamentos
export const paymentRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 tentativas de pagamento por IP
  message: {
    success: false,
    message: 'Muitas tentativas de pagamento. Tente novamente em algumas horas.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('payment_rate_limit_exceeded', 'high', 'Payment rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de pagamento. Tente novamente em algumas horas.'
    });
  }
});

// ===== PROTEÇÃO WAF =====

// Middleware para detectar ataques comuns
export const wafProtection = (req, res, next) => {
  try {
    const { url, method, headers, body } = req;
    
    // Detectar SQL Injection
    const sqlInjectionPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
      /(\b(union|select|insert|update|delete|drop|create|alter)\s+.*\b(union|select|insert|update|delete|drop|create|alter)\b)/i
    ];
    
    // Detectar XSS
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];
    
    // Detectar NoSQL Injection
    const nosqlPatterns = [
      /\$where/i,
      /\$ne/i,
      /\$gt/i,
      /\$lt/i,
      /\$regex/i,
      /\$exists/i
    ];
    
    // Verificar URL
    const urlString = url + JSON.stringify(body || {});
    
    // Verificar SQL Injection
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(urlString)) {
        await createSecurityLog('security_threat', 'critical', 'SQL Injection attempt detected', req);
        return res.status(403).json({
          success: false,
          message: 'Acesso negado por segurança'
        });
      }
    }
    
    // Verificar XSS
    for (const pattern of xssPatterns) {
      if (pattern.test(urlString)) {
        await createSecurityLog('security_threat', 'critical', 'XSS attempt detected', req);
        return res.status(403).json({
          success: false,
          message: 'Acesso negado por segurança'
        });
      }
    }
    
    // Verificar NoSQL Injection
    for (const pattern of nosqlPatterns) {
      if (pattern.test(urlString)) {
        await createSecurityLog('security_threat', 'critical', 'NoSQL Injection attempt detected', req);
        return res.status(403).json({
          success: false,
          message: 'Acesso negado por segurança'
        });
      }
    }
    
    // Verificar headers suspeitos
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-forwarded-proto',
      'x-forwarded-host'
    ];
    
    for (const header of suspiciousHeaders) {
      if (headers[header] && !isValidIP(headers[header])) {
        await createSecurityLog('security_threat', 'high', 'Suspicious header detected', req);
        return res.status(403).json({
          success: false,
          message: 'Acesso negado por segurança'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in WAF protection:', error);
    next();
  }
};

// ===== VALIDAÇÃO DE IP =====

function isValidIP(ip) {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// ===== MIDDLEWARE DE LOGS DE SEGURANÇA =====

// Middleware para logar todas as requisições
export const securityLogging = async (req, res, next) => {
  try {
    const startTime = Date.now();
    
    // Log da requisição
    await createSecurityLog('request_log', 'low', 'HTTP request received', req, null, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date()
    });
    
    // Interceptar resposta para logar tempo de resposta
    const originalSend = res.send;
    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      
      // Log da resposta
      createSecurityLog('response_log', 'low', 'HTTP response sent', req, null, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime,
        timestamp: new Date()
      });
      
      originalSend.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Error in security logging:', error);
    next();
  }
};

// ===== MIDDLEWARE DE VALIDAÇÃO DE CONTEÚDO =====

// Middleware para validar tamanho de uploads
export const contentValidation = (maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      createSecurityLog('security_threat', 'high', 'Large content upload attempt', req);
      return res.status(413).json({
        success: false,
        message: 'Conteúdo muito grande'
      });
    }
    
    next();
  };
};

// ===== MIDDLEWARE DE PROTEÇÃO CONTRA ATAQUES DE FORÇA BRUTA =====

// Cache para tentativas de login
const loginAttempts = new Map();

export const bruteForceProtection = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 0, firstAttempt: now });
  }
  
  const attempts = loginAttempts.get(ip);
  
  // Reset se passou da janela de tempo
  if (now - attempts.firstAttempt > windowMs) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }
  
  // Verificar se excedeu o limite
  if (attempts.count >= 10) {
    createSecurityLog('security_threat', 'high', 'Brute force attack detected', req);
    return res.status(429).json({
      success: false,
      message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    });
  }
  
  // Incrementar contador para requisições de login
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    attempts.count++;
  }
  
  next();
};

// Limpar cache periodicamente
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  
  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now - attempts.firstAttempt > windowMs) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // A cada 5 minutos
