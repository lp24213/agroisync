/**
 * AGROISYNC - External API Wrapper com Fallback e Cache
 *
 * Este serviço centraliza o acesso a APIs externas com:
 * - Cache automático
 * - Fallback para dados mockados quando API falha
 * - Retry automático
 * - Logs de erro
 */

import axios from 'axios';
import { EXTERNAL_APIS } from '../config/constants.js';

class ExternalApiWrapper {
  constructor() {
    this.cache = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 segundo
  }

  /**
   * Busca dados com cache e fallback
   */
  async fetchWithFallback(apiName, url, options = {}) {
    const {
      cacheDuration = EXTERNAL_APIS[apiName]?.cacheDuration || 5 * 60 * 1000,
      fallbackData = null,
      mockData = null,
      enableCache = true
    } = options;

    // Verificar cache primeiro
    if (enableCache) {
      const cached = this.getFromCache(url);
      if (cached) {
        console.log(`📦 Cache hit for ${apiName}:`, url);
        return { success: true, data: cached, source: 'cache' };
      }
    }

    // Tentar buscar da API
    try {
      const data = await this.fetchWithRetry(url, options);

      // Salvar no cache
      if (enableCache) {
        this.saveToCache(url, data, cacheDuration);
      }

      return { success: true, data, source: 'api' };
    } catch (error) {
      console.warn(`⚠️ ${apiName} API falhou:`, error.message);

      // Usar fallback se disponível
      if (fallbackData || mockData) {
        console.log(`🔄 Usando fallback para ${apiName}`);
        return {
          success: true,
          data: fallbackData || mockData,
          source: 'fallback',
          error: error.message
        };
      }

      // Se não há fallback, retornar erro
      return {
        success: false,
        error: error.message,
        source: 'error'
      };
    }
  }

