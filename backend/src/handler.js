import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SECURITY_CONFIG } from './config/constants.js';

// Import routes
import healthRoutes from './routes/health.js';
import apiRoutes from './routes/api.js';
import swaggerRoutes from './routes/swagger.js';

const app = express();

// Security middleware
app.use(helmet());

// CSP Headers (Content Security Policy)
import { cspMiddleware } from './middleware/csp.js';
app.use(cspMiddleware);

// CSRF Protection (aplicado em rotas específicas via middleware)
import { csrfToken } from './middleware/csrf.js';
app.use(csrfToken); // Adiciona token CSRF a todas as respostas

// ===== CONFIGURAÇÃO CORS CONSOLIDADA =====
// ÚNICA configuração CORS do projeto - não duplicar em outros arquivos
const configureCORS = () => {
  // Usar configuração centralizada
  const allowedOrigins = SECURITY_CONFIG.corsOrigin;

  // Log CORS em desenvolvimento (desativado por eslint)
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('🌐 CORS - Origens permitidas:', allowedOrigins);
  // }

  return {
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, curl, etc)
      if (!origin) {
        return callback(null, true);
      }

      // Verificar lista de origens permitidas
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Em desenvolvimento, permitir qualquer localhost
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }

      // Bloquear origem não autorizada
      // console.warn(`⚠️ CORS bloqueado: ${origin}`);
      callback(new Error(`Origem ${origin} não permitida pelo CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Request-Id', 'X-Total-Count'],
    maxAge: 86400, // 24 horas
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
};

app.use(cors(configureCORS()));

// Rate limiting
const limiter = rateLimit({
  windowMs: SECURITY_CONFIG.rateLimit.windowMs,
  max: SECURITY_CONFIG.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerRoutes); // Documentação Swagger

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AGROISYNC Backend',
    version: '2.3.1'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler - MELHORADO com responseFormatter
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('Error:', err);

  // Se for erro de CORS, enviar mensagem específica
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Origin not allowed by CORS policy',
      message: 'Access denied'
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    message: 'Internal server error'
  });
});

// Export Express app for Cloudflare Workers
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}
