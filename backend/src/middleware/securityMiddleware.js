import { createSecurityLog } from '../utils/securityLogger.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { getClientIP } from '../utils/ipUtils.js';

// ===== MIDDLEWARE DE SEGURANÇA PRINCIPAL =====

/**
 * Middleware de segurança principal
 * Aplica todas as proteções de segurança
 */
export const securityMiddleware = [
  // Proteção básica com Helmet
  helmet({
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
  }),

  // Proteção contra XSS
  xss(),

  // Proteção contra HTTP Parameter Pollution
  hpp(),

  // Proteção contra NoSQL Injection
  mongoSanitize(),

  // Middleware de detecção de ataques
  detectAttackPatterns,

  // Middleware de validação de entrada
  validateInput,

  // Middleware de sanitização
  sanitizeData
];

// ===== DETECÇÃO DE PADRÕES DE ATAQUE =====

/**
 * Detectar padrões de ataque conhecidos
 */
const detectAttackPatterns = async (req, res, next) => {
  try {
    const attackPatterns = [
      // SQL Injection patterns
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)\b)/i,
      // XSS patterns
      /<script|javascript:|vbscript:|onload|onerror|onclick|onmouseover/i,
      // Command injection patterns
      /(\b(cmd|command|exec|system|eval|setTimeout|setInterval)\b)/i,
      // Path traversal patterns
      /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c/i,
      // LDAP injection patterns
      /(\b(\(|\)|\*|\||&)\b)/i
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
          'LDAP_INJECTION'
        ];
        attackType = attackTypes[index] || 'UNKNOWN_ATTACK';
      }
    });

    if (attackDetected) {
      // Log do ataque detectado
      await createSecurityLog(
        'ATTACK_DETECTED',
        'high',
        `Ataque detectado: ${attackType}`,
        req,
        req.user?.userId,
        {
          attackType,
          requestData: requestData.substring(0, 500), // Limitar tamanho do log
          ipAddress: getClientIP(req),
          userAgent: req.get('User-Agent')
        }
      );

      // Bloquear requisição
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: padrão suspeito detectado'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na detecção de ataques:', error);
    next();
  }
};

// ===== VALIDAÇÃO DE ENTRADA =====

/**
 * Validar dados de entrada
 */
const validateInput = (req, res, next) => {
  try {
    // Validar tamanho dos campos
    const maxFieldLength = 10000; // 10KB por campo
    const maxTotalLength = 100000; // 100KB total

    let totalLength = 0;

    // Validar body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          if (req.body[key].length > maxFieldLength) {
            return res.status(400).json({
              success: false,
              message: `Campo ${key} excede o tamanho máximo permitido`
            });
          }
          totalLength += req.body[key].length;
        }
      });
    }

    // Validar query
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          if (req.query[key].length > maxFieldLength) {
            return res.status(400).json({
              success: false,
              message: `Parâmetro ${key} excede o tamanho máximo permitido`
            });
          }
          totalLength += req.query[key].length;
        }
      });
    }

    // Validar tamanho total
    if (totalLength > maxTotalLength) {
      return res.status(400).json({
        success: false,
        message: 'Tamanho total dos dados excede o limite permitido'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na validação de entrada:', error);
    next();
  }
};

// ===== SANITIZAÇÃO DE DADOS =====

/**
 * Sanitizar dados de entrada
 */
const sanitizeData = (req, res, next) => {
  try {
    // Sanitizar body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeString(req.body[key]);
        }
      });
    }

    // Sanitizar query
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeString(req.query[key]);
        }
      });
    }

    // Sanitizar params
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = sanitizeString(req.params[key]);
        }
      });
    }

    next();
  } catch (error) {
    console.error('Erro na sanitização:', error);
    next();
  }
};

/**
 * Sanitizar string removendo caracteres perigosos
 */
const sanitizeString = str => {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    .replace(/[<>]/g, '') // Remover < e >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/vbscript:/gi, '') // Remover vbscript:
    .replace(/on\w+\s*=/gi, '') // Remover event handlers
    .trim();
};

// ===== RATE LIMITING AVANÇADO =====

/**
 * Rate limiting para diferentes tipos de usuário
 */
export const createRateLimiters = () => {
  // Rate limit para usuários não autenticados
  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: {
      success: false,
      message: 'Muitas requisições. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      createSecurityLog(
        'RATE_LIMIT_EXCEEDED',
        'medium',
        'Rate limit excedido para usuário público',
        req
      );
      res.status(429).json({
        success: false,
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
      });
    }
  });

  // Rate limit para usuários autenticados
  const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // 500 requisições por usuário
    message: {
      success: false,
      message: 'Muitas requisições. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => req.user?.userId || req.ip,
    handler: (req, res) => {
      createSecurityLog(
        'RATE_LIMIT_EXCEEDED',
        'medium',
        'Rate limit excedido para usuário autenticado',
        req,
        req.user?.userId
      );
      res.status(429).json({
        success: false,
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
      });
    }
  });

  // Rate limit para endpoints críticos
  const criticalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10, // 10 tentativas
    message: {
      success: false,
      message: 'Muitas tentativas. Tente novamente em 5 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      createSecurityLog(
        'CRITICAL_RATE_LIMIT_EXCEEDED',
        'high',
        'Rate limit crítico excedido',
        req,
        req.user?.userId
      );
      res.status(429).json({
        success: false,
        message: 'Muitas tentativas. Tente novamente em 5 minutos.'
      });
    }
  });

  return {
    public: publicLimiter,
    authenticated: authenticatedLimiter,
    critical: criticalLimiter
  };
};

// ===== MIDDLEWARE DE LOGGING DE SEGURANÇA =====

/**
 * Middleware para logging de todas as requisições
 */
export const securityLogging = async (req, res, next) => {
  const startTime = Date.now();

  // Interceptar resposta para logging
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;

    // Log da requisição
    createSecurityLog(
      'REQUEST_LOGGED',
      'low',
      `${req.method} ${req.originalUrl} - ${res.statusCode} (${responseTime}ms)`,
      req,
      req.user?.userId,
      {
        responseTime,
        statusCode: res.statusCode,
        responseSize: data ? data.length : 0
      }
    );

    originalSend.call(this, data);
  };

  next();
};

// ===== MIDDLEWARE DE VALIDAÇÃO DE TOKEN CSRF =====

/**
 * Validar token CSRF
 */
export const validateCSRF = (req, res, next) => {
  try {
    // Pular validação para métodos seguros
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
      createSecurityLog(
        'CSRF_ATTACK_DETECTED',
        'high',
        'Token CSRF inválido ou ausente',
        req,
        req.user?.userId
      );

      return res.status(403).json({
        success: false,
        message: 'Token de segurança inválido'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na validação CSRF:', error);
    next();
  }
};

export default {
  securityMiddleware,
  createRateLimiters,
  securityLogging,
  validateCSRF
};
