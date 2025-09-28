import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Thermometer, Droplets, Wind, 
  Sunrise, Sunset, RefreshCw
} from 'lucide-react';

const CompactWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    loadWeatherData();
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      // Detectar localização real via IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.city && data.region) {
        setUserLocation(`${data.city}, ${data.region}`);
      } else {
        setUserLocation('São Paulo, SP');
      }
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      setUserLocation('São Paulo, SP');
    }
  };

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Detectar localização real via IP
      const response = await fetch('https://ipapi.co/json/');
      const locationData = await response.json();
      
      let city = 'São Paulo';
      let region = 'SP';
      
      if (locationData.city && locationData.region) {
        city = locationData.city;
        region = locationData.region;
      }
      
      // Simular dados de clima baseados na localização real
      const getRegionalWeather = (region) => {
        const weatherData = {
          'Mato Grosso': { temp: 32, desc: 'Ensolarado', humidity: 45, wind: 8, feels: 35 },
          'Paraná': { temp: 28, desc: 'Parcialmente nublado', humidity: 65, wind: 12, feels: 30 },
          'Rio Grande do Sul': { temp: 25, desc: 'Nublado', humidity: 70, wind: 15, feels: 27 },
          'Goiás': { temp: 30, desc: 'Ensolarado', humidity: 50, wind: 10, feels: 32 },
          'Bahia': { temp: 29, desc: 'Parcialmente nublado', humidity: 60, wind: 11, feels: 31 },
          'Minas Gerais': { temp: 27, desc: 'Parcialmente nublado', humidity: 68, wind: 13, feels: 29 },
          'São Paulo': { temp: 28, desc: 'Parcialmente nublado', humidity: 65, wind: 12, feels: 30 },
          'Rio de Janeiro': { temp: 29, desc: 'Ensolarado', humidity: 62, wind: 10, feels: 31 },
          'Santa Catarina': { temp: 24, desc: 'Nublado', humidity: 72, wind: 16, feels: 26 },
          'Espírito Santo': { temp: 28, desc: 'Parcialmente nublado', humidity: 67, wind: 12, feels: 30 },
          'default': { temp: 28, desc: 'Parcialmente nublado', humidity: 65, wind: 12, feels: 30 }
        };
        
        return weatherData[region] || weatherData['default'];
      };
      
      const regionalWeather = getRegionalWeather(region);
      
      const mockWeatherData = {
        location: `${city}, ${region}`,
        current: {
          temperature: regionalWeather.temp,
          description: regionalWeather.desc,
          humidity: regionalWeather.humidity,
          windSpeed: regionalWeather.wind,
          windDirection: 'NE',
          pressure: 1013,
          feelsLike: regionalWeather.feels,
          sunrise: '06:15',
          sunset: '18:45',
          iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png'
        }
      };
      
      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      // Fallback com dados do MT
      const fallbackWeatherData = {
        location: 'Sinop, MT',
        current: {
          temperature: 32,
          description: 'Ensolarado',
          humidity: 45,
          windSpeed: 8,
          windDirection: 'NE',
          pressure: 1013,
          feelsLike: 35,
          sunrise: '06:15',
          sunset: '18:45',
          iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png'
        }
      };
      setWeatherData(fallbackWeatherData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-3 shadow-sm border">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { location, current } = weatherData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-3 shadow-sm border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900">Clima</h3>
        </div>
        <button
          onClick={loadWeatherData}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Clima atual compacto */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <img 
            src={current?.iconUrl || 'https://openweathermap.org/img/wn/01d@2x.png'} 
            alt={current?.description || 'Clima'}
            className="w-6 h-6"
            onError={(e) => {
              e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png';
            }}
          />
        </div>
        <div className="text-sm font-bold text-gray-900 mb-1">
          {current?.temperature || '--'}°C
        </div>
        <p className="text-xs text-gray-600 capitalize mb-1">
          {current?.description || 'Carregando...'}
        </p>
        <p className="text-xs text-gray-500">
          {location}
        </p>
      </div>

      {/* Detalhes compactos */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-gray-600" />
          <span>{current?.humidity || '--'}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-gray-600" />
          <span>{current?.windSpeed || '--'} km/h</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactWeatherWidget;
