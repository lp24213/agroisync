import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { CryptoTicker, FXRate, GrainPrice } from '@/types'
import { subscribeToTicker } from '@/lib/realtime/ticker'

interface TickerItem {
  symbol: string
  price: string
  change: number
  changePercent: number
  type: 'crypto' | 'fx' | 'grain'
}

export function GlobalTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToTicker((state) => {
      const items: TickerItem[] = []

      state.crypto.slice(0, 4).forEach((crypto) => {
        items.push({
          symbol: crypto.symbol,
          price: formatPrice(crypto.price, crypto.currency || 'USD'),
          change: crypto.change24h,
          changePercent: crypto.changePercent24h,
          type: 'crypto'
        })
      })

      state.fx.slice(0, 2).forEach((fx) => {
        items.push({
          symbol: `${fx.from}/${fx.to}`,
          price: formatPrice(fx.rate, fx.to),
          change: fx.change24h || 0,
          changePercent: fx.changePercent24h || 0,
          type: 'fx'
        })
      })

      state.grains.slice(0, 2).forEach((grain) => {
        items.push({
          symbol: grain.type || 'GRAIN',
          price: formatPrice(grain.price, grain.currency || 'USD'),
          change: grain.change24h || 0,
          changePercent: grain.changePercent24h || 0,
          type: 'grain'
        })
      })

      setTickerData(items)
    })

    return unsubscribe
  }, [])

  const formatPrice = (price: number, currency: string): string => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      }).format(price)
    }
    
    if (currency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    }

    return `${price.toFixed(2)} ${currency}`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  if (!isVisible || tickerData.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm text-white z-40 overflow-hidden"
    >
      <div className="flex items-center h-10">
        <div className="flex items-center space-x-8 animate-scroll">
          {tickerData.map((item, index) => (
            <motion.div
              key={`${item.symbol}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <span className="font-semibold text-blue-400">{item.symbol}</span>
              <span className="font-mono">{item.price}</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(item.change)}
                <span className={`text-sm ${getChangeColor(item.change)}`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-4 text-gray-400 hover:text-white text-xs"
      >
        ×
      </button>
    </motion.div>
  )
}

export default GlobalTicker
