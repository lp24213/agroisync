const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { createServer } = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const freightRoutes = require('./routes/freights');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const cryptoRoutes = require('./routes/crypto');
const analyticsRoutes = require('./routes/analytics');

// Importar middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const logger = require('./utils/logger');

// Importar configurações
const connectDB = require('./config/database');
const redisClient = require('./config/redis');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgroSync API',
      version: '1.0.0',
      description: 'API completa para a plataforma de agronegócio AgroSync',
      contact: {
        name: 'AgroSync Team',
        email: 'contato@agrosync.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware de segurança
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    }
  })
);

// Middleware de compressão
app.use(compression());

// Middleware de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Middleware de logging
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Slow down
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // permitir 50 requests por 15 minutos
  delayMs: 500 // adicionar 500ms de delay após o limite
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/freights', freightRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/analytics', analyticsRoutes);

// WebSocket para mensageria em tempo real
io.on('connection', socket => {
  logger.info(`Usuário conectado: ${socket.id}`);

  // Entrar em uma sala de conversa
  socket.on('join-conversation', conversationId => {
    socket.join(`conversation-${conversationId}`);
    logger.info(`Usuário ${socket.id} entrou na conversa ${conversationId}`);
  });

  // Sair de uma sala de conversa
  socket.on('leave-conversation', conversationId => {
    socket.leave(`conversation-${conversationId}`);
    logger.info(`Usuário ${socket.id} saiu da conversa ${conversationId}`);
  });

  // Enviar mensagem
  socket.on('send-message', data => {
    const { conversationId, message, senderId } = data;

    // Emitir mensagem para todos os usuários na conversa
    io.to(`conversation-${conversationId}`).emit('new-message', {
      id: Date.now(),
      conversationId,
      senderId,
      content: message.content,
      type: message.type || 'text',
      timestamp: new Date().toISOString()
    });

    logger.info(`Mensagem enviada na conversa ${conversationId} por ${senderId}`);
  });

  // Notificações em tempo real
  socket.on('subscribe-notifications', userId => {
    socket.join(`notifications-${userId}`);
    logger.info(`Usuário ${userId} inscrito em notificações`);
  });

  // Desconectar
  socket.on('disconnect', () => {
    logger.info(`Usuário desconectado: ${socket.id}`);
  });
});

// Middleware de erro 404
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Conectar ao banco de dados
connectDB();

// Conectar ao Redis
redisClient.connect().catch(console.error);

// Inicializar servidor
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Servidor AgroSync rodando na porta ${PORT}`);
  logger.info(`📚 Documentação da API: http://localhost:${PORT}/api-docs`);
  logger.info(`🌍 Ambiente: ${process.env.NODE_ENV}`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', err => {
  logger.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error('Promise rejeitada não tratada:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    logger.info('Servidor encerrado.');
    mongoose.connection.close();
    redisClient.quit();
    process.exit(0);
  });
});

module.exports = { app, io };
