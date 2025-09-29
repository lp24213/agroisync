import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import serverless from 'aws-serverless-express';

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

// CORS configuration - MELHORADO para suportar múltiplas origens
// Mantém compatibilidade com configuração existente
const configureCORS = () => {
  // Origens permitidas (com fallback para produção)
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'https://agroisync.com',
    'https://www.agroisync.com'
  ];

  // Pegar da variável de ambiente (pode ser string única ou lista separada por vírgula)
  const envOrigin = process.env.CORS_ORIGIN;

  let allowedOrigins;

  if (envOrigin) {
    // Se contém vírgula, é uma lista de origens
    if (envOrigin.includes(',')) {
      allowedOrigins = envOrigin.split(',').map(origin => origin.trim());
    } else {
      // String única - usar apenas ela (comportamento original)
      allowedOrigins = [envOrigin];
    }
  } else {
    // Usar origens padrão
    allowedOrigins = defaultOrigins;
  }

  // Log das origens permitidas (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🌐 CORS - Origens permitidas:', allowedOrigins);
  }

  return {
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc)
      if (!origin) {
        return callback(null, true);
      }

      // Verificar se a origem está na lista permitida
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Em desenvolvimento, permitir qualquer localhost
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
          callback(null, true);
        } else {
          console.warn(`⚠️ CORS blocked origin: ${origin}`);
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400 // 24 horas
  };
};

app.use(cors(configureCORS()));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // limit each IP to 100 requests per windowMs
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
app.use((err, req, res, _next) => {
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

// AWS Lambda handler
export const handler = async (event, context) => {
  // Convert API Gateway event to Express request
  const server = serverless.createServer(app);

  return new Promise((resolve, reject) => {
    serverless
      .proxy(server, event, context, 'PROMISE')
      .promise.then(response => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: response.body,
          isBase64Encoded: response.isBase64Encoded
        });
      })
      .catch(reject);
  });
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
