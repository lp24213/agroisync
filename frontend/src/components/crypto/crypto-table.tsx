import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CryptoTableProps {
  data: Array<{
    symbol: string
    name: string
    price: number
    change24h: number
    changePercent24h: number
    volume24h: number
    marketCap: number
  }>
}

export function CryptoTable({ data }: CryptoTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Top Cryptocurrencies</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/30">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">24h Change</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">24h Volume</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((crypto, index) => {
              const isPositive = crypto.change24h >= 0
              return (
                <tr key={crypto.symbol} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <div className="font-medium text-foreground">{crypto.symbol}</div>
                        <div className="text-sm text-muted-foreground">{crypto.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium text-foreground">
                      ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm text-muted-foreground">
                      ${crypto.volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm text-muted-foreground">
                      ${crypto.marketCap.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
