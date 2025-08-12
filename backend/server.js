const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const stakingRoutes = require('./src/routes/staking');
const nftRoutes = require('./src/routes/nfts');
const analyticsRoutes = require('./src/routes/analytics');
const contactRoutes = require('./src/routes/contact');
const uploadRoutes = require('./src/routes/upload');
const healthRoutes = require('./src/routes/health');
const marketplaceRoutes = require('./src/routes/marketplace');
const dashboardRoutes = require('./src/routes/dashboard');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');
const { authMiddleware } = require('./src/middleware/auth');
const { validateMetamaskId, logMetamaskAccess } = require('./src/middleware/metamaskAuth');

// Import utils
const logger = require('./src/utils/logger');
const database = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.mainnet-beta.solana.com", "https://o6h7rhvsj5c43bhrz25djt53qa.appsync-api.us-east-2.amazonaws.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration (GLOBAL ACCESS - NO REGION RESTRICTIONS)
const corsOptions = {
  origin: '*', // Allow ALL origins globally
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-Client-Version',
    'Origin',
    'Accept'
  ]
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Health check endpoint for AWS Amplify
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AGROTM Backend is healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '2.3.1'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AGROTM Backend API',
    version: '2.3.1',
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api/docs'
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'AGROTM Backend API Documentation',
    version: '2.3.1',
    description: 'API para plataforma AGROTM - Agricultura Sustentável com Blockchain',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: {
      'GET /health': 'Health check do servidor',
      'GET /api/v1/status': 'Status da API',
      'POST /api/auth/login': 'Login de usuário',
      'POST /api/auth/register': 'Registro de usuário',
      'GET /api/users/profile': 'Perfil do usuário',
      'POST /api/staking/stake': 'Fazer stake de tokens',
      'GET /api/nfts/owned': 'NFTs do usuário',
      'GET /api/analytics/portfolio': 'Análise do portfólio',
      'POST /api/contact/send': 'Enviar mensagem de contato',
      'POST /api/upload/file': 'Upload de arquivo',
      'GET /api/marketplace/listings': 'Listagens do marketplace',
      'GET /api/dashboard/overview': 'Visão geral do dashboard',
      'POST /api/dashboard/security/change-password': 'Alterar senha',
      'GET /api/dashboard/activity': 'Atividade da conta',
      'GET /api/dashboard/export': 'Exportar dados da conta'
    }
  });
});

// API Routes
app.use('/api/auth', logMetamaskAccess, authRoutes);
app.use('/api/users', logMetamaskAccess, validateMetamaskId, authMiddleware, userRoutes);
app.use('/api/staking', logMetamaskAccess, validateMetamaskId, authMiddleware, stakingRoutes);
app.use('/api/nfts', logMetamaskAccess, validateMetamaskId, authMiddleware, nftRoutes);
app.use('/api/analytics', logMetamaskAccess, validateMetamaskId, authMiddleware, analyticsRoutes);
app.use('/api/contact', logMetamaskAccess, contactRoutes);
app.use('/api/upload', logMetamaskAccess, validateMetamaskId, authMiddleware, uploadRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/marketplace', logMetamaskAccess, validateMetamaskId, marketplaceRoutes);
app.use('/api/dashboard', logMetamaskAccess, validateMetamaskId, authMiddleware, dashboardRoutes);

// Legacy endpoints for compatibility
app.get('/api/contact', (req, res) => {
  res.json({
    email: 'contato@agroisync.com',
    telefone: '+55 (66) 99236-2830',
    horario: 'Seg-Sex 9h-18h',
    whatsapp: '+55 (66) 99236-2830'
  });
});

app.get('/api/v1/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROISYNC Backend API is running',
    version: '2.3.1',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: '/api/docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 AGROISYNC Backend server running on port ${PORT}`);
  logger.info(`📊 Environment: ${NODE_ENV}`);
  logger.info(`🔗 Health Check: http://localhost:${PORT}/health`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  
  // Log startup information
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  AGROISYNC BACKEND SERVER                    ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server: http://0.0.0.0:${PORT}                          ║
║  📊 Health: http://0.0.0.0:${PORT}/health                   ║
║  📚 API Docs: http://0.0.0.0:${PORT}/api/docs              ║
║  🌍 Environment: ${NODE_ENV}                                  ║
║  ⏰ Started: ${new Date().toISOString()}                      ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = server; 

// Export Express app for AWS Lambda (serverless-http)
module.exports.app = app;