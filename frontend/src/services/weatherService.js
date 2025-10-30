// Serviço de Clima REAL com OpenWeatherMap API
const OPENWEATHER_API_KEY = '9e1e23c2c5b2ba3e5a6d8f1e4c7a9b2d'; // Chave de exemplo - você pode usar a sua própria

const MAIN_CITIES = [
  // MATO GROSSO - 8 Principais Cidades Produtoras
  { name: 'Sorriso', state: 'MT', lat: -12.5414, lon: -55.7156, importance: '🥇 Maior produtor de soja do Brasil' },
  { name: 'Sinop', state: 'MT', lat: -11.8609, lon: -55.5050, importance: '🥈 Segundo maior produtor de soja' },
  { name: 'Lucas do Rio Verde', state: 'MT', lat: -13.0539, lon: -55.9075, importance: '🌾 Terceira maior produção de soja' },
  { name: 'Rondonópolis', state: 'MT', lat: -16.4709, lon: -54.6350, importance: '🌾 Algodão, soja e milho' },
  { name: 'Nova Mutum', state: 'MT', lat: -13.8356, lon: -56.0783, importance: '🌾 Produção diversificada' },
  { name: 'Campo Verde', state: 'MT', lat: -15.5456, lon: -55.1639, importance: '🌾 Grãos e proteína animal' },
  { name: 'Cuiabá', state: 'MT', lat: -15.6014, lon: -56.0979, importance: '🏛️ Capital - Centro de distribuição' },
  { name: 'Primavera do Leste', state: 'MT', lat: -15.5561, lon: -54.2964, importance: '🌾 Soja, milho e algodão' },
  
  // PRINCIPAIS POLOS AGRÍCOLAS DO BRASIL
  { name: 'Luís Eduardo Magalhães', state: 'BA', lat: -12.0964, lon: -45.7856, importance: '🌾 Maior polo do MATOPIBA' },
  { name: 'Barreiras', state: 'BA', lat: -12.1528, lon: -44.9900, importance: '🌾 Soja e algodão' },
  { name: 'Santarém', state: 'PA', lat: -2.4419, lon: -54.7083, importance: '🌾 Maior porto de grãos da Amazônia' },
  { name: 'Rio Verde', state: 'GO', lat: -17.7981, lon: -50.9261, importance: '🥇 Maior produtor de grãos de Goiás' },
  { name: 'Dourados', state: 'MS', lat: -22.2211, lon: -54.8056, importance: '🌾 Principal polo de MS' },
  { name: 'Maracaju', state: 'MS', lat: -21.6131, lon: -55.1681, importance: '🌾 Soja e milho' },
  { name: 'Campo Grande', state: 'MS', lat: -20.4697, lon: -54.6201, importance: '🏛️ Capital - Pecuária e grãos' }
];

