import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Droplets, Wind, Sunrise, Sunset, RefreshCw, Search, X } from 'lucide-react'
import weatherService from '../services/weatherService'

const GlobalWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await weatherService.getCompleteWeather()
      setWeatherData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error)
      setError('Erro ao carregar dados do clima')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async query => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      const results = await weatherService.searchCity(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Erro na busca:', error)
      setSearchResults([])
    }
  }

  const handleCitySelect = async city => {
    try {
      setLoading(true)
      setError('')

      const currentWeather = await weatherService.getCurrentWeather(city.lat, city.lon)
      const forecast = await weatherService.getForecast(city.lat, city.lon)

      setWeatherData({
        location: {
          city: city.name,
          region: city.state,
          country: city.country,
          latitude: city.lat,
          longitude: city.lon
        },
        current: currentWeather,
        forecast
      })

      setSearchQuery('')
      setSearchResults([])
      setShowSearch(false)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao carregar clima da cidade:', error)
      setError('Erro ao carregar clima da cidade')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = timeString => {
    if (!timeString) return ''
    return timeString
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        <span className='ml-3 text-sm text-gray-600'>Carregando clima...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-8 text-center'>
        <p className='mb-4 text-red-600'>{error}</p>
        <button
          onClick={loadWeatherData}
          className='rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700'
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  const { location, current, forecast } = weatherData

  return (
    <div className='space-y-4'>
      {/* Header com localização e busca */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <MapPin className='h-4 w-4 text-blue-600' />
          <div>
            <p className='font-semibold text-gray-900'>{location.city}</p>
            <p className='text-xs text-gray-600'>
              {location.region && `${location.region}, `}
              {location.country}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className='rounded p-1 transition-colors hover:bg-gray-100'
            title='Buscar cidade'
          >
            <Search className='h-4 w-4 text-gray-600' />
          </button>
          <button
            onClick={loadWeatherData}
            className='rounded p-1 transition-colors hover:bg-gray-100'
            title='Atualizar'
          >
            <RefreshCw className='h-4 w-4 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Busca de cidade */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-2'
        >
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              placeholder='Buscar cidade...'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={() => setShowSearch(false)}
              className='absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-gray-100'
            >
              <X className='h-3 w-3 text-gray-500' />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className='max-h-32 overflow-y-auto rounded-lg border border-gray-200'>
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className='w-full border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50'
                >
                  <p className='font-medium'>{city.name}</p>
                  <p className='text-xs text-gray-600'>
                    {city.state && `${city.state}, `}
                    {city.country}
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Clima atual */}
      <div className='py-4 text-center'>
        <div className='mb-2 flex items-center justify-center'>
          <img src={current.iconUrl} alt={current.description} className='h-16 w-16' />
        </div>
        <div className='mb-1 text-3xl font-bold text-gray-900'>{current.temperature}°C</div>
        <p className='mb-2 text-sm capitalize text-gray-600'>{current.description}</p>
        <p className='text-xs text-gray-500'>Sensação térmica: {current.feelsLike}°C</p>
      </div>

      {/* Detalhes do clima */}
      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div className='flex items-center space-x-2 rounded-lg bg-gray-50 p-2'>
          <Droplets className='h-4 w-4 text-blue-600' />
          <div>
            <p className='font-medium'>{current.humidity}%</p>
            <p className='text-xs text-gray-600'>Umidade</p>
          </div>
        </div>

        <div className='flex items-center space-x-2 rounded-lg bg-gray-50 p-2'>
          <Wind className='h-4 w-4 text-gray-600' />
          <div>
            <p className='font-medium'>{current.windSpeed} km/h</p>
            <p className='text-xs text-gray-600'>{current.windDirection}</p>
          </div>
        </div>

        <div className='flex items-center space-x-2 rounded-lg bg-gray-50 p-2'>
          <Thermometer className='h-4 w-4 text-red-600' />
          <div>
            <p className='font-medium'>{current.pressure} hPa</p>
            <p className='text-xs text-gray-600'>Pressão</p>
          </div>
        </div>

        <div className='flex items-center space-x-2 rounded-lg bg-gray-50 p-2'>
          <Sunrise className='h-4 w-4 text-yellow-600' />
          <div>
            <p className='font-medium'>{formatTime(current.sunrise)}</p>
            <p className='text-xs text-gray-600'>Nascer</p>
          </div>
        </div>
      </div>

      {/* Previsão para 5 dias */}
      {forecast && forecast.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-semibold text-gray-900'>Previsão 5 dias</h4>
          <div className='space-y-2'>
            {forecast.map((day, index) => (
              <div key={index} className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
                <div className='flex items-center space-x-3'>
                  <span className='w-16 text-sm font-medium text-gray-900'>{day.dayName}</span>
                  <img src={day.iconUrl} alt={day.description} className='h-8 w-8' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-gray-900'>{day.temperature}°C</p>
                  <p className='text-xs capitalize text-gray-600'>{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Última atualização */}
      {lastUpdate && (
        <div className='border-t border-gray-200 pt-2 text-center'>
          <p className='text-xs text-gray-500'>
            Última atualização:{' '}
            {lastUpdate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default GlobalWeatherWidget
