import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import weatherService from '../../services/weatherService';
import { motion } from 'framer-motion';

const WeatherWidget = ({ location = null, showForecast = false }) => {
  const { isDark } = useTheme();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      let weatherData;
      if (location) {
        weatherData = await weatherService.getWeatherByCity(location);
      } else {
        weatherData = await weatherService.getWeatherByLocation();
      }

      setWeather(weatherData);

      if (showForecast) {
        const forecastData = await weatherService.getForecast(
          weatherData.location.lat,
          weatherData.location.lon
        );
        setForecast(forecastData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      setError('Não foi possível carregar os dados do clima');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return weatherService.getWeatherIcon(iconCode, '2x');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 20) return 'text-orange-500';
    if (temp >= 10) return 'text-yellow-500';
    return 'text-blue-500';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando clima...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {error}
          </p>
          <button
            onClick={loadWeatherData}
            className={`mt-3 px-4 py-2 text-xs rounded-lg transition-colors duration-300 ${
              isDark
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
            }`}
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl ${
        isDark 
          ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
          : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {weather.location.name}
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {weather.location.country}
          </p>
        </div>
        <button
          onClick={loadWeatherData}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            isDark
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20'
              : 'text-gray-500 hover:text-green-600 hover:bg-green-500/20'
          }`}
          title="Atualizar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Clima Atual */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <img
            src={getWeatherIcon(weather.current.icon)}
            alt={weather.current.description}
            className="w-16 h-16"
          />
        </div>
        
        <div className={`text-4xl font-bold mb-2 ${getTemperatureColor(weather.current.temperature)}`}>
          {weather.current.temperature}°C
        </div>
        
        <p className={`text-lg mb-1 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {weatherService.getWeatherDescription(weather.current.description)}
        </p>
        
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Sensação de {weather.current.feelsLike}°C
        </p>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDark ? 'text-cyan-400' : 'text-green-600'
          }`}>
            {weather.current.humidity}%
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Umidade
          </div>
        </div>
        
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDark ? 'text-cyan-400' : 'text-green-600'
          }`}>
            {weather.current.windSpeed} km/h
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Vento {weather.current.windDirection}
          </div>
        </div>
      </div>

      {/* Sol */}
      <div className={`flex items-center justify-between p-3 rounded-lg ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">☀️</span>
          <span className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nascer
          </span>
        </div>
        <span className={`text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {formatTime(weather.sunrise)}
        </span>
      </div>
      
      <div className={`flex items-center justify-between p-3 rounded-lg mt-2 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-orange-500">🌅</span>
          <span className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Pôr
          </span>
        </div>
        <span className={`text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {formatTime(weather.sunset)}
        </span>
      </div>

      {/* Previsão (se habilitada) */}
      {showForecast && forecast && (
        <div className="mt-6">
          <h4 className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Próximos Dias
          </h4>
          
          <div className="space-y-2">
            {forecast.daily.slice(1, 4).map((day, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDark ? 'bg-gray-800/30' : 'bg-gray-100/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.description}
                    className="w-8 h-8"
                  />
                  <div>
                    <div className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {day.description}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${getTemperatureColor(day.maxTemp)}`}>
                    {day.maxTemp}°
                  </div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {day.minTemp}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atualização */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Atualizado às {weather.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
