/**
 * AGROISYNC BACKEND - Configurações Centralizadas
 *
 * Este arquivo centraliza todas as configurações do backend
 * para facilitar manutenção e evitar valores hardcoded.
 */

// ===== CONFIGURAÇÃO DE URLs =====
export const URL_CONFIG = {
  // URL do frontend
  frontendURL:
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://agroisync.com' : 'http://localhost:3000'),

  // URLs permitidas para CORS
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'https://agroisync.com',
    'https://www.agroisync.com',
    'https://agroisync.pages.dev' // Cloudflare Pages
  ],

  // URL da API (backend)
  apiURL:
    process.env.API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://agroisync.com/api'
      : 'http://localhost:5000/api')
};

// ===== CONFIGURAÇÃO DE BANCO DE DADOS =====
export const DATABASE_CONFIG = {
  // Cloudflare D1
  d1DatabaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '',

  // Configurações de conexão
  connectionTimeout: 30000, // 30 segundos
  queryTimeout: 10000, // 10 segundos
  retryAttempts: 3,
  retryDelay: 1000 // 1 segundo
};

// ===== AUTENTICAÇÃO JWT =====
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'dev-insecure-jwt-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-insecure-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: process.env.JWT_ISSUER || 'agroisync',
  audience: process.env.JWT_AUDIENCE || 'agroisync-users'
};

// ===== CONFIGURAÇÃO DE E-MAIL =====
export const EMAIL_CONFIG = {
  // Resend API
  resendApiKey: process.env.RESEND_API_KEY || '',
  from: process.env.RESEND_FROM || 'AgroSync <noreply@agroisync.com>',

  // URLs para templates de email
  resetPasswordURL: (token) => `${URL_CONFIG.frontendURL}/reset-password?token=${token}`,
  verifyEmailURL: (token) => `${URL_CONFIG.frontendURL}/verify-email?token=${token}`,
  inviteURL: (code) => `${URL_CONFIG.frontendURL}/signup/${code}`
};

// ===== STRIPE =====
export const STRIPE_CONFIG = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2023-10-16'
};

// ===== WEB3/BLOCKCHAIN =====
export const WEB3_CONFIG = {
  providerUrl:
    process.env.WEB3_PROVIDER ||
    process.env.ETHEREUM_RPC_URL ||
    'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  privateKey: process.env.ETHEREUM_PRIVATE_KEY || process.env.PRIVATE_KEY || '',

  // Metamask
  metamask: {
    networkId: process.env.METAMASK_NETWORK_ID || '1',
    chainId: process.env.METAMASK_CHAIN_ID || '0x1',
    walletAddress: process.env.METAMASK_WALLET_ADDRESS || '',
    adminAddress: process.env.METAMASK_ADMIN_ADDRESS || ''
  }
};

// ===== CLOUDFLARE =====
export const CLOUDFLARE_CONFIG = {
  // Turnstile (Captcha)
  turnstile: {
    secretKey: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '',
    siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
  },

  // API Cloudflare
  apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  zoneId: process.env.CLOUDFLARE_ZONE_ID || '',
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || ''
};

// ===== UPLOAD DE ARQUIVOS =====
export const UPLOAD_CONFIG = {
  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },

  // Limites
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || process.env.UPLOAD_MAX_SIZE, 10) || 10485760, // 10MB
  allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ],
  uploadPath: process.env.UPLOAD_PATH || 'uploads/'
};

// ===== APIs EXTERNAS =====
export const EXTERNAL_APIS = {
  // OpenWeatherMap
  weather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    timeout: 10000
  },

  // IBGE (API Pública)
  ibge: {
    baseUrl: process.env.IBGE_API_URL || 'https://servicodados.ibge.gov.br/api/v1',
    timeout: 15000
  },

  // ViaCEP (API Pública)
  viaCep: {
    baseUrl: process.env.VIACEP_API_URL || 'https://viacep.com.br/ws',
    timeout: 10000
  },

  // Receita Federal
  receitaFederal: {
    baseUrl: process.env.RECEITA_FEDERAL_API_URL || 'https://api.receita.fazenda.gov.br',
    apiKey: process.env.RECEITA_FEDERAL_API_KEY || '',
    timeout: 20000
  },

  // Baidu Maps
  baiduMaps: {
    baseUrl: 'https://api.map.baidu.com',
    apiKey: process.env.BAIDU_MAPS_API_KEY || '',
    timeout: 15000
  },

  // IP Geolocation
  ipApi: {
    baseUrl: process.env.IP_API_URL || 'http://ip-api.com/json',
    timeout: 5000
  },

  ipinfo: {
    baseUrl: process.env.IPINFO_URL || 'https://ipinfo.io',
    timeout: 5000
  }
};

