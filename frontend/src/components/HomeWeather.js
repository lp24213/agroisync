import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

const HomeWeather = () => {
  const { isEnabled, getValue } = useFeatureFlags();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('São Paulo, SP');

  // Mock data para clima
  const mockWeatherData = {
    current: {
      temp: 24,
      feels_like: 26,
      humidity: 65,
      wind_speed: 12,
      condition: 'Parcialmente nublado',
      icon: 'cloud-sun'
    },
    forecast: [
      { day: 'Hoje', temp: 24, condition: 'cloud-sun' },
      { day: 'Amanhã', temp: 26, condition: 'sun' },
      { day: 'Qui', temp: 22, condition: 'cloud-rain' },
      { day: 'Sex', temp: 25, condition: 'cloud' }
    ]
  };

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          setLocation('São Paulo, SP');
          return;
        }

        // TODO: Implementar detecção real de IP
        // Por enquanto, usar São Paulo como padrão
        setLocation('São Paulo, SP');
      } catch (error) {
        console.error('Erro ao detectar localização:', error);
        setLocation('São Paulo, SP');
      }
    };

    const fetchWeatherData = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          setWeatherData(mockWeatherData);
        } else {
          // TODO: Implementar chamada real para API de clima
          // Por enquanto, usar mock como fallback
          setWeatherData(mockWeatherData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do clima:', error);
        setWeatherData(mockWeatherData);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
    fetchWeatherData();

    // Atualizar clima a cada 30 minutos
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isEnabled]);

  const getWeatherIcon = (condition) => {
    const icons = {
      'sun': Sun,
      'cloud': Cloud,
      'cloud-sun': Cloud,
      'cloud-rain': CloudRain,
      'wind': Wind
    };
    return icons[condition] || Sun;
  };

  const getWeatherColor = (condition) => {
    const colors = {
      'sun': 'text-amber-400',
      'cloud': 'text-neutral-400',
      'cloud-sun': 'text-sky-400',
      'cloud-rain': 'text-blue-400',
      'wind': 'text-gray-400'
    };
    return colors[condition] || 'text-neutral-400';
  };

  if (!isEnabled('FEATURE_HOME_GRAINS')) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-neutral-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-100">
          Clima
        </h3>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">
            {location}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-20 h-6 bg-neutral-800 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-neutral-800 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="w-8 h-4 bg-neutral-800 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-neutral-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Clima atual */}
          <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-white/5">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sky-500/20 rounded-xl">
                {React.createElement(getWeatherIcon(weatherData.current.icon), {
                  className: `w-8 h-8 ${getWeatherColor(weatherData.current.icon)}`
                })}
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-100">
                  {weatherData.current.temp}°C
                </div>
                <div className="text-sm text-neutral-400">
                  {weatherData.current.condition}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-1 text-xs text-neutral-400">
                <Thermometer className="w-3 h-3" />
                <span>Sens. {weatherData.current.feels_like}°C</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-neutral-400">
                <Wind className="w-3 h-3" />
                <span>{weatherData.current.wind_speed} km/h</span>
              </div>
              <div className="text-xs text-neutral-400">
                {weatherData.current.humidity}% umidade
              </div>
            </div>
          </div>

          {/* Previsão */}
          <div className="grid grid-cols-4 gap-3">
            {weatherData.forecast.map((day, index) => {
              const Icon = getWeatherIcon(day.condition);
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 bg-neutral-900/30 rounded-lg border border-white/5"
                >
                  <div className="text-xs text-neutral-400 mb-1">
                    {day.day}
                  </div>
                  <div className="flex justify-center mb-1">
                    <Icon className={`w-5 h-5 ${getWeatherColor(day.condition)}`} />
                  </div>
                  <div className="text-sm font-medium text-neutral-100">
                    {day.temp}°
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-neutral-400 text-center">
          Dados meteorológicos atualizados
        </p>
      </div>
    </motion.div>
  );
};

export default HomeWeather;
