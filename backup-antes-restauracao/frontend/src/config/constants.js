/**
 * AGROISYNC - Configurações Centralizadas
 *
 * Este arquivo centraliza todas as configurações do projeto
 * para facilitar manutenção e evitar valores hardcoded.
 *
 * IMPORTANTE: Mantém compatibilidade com código existente através de fallbacks
 */

// ===== CONFIGURAÇÃO DE API =====
export const API_CONFIG = {
  // URL base da API - usa variável de ambiente ou fallback inteligente
  baseURL:
    // Prefer Vite env (VITE_API_URL) or CRA env (REACT_APP_API_URL). Fallbacks:
    // - Em produção, usamos a rota relativa '/api' para permitir proxy via worker/origem atual
    // - Em desenvolvimento, usamos localhost:3001 para compatibilidade local
    process.env.VITE_API_URL || process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'),

  // URL do Socket.IO (para messaging)
  socketURL:
    process.env.VITE_WS_URL || process.env.REACT_APP_SOCKET_URL ||
      // Derivar de VITE_API_URL / REACT_APP_API_URL se possível.
      // Em produção, se não houver variável, usar a origem atual (window.location.origin)
      (() => {
        const envBase = process.env.VITE_API_URL || process.env.REACT_APP_API_URL;
        if (envBase) return envBase.replace(/\/api\/?$/, '');
        if (process.env.NODE_ENV === 'production') {
          try {
            if (typeof window !== 'undefined' && window.location && window.location.origin) return window.location.origin;
          } catch (e) {
            // ignore
          }
          // Fallback para rota relativa em produção
          return '';
        }
        return 'http://localhost:3001';
      })(),

  // Timeout para requisições (30 segundos)
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,

  // Número de tentativas de retry
  retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,

  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};

// ===== AUTENTICAÇÃO =====
export const AUTH_CONFIG = {
  // Nome padronizado do token (usar 'authToken' em todo o projeto)
  tokenKey: 'authToken',

  // Nome do usuário no localStorage
  userKey: 'user',

  // Tempo de expiração do token (7 dias)
  tokenExpiry: 7 * 24 * 60 * 60 * 1000,

  // Rota de redirecionamento após login
  loginRedirect: '/user-dashboard',

  // Rota de login
  loginRoute: '/login'
};

// ===== STRIPE =====
export const STRIPE_CONFIG = {
  // Chave pública do Stripe
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_DEFAULT_KEY_NOT_SET',

  // IDs dos planos (devem ser configurados via .env)
  plans: {
    basic: process.env.REACT_APP_STRIPE_PRICE_BASIC || 'price_basic',
    professional: process.env.REACT_APP_STRIPE_PRICE_PRO || 'price_professional',
    enterprise: process.env.REACT_APP_STRIPE_PRICE_ENTERPRISE || 'price_enterprise'
  },

  // URLs de redirecionamento
  // Calcular origem de forma segura (evita exceções quando executado em ambientes onde `window` pode não existir)
  // Usa fallback para REACT_APP_PUBLIC_URL quando disponível
  successUrl: (() => {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.origin) return `${window.location.origin}/payment/success`;
    } catch (e) {
      // ignore
    }
    return `${process.env.REACT_APP_PUBLIC_URL || ''}/payment/success`;
  })(),
  cancelUrl: (() => {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.origin) return `${window.location.origin}/payment/cancel`;
    } catch (e) {
      // ignore
    }
    return `${process.env.REACT_APP_PUBLIC_URL || ''}/payment/cancel`;
  })()
};

// ===== WEB3/BLOCKCHAIN =====
export const WEB3_CONFIG = {
  // Provider URL
  providerUrl: process.env.REACT_APP_WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',

  // Contract address
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '0x_YOUR_CONTRACT_ADDRESS',

  // Chain ID (1 = Ethereum Mainnet, 5 = Goerli, 137 = Polygon)
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1,

  // Configuração de rede
  networks: {
    ethereum: { chainId: 1, name: 'Ethereum Mainnet' },
    polygon: { chainId: 137, name: 'Polygon' },
    binance: { chainId: 56, name: 'Binance Smart Chain' },
    goerli: { chainId: 5, name: 'Goerli Testnet' }
  }
};

// ===== APIS EXTERNAS =====
export const EXTERNAL_APIS = {
  // OpenWeather API
  weather: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    apiKey: process.env.REACT_APP_WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY || '',
    timeout: 5000,
    cacheDuration: 10 * 60 * 1000 // 10 minutos
  },

  // Alpha Vantage (Stocks)
  stocks: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo',
    timeout: 5000,
    cacheDuration: 5 * 60 * 1000 // 5 minutos
  },

  // Agrolink (Cotações Agrícolas)
  agrolink: {
    baseUrl: process.env.REACT_APP_AGROLINK_API_URL || 'https://api.agrolink.com.br',
    apiKey: process.env.REACT_APP_AGROLINK_API_KEY || '',
    timeout: 5000,
    cacheDuration: 10 * 60 * 1000 // 10 minutos
  },

  // ViaCEP
  viaCep: {
    baseUrl: 'https://viacep.com.br/ws',
    timeout: 3000,
    cacheDuration: 24 * 60 * 60 * 1000 // 24 horas
  },

  // Receita WS (CNPJ)
  receitaWS: {
    baseUrl: 'https://www.receitaws.com.br/v1/cnpj',
    timeout: 5000,
    cacheDuration: 24 * 60 * 60 * 1000 // 24 horas
  },

  // IBGE
  ibge: {
    baseUrl: 'https://servicodados.ibge.gov.br/api/v1',
    timeout: 3000,
    cacheDuration: 24 * 60 * 60 * 1000 // 24 horas
  }
};