// ===== SEGURANÇA =====
export const SECURITY_CONFIG = {
  // CORS
  corsOrigin:
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || URL_CONFIG.allowedOrigins,

  // Bcrypt
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
  },

  // Session
  sessionSecret: process.env.SESSION_SECRET || 'dev-insecure-session-secret',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 86400000, // 24 horas

  // Password Validation
  passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8,
  usernameMinLength: parseInt(process.env.USERNAME_MIN_LENGTH, 10) || 3
};

// ===== LOGS =====
export const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  file: process.env.LOG_FILE || 'logs/app.log',
  filePath: process.env.LOG_FILE_PATH || './logs',
  maxSize: process.env.LOG_MAX_SIZE || '10m',
  maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5
};

// ===== CACHE =====
export const CACHE_CONFIG = {
  ttl: parseInt(process.env.CACHE_TTL, 10) || 3600, // 1 hora
  checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD, 10) || 600, // 10 minutos
  duration: parseInt(process.env.CACHE_DURATION, 10) || 300000 // 5 minutos
};

// ===== FEATURE FLAGS =====
export const FEATURE_FLAGS = {
  enable2FA: process.env.ENABLE_2FA === 'true',
  enableCrypto: process.env.ENABLE_CRYPTO === 'true' || process.env.ENABLE_BLOCKCHAIN === 'true',
  enableStripe: process.env.ENABLE_STRIPE === 'true',
  enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  enableChat: process.env.ENABLE_CHAT === 'true',
  enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  enablePWA: process.env.ENABLE_PWA === 'true'
};

// ===== MONITORAMENTO =====
export const MONITORING_CONFIG = {
  // Sentry
  sentryDsn: process.env.SENTRY_DSN || '',
  sentryEnabled: process.env.NODE_ENV === 'production' && !!process.env.SENTRY_DSN,

  // New Relic
  newRelicKey: process.env.NEW_RELIC_LICENSE_KEY || '',

  // Google Analytics
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || ''
};

// ===== CLEANUP =====
export const CLEANUP_CONFIG = {
  cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL, 10) || 3600000, // 1 hora
  tokenCleanupAge: parseInt(process.env.TOKEN_CLEANUP_AGE, 10) || 86400000 // 24 horas
};

// ===== TIMEOUT E RETRY =====
export const API_TIMEOUT_CONFIG = {
  timeout: parseInt(process.env.API_TIMEOUT, 10) || 30000, // 30 segundos
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS, 10) || 3
};

// ===== HELPERS =====

/**
 * Verifica se está em ambiente de produção
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Verifica se está em ambiente de desenvolvimento
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Valida se uma API externa está configurada
 */
export const isApiConfigured = (apiName) => {
  const api = EXTERNAL_APIS[apiName];
  return api && api.apiKey && api.apiKey !== '';
};

// Exportar tudo como default também
export default {
  URL_CONFIG,
  DATABASE_CONFIG,
  JWT_CONFIG,
  EMAIL_CONFIG,
  STRIPE_CONFIG,
  WEB3_CONFIG,
  CLOUDFLARE_CONFIG,
  UPLOAD_CONFIG,
  EXTERNAL_APIS,
  SECURITY_CONFIG,
  LOG_CONFIG,
  CACHE_CONFIG,
  FEATURE_FLAGS,
  MONITORING_CONFIG,
  CLEANUP_CONFIG,
  API_TIMEOUT_CONFIG,
  isProduction,
  isDevelopment,
  isApiConfigured
};
