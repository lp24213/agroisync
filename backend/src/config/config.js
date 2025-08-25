import { environment } from './environment.js';

// Configuração da aplicação
export const config = {
  // Servidor
  server: {
    port: environment.server.port,
    nodeEnv: environment.server.nodeEnv,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // JWT
  jwt: {
    secret: environment.jwt.secret,
    expiresIn: environment.jwt.expiresIn
  },

  // MongoDB
  mongodb: {
    uri: environment.mongodb.uri,
    uriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/agrotm_test'
  },

  // Stripe
  stripe: {
    secretKey: environment.stripe.secretKey,
    publishableKey: environment.stripe.publishableKey,
    webhookSecret: environment.stripe.webhookSecret,
    priceIds: {
      store: {
        basic: process.env.STRIPE_STORE_BASIC_PRICE_ID || 'price_store_basic',
        pro: process.env.STRIPE_STORE_PRO_PRICE_ID || 'price_store_pro',
        enterprise: process.env.STRIPE_STORE_ENTERPRISE_PRICE_ID || 'price_store_enterprise'
      },
      freight: {
        basic: process.env.STRIPE_FREIGHT_BASIC_PRICE_ID || 'price_freight_basic',
        pro: process.env.STRIPE_FREIGHT_PRO_PRICE_ID || 'price_freight_pro',
        enterprise: process.env.STRIPE_FREIGHT_ENTERPRISE_PRICE_ID || 'price_freight_enterprise'
      }
    }
  },

  // Metamask
  metamask: {
    adminAddress: process.env.METAMASK_ADMIN_ADDRESS || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1',
    rpcUrls: {
      ethereum: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your_project_id',
      polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      binance: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
      arbitrum: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
    }
  },

  // Segurança
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000
    }
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER || 'your_email@gmail.com',
      pass: process.env.SMTP_PASS || 'your_app_password'
    }
  },

  // Cloudflare
  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    zoneId: process.env.CLOUDFLARE_ZONE_ID
  },

  // Monitoramento
  monitoring: {
    sentry: process.env.SENTRY_DSN,
    newRelic: process.env.NEW_RELIC_LICENSE_KEY
  }
};

// Validação da configuração
export const validateConfig = () => {
  const required = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Variáveis de ambiente obrigatórias não configuradas:', missing);
    console.warn('   Configure-as no arquivo .env ou nas variáveis de ambiente do sistema');
  }

  // Verificar se estamos em produção
  if (config.server.nodeEnv === 'production') {
    const productionRequired = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'CLOUDFLARE_API_TOKEN'
    ];

    const productionMissing = productionRequired.filter(key => !process.env[key]);
    
    if (productionMissing.length > 0) {
      console.warn('⚠️  Variáveis de produção não configuradas:', productionMissing);
    }
  }
};

export default config;
