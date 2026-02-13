import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { AuditLog } from '../models/AuditLog.js';
import { SecurityLog } from '../models/SecurityLog.js';

import logger from '../utils/logger.js';
// ===== CONFIGURAÃ‡Ã•ES DE SEGURANÃ‡A =====

const securityConfig = {
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: {
      public: 100,
      authenticated: 500,
      admin: 1000,
      critical: 10
    },
    message: {
      success: false,
      message: 'Muitas tentativas. Tente novamente em 15 minutos.',
      retryAfter: '15 minutos'
    }
  },

  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
      'X-API-Key'
    ]
  },

  // Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net'
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://api.github.com', 'wss:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }
};

// ===== MIDDLEWARE DE RATE LIMITING =====

export const createRateLimiter = (max = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max,
    message: securityConfig.rateLimit.message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
      // Log de rate limiting
      await SecurityLog.create({
        eventType: 'rate_limit_exceeded',
        severity: 'medium',
        description: `Rate limit exceeded: ${max} requests in ${windowMs}ms`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        details: {
          limit: max,
          windowMs,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(429).json(securityConfig.rateLimit.message);
    }
  });
};

// Rate limiters especÃ­ficos
export const publicRateLimit = createRateLimiter(securityConfig.rateLimit.max.public);
export const authenticatedRateLimit = createRateLimiter(securityConfig.rateLimit.max.authenticated);
export const adminRateLimit = createRateLimiter(securityConfig.rateLimit.max.admin);
export const criticalRateLimit = createRateLimiter(securityConfig.rateLimit.max.critical);

// ===== MIDDLEWARE DE SEGURANÃ‡A PRINCIPAL =====

export const securityMiddleware = [
  // CORS
  cors(securityConfig.cors),

  // Helmet para headers de seguranÃ§a
  helmet(securityConfig.helmet),

  // ProteÃ§Ã£o contra XSS
  xss(),

  // ProteÃ§Ã£o contra HTTP Parameter Pollution
  hpp(),

  // ProteÃ§Ã£o contra NoSQL Injection
  mongoSanitize(),

  // Middleware de detecÃ§Ã£o de ataques
  detectAttackPatterns,

  // Middleware de validaÃ§Ã£o de entrada
  validateInput,

  // Middleware de sanitizaÃ§Ã£o
  sanitizeData,

  // Middleware de logging de seguranÃ§a
  securityLogging
];

// ===== DETECÃ‡ÃƒO DE PADRÃ•ES DE ATAQUE =====

