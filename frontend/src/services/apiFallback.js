// ===== API FALLBACK SERVICE =====
// Implementa fallback automático para APIs externas com múltiplas fontes

import { EXTERNAL_APIS } from '../config/constants';

// Cache simples em memória
const cache = new Map();

/**
 * Limpar cache expirado
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expires < now) {
      cache.delete(key);
    }
  }
};

/**
 * Obter do cache se disponível
 */
const getFromCache = (key) => {
  cleanExpiredCache();
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
};

/**
 * Salvar no cache
 */
const saveToCache = (key, data, duration) => {
  cache.set(key, {
    data,
    expires: Date.now() + duration
  });
};

/**
 * Buscar CEP com fallback
 */
export const fetchCEP = async (cep) => {
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    throw new Error('CEP inválido');
  }

  // Verificar cache
  const cacheKey = `cep_${cleanCEP}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const sources = [
    {
      name: 'ViaCEP',
      url: `${EXTERNAL_APIS.viaCep.baseUrl}/${cleanCEP}/json`,
      transform: (data) => ({
        cep: data.cep,
        address: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        ibge: data.ibge
      })
    },
    {
      name: 'BrasilAPI',
      url: `https://brasilapi.com.br/api/cep/v1/${cleanCEP}`,
      transform: (data) => ({
        cep: data.cep,
        address: data.street,
        complement: '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state
      })
    },
    {
      name: 'PostmonAPI',
      url: `https://api.postmon.com.br/v1/cep/${cleanCEP}`,
      transform: (data) => ({
        cep: data.cep,
        address: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.cidade,
        state: data.estado
      })
    }
  ];

  for (const source of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(source.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        
        // Verificar se retornou erro
        if (data.erro) continue;
        
        const transformed = source.transform(data);
        saveToCache(cacheKey, transformed, EXTERNAL_APIS.viaCep.cacheDuration);
        return transformed;
      }
    } catch (error) {
      console.warn(`${source.name} falhou:`, error.message);
      continue;
    }
  }

  throw new Error('CEP não encontrado em nenhuma fonte');
};

/**
 * Buscar CNPJ com fallback
 */
export const fetchCNPJ = async (cnpj) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    throw new Error('CNPJ inválido');
  }

  // Verificar cache
  const cacheKey = `cnpj_${cleanCNPJ}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const sources = [
    {
      name: 'ReceitaWS',
      url: `${EXTERNAL_APIS.receitaWS.baseUrl}/${cleanCNPJ}`,
      transform: (data) => ({
        cnpj: data.cnpj,
        name: data.nome,
        fantasyName: data.fantasia,
        situation: data.situacao,
        address: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.municipio,
        state: data.uf,
        cep: data.cep,
        phone: data.telefone,
        email: data.email
      })
    },
    {
      name: 'BrasilAPI',
      url: `https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`,
      transform: (data) => ({
        cnpj: data.cnpj,
        name: data.razao_social,
        fantasyName: data.nome_fantasia,
        situation: data.descricao_situacao_cadastral,
        address: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.municipio,
        state: data.uf,
        cep: data.cep,
        phone: data.ddd_telefone_1,
        email: ''
      })
    }
  ];

  for (const source of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(source.url, { signal: controller.abort });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        
        // Verificar se retornou erro
        if (data.status === 'ERROR') continue;
        
        const transformed = source.transform(data);
        saveToCache(cacheKey, transformed, EXTERNAL_APIS.receitaWS.cacheDuration);
        return transformed;
      }
    } catch (error) {
      console.warn(`${source.name} falhou:`, error.message);
      continue;
    }
  }

  throw new Error('CNPJ não encontrado em nenhuma fonte');
};

/**
 * Buscar clima com fallback
 */
export const fetchWeather = async (city, country = 'BR') => {
  const cacheKey = `weather_${city}_${country}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const apiKey = EXTERNAL_APIS.weather.apiKey;

  // Se não tem API key, retornar dados mock
  if (!apiKey) {
    const mockData = {
      city,
      temp: 25,
      description: 'Ensolarado',
      humidity: 60,
      wind: 10,
      mock: true
    };
    return mockData;
  }

  try {
    const url = `${EXTERNAL_APIS.weather.baseUrl}/weather?q=${city},${country}&appid=${apiKey}&units=metric&lang=pt_br`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), EXTERNAL_APIS.weather.timeout);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const weatherData = {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon
      };
      
      saveToCache(cacheKey, weatherData, EXTERNAL_APIS.weather.cacheDuration);
      return weatherData;
    }
  } catch (error) {
    console.warn('OpenWeather API falhou:', error.message);
  }

  // Fallback para dados mock
  return {
    city,
    temp: 25,
    description: 'Clima não disponível',
    humidity: 60,
    wind: 10,
    mock: true
  };
};