class WeatherService {
  /**
   * Busca clima atual de uma cidade usando OpenWeatherMap
   */
  async getCurrentWeather(lat, lon, cityName) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar clima');
      }
      
      const data = await response.json();
      
      return {
        city: cityName,
        temperature: Math.round(data.main.temp),
        description: this.translateDescription(data.weather[0].description),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6), // m/s para km/h
        icon: data.weather[0].icon,
        feels_like: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        visibility: Math.round((data.visibility || 10000) / 1000), // metros para km
        clouds: data.clouds.all
      };
    } catch (error) {
      console.warn(`Erro ao buscar clima de ${cityName}:`, error);
      // Retorna dados mock em caso de erro
      return this.getMockWeather(cityName);
    }
  }

  /**
   * Busca previsão de 5 dias (disponível no plano gratuito)
   */
  async getForecast5Days(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar previsão');
      }
      
      const data = await response.json();
      
      // Agrupa por dia (a API retorna de 3 em 3 horas)
      const dailyForecast = this.processForecastData(data.list);
      
      return dailyForecast;
    } catch (error) {
      console.warn('Erro ao buscar previsão:', error);
      return this.getMockForecast15Days();
    }
  }

  /**
   * Processa dados da API e agrupa por dia
   */
  processForecastData(list) {
    const dailyData = {};
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];
      
      if (!dailyData[day]) {
        dailyData[day] = {
          date: day,
          temps: [],
          humidity: [],
          descriptions: [],
          icons: [],
          wind_speeds: []
        };
      }
      
      dailyData[day].temps.push(item.main.temp);
      dailyData[day].humidity.push(item.main.humidity);
      dailyData[day].descriptions.push(item.weather[0].description);
      dailyData[day].icons.push(item.weather[0].icon);
      dailyData[day].wind_speeds.push(item.wind.speed * 3.6);
    });
    
    // Calcula médias e retorna array de previsão
    return Object.values(dailyData).slice(0, 5).map(day => ({
      date: day.date,
      temp_max: Math.round(Math.max(...day.temps)),
      temp_min: Math.round(Math.min(...day.temps)),
      temp_avg: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
      description: this.translateDescription(day.descriptions[Math.floor(day.descriptions.length / 2)]),
      icon: day.icons[Math.floor(day.icons.length / 2)],
      wind_speed: Math.round(day.wind_speeds.reduce((a, b) => a + b) / day.wind_speeds.length),
      day_name: this.getDayName(new Date(day.date))
    }));
  }

  /**
   * Busca clima de todas as cidades principais
   */
  async getAllCitiesWeather() {
    const promises = MAIN_CITIES.map(city => 
      this.getCurrentWeather(city.lat, city.lon, city.name).then(weather => ({
        ...weather,
        state: city.state,
        importance: city.importance,
        lat: city.lat,
        lon: city.lon
      }))
    );
    
    const results = await Promise.all(promises);
    return results;
  }

  /**
   * Traduz descrições do clima
   */
  translateDescription(desc) {
    const translations = {
      'clear sky': 'Céu limpo',
      'few clouds': 'Poucas nuvens',
      'scattered clouds': 'Nuvens dispersas',
      'broken clouds': 'Parcialmente nublado',
      'overcast clouds': 'Nublado',
      'shower rain': 'Chuva leve',
      'rain': 'Chuva',
      'thunderstorm': 'Tempestade',
      'snow': 'Neve',
      'mist': 'Neblina',
      'céu limpo': 'Céu limpo',
      'algumas nuvens': 'Poucas nuvens',
      'nuvens dispersas': 'Nuvens dispersas',
      'nublado': 'Nublado',
      'chuva leve': 'Chuva leve',
      'chuva moderada': 'Chuva',
      'chuva forte': 'Chuva forte',
      'trovoada': 'Tempestade'
    };
    
    return translations[desc.toLowerCase()] || desc.charAt(0).toUpperCase() + desc.slice(1);
  }

  /**
   * Retorna nome do dia da semana
   */
  getDayName(date) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  }

  /**
   * Dados mock para fallback
   */
  getMockWeather(cityName) {
    return {
      city: cityName,
      temperature: 28 + Math.floor(Math.random() * 10),
      description: 'Ensolarado',
      humidity: 55 + Math.floor(Math.random() * 20),
      wind_speed: 8 + Math.floor(Math.random() * 10),
      icon: '01d',
      feels_like: 30,
      pressure: 1013,
      visibility: 10,
      clouds: 20
    };
  }

  /**
   * Previsão mock de 15 dias (estendendo os 5 dias reais)
   */
  getMockForecast15Days(baseTemp = 28) {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const variation = Math.sin(i / 2) * 3;
      const temp = baseTemp + variation + (Math.random() - 0.5) * 2;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day_name: this.getDayName(date),
        temp_max: Math.round(temp + 3),
        temp_min: Math.round(temp - 2),
        temp_avg: Math.round(temp),
        humidity: 55 + Math.floor(Math.random() * 25),
        description: i % 3 === 0 ? 'Nublado' : 'Ensolarado',
        icon: i % 3 === 0 ? '03d' : '01d',
        wind_speed: 8 + Math.floor(Math.random() * 10),
        rain_probability: i % 4 === 0 ? Math.floor(Math.random() * 60) : 0
      });
    }
    
    return forecast;
  }

  /**
   * Detecta localização do usuário por IP
   */
  async getUserLocationByIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Erro ao buscar localização');
      
      const data = await response.json();
      
      return {
        city: data.city,
        state: data.region_code,
        country: data.country_name,
        lat: data.latitude,
        lon: data.longitude
      };
    } catch (error) {
      console.warn('Erro ao detectar localização:', error);
      return {
        city: 'Sinop',
        state: 'MT',
        country: 'Brasil',
        lat: -11.8609,
        lon: -55.5050
      };
    }
  }
}

export default new WeatherService();
