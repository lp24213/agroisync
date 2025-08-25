import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, MapPin, Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const GlobalWeatherWidget = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Verificar se o widget foi fechado anteriormente
    const widgetClosed = localStorage.getItem('weatherWidgetClosed');
    if (widgetClosed === 'true') {
      setIsVisible(false);
    }

    // Carregar dados iniciais
    loadWeatherData();
    loadNewsData();
  }, []);

  const loadWeatherData = async () => {
    try {
      // Simular dados de clima (substituir por API real)
      const mockWeather = {
        location: 'São Paulo, SP',
        temperature: 24,
        feelsLike: 26,
        humidity: 65,
        windSpeed: 12,
        condition: 'partly-cloudy',
        description: 'Parcialmente nublado'
      };
      setWeather(mockWeather);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
    }
  };

  const loadNewsData = async () => {
    try {
      // Simular dados de notícias (substituir por RSS real)
      const mockNews = [
        {
          id: 1,
          title: 'Preços da soja sobem no mercado internacional',
          summary: 'Commodity registra alta de 2,5% na bolsa de Chicago',
          timestamp: '2h atrás'
        },
        {
          id: 2,
          title: 'Nova tecnologia de irrigação aumenta produtividade',
          summary: 'Sistema inteligente reduz consumo de água em 30%',
          timestamp: '4h atrás'
        },
        {
          id: 3,
          title: 'Exportações agrícolas batem recorde em janeiro',
          summary: 'Setor registra crescimento de 15% em relação ao ano anterior',
          timestamp: '6h atrás'
        }
      ];
      setNews(mockNews);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('weatherWidgetClosed', 'true');
  };

  const handleDragEnd = (event, info) => {
    setPosition({ x: info.point.x, y: info.point.y });
    setIsDragging(false);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'stormy':
        return <CloudLightning className="w-6 h-6 text-purple-500" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      ref={widgetRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`w-80 ${isDark ? 'bg-dark-bg-card' : 'bg-light-bg-card'} rounded-xl shadow-lg border ${
        isDark ? 'border-dark-border-primary' : 'border-light-border-primary'
      } backdrop-blur-md`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-dark-border-primary' : 'border-light-border-primary'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Clima & Notícias
          </h3>
          <button
            onClick={handleClose}
            className={`p-1 rounded-full hover:bg-opacity-20 ${
              isDark ? 'hover:bg-white text-white' : 'hover:bg-gray-900 text-gray-600'
            } transition-colors duration-200`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weather Section */}
      {weather && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {weather.location}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {weather.temperature}°C
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {weather.description}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Sensação: {weather.feelsLike}°C
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {weather.humidity}%
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Wind className="w-4 h-4 text-gray-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {weather.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Section */}
      <div className="p-4">
        <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Últimas Notícias
        </h4>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className={`h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2`}></div>
                <div className={`h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark 
                    ? 'hover:bg-dark-bg-card-hover border border-dark-border-primary' 
                    : 'hover:bg-light-bg-card-hover border border-light-border-primary'
                }`}
              >
                <h5 className={`font-medium text-sm mb-1 line-clamp-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h5>
                <p className={`text-xs mb-2 line-clamp-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.summary}
                </p>
                <span className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalWeatherWidget;
