/**
 * Oracles - Weather Module
 * 
 * Este módulo fornece integração com oráculos e APIs externas para obtenção de dados
 * meteorológicos relevantes para o ecossistema agrícola.
 * 
 * Inclui:
 * - Integração com Chainlink para dados meteorológicos on-chain
 * - APIs externas para previsão do tempo e dados históricos
 * - Cache Redis para otimização de desempenho
 * - Análise de impacto climático em culturas específicas
 * - Alertas de condições climáticas extremas
 */

import axios from 'axios';
import { Redis } from '@upstash/redis';
import { ethers } from 'ethers';

// Configuração do Redis para cache
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Prefixo para chaves Redis
const REDIS_PREFIX = 'agrotm:oracles:weather:';

// Tempo de expiração do cache (em segundos)
const CACHE_EXPIRATION = {
  CURRENT: 30 * 60,      // 30 minutos para dados atuais
  FORECAST: 2 * 60 * 60, // 2 horas para previsões
  HISTORICAL: 24 * 60 * 60, // 24 horas para dados históricos
};

// Interfaces
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  location: {
    name: string;
    region?: string;
    country: string;
    coordinates: Coordinates;
  };
  current: {
    temperature: number;       // Temperatura em Celsius
    feelsLike: number;         // Sensação térmica em Celsius
    humidity: number;          // Umidade relativa em %
    pressure: number;          // Pressão atmosférica em hPa
    windSpeed: number;         // Velocidade do vento em km/h
    windDirection: number;     // Direção do vento em graus
    precipitation: number;     // Precipitação em mm
    uvIndex: number;           // Índice UV
    cloudCover: number;        // Cobertura de nuvens em %
    visibility: number;        // Visibilidade em km
    condition: {
      code: number;            // Código da condição
      text: string;            // Descrição da condição
      icon: string;            // URL do ícone
    };
  };
  updatedAt: number;           // Timestamp da última atualização
  source: string;              // Fonte dos dados
}

interface ForecastDay {
  date: string;                // Data no formato YYYY-MM-DD
  maxTemp: number;             // Temperatura máxima em Celsius
  minTemp: number;             // Temperatura mínima em Celsius
  avgTemp: number;             // Temperatura média em Celsius
  maxWindSpeed: number;        // Velocidade máxima do vento em km/h
  totalPrecipitation: number;  // Precipitação total em mm
  avgHumidity: number;         // Umidade média em %
  chanceOfRain: number;        // Chance de chuva em %
  uvIndex: number;             // Índice UV
  condition: {
    code: number;              // Código da condição
    text: string;              // Descrição da condição
    icon: string;              // URL do ícone
  };
}

interface WeatherForecast {
  location: {
    name: string;
    region?: string;
    country: string;
    coordinates: Coordinates;
  };
  forecast: ForecastDay[];
  updatedAt: number;           // Timestamp da última atualização
  source: string;              // Fonte dos dados
}

interface HistoricalWeatherData {
  location: {
    name: string;
    region?: string;
    country: string;
    coordinates: Coordinates;
  };
  date: string;                // Data no formato YYYY-MM-DD
  maxTemp: number;             // Temperatura máxima em Celsius
  minTemp: number;             // Temperatura mínima em Celsius
  avgTemp: number;             // Temperatura média em Celsius
  maxWindSpeed: number;        // Velocidade máxima do vento em km/h
  totalPrecipitation: number;  // Precipitação total em mm
  avgHumidity: number;         // Umidade média em %
  uvIndex: number;             // Índice UV
  updatedAt: number;           // Timestamp da última atualização
  source: string;              // Fonte dos dados
}

interface WeatherAlert {
  location: {
    name: string;
    region?: string;
    country: string;
    coordinates: Coordinates;
  };
  alerts: Array<{
    event: string;             // Tipo de alerta (e.g., "Heavy Rain", "Frost")
    severity: 'low' | 'medium' | 'high' | 'extreme'; // Severidade do alerta
    headline: string;          // Título do alerta
    description: string;       // Descrição detalhada
    effective: string;         // Data/hora de início
    expires: string;           // Data/hora de término
    areas: string[];           // Áreas afetadas
  }>;
  updatedAt: number;           // Timestamp da última atualização
  source: string;              // Fonte dos dados
}

