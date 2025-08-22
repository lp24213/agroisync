'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Quote {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const mockQuotes: Quote[] = [
  { symbol: 'USD/BRL', price: 5.12, change: 0.02, changePercent: 0.39 },
  { symbol: 'EUR/BRL', price: 5.58, change: -0.01, changePercent: -0.18 },
  { symbol: 'BTC/USD', price: 43250, change: 1250, changePercent: 2.98 },
  { symbol: 'ETH/USD', price: 2650, change: 85, changePercent: 3.31 },
  { symbol: 'SOJA', price: 125.50, change: 2.30, changePercent: 1.87 },
  { symbol: 'MILHO', price: 89.75, change: -1.25, changePercent: -1.37 },
  { symbol: 'TRIGO', price: 156.80, change: 3.20, changePercent: 2.08 },
]

export function TickerBar() {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes(prev => 
        prev.map(quote => ({
          ...quote,
          price: quote.price + (Math.random() - 0.5) * 0.1,
          change: quote.change + (Math.random() - 0.5) * 0.01,
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-secondary/50 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center space-x-8 overflow-hidden">
          <motion.div
            className="flex items-center space-x-8 whitespace-nowrap"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {quotes.map((quote, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground/80">
                  {quote.symbol}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {quote.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-1">
                  {quote.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      quote.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
