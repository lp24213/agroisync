// Configuração da aplicação AGROISYNC
export const APP_CONFIG = {
  // Configurações básicas
  name: 'AGROISYNC',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // Configurações de autenticação
  auth: {
    cookieName: 'agroisync_auth_token',
    cookieExpiry: 7, // dias
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  
  // Configurações de admin
  admin: {
    // Credenciais removidas por segurança - apenas no backend
    email: process.env.REACT_APP_ADMIN_EMAIL || '',
    password: process.env.REACT_APP_ADMIN_PASSWORD || ''
  },
  
  // Configurações de API
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000
  },
  
  // Configurações de features
  features: {
    crypto: true,
    chat: true,
    notifications: true,
    analytics: true
  },
  
  // Configurações de desenvolvimento
  development: {
    enableDebug: true,
    enableMockData: true,
    enableLogs: true
  }
};

// Configurações específicas por ambiente
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...APP_CONFIG,
        auth: {
          ...APP_CONFIG.auth,
          secure: true
        },
        development: {
          ...APP_CONFIG.development,
          enableDebug: false,
          enableMockData: false,
          enableLogs: false
        }
      };
    
    case 'test':
      return {
        ...APP_CONFIG,
        development: {
          ...APP_CONFIG.development,
          enableMockData: true
        }
      };
    
    default: // development
      return APP_CONFIG;
  }
};

export default getConfig();