// ===== INTERNACIONALIZAÇÃO =====
export const I18N_CONFIG = {
  // Idiomas suportados
  supportedLanguages: ['pt', 'en', 'es', 'zh'],

  // Idioma padrão
  defaultLanguage: 'pt',

  // Nome da chave no localStorage
  storageKey: 'agroisync-language',

  // Mapeamento de idiomas
  languageNames: {
    pt: 'Português',
    en: 'English',
    es: 'Español',
    zh: '中文'
  },

  // Formato de moeda por idioma
  currencyFormats: {
    pt: { locale: 'pt-BR', currency: 'BRL' },
    en: { locale: 'en-US', currency: 'USD' },
    es: { locale: 'es-ES', currency: 'EUR' },
    zh: { locale: 'zh-CN', currency: 'CNY' }
  }
};

// ===== CLOUDFLARE =====
export const CLOUDFLARE_CONFIG = {
  // Turnstile (Captcha)
  turnstile: {
    siteKey:
      process.env.REACT_APP_TURNSTILE_SITE_KEY ||
      process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      '0x4AAAAAAB3pdjs4jRKvAtaA'
  }
};

// ===== ANALYTICS =====
export const ANALYTICS_CONFIG = {
  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    enabled: process.env.NODE_ENV === 'production'
  },

  // Sentry (Error Tracking)
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN || '',
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV || 'development'
  }
};

// ===== CACHE =====
export const CACHE_CONFIG = {
  // Duração do cache (em milissegundos)
  defaultDuration: 5 * 60 * 1000, // 5 minutos

  // Duração específica por tipo
  durations: {
    user: 10 * 60 * 1000, // 10 minutos
    products: 5 * 60 * 1000, // 5 minutos
    weather: 10 * 60 * 1000, // 10 minutos
    stocks: 5 * 60 * 1000, // 5 minutos
    quotes: 10 * 60 * 1000, // 10 minutos
    static: 24 * 60 * 60 * 1000 // 24 horas
  }
};

// ===== FEATURES FLAGS =====
export const FEATURE_FLAGS = {
  // Features habilitadas
  crypto: true,
  web3: true,
  stripe: true,
  messaging: true,
  ai: true,
  analytics: process.env.NODE_ENV === 'production',

  // Features em desenvolvimento
  beta: {
    newDashboard: false,
    advancedCharts: false
  }
};

// ===== VALIDAÇÕES =====
export const VALIDATION_CONFIG = {
  // Password
  password: {
    minLength: 6,
    maxLength: 100,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  },

  // Email
  email: {
    maxLength: 255,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // Phone
  phone: {
    regex: /^\+?[\d\s\-()]+$/,
    minLength: 10,
    maxLength: 20
  },

  // File Upload
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  }
};

// ===== HELPERS =====

/**
 * Verifica se uma API externa está configurada
 */
export const isApiConfigured = apiName => {
  const api = EXTERNAL_APIS[apiName];
  return api && api.apiKey && api.apiKey !== '' && api.apiKey !== 'demo';
};

/**
 * Obtém o token de autenticação do localStorage
 * Mantém compatibilidade com ambos os nomes (token e authToken)
 */
export const getAuthToken = () => {
  return (
    localStorage.getItem(AUTH_CONFIG.tokenKey) ||
    localStorage.getItem('token') || // Fallback para compatibilidade
    null
  );
};

/**
 * Define o token de autenticação no localStorage
 * Define em ambos os lugares para compatibilidade durante transição
 */
export const setAuthToken = token => {
  localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  localStorage.setItem('token', token); // Manter para compatibilidade
};

/**
 * Remove o token de autenticação
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem('token'); // Remover ambos
  localStorage.removeItem(AUTH_CONFIG.userKey);
};

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
 * Formata URL da API com caminho
 */
export const getApiUrl = (path = '') => {
  const baseUrl = API_CONFIG.baseURL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Exportar tudo como default também
const Constants = {
  API_CONFIG,
  AUTH_CONFIG,
  STRIPE_CONFIG,
  WEB3_CONFIG,
  EXTERNAL_APIS,
  I18N_CONFIG,
  CLOUDFLARE_CONFIG,
  ANALYTICS_CONFIG,
  CACHE_CONFIG,
  FEATURE_FLAGS,
  VALIDATION_CONFIG,
  isApiConfigured,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isProduction,
  isDevelopment,
  getApiUrl
};

export default Constants;
