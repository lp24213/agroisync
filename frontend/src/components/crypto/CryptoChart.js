import React, { useState, useEffect, useRef, useCallback } from 'react'
// import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertCircle, 
  DollarSign, 
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react'

const CryptoChart = ({ symbol = 'BTC', timeframe = '1h' }) => {
  const [cryptoData, setCryptoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartType, setChartType] = useState('line')
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const loadCryptoData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/crypto/chart?symbol=${symbol}&timeframe=${timeframe}`)
      const data = await response.json()

      if (data.success) {
        setCryptoData(data.data)
        setPrice(data.currentPrice)
        setChange(data.change)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar dados de criptomoeda')
    } finally {
      setLoading(false)
    }
  }, [symbol, timeframe])

  const drawLineChart = useCallback((ctx, chartWidth, chartHeight, padding, minPrice, priceRange) => {
    ctx.beginPath()
    
    cryptoData.forEach((point, index) => {
      const x = padding + (index / (cryptoData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
  }, [cryptoData])

  const drawBarChart = useCallback((ctx, chartWidth, chartHeight, padding, minPrice, priceRange) => {
    const barWidth = chartWidth / cryptoData.length * 0.8
    
    cryptoData.forEach((point, index) => {
      const x = padding + (index / cryptoData.length) * chartWidth + (chartWidth / cryptoData.length - barWidth) / 2
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight
      const barHeight = ((point.price - minPrice) / priceRange) * chartHeight
      
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }, [cryptoData])

  const drawAreaChart = useCallback((ctx, chartWidth, chartHeight, padding, minPrice, priceRange) => {
    ctx.beginPath()
    
    cryptoData.forEach((point, index) => {
      const x = padding + (index / (cryptoData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    // Fechar a área
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.closePath()
    
    ctx.fill()
    ctx.stroke()
  }, [cryptoData])

  const drawChart = useCallback((ctx, width, height) => {
    if (cryptoData.length === 0) return

    const padding = 40
    const chartWidth = width - (padding * 2)
    const chartHeight = height - (padding * 2)

    // Encontrar valores mínimos e máximos
    const values = cryptoData.map(d => d.price)
    const minPrice = Math.min(...values)
    const maxPrice = Math.max(...values)
    const priceRange = maxPrice - minPrice

    // Configurar estilo
    ctx.strokeStyle = change >= 0 ? '#10b981' : '#ef4444'
    ctx.fillStyle = change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    ctx.lineWidth = 2

    if (chartType === 'line') {
      drawLineChart(ctx, chartWidth, chartHeight, padding, minPrice, priceRange)
    } else if (chartType === 'bar') {
      drawBarChart(ctx, chartWidth, chartHeight, padding, minPrice, priceRange)
    } else if (chartType === 'area') {
      drawAreaChart(ctx, chartWidth, chartHeight, padding, minPrice, priceRange)
    }
  }, [cryptoData, chartType, change, drawLineChart, drawBarChart, drawAreaChart])

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      drawChart(ctx, width, height)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [drawChart])

  useEffect(() => {
    loadCryptoData()
    const interval = setInterval(loadCryptoData, 30000) // Atualizar a cada 30 segundos
    return () => clearInterval(interval)
  }, [loadCryptoData])

  useEffect(() => {
    if (cryptoData.length > 0 && canvasRef.current) {
      startAnimation()
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [startAnimation, cryptoData.length])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-agro-emerald" />
            {symbol} - Gráfico
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {timeframe} • Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <button
          onClick={loadCryptoData}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preço atual */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(price)}
            </p>
            <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
              {getChangeIcon(change)}
              <span className="text-sm font-medium">
                {formatChange(change)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Volume 24h
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPrice(cryptoData[cryptoData.length - 1]?.volume || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Controles do gráfico */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
          <div className="flex space-x-1">
            {[
              { id: 'line', icon: LineChart, name: 'Linha' },
              { id: 'bar', icon: BarChart3, name: 'Barras' },
              { id: 'area', icon: PieChart, name: 'Área' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === type.id
                    ? 'bg-agro-emerald text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <type.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Período:</span>
          <select
            value={timeframe}
            onChange={(e) => {/* setTimeframe(e.target.value) */}}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="1h">1 Hora</option>
            <option value="4h">4 Horas</option>
            <option value="1d">1 Dia</option>
            <option value="1w">1 Semana</option>
            <option value="1M">1 Mês</option>
          </select>
        </div>
      </div>

      {/* Canvas do gráfico */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-64 border border-gray-200 dark:border-gray-700 rounded-lg"
        />
        
        {/* Indicadores */}
        <div className="absolute top-4 left-4 flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Máximo</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(Math.max(...cryptoData.map(d => d.price)))}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Mínimo</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(Math.min(...cryptoData.map(d => d.price)))}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Média</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(cryptoData.reduce((sum, d) => sum + d.price, 0) / cryptoData.length)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Volatilidade</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {((Math.max(...cryptoData.map(d => d.price)) - Math.min(...cryptoData.map(d => d.price))) / Math.min(...cryptoData.map(d => d.price)) * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}

export default CryptoChart