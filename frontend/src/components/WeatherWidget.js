import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Cloud } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const WeatherWidget = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('Sinop - MT');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const detectLocationByIP = async () => {
      try {
        // Detectar localização por IP
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        if (ipData.city && ipData.region) {
          setUserLocation(`${ipData.city} - ${ipData.region}`);
        }
      } catch (error) {
        console.log('Não foi possível detectar localização por IP, usando padrão');
        setUserLocation('Sinop - MT');
      }
    };

    detectLocationByIP();
  }, []);

  useEffect(() => {
    // Dados mockados do clima (em produção, usar API real)
    const conditions = [
      { key: 'sunny', icon: '☀️' },
      { key: 'partly-cloudy', icon: '⛅' },
      { key: 'cloudy', icon: '☁️' }
    ];
    const randomCondition = conditions[Math.floor(Math.random() * 3)];
    
    const mockWeather = {
      location: userLocation,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: t(`weather.conditions.${randomCondition.key}`),
      icon: randomCondition.icon,
      description: t('weather.description')
    };

    const loadWeather = async () => {
      try {
        // Em produção, usar API real de clima com localização detectada
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${API_KEY}`);
        // const data = await response.json();
        
        // Por enquanto, usar dados mockados
        setTimeout(() => {
          setWeather(mockWeather);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error('Erro ao carregar dados do clima:', error);
        setWeather(mockWeather);
        setIsLoading(false);
      }
    };

    loadWeather();
    
    // Atualizar dados a cada 10 minutos
    const interval = setInterval(loadWeather, 600000);
    
    return () => clearInterval(interval);
  }, [userLocation, t]);

  if (isLoading) {
    return (
      <div className="weather-widget">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className={`animate-pulse rounded h-4 w-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <div className={`animate-pulse rounded h-4 w-20 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <div className={`animate-pulse rounded h-4 w-16 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      className="weather-widget"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`flex items-center gap-4 text-sm px-4 py-2 rounded-lg border shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-green-600" />
          <span className={`font-medium text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{weather.location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg">{weather.icon}</span>
          <div className="flex items-center gap-1">
            <Thermometer size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            <span className={`font-semibold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{weather.temperature}°C</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Cloud size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{weather.condition}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
