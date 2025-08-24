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