interface CropImpact {
  cropType: string;            // Tipo de cultura
  impact: 'positive' | 'neutral' | 'negative'; // Impacto geral
  score: number;               // Pontuação de -10 a 10, onde -10 é extremamente negativo e 10 é extremamente positivo
  factors: Array<{
    factor: string;            // Fator climático
    impact: number;            // Impacto de -10 a 10
    description: string;       // Descrição do impacto
  }>;
  recommendations: string[];   // Recomendações para mitigar impactos negativos ou maximizar positivos
}

// Endereços dos contratos Chainlink para feeds de dados meteorológicos (Ethereum Mainnet)
// Nota: Estes são exemplos e podem não existir na mainnet. Em um ambiente real, seria necessário
// verificar os endereços corretos ou usar adaptadores Chainlink personalizados.
const CHAINLINK_WEATHER_FEEDS = {
  'PRECIPITATION': '0x1234567890abcdef1234567890abcdef12345678', // Exemplo
  'TEMPERATURE': '0xabcdef1234567890abcdef1234567890abcdef12', // Exemplo
};

// ABI simplificado para contratos Chainlink Weather Feed
const CHAINLINK_WEATHER_FEED_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
  'function description() external view returns (string)',
];

// Provedor Ethereum
let provider: ethers.providers.JsonRpcProvider | null = null;

/**
 * Inicializa o provedor Ethereum
 */
function initProvider() {
  if (provider) return provider;
  
  const rpcUrl = process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-infura-key';
  provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
}

/**
 * Obtém dados meteorológicos do Chainlink
 */
async function getChainlinkWeatherData(feedType: string, coordinates: Coordinates): Promise<any | null> {
  try {
    const feedAddress = CHAINLINK_WEATHER_FEEDS[feedType];
    if (!feedAddress) {
      console.warn(`Feed Chainlink não encontrado para o tipo ${feedType}`);
      return null;
    }
    
    const provider = initProvider();
    const weatherFeed = new ethers.Contract(feedAddress, CHAINLINK_WEATHER_FEED_ABI, provider);
    
    // Obter dados mais recentes
    const [roundId, answer, startedAt, updatedAt, answeredInRound] = await weatherFeed.latestRoundData();
    const decimals = await weatherFeed.decimals();
    const description = await weatherFeed.description();
    
    // Calcular valor real
    const value = parseFloat(ethers.utils.formatUnits(answer, decimals));
    
    return {
      type: feedType,
      value,
      description,
      updatedAt: updatedAt.toNumber() * 1000, // Converter para milissegundos
      source: 'chainlink',
    };
  } catch (error) {
    console.error(`Erro ao obter dados meteorológicos do Chainlink para ${feedType}:`, error);
    return null;
  }
}

/**
 * Obtém dados meteorológicos atuais da API WeatherAPI
 */
async function getWeatherAPICurrentData(location: string | Coordinates): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      console.warn('Chave da API WeatherAPI não configurada');
      return null;
    }
    
    // Formatar parâmetro de localização
    let locationParam: string;
    if (typeof location === 'string') {
      locationParam = location;
    } else {
      locationParam = `${location.latitude},${location.longitude}`;
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationParam}&aqi=no`
    );
    
    const data = response.data;
    
    // Mapear resposta da API para nosso formato
    const weatherData: WeatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        coordinates: {
          latitude: data.location.lat,
          longitude: data.location.lon,
        },
      },
      current: {
        temperature: data.current.temp_c,
        feelsLike: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        windSpeed: data.current.wind_kph,
        windDirection: data.current.wind_degree,
        precipitation: data.current.precip_mm,
        uvIndex: data.current.uv,
        cloudCover: data.current.cloud,
        visibility: data.current.vis_km,
        condition: {
          code: data.current.condition.code,
          text: data.current.condition.text,
          icon: data.current.condition.icon,
        },
      },
      updatedAt: Date.now(),
      source: 'weatherapi',
    };
    
    return weatherData;
  } catch (error) {
    console.error(`Erro ao obter dados meteorológicos atuais da WeatherAPI para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém previsão do tempo da API WeatherAPI
 */
