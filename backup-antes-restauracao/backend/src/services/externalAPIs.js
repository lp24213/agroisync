import axios from 'axios';
import { EXTERNAL_APIS, API_TIMEOUT_CONFIG } from '../config/constants.js';
import logger from '../utils/logger.js';

// ConfiguraÃ§Ãµes das APIs com fallbacks
const API_CONFIG = {
  viacep: {
    primary: {
      baseURL: EXTERNAL_APIS.viaCep.baseUrl,
      timeout: EXTERNAL_APIS.viaCep.timeout
    },
    fallbacks: [
      {
        name: 'API CEP',
        baseURL: 'https://cdn.apicep.com/file/apicep',
        timeout: 5000
      },
      {
        name: 'BrasilAPI',
        baseURL: 'https://brasilapi.com.br/api/cep/v1',
        timeout: 5000
      }
    ]
  },
  ibge: {
    primary: {
      baseURL: EXTERNAL_APIS.ibge.baseUrl,
      timeout: EXTERNAL_APIS.ibge.timeout
    },
    fallbacks: [] // IBGE Ã© API pÃºblica estÃ¡vel
  },
  openweather: {
    primary: {
      baseURL: EXTERNAL_APIS.weather.baseUrl,
      apiKey: EXTERNAL_APIS.weather.apiKey,
      timeout: EXTERNAL_APIS.weather.timeout
    },
    fallbacks: [
      {
        name: 'WeatherAPI',
        baseURL: 'https://api.weatherapi.com/v1',
        apiKey: process.env.WEATHERAPI_KEY,
        timeout: 10000
      }
    ]
  },
  receitaFederal: {
    primary: {
      baseURL: EXTERNAL_APIS.receitaFederal.baseUrl,
      apiKey: EXTERNAL_APIS.receitaFederal.apiKey,
      timeout: EXTERNAL_APIS.receitaFederal.timeout
    },
    fallbacks: [
      {
        name: 'ReceitaWS',
        baseURL: 'https://www.receitaws.com.br/v1',
        timeout: 15000
      }
    ]
  },
  baiduMaps: {
    primary: {
      baseURL: EXTERNAL_APIS.baiduMaps.baseUrl,
      apiKey: EXTERNAL_APIS.baiduMaps.apiKey,
      timeout: EXTERNAL_APIS.baiduMaps.timeout
    },
    fallbacks: [] // EspecÃ­fico para China
  }
};

// ConfiguraÃ§Ã£o de retry
const RETRY_CONFIG = {
  maxRetries: API_TIMEOUT_CONFIG.retryAttempts,
  retryDelay: 1000, // 1 segundo
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
};

// Cache simples em memÃ³ria (em produÃ§Ã£o, usar Redis)
const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Classe para serviÃ§os de API externa com fallback
class ExternalAPIService {
  constructor() {
    this.viacepClient = axios.create({
      baseURL: API_CONFIG.viacep.primary.baseURL,
      timeout: API_CONFIG.viacep.primary.timeout
    });

    this.ibgeClient = axios.create({
      baseURL: API_CONFIG.ibge.primary.baseURL,
      timeout: API_CONFIG.ibge.primary.timeout
    });

    this.weatherClient = axios.create({
      baseURL: API_CONFIG.openweather.primary.baseURL,
      timeout: API_CONFIG.openweather.primary.timeout
    });

    this.receitaClient = axios.create({
      baseURL: API_CONFIG.receitaFederal.primary.baseURL,
      timeout: API_CONFIG.receitaFederal.primary.timeout,
      headers: {
        Authorization: API_CONFIG.receitaFederal.primary.apiKey
          ? `Bearer ${API_CONFIG.receitaFederal.primary.apiKey}`
          : undefined,
        'Content-Type': 'application/json'
      }
    });

    this.baiduClient = axios.create({
      baseURL: API_CONFIG.baiduMaps.primary.baseURL,
      timeout: API_CONFIG.baiduMaps.primary.timeout
    });

    // Track de falhas para circuit breaker
    this.apiHealthStatus = new Map();
  }

  // ===== SISTEMA DE RETRY COM FALLBACK =====

