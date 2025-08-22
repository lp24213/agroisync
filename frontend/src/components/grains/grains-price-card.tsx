'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GrainData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  region: string
  coordinates: [number, number]
  lastUpdated: Date
}

interface GrainsPriceCardProps {
  grain: GrainData
}

export function GrainsPriceCard({ grain }: GrainsPriceCardProps) {
  const isPositive = grain.changePercent24h >= 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{grain.name}</h4>
          <p className="text-sm text-muted-foreground">{grain.region}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">
            R$ {grain.price.toFixed(2)}
          </div>
          <div className={`flex items-center space-x-1 text-sm ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isPositive ? '+' : ''}{grain.changePercent24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{grain.symbol}</span>
        <span>
          {grain.lastUpdated.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  )
}
