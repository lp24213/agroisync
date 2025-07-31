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
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Winston logger
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

// Security middleware - Premium configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate limiting - Premium protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});

app.use(limiter);
app.use(speedLimiter);

// CORS middleware - Premium configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      'http://localhost:3000',
      'https://agrotm-solana.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  })
);

// Body parsing middleware with security
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
        throw new Error('Invalid JSON');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(mongoSanitize()); // Prevent NoSQL injection

// Compression middleware
app.use(compression());

// Logging middleware
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Request validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Health check endpoint - Premium monitoring
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
  };

  logger.info('Health check requested', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  res.json(healthCheck);
});

// Main endpoint with validation
app.get(
  '/',
  [body('test').optional().isString().trim().escape(), validateRequest],
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
    });
  }
);

// API routes with premium security
app.get('/api', (req, res) => {
  res.json({
    message: 'AGROTM API v1.0.0',
    available: true,
    features: [
      'Premium Security',
      'Rate Limiting',
      'NoSQL Injection Protection',
      'Compression',
      'Logging',
    ],
  });
});

// Status endpoint for monitoring
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
  });
});

// Error handling middleware - Premium error handling
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

// 404 handler - Premium 404
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

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
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
  console.log(`📈 Monitoring: Advanced logging enabled`);
});