async function getWeatherAPIForecast(location: string | Coordinates, days: number = 7): Promise<WeatherForecast | null> {
  try {
    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      console.warn('Chave da API WeatherAPI não configurada');
      return null;
    }
    
    // Formatar parâmetro de localização
    let locationParam: string;
    if (typeof location === 'string') {
      locationParam = location;
    } else {
      locationParam = `${location.latitude},${location.longitude}`;
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationParam}&days=${days}&aqi=no&alerts=yes`
    );
    
    const data = response.data;
    
    // Mapear resposta da API para nosso formato
    const forecastData: WeatherForecast = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        coordinates: {
          latitude: data.location.lat,
          longitude: data.location.lon,
        },
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        avgTemp: day.day.avgtemp_c,
        maxWindSpeed: day.day.maxwind_kph,
        totalPrecipitation: day.day.totalprecip_mm,
        avgHumidity: day.day.avghumidity,
        chanceOfRain: day.day.daily_chance_of_rain,
        uvIndex: day.day.uv,
        condition: {
          code: day.day.condition.code,
          text: day.day.condition.text,
          icon: day.day.condition.icon,
        },
      })),
      updatedAt: Date.now(),
      source: 'weatherapi',
    };
    
    return forecastData;
  } catch (error) {
    console.error(`Erro ao obter previsão do tempo da WeatherAPI para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém dados meteorológicos históricos da API WeatherAPI
 */
async function getWeatherAPIHistorical(location: string | Coordinates, date: string): Promise<HistoricalWeatherData | null> {
  try {
    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      console.warn('Chave da API WeatherAPI não configurada');
      return null;
    }
    
    // Formatar parâmetro de localização
    let locationParam: string;
    if (typeof location === 'string') {
      locationParam = location;
    } else {
      locationParam = `${location.latitude},${location.longitude}`;
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${locationParam}&dt=${date}`
    );
    
    const data = response.data;
    
    // Mapear resposta da API para nosso formato
    const historicalData: HistoricalWeatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        coordinates: {
          latitude: data.location.lat,
          longitude: data.location.lon,
        },
      },
      date: date,
      maxTemp: data.forecast.forecastday[0].day.maxtemp_c,
      minTemp: data.forecast.forecastday[0].day.mintemp_c,
      avgTemp: data.forecast.forecastday[0].day.avgtemp_c,
      maxWindSpeed: data.forecast.forecastday[0].day.maxwind_kph,
      totalPrecipitation: data.forecast.forecastday[0].day.totalprecip_mm,
      avgHumidity: data.forecast.forecastday[0].day.avghumidity,
      uvIndex: data.forecast.forecastday[0].day.uv,
      updatedAt: Date.now(),
      source: 'weatherapi',
    };
    
    return historicalData;
  } catch (error) {
    console.error(`Erro ao obter dados históricos da WeatherAPI para ${location} na data ${date}:`, error);
    return null;
  }
}

/**
 * Obtém alertas meteorológicos da API WeatherAPI
 */
async function getWeatherAPIAlerts(location: string | Coordinates): Promise<WeatherAlert | null> {
  try {
    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      console.warn('Chave da API WeatherAPI não configurada');
      return null;
    }
    
    // Formatar parâmetro de localização
    let locationParam: string;
    if (typeof location === 'string') {
      locationParam = location;
    } else {
      locationParam = `${location.latitude},${location.longitude}`;
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationParam}&days=1&aqi=no&alerts=yes`
    );
    
    const data = response.data;
    
    // Verificar se há alertas
    if (!data.alerts || !data.alerts.alert || data.alerts.alert.length === 0) {
      return {
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          coordinates: {
            latitude: data.location.lat,
            longitude: data.location.lon,
          },
        },
        alerts: [],
        updatedAt: Date.now(),
        source: 'weatherapi',
      };
    }
    
    // Mapear alertas
    const alerts = data.alerts.alert.map((alert: any) => {
      // Determinar severidade com base no tipo de alerta
      let severity: 'low' | 'medium' | 'high' | 'extreme' = 'medium';
      const eventLower = alert.event.toLowerCase();
      
      if (eventLower.includes('extreme') || eventLower.includes('severe') || eventLower.includes('emergency')) {
        severity = 'extreme';
      } else if (eventLower.includes('warning') || eventLower.includes('danger')) {
        severity = 'high';
      } else if (eventLower.includes('watch') || eventLower.includes('advisory')) {
        severity = 'medium';
      } else if (eventLower.includes('statement') || eventLower.includes('outlook')) {
        severity = 'low';
      }
      
      return {
        event: alert.event,
        severity,
        headline: alert.headline,
        description: alert.desc,
        effective: alert.effective,
        expires: alert.expires,
        areas: alert.areas.split(';').map((area: string) => area.trim()),
      };
    });
    
    return {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        coordinates: {
          latitude: data.location.lat,
          longitude: data.location.lon,
        },
      },
      alerts,
      updatedAt: Date.now(),
      source: 'weatherapi',
    };
  } catch (error) {
    console.error(`Erro ao obter alertas meteorológicos da WeatherAPI para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém dados meteorológicos atuais da API OpenWeatherMap (fallback)
 */
async function getOpenWeatherMapCurrentData(location: string | Coordinates): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.OPENWEATHERMAP_KEY;
    if (!apiKey) {
      console.warn('Chave da API OpenWeatherMap não configurada');
      return null;
    }
    
    // Formatar parâmetro de localização
    let locationParam: string;
    if (typeof location === 'string') {
      locationParam = `q=${location}`;
    } else {
      locationParam = `lat=${location.latitude}&lon=${location.longitude}`;
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${apiKey}&units=metric`
    );
    
    const data = response.data;
    
    // Mapear resposta da API para nosso formato
    const weatherData: WeatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          latitude: data.coord.lat,
          longitude: data.coord.lon,
        },
      },
      current: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed * 3.6, // Converter de m/s para km/h
        windDirection: data.wind.deg,
        precipitation: data.rain ? (data.rain['1h'] || 0) : 0,
        uvIndex: 0, // OpenWeatherMap não fornece índice UV na API básica
        cloudCover: data.clouds.all,
        visibility: data.visibility / 1000, // Converter de m para km
        condition: {
          code: data.weather[0].id,
          text: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        },
      },
      updatedAt: Date.now(),
      source: 'openweathermap',
    };
    
    return weatherData;
  } catch (error) {
    console.error(`Erro ao obter dados meteorológicos atuais da OpenWeatherMap para ${location}:`, error);
    return null;
  }
}

