// ===== CONFIGURAÇÃO CENTRALIZADA DE APIs =====
// TODAS as URLs e constantes de API em um único lugar

// ===== TOKEN PADRONIZADO =====
// SEMPRE usar 'authToken' em todo o projeto
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'userData';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// ===== URLs BASE =====
export const API_URLS = {
  // Backend Principal - usar rota relativa para funcionar offline no mobile
  base: process.env.REACT_APP_API_URL || '/api',
  
  // WebSocket - detectar origem atual
  ws: (() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}`;
      }
    } catch (e) { /* ignore */ }
    return process.env.REACT_APP_WS_URL || '';
  })(),
  
  // Frontend - detectar origem atual
  frontend: (() => {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return window.location.origin;
      }
    } catch (e) { /* ignore */ }
    return process.env.REACT_APP_PUBLIC_URL || '';
  })(),
  
  // CDN (se usar)
  cdn: process.env.REACT_APP_CDN_URL || '',
};

// ===== ENDPOINTS PADRONIZADOS =====
export const ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendCode: '/auth/resend-code',
    enable2FA: '/auth/enable-2fa',
    verify2FA: '/auth/verify-2fa',
  },
  
  // User
  user: {
    profile: '/users/profile',
    update: '/users/profile',
    dashboard: '/users/dashboard',
    notifications: '/users/notifications',
  },
  
  // Products
  products: {
    list: '/products',
    create: '/products',
    detail: (id) => `/products/${id}`,
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
    search: '/products/search',
  },
  
  // Freights
  freights: {
    list: '/freights',
    create: '/freights',
    detail: (id) => `/freights/${id}`,
    update: (id) => `/freights/${id}`,
    delete: (id) => `/freights/${id}`,
    track: (code) => `/freights/track/${code}`,
  },
  
  // Messages
  messages: {
    conversations: '/messages/conversations',
    list: (id) => `/messages/${id}`,
    send: '/messages',
    read: (id) => `/messages/${id}/read`,
  },
  
  // Payments
  payments: {
    createSession: '/payments/stripe/create-session',
    webhook: '/payments/stripe/webhook',
    status: '/payments/status',
    verify: '/payments/verify',
  },
  
  // Admin
  admin: {
    dashboard: '/auth/admin/dashboard',
    users: '/auth/admin/users',
    user: (id) => `/auth/admin/users/${id}`,
    payments: '/auth/admin/payments',
    stats: '/admin/stats',
  },
  
  // Upload
  upload: {
    single: '/upload/single',
    multiple: '/upload/multiple',
    delete: (filename) => `/upload/${filename}`,
  },
  
  // External APIs (com fallback)
  external: {
    weather: '/external/weather',
    ibge: '/external/ibge',
    viacep: '/external/viacep',
    receitaFederal: '/external/receita-federal',
  },
  
  // Health
  health: '/health',
};

// ===== TIMEOUTS =====
export const TIMEOUTS = {
  default: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  upload: 60000, // 60s para uploads
  short: 10000,  // 10s para operações rápidas
  long: 120000,  // 2min para operações pesadas
};

// ===== RETRY CONFIGURATION =====
export const RETRY_CONFIG = {
  attempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,
  delay: 1000, // 1s entre tentativas
  backoff: 2,  // Multiplicador exponencial
};

// ===== CACHE =====
export const CACHE_CONFIG = {
  duration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000, // 5 min
  enabled: true,
};

// ===== HELPERS =====

/**
 * Obter URL completa de um endpoint
 */
export const getFullUrl = (endpoint) => {
  if (endpoint.startsWith('http')) return endpoint;
  return `${API_URLS.base}${endpoint}`;
};

/**
 * Obter token de autenticação (PADRONIZADO)
 */
export const getAuthToken = () => {
  // Verificar ambos os nomes para compatibilidade
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    null
  );
};

/**
 * Definir token de autenticação (PADRONIZADO)
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // Remover nomes antigos se existirem
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
  }
};

/**
 * Remover token de autenticação
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Verificar se usuário está autenticado
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Headers padrão para requisições
 */
export const getDefaultHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Fazer requisição com retry e timeout
 */
export const fetchWithRetry = async (url, options = {}, retries = RETRY_CONFIG.attempts) => {
  const fullUrl = getFullUrl(url);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || TIMEOUTS.default);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getDefaultHeaders(),
        ...options.headers,
      },
    });

    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    
    if (retries > 0 && (!error.name || error.name !== 'AbortError')) {
      // Aguardar antes de tentar novamente (backoff exponencial)
      await new Promise(resolve =>
        setTimeout(resolve, RETRY_CONFIG.delay * (RETRY_CONFIG.backoff ** (RETRY_CONFIG.attempts - retries)))
      );
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
};

const APIConfig = {
  API_URLS,
  ENDPOINTS,
  TIMEOUTS,
  RETRY_CONFIG,
  CACHE_CONFIG,
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  getFullUrl,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
  getDefaultHeaders,
  fetchWithRetry,
};

export default APIConfig;