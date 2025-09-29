/**
 * Content Security Policy (CSP) Headers
 * Protege contra XSS, clickjacking e outros ataques
 */

/**
 * Configuração CSP para desenvolvimento
 */
const developmentCSP = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Permitido em dev
    "'unsafe-eval'", // Permitido em dev
    'https://cdn.jsdelivr.net',
    'https://unpkg.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para styled-components
    'https://fonts.googleapis.com'
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'connect-src': [
    "'self'",
    'http://localhost:*',
    'ws://localhost:*',
    'wss://localhost:*',
    'https://api.stripe.com',
    'https://api.openai.com'
  ],
  'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"], // Protege contra clickjacking
  'upgrade-insecure-requests': [] // Force HTTPS em produção
};

/**
 * Configuração CSP para produção (mais restritiva)
 */
const productionCSP = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    'https://cdn.jsdelivr.net',
    'https://js.stripe.com',
    'https://challenges.cloudflare.com' // Cloudflare Turnstile
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para styled-components/Tailwind
    'https://fonts.googleapis.com'
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'img-src': [
    "'self'",
    'data:',
    'https://res.cloudinary.com', // Cloudinary
    'https://*.stripe.com',
    'https://agroisync.com'
  ],
  'connect-src': [
    "'self'",
    'https://agroisync.com',
    'https://api.agroisync.com',
    'https://api.stripe.com',
    'https://api.openai.com',
    'https://challenges.cloudflare.com', // Turnstile
    'wss://agroisync.com'
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://challenges.cloudflare.com' // Turnstile
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'block-all-mixed-content': []
};

/**
 * Converter objeto CSP em string de header
 */
const buildCSPHeader = cspConfig => {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

/**
 * Middleware CSP
 */
export const cspMiddleware = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cspConfig = isProduction ? productionCSP : developmentCSP;

  // CSP Header
  const cspHeader = buildCSPHeader(cspConfig);
  res.setHeader('Content-Security-Policy', cspHeader);

  // Headers adicionais de segurança

  // X-Content-Type-Options: Previne MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: Protege contra clickjacking (redundante com CSP, mas mantido para compatibilidade)
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection: Ativa proteção XSS do browser (legado, mas ainda útil)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: Controla informações enviadas no header Referer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Controla features do navegador
  res.setHeader(
    'Permissions-Policy',
    [
      'geolocation=(self)',
      'microphone=()',
      'camera=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()'
    ].join(', ')
  );

  // Strict-Transport-Security: Force HTTPS (apenas em produção)
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

/**
 * Middleware CSP condicional (apenas em produção)
 */
export const cspMiddlewareConditional = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return cspMiddleware(req, res, next);
  }
  next();
};

export default {
  cspMiddleware,
  cspMiddlewareConditional,
  developmentCSP,
  productionCSP
};
