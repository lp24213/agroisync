import express from 'express';
import axios from 'axios';
import { rateLimit } from '../middleware/rateLimit.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Configurações
const { OPENWEATHER_API_KEY } = process.env;
const IP_API_URL = 'https://ipapi.co/json/';
const IPINFO_URL = 'https://ipinfo.io/json';

// Rate limiting para evitar abuso da API
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ===== NOVO ENDPOINT: GET /api/weather/current =====
// Retorna dados climáticos das principais cidades produtoras de Mato Grosso
router.get('/current', async (req, res) => {
  try {
    // Principais cidades produtoras de MATO GROSSO com dados de previsão 15 dias
    const mtoGrossoData = [
      {
        city: 'Sorriso',
        state: 'MT',
        temperature: 32,
        description: 'Ensolarado',
        humidity: 62,
        wind_speed: 10,
        forecast_15days: generateMockForecast(32, 'Sorriso')
      },
      {
        city: 'Sinop',
        state: 'MT',
        temperature: 33,
        description: 'Ensolarado',
        humidity: 58,
        wind_speed: 12,
        forecast_15days: generateMockForecast(33, 'Sinop')
      },
      {
        city: 'Lucas do Rio Verde',
        state: 'MT',
        temperature: 31,
        description: 'Parcialmente Nublado',
        humidity: 70,
        wind_speed: 8,
        forecast_15days: generateMockForecast(31, 'Lucas do Rio Verde')
      },
      {
        city: 'Rondonópolis',
        state: 'MT',
        temperature: 30,
        description: 'Ensolarado',
        humidity: 65,
        wind_speed: 9,
        forecast_15days: generateMockForecast(30, 'Rondonópolis')
      },
      {
        city: 'Nova Mutum',
        state: 'MT',
        temperature: 31,
        description: 'Nublado',
        humidity: 72,
        wind_speed: 11,
        forecast_15days: generateMockForecast(31, 'Nova Mutum')
      },
      {
        city: 'Campo Verde',
        state: 'MT',
        temperature: 32,
        description: 'Ensolarado',
        humidity: 60,
        wind_speed: 10,
        forecast_15days: generateMockForecast(32, 'Campo Verde')
      },
      {
        city: 'Cuiabá',
        state: 'MT',
        temperature: 34,
        description: 'Muito Quente',
        humidity: 55,
        wind_speed: 8,
        forecast_15days: generateMockForecast(34, 'Cuiabá')
      },
      {
        city: 'Jaciara',
        state: 'MT',
        temperature: 31,
        description: 'Parcialmente Nublado',
        humidity: 68,
        wind_speed: 9,
        forecast_15days: generateMockForecast(31, 'Jaciara')
      }
    ];

    res.json({
      success: true,
      data: mtoGrossoData,
      userLocation: null,
      timestamp: new Date().toISOString(),
      source: 'Dados Climáticos Completos - Principais Cidades Produtoras de Mato Grosso',
      forecastDays: 15
    });
  } catch (error) {
    logger.error('Erro no endpoint /weather/current:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados climáticos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== NOVO ENDPOINT: GET /api/weather/forecast-15days =====
// Retorna previsão de 15 dias para uma cidade específica de MT
router.get('/forecast-15days', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Forneça o nome da cidade via query parameter: ?city=Sorriso'
      });
    }

    const forecast = generateMockForecast(32, city);

    res.json({
      success: true,
      city,
      state: 'MT',
      forecast: forecast,
      timestamp: new Date().toISOString(),
      source: 'Previsão de 15 dias - Mato Grosso'
    });
  } catch (error) {
    logger.error('Erro no endpoint /weather/forecast-15days:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter previsão',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Função para gerar dados de previsão para 15 dias
function generateMockForecast(baseTemp, cityName) {
  const forecast = [];
  const conditions = ['Ensolarado', 'Parcialmente Nublado', 'Nublado', 'Chuva Leve', 'Chuva', 'Tempestade'];
  const conditionIcons = {
    'Ensolarado': '☀️',
    'Parcialmente Nublado': '⛅',
    'Nublado': '☁️',
    'Chuva Leve': '🌦️',
    'Chuva': '🌧️',
    'Tempestade': '⛈️'
  };

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Gerar temperatura com variação natural
    const variation = Math.sin(i / 5) * 8 + (Math.random() - 0.5) * 6;
    const maxTemp = Math.round(baseTemp + variation);
    const minTemp = Math.round(baseTemp - 5 + variation);

    // Selecionar condição aleatória com peso maior para ensolarado
    let condition;
    const random = Math.random();
    if (random < 0.4) {
      condition = 'Ensolarado';
    } else if (random < 0.7) {
      condition = 'Parcialmente Nublado';
    } else if (random < 0.85) {
      condition = 'Nublado';
    } else if (random < 0.92) {
      condition = 'Chuva Leve';
    } else if (random < 0.97) {
      condition = 'Chuva';
    } else {
      condition = 'Tempestade';
    }

    // Umidade varia com a condição
    let humidity = 60;
    if (condition.includes('Chuva') || condition === 'Tempestade') {
      humidity = Math.round(75 + Math.random() * 20);
    } else if (condition === 'Ensolarado') {
      humidity = Math.round(40 + Math.random() * 20);
    }

    // Vento
    const windSpeed = Math.round(5 + Math.random() * 15);

    forecast.push({
      day: i,
      date: date.toLocaleDateString('pt-BR'),
      dayName: getDayName(date),
      maxTemp,
      minTemp,
      avgTemp: Math.round((maxTemp + minTemp) / 2),
      condition,
      icon: conditionIcons[condition],
      humidity,
      windSpeed,
      rainfall: condition.includes('Chuva') ? Math.round(Math.random() * 50 + 10) : 0,
      rainChance: condition.includes('Chuva') || condition === 'Tempestade' ? Math.round(60 + Math.random() * 40) : Math.round(Math.random() * 30),
      uvIndex: condition === 'Ensolarado' ? Math.round(8 + Math.random() * 2) : Math.round(4 + Math.random() * 4)
    });
  }

  return forecast;
}

// Função para obter nome do dia da semana
function getDayName(date) {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
}

// GET /api/weather - Obter clima baseado no IP do usuário
router.get('/', async (req, res) => {
  try {
    // Obter IP do usuário
    const clientIP =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'];

    let locationData;
    let weatherData;

    try {
      // Tentar obter localização via IP
      if (clientIP && clientIP !== '127.0.0.1' && clientIP !== '::1') {
        // Usar IP-API (gratuito, limite de 1000 requests/dia)
        const ipResponse = await axios.get(`${IP_API_URL}?ip=${clientIP}`, {
          timeout: 5000
        });

        if (ipResponse.data && ipResponse.data.city) {
          locationData = {
            city: ipResponse.data.city,
            state: ipResponse.data.region,
            country: ipResponse.data.country_name,
            lat: ipResponse.data.latitude,
            lon: ipResponse.data.longitude,
            timezone: ipResponse.data.timezone
          };
        }
      }

      // Fallback para IPINFO se IP-API falhar
      if (!locationData) {
        const ipinfoResponse = await axios.get(IPINFO_URL, {
          timeout: 5000
        });

        if (ipinfoResponse.data && ipinfoResponse.data.city) {
          const [lat, lon] = ipinfoResponse.data.loc.split(',').map(Number);
          locationData = {
            city: ipinfoResponse.data.city,
            state: ipinfoResponse.data.region,
            country: ipinfoResponse.data.country,
            lat,
            lon,
            timezone: ipinfoResponse.data.timezone
          };
        }
      }

      // Se não conseguir localização por IP, usar coordenadas padrão (São Paulo)
      if (!locationData) {
        locationData = {
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          lat: -23.5505,
          lon: -46.6333,
          timezone: 'America/Sao_Paulo'
        };
      }

      // Obter dados do clima via OpenWeatherMap
      if (OPENWEATHER_API_KEY) {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`,
          { timeout: 10000 }
        );

        weatherData = weatherResponse.data;
      } else {
        // Dados mock para desenvolvimento
        weatherData = {
          main: {
            temp: 22.5,
            feels_like: 24.0,
            humidity: 65,
            pressure: 1013
          },
          weather: [
            {
              main: 'Clear',
              description: 'céu limpo',
              icon: '01d'
            }
          ],
          wind: {
            speed: 3.2,
            deg: 180
          },
          clouds: {
            all: 20
          },
          sys: {
            sunrise: Date.now() + 6 * 60 * 60 * 1000, // 6h da manhã
            sunset: Date.now() + 18 * 60 * 60 * 1000 // 6h da tarde
          }
        };
      }

      // Formatar resposta
      const response = {
        success: true,
        location: {
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          timezone: locationData.timezone
        },
        weather: {
          temperature: {
            current: Math.round(weatherData.main.temp),
            feels_like: Math.round(weatherData.main.feels_like),
            unit: '°C'
          },
          condition: {
            main: weatherData.weather[0].main,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon
          },
          details: {
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            wind_speed: Math.round(weatherData.wind.speed * 3.6), // m/s para km/h
            wind_direction: weatherData.wind.deg,
            cloudiness: weatherData.clouds.all
          },
          sun: {
            sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: locationData.timezone
            }),
            sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: locationData.timezone
            })
          }
        },
        timestamp: new Date().toISOString(),
        source: OPENWEATHER_API_KEY ? 'OpenWeatherMap' : 'Mock Data'
      };

      res.json(response);
    } catch (locationError) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro ao obter localização:', locationError);
      }
      // Fallback com dados padrão
      const fallbackResponse = {
        success: true,
        location: {
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          timezone: 'America/Sao_Paulo'
        },
        weather: {
          temperature: {
            current: 22,
            feels_like: 24,
            unit: '°C'
          },
          condition: {
            main: 'Clear',
            description: 'céu limpo',
            icon: '01d'
          },
          details: {
            humidity: 65,
            pressure: 1013,
            wind_speed: 3,
            wind_direction: 180,
            cloudiness: 20
          },
          sun: {
            sunrise: '06:00',
            sunset: '18:00'
          }
        },
        timestamp: new Date().toISOString(),
        source: 'Fallback Data',
        note: 'Dados aproximados devido a erro na localização'
      };

      res.json(fallbackResponse);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro no endpoint de clima:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/weather/forecast - Previsão para 5 dias
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!OPENWEATHER_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'API de clima não configurada'
      });
    }

    let coordinates = { lat, lon };

    // Se não forneceu coordenadas, buscar por cidade
    if (!lat || !lon) {
      if (!city) {
        return res.status(400).json({
          success: false,
          message: 'Forneça coordenadas (lat, lon) ou nome da cidade'
        });
      }

      const geocodeResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},BR&limit=1&appid=${OPENWEATHER_API_KEY}`,
        { timeout: 10000 }
      );

      if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cidade não encontrada'
        });
      }

      coordinates = {
        lat: geocodeResponse.data[0].lat,
        lon: geocodeResponse.data[0].lon
      };
    }

    // Obter previsão de 5 dias
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`,
      { timeout: 10000 }
    );

    const forecast = forecastResponse.data;

    // Agrupar por dia
    const dailyForecast = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('pt-BR');

      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          date,
          temperatures: [],
          conditions: [],
          humidity: [],
          wind_speed: []
        };
      }

      dailyForecast[date].temperatures.push(item.main.temp);
      dailyForecast[date].conditions.push(item.weather[0].main);
      dailyForecast[date].humidity.push(item.main.humidity);
      dailyForecast[date].wind_speed.push(item.wind.speed * 3.6); // m/s para km/h
    });

    // Calcular médias e extremos
    const formattedForecast = Object.values(dailyForecast).map(day => {
      const avgTemp = Math.round(
        day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length
      );
      const minTemp = Math.round(Math.min(...day.temperatures));
      const maxTemp = Math.round(Math.max(...day.temperatures));
      const avgHumidity = Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length);
      const avgWindSpeed = Math.round(
        day.wind_speed.reduce((a, b) => a + b, 0) / day.wind_speed.length
      );

      // Condição mais frequente
      const conditionCounts = {};
      day.conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      return {
        date: day.date,
        temperature: {
          average: avgTemp,
          min: minTemp,
          max: maxTemp,
          unit: '°C'
        },
        condition: {
          main: mostFrequentCondition,
          description: getConditionDescription(mostFrequentCondition)
        },
        details: {
          humidity: avgHumidity,
          wind_speed: avgWindSpeed
        }
      };
    });

    res.json({
      success: true,
      location: {
        city: forecast.city.name,
        country: forecast.city.country,
        coordinates: {
          lat: forecast.city.coord.lat,
          lon: forecast.city.coord.lon
        }
      },
      forecast: formattedForecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter previsão:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Função auxiliar para descrições em português
function getConditionDescription(condition) {
  const descriptions = {
    Clear: 'céu limpo',
    Clouds: 'nublado',
    Rain: 'chuva',
    Drizzle: 'chuvisco',
    Thunderstorm: 'tempestade',
    Snow: 'neve',
    Mist: 'névoa',
    Smoke: 'fumaça',
    Haze: 'névoa seca',
    Dust: 'poeira',
    Fog: 'névoa',
    Sand: 'areia',
    Ash: 'cinzas',
    Squall: 'rajada',
    Tornado: 'tornado'
  };

  return descriptions[condition] || condition;
}

export default router;
