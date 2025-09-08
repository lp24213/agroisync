// Configuração de ambiente para o frontend
export const environment = {
  // Configuração da API
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    wsURL: process.env.REACT_APP_WS_URL || 'ws://localhost:5000'
  },

  // Ambiente
  env: process.env.REACT_APP_ENV || 'development',
  isDevelopment: process.env.REACT_APP_ENV === 'development',
  isProduction: process.env.REACT_APP_ENV === 'production',

  // Features
  features: {
    stripe: process.env.REACT_APP_ENABLE_STRIPE === 'true',
    metamask: process.env.REACT_APP_ENABLE_METAMASK === 'true',
    websocket: process.env.REACT_APP_ENABLE_WEBSOCKET === 'true'
  },

  // Stripe
  stripe: {
    publishableKey:
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
      'pk_live_51QVXlZGYY0MfrP1aPEJhU9TAd2zdJ7ZIOVdhji34IzdgLyFkXHDiWUaved6J7HKQiQpXKk1E9SHrAmiJKmDnETow00omwjh2Bg',
    priceIds: {
      store: {
        basic: process.env.REACT_APP_STRIPE_STORE_BASIC_PRICE_ID || 'price_store_basic',
        pro: process.env.REACT_APP_STRIPE_STORE_PRO_PRICE_ID || 'price_store_pro',
        enterprise: process.env.REACT_APP_STRIPE_STORE_ENTERPRISE_PRICE_ID || 'price_store_enterprise'
      },
      freight: {
        basic: process.env.REACT_APP_STRIPE_FREIGHT_BASIC_PRICE_ID || 'price_freight_basic',
        pro: process.env.REACT_APP_STRIPE_FREIGHT_PRO_PRICE_ID || 'price_freight_pro',
        enterprise: process.env.REACT_APP_STRIPE_FREIGHT_ENTERPRISE_PRICE_ID || 'price_freight_enterprise'
      }
    }
  },

  // Metamask
  metamask: {
    networkId: process.env.REACT_APP_METAMASK_NETWORK_ID || '1',
    chainId: process.env.REACT_APP_METAMASK_CHAIN_ID || '0x1'
  },

  // AWS Cognito
  cognito: {
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '',
    clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || '',
    region: process.env.REACT_APP_AWS_COGNITO_REGION || ''
  },

  // Serviços Externos
  services: {
    googleAnalytics: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    sentry: process.env.REACT_APP_SENTRY_DSN || ''
  }
}

export default environment
