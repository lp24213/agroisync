import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GrainsChart = ({ data }) => {
  const [selectedGrain, setSelectedGrain] = useState(null)
  const [chartType, setChartType] = useState('price')
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedGrain(data[0])
    }
  }, [data])

  const chartTypes = [
    { id: 'price', label: 'Preços', color: 'green' },
    { id: 'volume', label: 'Volume', color: 'blue' },
    { id: 'change', label: 'Variação', color: 'yellow' }
  ]

  const timeRanges = [
    { id: '1d', label: '1 Dia' },
    { id: '7d', label: '7 Dias' },
    { id: '30d', label: '30 Dias' },
    { id: '90d', label: '90 Dias' }
  ]

  // Gerar dados simulados para o gráfico
  const generateChartData = (grain, type, range) => {
    if (!grain) return []

    const days = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 }[range] || 7
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      let value
      switch (type) {
        case 'price':
          value = grain.price * (0.95 + Math.random() * 0.1)
          break
        case 'volume':
          value = grain.volume * (0.8 + Math.random() * 0.4)
          break
        case 'change':
          value = (Math.random() - 0.5) * 10
          break
        default:
          value = grain.price
      }

      data.push({
        date: date.toISOString().split('T')[0],
        value: value,
        label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      })
    }

    return data
  }

  const chartData = generateChartData(selectedGrain, chartType, timeRange)
  const maxValue = Math.max(...chartData.map(d => d.value))
  const minValue = Math.min(...chartData.map(d => d.value))
  const range = maxValue - minValue

  const getChartColor = type => {
    const colors = {
      price: 'stroke-green-400 fill-green-400/20',
      volume: 'stroke-blue-400 fill-blue-400/20',
      change: 'stroke-yellow-400 fill-yellow-400/20'
    }
    return colors[type] || colors.price
  }

  const formatValue = (value, type) => {
    switch (type) {
      case 'price':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value)
      case 'volume':
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
        return value.toFixed(0)
      case 'change':
        return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
      default:
        return value.toFixed(2)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6'>
        <div className='py-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-800'>
            <svg
              className='h-8 w-8 text-gray-400'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <line x1='12' y1='20' x2='12' y2='10' />
              <line x1='18' y1='20' x2='18' y2='4' />
              <line x1='6' y1='20' x2='6' y2='16' />
            </svg>
          </div>
          <h3 className='mb-2 text-lg font-semibold text-white'>Dados Indisponíveis</h3>
          <p className='text-gray-400'>Aguardando dados de cotações...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className='rounded-lg border border-gray-700 bg-gray-900/50 p-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Header */}
      <motion.div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between' variants={itemVariants}>
        <div className='mb-4 lg:mb-0'>
          <h2 className='mb-2 text-2xl font-bold text-white'>Análise de Mercado</h2>
          <p className='text-gray-400'>Gráficos e tendências dos grãos selecionados</p>
        </div>

        <div className='flex items-center space-x-2'>
          <svg className='h-5 w-5 text-green-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <line x1='12' y1='20' x2='12' y2='10' />
            <line x1='18' y1='20' x2='18' y2='4' />
            <line x1='6' y1='20' x2='6' y2='16' />
          </svg>
          <span className='text-sm text-gray-400'>Dados em tempo real</span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div className='mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3' variants={itemVariants}>
        {/* Seleção de Grão */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-300'>Grão</label>
          <select
            value={selectedGrain?.id || ''}
            onChange={e => {
              const grain = data.find(g => g.id === e.target.value)
              setSelectedGrain(grain)
            }}
            className='w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none'
          >
            {data.map(grain => (
              <option key={grain.id} value={grain.id}>
                {grain.name} ({grain.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Gráfico */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-300'>Métrica</label>
          <div className='flex space-x-2'>
            {chartTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  chartType === type.id
                    ? `bg-${type.color}-600 text-white`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Período */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-300'>Período</label>
          <div className='flex space-x-2'>
            {timeRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  timeRange === range.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div className='relative mb-4 h-64' variants={itemVariants}>
        <svg className='h-full w-full' viewBox='0 0 800 200'>
          {/* Grid lines */}
          <defs>
            <pattern id='grid' width='40' height='20' patternUnits='userSpaceOnUse'>
              <path d='M 40 0 L 0 0 0 20' fill='none' stroke='#374151' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='800' height='200' fill='url(#grid)' />

          {/* Chart line */}
          {chartData.length > 1 && (
            <path
              d={`M ${chartData
                .map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 780 + 10
                  const y = 180 - ((point.value - minValue) / range) * 160
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                })
                .join(' ')}`}
              className={getChartColor(chartType)}
              strokeWidth='2'
              fill='none'
            />
          )}

          {/* Chart area */}
          {chartData.length > 1 && (
            <path
              d={`M ${chartData
                .map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 780 + 10
                  const y = 180 - ((point.value - minValue) / range) * 160
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                })
                .join(' ')} L 790 180 L 10 180 Z`}
              className={getChartColor(chartType)}
              strokeWidth='0'
            />
          )}

          {/* Data points */}
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 780 + 10
            const y = 180 - ((point.value - minValue) / range) * 160
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r='3'
                className={getChartColor(chartType).split(' ')[0]}
                fill='currentColor'
              />
            )
          })}
        </svg>
      </motion.div>

      {/* Stats */}
      <motion.div className='grid grid-cols-2 gap-4 lg:grid-cols-4' variants={itemVariants}>
        <div className='text-center'>
          <p className='text-sm text-gray-400'>Atual</p>
          <p className='text-lg font-semibold text-white'>
            {selectedGrain &&
              formatValue(
                chartType === 'price'
                  ? selectedGrain.price
                  : chartType === 'volume'
                    ? selectedGrain.volume
                    : selectedGrain.changePercent,
                chartType
              )}
          </p>
        </div>
        <div className='text-center'>
          <p className='text-sm text-gray-400'>Máximo</p>
          <p className='text-lg font-semibold text-green-400'>{formatValue(maxValue, chartType)}</p>
        </div>
        <div className='text-center'>
          <p className='text-sm text-gray-400'>Mínimo</p>
          <p className='text-lg font-semibold text-red-400'>{formatValue(minValue, chartType)}</p>
        </div>
        <div className='text-center'>
          <p className='text-sm text-gray-400'>Variação</p>
          <p className={`text-lg font-semibold ${maxValue - minValue > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatValue(maxValue - minValue, chartType)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GrainsChart
