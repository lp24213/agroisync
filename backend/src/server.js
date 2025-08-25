import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Importar rotas
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import freightRoutes from './routes/freights.js';
import messageRoutes from './routes/messages.js';
import conversationRoutes from './routes/conversations.js';
import contactRoutes from './routes/contact.js';
import partnerRoutes from './routes/partners.js';
import partnershipMessageRoutes from './routes/partnership-messages.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import stakingRoutes from './routes/staking.js';
import newsRoutes from './routes/news.js';
import uploadRoutes from './routes/upload.js';
import healthRoutes from './routes/health.js';

// Importar middleware
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { createSecurityLog } from './utils/securityLogger.js';
import { 
  wafProtection, 
  securityLogging, 
  contentValidation, 
  bruteForceProtection,
  apiRateLimiter,
  authRateLimiter,
  paymentRateLimiter
} from './middleware/security.js';

// Importar configuração WebSocket
import { configureSocket } from './config/socket.js';

// Importar configuração
import { config, validateConfig } from './config/config.js';

// Configuração de ambiente
dotenv.config();

// Validar configuração
validateConfig();

const app = express();
const server = createServer(app);
const PORT = config.server.port;

// ===== MIDDLEWARE DE SEGURANÇA =====

// Helmet para headers de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.metamask.io"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configurado para produção
app.use(cors({
  origin: config.server.nodeEnv === 'production' 
    ? [
        'https://agroisync.com',
        'https://www.agroisync.com',
        'https://agrotm.com.br',
        'https://www.agrotm.com.br'
      ]
    : [config.server.frontendUrl, 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('rate_limit_exceeded', 'medium', 'Global rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente em alguns minutos.'
    });
  }
});

app.use(globalLimiter);

// ===== MIDDLEWARES DE SEGURANÇA AVANÇADOS =====

// WAF Protection
app.use(wafProtection);

// Security Logging
app.use(securityLogging);

// Content Validation
app.use(contentValidation(50 * 1024 * 1024)); // 50MB max

// Brute Force Protection
app.use(bruteForceProtection);

// Rate limiting específico para APIs
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Limite de API excedido. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('rate_limit_exceeded', 'medium', 'API rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Limite de API excedido. Tente novamente em alguns minutos.'
    });
  }
});

// Rate limiting para autenticação
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await createSecurityLog('rate_limit_exceeded', 'high', 'Auth rate limit exceeded', req);
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    });
  }
});

// ===== MIDDLEWARE DE PROCESSAMENTO =====

// Compressão para melhor performance
app.use(compression());

// Logging de requisições
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
}));

// Parse JSON e URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== ROTAS =====

// Health check (sem rate limiting)
app.use('/api/health', healthRoutes);

// Autenticação (rate limiting específico)
app.use('/api/auth', authRateLimiter, authRoutes);

// APIs principais (rate limiting padrão)
app.use('/api', apiRateLimiter, apiRoutes);
app.use('/api/users', apiRateLimiter, userRoutes);
app.use('/api/products', apiRateLimiter, productRoutes);
app.use('/api/freights', apiRateLimiter, freightRoutes);
app.use('/api/messages', apiRateLimiter, messageRoutes);
app.use('/api/conversations', apiRateLimiter, conversationRoutes);
app.use('/api/contact', apiRateLimiter, contactRoutes);
app.use('/api/partners', apiRateLimiter, partnerRoutes);
app.use('/api/partnership-messages', apiRateLimiter, partnershipMessageRoutes);
app.use('/api/payments', apiRateLimiter, paymentRoutes);
app.use('/api/staking', apiRateLimiter, stakingRoutes);
app.use('/api/news', apiRateLimiter, newsRoutes);
app.use('/api/upload', apiRateLimiter, uploadRoutes);

// Admin (rate limiting mais restritivo)
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo 200 requests por IP
  message: {
    success: false,
    message: 'Limite de admin excedido. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/admin', adminRateLimiter, adminRoutes);

// ===== MIDDLEWARE DE ERRO =====

// 404 para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Handler de erros global
app.use(errorHandler);

// ===== CONEXÃO COM BANCO =====

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });

    console.log('✅ MongoDB conectado com sucesso');
    
    // Criar índices para melhor performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error);
    process.exit(1);
  }
};

// Função para criar índices
const createIndexes = async () => {
  try {
    // Índices para usuários
    await mongoose.model('User').createIndexes();
    
    // Índices para mensagens
    await mongoose.model('Message').createIndexes();
    
    // Índices para conversas
    await mongoose.model('Conversation').createIndexes();
    
    // Índices para produtos
    await mongoose.model('Product').createIndexes();
    
    // Índices para fretes
    await mongoose.model('Freight').createIndexes();
    
    // Índices para pagamentos
    await mongoose.model('Payment').createIndexes();
    
    // Índices para parceiros
    await mongoose.model('Partner').createIndexes();
    
    // Índices para logs de auditoria
    await mongoose.model('AuditLog').createIndexes();
    
    console.log('✅ Índices criados com sucesso');
  } catch (error) {
    console.error('⚠️ Erro ao criar índices:', error);
  }
};

// ===== INICIALIZAÇÃO DO SERVIDOR =====

const startServer = async () => {
  try {
    // Conectar ao banco
    await connectDB();
    
    // Configurar WebSocket
    const { io, socketService } = configureSocket(server);
    
    // Disponibilizar socketService globalmente
    app.set('socketService', socketService);
    
    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket ativo`);
      
      // Log de inicialização
      createSecurityLog('system_startup', 'low', 'Server started successfully', { url: `http://localhost:${PORT}` });
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// ===== HANDLERS DE PROCESSO =====

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM recebido. Encerrando servidor...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Conexão com MongoDB fechada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT recebido. Encerrando servidor...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Conexão com MongoDB fechada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error);
    process.exit(1);
  }
});

// Handler de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  createSecurityLog('system_error', 'critical', `Uncaught exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  createSecurityLog('system_error', 'critical', `Unhandled rejection: ${reason}`, { promise: promise.toString() });
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;
