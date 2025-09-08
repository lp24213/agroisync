import { environment } from './environment.js'

// Configuração da aplicação
export const config = {
  // API
  api: {
    baseURL: environment.api.baseURL,
    timeout: 30000,
    retries: 3
  },

  // App
  app: {
    name: 'AGROTM',
    version: '1.0.0',
    environment: environment.env
  },

  // Features
  features: environment.features,

  // Stripe
  stripe: environment.stripe,

  // External Services
  services: {
    googleAnalytics: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    sentry: process.env.REACT_APP_SENTRY_DSN
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },

  // File Upload
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 5
  },

  // WebSocket
  websocket: {
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:5000',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  }
}

export default config
