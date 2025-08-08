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
      connectSrc: ["'self'", "https://api.mainnet-beta.solana.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://agrotmsol.com.br',
      'https://www.agrotmsol.com.br',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
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

// Health check endpoint (for AWS)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AGROTM Backend API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    health: '/health'
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'AGROTM Backend API',
    version: '1.0.0',
    description: 'API profissional para a plataforma AGROTM',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Autenticação de usuário',
        'POST /api/auth/register': 'Registro de usuário',
        'POST /api/auth/refresh': 'Renovar token',
        'POST /api/auth/logout': 'Logout'
      },
      users: {
        'GET /api/users/profile': 'Obter perfil do usuário',
        'PUT /api/users/profile': 'Atualizar perfil',
        'GET /api/users/wallet': 'Obter carteira do usuário'
      },
      staking: {
        'GET /api/staking/pools': 'Listar pools de staking',
        'POST /api/staking/stake': 'Fazer staking',
        'POST /api/staking/unstake': 'Remover staking',
        'GET /api/staking/rewards': 'Obter recompensas'
      },
      nfts: {
        'GET /api/nfts': 'Listar NFTs',
        'POST /api/nfts/mint': 'Mintar NFT',
        'GET /api/nfts/:id': 'Obter NFT específico'
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Dados do dashboard',
        'GET /api/analytics/portfolio': 'Portfólio do usuário',
        'GET /api/analytics/market': 'Dados de mercado'
      },
      contact: {
        'POST /api/contact': 'Enviar mensagem de contato',
        'GET /api/contact/info': 'Informações de contato'
      },
      upload: {
        'POST /api/upload/image': 'Upload de imagem',
        'POST /api/upload/document': 'Upload de documento'
      },
      marketplace: {
        'GET /api/marketplace/nfts': 'Listar NFTs disponíveis',
        'GET /api/marketplace/cryptocurrencies': 'Listar criptomoedas',
        'POST /api/marketplace/nfts/:id/buy': 'Comprar NFT',
        'POST /api/marketplace/cryptocurrencies/:id/buy': 'Comprar criptomoeda',
        'GET /api/marketplace/user/nfts': 'NFTs do usuário',
        'GET /api/marketplace/user/transactions': 'Transações do usuário',
        'GET /api/marketplace/stats': 'Estatísticas do marketplace'
      },
      dashboard: {
        'GET /api/dashboard/overview': 'Visão geral do dashboard',
        'GET /api/dashboard/portfolio': 'Detalhes do portfólio',
        'GET /api/dashboard/wallet': 'Informações da carteira',
        'GET /api/dashboard/security': 'Configurações de segurança',
        'POST /api/dashboard/security/2fa/enable': 'Habilitar 2FA',
        'POST /api/dashboard/security/2fa/disable': 'Desabilitar 2FA',
        'POST /api/dashboard/security/change-password': 'Alterar senha',
        'GET /api/dashboard/activity': 'Atividade da conta',
        'GET /api/dashboard/export': 'Exportar dados da conta'
      }
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
    email: 'contato@agrotm.com.br',
    telefone: '+55 (66) 99236-2830',
    horario: 'Seg-Sex 9h-18h',
    whatsapp: '+55 (66) 99236-2830'
  });
});

app.get('/api/v1/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROTM Backend API is running',
    version: '1.0.0',
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
const server = app.listen(PORT, () => {
  logger.info(`🚀 AGROTM Backend server running on port ${PORT}`);
  logger.info(`📊 Environment: ${NODE_ENV}`);
  logger.info(`🔗 Health Check: http://localhost:${PORT}/health`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  
  // Log startup information
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    AGROTM BACKEND SERVER                     ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}                          ║
║  📊 Health: http://localhost:${PORT}/health                   ║
║  📚 API Docs: http://localhost:${PORT}/api/docs              ║
║  🌍 Environment: ${NODE_ENV}                                  ║
║  ⏰ Started: ${new Date().toISOString()}                      ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = server; 