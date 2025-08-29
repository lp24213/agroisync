import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { securityMiddleware, createRateLimiters, securityLogging } from './middleware/securityMiddleware.js';

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import clientRoutes from './routes/clients.js';
import productRoutes from './routes/products.js';
import freightRoutes from './routes/freights.js';
import transactionRoutes from './routes/transactions.js';
import externalAPIRoutes from './routes/external-apis.js';
import messagingRoutes from './routes/messaging.js';
import messageRoutes from './routes/messages.js';
import newsRoutes from './routes/news.js';
import paymentRoutes from './routes/payments.js';
import partnerRoutes from './routes/partners.js';
import partnershipMessageRoutes from './routes/partnership-messages.js';
import contactRoutes from './routes/contact.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import escrowRoutes from './routes/escrow.js';
import gamificationRoutes from './routes/gamification.js';
import mirrorAPIRoutes from './routes/mirror-apis.js';
import privacyRoutes from './routes/privacy.js';

// Import database connection
import { connectDB } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Usuário conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Usuário desconectado:', socket.id);
  });
});

// Middleware de segurança avançado
app.use(securityMiddleware);
app.use(securityLogging);

// Middleware básico
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
app.use(apiLimiter);

// Middleware para capturar IP real
app.use((req, res, next) => {
  req.realIP = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.connection.socket?.remoteAddress;
  next();
});

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.realIP}`);
  next();
});

// Rotas públicas
app.use('/api/auth', authRoutes);
app.use('/api/external', externalAPIRoutes);
app.use('/api/mirror', mirrorAPIRoutes);
app.use('/api/products', productRoutes);
app.use('/api/freights', freightRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/partnership-messages', partnershipMessageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/news', newsRoutes);

// Rotas protegidas
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api/messaging', authenticateToken, messagingRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/escrow', authenticateToken, escrowRoutes);
app.use('/api/gamification', authenticateToken, gamificationRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/privacy', privacyRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de informações da API
app.get('/api', (req, res) => {
  res.json({
    name: 'AgroSync API',
    version: '1.0.0',
    description: 'API para plataforma de agronegócio',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      freights: '/api/freights',
      transactions: '/api/transactions',
      payments: '/api/payments',
      messages: '/api/messages',
      admin: '/api/admin',
      external: '/api/external',
      mirror: '/api/mirror'
    },
    documentation: '/api/docs'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na API:', err);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: errors
    });
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'ID inválido'
    });
  }

  // Erro de duplicação (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} já existe no sistema`
    });
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }

  // Erro JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Função para iniciar servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('\n🔄 Recebido sinal de shutdown, fechando servidor...');
  
  try {
    // Fechar servidor
    server.close(() => {
      console.log('✅ Servidor HTTP fechado');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erro durante shutdown:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown();
});

// Iniciar servidor
startServer();

export default app;