  /**
   * Busca com retry automático
   */
  async fetchWithRetry(url, options = {}, attempt = 1) {
    try {
      const response = await axios.get(url, {
        timeout: options.timeout || 5000,
        ...options
      });
      return response.data;
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.log(`🔄 Retry ${attempt}/${this.retryAttempts} for ${url}`);
        await this.sleep(this.retryDelay * attempt);
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Gerenciamento de cache
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, expiry } = cached;

    // Verificar se expirou
    if (Date.now() > expiry) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  saveToCache(key, data, duration) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + duration
    });
  }

  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Helper para sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * APIs específicas com fallback
   */

  // ViaCEP com fallback
  async fetchCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      return { success: false, error: 'CEP inválido' };
    }

    const url = `${EXTERNAL_APIS.viaCep.baseUrl}/${cleanCEP}/json`;

    return this.fetchWithFallback('viaCep', url, {
      cacheDuration: EXTERNAL_APIS.viaCep.cacheDuration,
      timeout: EXTERNAL_APIS.viaCep.timeout,
      fallbackData: {
        cep: cleanCEP,
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        erro: 'Serviço temporariamente indisponível'
      }
    });
  }

  // IBGE com fallback
  async fetchIBGEStates() {
    const url = `${EXTERNAL_APIS.ibge.baseUrl}/localidades/estados`;

    return this.fetchWithFallback('ibge', url, {
      cacheDuration: EXTERNAL_APIS.ibge.cacheDuration,
      timeout: EXTERNAL_APIS.ibge.timeout,
      mockData: [
        { id: 35, sigla: 'SP', nome: 'São Paulo' },
        { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
        { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
        { id: 41, sigla: 'PR', nome: 'Paraná' },
        { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
        { id: 52, sigla: 'GO', nome: 'Goiás' },
        { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
        { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' }
      ]
    });
  }

  async fetchIBGECities(stateId) {
    const url = `${EXTERNAL_APIS.ibge.baseUrl}/localidades/estados/${stateId}/municipios`;

    return this.fetchWithFallback('ibge', url, {
      cacheDuration: EXTERNAL_APIS.ibge.cacheDuration,
      timeout: EXTERNAL_APIS.ibge.timeout,
      mockData: []
    });
  }

  // Weather API com fallback
  async fetchWeather(city) {
    if (!EXTERNAL_APIS.weather.apiKey) {
      console.warn('⚠️ Weather API key não configurada');
      return this.getWeatherMockData(city);
    }

    const url = `${EXTERNAL_APIS.weather.baseUrl}/weather?q=${city}&appid=${EXTERNAL_APIS.weather.apiKey}&units=metric&lang=pt_br`;

    return this.fetchWithFallback('weather', url, {
      cacheDuration: EXTERNAL_APIS.weather.cacheDuration,
      timeout: EXTERNAL_APIS.weather.timeout,
      fallbackData: this.getWeatherMockData(city).data
    });
  }

  getWeatherMockData(city) {
    return {
      success: true,
      data: {
        name: city,
        main: {
          temp: 25,
          feels_like: 26,
          humidity: 60
        },
        weather: [
          {
            main: 'Clear',
            description: 'Céu limpo',
            icon: '01d'
          }
        ],
        wind: {
          speed: 3.5
        }
      },
      source: 'mock'
    };
  }

  // Receita WS (CNPJ) com fallback
  async fetchCNPJ(cnpj) {
    const cleanCNPJ = cnpj.replace(/\D/g, '');

    if (cleanCNPJ.length !== 14) {
      return { success: false, error: 'CNPJ inválido' };
    }

    const url = `${EXTERNAL_APIS.receitaWS.baseUrl}/${cleanCNPJ}`;

    return this.fetchWithFallback('receitaWS', url, {
      cacheDuration: EXTERNAL_APIS.receitaWS.cacheDuration,
      timeout: EXTERNAL_APIS.receitaWS.timeout,
      fallbackData: {
        cnpj: cleanCNPJ,
        nome: 'Empresa não encontrada',
        fantasia: '',
        situacao: 'ATIVA',
        erro: 'Serviço temporariamente indisponível'
      }
    });
  }

  // Stocks API com fallback
  async fetchStockQuote(symbol) {
    if (!EXTERNAL_APIS.stocks.apiKey || EXTERNAL_APIS.stocks.apiKey === 'demo') {
      console.warn('⚠️ Stocks API key não configurada, usando dados mockados');
      return this.getStockMockData(symbol);
    }

    const url = `${EXTERNAL_APIS.stocks.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${EXTERNAL_APIS.stocks.apiKey}`;

    return this.fetchWithFallback('stocks', url, {
      cacheDuration: EXTERNAL_APIS.stocks.cacheDuration,
      timeout: EXTERNAL_APIS.stocks.timeout,
      fallbackData: this.getStockMockData(symbol).data
    });
  }

  getStockMockData(symbol) {
    const prices = {
      SOJA: 125.5,
      MILHO: 78.3,
      CAFE: 245.8,
      ACUCAR: 89.4,
      BOI: 315.6
    };

    return {
      success: true,
      data: {
        'Global Quote': {
          '01. symbol': symbol,
          '05. price': prices[symbol] || 100.0,
          '09. change': '+2.50',
          '10. change percent': '+2.04%'
        }
      },
      source: 'mock'
    };
  }

  /**
   * Verificar status de todas as APIs
   */
  async checkAllAPIsStatus() {
    const apis = Object.keys(EXTERNAL_APIS);
    const status = {};

    for (const apiName of apis) {
      try {
        const api = EXTERNAL_APIS[apiName];

        // Teste básico de conectividade
        const response = await axios.get(api.baseUrl, {
          timeout: 3000,
          validateStatus: () => true
        });

        status[apiName] = {
          available: response.status < 500,
          status: response.status,
          configured: !!api.apiKey || apiName === 'viaCep' || apiName === 'ibge' || apiName === 'receitaWS'
        };
      } catch (error) {
        status[apiName] = {
          available: false,
          status: 0,
          error: error.message,
          configured: !!EXTERNAL_APIS[apiName].apiKey
        };
      }
    }

    return status;
  }
}

// Singleton
const externalApiWrapper = new ExternalApiWrapper();

export default externalApiWrapper;

// Exports individuais para facilitar uso
export const {
  fetchCEP,
  fetchIBGEStates,
  fetchIBGECities,
  fetchWeather,
  fetchCNPJ,
  fetchStockQuote,
  checkAllAPIsStatus,
  clearCache
} = externalApiWrapper;
