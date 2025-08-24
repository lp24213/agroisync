// Serviço para previsão do tempo usando OpenWeatherMap API + Detecção por IP
class WeatherService {
  constructor() {
    this.apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Substitua pela sua chave
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.ipApiUrl = 'https://ipapi.co/json'; // API gratuita para detectar localização por IP
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutos
  }

  // Detectar localização por IP
  async detectLocationByIP() {
    try {
      const response = await fetch(this.ipApiUrl);
      const data = await response.json();
      
      return {
        city: data.city,
        state: data.region,
        country: data.country_name,
        lat: data.latitude,
        lon: data.longitude,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('Erro ao detectar localização por IP:', error);
      // Fallback para localização padrão (Sinop, MT)
      return {
        city: 'Sinop',
        state: 'Mato Grosso',
        country: 'Brasil',
        lat: -11.8333,
        lon: -55.6333,
        timezone: 'America/Cuiaba'
      };
    }
  }

  // Obter clima por coordenadas
  async getWeatherByCoords(lat, lon) {
    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Erro ao obter clima por coordenadas:', error);
      throw error;
    }
  }

  // Obter clima por cidade
  async getWeatherByCity(cityName) {
    try {
      const url = `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Erro ao obter clima por cidade:', error);
      throw error;
    }
  }

  // Obter previsão
  async getForecast(lat, lon) {
    try {
      const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod !== '200') {
        throw new Error(data.message);
      }
      
      return this.formatForecastData(data);
    } catch (error) {
      console.error('Erro ao obter previsão:', error);
      throw error;
    }
  }

  // Obter clima pela localização do usuário (IP)
  async getWeatherByLocation() {
    try {
      // Verificar cache primeiro
      const cacheKey = 'user_location_weather';
      const cachedData = this.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Detectar localização por IP
      const location = await this.detectLocationByIP();
      
      // Obter clima para a localização detectada
      const weather = await this.getWeatherByCoords(location.lat, location.lon);
      
      // Combinar dados de localização e clima
      const result = {
        ...weather,
        location: {
          city: location.city,
          state: location.state,
          country: location.country,
          timezone: location.timezone
        }
      };
      
      // Salvar no cache
      this.setCachedData(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Erro ao obter clima por localização:', error);
      // Retornar dados de fallback
      return this.getFallbackWeatherData();
    }
  }

  // Formatar dados do clima
  formatWeatherData(data) {
    return {
      current: {
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s para km/h
        windDirection: this.getWindDirection(data.wind.deg),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        visibility: data.visibility / 1000, // metros para km
        clouds: data.clouds.all,
        timestamp: new Date()
      }
    };
  }

  // Formatar dados da previsão
  formatForecastData(data) {
    const dailyForecasts = [];
    const today = new Date();
    
    // Agrupar previsões por dia
    const dailyData = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = [];
      }
      dailyData[dayKey].push(item);
    });
    
    // Processar cada dia
    Object.keys(dailyData).forEach(dayKey => {
      const dayData = dailyData[dayKey];
      const date = new Date(dayKey);
      
      // Calcular médias e extremos
      const temps = dayData.map(item => item.main.temp);
      const humidities = dayData.map(item => item.main.humidity);
      const descriptions = dayData.map(item => item.weather[0].description);
      
      const forecast = {
        date: date,
        dayName: this.getDayName(date),
        minTemp: Math.round(Math.min(...temps)),
        maxTemp: Math.round(Math.max(...temps)),
        avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
        avgHumidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
        description: this.getMostFrequent(descriptions),
        icon: dayData[0].weather[0].icon,
        precipitation: dayData.reduce((total, item) => total + (item.pop || 0), 0) / dayData.length
      };
      
      dailyForecasts.push(forecast);
    });
    
    return dailyForecasts.slice(0, 5); // Retornar apenas 5 dias
  }

  // Obter direção do vento
  getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  // Obter nome do dia
  getDayName(date) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  }

  // Obter valor mais frequente em um array
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

  // Dados de fallback
  getFallbackWeatherData() {
    return {
      current: {
        temp: 25,
        feels_like: 27,
        humidity: 65,
        pressure: 1013,
        windSpeed: 12,
        windDirection: 'SE',
        description: 'céu limpo',
        icon: 'sun',
        sunrise: new Date(),
        sunset: new Date(),
        visibility: 10,
        clouds: 0,
        timestamp: new Date()
      },
      location: {
        city: 'Sinop',
        state: 'Mato Grosso',
        country: 'Brasil',
        timezone: 'America/Cuiaba'
      }
    };
  }

  // Dados de previsão de fallback
  getFallbackForecastData() {
    const today = new Date();
    const forecasts = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecasts.push({
        date: date,
        dayName: this.getDayName(date),
        minTemp: 20 + Math.floor(Math.random() * 10),
        maxTemp: 30 + Math.floor(Math.random() * 10),
        avgTemp: 25 + Math.floor(Math.random() * 10),
        avgHumidity: 60 + Math.floor(Math.random() * 20),
        description: 'céu limpo',
        icon: 'sun',
        precipitation: Math.random() * 0.3
      });
    }
    
    return forecasts;
  }

  // Cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Obter ícone do clima
  getWeatherIcon(iconCode, size = '2x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }

  // Obter descrição do clima
  getWeatherDescription(description) {
    const descriptions = {
      'céu limpo': 'Céu limpo e ensolarado',
      'poucas nuvens': 'Poucas nuvens no céu',
      'nuvens dispersas': 'Nuvens dispersas',
      'nublado': 'Céu nublado',
      'chuva leve': 'Chuva leve',
      'chuva moderada': 'Chuva moderada',
      'chuva forte': 'Chuva forte',
      'tempestade': 'Tempestade',
      'neve': 'Neve',
      'névoa': 'Névoa'
    };
    
    return descriptions[description] || description;
  }
}

const weatherService = new WeatherService();
export default weatherService;
