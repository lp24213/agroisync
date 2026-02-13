// Configurações para Cloudflare
const config = {
  // URLs da API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://agroisync.com/api',

  // URLs do frontend
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',

  // Configurações de pagamento
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,

  // Configurações Web3
  WEB3_PROVIDER: process.env.REACT_APP_WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',

  // Configurações de chatbot
  CHATBOT_API_KEY: process.env.REACT_APP_CHATBOT_API_KEY,

  // Configurações de upload de arquivos
  CLOUDINARY_CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.REACT_APP_CLOUDINARY_API_KEY,

  // Configurações de notificações
  PUSH_NOTIFICATIONS_PUBLIC_KEY: process.env.REACT_APP_PUSH_NOTIFICATIONS_PUBLIC_KEY,

  // Configurações de analytics
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,

  // Configurações de ambiente
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Configurações de debug
  DEBUG: process.env.REACT_APP_DEBUG === 'true',

  // Configurações de features
  FEATURES: {
    ENABLE_CHAT: process.env.REACT_APP_ENABLE_CHAT !== 'false',
    ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS !== 'false',
    ENABLE_PWA: process.env.REACT_APP_ENABLE_PWA !== 'false'
  },

  // Configurações de timeout
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,

  // Configurações de retry
  API_RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,

  // Configurações de cache
  CACHE_DURATION: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000 // 5 minutos
};

export default config;