/**
 * Analisa o impacto das condições climáticas em uma cultura específica
 */
function analyzeCropImpact(cropType: string, weatherData: WeatherData, forecast: WeatherForecast): CropImpact {
  // Definir parâmetros ideais para cada tipo de cultura
  const cropParameters: Record<string, {
    idealTempMin: number;
    idealTempMax: number;
    idealHumidityMin: number;
    idealHumidityMax: number;
    idealPrecipitationMin: number;
    idealPrecipitationMax: number;
    toleratesHeat: boolean;
    toleratesFrost: boolean;
    toleratesDrought: boolean;
    toleratesExcessRain: boolean;
  }> = {
    'corn': {
      idealTempMin: 20,
      idealTempMax: 30,
      idealHumidityMin: 40,
      idealHumidityMax: 80,
      idealPrecipitationMin: 2,
      idealPrecipitationMax: 10,
      toleratesHeat: true,
      toleratesFrost: false,
      toleratesDrought: false,
      toleratesExcessRain: false,
    },
    'soybean': {
      idealTempMin: 20,
      idealTempMax: 30,
      idealHumidityMin: 50,
      idealHumidityMax: 70,
      idealPrecipitationMin: 3,
      idealPrecipitationMax: 8,
      toleratesHeat: true,
      toleratesFrost: false,
      toleratesDrought: true,
      toleratesExcessRain: false,
    },
    'wheat': {
      idealTempMin: 15,
      idealTempMax: 24,
      idealHumidityMin: 40,
      idealHumidityMax: 70,
      idealPrecipitationMin: 1,
      idealPrecipitationMax: 5,
      toleratesHeat: false,
      toleratesFrost: true,
      toleratesDrought: true,
      toleratesExcessRain: false,
    },
    'coffee': {
      idealTempMin: 18,
      idealTempMax: 26,
      idealHumidityMin: 60,
      idealHumidityMax: 85,
      idealPrecipitationMin: 3,
      idealPrecipitationMax: 7,
      toleratesHeat: false,
      toleratesFrost: false,
      toleratesDrought: false,
      toleratesExcessRain: false,
    },
    'cotton': {
      idealTempMin: 21,
      idealTempMax: 32,
      idealHumidityMin: 40,
      idealHumidityMax: 70,
      idealPrecipitationMin: 2,
      idealPrecipitationMax: 7,
      toleratesHeat: true,
      toleratesFrost: false,
      toleratesDrought: true,
      toleratesExcessRain: false,
    },
    'rice': {
      idealTempMin: 20,
      idealTempMax: 30,
      idealHumidityMin: 60,
      idealHumidityMax: 90,
      idealPrecipitationMin: 5,
      idealPrecipitationMax: 15,
      toleratesHeat: true,
      toleratesFrost: false,
      toleratesDrought: false,
      toleratesExcessRain: true,
    },
    'sugarcane': {
      idealTempMin: 22,
      idealTempMax: 32,
      idealHumidityMin: 50,
      idealHumidityMax: 85,
      idealPrecipitationMin: 4,
      idealPrecipitationMax: 12,
      toleratesHeat: true,
      toleratesFrost: false,
      toleratesDrought: false,
      toleratesExcessRain: false,
    },
  };
  
  // Usar parâmetros padrão se o tipo de cultura não estiver definido
  const params = cropParameters[cropType.toLowerCase()] || cropParameters['corn'];
  
  // Analisar condições atuais
  const currentTemp = weatherData.current.temperature;
  const currentHumidity = weatherData.current.humidity;
  const currentPrecipitation = weatherData.current.precipitation;
  
  // Calcular impacto da temperatura atual
  let tempImpact = 0;
  if (currentTemp < params.idealTempMin) {
    // Temperatura abaixo do ideal
    const deviation = params.idealTempMin - currentTemp;
    tempImpact = -Math.min(10, deviation * 2);
  } else if (currentTemp > params.idealTempMax) {
    // Temperatura acima do ideal
    const deviation = currentTemp - params.idealTempMax;
    tempImpact = params.toleratesHeat ? -Math.min(10, deviation) : -Math.min(10, deviation * 2);
  } else {
    // Temperatura ideal
    const range = params.idealTempMax - params.idealTempMin;
    const position = (currentTemp - params.idealTempMin) / range; // 0 a 1
    tempImpact = 10 - Math.abs(position - 0.5) * 4; // Máximo no meio do intervalo ideal
  }
  
  // Calcular impacto da umidade atual
  let humidityImpact = 0;
  if (currentHumidity < params.idealHumidityMin) {
    // Umidade abaixo do ideal
    const deviation = params.idealHumidityMin - currentHumidity;
    humidityImpact = -Math.min(10, deviation / 5);
  } else if (currentHumidity > params.idealHumidityMax) {
    // Umidade acima do ideal
    const deviation = currentHumidity - params.idealHumidityMax;
    humidityImpact = -Math.min(10, deviation / 5);
  } else {
    // Umidade ideal
    const range = params.idealHumidityMax - params.idealHumidityMin;
    const position = (currentHumidity - params.idealHumidityMin) / range; // 0 a 1
    humidityImpact = 10 - Math.abs(position - 0.5) * 4; // Máximo no meio do intervalo ideal
  }
  
  // Calcular impacto da precipitação atual e prevista
  let precipImpact = 0;
  const forecastPrecipitation = forecast.forecast.reduce((sum, day) => sum + day.totalPrecipitation, 0) / forecast.forecast.length;
  const effectivePrecipitation = (currentPrecipitation + forecastPrecipitation) / 2;
  
  if (effectivePrecipitation < params.idealPrecipitationMin) {
    // Precipitação abaixo do ideal
    const deviation = params.idealPrecipitationMin - effectivePrecipitation;
    precipImpact = params.toleratesDrought ? -Math.min(10, deviation * 2) : -Math.min(10, deviation * 3);
  } else if (effectivePrecipitation > params.idealPrecipitationMax) {
    // Precipitação acima do ideal
    const deviation = effectivePrecipitation - params.idealPrecipitationMax;
    precipImpact = params.toleratesExcessRain ? -Math.min(10, deviation) : -Math.min(10, deviation * 2);
  } else {
    // Precipitação ideal
    const range = params.idealPrecipitationMax - params.idealPrecipitationMin;
    const position = (effectivePrecipitation - params.idealPrecipitationMin) / range; // 0 a 1
    precipImpact = 10 - Math.abs(position - 0.5) * 4; // Máximo no meio do intervalo ideal
  }
  
  // Verificar condições extremas na previsão
  let extremeConditionsImpact = 0;
  let extremeConditionsDescription = '';
  
  // Verificar geada
  const hasFrost = forecast.forecast.some(day => day.minTemp <= 0);
  if (hasFrost) {
    const frostImpact = params.toleratesFrost ? -3 : -8;
    extremeConditionsImpact += frostImpact;
    extremeConditionsDescription += 'Previsão de geada. ';
  }
  
  // Verificar calor extremo
  const hasExtremeHeat = forecast.forecast.some(day => day.maxTemp >= 35);
  if (hasExtremeHeat) {
    const heatImpact = params.toleratesHeat ? -2 : -6;
    extremeConditionsImpact += heatImpact;
    extremeConditionsDescription += 'Previsão de calor extremo. ';
  }
  
  // Verificar chuva excessiva
  const hasExcessiveRain = forecast.forecast.some(day => day.totalPrecipitation >= 20);
  if (hasExcessiveRain) {
    const rainImpact = params.toleratesExcessRain ? -2 : -7;
    extremeConditionsImpact += rainImpact;
    extremeConditionsDescription += 'Previsão de chuva excessiva. ';
  }
  
  // Verificar seca
  const hasDrought = forecast.forecast.every(day => day.totalPrecipitation <= 1) && forecast.forecast.length >= 5;
  if (hasDrought) {
    const droughtImpact = params.toleratesDrought ? -3 : -7;
    extremeConditionsImpact += droughtImpact;
    extremeConditionsDescription += 'Previsão de seca prolongada. ';
  }
  
  // Limitar impacto de condições extremas
  extremeConditionsImpact = Math.max(-10, extremeConditionsImpact);
  
  // Calcular pontuação geral
  const factors = [
    {
      factor: 'Temperatura',
      impact: tempImpact,
      description: tempImpact > 0 ? 
        'Temperatura dentro da faixa ideal para a cultura.' : 
        `Temperatura ${currentTemp < params.idealTempMin ? 'abaixo' : 'acima'} da faixa ideal.`,
    },
    {
      factor: 'Umidade',
      impact: humidityImpact,
      description: humidityImpact > 0 ? 
        'Umidade dentro da faixa ideal para a cultura.' : 
        `Umidade ${currentHumidity < params.idealHumidityMin ? 'abaixo' : 'acima'} da faixa ideal.`,
    },
    {
      factor: 'Precipitação',
      impact: precipImpact,
      description: precipImpact > 0 ? 
        'Níveis de precipitação adequados para a cultura.' : 
        `Precipitação ${effectivePrecipitation < params.idealPrecipitationMin ? 'insuficiente' : 'excessiva'} para a cultura.`,
    },
  ];
  
  // Adicionar fator de condições extremas se relevante
  if (extremeConditionsImpact < 0) {
    factors.push({
      factor: 'Condições Extremas',
      impact: extremeConditionsImpact,
      description: extremeConditionsDescription,
    });
  }
  
  // Calcular pontuação média
  const totalImpact = factors.reduce((sum, factor) => sum + factor.impact, 0);
  const score = totalImpact / factors.length;
  
  // Determinar impacto geral
  let impact: 'positive' | 'neutral' | 'negative';
  if (score >= 3) {
    impact = 'positive';
  } else if (score >= -3) {
    impact = 'neutral';
  } else {
    impact = 'negative';
  }
  
  // Gerar recomendações
  const recommendations: string[] = [];
  
  if (tempImpact < 0) {
    if (currentTemp < params.idealTempMin) {
      recommendations.push('Considere o uso de estufas ou coberturas para proteger a cultura do frio.');
    } else {
      recommendations.push('Implemente sistemas de irrigação ou sombreamento para reduzir o estresse térmico.');
    }
  }
  
  if (humidityImpact < 0) {
    if (currentHumidity < params.idealHumidityMin) {
      recommendations.push('Aumente a frequência de irrigação para elevar a umidade do solo e do ambiente.');
    } else {
      recommendations.push('Melhore a drenagem do solo e considere reduzir a densidade de plantio para aumentar a circulação de ar.');
    }
  }
  
  if (precipImpact < 0) {
    if (effectivePrecipitation < params.idealPrecipitationMin) {
      recommendations.push('Implemente sistemas de irrigação suplementar e considere o uso de cobertura morta para conservar a umidade do solo.');
    } else {
      recommendations.push('Melhore os sistemas de drenagem e considere o uso de canteiros elevados para evitar o encharcamento do solo.');
    }
  }
  
  if (hasFrost && !params.toleratesFrost) {
    recommendations.push('Utilize técnicas de proteção contra geadas, como coberturas, aquecedores ou aspersão de água.');
  }
  
  if (hasExtremeHeat && !params.toleratesHeat) {
    recommendations.push('Implemente sistemas de sombreamento temporário e aumente a frequência de irrigação durante os períodos mais quentes do dia.');
  }
  
  if (hasExcessiveRain && !params.toleratesExcessRain) {
    recommendations.push('Melhore a drenagem do solo, considere o uso de canteiros elevados e aplique fungicidas preventivos para evitar doenças fúngicas.');
  }
  
  if (hasDrought && !params.toleratesDrought) {
    recommendations.push('Implemente sistemas de irrigação eficientes, utilize cobertura morta para conservar a umidade do solo e considere o uso de variedades mais resistentes à seca.');
  }
  
  return {
    cropType,
    impact,
    score,
    factors,
    recommendations,
  };
}

