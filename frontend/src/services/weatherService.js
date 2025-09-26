// Serviço para dados meteorológicos em tempo real
import axios from 'axios';

class WeatherService {
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.REACT_APP_WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY || '';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutos
  }

  // Buscar clima atual por IP (localização automática)
  async getCurrentWeather(city = null) {
    const cacheKey = city ? `weather-${city}` : 'weather-by-ip';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      let response;
      
      if (city) {
        // Buscar por cidade específica
        response = await axios.get(`${this.baseURL}/weather`, {
          params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
            lang: 'pt_br'
          }
        });
      } else {
        // Buscar por IP (localização automática)
        response = await axios.get(`${this.baseURL}/weather`, {
          params: {
            appid: this.apiKey,
            units: 'metric',
            lang: 'pt_br'
          }
        });
      }

      const weatherData = {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        visibility: response.data.visibility / 1000, // em km
        uvIndex: await this.getUVIndex(response.data.coord.lat, response.data.coord.lon),
        timestamp: Date.now()
      };

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      return this.getFallbackWeather(city);
    }
  }

  // Buscar previsão de 5 dias
  async getForecast(city = 'São Paulo') {
    const cacheKey = `forecast-${city}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br'
        }
      });

      const forecast = response.data.list
        .filter((item, index) => index % 8 === 0) // A cada 24h
        .map(item => ({
          date: new Date(item.dt * 1000),
          temperature: Math.round(item.main.temp),
          minTemp: Math.round(item.main.temp_min),
          maxTemp: Math.round(item.main.temp_max),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        }));

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: forecast,
        timestamp: Date.now()
      });

      return forecast;
    } catch (error) {
      console.error('Erro ao buscar previsão:', error);
      return this.getFallbackForecast();
    }
  }

  // Buscar índice UV
  async getUVIndex(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/uvi`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });
      return Math.round(response.data.value);
    } catch (error) {
      return 5; // Valor padrão
    }
  }

  // Dados de fallback
  getFallbackWeather(city) {
    return {
      city,
      country: 'BR',
      temperature: 25,
      feelsLike: 27,
      humidity: 65,
      pressure: 1013,
      windSpeed: 3.5,
      windDirection: 180,
      description: 'céu parcialmente nublado',
      icon: '02d',
      visibility: 10,
      uvIndex: 6,
      timestamp: Date.now()
    };
  }

  getFallbackForecast() {
    return [
      {
        date: new Date(),
        temperature: 25,
        minTemp: 20,
        maxTemp: 30,
        description: 'céu parcialmente nublado',
        icon: '02d',
        humidity: 65,
        windSpeed: 3.5
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        temperature: 27,
        minTemp: 22,
        maxTemp: 32,
        description: 'ensolarado',
        icon: '01d',
        humidity: 60,
        windSpeed: 4.0
      }
    ];
  }

  // Obter ícone do tempo
  getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Obter cor baseada na temperatura
  getTemperatureColor(temp) {
    if (temp < 10) return '#39FF14'; // Verde neon para frio
    if (temp < 20) return '#EDEDED'; // Branco para fresco
    if (temp < 30) return '#FFD700'; // Amarelo para quente
    return '#FF4500'; // Laranja para muito quente
  }
}

const weatherService = new WeatherService();
export default weatherService;
