import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { logger, stream } from '../utils/logger';

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
import authRoutes from './routes/auth';
import defiRoutes from './routes/defi';
import stakingRoutes from './routes/staking';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize rate limiters and speed limiters
const { generalLimiter, web3Limiter } = createRateLimiters();
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
    verify: (req: any, res, buf) => {
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
app.get('/health', async (req, res) => {
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

    // Check database connection
    try {
      await connectMongoDB();
      health.services.database = 'connected';
    } catch (error) {
      health.services.database = 'disconnected';
      logger.error('Database health check failed:', error);
    }

    // Check Redis connection
    try {
      const redisClient = createRedisClient();
      await redisClient.connect();
      await redisClient.ping();
      await redisClient.disconnect();
      health.services.redis = 'connected';
    } catch (error) {
      health.services.redis = 'disconnected';
      logger.error('Redis health check failed:', error);
    }

    // Check Web3 connection
    try {
      const web3Healthy = await web3Config.healthCheck();
      health.services.web3 = web3Healthy ? 'connected' : 'disconnected';
    } catch (error) {
      health.services.web3 = 'disconnected';
      logger.error('Web3 health check failed:', error);
    }

    const statusCode = Object.values(health.services).every(
      (service) => service === 'connected',
    )
      ? 200
      : 503;

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// API Routes with rate limiting
app.use('/api/auth', authRoutes);

// Web3 routes with stricter rate limiting
app.use('/api/staking', web3Limiter, stakingRoutes);
app.use('/api/defi', web3Limiter, defiRoutes);

// Mock endpoints for backward compatibility (with rate limiting)
app.get('/api/defi/pools', generalLimiter, async (req, res) => {
  try {
    const mockPools = [
      {
        id: 1,
        name: 'SOL-USDC Pool',
        token0: 'SOL',
        token1: 'USDC',
        totalLiquidity: 2500000,
        volume24h: 125000,
        apy: 45.2,
      },
      {
        id: 2,
        name: 'AGROTM-SOL Pool',
        token0: 'AGROTM',
        token1: 'SOL',
        totalLiquidity: 850000,
        volume24h: 45000,
        apy: 38.7,
      },
    ];

    res.json({
      success: true,
      data: mockPools,
    });
  } catch (error) {
    logger.error('Error fetching DeFi pools:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

app.get('/api/stats/overview', generalLimiter, async (req, res) => {
  try {
    const mockStats = {
      totalValueLocked: 3500000,
      totalUsers: 50000,
      averageApy: 15.3,
      totalTransactions: 1200000,
      securityScore: 9.8,
      supportedTokens: 150,
    };

    res.json({
      success: true,
      data: mockStats,
    });
  } catch (error) {
    logger.error('Error fetching stats overview:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction,
  ) => {
    logger.error('Unhandled error:', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Don't leak error details in production
    const errorResponse = {
      success: false,
      error: NODE_ENV === 'development' ? err.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
    };

    if (NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
    }

    res.status(500).json(errorResponse);
  },
);

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _server = app.listen(PORT, async () => {
  logger.info('🚀 AGROTM Backend Server Starting...');
  logger.info(`📍 Environment: ${NODE_ENV}`);
  logger.info(`🌐 Server running on port ${PORT}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`📊 API Documentation: http://localhost:${PORT}/api-docs`);

  // Initialize services
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Initialize Redis
    const redisClient = createRedisClient();
    await redisClient.connect();
    await redisClient.disconnect();

    // Initialize Web3
    await web3Config.healthCheck();

    logger.info('✅ All services initialized successfully');
  } catch (error) {
    logger.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
});

// Export for testing
export default app;