/**
 * Obtém dados meteorológicos atuais (com fallbacks e cache)
 */
export async function getCurrentWeather(location: string | Coordinates): Promise<WeatherData | null> {
  try {
    // Normalizar parâmetro de localização para uso como chave de cache
    const cacheKey = typeof location === 'string' ? 
      `${REDIS_PREFIX}current:${location.toLowerCase()}` : 
      `${REDIS_PREFIX}current:${location.latitude},${location.longitude}`;
    
    // Verificar cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Tentar obter dados da WeatherAPI
    let weatherData = await getWeatherAPICurrentData(location);
    
    // Se falhar, tentar OpenWeatherMap como fallback
    if (!weatherData) {
      weatherData = await getOpenWeatherMapCurrentData(location);
    }
    
    if (weatherData) {
      // Armazenar em cache
      await redis.set(cacheKey, JSON.stringify(weatherData), { ex: CACHE_EXPIRATION.CURRENT });
      return weatherData;
    }
    
    console.warn(`Não foi possível obter dados meteorológicos atuais para ${location}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter dados meteorológicos atuais para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém previsão do tempo (com cache)
 */
export async function getWeatherForecast(location: string | Coordinates, days: number = 7): Promise<WeatherForecast | null> {
  try {
    // Normalizar parâmetro de localização para uso como chave de cache
    const cacheKey = typeof location === 'string' ? 
      `${REDIS_PREFIX}forecast:${location.toLowerCase()}:${days}` : 
      `${REDIS_PREFIX}forecast:${location.latitude},${location.longitude}:${days}`;
    
    // Verificar cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Obter previsão da WeatherAPI
    const forecastData = await getWeatherAPIForecast(location, days);
    
    if (forecastData) {
      // Armazenar em cache
      await redis.set(cacheKey, JSON.stringify(forecastData), { ex: CACHE_EXPIRATION.FORECAST });
      return forecastData;
    }
    
    console.warn(`Não foi possível obter previsão do tempo para ${location}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter previsão do tempo para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém dados meteorológicos históricos (com cache)
 */
export async function getHistoricalWeather(location: string | Coordinates, date: string): Promise<HistoricalWeatherData | null> {
  try {
    // Normalizar parâmetro de localização para uso como chave de cache
    const cacheKey = typeof location === 'string' ? 
      `${REDIS_PREFIX}historical:${location.toLowerCase()}:${date}` : 
      `${REDIS_PREFIX}historical:${location.latitude},${location.longitude}:${date}`;
    
    // Verificar cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Obter dados históricos da WeatherAPI
    const historicalData = await getWeatherAPIHistorical(location, date);
    
    if (historicalData) {
      // Armazenar em cache
      await redis.set(cacheKey, JSON.stringify(historicalData), { ex: CACHE_EXPIRATION.HISTORICAL });
      return historicalData;
    }
    
    console.warn(`Não foi possível obter dados meteorológicos históricos para ${location} na data ${date}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter dados meteorológicos históricos para ${location} na data ${date}:`, error);
    return null;
  }
}

/**
 * Obtém alertas meteorológicos (sem cache para garantir dados atualizados)
 */
export async function getWeatherAlerts(location: string | Coordinates): Promise<WeatherAlert | null> {
  try {
    // Obter alertas da WeatherAPI
    return await getWeatherAPIAlerts(location);
  } catch (error) {
    console.error(`Erro ao obter alertas meteorológicos para ${location}:`, error);
    return null;
  }
}

/**
 * Analisa o impacto das condições climáticas em uma cultura específica
 */
export async function analyzeCropWeatherImpact(cropType: string, location: string | Coordinates): Promise<CropImpact | null> {
  try {
    // Obter dados meteorológicos atuais e previsão
    const [currentWeather, forecast] = await Promise.all([
      getCurrentWeather(location),
      getWeatherForecast(location, 7),
    ]);
    
    if (!currentWeather || !forecast) {
      console.warn(`Dados meteorológicos insuficientes para análise de impacto em ${cropType}`);
      return null;
    }
    
    // Analisar impacto
    return analyzeCropImpact(cropType, currentWeather, forecast);
  } catch (error) {
    console.error(`Erro ao analisar impacto climático em ${cropType}:`, error);
    return null;
  }
}

/**
 * Obtém histórico de precipitação para uma localização
 */
export async function getPrecipitationHistory(location: string | Coordinates, days: number = 30): Promise<{
  location: string;
  data: Array<{ date: string; precipitation: number }>;
} | null> {
  try {
    const now = new Date();
    const data: Array<{ date: string; precipitation: number }> = [];
    
    // Obter dados para cada dia
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const historicalData = await getHistoricalWeather(location, dateStr);
      if (historicalData) {
        data.push({
          date: dateStr,
          precipitation: historicalData.totalPrecipitation,
        });
      }
    }
    
    // Ordenar por data
    data.sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      location: typeof location === 'string' ? location : `${location.latitude},${location.longitude}`,
      data,
    };
  } catch (error) {
    console.error(`Erro ao obter histórico de precipitação para ${location}:`, error);
    return null;
  }
}

/**
 * Obtém histórico de temperatura para uma localização
 */
export async function getTemperatureHistory(location: string | Coordinates, days: number = 30): Promise<{
  location: string;
  data: Array<{ date: string; min: number; max: number; avg: number }>;
} | null> {
  try {
    const now = new Date();
    const data: Array<{ date: string; min: number; max: number; avg: number }> = [];
    
    // Obter dados para cada dia
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const historicalData = await getHistoricalWeather(location, dateStr);
      if (historicalData) {
        data.push({
          date: dateStr,
          min: historicalData.minTemp,
          max: historicalData.maxTemp,
          avg: historicalData.avgTemp,
        });
      }
    }
    
    // Ordenar por data
    data.sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      location: typeof location === 'string' ? location : `${location.latitude},${location.longitude}`,
      data,
    };
  } catch (error) {
    console.error(`Erro ao obter histórico de temperatura para ${location}:`, error);
    return null;
  }
}

/**
 * Inicializa o módulo de dados meteorológicos
 */
export function initWeatherModule() {
  console.log('Inicializando módulo de dados meteorológicos...');
  
  // Inicializar provedor Ethereum
  initProvider();
  
  console.log('Módulo de dados meteorológicos inicializado');
}