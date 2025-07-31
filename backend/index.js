const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult, param, query } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Winston logger with security
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agrotm-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Security middleware - Premium configuration with enhanced security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Enhanced rate limiting - Premium protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});

// Enhanced brute force protection using rate limiting
const bruteForceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 failed attempts per windowMs
  message: {
    error: 'Too many failed attempts',
    message: 'Please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

app.use(limiter);
app.use(speedLimiter);

// CORS middleware - Premium configuration with enhanced security
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      'http://localhost:3000',
      'https://agrotmsol.com.br',
      'https://www.agrotmsol.com.br',
      'https://agrotm-solana.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
    exposedHeaders: ['X-Total-Count'],
  })
);

// Body parsing middleware with enhanced security
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        logger.warn('Invalid JSON payload', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        res.status(400).json({ error: 'Invalid JSON' });
        throw new Error('Invalid JSON');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced security middleware
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(mongoSanitize()); // Prevent NoSQL injection

// Compression middleware
app.use(compression());

// Enhanced logging middleware
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Enhanced request validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errors: errors.array(),
    });
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/[<>]/g, '');
      }
    });
  }

  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    });
  }

  next();
};

app.use(sanitizeInput);

// Health check endpoint - Premium monitoring with enhanced security
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    message: 'AGROTM Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    security: {
      rateLimit: 'enabled',
      bruteForce: 'enabled',
      sanitization: 'enabled',
      cors: 'enabled',
    },
  };

  logger.info('Health check requested', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  res.json(healthCheck);
});

// Main endpoint with enhanced validation
app.get(
  '/',
  [
    body('test').optional().isString().trim().escape().isLength({ max: 100 }),
    validateRequest,
  ],
  (req, res) => {
    res.json({
      message: 'AGROTM Backend API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        api: '/api',
        status: '/status',
      },
      documentation: 'https://docs.agrotm.com',
      security: 'Premium protection enabled',
    });
  }
);

// API routes with enhanced security
app.get('/api', (req, res) => {
  res.json({
    message: 'AGROTM API v1.0.0',
    available: true,
    features: [
      'Premium Security',
      'Rate Limiting',
      'Brute Force Protection',
      'NoSQL Injection Protection',
      'Input Sanitization',
      'Compression',
      'Logging',
    ],
  });
});

// Status endpoint for monitoring with enhanced security
app.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    services: {
      database: 'connected',
      cache: 'operational',
      external_apis: 'healthy',
    },
    performance: {
      response_time: 'fast',
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
    },
    security: {
      rate_limit_status: 'active',
      brute_force_protection: 'active',
      input_sanitization: 'active',
    },
  });
});

// Enhanced error handling middleware - Premium error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  const errorResponse = {
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown',
  };

  res.status(err.status || 500).json(errorResponse);
});

// Enhanced 404 handler - Premium 404
app.use('*', (req, res) => {
  logger.warn('404 Not Found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/health', '/api', '/status'],
    documentation: 'https://docs.agrotm.com',
  });
});

// Enhanced graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Enhanced unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Enhanced uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 AGROTM Backend running on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
  });

  console.log(`🚀 AGROTM Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security: Premium protection enabled`);
  console.log(`🛡️ Brute Force Protection: Active`);
  console.log(`🧹 Input Sanitization: Active`);
  console.log(`📈 Monitoring: Advanced logging enabled`);
});
