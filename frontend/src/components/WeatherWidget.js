import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Cloud } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('Sinop - MT');

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
    const mockWeather = {
      location: userLocation,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ['Ensolarado', 'Parcialmente nublado', 'Nublado'][Math.floor(Math.random() * 3)],
      icon: ['☀️', '⛅', '☁️'][Math.floor(Math.random() * 3)],
      description: 'Clima atualizado automaticamente'
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
  }, [userLocation]);

  if (isLoading) {
    return (
      <div className="weather-widget">
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-card rounded-lg border border-border-light">
          <div className="animate-pulse bg-gray-200 rounded h-4 w-4"></div>
          <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
          <div className="animate-pulse bg-gray-200 rounded h-4 w-16"></div>
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
      <div className="flex items-center gap-4 text-sm px-4 py-2 bg-gradient-card rounded-lg border border-border-light shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary" />
          <span className="font-medium text-primary text-xs">{weather.location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg">{weather.icon}</span>
          <div className="flex items-center gap-1">
            <Thermometer size={14} className="text-muted" />
            <span className="font-semibold text-primary text-xs">{weather.temperature}°C</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Cloud size={14} className="text-muted" />
          <span className="text-muted text-xs">{weather.condition}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
