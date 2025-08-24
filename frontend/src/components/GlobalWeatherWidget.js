import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import weatherService from '../services/weatherService';

const GlobalWeatherWidget = () => {
  const { isDark } = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getWeatherByLocation();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar clima');
      // Usar dados de fallback
      setWeather(weatherService.getFallbackWeatherData());
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed top-20 right-4 z-40 p-3 rounded-xl shadow-lg backdrop-blur-xl ${
          isDark 
            ? 'bg-gray-900/90 border border-gray-700' 
            : 'bg-white/90 border border-gray-200'
        }`}
      >
        <div className="animate-pulse text-sm text-gray-500">🌤️</div>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed top-20 right-4 z-40 p-3 rounded-xl shadow-lg backdrop-blur-xl ${
        isDark 
          ? 'bg-gray-900/90 border border-gray-700' 
          : 'bg-white/90 border border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="text-2xl">
          {getWeatherIcon(weather.icon)}
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {weather.temperature}°C
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {weather.city}
          </div>
        </div>
      </div>
      
      {/* Botão de atualizar */}
      <button
        onClick={loadWeatherData}
        className={`absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-colors ${
          isDark 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        title="Atualizar clima"
      >
        ↻
      </button>
    </motion.div>
  );
};

export default GlobalWeatherWidget;
