import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock, DollarSign } from 'lucide-react'

const StockMarketTicker = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Dados simulados das ações
  const mockStocks = [
    {
      symbol: 'VALE3',
      name: 'Vale S.A.',
      price: 65.42,
      change: 2.34,
      trend: 'up',
      volume: '12.5M'
    },
    {
      symbol: 'PETR4',
      name: 'Petrobras',
      price: 28.76,
      change: -1.23,
      trend: 'down',
      volume: '8.7M'
    },
    {
      symbol: 'ITUB4',
      name: 'Itaú Unibanco',
      price: 32.15,
      change: 0.87,
      trend: 'up',
      volume: '15.2M'
    },
    {
      symbol: 'BBDC4',
      name: 'Bradesco',
      price: 24.89,
      change: -0.45,
      trend: 'down',
      volume: '9.8M'
    },
    {
      symbol: 'ABEV3',
      name: 'Ambev',
      price: 12.34,
      change: 0.12,
      trend: 'up',
      volume: '6.3M'
    },
    {
      symbol: 'WEGE3',
      name: 'WEG',
      price: 45.67,
      change: 1.56,
      trend: 'up',
      volume: '4.1M'
    },
    {
      symbol: 'MGLU3',
      name: 'Magazine Luiza',
      price: 3.21,
      change: -2.34,
      trend: 'down',
      volume: '18.9M'
    },
    {
      symbol: 'RENT3',
      name: 'Localiza',
      price: 56.78,
      change: 0.89,
      trend: 'up',
      volume: '7.2M'
    }
  ]

  useEffect(() => {
    setStocks(mockStocks)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-agro-emerald" />
          Bolsa de Valores
        </h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="space-y-4">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getTrendIcon(stock.trend)}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {stock.symbol}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stock.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.price)}
                </p>
                <p className={`text-sm ${getTrendColor(stock.trend)}`}>
                  {formatChange(stock.change)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Volume
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {stock.volume}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Última atualização: {formatTime(currentTime)}</span>
          <span>Dados em tempo real</span>
        </div>
      </div>
    </div>
  )
}

export default StockMarketTicker