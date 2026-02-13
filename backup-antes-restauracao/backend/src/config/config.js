import dotenv from 'dotenv';

// Carregar variÃ¡veis de ambiente
dotenv.config();

const config = {
  // ConfiguraÃ§Ãµes do servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // ConfiguraÃ§Ãµes do banco de dados (Cloudflare D1)
  CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID || '',

  // ConfiguraÃ§Ãµes JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-insecure-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // ConfiguraÃ§Ãµes de email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM: process.env.RESEND_FROM || 'AgroSync <contato@agroisync.com>',

  // ConfiguraÃ§Ãµes de pagamento (Stripe)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // ConfiguraÃ§Ãµes Web3/Blockchain
  WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,

  // ConfiguraÃ§Ãµes de upload (Cloudinary)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Cloudflare Turnstile (Captcha)
  CLOUDFLARE_TURNSTILE_SECRET_KEY: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '',

  // ConfiguraÃ§Ãµes de seguranÃ§a
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10, 10) || 900000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10, 10) || 100,

  // ConfiguraÃ§Ãµes de logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',

  // ConfiguraÃ§Ãµes de monitoramento
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,

  // ConfiguraÃ§Ãµes de frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // ConfiguraÃ§Ãµes de features
  FEATURES: {
    ENABLE_CHAT: process.env.ENABLE_CHAT !== 'false',
    ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS !== 'false',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',
    ENABLE_PWA: process.env.ENABLE_PWA !== 'false',
    ENABLE_2FA: process.env.ENABLE_2FA !== 'false',
    ENABLE_BLOCKCHAIN: process.env.ENABLE_BLOCKCHAIN !== 'false'
  },

  // ConfiguraÃ§Ãµes de timeout
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT, 10, 10) || 30000,

  // ConfiguraÃ§Ãµes de retry
  API_RETRY_ATTEMPTS: parseInt(process.env.API_RETRY_ATTEMPTS, 10, 10) || 3,

  // ConfiguraÃ§Ãµes de cache
  CACHE_DURATION: parseInt(process.env.CACHE_DURATION, 10, 10) || 300000, // 5 minutos

  // ConfiguraÃ§Ãµes de sessÃ£o
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE, 10, 10) || 86400000, // 24 horas

  // ConfiguraÃ§Ãµes de upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10, 10) || 10485760, // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ],

  // ConfiguraÃ§Ãµes de validaÃ§Ã£o
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH, 10, 10) || 8,
  USERNAME_MIN_LENGTH: parseInt(process.env.USERNAME_MIN_LENGTH, 10, 10) || 3,

  // ConfiguraÃ§Ãµes de limpeza
  CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL, 10, 10) || 3600000, // 1 hora
  TOKEN_CLEANUP_AGE: parseInt(process.env.TOKEN_CLEANUP_AGE, 10, 10) || 86400000 // 24 horas
};

// ValidaÃ§Ã£o de configuraÃ§Ãµes obrigatÃ³rias em produÃ§Ã£o
if (config.NODE_ENV === 'production') {
  // Em produção, exigir variáveis críticas. Stripe é opcional via STRIPE_ENABLED.
  const requiredEnvVars = ['JWT_SECRET', 'SMTP_USER', 'SMTP_PASS'];

  // Se Stripe estiver habilitado explicitamente, exigir a chave secreta
  if ((process.env.STRIPE_ENABLED || 'false').toLowerCase() === 'true') {
    requiredEnvVars.push('STRIPE_SECRET_KEY');
  }

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`
    );
  }
}

export default config;
