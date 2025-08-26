import axios from 'axios';

class WeatherService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || 'your_openweather_api_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.ipApiUrl = 'https://ipapi.co/json';
  }

  // Detectar localização por IP
  async detectLocationByIP() {
    try {
      const response = await axios.get(this.ipApiUrl);
      return {
        city: response.data.city,
        region: response.data.region,
        country: response.data.country,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone
      };
    } catch (error) {
      console.error('Erro ao detectar localização por IP:', error);
      // Fallback para localização padrão (São Paulo)
      return {
        city: 'São Paulo',
        region: 'SP',
        country: 'BR',
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo'
      };
    }
  }

  // Obter clima atual por coordenadas
  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br'
        }
      });

      return this.formatCurrentWeather(response.data);
    } catch (error) {
      console.error('Erro ao obter clima atual:', error);
      throw new Error('Não foi possível obter dados do clima');
    }
  }

  // Obter previsão para 5 dias
  async getForecast(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br'
        }
      });

      return this.formatForecast(response.data);
    } catch (error) {
      console.error('Erro ao obter previsão:', error);
      throw new Error('Não foi possível obter previsão do tempo');
    }
  }

  // Obter clima por nome da cidade
  async getWeatherByCity(cityName) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: cityName,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br'
        }
      });

      return this.formatCurrentWeather(response.data);
    } catch (error) {
      console.error('Erro ao obter clima por cidade:', error);
      throw new Error('Cidade não encontrada');
    }
  }

  // Formatar dados do clima atual
  formatCurrentWeather(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Converter m/s para km/h
      windDirection: this.getWindDirection(data.wind.deg),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: new Date(data.dt * 1000)
    };
  }

  // Formatar dados da previsão
  formatForecast(data) {
    const dailyForecasts = [];
    const today = new Date();
    
    // Agrupar previsões por dia
    const dailyData = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          dayName: this.getDayName(date),
          temperatures: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyData[dayKey].temperatures.push(item.main.temp);
      dailyData[dayKey].descriptions.push(item.weather[0].description);
      dailyData[dayKey].icons.push(item.weather[0].icon);
      dailyData[dayKey].humidity.push(item.main.humidity);
      dailyData[dayKey].windSpeed.push(item.wind.speed * 3.6);
    });

    // Calcular médias e selecionar descrição mais frequente
    Object.values(dailyData).forEach(day => {
      const avgTemp = Math.round(day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length);
      const avgHumidity = Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length);
      const avgWindSpeed = Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length);
      
      // Encontrar descrição mais frequente
      const descriptionCount = {};
      day.descriptions.forEach(desc => {
        descriptionCount[desc] = (descriptionCount[desc] || 0) + 1;
      });
      const mostFrequentDesc = Object.keys(descriptionCount).reduce((a, b) => 
        descriptionCount[a] > descriptionCount[b] ? a : b
      );
      
      // Encontrar ícone correspondente à descrição mais frequente
      const mostFrequentIndex = day.descriptions.indexOf(mostFrequentDesc);
      const icon = day.icons[mostFrequentIndex];

      dailyForecasts.push({
        date: day.date,
        dayName: day.dayName,
        temperature: avgTemp,
        description: mostFrequentDesc,
        icon: icon,
        iconUrl: `https://openweathermap.org/img/wn/${icon}.png`,
        humidity: avgHumidity,
        windSpeed: avgWindSpeed
      });
    });

    return dailyForecasts.slice(0, 5); // Retornar apenas 5 dias
  }

  // Obter nome do dia da semana
  getDayName(date) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  }

  // Obter direção do vento
  getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  // Obter clima completo (localização + clima atual + previsão)
  async getCompleteWeather() {
    try {
      // Detectar localização
      const location = await this.detectLocationByIP();
      
      // Obter clima atual
      const currentWeather = await this.getCurrentWeather(location.latitude, location.longitude);
      
      // Obter previsão
      const forecast = await this.getForecast(location.latitude, location.longitude);
      
      return {
        location,
        current: currentWeather,
        forecast
      };
    } catch (error) {
      console.error('Erro ao obter clima completo:', error);
      throw error;
    }
  }

  // Buscar cidade
  async searchCity(query) {
    try {
      const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey
        }
      });

      return response.data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon
      }));
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      return [];
    }
  }
}

export default new WeatherService();
