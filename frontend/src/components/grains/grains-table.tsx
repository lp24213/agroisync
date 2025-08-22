'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react'

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

interface GrainsTableProps {
  grainsData: GrainData[]
}

export function GrainsTable({ grainsData }: GrainsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Grão</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Região</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Preço</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Variação 24h</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Última Atualização</th>
          </tr>
        </thead>
        <tbody>
          {grainsData.map((grain, index) => {
            const isPositive = grain.changePercent24h >= 0
            
            return (
              <motion.tr
                key={grain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{grain.symbol}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{grain.name}</div>
                      <div className="text-sm text-muted-foreground">{grain.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{grain.region}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-bold text-foreground">
                    R$ {grain.price.toFixed(2)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {isPositive ? '+' : ''}{grain.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isPositive ? 'text-green-400/70' : 'text-red-400/70'
                  }`}>
                    {isPositive ? '+' : ''}R$ {grain.change24h.toFixed(2)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                  {grain.lastUpdated.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
