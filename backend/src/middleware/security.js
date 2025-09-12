import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import AuditLog from '../models/AuditLog.js';

// Configuração de segurança com Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Configuração CORS
export const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://agroisync.com',
      'https://www.agroisync.com',
      'https://staging.agroisync.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Permitir requests sem origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Middleware de validação de entrada
export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
};

// Validações comuns
export const commonValidations = {
  email: body('email').isEmail().normalizeEmail().withMessage('Email inválido'),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
    ),

  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  phone: body('phone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),

  cpf: body('cpf')
    .optional()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .withMessage('CPF deve estar no formato XXX.XXX.XXX-XX'),

  cnpj: body('cnpj')
    .optional()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')
};

// Middleware de sanitização
export const sanitizeInput = (req, res, next) => {
  // Sanitizar strings removendo caracteres perigosos
  const sanitizeString = str => {
    if (typeof str !== 'string') {
      return str;
    }
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  // Sanitizar body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  // Sanitizar query params
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
};

// Middleware de detecção de ataques
export const detectAttacks = async (req, res, next) => {
  const suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /script\s*>/i,
    /javascript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ];

  const checkString = str => {
    if (typeof str !== 'string') {
      return false;
    }
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  let isSuspicious = false;
  let riskLevel = 'LOW';

  // Verificar body
  if (req.body) {
    for (const key in req.body) {
      if (checkString(req.body[key])) {
        isSuspicious = true;
        riskLevel = 'HIGH';
        break;
      }
    }
  }

  // Verificar query params
  if (req.query && !isSuspicious) {
    for (const key in req.query) {
      if (checkString(req.query[key])) {
        isSuspicious = true;
        riskLevel = 'MEDIUM';
        break;
      }
    }
  }

  // Verificar headers suspeitos
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-cluster-client-ip'];

  for (const header of suspiciousHeaders) {
    if (req.headers[header] && checkString(req.headers[header])) {
      isSuspicious = true;
      riskLevel = 'HIGH';
      break;
    }
  }

  // Log de atividade suspeita
  if (isSuspicious) {
    await AuditLog.logAction({
      userId: req.user?.id || 'anonymous',
      userEmail: req.user?.email || req.ip,
      action: 'SUSPICIOUS_ACTIVITY',
      resource: req.originalUrl,
      details: `Suspicious pattern detected in ${req.method} request`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      isSuspicious: true,
      riskLevel
    });

    // Bloquear requests de alto risco
    if (riskLevel === 'HIGH') {
      return res.status(403).json({
        success: false,
        message: 'Atividade suspeita detectada. Acesso negado.'
      });
    }
  }

  next();
};

// Middleware de validação de Stripe webhook
export const validateStripeWebhook = (req, res, next) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).json({
      success: false,
      message: 'Webhook signature missing'
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    req.stripeEvent = event;
    next();
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook signature'
    });
  }
};

// Middleware de compressão de resposta
export const compressionOptions = {
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return true;
  }
};

// Middleware de timeout
export const requestTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeout, () => {
      res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    });
    next();
  };
};

export default {
  securityHeaders,
  corsOptions,
  validateInput,
  commonValidations,
  sanitizeInput,
  detectAttacks,
  validateStripeWebhook,
  compressionOptions,
  requestTimeout
};