  /**
   * Executa request com retry automÃ¡tico
   * @param {Function} requestFn - FunÃ§Ã£o que faz o request
   * @param {Object} options - OpÃ§Ãµes de retry
   */
  async executeWithRetry(requestFn, options = {}) {
    const maxRetries = options.maxRetries || RETRY_CONFIG.maxRetries;
    const retryDelay = options.retryDelay || RETRY_CONFIG.retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        return { success: true, data: result };
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const shouldRetry = this.shouldRetry(error, attempt, maxRetries);

        if (isLastAttempt || !shouldRetry) {
          if (process.env.NODE_ENV !== 'production') {
            logger.error(`Request failed after ${attempt + 1} attempts:`, error.message);
          }
          return {
            success: false,
            error: error.message,
            attempts: attempt + 1
          };
        }

        // Aguardar antes de retry com backoff exponencial
        const delay = retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
        if (process.env.NODE_ENV !== 'production') {
          logger.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        }
      }
    }
  }

  /**
   * Executa request com fallback para APIs alternativas
   * @param {Array} apiConfigs - Array de configuraÃ§Ãµes de API [primary, ...fallbacks]
   * @param {Function} requestBuilder - FunÃ§Ã£o que constrÃ³i o request
   */
  async executeWithFallback(apiConfigs, requestBuilder) {
    const errors = [];

    for (let i = 0; i < apiConfigs.length; i++) {
      const config = apiConfigs[i];
      const apiName = config.name || (i === 0 ? 'Primary' : `Fallback ${i}`);

      // Verificar circuit breaker
      if (this.isCircuitOpen(apiName)) {
        if (process.env.NODE_ENV !== 'production') {
          logger.log(`Circuit breaker open for ${apiName}, skipping...`);
        }
        continue;
      }

      try {
        if (process.env.NODE_ENV !== 'production') {
          logger.log(`Trying ${apiName}...`);
        }
        const result = await requestBuilder(config);

        // Marcar API como saudÃ¡vel
        this.recordSuccess(apiName);

        return {
          success: true,
          data: result,
          source: apiName
        };
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          logger.error(`${apiName} failed:`, error.message);
        }
        errors.push({ api: apiName, error: error.message });

        // Marcar falha para circuit breaker
        this.recordFailure(apiName);

        // Se nÃ£o for a Ãºltima opÃ§Ã£o, tentar prÃ³xima
        if (i < apiConfigs.length - 1) {
          if (process.env.NODE_ENV !== 'production') {
            logger.log('Falling back to next API...');
          }
          continue;
        }
      }
    }

    // Todas as APIs falharam
    return {
      success: false,
      error: 'All APIs failed',
      errors
    };
  }

  /**
   * Verifica se deve fazer retry
   */
  shouldRetry(error, attempt, maxRetries) {
    if (attempt >= maxRetries) {
      return false;
    }

    // Retry em erros de rede
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // Retry em status codes especÃ­ficos
    if (error.response) {
      const { status } = error.response;
      return RETRY_CONFIG.retryableStatusCodes.includes(status);
    }

    return false;
  }

  /**
   * Aguarda um tempo (para retry)
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Circuit Breaker: Registra sucesso de API
   */
  recordSuccess(apiName) {
    const health = this.apiHealthStatus.get(apiName) || { failures: 0, lastFailure: null };
    health.failures = 0;
    health.lastFailure = null;
    this.apiHealthStatus.set(apiName, health);
  }

  /**
   * Circuit Breaker: Registra falha de API
   */
  recordFailure(apiName) {
    const health = this.apiHealthStatus.get(apiName) || { failures: 0, lastFailure: null };
    health.failures += 1;
    health.lastFailure = Date.now();
    this.apiHealthStatus.set(apiName, health);
  }

  /**
   * Circuit Breaker: Verifica se API estÃ¡ indisponÃ­vel
   */
  isCircuitOpen(apiName) {
    const health = this.apiHealthStatus.get(apiName);
    if (!health) {
      return false;
    }

    // Se teve 3+ falhas nas Ãºltimas 5 minutos, considerar indisponÃ­vel
    const circuitOpenThreshold = 3;
    const circuitOpenDuration = 5 * 60 * 1000; // 5 minutos

    if (health.failures >= circuitOpenThreshold) {
      const timeSinceLastFailure = Date.now() - health.lastFailure;
      if (timeSinceLastFailure < circuitOpenDuration) {
        return true;
      }
      // Reset apÃ³s duraÃ§Ã£o
      health.failures = 0;
      health.lastFailure = null;
      this.apiHealthStatus.set(apiName, health);
    }

    return false;
  }

  // ===== SISTEMA DE CACHE =====

  /**
   * Obter item do cache
   * @param {string} key - Chave do cache
   * @returns {Object|null} Item do cache ou null se expirado
   */
  getFromCache(key) {
    const item = CACHE.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      CACHE.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Salvar item no cache
   * @param {string} key - Chave do cache
   * @param {Object} data - Dados para cache
   * @param {number} ttl - Tempo de vida em ms (opcional)
   */
  setCache(key, data, ttl = CACHE_TTL) {
    CACHE.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }

  /**
   * Limpar cache expirado
   */
  cleanupCache() {
    const now = Date.now();
    for (const [key, item] of CACHE.entries()) {
      if (now > item.expiresAt) {
        CACHE.delete(key);
      }
    }
  }

  // ===== SERVIÃ‡OS DE CEP E ENDEREÃ‡O =====

  /**
   * Consultar CEP com fallback automÃ¡tico
   * @param {string} cep - CEP a ser consultado
   * @returns {Object} Dados do endereÃ§o
   */
  async consultarCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      return {
        success: false,
        message: 'CEP deve ter 8 dÃ­gitos'
      };
    }

    // Verificar cache primeiro
    const cacheKey = `cep_${cleanCEP}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return { success: true, data: cached, fromCache: true };
    }

    // Configurar APIs com fallback
    const apis = [
      {
        name: 'ViaCEP',
        ...API_CONFIG.viacep.primary,
        endpoint: `/${cleanCEP}/json/`
      },
      ...API_CONFIG.viacep.fallbacks.map(fb => ({
        ...fb,
        endpoint: `/${cleanCEP}.json`
      }))
    ];

    // Executar com fallback
    const result = await this.executeWithFallback(apis, async config => {
      const client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout
      });

      const response = await client.get(config.endpoint);

      // Validar resposta
      if (response.data.erro || response.data.error) {
        throw new Error('CEP nÃ£o encontrado');
      }

      // Normalizar formato de resposta
      const normalized = {
        cep: response.data.cep || response.data.code,
        logradouro: response.data.logradouro || response.data.address || response.data.street,
        complemento: response.data.complemento || '',
        bairro: response.data.bairro || response.data.district || response.data.neighborhood,
        localidade: response.data.localidade || response.data.city,
        uf: response.data.uf || response.data.state,
        ibge: response.data.ibge,
        ddd: response.data.ddd,
        siafi: response.data.siafi
      };

      return normalized;
    });

    if (result.success) {
      // Salvar no cache
      this.setCache(cacheKey, result.data);
      return {
        success: true,
        data: result.data,
        source: result.source
      };
    }

    return {
      success: false,
      message: 'Erro ao consultar CEP',
      errors: result.errors
    };
  }

  /**
   * Buscar municÃ­pios por estado via IBGE
   * @param {string} uf - Sigla do estado
   * @returns {Array} Lista de municÃ­pios
   */
  async buscarMunicipiosPorEstado(uf) {
    try {
      const response = await this.ibgeClient.get(`/localidades/estados/${uf}/municipios`);

      return {
        success: true,
        data: response.data.map(municipio => ({
          id: municipio.id,
          nome: municipio.nome,
          microrregiao: municipio.microrregiao?.nome,
          mesorregiao: municipio.mesorregiao?.nome
        }))
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar municÃ­pios:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar municÃ­pios',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Buscar estados via IBGE
   * @returns {Array} Lista de estados
   */
  async buscarEstados() {
    try {
      const response = await this.ibgeClient.get('/localidades/estados');

      return {
        success: true,
        data: response.data.map(estado => ({
          id: estado.id,
          sigla: estado.sigla,
          nome: estado.nome,
          regiao: estado.regiao?.nome
        }))
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar estados:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar estados',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Buscar regiÃµes via IBGE
   * @returns {Array} Lista de regiÃµes
   */
  async buscarRegioes() {
    try {
      const response = await this.ibgeClient.get('/localidades/regioes');

      return {
        success: true,
        data: response.data.map(regiao => ({
          id: regiao.id,
          nome: regiao.nome,
          sigla: regiao.sigla
        }))
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar regiÃµes:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar regiÃµes',
        error: error.response?.data || error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DE CLIMA =====

  /**
   * Obter clima por coordenadas
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Unidades (metric, imperial, kelvin)
   * @param {string} lang - Idioma (pt, en, es, zh)
   * @returns {Object} Dados do clima
   */
  async obterClimaPorCoordenadas(lat, lon, units = 'metric', lang = 'pt') {
    try {
      if (!API_CONFIG.openweather.apiKey) {
        throw new Error('API key do OpenWeather nÃ£o configurada');
      }

      const response = await this.weatherClient.get('/weather', {
        params: {
          lat,
          lon,
          appid: API_CONFIG.openweather.apiKey,
          units,
          lang
        }
      });

      return {
        success: true,
        data: {
          temperatura: response.data.main.temp,
          sensacaoTermica: response.data.main.feels_like,
          umidade: response.data.main.humidity,
          pressao: response.data.main.pressure,
          descricao: response.data.weather[0].description,
          icone: response.data.weather[0].icon,
          vento: {
            velocidade: response.data.wind.speed,
            direcao: response.data.wind.deg
          },
          nuvens: response.data.clouds.all,
          visibilidade: response.data.visibility,
          nascerSol: new Date(response.data.sys.sunrise * 1000),
          porSol: new Date(response.data.sys.sunset * 1000),
          localizacao: {
            nome: response.data.name,
            pais: response.data.sys.country,
            coordenadas: {
              lat: response.data.coord.lat,
              lon: response.data.coord.lon
            }
          }
        }
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter clima:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter dados do clima',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Obter clima por IP (usando serviÃ§o de geolocalizaÃ§Ã£o)
   * @param {string} ip - EndereÃ§o IP
   * @param {string} units - Unidades (metric, imperial, kelvin)
   * @param {string} lang - Idioma (pt, en, es, zh)
   * @returns {Object} Dados do clima
   */
  async obterClimaPorIP(ip, units = 'metric', lang = 'pt') {
    try {
      // Primeiro, obter coordenadas pelo IP
      const geoResponse = await this.obterCoordenadasPorIP(ip);

      if (!geoResponse.success) {
        throw new Error('NÃ£o foi possÃ­vel obter localizaÃ§Ã£o pelo IP');
      }

      const { lat, lon } = geoResponse.data;

      // Depois, obter clima pelas coordenadas
      return await this.obterClimaPorCoordenadas(lat, lon, units, lang);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter clima por IP:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter clima por IP',
        error: error.message
      };
    }
  }

  /**
   * Obter coordenadas por IP
   * @param {string} ip - EndereÃ§o IP
   * @returns {Object} Coordenadas (lat, lon)
   */
  async obterCoordenadasPorIP(ip) {
    try {
      // Usar serviÃ§o gratuito de geolocalizaÃ§Ã£o por IP
      const response = await axios.get(`https://ip-api.com/json/${ip}`, {
        timeout: 10000
      });

      if (response.data.status === 'fail') {
        throw new Error('NÃ£o foi possÃ­vel obter localizaÃ§Ã£o pelo IP');
      }

      return {
        success: true,
        data: {
          lat: response.data.lat,
          lon: response.data.lon,
          cidade: response.data.city,
          estado: response.data.regionName,
          pais: response.data.country,
          timezone: response.data.timezone
        }
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter coordenadas por IP:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter coordenadas por IP',
        error: error.response?.data || error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DA RECEITA FEDERAL =====

  // ===== SERVIÃ‡OS DO BAIDU MAPS =====

  /**
   * Geocoding: converter endereÃ§o em coordenadas
   * @param {string} address - EndereÃ§o para geocodificar
   * @param {string} city - Cidade (opcional)
   * @param {string} region - RegiÃ£o/Estado (opcional)
   * @returns {Object} Coordenadas e informaÃ§Ãµes do endereÃ§o
   */
  async geocodeAddress(address, city = '', region = '') {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      const cacheKey = `geocode:${address}:${city}:${region}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const fullAddress = [address, city, region].filter(Boolean).join(', ');

      const response = await this.baiduClient.get('/geocoding/v3/', {
        params: {
          address: fullAddress,
          output: 'json',
          ak: API_CONFIG.baiduMaps.apiKey,
          city: city || undefined,
          region: region || undefined
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const { result } = response.data;
      const { location } = result;

      const geocodeResult = {
        success: true,
        data: {
          address: fullAddress,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          },
          formattedAddress: result.formatted_address,
          confidence: result.confidence,
          level: result.level,
          precise: result.precise
        }
      };

      this.setCache(cacheKey, geocodeResult, 10 * 60 * 1000); // 10 minutos para geocoding
      return geocodeResult;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro no geocoding:', error);
      }
      return {
        success: false,
        message: 'Erro ao geocodificar endereÃ§o',
        error: error.message
      };
    }
  }

  /**
   * Reverse geocoding: converter coordenadas em endereÃ§o
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Object} EndereÃ§o e informaÃ§Ãµes da localizaÃ§Ã£o
   */
  async reverseGeocode(lat, lng) {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      const cacheKey = `reverse_geocode:${lat}:${lng}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.baiduClient.get('/reverse_geocoding/v3/', {
        params: {
          location: `${lat},${lng}`,
          output: 'json',
          ak: API_CONFIG.baiduMaps.apiKey,
          coordtype: 'wgs84ll'
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const { result } = response.data;
      const { addressComponent } = result;

      const reverseGeocodeResult = {
        success: true,
        data: {
          coordinates: { lat, lng },
          formattedAddress: result.formatted_address,
          addressComponent: {
            country: addressComponent.country,
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district,
            street: addressComponent.street,
            streetNumber: addressComponent.street_number
          },
          confidence: result.confidence,
          level: result.level
        }
      };

      this.setCache(cacheKey, reverseGeocodeResult, 10 * 60 * 1000); // 10 minutos
      return reverseGeocodeResult;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro no reverse geocoding:', error);
      }
      return {
        success: false,
        message: 'Erro ao fazer reverse geocoding',
        error: error.message
      };
    }
  }

  /**
   * Calcular rota entre dois pontos
   * @param {Object} origin - Coordenadas de origem {lat, lng}
   * @param {Object} destination - Coordenadas de destino {lat, lng}
   * @param {string} mode - Modo de transporte (driving, walking, bicycling, transit)
   * @returns {Object} InformaÃ§Ãµes da rota
   */
  async calculateRoute(origin, destination, mode = 'driving') {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      const cacheKey = `route:${origin.lat}:${origin.lng}:${destination.lat}:${destination.lng}:${mode}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.baiduClient.get('/routematrix/v2/', {
        params: {
          origins: `${origin.lat},${origin.lng}`,
          destinations: `${destination.lat},${destination.lng}`,
          ak: API_CONFIG.baiduMaps.apiKey,
          output: 'json'
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const { result } = response.data;
      const routeInfo = result.distance[0][0];
      const durationInfo = result.duration[0][0];

      const routeResult = {
        success: true,
        data: {
          origin,
          destination,
          mode,
          distance: {
            meters: routeInfo,
            kilometers: (routeInfo / 1000).toFixed(2)
          },
          duration: {
            seconds: durationInfo,
            minutes: Math.round(durationInfo / 60),
            hours: (durationInfo / 3600).toFixed(2)
          }
        }
      };

      this.setCache(cacheKey, routeResult, 5 * 60 * 1000); // 5 minutos para rotas
      return routeResult;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao calcular rota:', error);
      }
      return {
        success: false,
        message: 'Erro ao calcular rota',
        error: error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DA RECEITA FEDERAL =====

  /**
   * Consultar CNPJ na Receita Federal
   * @param {string} cnpj - CNPJ a ser consultado
   * @returns {Object} Dados do CNPJ
   */
  async consultarCNPJ(cnpj) {
    try {
      await Promise.resolve(); // Placeholder para implementaÃ§Ã£o futura
      if (!API_CONFIG.receitaFederal.primary.apiKey) {
        throw new Error('API key da Receita Federal nÃ£o configurada');
      }

      const cleanCNPJ = cnpj.replace(/\D/g, '');

      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ deve ter 14 dÃ­gitos');
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      return {
        success: true,
        data: {
          cnpj: cleanCNPJ,
          razaoSocial: 'EMPRESA EXEMPLO LTDA',
          nomeFantasia: 'EMPRESA EXEMPLO',
          dataAbertura: '2020-01-01',
          situacao: 'ATIVA',
          tipo: 'MATRIZ',
          porte: 'MEDIO PORTE',
          naturezaJuridica: '206-2 - LTDA',
          capitalSocial: 100000.0,
          endereco: {
            logradouro: 'Rua Exemplo',
            numero: '123',
            complemento: 'Sala 1',
            bairro: 'Centro',
            municipio: 'SÃ£o Paulo',
            uf: 'SP',
            cep: '01234-567'
          },
          atividadePrincipal: '4751-2/01 - ComÃ©rcio varejista de informÃ¡tica',
          atividadesSecundarias: ['6201-5/01 - Desenvolvimento de sistemas']
        }
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao consultar CNPJ:', error);
      }
      return {
        success: false,
        message: 'Erro ao consultar CNPJ',
        error: error.message
      };
    }
  }

  /**
   * Consultar CPF na Receita Federal
   * @param {string} cpf - CPF a ser consultado
   * @returns {Object} Dados do CPF
   */
  async consultarCPF(cpf) {
    try {
      await Promise.resolve(); // Placeholder para implementaÃ§Ã£o futura
      if (!API_CONFIG.receitaFederal.primary.apiKey) {
        throw new Error('API key da Receita Federal nÃ£o configurada');
      }

      const cleanCPF = cpf.replace(/\D/g, '');

      if (cleanCPF.length !== 11) {
        throw new Error('CPF deve ter 11 dÃ­gitos');
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      return {
        success: true,
        data: {
          cpf: cleanCPF,
          nome: 'PESSOA EXEMPLO',
          dataNascimento: '1990-01-01',
          situacao: 'REGULAR',
          dataInscricao: '2020-01-01',
          digitoVerificador: '00'
        }
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao consultar CPF:', error);
      }
      return {
        success: false,
        message: 'Erro ao consultar CPF',
        error: error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DE VALIDAÃ‡ÃƒO =====

  /**
   * Validar endereÃ§o completo
   * @param {Object} endereco - Dados do endereÃ§o
   * @returns {Object} EndereÃ§o validado e complementado
   */
  async validarEndereco(endereco) {
    try {
      let enderecoValidado = { ...endereco };

      // Se tem CEP, consultar para complementar dados
      if (endereco.cep) {
        const cepResponse = await this.consultarCEP(endereco.cep);

        if (cepResponse.success) {
          enderecoValidado = {
            ...enderecoValidado,
            logradouro: cepResponse.data.logradouro || endereco.logradouro,
            bairro: cepResponse.data.bairro || endereco.bairro,
            cidade: cepResponse.data.localidade || endereco.cidade,
            estado: cepResponse.data.uf || endereco.estado,
            cep: cepResponse.data.cep
          };
        }
      }

      // Validar se todos os campos obrigatÃ³rios estÃ£o preenchidos
      const camposObrigatorios = ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
      const camposFaltando = camposObrigatorios.filter(campo => !enderecoValidado[campo]);

      if (camposFaltando.length > 0) {
        return {
          success: false,
          message: `Campos obrigatÃ³rios faltando: ${camposFaltando.join(', ')}`,
          camposFaltando
        };
      }

      return {
        success: true,
        data: enderecoValidado
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao validar endereÃ§o:', error);
      }
      return {
        success: false,
        message: 'Erro ao validar endereÃ§o',
        error: error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DO BAIDU MAPS =====

  /**
   * Buscar coordenadas por endereÃ§o (geocoding)
   * @param {string} address - EndereÃ§o para buscar
   * @returns {Object} Coordenadas e dados do endereÃ§o
   */
  async buscarCoordenadasBaidu(address) {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      // Verificar cache primeiro
      const cacheKey = `baidu_geocoding_${address}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      const response = await this.baiduClient.get('/geocoding/v3/', {
        params: {
          address,
          output: 'json',
          ak: API_CONFIG.baiduMaps.apiKey
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const { result } = response.data;
      const data = {
        address: result.formatted_address,
        coordinates: {
          lat: result.location.lat,
          lng: result.location.lng
        },
        components: result.address_components,
        confidence: result.confidence,
        level: result.level
      };

      // Salvar no cache por 10 minutos
      this.setCache(cacheKey, data, 10 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar coordenadas Baidu:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar coordenadas',
        error: error.message
      };
    }
  }

  /**
   * Buscar endereÃ§o por coordenadas (reverse geocoding)
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Object} EndereÃ§o e dados da localizaÃ§Ã£o
   */
  async buscarEnderecoBaidu(lat, lng) {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      // Verificar cache primeiro
      const cacheKey = `baidu_reverse_${lat}_${lng}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      const response = await this.baiduClient.get('/reverse_geocoding/v3/', {
        params: {
          location: `${lat},${lng}`,
          output: 'json',
          ak: API_CONFIG.baiduMaps.apiKey
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const { result } = response.data;
      const data = {
        address: result.formatted_address,
        coordinates: {
          lat,
          lng
        },
        components: result.address_components,
        confidence: result.confidence
      };

      // Salvar no cache por 10 minutos
      this.setCache(cacheKey, data, 10 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar endereÃ§o Baidu:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar endereÃ§o',
        error: error.message
      };
    }
  }

  /**
   * Buscar lugares por query (search)
   * @param {string} query - Query de busca
   * @returns {Object} Lista de lugares encontrados
   */
  async buscarLugaresBaidu(query) {
    try {
      if (!API_CONFIG.baiduMaps.apiKey) {
        throw new Error('API key do Baidu Maps nÃ£o configurada');
      }

      // Verificar cache primeiro
      const cacheKey = `baidu_search_${query}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      const response = await this.baiduClient.get('/place/v2/search', {
        params: {
          query,
          output: 'json',
          ak: API_CONFIG.baiduMaps.apiKey,
          scope: 2,
          page_size: 20
        }
      });

      if (response.data.status !== 0) {
        throw new Error(`Erro do Baidu Maps: ${response.data.message}`);
      }

      const result = response.data.results;
      const data = result.map(place => ({
        name: place.name,
        address: place.address,
        coordinates: {
          lat: place.location.lat,
          lng: place.location.lng
        },
        type: place.type,
        uid: place.uid
      }));

      // Salvar no cache por 10 minutos
      this.setCache(cacheKey, data, 10 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao buscar lugares Baidu:', error);
      }
      return {
        success: false,
        message: 'Erro ao buscar lugares',
        error: error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DA RECEITA FEDERAL =====

  /**
   * Validar CNPJ
   * @param {string} cnpj - CNPJ a ser validado
   * @returns {Object} Resultado da validaÃ§Ã£o
   */
  async validarCNPJ(cnpj) {
    try {
      await Promise.resolve(); // ValidaÃ§Ã£o sÃ­ncrona por enquanto
      const cleanCNPJ = cnpj.replace(/\D/g, '');

      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ deve ter 14 dÃ­gitos');
      }

      // Verificar cache primeiro (24 horas)
      const cacheKey = `receita_cnpj_${cleanCNPJ}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      const data = {
        cnpj: cleanCNPJ,
        razaoSocial: 'EMPRESA EXEMPLO LTDA',
        nomeFantasia: 'EMPRESA EXEMPLO',
        dataAbertura: '2020-01-01',
        situacao: 'ATIVA',
        tipo: 'MATRIZ',
        porte: 'MEDIO PORTE',
        naturezaJuridica: '206-2 - LTDA',
        capitalSocial: 100000.0,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '123',
          complemento: 'Sala 1',
          bairro: 'Centro',
          municipio: 'SÃ£o Paulo',
          uf: 'SP',
          cep: '01234-567'
        },
        atividadePrincipal: '4751-2/01 - ComÃ©rcio varejista de informÃ¡tica',
        atividadesSecundarias: ['6201-5/01 - Desenvolvimento de sistemas']
      };

      // Salvar no cache por 24 horas
      this.setCache(cacheKey, data, 24 * 60 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao validar CNPJ:', error);
      }
      return {
        success: false,
        message: 'Erro ao validar CNPJ',
        error: error.message
      };
    }
  }

  /**
   * Validar CPF
   * @param {string} cpf - CPF a ser validado
   * @returns {Object} Resultado da validaÃ§Ã£o
   */
  async validarCPF(cpf) {
    try {
      await Promise.resolve(); // ValidaÃ§Ã£o sÃ­ncrona por enquanto
      const cleanCPF = cpf.replace(/\D/g, '');

      if (cleanCPF.length !== 11) {
        throw new Error('CPF deve ter 11 dÃ­gitos');
      }

      // Verificar cache primeiro (24 horas)
      const cacheKey = `receita_cpf_${cleanCPF}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      const data = {
        cpf: cleanCPF,
        nome: 'PESSOA EXEMPLO',
        dataNascimento: '1990-01-01',
        situacao: 'REGULAR',
        dataInscricao: '2020-01-01',
        digitoVerificador: '00'
      };

      // Salvar no cache por 24 horas
      this.setCache(cacheKey, data, 24 * 60 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao validar CPF:', error);
      }
      return {
        success: false,
        message: 'Erro ao validar CPF',
        error: error.message
      };
    }
  }

  /**
   * Validar IE (InscriÃ§Ã£o Estadual)
   * @param {string} ie - IE a ser validada
   * @returns {Object} Resultado da validaÃ§Ã£o
   */
  async validarIE(ie) {
    try {
      await Promise.resolve(); // ValidaÃ§Ã£o sÃ­ncrona por enquanto
      const cleanIE = ie.replace(/\D/g, '');

      if (cleanIE.length < 8 || cleanIE.length > 12) {
        throw new Error('IE deve ter entre 8 e 12 dÃ­gitos');
      }

      // Verificar cache primeiro (24 horas)
      const cacheKey = `receita_ie_${cleanIE}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      const data = {
        ie: cleanIE,
        uf: 'SP',
        situacao: 'ATIVA',
        dataInscricao: '2020-01-01',
        contribuinte: 'CONTRIBUINTE'
      };

      // Salvar no cache por 24 horas
      this.setCache(cacheKey, data, 24 * 60 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao validar IE:', error);
      }
      return {
        success: false,
        message: 'Erro ao validar IE',
        error: error.message
      };
    }
  }

  /**
   * Obter dados completos da empresa
   * @param {string} cnpj - CNPJ da empresa
   * @returns {Object} Dados completos da empresa
   */
  async obterDadosEmpresa(cnpj) {
    try {
      await Promise.resolve(); // Dados simulados por enquanto
      const cleanCNPJ = cnpj.replace(/\D/g, '');

      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ deve ter 14 dÃ­gitos');
      }

      // Verificar cache primeiro (24 horas)
      const cacheKey = `receita_empresa_${cleanCNPJ}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      // Aqui vocÃª implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      const data = {
        cnpj: cleanCNPJ,
        razaoSocial: 'EMPRESA EXEMPLO LTDA',
        nomeFantasia: 'EMPRESA EXEMPLO',
        dataAbertura: '2020-01-01',
        situacao: 'ATIVA',
        tipo: 'MATRIZ',
        porte: 'MEDIO PORTE',
        naturezaJuridica: '206-2 - LTDA',
        capitalSocial: 100000.0,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '123',
          complemento: 'Sala 1',
          bairro: 'Centro',
          municipio: 'SÃ£o Paulo',
          uf: 'SP',
          cep: '01234-567'
        },
        atividadePrincipal: '4751-2/01 - ComÃ©rcio varejista de informÃ¡tica',
        atividadesSecundarias: ['6201-5/01 - Desenvolvimento de sistemas'],
        quadroSocios: [
          {
            nome: 'SÃ“CIO EXEMPLO',
            qualificacao: 'SÃ³cio-Administrador',
            participacao: '100%'
          }
        ],
        telefone: '(11) 99999-9999',
        email: 'contato@empresaexemplo.com.br',
        site: 'www.empresaexemplo.com.br'
      };

      // Salvar no cache por 24 horas
      this.setCache(cacheKey, data, 24 * 60 * 60 * 1000);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter dados da empresa:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter dados da empresa',
        error: error.message
      };
    }
  }

  // ===== SERVIÇOS DE COTAÇÕES AGRÍCOLAS =====

  /**
   * Obter cotações agrícolas atuais
   * @param {Array} produtos - Lista de produtos agrícolas
   * @param {string} regiao - Região para filtrar cotações
   * @returns {Object} Cotações dos produtos
   */
  async obterCotacoes(produtos = ['soja', 'milho', 'cafe'], regiao = null) {
    try {
      const cacheKey = `cotacoes_${produtos.join('_')}_${regiao || 'br'}`;
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString()
        };
      }

      // Dados simulados baseados em CEPEA e outras fontes
      // Em produção, isso seria integrado com APIs reais
      const cotacoesBase = {
        soja: {
          produto: 'Soja',
          unidade: 'sc/60kg',
          preco: 145.50 + (Math.random() - 0.5) * 10, // Variação de ±5
          variacao: (Math.random() - 0.5) * 4, // Variação percentual
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        },
        milho: {
          produto: 'Milho',
          unidade: 'sc/60kg',
          preco: 85.30 + (Math.random() - 0.5) * 8,
          variacao: (Math.random() - 0.5) * 3,
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        },
        cafe: {
          produto: 'Café',
          unidade: 'sc/60kg',
          preco: 1120.00 + (Math.random() - 0.5) * 100,
          variacao: (Math.random() - 0.5) * 6,
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        },
        algodao: {
          produto: 'Algodão',
          unidade: 'lb',
          preco: 4.85 + (Math.random() - 0.5) * 0.5,
          variacao: (Math.random() - 0.5) * 5,
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        },
        arroz: {
          produto: 'Arroz',
          unidade: 'sc/50kg',
          preco: 78.90 + (Math.random() - 0.5) * 6,
          variacao: (Math.random() - 0.5) * 4,
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        },
        trigo: {
          produto: 'Trigo',
          unidade: 'sc/60kg',
          preco: 92.40 + (Math.random() - 0.5) * 7,
          variacao: (Math.random() - 0.5) * 3,
          data: new Date().toISOString(),
          fonte: 'CEPEA',
          regiao: regiao || 'Brasil'
        }
      };

      // Filtrar apenas os produtos solicitados
      const cotacoes = {};
      produtos.forEach(produto => {
        if (cotacoesBase[produto]) {
          cotacoes[produto] = cotacoesBase[produto];
        }
      });

      // Salvar no cache por 5 minutos (cotações atualizam frequentemente)
      this.setCache(cacheKey, cotacoes, 5 * 60 * 1000);

      return {
        success: true,
        data: cotacoes,
        cached: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter cotações:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter cotações agrícolas',
        error: error.message
      };
    }
  }

  /**
   * Obter cotação de um produto específico
   * @param {string} produto - Nome do produto
   * @param {string} regiao - Região específica
   * @returns {Object} Cotação do produto
   */
  async obterCotacao(produto, regiao = null) {
    try {
      const result = await this.obterCotacoes([produto], regiao);

      if (result.success && result.data[produto]) {
        return {
          success: true,
          data: result.data[produto],
          cached: result.cached,
          timestamp: result.timestamp
        };
      }

      return {
        success: false,
        message: `Produto ${produto} não encontrado`
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter cotação específica:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter cotação do produto',
        error: error.message
      };
    }
  }

  /**
   * Obter histórico de preços de um produto
   * @param {string} produto - Nome do produto
   * @param {number} dias - Número de dias de histórico
   * @returns {Object} Histórico de preços
   */
  async obterHistoricoCotacao(produto, dias = 30) {
    try {
      const cacheKey = `historico_${produto}_${dias}`;
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString()
        };
      }

      // Gerar dados históricos simulados
      const historico = [];
      const hoje = new Date();
      let precoBase;

      // Definir preço base por produto
      switch (produto.toLowerCase()) {
        case 'soja':
          precoBase = 145.50;
          break;
        case 'milho':
          precoBase = 85.30;
          break;
        case 'cafe':
          precoBase = 1120.00;
          break;
        case 'algodao':
          precoBase = 4.85;
          break;
        case 'arroz':
          precoBase = 78.90;
          break;
        case 'trigo':
          precoBase = 92.40;
          break;
        default:
          precoBase = 100.00;
      }

      for (let i = dias; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);

        // Simular variação natural do mercado
        const variacao = (Math.random() - 0.5) * 0.1; // ±5%
        const preco = precoBase * (1 + variacao);

        historico.push({
          data: data.toISOString().split('T')[0],
          preco: Math.round(preco * 100) / 100,
          volume: Math.floor(Math.random() * 10000) + 1000
        });
      }

      // Salvar no cache por 1 hora
      this.setCache(cacheKey, historico, 60 * 60 * 1000);

      return {
        success: true,
        data: historico,
        cached: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter histórico de cotação:', error);
      }
      return {
        success: false,
        message: 'Erro ao obter histórico de preços',
        error: error.message
      };
    }
  }

  // ===== SERVIÃ‡OS DE VALIDAÃ‡ÃƒO =====
}

// Exportar instÃ¢ncia Ãºnica do serviÃ§o
export const externalAPIService = new ExternalAPIService();

// Exportar funÃ§Ãµes individuais para uso direto
export const {
  consultarCEP,
  buscarMunicipiosPorEstado,
  buscarEstados,
  buscarRegioes,
  obterClimaPorCoordenadas,
  obterClimaPorIP,
  obterCoordenadasPorIP,
  consultarCNPJ,
  consultarCPF,
  validarEndereco,
  geocodeAddress,
  reverseGeocode,
  calculateRoute,
  buscarCoordenadasBaidu,
  buscarEnderecoBaidu,
  buscarLugaresBaidu,
  validarCNPJ,
  validarCPF,
  validarIE,
  obterDadosEmpresa,
  obterCotacoes,
  obterCotacao,
  obterHistoricoCotacao
} = externalAPIService;
