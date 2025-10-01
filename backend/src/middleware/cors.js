// =============================================================
// AGROISYNC • Middleware CORS Otimizado
// =============================================================

/**
 * Configuração CORS para múltiplas origens
 */
const isProduction =
  typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

function getAllowedOriginsForEnv() {
  if (isProduction) {
    return ['https://agroisync.com', 'https://www.agroisync.com'];
  }
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
}

export const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOriginsForEnv();

    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar se a origem está na lista
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // console.warn(`CORS: Origem bloqueada: ${origin}`);
      callback(new Error('Não permitido pelo CORS'), false);
    }
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],

  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token',
    'X-API-Key',
    'X-Client-Version',
    'X-Platform',
    'Cache-Control',
    'Pragma'
  ],

  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],

  credentials: true, // Permitir cookies
  maxAge: 86400, // Cache preflight por 24 horas
  optionsSuccessStatus: 200 // Para browsers legados
};

/**
 * Middleware CORS customizado para Cloudflare Workers
 */
export const corsMiddleware = request => {
  const origin = request.headers.get('Origin');

  const allowedOrigins = getAllowedOriginsForEnv();

  const isAllowed = !origin || allowedOrigins.includes(origin);

  // Headers CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://agroisync.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };

  // Responder a OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  return { corsHeaders, isAllowed };
};

/**
 * Middleware para adicionar headers de segurança
 */
export const securityHeaders = (req, res, next) => {
  // Headers de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://api.cloudflare.com wss: ws:",
      'frame-src https://js.stripe.com https://challenges.cloudflare.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  );

  next();
};

export default {
  corsOptions,
  corsMiddleware,
  securityHeaders
};
