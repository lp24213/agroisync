import React, { useState, useEffect } from 'react';
// Removido LocalWeatherCSVViewer - apenas dados reais
import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, RefreshCw, Thermometer } from 'lucide-react';
import weatherService from '../services/weatherService';
import { useAnalytics } from '../hooks/useAnalytics';

const CompactWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const analytics = useAnalytics();

  useEffect(() => {
    loadWeatherData();

    // Atualizar automaticamente a cada 10 minutos
    const interval = setInterval(() => {
      loadWeatherData(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadWeatherData = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      // Detectar localização do usuário com fallback robusto
      let location = userLocation;
      if (!location) {
        try {
          location = await weatherService.getUserLocation();
          setUserLocation(location);
        } catch (locError) {
          // Fallback para localização padrão
          location = {
            lat: -15.6014,
            lon: -56.0979,
            city: 'Cuiabá',
            state: 'MT',
            country: 'BR',
            method: 'default'
          };
          setUserLocation(location);
        }
      }

      // Garantir que location tem coordenadas válidas
      if (!location || !location.lat || !location.lon) {
        location = {
          lat: -15.6014,
          lon: -56.0979,
          city: 'Cuiabá',
          state: 'MT',
          country: 'BR',
          method: 'default'
        };
        setUserLocation(location);
      }

      // Buscar clima da localização detectada (sempre dados frescos)
      const weather = await weatherService.getCurrentWeatherFresh(
        location.lat,
        location.lon,
        location.city
      );

      setWeatherData(weather);
      setLastUpdate(new Date());

      // Rastrear consulta de clima
      if (weather && weather.temperature && analytics) {
        try {
          analytics.trackWeatherCheck(
            location.city || weather.city,
            weather.temperature
          );
        } catch (err) {
          // Ignorar erro de analytics
        }
      }
    } catch (error) {
      // Silenciar erro em produção
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao carregar clima:', error);
      }
      setWeatherData(null);
      setLastUpdate(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return 'https://openweathermap.org/img/wn/01d@2x.png';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='rounded-lg border bg-white p-3 shadow-sm'
      >
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <MapPin className='h-3 w-3 text-gray-600' />
            <h3 className='text-xs font-semibold text-gray-900'>Clima</h3>
          </div>
          <div className='animate-spin'>
            <RefreshCw className='h-3 w-3 text-gray-500' />
          </div>
        </div>
        <div className='animate-pulse space-y-2'>
          <div className='h-6 bg-gray-200 rounded'></div>
          <div className='h-4 bg-gray-200 rounded'></div>
          <div className='h-3 bg-gray-200 rounded'></div>
        </div>
      </motion.div>
    );
  }

  if (!weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='rounded-lg border bg-white p-3 shadow-sm'
      >
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <MapPin className='h-3 w-3 text-gray-600' />
            <h3 className='text-xs font-semibold text-gray-900'>Clima</h3>
          </div>
        </div>
        <div className='text-center text-xs text-gray-500 py-2'>
          Carregando dados climáticos...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-lg border bg-white p-3 shadow-sm'
    >
      {/* Header */}
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <MapPin className='h-3 w-3 text-gray-600' />
          <h3 className='text-xs font-semibold text-gray-900'>Clima</h3>
        </div>
        <button
          onClick={() => loadWeatherData()}
          className='p-1 text-gray-500 transition-colors hover:text-gray-700'
        >
          <RefreshCw className='h-3 w-3' />
        </button>
      </div>

      {/* Clima atual compacto */}
      <div className='text-center'>
        <div className='mb-1 flex items-center justify-center'>
          <img
            src={getWeatherIcon(weatherData.icon)}
            alt={weatherData.description}
            className='h-6 w-6'
            onError={e => {
              e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
            }}
          />
        </div>
        <div className='mb-1 text-sm font-bold text-gray-900'>{weatherData.temperature}°C</div>
        <p className='mb-1 text-xs capitalize text-gray-600'>{weatherData.description}</p>
        <p className='text-xs text-gray-500'>
          {userLocation ? `${userLocation.city}, ${userLocation.state}` : weatherData.city}
        </p>
      </div>

      {/* Detalhes compactos */}
      <div className='mt-2 grid grid-cols-2 gap-2 text-xs'>
        <div className='flex items-center gap-1'>
          <Droplets className='h-3 w-3 text-blue-500' />
          <span>{weatherData.humidity !== null ? `${weatherData.humidity}%` : 'N/A'}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Wind className='h-3 w-3 text-gray-600' />
          <span>{weatherData.wind_speed} km/h</span>
        </div>
      </div>

      {/* Última atualização */}
      {lastUpdate && (
        <div className='mt-2 pt-2 border-t border-gray-100'>
          <p className='text-xs text-gray-400 text-center'>
            Atualizado {lastUpdate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CompactWeatherWidget;
