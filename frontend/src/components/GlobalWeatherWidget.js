import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Wind, Sunrise, RefreshCw, Search, X } from 'lucide-react';
import weatherService from '../services/weatherService';

const GlobalWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [userLocation, setUserLocation] = useState('');

  const detectUserLocation = useCallback(async () => {
    try {
      // Detectar localização real por IP/GPS
      const location = await weatherService.getUserLocation();
      if (location && location.city) {
        setUserLocation(`${location.city}, ${location.state || ''}`);
      }
    } catch (error) {
      // Silenciar erro de localização em produção
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao detectar localização:', error);
      }
    }
  }, []);

  const loadWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Cache de 10 minutos
      const cached = localStorage.getItem('weather_cache');
      const cacheTime = localStorage.getItem('weather_cache_time');
      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 600000) {
        setWeatherData(JSON.parse(cached));
        setLastUpdate(new Date(parseInt(cacheTime)));
        setLoading(false);
        return;
      }

      // Buscar localização real com fallback robusto
      let location = null;
      try {
        location = await weatherService.getUserLocation();
      } catch (err) {
        // Se falhar, usar localização padrão (Cuiabá, MT)
        location = {
          lat: -15.6014,
          lon: -56.0979,
          city: 'Cuiabá',
          state: 'MT',
          country: 'BR',
          method: 'default'
        };
      }

      if (!location || !location.lat || !location.lon) {
        // Fallback para Cuiabá se não conseguir localização
        location = {
          lat: -15.6014,
          lon: -56.0979,
          city: 'Cuiabá',
          state: 'MT',
          country: 'BR',
          method: 'default'
        };
      }

      // Buscar clima real da Open-Meteo
      const weather = await weatherService.getCurrentWeatherFresh(
        location.lat,
        location.lon,
        location.city
      );

      // Buscar previsão de 5 dias (pode retornar vazio, mas não quebra)
      let forecast = [];
      try {
        forecast = await weatherService.getForecast5Days(location.lat, location.lon);
      } catch (err) {
        // Se não conseguir previsão, continua sem ela
      }

      const weatherData = {
        location: `${location.city}, ${location.state || ''}`,
        current: {
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.wind_speed,
          windDirection: 'NE', // Open-Meteo não retorna direção, pode calcular depois
          pressure: weather.pressure,
          feelsLike: weather.feels_like,
          iconUrl: weather.icon || 'https://openweathermap.org/img/wn/01d@2x.png'
        },
        forecast: forecast && forecast.length > 0 ? forecast.slice(0, 5).map((day, index) => ({
          day: index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : (day.day_name || `Dia ${index + 1}`),
          dayName: index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : (day.day_name ? day.day_name.substring(0, 3) : `D${index + 1}`),
          high: day.temp_max || weather.temperature + 2,
          low: day.temp_min || weather.temperature - 2,
          temperature: day.temp_avg || weather.temperature,
          condition: day.description || weather.description,
          description: day.description || weather.description,
          iconUrl: day.icon || weather.icon || 'https://openweathermap.org/img/wn/01d@2x.png'
        })) : []
      };

      setWeatherData(weatherData);
      setLastUpdate(new Date());
      
      // Salvar no cache
      localStorage.setItem('weather_cache', JSON.stringify(weatherData));
      localStorage.setItem('weather_cache_time', Date.now().toString());
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      setError('Erro ao carregar dados do clima. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData();
    detectUserLocation();
  }, [loadWeatherData, detectUserLocation]);

  const handleSearch = async query => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Buscar cidade nas cidades principais
      const MAIN_CITIES = [
        { name: 'Sorriso', state: 'MT' },
        { name: 'Sinop', state: 'MT' },
        { name: 'Cuiabá', state: 'MT' },
        { name: 'Campo Grande', state: 'MS' },
        { name: 'Dourados', state: 'MS' },
        { name: 'Rondonópolis', state: 'MT' }
      ];
      
      const filtered = MAIN_CITIES.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered.map(city => ({
        name: city.name,
        state: city.state,
        country: 'BR'
      })));
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleCitySelect = async city => {
    try {
      setLoading(true);
      setError('');

      const currentWeather = await weatherService.getCurrentWeather(city.lat, city.lon);
      const forecast = await weatherService.getForecast(city.lat, city.lon);

      setWeatherData({
        location: {
          city: city.name,
          region: city.state,
          country: city.country,
          latitude: city.lat,
          longitude: city.lon
        },
        current: currentWeather,
        forecast
      });

      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
      setLastUpdate(new Date());
    } catch (error) {
      // Silenciar erro de cidade em produção
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao carregar clima da cidade:', error);
      }
      setError('Erro ao carregar clima da cidade');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = timeString => {
    if (!timeString) return '';
    return timeString;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        <span className='ml-3 text-sm text-gray-600'>Carregando clima...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-8 text-center'>
        <p className='mb-4 text-red-600'>{error}</p>
        <button
          onClick={loadWeatherData}
          className='rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700'
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { location, current, forecast } = weatherData;

  return (
    <div className='space-y-2'>
      {/* Header com localização e busca */}
      <div className='flex items-center justify-between mb-1'>
        <div className='flex items-center space-x-1'>
          <MapPin className='h-3 w-3 text-blue-600' />
          <div>
            <p className='text-xs font-semibold text-gray-900'>{location.city}</p>
          </div>
        </div>

        <div className='flex items-center space-x-1'>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className='rounded p-1 transition-colors hover:bg-gray-100'
            title='Buscar cidade'
          >
            <Search className='h-3 w-3 text-gray-600' />
          </button>
          <button
            onClick={loadWeatherData}
            className='rounded p-1 transition-colors hover:bg-gray-100'
            title='Atualizar'
          >
            <RefreshCw className='h-3 w-3 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Busca de cidade */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-2'
        >
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder='Buscar cidade...'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={() => setShowSearch(false)}
              className='absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-gray-100'
            >
              <X className='h-3 w-3 text-gray-500' />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className='max-h-32 overflow-y-auto rounded-lg border border-gray-200'>
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className='w-full border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50'
                >
                  <p className='font-medium'>{city.name}</p>
                  <p className='text-xs text-gray-600'>
                    {city.state && `${city.state}, `}
                    {city.country}
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Clima atual */}
      <div className='py-1 text-center'>
        <div className='mb-1 flex items-center justify-center'>
          <img
            src={current?.iconUrl || 'https://openweathermap.org/img/wn/01d@2x.png'}
            alt={current?.description || 'Clima'}
            className='h-8 w-8'
            onError={e => {
              e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
            }}
          />
        </div>
        <div className='mb-1 text-lg font-bold text-gray-900'>{current?.temperature || '--'}°C</div>
        <p className='text-xs capitalize text-gray-600'>{current?.description || 'Carregando...'}</p>
      </div>

      {/* Detalhes do clima */}
      <div className='grid grid-cols-2 gap-1 text-xs mt-2'>
        <div className='flex items-center space-x-1 rounded bg-gray-50 p-1'>
          <Droplets className='h-3 w-3 text-blue-600' />
          <div>
            <p className='text-xs font-medium'>{current?.humidity || '--'}%</p>
          </div>
        </div>

        <div className='flex items-center space-x-1 rounded bg-gray-50 p-1'>
          <Wind className='h-3 w-3 text-gray-600' />
          <div>
            <p className='text-xs font-medium'>{current?.windSpeed || '--'} km/h</p>
          </div>
        </div>
      </div>

      {/* Previsão para 3 dias */}
      {forecast && forecast.length > 0 && (
        <div className='hidden space-y-1'>
          <h4 className='text-xs font-semibold text-gray-900'>Previsão 3 dias</h4>
          <div className='space-y-1'>
            {forecast.slice(0, 3).map((day, index) => (
              <div key={index} className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
                <div className='flex items-center space-x-3'>
                  <span className='w-16 text-sm font-medium text-gray-900'>{day.dayName}</span>
                  <img
                    src={day?.iconUrl || 'https://openweathermap.org/img/wn/01d@2x.png'}
                    alt={day?.description || 'Clima'}
                    className='h-8 w-8'
                    onError={e => {
                      e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                    }}
                  />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-gray-900'>{day?.temperature || '--'}°C</p>
                  <p className='text-xs capitalize text-gray-600'>{day?.description || 'Carregando...'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Última atualização */}
      {lastUpdate && (
        <div className='border-t border-gray-200 pt-1 mt-2 text-center'>
          <p className='text-[10px] text-gray-500'>
            {lastUpdate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalWeatherWidget;
