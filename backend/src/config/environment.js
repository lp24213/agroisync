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

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0
  },

  // Stripe
  stripe: {
    secretKey:
      process.env.STRIPE_SECRET_KEY ||
      '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',
    publishableKey:
      process.env.STRIPE_PUBLISHABLE_KEY ||
      'pk_live_51QVXlZGYY0MfrP1aPEJhU9TAd2zdJ7ZIOVdhji34IzdgLyFkXHDiWUaved6J7HKQiQpXKk1E9SHrAmiJKmDnETow00omwjh2Bg',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_stripe_webhook_secret_here'
  },

  // AWS Cognito
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
    clientId: process.env.AWS_COGNITO_CLIENT_ID || '',
    region: process.env.AWS_COGNITO_REGION || 'us-east-1'
  },

  // Metamask
  metamask: {
    networkId: process.env.METAMASK_NETWORK_ID || '1',
    chainId: process.env.METAMASK_CHAIN_ID || '0x1',
    walletAddress: process.env.METAMASK_WALLET_ADDRESS || ''
  },

  // Email
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@agrotm.com'
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
