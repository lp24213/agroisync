import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
// import { useLanguage } from '../contexts/LanguageContext'
import { MapPin, Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react'

const HomeWeatherIP = () => {
  // const { t } = useLanguage(); // eslint-disable-line no-unused-vars
  const [weatherData, setWeatherData] = useState(null)
  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Detectar localização por IP
  const detectLocationByIP = useCallback(async () => {
    try {
      setIsLoading(true)

      // Tentar usar serviço de IP existente ou fallback
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        setLocation({
          city: data.city || 'Localização não detectada',
          region: data.region || 'Estado não detectado',
          country: data.country || 'BR',
          lat: data.latitude || -23.5505,
          lon: data.longitude || -46.6333
        })
        return data
      }
    } catch (error) {
      console.log('IP detection failed, using fallback')
    }

    // Fallback para São Paulo, SP
    const fallbackLocation = {
      city: 'São Paulo',
      region: 'SP',
      country: 'BR',
      lat: -23.5505,
      lon: -46.6333
    }
    setLocation(fallbackLocation)
    return fallbackLocation
  }, [])

  // Buscar dados do clima
  const fetchWeatherData = useCallback(
    async (lat, lon) => {
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
        }

        setWeatherData(mockWeatherData)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados do clima:', error)
        setError('Erro ao carregar dados do clima')
        setIsLoading(false)
      }
    },
    [location]
  )

  // Inicializar
  useEffect(() => {
    const initWeather = async () => {
      const loc = await detectLocationByIP()
      if (loc) {
        await fetchWeatherData(loc.lat, loc.lon)
      }
    }

    initWeather()
  }, [detectLocationByIP, fetchWeatherData])

  // Obter ícone do clima
  const getWeatherIcon = iconCode => {
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
    }
    return iconMap[iconCode] || Sun
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='card p-4'>
        <div className='flex items-center space-x-3'>
          <div className='bg-agro-bg-secondary h-10 w-10 animate-pulse rounded-lg'></div>
          <div className='flex-1 space-y-2'>
            <div className='bg-agro-bg-secondary h-4 w-24 animate-pulse rounded'></div>
            <div className='bg-agro-bg-secondary h-3 w-32 animate-pulse rounded'></div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error || !weatherData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='card p-4'>
        <div className='flex items-center space-x-3'>
          <MapPin className='text-agro-text-tertiary h-5 w-5' />
          <div>
            <p className='text-agro-text-tertiary text-sm'>Sinop - MT</p>
            <p className='text-agro-text-tertiary text-xs'>Clima indisponível</p>
          </div>
        </div>
      </motion.div>
    )
  }

  const WeatherIcon = getWeatherIcon(weatherData.current.icon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='card hover:bg-agro-bg-secondary/50 p-4 transition-all duration-300'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='bg-agro-accent-sky/20 rounded-lg p-2'>
            <WeatherIcon className='text-agro-accent-sky h-6 w-6' />
          </div>
          <div>
            <div className='flex items-center space-x-1'>
              <MapPin className='text-agro-text-tertiary h-4 w-4' />
              <p className='text-agro-text-primary text-sm font-medium'>
                {weatherData.location.city} - {weatherData.location.region}
              </p>
            </div>
            <p className='text-agro-text-tertiary text-xs capitalize'>{weatherData.current.description}</p>
          </div>
        </div>

        <div className='text-right'>
          <div className='flex items-center space-x-1'>
            <Thermometer className='text-agro-accent-emerald h-4 w-4' />
            <span className='text-agro-text-primary text-lg font-bold'>{weatherData.current.temp}°</span>
          </div>
          <div className='text-agro-text-tertiary flex items-center space-x-2 text-xs'>
            <span>{weatherData.current.temp_min}°</span>
            <span>/</span>
            <span>{weatherData.current.temp_max}°</span>
          </div>
        </div>
      </div>

      <div className='border-agro-border-secondary mt-3 border-t pt-3'>
        <div className='text-agro-text-tertiary flex items-center justify-between text-xs'>
          <div className='flex items-center space-x-1'>
            <Droplets className='h-3 w-3' />
            <span>{weatherData.current.humidity}%</span>
          </div>
          <div className='flex items-center space-x-1'>
            <Wind className='h-3 w-3' />
            <span>{weatherData.current.wind_speed} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HomeWeatherIP
