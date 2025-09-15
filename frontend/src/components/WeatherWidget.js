import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, Eye, Sun, Cloud, CloudRain } from 'lucide-react';
import weatherService from '../services/weatherService';

const WeatherWidget = ({ city = null }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
    
    // Atualizar dados a cada 10 minutos
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  const loadWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      
      setWeather(currentWeather);
      setForecast(forecastData);
    } catch (err) {
      setError('Erro ao carregar dados do clima');
      console.error('Erro ao carregar clima:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <Sun className="w-8 h-8 text-yellow-400" />,
      '01n': <Sun className="w-8 h-8 text-yellow-300" />,
      '02d': <Cloud className="w-8 h-8 text-gray-400" />,
      '02n': <Cloud className="w-8 h-8 text-gray-500" />,
      '03d': <Cloud className="w-8 h-8 text-gray-500" />,
      '03n': <Cloud className="w-8 h-8 text-gray-600" />,
      '04d': <Cloud className="w-8 h-8 text-gray-600" />,
      '04n': <Cloud className="w-8 h-8 text-gray-700" />,
      '09d': <CloudRain className="w-8 h-8 text-blue-400" />,
      '09n': <CloudRain className="w-8 h-8 text-blue-500" />,
      '10d': <CloudRain className="w-8 h-8 text-blue-500" />,
      '10n': <CloudRain className="w-8 h-8 text-blue-600" />,
      '11d': <CloudRain className="w-8 h-8 text-purple-500" />,
      '11n': <CloudRain className="w-8 h-8 text-purple-600" />,
      '13d': <Cloud className="w-8 h-8 text-blue-200" />,
      '13n': <Cloud className="w-8 h-8 text-blue-300" />,
      '50d': <Cloud className="w-8 h-8 text-gray-400" />,
      '50n': <Cloud className="w-8 h-8 text-gray-500" />
    };
    return iconMap[iconCode] || <Sun className="w-8 h-8 text-yellow-400" />;
  };

  const getUVIndexColor = (uvIndex) => {
    if (uvIndex <= 2) return '#39FF14'; // Verde neon - baixo
    if (uvIndex <= 5) return '#FFD700'; // Amarelo - moderado
    if (uvIndex <= 7) return '#FF8C00'; // Laranja - alto
    if (uvIndex <= 10) return '#FF4500'; // Vermelho - muito alto
    return '#8B0000'; // Vermelho escuro - extremo
  };

  if (isLoading) {
    return (
      <div className="txc-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="txc-card p-6 text-center">
        <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{error || 'Erro ao carregar dados do clima'}</p>
      </div>
    );
  }

  return (
    <div className="txc-card p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{weather.city}, {weather.country}</span>
          </div>
          <div className="text-xs text-gray-500">
            Atualizado: {new Date(weather.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Temperatura Principal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.icon)}
            <div>
              <div className="text-4xl font-bold text-white">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-gray-400 capitalize">
                {weather.description}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Sensação: {weather.feelsLike}°C
            </div>
            <div className="text-sm text-gray-400">
              UV: <span style={{ color: getUVIndexColor(weather.uvIndex) }}>
                {weather.uvIndex}
              </span>
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              Umidade: {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Vento: {weather.windSpeed} km/h
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Visibilidade: {weather.visibility} km
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              Pressão: {weather.pressure} hPa
            </span>
          </div>
        </div>

        {/* Previsão */}
        {forecast.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Previsão</h4>
            <div className="grid grid-cols-3 gap-3">
              {forecast.slice(0, 3).map((day, index) => (
                <motion.div
                  key={index}
                  className="text-center p-3 bg-gray-800 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs text-gray-400 mb-2">
                    {day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  {getWeatherIcon(day.icon)}
                  <div className="text-sm font-semibold text-white mt-2">
                    {day.maxTemp}°
                  </div>
                  <div className="text-xs text-gray-400">
                    {day.minTemp}°
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WeatherWidget;