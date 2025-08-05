import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
  origin: [
    'https://agrotmsol.com.br',
    'https://www.agrotmsol.com.br',
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

// Health check endpoint
app.get('/health', (_req, res) => {
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
    email: 'contato@agrotm.com.br',
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
    message: 'AGROTM Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'AGROTM Backend API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: '/health',
      status: '/api/v1/status',
      contact: '/api/contact'
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
app.listen(PORT, () => {
  console.log('🚀 AGROTM Backend Server Starting...');
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔌 Server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📞 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`🌐 CORS enabled for: agrotmsol.com.br`);

  console.log('✅ Server started successfully');
});

// Export for testing
export default app;
