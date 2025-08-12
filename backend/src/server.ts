import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import firebaseRoutes from './routes/firebase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
  origin: [
    'https://agroisync.com',
    'https://www.agroisync.com',
    'https://main.d2d5j98tau5snm.amplifyapp.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (AWS/ECS/Lambda)
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// MongoDB Atlas domain verification endpoint
app.get('/mongodb-site-verification.html', (_req, res) => {
  const token = process.env.MONGODB_SITE_VERIFICATION || '';
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(token);
});

// Detailed health check endpoint
app.get('/health/detailed', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '1.0.0',
    services: {
      server: 'running'
    }
  });
});

// Contact endpoint
app.get('/api/contact', (_req, res) => {
  res.json({
    email: 'contato@agroisync.com',
    telefone: '+55 (66) 99236-2830',
    horario: 'Seg-Sex 9h-18h',
    suporte: {
      disponibilidade: '24/7',
      chat: 'Chat ao vivo',
      resposta: 'Resposta instantânea'
    }
  });
});

// API routes
app.get('/api/v1/status', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROISYNC Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Firebase routes
app.use('/api/firebase', firebaseRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'AGROISYNC Backend API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: '/health',
      status: '/api/v1/status',
      contact: '/api/contact',
      firebase: '/api/firebase'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);

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
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 AGROISYNC Backend Server Starting...');
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔌 Server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📞 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`🔥 Firebase API: http://localhost:${PORT}/api/firebase`);
  console.log(`🌐 CORS enabled for: agroisync.com`);

  console.log('✅ Server started successfully');
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Export for testing
export default app;
