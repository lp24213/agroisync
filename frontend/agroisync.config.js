/**
 * Configuração central do projeto AgroSync
 * Este arquivo contém todas as configurações e constantes do projeto
 */

module.exports = {
  // Configurações da aplicação
  app: {
    name: 'AgroSync',
    version: '1.0.0',
    description: 'Plataforma revolucionária que combina blockchain e inteligência artificial para transformar o agronegócio',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // Configurações de idiomas
  languages: {
    default: 'pt',
    supported: ['pt', 'en', 'es', 'zh'],
    fallback: 'pt',
  },

  // Configurações das APIs
  apis: {
    marketplace: '/api/marketplace',
    properties: '/api/properties',
    dashboard: '/api/dashboard',
    staking: '/api/staking',
    chatbot: '/api/chatbot',
    translations: '/api/translations',
    upload: '/api/upload',
    auth: '/api/auth',
  },

  // Configurações do MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync',
    database: 'agroisync',
    collections: {
      users: 'users',
      products: 'products',
      properties: 'properties',
      stakingPools: 'staking_pools',
      transactions: 'transactions',
      chatMessages: 'chat_messages',
      translations: 'translations',
      uploadedFiles: 'uploaded_files',
    },
  },

  // Configurações do Firebase
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },

  // Configurações de segurança
  security: {
    jwtSecret: process.env.JWT_SECRET || 'agroisync-secret-key',
    jwtExpiresIn: '7d',
    bcryptRounds: 12,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },

  // Configurações de upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument',
    ],
    uploadDir: 'public/uploads',
  },

  // Configurações do chatbot
  chatbot: {
    maxMessageLength: 1000,
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    supportedTypes: ['text', 'voice', 'image'],
    fallbackResponse: 'Desculpe, não consegui processar sua mensagem. Como posso ajudá-lo?',
  },

  // Configurações de paginação
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    defaultPage: 1,
  },

  // Configurações de cache
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100,
  },

  // Configurações de notificações
  notifications: {
    email: {
      enabled: true,
      from: 'noreply@agroisync.com',
      templates: {
        welcome: 'welcome-email',
        resetPassword: 'reset-password',
        orderConfirmation: 'order-confirmation',
      },
    },
    push: {
      enabled: true,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    },
  },

  // Configurações de monitoramento
  monitoring: {
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
    },
    analytics: {
      google: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    },
  },

  // Configurações de desenvolvimento
  development: {
    mockData: process.env.NODE_ENV === 'development',
    debug: process.env.NODE_ENV === 'development',
    hotReload: process.env.NODE_ENV === 'development',
  },

  // Configurações de produção
  production: {
    minify: true,
    compress: true,
    cache: true,
    cdn: process.env.CDN_URL,
  },
}
