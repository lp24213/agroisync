import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Thermometer, Droplets, Wind, 
  Sunrise, Sunset, RefreshCw, Search, X
} from 'lucide-react';
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

  useEffect(() => {
    loadWeatherData();
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      // Simular detecção de localização por IP
      const mockLocation = 'São Paulo, SP';
      setUserLocation(mockLocation);
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
    }
  };

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simular dados de clima por localização
      const mockWeatherData = {
        location: userLocation || 'São Paulo, SP',
        current: {
          temperature: 28,
          description: 'Ensolarado',
          humidity: 65,
          windSpeed: 12,
          windDirection: 'NE',
          pressure: 1013,
          feelsLike: 30,
          iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png'
        },
        forecast: [
          { day: 'Hoje', dayName: 'Hoje', high: 30, low: 22, temperature: 28, condition: 'Ensolarado', description: 'Ensolarado', iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png' },
          { day: 'Amanhã', dayName: 'Amanhã', high: 32, low: 24, temperature: 30, condition: 'Parcialmente nublado', description: 'Parcialmente nublado', iconUrl: 'https://openweathermap.org/img/wn/02d@2x.png' },
          { day: 'Quarta', dayName: 'Qua', high: 29, low: 21, temperature: 26, condition: 'Chuvoso', description: 'Chuvoso', iconUrl: 'https://openweathermap.org/img/wn/10d@2x.png' },
          { day: 'Quinta', dayName: 'Qui', high: 31, low: 23, temperature: 29, condition: 'Ensolarado', description: 'Ensolarado', iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png' },
          { day: 'Sexta', dayName: 'Sex', high: 33, low: 25, temperature: 31, condition: 'Ensolarado', description: 'Ensolarado', iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png' }
        ]
      };
      
      setWeatherData(mockWeatherData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      setError('Erro ao carregar dados do clima');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await weatherService.searchCity(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    }
  };

  const handleCitySelect = async (city) => {
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
      console.error('Erro ao carregar clima da cidade:', error);
      setError('Erro ao carregar clima da cidade');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-600">Carregando clima...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadWeatherData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
    <div className="space-y-4">
      {/* Header com localização e busca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">{location.city}</p>
            <p className="text-xs text-gray-600">
              {location.region && `${location.region}, `}{location.country}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Buscar cidade"
          >
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={loadWeatherData}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Busca de cidade */}
      {showSearch && (
      <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Buscar cidade..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-medium">{city.name}</p>
                  <p className="text-xs text-gray-600">
                    {city.state && `${city.state}, `}{city.country}
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Clima atual */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center mb-2">
          <img 
            src={current?.iconUrl || 'https://openweathermap.org/img/wn/01d@2x.png'} 
            alt={current?.description || 'Clima'}
            className="w-16 h-16"
            onError={(e) => {
              e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
            }}
          />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {current?.temperature || '--'}°C
        </div>
        <p className="text-sm text-gray-600 capitalize mb-2">
          {current?.description || 'Carregando...'}
        </p>
        <p className="text-xs text-gray-500">
          Sensação térmica: {current?.feelsLike || '--'}°C
        </p>
        </div>

      {/* Detalhes do clima */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Droplets className="w-4 h-4 text-blue-600" />
              <div>
            <p className="font-medium">{current?.humidity || '--'}%</p>
            <p className="text-xs text-gray-600">Umidade</p>
          </div>
            </div>
        
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Wind className="w-4 h-4 text-gray-600" />
          <div>
            <p className="font-medium">{current?.windSpeed || '--'} km/h</p>
            <p className="text-xs text-gray-600">{current?.windDirection || '--'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Thermometer className="w-4 h-4 text-red-600" />
          <div>
            <p className="font-medium">{current?.pressure || '--'} hPa</p>
            <p className="text-xs text-gray-600">Pressão</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Sunrise className="w-4 h-4 text-yellow-600" />
          <div>
            <p className="font-medium">{formatTime(current?.sunrise) || '--'}</p>
            <p className="text-xs text-gray-600">Nascer</p>
          </div>
        </div>
      </div>

      {/* Previsão para 5 dias */}
      {forecast && forecast.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Previsão 5 dias</h4>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-16">
                    {day.dayName}
                  </span>
                  <img 
                    src={day?.iconUrl || 'https://openweathermap.org/img/wn/01d@2x.png'} 
                    alt={day?.description || 'Clima'}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                    }}
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {day?.temperature || '--'}°C
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {day?.description || 'Carregando...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Última atualização */}
      {lastUpdate && (
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR', { 
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