export const detectAttackPatterns = (req, res, next) => {
  try {
    const attackPatterns = [
      // SQL Injection
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b)/i,

      // XSS
      /<script|javascript:|vbscript:|onload|onerror|onclick|onmouseover/i,

      // Command Injection
      /(\b(cmd|command|exec|system|eval|setTimeout|setInterval)\b)/i,

      // Path Traversal
      /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c/i,

      // LDAP Injection
      /(\b(\(|\)|\*|\||&)\b)/i,

      // NoSQL Injection
      /(\$where|\$ne|\$gt|\$lt|\$regex)/i,

      // Template Injection
      /(\{\{.*\}\}|\{%.*%\})/i,

      // Code Injection
      /(\beval\s*\(|\bFunction\s*\(|\bnew\s+Function)/i
    ];

    const requestData = JSON.stringify({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    let attackDetected = false;
    let attackType = '';

    attackPatterns.forEach((pattern, index) => {
      if (pattern.test(requestData)) {
        attackDetected = true;
        const attackTypes = [
          'SQL_INJECTION',
          'XSS',
          'COMMAND_INJECTION',
          'PATH_TRAVERSAL',
          'LDAP_INJECTION',
          'NOSQL_INJECTION',
          'TEMPLATE_INJECTION',
          'CODE_INJECTION'
        ];
        attackType = attackTypes[index] || 'UNKNOWN_ATTACK';
      }
    });

    if (attackDetected) {
      // Log do ataque detectado
      await SecurityLog.create({
        eventType: 'suspicious_activity',
        severity: 'high',
        description: `Ataque detectado: ${attackType}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        requestHeaders: req.headers,
        requestBody: requestData.substring(0, 1000),
        details: {
          attackType,
          requestData: requestData.substring(0, 500),
          userAgent: req.get('User-Agent')
        }
      });

      // Bloquear requisiÃ§Ã£o
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: padrÃ£o suspeito detectado',
        code: 'ATTACK_DETECTED'
      });
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na detecÃ§Ã£o de ataques:', error);
    }
    next();
  }
};

// ===== VALIDAÃ‡ÃƒO DE ENTRADA =====

export const validateInput = (req, res, next) => {
  try {
    // Validar tamanho do body
    const contentLength = parseInt(req.get('content-length', 10, 10) || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Payload muito grande',
        code: 'PAYLOAD_TOO_LARGE'
      });
    }

    // Validar Content-Type
    const contentType = req.get('content-type');
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Content-Type deve ser application/json',
          code: 'INVALID_CONTENT_TYPE'
        });
      }
    }

    // Sanitizar query parameters
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeString(req.query[key]);
        }
      }
    }

    // Sanitizar body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o de entrada:', error);
    }
    res.status(400).json({
      success: false,
      message: 'Erro na validaÃ§Ã£o de entrada',
      code: 'VALIDATION_ERROR'
    });
  }
};

// ===== SANITIZAÃ‡ÃƒO DE DADOS =====

export const sanitizeData = (req, res, next) => {
  try {
    // Sanitizar headers suspeitos
    const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-cluster-client-ip'];

    suspiciousHeaders.forEach(header => {
      if (req.headers[header]) {
        req.headers[header] = sanitizeString(req.headers[header]);
      }
    });

    // Sanitizar User-Agent
    if (req.headers['user-agent']) {
      req.headers['user-agent'] = sanitizeString(req.headers['user-agent']);
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na sanitizaÃ§Ã£o:', error);
    }
    next();
  }
};

// ===== LOGGING DE SEGURANÃ‡A =====

export const securityLogging = (req, res, next) => {
  try {
    // Log de requisiÃ§Ã£o
    const logEntry = {
      eventType: 'api_request',
      severity: 'low',
      description: `${req.method} ${req.originalUrl}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestHeaders: req.headers,
      details: {
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        referer: req.get('referer')
      }
    };

    // Adicionar informaÃ§Ãµes do usuÃ¡rio se autenticado
    if (req.user) {
      logEntry.userId = req.user.id;
      logEntry.details.userEmail = req.user.email;
    }

    await SecurityLog.create(logEntry);
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro no logging de seguranÃ§a:', error);
    }
    next();
  }
};

// ===== FUNÃ‡Ã•ES AUXILIARES =====

function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return (
    str
      .replace(/[<>]/g, '') // Remover < e >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      // Remover caracteres de controle, usando a classe POSIX-equivalente para maior compatibilidade
      .replace(/[^\x20-\x7E\n\r\t]/g, '')
      .trim()
  );
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = sanitizeString(key);
    sanitized[cleanKey] = typeof value === 'string' ? sanitizeString(value) : sanitizeObject(value);
  }

  return sanitized;
}

// ===== MIDDLEWARE DE VALIDAÃ‡ÃƒO DE WEBHOOK =====

export const validateStripeWebhook = (req, res, next) => {
  try {
    const stripeEnabled = (process.env.STRIPE_ENABLED || 'false').toLowerCase() === 'true';
    if (!stripeEnabled) {
      return res.status(403).json({ success: false, message: 'Stripe desativado', code: 'STRIPE_DISABLED' });
    }
    const signature = req.get('stripe-signature');
    const payload = JSON.stringify(req.body);

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Stripe signature missing',
        code: 'MISSING_SIGNATURE'
      });
    }

    // Aqui vocÃª implementaria a verificaÃ§Ã£o real da assinatura do Stripe
    // Por enquanto, apenas validar se existe

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o do webhook Stripe:', error);
    }
    res.status(400).json({
      success: false,
      message: 'Webhook invÃ¡lido',
      code: 'INVALID_WEBHOOK'
    });
  }
};

// ===== MIDDLEWARE DE VALIDAÃ‡ÃƒO DE CSRF =====

export const validateCSRF = (req, res, next) => {
  try {
    // Verificar se Ã© uma requisiÃ§Ã£o que precisa de CSRF
    const csrfRequiredMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

    if (!csrfRequiredMethods.includes(req.method)) {
      return next();
    }

    const csrfToken = req.get('X-CSRF-Token');
    const sessionToken = req.session?.csrfToken;

    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
      return res.status(403).json({
        success: false,
        message: 'Token CSRF invÃ¡lido',
        code: 'INVALID_CSRF'
      });
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o CSRF:', error);
    }
    res.status(403).json({
      success: false,
      message: 'Erro na validaÃ§Ã£o CSRF',
      code: 'CSRF_ERROR'
    });
  }
};

// ===== MIDDLEWARE DE VALIDAÃ‡ÃƒO DE API KEY =====

export const validateAPIKey = (req, res, next) => {
  try {
    const apiKey = req.get('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API Key obrigatÃ³ria',
        code: 'MISSING_API_KEY'
      });
    }

    // Aqui vocÃª implementaria a validaÃ§Ã£o real da API Key
    // Por enquanto, apenas verificar se existe

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na validaÃ§Ã£o da API Key:', error);
    }
    res.status(401).json({
      success: false,
      message: 'API Key invÃ¡lida',
      code: 'INVALID_API_KEY'
    });
  }
};

export default {
  securityMiddleware,
  createRateLimiter,
  publicRateLimit,
  authenticatedRateLimit,
  adminRateLimit,
  criticalRateLimit,
  detectAttackPatterns,
  validateInput,
  sanitizeData,
  securityLogging,
  validateStripeWebhook,
  validateCSRF,
  validateAPIKey
};
