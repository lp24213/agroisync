import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Thermometer, Droplets, Wind, Sun, Moon } from 'lucide-react';
import weatherService from '../services/weatherService';

const GlobalWeatherWidget = () => {
  const { isDark } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

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
        className={`relative z-50 p-4 rounded-2xl shadow-xl transition-all duration-300 ${
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

  // Funções de drag-and-drop
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        
        // Limitar movimento dentro da tela
        const maxX = window.innerWidth - 160;
        const maxY = window.innerHeight - 120;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX - position.x;
    const startY = touch.clientY - position.y;
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - startX;
      const newY = touch.clientY - startY;
      
      // Limitar movimento dentro da tela
      const maxX = window.innerWidth - 160;
      const maxY = window.innerHeight - 120;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 50,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`transition-all duration-300 ${
        expanded ? 'w-80' : 'w-40'
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
            {weatherData.current.temp}°C
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sensação: {weatherData.current.feels_like}°C
          </div>
        </div>

        {/* Condições do Tempo */}
        <div className="flex items-center justify-center mb-3">
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto mb-1 ${
              isDark ? 'text-cyan-400' : 'text-green-600'
            }`}>
              {weatherData.current.icon === 'sun' ? (
                <Sun className="w-full h-full" />
              ) : (
                <Moon className="w-full h-full" />
              )}
            </div>
            <div className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {weatherData.current.description}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Droplets className={`w-3 h-3 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {weatherData.current.humidity}%
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className={`w-3 h-3 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {weatherData.current.wind_speed} km/h
            </span>
          </div>
        </div>

        {/* Indicador de Expansão */}
        <div className="text-center mt-2">
          <div className={`w-1 h-1 rounded-full mx-auto ${
            isDark ? 'bg-cyan-400' : 'bg-green-500'
          }`}></div>
        </div>
      </motion.div>

      {/* Widget Expandido */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mt-4 p-4 rounded-2xl shadow-xl ${
            isDark
              ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700'
              : 'bg-white/90 backdrop-blur-xl border border-gray-200'
          }`}
        >
          {/* Previsão para os Próximos Dias */}
          <h4 className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Previsão 5 Dias
          </h4>
          
          <div className="space-y-2">
            {weatherData.forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {day.date}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {day.temp_min}°C
                  </span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {day.temp_max}°C
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Última Atualização */}
          <div className="mt-3 pt-3 border-t border-gray-600 dark:border-gray-600">
            <p className={`text-xs text-center ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Atualizado: {formatTime(new Date())}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GlobalWeatherWidget;
