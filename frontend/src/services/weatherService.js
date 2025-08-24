// Serviço para previsão do tempo usando OpenWeatherMap API
class WeatherService {
  constructor() {
    this.apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Substitua pela sua chave
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutos
  }

  // Obter clima por coordenadas
  async getWeatherByCoords(lat, lon) {
    try {
      const cacheKey = `weather-${lat}-${lon}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const weatherData = this.formatWeatherData(data);
      
      this.setCachedData(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Erro ao obter dados do clima:', error);
      return this.getFallbackWeatherData();
    }
  }

  // Obter clima por nome da cidade
  async getWeatherByCity(cityName) {
    try {
      const cacheKey = `weather-city-${cityName}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const weatherData = this.formatWeatherData(data);
      
      this.setCachedData(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Erro ao obter dados do clima:', error);
      return this.getFallbackWeatherData();
    }
  }

  // Obter previsão de 5 dias
  async getForecast(lat, lon) {
    try {
      const cacheKey = `forecast-${lat}-${lon}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const forecastData = this.formatForecastData(data);
      
      this.setCachedData(cacheKey, forecastData);
      return forecastData;
    } catch (error) {
      console.error('Erro ao obter previsão do clima:', error);
      return this.getFallbackForecastData();
    }
  }

  // Formatar dados do clima atual
  formatWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s para km/h
        windDirection: this.getWindDirection(data.wind.deg),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        main: data.weather[0].main
      },
      visibility: data.visibility / 1000, // metros para km
      clouds: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date()
    };
  }

  // Formatar dados da previsão
  formatForecastData(data) {
    const dailyForecasts = [];
    const hourlyForecasts = [];

    // Agrupar por dia
    const dailyData = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          temps: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].descriptions.push(item.weather[0].description);
      dailyData[dayKey].icons.push(item.weather[0].icon);
      dailyData[dayKey].humidity.push(item.main.humidity);
      dailyData[dayKey].windSpeed.push(item.wind.speed * 3.6);
    });

    // Processar dados diários
    Object.values(dailyData).forEach(day => {
      dailyForecasts.push({
        date: day.date,
        minTemp: Math.round(Math.min(...day.temps)),
        maxTemp: Math.round(Math.max(...day.temps)),
        avgTemp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
        description: this.getMostFrequent(day.descriptions),
        icon: this.getMostFrequent(day.icons),
        avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        avgWindSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length)
      });
    });

    // Processar dados horários (próximas 24h)
    data.list.slice(0, 8).forEach(item => {
      hourlyForecasts.push({
        time: new Date(item.dt * 1000),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6)
      });
    });

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      daily: dailyForecasts,
      hourly: hourlyForecasts,
      timestamp: new Date()
    };
  }

  // Obter direção do vento
  getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  // Obter item mais frequente
  getMostFrequent(array) {
    const counts = {};
    let maxCount = 0;
    let mostFrequent = array[0];

    array.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }

  // Obter clima por localização do usuário
  async getWeatherByLocation() {
    try {
      const position = await this.getCurrentPosition();
      return await this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Fallback para São Paulo
      return await this.getWeatherByCity('São Paulo');
    }
  }

  // Obter posição atual
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      });
    });
  }

  // Gerenciamento de cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Dados de fallback
  getFallbackWeatherData() {
    return {
      location: {
        name: 'São Paulo',
        country: 'BR',
        lat: -23.5505,
        lon: -46.6333
      },
      current: {
        temperature: 22,
        feelsLike: 24,
        humidity: 65,
        pressure: 1013,
        windSpeed: 12,
        windDirection: 'SE',
        description: 'céu limpo',
        icon: '01d',
        main: 'Clear'
      },
      visibility: 10,
      clouds: 0,
      sunrise: new Date(),
      sunset: new Date(),
      timestamp: new Date()
    };
  }

  getFallbackForecastData() {
    return {
      location: {
        name: 'São Paulo',
        country: 'BR',
        lat: -23.5505,
        lon: -46.6333
      },
      daily: [
        {
          date: new Date(),
          minTemp: 18,
          maxTemp: 25,
          avgTemp: 22,
          description: 'céu limpo',
          icon: '01d',
          avgHumidity: 65,
          avgWindSpeed: 12
        }
      ],
      hourly: [
        {
          time: new Date(),
          temperature: 22,
          description: 'céu limpo',
          icon: '01d',
          humidity: 65,
          windSpeed: 12
        }
      ],
      timestamp: new Date()
    };
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Obter ícone do clima
  getWeatherIcon(iconCode, size = '2x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }

  // Obter descrição em português
  getWeatherDescription(description) {
    const descriptions = {
      'clear sky': 'céu limpo',
      'few clouds': 'poucas nuvens',
      'scattered clouds': 'nuvens dispersas',
      'broken clouds': 'nuvens quebradas',
      'overcast clouds': 'nublado',
      'light rain': 'chuva leve',
      'moderate rain': 'chuva moderada',
      'heavy rain': 'chuva forte',
      'thunderstorm': 'tempestade',
      'snow': 'neve',
      'mist': 'névoa',
      'fog': 'névoa',
      'haze': 'névoa seca'
    };

    return descriptions[description.toLowerCase()] || description;
  }
}

export default new WeatherService();
