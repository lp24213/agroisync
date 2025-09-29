// Configuração da API para o frontend
const apiConfig = {
  // URL base da API
  baseURL: process.env.REACT_APP_API_URL || 'https://agroisync.com/api',

  // Timeout para requisições
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,

  // Número de tentativas de retry
  retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,

  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },

  // Configurações de retry
  retryConfig: {
    retries: 3,
    retryDelay: retryCount => {
      return Math.pow(2, retryCount) * 1000; // Exponential backoff
    },
    retryCondition: error => {
      // Retry em caso de erro de rede ou timeout
      return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }
  },

  // Configurações de cache
  cacheConfig: {
    duration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000, // 5 minutos
    enabled: true
  }
};

export default apiConfig;
