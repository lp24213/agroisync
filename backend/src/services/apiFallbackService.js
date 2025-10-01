// =============================================================
// AGROISYNC • Serviço de Fallback para APIs Externas
// =============================================================

import logger from '../utils/logger.js';

// Cache para armazenar dados de fallback
const fallbackCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Configurações de APIs externas com fallbacks
const API_CONFIGS = {
  weather: {
    primary: 'https://api.openweathermap.org/data/2.5',
    fallback: 'https://api.weatherapi.com/v1',
    backup: 'https://www.metaweather.com/api/location'
  },
  cep: {
    primary: 'https://viacep.com.br/ws',
    fallback: 'https://cep.awesomeapi.com.br/json',
    backup: 'https://brasilapi.com.br/api/cep/v2'
  },
  ibge: {
    primary: 'https://servicodados.ibge.gov.br/api/v1',
    fallback: 'https://api.ibge.gov.br/v1',
    backup: null // Sem backup para IBGE
  },
  cnpj: {
    primary: 'https://www.receitaws.com.br/v1/cnpj',
    fallback: 'https://api.cnpja.com/company',
    backup: 'https://brasilapi.com.br/api/cnpj/v1'
  }
};

/**
 * Executa requisição com fallback automático
 * @param {string} service - Nome do serviço (weather, cep, ibge, cnpj)
 * @param {string} endpoint - Endpoint específico
 * @param {object} options - Opções da requisição
 * @returns {Promise<object>} Dados da API ou fallback
 */
export const fetchWithFallback = async (service, endpoint, options = {}) => {
  const cacheKey = `${service}:${endpoint}:${JSON.stringify(options)}`;

  // Verificar cache primeiro
  const cached = fallbackCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.info(`Cache hit para ${service}:${endpoint}`);
    return { success: true, data: cached.data, source: 'cache' };
  }

  const config = API_CONFIGS[service];
  if (!config) {
    throw new Error(`Serviço ${service} não configurado`);
  }

  // Tentar APIs em ordem de prioridade
  const apis = [config.primary, config.fallback, config.backup].filter(Boolean);

  for (let i = 0; i < apis.length; i++) {
    const apiUrl = apis[i];
    try {
      logger.info(`Tentando ${service} via ${apiUrl}`);

      const response = await fetch(`${apiUrl}${endpoint}`, {
        timeout: 10000,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Armazenar no cache
      fallbackCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      logger.info(`Sucesso ${service} via ${apiUrl}`);
      return {
        success: true,
        data,
        source: i === 0 ? 'primary' : i === 1 ? 'fallback' : 'backup',
        api: apiUrl
      };
    } catch (error) {
      logger.warn(`Falha ${service} via ${apiUrl}: ${error.message}`);

      // Se for a última tentativa, retornar erro
      if (i === apis.length - 1) {
        logger.error(`Todas as APIs falharam para ${service}:${endpoint}`);
        return {
          success: false,
          error: error.message,
          source: 'all_failed'
        };
      }
    }
  }
};

/**
 * Buscar dados de clima com fallback
 */
export const getWeatherData = async (city, apiKey) => {
  const endpoint = `/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
  return await fetchWithFallback('weather', endpoint);
};

/**
 * Buscar dados de CEP com fallback
 */
export const getCepData = async cep => {
  const cleanCep = cep.replace(/\D/g, '');
  const endpoint = `/${cleanCep}/json`;
  return await fetchWithFallback('cep', endpoint);
};

/**
 * Buscar dados do IBGE com fallback
 */
export const getIbgeData = async endpoint => {
  return await fetchWithFallback('ibge', endpoint);
};

/**
 * Buscar dados de CNPJ com fallback
 */
export const getCnpjData = async cnpj => {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const endpoint = `/${cleanCnpj}`;
  return await fetchWithFallback('cnpj', endpoint);
};

/**
 * Limpar cache de fallback
 */
export const clearFallbackCache = () => {
  fallbackCache.clear();
  logger.info('Cache de fallback limpo');
};

/**
 * Obter estatísticas do cache
 */
export const getFallbackStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  for (const [, value] of fallbackCache.entries()) {
    if (now - value.timestamp < CACHE_DURATION) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }

  return {
    total: fallbackCache.size,
    valid: validEntries,
    expired: expiredEntries,
    cacheDuration: CACHE_DURATION
  };
};

/**
 * Health check das APIs
 */
export const healthCheck = async () => {
  const results = {};

  for (const [service, config] of Object.entries(API_CONFIGS)) {
    results[service] = {};

    const apis = [config.primary, config.fallback, config.backup].filter(Boolean);

    for (let i = 0; i < apis.length; i++) {
      const apiUrl = apis[i];
      try {
        const response = await fetch(`${apiUrl}/health`, {
          timeout: 5000,
          method: 'HEAD'
        });

        results[service][`api_${i + 1}`] = {
          url: apiUrl,
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: Date.now()
        };
      } catch (error) {
        results[service][`api_${i + 1}`] = {
          url: apiUrl,
          status: 'error',
          error: error.message
        };
      }
    }
  }

  return results;
};

export default {
  fetchWithFallback,
  getWeatherData,
  getCepData,
  getIbgeData,
  getCnpjData,
  clearFallbackCache,
  getFallbackStats,
  healthCheck
};
