'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react'

const regionData = [
  {
    region: 'Mato Grosso',
    revenue: 285000,
    orders: 1240,
    users: 2850,
    growth: 18.5,
    conversion: 9.2,
  },
  {
    region: 'Paraná',
    revenue: 245000,
    orders: 1120,
    users: 2480,
    growth: 22.1,
    conversion: 8.7,
  },
  {
    region: 'Rio Grande do Sul',
    revenue: 198000,
    orders: 890,
    users: 1950,
    growth: 15.8,
    conversion: 7.9,
  },
  {
    region: 'Minas Gerais',
    revenue: 167000,
    orders: 780,
    users: 1680,
    growth: 19.3,
    conversion: 8.4,
  },
  {
    region: 'São Paulo',
    revenue: 156000,
    orders: 720,
    users: 1580,
    growth: 12.7,
    conversion: 7.2,
  },
]

export function AnalyticsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Região</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Receita</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Pedidos</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Usuários</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Crescimento</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">Conversão</th>
          </tr>
        </thead>
        <tbody>
          {regionData.map((region, index) => (
            <motion.tr
              key={region.region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <tr className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{region.region}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-semibold text-foreground">
                    R$ {(region.revenue / 1000).toFixed(0)}k
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-foreground">
                    {region.orders.toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-foreground">
                    {region.users.toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    region.growth >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {region.growth >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {region.growth >= 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium text-foreground">
                    {region.conversion}%
                  </div>
                </td>
              </tr>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
