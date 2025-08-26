const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const validationRoutes = require('./routes/validation');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const productRoutes = require('./routes/products');
const freightRoutes = require('./routes/freights');
const adminRoutes = require('./routes/admin');

// Importar middleware de autenticação
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurações de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.openweathermap.org"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Configurações de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requisições por IP
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Middlewares
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para capturar IP real
app.use((req, res, next) => {
  req.realIP = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
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
app.use('/api/validation', validationRoutes);

// Rotas protegidas
app.use('/api/payments', auth, paymentRoutes);
app.use('/api/messages', auth, messageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/freights', freightRoutes);
app.use('/api/admin', auth, adminRoutes);

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
      validation: '/api/validation',
      payments: '/api/payments',
      messages: '/api/messages',
      products: '/api/products',
      freights: '/api/freights',
      admin: '/api/admin'
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

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrosync';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB conectado com sucesso');
    
    // Criar índices para performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

// Função para criar índices
async function createIndexes() {
  try {
    // Índices para User
    await mongoose.model('User').createIndexes();
    
    // Índices para Payment
    await mongoose.model('Payment').createIndexes();
    
    // Índices para Conversation
    await mongoose.model('Conversation').createIndexes();
    
    // Índices para Message
    await mongoose.model('Message').createIndexes();
    
    console.log('✅ Índices criados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar índices:', error);
  }
}

// Função para iniciar o servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
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
    // Fechar conexão com MongoDB
    await mongoose.connection.close();
    console.log('✅ Conexão com MongoDB fechada');
    
    // Fechar servidor
    process.exit(0);
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

module.exports = app;
