import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const config = {
  // Configurações do servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Configurações do banco de dados (Cloudflare D1)
  CLOUDFLARE_D1_DATABASE_ID: process.env.CLOUDFLARE_D1_DATABASE_ID || '',

  // Configurações JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-insecure-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Configurações de email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM: process.env.RESEND_FROM || 'AgroSync <noreply@agroisync.com>',

  // Configurações de pagamento (Stripe)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Configurações Web3/Blockchain
  WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,

  // Configurações de upload (Cloudinary)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Cloudflare Turnstile (Captcha)
  CLOUDFLARE_TURNSTILE_SECRET_KEY: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '',

  // Configurações de segurança
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // Configurações de logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',

  // Configurações de monitoramento
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,

  // Configurações de frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Configurações de features
  FEATURES: {
    ENABLE_CHAT: process.env.ENABLE_CHAT !== 'false',
    ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS !== 'false',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',
    ENABLE_PWA: process.env.ENABLE_PWA !== 'false',
    ENABLE_2FA: process.env.ENABLE_2FA !== 'false',
    ENABLE_BLOCKCHAIN: process.env.ENABLE_BLOCKCHAIN !== 'false'
  },

  // Configurações de timeout
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT, 10) || 30000,

  // Configurações de retry
  API_RETRY_ATTEMPTS: parseInt(process.env.API_RETRY_ATTEMPTS, 10) || 3,

  // Configurações de cache
  CACHE_DURATION: parseInt(process.env.CACHE_DURATION, 10) || 300000, // 5 minutos

  // Configurações de sessão
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE, 10) || 86400000, // 24 horas

  // Configurações de upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ],

  // Configurações de validação
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8,
  USERNAME_MIN_LENGTH: parseInt(process.env.USERNAME_MIN_LENGTH, 10) || 3,

  // Configurações de limpeza
  CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL, 10) || 3600000, // 1 hora
  TOKEN_CLEANUP_AGE: parseInt(process.env.TOKEN_CLEANUP_AGE, 10) || 86400000 // 24 horas
};

// Validação de configurações obrigatórias em produção
if (config.NODE_ENV === 'production') {
  const requiredEnvVars = ['JWT_SECRET', 'SMTP_USER', 'SMTP_PASS', 'STRIPE_SECRET_KEY'];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`
    );
  }
}

export default config;
