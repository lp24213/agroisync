import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  Settings,
  ZoomIn,
  ZoomOut,
  Move,
  Layers
} from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import cryptoService from '../services/cryptoService'

const CryptoCharts = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [timeframe, setTimeframe] = useState('7d')
  const [chartType, setChartType] = useState('candlestick')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [technicalIndicators, setTechnicalIndicators] = useState({
    sma: true,
    ema: true,
    bollinger: false,
    rsi: false,
    macd: false
  })

  const popularCryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
  ]

  const timeframes = [
    { value: '1d', label: '24h', days: 1 },
    { value: '7d', label: '7d', days: 7 },
    { value: '30d', label: '30d', days: 30 },
    { value: '90d', label: '90d', days: 90 },
    { value: '1y', label: '1a', days: 365 }
  ]

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { value: 'line', label: 'Linha', icon: LineChart },
    { value: 'area', label: 'Área', icon: TrendingUp }
  ]

  useEffect(() => {
    loadChartData()
  }, [selectedCrypto, timeframe])

  const loadChartData = useCallback(async () => {
    setLoading(true)
    try {
      const selectedTimeframe = timeframes.find(t => t.value === timeframe)
      const days = selectedTimeframe ? selectedTimeframe.days : 7

      const data = await cryptoService.getHistoricalData(selectedCrypto, days, 'usd')
      setChartData(data)
    } catch (error) {
      console.error('Erro ao carregar dados do gráfico:', error)
      // Dados mockados para demonstração
      generateMockData()
    } finally {
      setLoading(false)
    }
  }, [selectedCrypto, timeframe])

  const generateMockData = () => {
    const days = timeframes.find(t => t.value === timeframe)?.days || 7
    const mockData = []
    let basePrice = 45000; // Preço base do Bitcoin

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))

      const volatility = 0.05; // 5% de volatilidade
      const change = (Math.random() - 0.5) * volatility
      basePrice = basePrice * (1 + change)

      const high = basePrice * (1 + Math.random() * 0.03)
      const low = basePrice * (1 - Math.random() * 0.03)
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.02)
      const close = basePrice

      mockData.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        price: close,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 500000
      })
    }

    setChartData({ prices: mockData })
  }

  const calculateSMA = (prices, period) => {
    if (prices.length < period) return []

    const sma = []
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      sma.push(sum / period)
    }
    return sma
  }

  const calculateEMA = (prices, period) => {
    if (prices.length < period) return []

    const ema = []
    const multiplier = 2 / (period + 1)

    // Primeiro valor é SMA
    let sum = 0
    for (let i = 0; i < period; i++) {
      sum += prices[i]
    }
    ema.push(sum / period)

    // Calcular EMA
    for (let i = period; i < prices.length; i++) {
      const newEMA = prices[i] * multiplier + ema[ema.length - 1] * (1 - multiplier)
      ema.push(newEMA)
    }

    return ema
  }

  const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
    if (prices.length < period) return { upper: [], middle: [], lower: [] }

    const sma = calculateSMA(prices, period)
    const upper = []
    const lower = []

    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1)
      const mean = slice.reduce((a, b) => a + b, 0) / period
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period
      const standardDeviation = Math.sqrt(variance)

      upper.push(mean + standardDeviation * stdDev)
      lower.push(mean - standardDeviation * stdDev)
    }

    return { upper, middle: sma, lower }
  }

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return []

    const gains = []
    const losses = []

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    const rsi = []
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

    for (let i = period; i < prices.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period

      const rs = avgGain / avgLoss
      const rsiValue = 100 - 100 / (1 + rs)
      rsi.push(rsiValue)
    }

    return rsi
  }

  const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    if (prices.length < slowPeriod) return { macd: [], signal: [], histogram: [] }

    const ema12 = calculateEMA(prices, fastPeriod)
    const ema26 = calculateEMA(prices, slowPeriod)

    const macd = []
    for (let i = 0; i < ema26.length; i++) {
      const fastIndex = prices.length - ema26.length + i
      const slowIndex = prices.length - ema26.length + i

      if (fastIndex < ema12.length && slowIndex < ema26.length) {
        macd.push(ema12[fastIndex] - ema26[slowIndex])
      }
    }

    const signal = calculateEMA(macd, signalPeriod)
    const histogram = macd.map((value, index) => {
      const signalValue = signal[index] || 0
      return value - signalValue
    })

    return { macd, signal, histogram }
  }

  const renderChart = () => {
    if (!chartData || !chartData.prices) {
      return (
        <div className='flex h-96 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800'>
          <div className='text-center'>
            <BarChart3 className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <p className='text-gray-500 dark:text-gray-400'>
              {loading ? 'Carregando dados...' : 'Nenhum dado disponível'}
            </p>
          </div>
        </div>
      )
    }

    const prices = chartData.prices.map(p => p.price)
    const timestamps = chartData.prices.map(p => p.timestamp)

    // Calcular indicadores técnicos
    const sma20 = calculateSMA(prices, 20)
    const ema12 = calculateEMA(prices, 12)
    const bollinger = calculateBollingerBands(prices, 20, 2)
    const rsi = calculateRSI(prices, 14)
    const macd = calculateMACD(prices)

    // Preparar dados para Recharts
    const chartDataFormatted = chartData.prices.map((item, index) => ({
      date: item.date,
      price: item.price,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      sma20: sma20[index] || null,
      ema12: ema12[index] || null,
      bollingerUpper: bollinger.upper[index] || null,
      bollingerLower: bollinger.lower[index] || null,
      rsi: rsi[index] || null,
      macd: macd.macd[index] || null,
      signal: macd.signal[index] || null
    }))

    const renderChartByType = () => {
      switch (chartType) {
        case 'line':
          return (
            <ResponsiveContainer width='100%' height={400}>
              <RechartsLineChart data={chartDataFormatted}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  dataKey='date'
                  stroke='#666'
                  fontSize={12}
                  tickFormatter={value => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis stroke='#666' fontSize={12} tickFormatter={value => `$${value.toLocaleString()}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                          <p className='font-semibold'>{new Date(label).toLocaleDateString('pt-BR')}</p>
                          <p className='text-green-600'>Preço: ${payload[0].value?.toLocaleString()}</p>
                          {technicalIndicators.sma && payload[1]?.value && (
                            <p className='text-blue-600'>SMA 20: ${payload[1].value?.toLocaleString()}</p>
                          )}
                          {technicalIndicators.ema && payload[2]?.value && (
                            <p className='text-purple-600'>EMA 12: ${payload[2].value?.toLocaleString()}</p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type='monotone' dataKey='price' stroke='#10b981' strokeWidth={2} dot={false} name='Preço' />
                {technicalIndicators.sma && (
                  <Line type='monotone' dataKey='sma20' stroke='#3b82f6' strokeWidth={1.5} dot={false} name='SMA 20' />
                )}
                {technicalIndicators.ema && (
                  <Line type='monotone' dataKey='ema12' stroke='#8b5cf6' strokeWidth={1.5} dot={false} name='EMA 12' />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          )

        case 'area':
          return (
            <ResponsiveContainer width='100%' height={400}>
              <AreaChart data={chartDataFormatted}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  dataKey='date'
                  stroke='#666'
                  fontSize={12}
                  tickFormatter={value => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis stroke='#666' fontSize={12} tickFormatter={value => `$${value.toLocaleString()}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                          <p className='font-semibold'>{new Date(label).toLocaleDateString('pt-BR')}</p>
                          <p className='text-green-600'>Preço: ${payload[0].value?.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type='monotone'
                  dataKey='price'
                  stroke='#10b981'
                  fill='#10b981'
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )

        case 'candlestick':
        default:
          return (
            <ResponsiveContainer width='100%' height={400}>
              <BarChart data={chartDataFormatted}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  dataKey='date'
                  stroke='#666'
                  fontSize={12}
                  tickFormatter={value => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis stroke='#666' fontSize={12} tickFormatter={value => `$${value.toLocaleString()}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                          <p className='font-semibold'>{new Date(label).toLocaleDateString('pt-BR')}</p>
                          <p className='text-green-600'>Alto: ${payload[0].payload.high?.toLocaleString()}</p>
                          <p className='text-red-600'>Baixo: ${payload[0].payload.low?.toLocaleString()}</p>
                          <p className='text-blue-600'>Abertura: ${payload[0].payload.open?.toLocaleString()}</p>
                          <p className='text-purple-600'>Fechamento: ${payload[0].payload.close?.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey='high' fill='#10b981' name='Alto' radius={[2, 2, 0, 0]} />
                <Bar dataKey='low' fill='#ef4444' name='Baixo' radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )
      }
    }

    return (
      <div className='space-y-6'>
        {/* Gráfico Principal */}
        <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Gráfico de Preços - {getCryptoName(selectedCrypto)}
            </h3>
            <div className='flex items-center space-x-2'>
              <button
                onClick={loadChartData}
                disabled={loading}
                className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                title='Atualizar'
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                title='Zoom In'
              >
                <ZoomIn className='h-4 w-4' />
              </button>
              <button
                className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                title='Zoom Out'
              >
                <ZoomOut className='h-4 w-4' />
              </button>
              <button
                className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                title='Mover'
              >
                <Move className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Área do Gráfico */}
          <div className='relative h-96 rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>{renderChartByType()}</div>

          {/* Indicadores técnicos */}
          <div className='mt-4 flex items-center space-x-4 text-sm'>
            {technicalIndicators.sma && sma20.length > 0 && (
              <div className='flex items-center space-x-2'>
                <div className='h-0.5 w-3 bg-blue-500'></div>
                <span className='text-blue-600 dark:text-blue-400'>SMA 20</span>
              </div>
            )}

            {technicalIndicators.ema && ema12.length > 0 && (
              <div className='flex items-center space-x-2'>
                <div className='h-0.5 w-3 bg-purple-500'></div>
                <span className='text-purple-600 dark:text-purple-400'>EMA 12</span>
              </div>
            )}

            {technicalIndicators.bollinger && bollinger.upper.length > 0 && (
              <div className='flex items-center space-x-2'>
                <div className='h-0.5 w-3 bg-yellow-500'></div>
                <span className='text-yellow-600 dark:text-yellow-400'>Bollinger</span>
              </div>
            )}
          </div>
        </div>

        {/* Indicadores Técnicos */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* RSI */}
          {technicalIndicators.rsi && rsi.length > 0 && (
            <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>RSI (14)</h4>
              <div className='relative h-32 rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                <div className='flex h-full items-end justify-between'>
                  {rsi.slice(-20).map((value, index) => {
                    const height = (value / 100) * 100
                    const color = value > 70 ? 'bg-red-500' : value < 30 ? 'bg-green-500' : 'bg-blue-500'

                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-2 ${color} rounded-t`}
                        title={`RSI: ${value.toFixed(2)}`}
                      />
                    )
                  })}
                </div>
                {/* Linhas de sobrecompra/sobrevenda */}
                <div className='pointer-events-none absolute left-0 top-0 h-full w-full'>
                  <div className='h-1/3 border-t border-red-300'></div>
                  <div className='h-1/3 border-t border-green-300'></div>
                </div>
              </div>
              <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Valor atual: {rsi[rsi.length - 1]?.toFixed(2) || '0.00'}
              </div>
            </div>
          )}

          {/* MACD */}
          {technicalIndicators.macd && macd.macd.length > 0 && (
            <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>MACD</h4>
              <div className='h-32 rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                <div className='flex h-full items-end justify-between'>
                  {macd.macd.slice(-20).map((value, index) => {
                    const height = Math.abs(value) * 1000; // Escalar para visualização
                    const color = value > 0 ? 'bg-green-500' : 'bg-red-500'

                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(height, 100)}%` }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-2 ${color} rounded-t`}
                        title={`MACD: ${value.toFixed(4)}`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                MACD: {macd.macd[macd.macd.length - 1]?.toFixed(4) || '0.0000'}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const getCryptoName = cryptoId => {
    const crypto = popularCryptos.find(c => c.id === cryptoId)
    return crypto ? crypto.name : cryptoId
  }

  const getCryptoIcon = cryptoId => {
    const crypto = popularCryptos.find(c => c.id === cryptoId)
    return crypto ? crypto.icon : cryptoId.toUpperCase().charAt(0)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Gráficos Interativos</h2>
          <p className='text-gray-600 dark:text-gray-400'>Análise técnica avançada com indicadores em tempo real</p>
        </div>
      </div>

      {/* Controles */}
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          {/* Seleção de Cripto */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Criptomoeda</label>
            <select
              value={selectedCrypto}
              onChange={e => setSelectedCrypto(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              {popularCryptos.map(crypto => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.icon} {crypto.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Período</label>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Gráfico */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Tipo</label>
            <select
              value={chartType}
              onChange={e => setChartType(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              {chartTypes.map(type => {
                const Icon = type.icon
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Indicadores Técnicos */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Indicadores</label>
            <button
              onClick={() => setTechnicalIndicators(prev => ({ ...prev, sma: !prev.sma }))}
              className={`w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                technicalIndicators.sma
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              SMA/EMA
            </button>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Configurações Avançadas</h4>
            <button className='p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
              <Settings className='h-4 w-4' />
            </button>
          </div>

          <div className='mt-3 grid grid-cols-2 gap-3 md:grid-cols-5'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={technicalIndicators.sma}
                onChange={e => setTechnicalIndicators(prev => ({ ...prev, sma: e.target.checked }))}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>SMA</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={technicalIndicators.ema}
                onChange={e => setTechnicalIndicators(prev => ({ ...prev, ema: e.target.checked }))}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>EMA</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={technicalIndicators.bollinger}
                onChange={e => setTechnicalIndicators(prev => ({ ...prev, bollinger: e.target.checked }))}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>Bollinger</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={technicalIndicators.rsi}
                onChange={e => setTechnicalIndicators(prev => ({ ...prev, rsi: e.target.checked }))}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>RSI</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={technicalIndicators.macd}
                onChange={e => setTechnicalIndicators(prev => ({ ...prev, macd: e.target.checked }))}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>MACD</span>
            </label>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      {renderChart()}
    </div>
  )
}

export default CryptoCharts