/**
 * Buscar estados do Brasil
 */
export const fetchEstados = async () => {
  const cacheKey = 'estados_brasil';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const sources = [
    {
      name: 'IBGE',
      url: `${EXTERNAL_APIS.ibge.baseUrl}/localidades/estados?orderBy=nome`
    },
    {
      name: 'BrasilAPI',
      url: 'https://brasilapi.com.br/api/ibge/uf/v1'
    }
  ];

  for (const source of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(source.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const estados = data.map(estado => ({
          id: estado.id || estado.sigla,
          sigla: estado.sigla,
          nome: estado.nome
        }));
        
        saveToCache(cacheKey, estados, EXTERNAL_APIS.ibge.cacheDuration);
        return estados;
      }
    } catch (error) {
      console.warn(`${source.name} falhou:`, error.message);
      continue;
    }
  }

  // Fallback com lista estática
  const estadosStaticos = [
    { id: 'AC', sigla: 'AC', nome: 'Acre' },
    { id: 'AL', sigla: 'AL', nome: 'Alagoas' },
    { id: 'AP', sigla: 'AP', nome: 'Amapá' },
    { id: 'AM', sigla: 'AM', nome: 'Amazonas' },
    { id: 'BA', sigla: 'BA', nome: 'Bahia' },
    { id: 'CE', sigla: 'CE', nome: 'Ceará' },
    { id: 'DF', sigla: 'DF', nome: 'Distrito Federal' },
    { id: 'ES', sigla: 'ES', nome: 'Espírito Santo' },
    { id: 'GO', sigla: 'GO', nome: 'Goiás' },
    { id: 'MA', sigla: 'MA', nome: 'Maranhão' },
    { id: 'MT', sigla: 'MT', nome: 'Mato Grosso' },
    { id: 'MS', sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { id: 'MG', sigla: 'MG', nome: 'Minas Gerais' },
    { id: 'PA', sigla: 'PA', nome: 'Pará' },
    { id: 'PB', sigla: 'PB', nome: 'Paraíba' },
    { id: 'PR', sigla: 'PR', nome: 'Paraná' },
    { id: 'PE', sigla: 'PE', nome: 'Pernambuco' },
    { id: 'PI', sigla: 'PI', nome: 'Piauí' },
    { id: 'RJ', sigla: 'RJ', nome: 'Rio de Janeiro' },
    { id: 'RN', sigla: 'RN', nome: 'Rio Grande do Norte' },
    { id: 'RS', sigla: 'RS', nome: 'Rio Grande do Sul' },
    { id: 'RO', sigla: 'RO', nome: 'Rondônia' },
    { id: 'RR', sigla: 'RR', nome: 'Roraima' },
    { id: 'SC', sigla: 'SC', nome: 'Santa Catarina' },
    { id: 'SP', sigla: 'SP', nome: 'São Paulo' },
    { id: 'SE', sigla: 'SE', nome: 'Sergipe' },
    { id: 'TO', sigla: 'TO', nome: 'Tocantins' }
  ];

  saveToCache(cacheKey, estadosStaticos, EXTERNAL_APIS.ibge.cacheDuration);
  return estadosStaticos;
};

/**
 * Limpar todo o cache
 */
export const clearCache = () => {
  cache.clear();
};

export default {
  fetchCEP,
  fetchCNPJ,
  fetchWeather,
  fetchEstados,
  clearCache
};
