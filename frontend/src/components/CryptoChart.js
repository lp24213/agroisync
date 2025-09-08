import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react'

const CryptoChart = ({ cryptoData, selectedCrypto }) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateChartData()
  }, [cryptoData, selectedCrypto])

  const generateChartData = () => {
    if (!cryptoData || cryptoData.length === 0) return

    const selected = cryptoData.find(crypto => crypto.id === selectedCrypto)
    if (!selected) return

    // Gerar dados simulados de gráfico baseados no preço atual
    const basePrice = selected.price
    const dataPoints = []

    for (let i = 0; i < 24; i++) {
      const time = new Date()
      time.setHours(time.getHours() - (23 - i))

      // Simular variação de preço
      const variation = (Math.random() - 0.5) * 0.1; // ±5%
      const price = basePrice * (1 + variation)

      dataPoints.push({
        time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        price: price,
        volume: Math.random() * 1000
      })
    }

    setChartData(dataPoints)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className='rounded-xl bg-white p-6 shadow-lg'>
        <div className='animate-pulse'>
          <div className='mb-4 h-4 w-1/4 rounded bg-gray-200'></div>
          <div className='h-64 rounded bg-gray-200'></div>
        </div>
      </div>
    )
  }

  const selected = cryptoData.find(crypto => crypto.id === selectedCrypto)
  const isPositive = selected?.change24h > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-xl bg-white p-6 shadow-lg'
    >
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-bold text-gray-900'>
            {selected?.name} ({selected?.symbol})
          </h3>
          <div className='mt-1 flex items-center space-x-2'>
            <span className='text-2xl font-bold text-gray-900'>${selected?.price?.toLocaleString()}</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
              <span className='text-sm font-medium'>{Math.abs(selected?.change24h)}%</span>
            </div>
          </div>
        </div>
        <button onClick={generateChartData} className='rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200'>
          <RefreshCw className='h-5 w-5 text-gray-600' />
        </button>
      </div>

      {/* Gráfico Simulado */}
      <div className='relative h-64 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
        <svg className='h-full w-full' viewBox='0 0 400 200'>
          {/* Linha do gráfico */}
          <path
            d={chartData
              .map((point, index) => {
                const x = (index / (chartData.length - 1)) * 350 + 25
                const y =
                  180 -
                  ((point.price - Math.min(...chartData.map(p => p.price))) /
                    (Math.max(...chartData.map(p => p.price)) - Math.min(...chartData.map(p => p.price)))) *
                    150
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              })
              .join(' ')}
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth='2'
            fill='none'
            className='animate-pulse'
          />

          {/* Área sob o gráfico */}
          <path
            d={`${chartData
              .map((point, index) => {
                const x = (index / (chartData.length - 1)) * 350 + 25
                const y =
                  180 -
                  ((point.price - Math.min(...chartData.map(p => p.price))) /
                    (Math.max(...chartData.map(p => p.price)) - Math.min(...chartData.map(p => p.price)))) *
                    150
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              })
              .join(' ')} L 375 180 L 25 180 Z`}
            fill={isPositive ? 'url(#greenGradient)' : 'url(#redGradient)'}
            opacity='0.2'
          />

          {/* Gradientes */}
          <defs>
            <linearGradient id='greenGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#10b981' stopOpacity='0.8' />
              <stop offset='100%' stopColor='#10b981' stopOpacity='0.1' />
            </linearGradient>
            <linearGradient id='redGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#ef4444' stopOpacity='0.8' />
              <stop offset='100%' stopColor='#ef4444' stopOpacity='0.1' />
            </linearGradient>
          </defs>
        </svg>

        {/* Indicadores de preço */}
        <div className='absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-500'>
          <span>${Math.min(...chartData.map(p => p.price)).toFixed(2)}</span>
          <span>${Math.max(...chartData.map(p => p.price)).toFixed(2)}</span>
        </div>
      </div>

      {/* Estatísticas */}
      <div className='mt-6 grid grid-cols-3 gap-4'>
        <div className='text-center'>
          <div className='text-sm text-gray-500'>Market Cap</div>
          <div className='text-lg font-semibold text-gray-900'>{selected?.marketCap}</div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-500'>Volume 24h</div>
          <div className='text-lg font-semibold text-gray-900'>{selected?.volume}</div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-500'>Dominance</div>
          <div className='text-lg font-semibold text-gray-900'>{selected?.dominance}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default CryptoChart
