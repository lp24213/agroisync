// Serviço de Clima REAL com Open-Meteo API (sem chave)

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
  constructor() {
    // Sem cache, sempre dados reais
  }

  /**
   * Detecta localização automática do usuário
   */
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      // Verificar se geolocalização está disponível e permitida
      if (!navigator.geolocation) {
        this.getLocationByIP().then(resolve).catch(reject);
        return;
      }

      // Tentar geolocalização com tratamento de erro robusto
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const cityData = await this.getCityNameByCoords(latitude, longitude);
              const locationData = {
                lat: latitude,
                lon: longitude,
                city: cityData.city,
                state: cityData.state,
                country: cityData.country,
                method: 'gps'
              };
              resolve(locationData);
            } catch (error) {
              // Se falhar ao obter nome da cidade, usar IP como fallback
              this.getLocationByIP().then(resolve).catch(reject);
            }
          },
          (error) => {
            // Qualquer erro de geolocalização (permissão negada, timeout, etc) -> usar IP
            this.getLocationByIP().then(resolve).catch(reject);
          },
          {
            enableHighAccuracy: false, // Reduzir para false para evitar bloqueios
            timeout: 5000, // Reduzir timeout
            maximumAge: 300000
          }
        );
      } catch (error) {
        // Se houver erro ao chamar getCurrentPosition, usar IP
        this.getLocationByIP().then(resolve).catch(reject);
      }
    });
  }

  /**
   * Busca localização por IP (fallback)
   */
  async getLocationByIP() {
    try {
      // Tentar múltiplos serviços de geolocalização por IP
      const services = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free'
      ];

      for (const serviceUrl of services) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
          
          const response = await fetch(serviceUrl, { 
            signal: controller.signal,
            mode: 'cors',
            credentials: 'omit'
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) continue;
          
          const data = await response.json();
          
          // Formato ipapi.co
          if (data.latitude && data.longitude) {
            return {
              lat: data.latitude,
              lon: data.longitude,
              city: data.city || 'Cidade não identificada',
              state: data.region_code || data.region || 'Estado não identificado',
              country: data.country_code || data.country || 'BR',
              method: 'ip'
            };
          }
          
          // Formato ip-api.com
          if (data.lat && data.lon) {
            return {
              lat: data.lat,
              lon: data.lon,
              city: data.city || 'Cidade não identificada',
              state: data.regionName || data.region || 'Estado não identificado',
              country: data.countryCode || 'BR',
              method: 'ip'
            };
          }
        } catch (err) {
          // Silenciar erro e tentar próximo serviço
          continue;
        }
      }
    } catch (error) {
      // Silenciar erro geral
    }
    
    // Fallback - retornar localização padrão se todos os serviços falharem
    return {
      lat: -15.6014,
      lon: -56.0979,
      city: 'Cuiabá',
      state: 'MT',
      country: 'BR',
      method: 'default'
    };
  }

  /**
   * Busca nome da cidade pelas coordenadas
   */
  async getCityNameByCoords(lat, lon) {
    // Apenas retorna a cidade brasileira mais próxima (sem OpenWeatherMap)
    return this.getNearestBrazilianCity(lat, lon);
  }

  /**
   * Encontra a cidade brasileira mais próxima
   */
  getNearestBrazilianCity(lat, lon) {
    let nearestCity = null;
    let minDistance = Infinity;

    MAIN_CITIES.forEach(city => {
      const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return {
      city: nearestCity.name,
      state: nearestCity.state,
      country: 'BR'
    };
  }

  /**
   * Calcula distância entre duas coordenadas (fórmula de Haversine)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Converte graus para radianos
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Busca clima atual sempre com dados frescos da Open-Meteo
   */
  async getCurrentWeatherFresh(lat, lon, cityName) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m,pressure_msl,cloud_cover,weather_code,is_day&timezone=America/Sao_Paulo`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar clima');
      }
      const data = await response.json();
      const current = data.current;
      
      // Mapear weather_code para descrição e ícone
      const weatherInfo = this.getWeatherInfoFromCode(current.weather_code, current.is_day === 1);
      
      const weatherData = {
        city: cityName,
        temperature: Math.round(current.temperature_2m),
        description: weatherInfo.description,
        humidity: current.relative_humidity_2m ? Math.round(current.relative_humidity_2m) : null,
        wind_speed: Math.round(current.wind_speed_10m * 3.6), // Converter m/s para km/h
        icon: weatherInfo.icon,
        feels_like: Math.round(current.apparent_temperature),
        pressure: current.pressure_msl ? Math.round(current.pressure_msl) : null,
        visibility: null,
        clouds: current.cloud_cover ? Math.round(current.cloud_cover) : null,
        uv_index: null,
        sunrise: null,
        sunset: null
      };
      return {
        ...weatherData,
        cached: false,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Erro ao buscar clima fresco:', error);
      throw error;
    }
  }

  /**
   * Mapeia weather_code da Open-Meteo para descrição e ícone
   */
  getWeatherInfoFromCode(weatherCode, isDay) {
    // Códigos WMO Weather interpretation codes (WW)
    const weatherMap = {
      0: { description: 'Céu limpo', icon: isDay ? '01d' : '01n' },
      1: { description: 'Principalmente limpo', icon: isDay ? '02d' : '02n' },
      2: { description: 'Parcialmente nublado', icon: isDay ? '02d' : '02n' },
      3: { description: 'Nublado', icon: '03d' },
      45: { description: 'Neblina', icon: '50d' },
      48: { description: 'Neblina com geada', icon: '50d' },
      51: { description: 'Chuva leve', icon: isDay ? '09d' : '09n' },
      53: { description: 'Chuva moderada', icon: isDay ? '09d' : '09n' },
      55: { description: 'Chuva forte', icon: isDay ? '09d' : '09n' },
      56: { description: 'Chuva congelante leve', icon: '13d' },
      57: { description: 'Chuva congelante forte', icon: '13d' },
      61: { description: 'Chuva leve', icon: isDay ? '10d' : '10n' },
      63: { description: 'Chuva moderada', icon: isDay ? '10d' : '10n' },
      65: { description: 'Chuva forte', icon: isDay ? '10d' : '10n' },
      66: { description: 'Chuva congelante leve', icon: '13d' },
      67: { description: 'Chuva congelante forte', icon: '13d' },
      71: { description: 'Neve leve', icon: '13d' },
      73: { description: 'Neve moderada', icon: '13d' },
      75: { description: 'Neve forte', icon: '13d' },
      77: { description: 'Grãos de neve', icon: '13d' },
      80: { description: 'Pancadas de chuva leve', icon: isDay ? '09d' : '09n' },
      81: { description: 'Pancadas de chuva moderada', icon: isDay ? '09d' : '09n' },
      82: { description: 'Pancadas de chuva forte', icon: isDay ? '09d' : '09n' },
      85: { description: 'Pancadas de neve leve', icon: '13d' },
      86: { description: 'Pancadas de neve forte', icon: '13d' },
      95: { description: 'Tempestade', icon: '11d' },
      96: { description: 'Tempestade com granizo', icon: '11d' },
      99: { description: 'Tempestade forte com granizo', icon: '11d' }
    };

    const info = weatherMap[weatherCode] || { description: 'Condições desconhecidas', icon: '01d' };
    return {
      description: info.description,
      icon: `https://openweathermap.org/img/wn/${info.icon}@2x.png`
    };
  }

  /**
   * Busca previsão de 5 dias (disponível no plano gratuito)
   */
  async getForecast5Days(lat, lon) {
    // Previsão de 5 dias desabilitada (sem OpenWeatherMap). Retorne array vazio ou implemente com Open-Meteo se necessário.
    return [];
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
   * Busca clima de todas as cidades principais - DIRETO DO BACKEND
   */
  async getAllCitiesWeather() {
    try {
      console.log('🌤️ Buscando clima de todas as cidades do backend...');
      const response = await fetch('https://agroisync-backend.contato-00d.workers.dev/api/weather/current');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar clima: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Clima carregado com sucesso do backend:', data.data?.length, 'cidades');
      
      // O backend retorna { success: true, data: [...], timestamp: ... }
      return data.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar clima do backend:', error);
      // Fallback para Open-Meteo se backend falhar
      console.log('⚠️ Usando fallback com Open-Meteo...');
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
    throw new Error('Mock/fallback desabilitado: apenas dados reais disponíveis.');
  }

  /**
   * Previsão mock de 15 dias (estendendo os 5 dias reais)
   */
  getMockForecast15Days(baseTemp = 28) {
    throw new Error('Mock/fallback desabilitado: apenas dados reais disponíveis.');
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
