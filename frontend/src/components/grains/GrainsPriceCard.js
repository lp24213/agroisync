import React from 'react'
import { motion } from 'framer-motion'

const GrainsPriceCard = ({ grain, location }) => {
  const { name, symbol, price, change, changePercent, volume, unit, lastUpdate, market } = grain

  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const bgGradient = isPositive ? 'from-green-900/20 to-green-800/10' : 'from-red-900/20 to-red-800/10'

  const formatPrice = price => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatVolume = volume => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  const getGrainIcon = name => {
    const icons = {
      Soja: (
        <svg className='h-8 w-8 text-green-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M12 2L8 8l4 4 4-4-4-6z' />
          <path d='M8 8v8a4 4 0 0 0 8 0V8' />
          <path d='M6 16h12' />
        </svg>
      ),
      Milho: (
        <svg className='h-8 w-8 text-yellow-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M12 2L8 8l4 4 4-4-4-6z' />
          <path d='M8 8v8a4 4 0 0 0 8 0V8' />
          <path d='M6 16h12' />
        </svg>
      ),
      Trigo: (
        <svg className='h-8 w-8 text-amber-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M12 2L8 8l4 4 4-4-4-6z' />
          <path d='M8 8v8a4 4 0 0 0 8 0V8' />
          <path d='M6 16h12' />
        </svg>
      ),
      Arroz: (
        <svg className='h-8 w-8 text-gray-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M12 2L8 8l4 4 4-4-4-6z' />
          <path d='M8 8v8a4 4 0 0 0 8 0V8' />
          <path d='M6 16h12' />
        </svg>
      ),
      Café: (
        <svg className='h-8 w-8 text-orange-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M17 8h1a4 4 0 1 1 0 8h-1' />
          <path d='M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z' />
          <line x1='6' y1='2' x2='6' y2='4' />
          <line x1='10' y1='2' x2='10' y2='4' />
          <line x1='14' y1='2' x2='14' y2='4' />
        </svg>
      ),
      Algodão: (
        <svg className='h-8 w-8 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='10' />
          <circle cx='12' cy='12' r='6' />
          <circle cx='12' cy='12' r='2' />
        </svg>
      )
    }

    return icons[name] || icons['Soja']
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} group cursor-pointer rounded-xl border border-gray-700 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500`}
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      whileHover='hover'
    >
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          {getGrainIcon(name)}
          <div>
            <h3 className='text-xl font-bold text-white transition-colors duration-300 group-hover:text-green-400'>
              {name}
            </h3>
            <p className='text-sm text-gray-400'>
              {symbol} • {unit}
            </p>
          </div>
        </div>

        <div className='text-right'>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <svg
              className={`h-4 w-4 ${isPositive ? '' : 'rotate-180'}`}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <polyline points='23,18 13.5,8.5 8.5,13.5 1,6' />
              <polyline points='17,18 23,18 23,12' />
            </svg>
            <span className='font-semibold'>{changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className='mb-4'>
        <div className='mb-1 text-3xl font-bold text-white'>{formatPrice(price)}</div>
        <div className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}
          {formatPrice(change)} hoje
        </div>
      </div>

      {/* Stats */}
      <div className='mb-4 grid grid-cols-2 gap-4'>
        <div>
          <p className='text-xs uppercase tracking-wide text-gray-400'>Volume</p>
          <p className='text-lg font-semibold text-white'>{formatVolume(volume)}</p>
        </div>
        <div>
          <p className='text-xs uppercase tracking-wide text-gray-400'>Mercado</p>
          <p className='text-sm font-medium text-blue-400'>{market}</p>
        </div>
      </div>

      {/* Location */}
      {location && (
        <div className='border-t border-gray-700 pt-3'>
          <div className='flex items-center space-x-2 text-gray-400'>
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
              <circle cx='12' cy='10' r='3' />
            </svg>
            <span className='text-xs'>
              Preço regional: {location.city}, {location.state}
            </span>
          </div>
        </div>
      )}

      {/* Last Update */}
      <div className='mt-2 text-xs text-gray-500'>Atualizado: {new Date(lastUpdate).toLocaleTimeString('pt-BR')}</div>
    </motion.div>
  )
}

export default GrainsPriceCard
