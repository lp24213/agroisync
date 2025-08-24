import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import weatherService from '../services/weatherService';

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
        weatherData = await weatherService.getWeatherByLocation();
      } else {
        weatherData = await weatherService.getWeatherByLocation();
      }

      setWeather(weatherData);

      if (showForecast) {
        const forecastData = await weatherService.getForecast(
          weatherData.coords.lat,
          weatherData.coords.lon
        );
        setForecast(forecastData);
      }
    } catch (err) {
      setError('Erro ao carregar dados do clima');
      console.error('Erro no widget de clima:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌡️';
  };

  const formatTime = (date) => {
    return new Date(date * 1000).toLocaleTimeString('pt-BR', {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 border-2 rounded-full border-t-transparent animate-spin ${
            isDark ? 'border-cyan-400' : 'border-green-500'
          }`} />
          <span className={`ml-3 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando clima...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">🌤️</div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Clima indisponível
          </p>
          <button
            onClick={loadWeatherData}
            className={`mt-3 px-4 py-2 rounded-lg text-sm transition-colors ${
              isDark
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    );
  }

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
            Clima Local
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {weather.city}, {weather.country}
          </p>
        </div>
        <button
          onClick={loadWeatherData}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
              : 'text-gray-500 hover:text-green-600 hover:bg-green-500/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Temperatura atual */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{getWeatherIcon(weather.icon)}</div>
        <div className={`text-4xl font-bold ${getTemperatureColor(weather.temperature)}`}>
          {Math.round(weather.temperature)}°C
        </div>
        <p className={`text-lg ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {weather.description}
        </p>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
        }`}>
          <div className="text-2xl mb-1">💧</div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Umidade
          </p>
          <p className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {weather.humidity}%
          </p>
        </div>
        <div className={`text-center p-3 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
        }`}>
          <div className="text-2xl mb-1">💨</div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Vento
          </p>
          <p className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {weather.windSpeed} km/h
          </p>
        </div>
      </div>

      {/* Previsão de 3 dias */}
      {showForecast && forecast && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Previsão 3 dias
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {forecast.slice(0, 3).map((day, index) => (
              <div key={index} className={`text-center p-2 rounded-lg ${
                isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
              }`}>
                <div className="text-lg mb-1">{getWeatherIcon(day.icon)}</div>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className={`text-sm font-semibold ${getTemperatureColor(day.temp)}`}>
                  {Math.round(day.temp)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;
