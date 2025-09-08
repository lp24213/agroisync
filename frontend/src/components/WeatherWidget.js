import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react'

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [location] = useState('Sinop - MT')

  useEffect(() => {
    // Dados mockados do clima (em produção, usar API real)
    const mockWeather = {
      location: 'Sinop - MT',
      temperature: 28,
      condition: 'Ensolarado',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      icon: '☀️',
      description: 'Parcialmente nublado'
    }

    const loadWeather = async () => {
      try {
        // Em produção, usar API real de clima
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`)
        // const data = await response.json()

        // Por enquanto, usar dados mockados
        setTimeout(() => {
          setWeather(mockWeather)
          setIsLoading(false)
        }, 600)
      } catch (error) {
        console.error('Erro ao carregar dados do clima:', error)
        setWeather(mockWeather)
        setIsLoading(false)
      }
    }

    loadWeather()

    // Atualizar dados a cada 10 minutos
    const interval = setInterval(loadWeather, 600000)

    return () => clearInterval(interval)
  }, [location])

  if (isLoading) {
    return (
      <div className='weather-widget'>
        <div className='flex items-center gap-3'>
          <div className='h-4 w-4 animate-pulse rounded bg-gray-200'></div>
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <motion.div
      className='weather-widget'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <MapPin size={14} className='text-primary' />
          <span className='text-primary font-medium'>{weather.location}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-2xl'>{weather.icon}</span>
          <div className='flex items-center gap-1'>
            <Thermometer size={14} className='text-secondary' />
            <span className='text-primary font-semibold'>{weather.temperature}°C</span>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <Droplets size={14} className='text-secondary' />
          <span className='text-secondary'>{weather.humidity}%</span>
        </div>

        <div className='flex items-center gap-1'>
          <Wind size={14} className='text-secondary' />
          <span className='text-secondary'>{weather.windSpeed} km/h</span>
        </div>

        <div className='flex items-center gap-1'>
          <Eye size={14} className='text-secondary' />
          <span className='text-secondary'>{weather.visibility} km</span>
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherWidget
