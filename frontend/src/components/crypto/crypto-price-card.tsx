import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CryptoPriceCardProps {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  onClick?: () => void
}

export function CryptoPriceCard({ symbol, name, price, change24h, changePercent24h, onClick }: CryptoPriceCardProps) {
  const isPositive = change24h >= 0
  
  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{changePercent24h.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-muted-foreground">
          {isPositive ? '+' : ''}${change24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (24h)
        </div>
      </div>
    </div>
  )
}
