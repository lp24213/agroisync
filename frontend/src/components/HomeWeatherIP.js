import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Thermometer, Droplets, Wind, 
  Sun, Cloud, CloudRain, CloudLightning 
} from 'lucide-react';

const HomeWeatherIP = () => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detectar localização por IP
  const detectLocationByIP = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Tentar usar serviço de IP existente ou fallback
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        setLocation({
          city: data.city || 'Sinop',
          region: data.region || 'MT',
          country: data.country || 'BR',
          lat: data.latitude || -11.8647,
          lon: data.longitude || -55.5036
        });
        return data;
      }
    } catch (error) {
      console.log('IP detection failed, using fallback');
    }

    // Fallback para Sinop, MT
    const fallbackLocation = {
      city: 'Sinop',
      region: 'MT',
      country: 'BR',
      lat: -11.8647,
      lon: -55.5036
    };
    setLocation(fallbackLocation);
    return fallbackLocation;
  }, []);

  // Buscar dados do clima
  const fetchWeatherData = useCallback(async (lat, lon) => {
    try {
      // Simular dados de clima (em produção seria API real)
      const mockWeatherData = {
        current: {
          temp: Math.round(25 + (Math.random() - 0.5) * 10),
          temp_min: Math.round(20 + (Math.random() - 0.5) * 5),
          temp_max: Math.round(30 + (Math.random() - 0.5) * 5),
          humidity: Math.round(65 + (Math.random() - 0.5) * 20),
          wind_speed: parseFloat(12 + (Math.random() - 0.5) * 8).toFixed(1),
          description: 'céu limpo',
          icon: '01d'
        },
        location: {
          city: location?.city || 'Sinop',
          region: location?.region || 'MT',
          country: location?.country || 'BR'
        },
        lastUpdate: new Date()
      };
      
      setWeatherData(mockWeatherData);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      setError('Erro ao carregar dados do clima');
      setIsLoading(false);
    }
  }, [location]);

  // Inicializar
  useEffect(() => {
    const initWeather = async () => {
      const loc = await detectLocationByIP();
      if (loc) {
        await fetchWeatherData(loc.lat, loc.lon);
      }
    };
    
    initWeather();
  }, [detectLocationByIP, fetchWeatherData]);

  // Obter ícone do clima
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': Sun,
      '01n': Sun,
      '02d': Cloud,
      '02n': Cloud,
      '03d': Cloud,
      '03n': Cloud,
      '04d': Cloud,
      '04n': Cloud,
      '09d': CloudRain,
      '09n': CloudRain,
      '10d': CloudRain,
      '10n': CloudRain,
      '11d': CloudLightning,
      '11n': CloudLightning,
      '13d': Cloud,
      '13n': Cloud,
      '50d': Cloud,
      '50n': Cloud
    };
    return iconMap[iconCode] || Sun;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-agro-bg-secondary rounded-lg animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="w-24 h-4 bg-agro-bg-secondary rounded animate-pulse"></div>
            <div className="w-32 h-3 bg-agro-bg-secondary rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-4"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-agro-text-tertiary" />
          <div>
            <p className="text-sm text-agro-text-tertiary">Sinop - MT</p>
            <p className="text-xs text-agro-text-tertiary">Clima indisponível</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const WeatherIcon = getWeatherIcon(weatherData.current.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-4 hover:bg-agro-bg-secondary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-agro-accent-sky/20 rounded-lg">
            <WeatherIcon className="w-6 h-6 text-agro-accent-sky" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-agro-text-tertiary" />
              <p className="text-sm font-medium text-agro-text-primary">
                {weatherData.location.city} - {weatherData.location.region}
              </p>
            </div>
            <p className="text-xs text-agro-text-tertiary capitalize">
              {weatherData.current.description}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4 text-agro-accent-emerald" />
            <span className="text-lg font-bold text-agro-text-primary">
              {weatherData.current.temp}°
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-agro-text-tertiary">
            <span>{weatherData.current.temp_min}°</span>
            <span>/</span>
            <span>{weatherData.current.temp_max}°</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-agro-border-secondary">
        <div className="flex items-center justify-between text-xs text-agro-text-tertiary">
          <div className="flex items-center space-x-1">
            <Droplets className="w-3 h-3" />
            <span>{weatherData.current.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="w-3 h-3" />
            <span>{weatherData.current.wind_speed} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeWeatherIP;
