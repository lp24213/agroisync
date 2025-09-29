// Configuração de ambiente para o backend
export const environment = {
  // Servidor
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Cloudflare D1 Database
  database: {
    d1DatabaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || ''
  },

  // Cloudflare Turnstile
  turnstile: {
    secretKey: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '',
    siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_DEFAULT_KEY_NOT_SET',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_DEFAULT_KEY_NOT_SET',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_DEFAULT_WEBHOOK_SECRET_NOT_SET'
  },

  // Metamask
  metamask: {
    networkId: process.env.METAMASK_NETWORK_ID || '1',
    chainId: process.env.METAMASK_CHAIN_ID || '0x1',
    walletAddress: process.env.METAMASK_WALLET_ADDRESS || ''
  },

  // Email (Resend)
  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: process.env.RESEND_FROM || 'AgroSync <noreply@agroisync.com>'
  },

  // Cloudflare
  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    zoneId: process.env.CLOUDFLARE_ZONE_ID || '',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || ''
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: process.env.LOG_MAX_FILES || 5
  },

  // Segurança
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutos
    rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
    bcryptRounds: process.env.BCRYPT_ROUNDS || 12
  }
};

export default environment;
