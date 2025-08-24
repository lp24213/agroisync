import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Thermometer, Droplets, Wind, Sun, Moon } from 'lucide-react';
import weatherService from '../services/weatherService';

const GlobalWeatherWidget = () => {
  const { isDark } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadWeatherData();
    
    // Atualizar a cada 10 minutos
    const interval = setInterval(loadWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getWeatherByLocation();
      setWeatherData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      // Usar dados de fallback
      setWeatherData(weatherService.getFallbackWeatherData());
    } finally {
      setLoading(false);
    }
  };

  if (loading || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed top-32 right-6 z-40 p-4 rounded-2xl shadow-xl transition-all duration-300 ${
          isDark
            ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200'
        }`}
      >
        <div className="animate-pulse">
          <div className="w-32 h-20 bg-gray-300 rounded-lg"></div>
        </div>
      </motion.div>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed top-32 right-6 z-40 transition-all duration-300 ${
        expanded ? 'w-80' : 'w-40'
      }`}
    >
      {/* Widget Compacto */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-2xl shadow-xl cursor-pointer transition-all duration-300 ${
          isDark
            ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700 hover:border-cyan-400'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-green-500'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Localização */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className={`w-4 h-4 ${
            isDark ? 'text-cyan-400' : 'text-green-600'
          }`} />
          <div className="text-xs">
            <div className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {weatherData.location.city}
            </div>
            <div className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {weatherData.location.state}
            </div>
          </div>
        </div>

        {/* Temperatura Principal */}
        <div className="text-center mb-3">
          <div className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {weatherData.temperature}°C
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sensação: {weatherData.feelsLike}°C
          </div>
        </div>

        {/* Condição do Clima */}
        <div className="text-center mb-3">
          <img
            src={weatherService.getWeatherIcon(weatherData.icon)}
            alt={weatherData.description}
            className="w-12 h-12 mx-auto"
          />
          <div className={`text-xs capitalize ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {weatherData.description}
          </div>
        </div>

        {/* Detalhes Expandidos */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-3 border-t border-gray-300/30"
          >
            {/* Umidade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className={`w-4 h-4 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Umidade
                </span>
              </div>
              <span className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.humidity}%
              </span>
            </div>

            {/* Vento */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wind className={`w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Vento
                </span>
              </div>
              <span className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.windSpeed} km/h {weatherData.windDirection}
              </span>
            </div>

            {/* Pressão */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className={`w-4 h-4 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                <span className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pressão
                </span>
              </div>
              <span className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.pressure} hPa
              </span>
            </div>

            {/* Visibilidade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  isDark ? 'bg-gray-400' : 'bg-gray-600'
                }`} />
                <span className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Visibilidade
                </span>
              </div>
              <span className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.visibility} km
              </span>
            </div>

            {/* Nascer e Pôr do Sol */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center">
                <Sun className={`w-4 h-4 mx-auto mb-1 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <div className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nascer
                </div>
                <div className={`text-xs font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatTime(weatherData.sunrise)}
                </div>
              </div>
              <div className="text-center">
                <Moon className={`w-4 h-4 mx-auto mb-1 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className={`text-xs ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pôr
                </div>
                <div className={`text-xs font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatTime(weatherData.sunset)}
                </div>
              </div>
            </div>

            {/* Atualização */}
            <div className={`text-center text-xs pt-2 border-t border-gray-300/30 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Atualizado: {weatherData.timestamp.toLocaleTimeString('pt-BR')}
            </div>
          </motion.div>
        )}

        {/* Indicador de Expansão */}
        <div className={`text-center text-xs mt-2 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {expanded ? 'Clique para recolher' : 'Clique para expandir'}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlobalWeatherWidget;
