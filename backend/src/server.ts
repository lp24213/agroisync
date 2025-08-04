import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import configurations
import {
  connectMongoDB,
  createRedisClient,
  gracefulShutdown,
} from './config/database';
import {
  corsOptions,
  createRateLimiters,
  createSpeedLimiters,
  ddosProtection,
  helmetConfig,
  securityHeaders,
} from './config/security';
import { web3Config } from './config/web3';
import { sanitizeInput } from './middleware/validation';
import { logger, stream } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize rate limiters and speed limiters
const { generalLimiter } = createRateLimiters();
const { generalSpeedLimiter } = createSpeedLimiters();

// Security middleware (order matters!)
app.use(helmetConfig);
app.use(securityHeaders);
app.use(ddosProtection);
app.use(cors(corsOptions));

// Rate limiting
app.use(generalLimiter);
app.use(generalSpeedLimiter);

// Compression middleware
app.use(compression());

// Body parsing middleware with limits
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  }),
);

// Logging middleware
app.use(morgan('combined', { stream }));

// Input sanitization
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown',
        web3: 'unknown',
      },
    };

    // Check database connection (optional)
    try {
      await connectMongoDB();
      health.services.database = 'connected';
    } catch (error) {
      health.services.database = 'disconnected';
      logger.warn('Database health check failed:', error);
    }

    // Check Redis connection (optional)
    try {
      const redisClient = createRedisClient();
      await redisClient.connect();
      await redisClient.ping();
      await redisClient.disconnect();
      health.services.redis = 'connected';
    } catch (error) {
      health.services.redis = 'disconnected';
      logger.warn('Redis health check failed:', error);
    }

    // Check Web3 connection (optional)
    try {
      await web3Config.healthCheck();
      health.services.web3 = 'connected';
    } catch (error) {
      health.services.web3 = 'disconnected';
      logger.warn('Web3 health check failed:', error);
    }

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// API routes
app.get('/api/v1/status', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROTM Backend API is running',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  const errorResponse: any = {
    success: false,
    error: NODE_ENV === 'development' ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
  };

  if (NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await gracefulShutdown();
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await gracefulShutdown();
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Start server
app.listen(PORT, async () => {
  logger.info('🚀 AGROTM Backend Server Starting...');
  logger.info(`📍 Environment: ${NODE_ENV}`);
  logger.info(`🌐 Server running on port ${PORT}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);

  // Initialize services (all optional)
  try {
    // Connect to MongoDB (optional)
    try {
      await connectMongoDB();
      logger.info('✅ MongoDB initialized successfully');
    } catch (error) {
      logger.warn('⚠️ MongoDB initialization failed, continuing without database:', error);
    }

    // Initialize Redis (optional)
    try {
      const redisClient = createRedisClient();
      await redisClient.connect();
      await redisClient.disconnect();
      logger.info('✅ Redis initialized successfully');
    } catch (error) {
      logger.warn('⚠️ Redis initialization failed, continuing without Redis:', error);
    }

    // Initialize Web3 (optional)
    try {
      await web3Config.healthCheck();
      logger.info('✅ Web3 initialized successfully');
    } catch (error) {
      logger.warn('⚠️ Web3 initialization failed, continuing without Web3:', error);
    }

    logger.info('✅ Server started successfully');
  } catch (error) {
    logger.error('❌ Critical service initialization failed:', error);
    // Don't exit process, allow server to start with limited functionality
  }
});

// Export for testing
export default app;
