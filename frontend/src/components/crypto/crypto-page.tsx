'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Coins,
  BarChart3,
  Wallet
} from 'lucide-react'
import { CryptoPriceCard } from './crypto-price-card'
import { CryptoChart } from './crypto-chart'
import { CryptoTable } from './crypto-table'
import { Button } from '@/components/ui/button'

interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  lastUpdated: Date
  chartData?: Array<{
    date: string
    price: number
  }>
}

const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.50,
    change24h: 1250.75,
    changePercent24h: 2.98,
    volume24h: 28450000000,
    marketCap: 847500000000,
    lastUpdated: new Date(),
    chartData: [
      { date: '00:00', price: 43000 },
      { date: '04:00', price: 43100 },
      { date: '08:00', price: 43200 },
      { date: '12:00', price: 43300 },
      { date: '16:00', price: 43250 },
      { date: '20:00', price: 43250.50 },
    ]
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2650.25,
    change24h: 85.30,
    changePercent24h: 3.31,
    volume24h: 15680000000,
    marketCap: 318400000000,
    lastUpdated: new Date(),
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 98.75,
    change24h: -2.45,
    changePercent24h: -2.42,
    volume24h: 2840000000,
    marketCap: 42850000000,
    lastUpdated: new Date(),
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.485,
    change24h: 0.025,
    changePercent24h: 5.43,
    volume24h: 1250000000,
    marketCap: 17200000000,
    lastUpdated: new Date(),
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.85,
    change24h: 0.35,
    changePercent24h: 4.67,
    volume24h: 890000000,
    marketCap: 9800000000,
    lastUpdated: new Date(),
  },
]

export function CryptoPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(mockCryptoData)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData>(mockCryptoData[0])

  const refreshData = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setCryptoData(prev => 
        prev.map(crypto => ({
          ...crypto,
          price: crypto.price + (Math.random() - 0.5) * 100,
          change24h: crypto.change24h + (Math.random() - 0.5) * 10,
          changePercent24h: crypto.changePercent24h + (Math.random() - 0.5) * 2,
          lastUpdated: new Date(),
        }))
      )
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                <span className="gradient-text">Criptomoedas</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Cotações em tempo real, gráficos e análise de mercado
              </p>
            </div>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Gráfico de Preços - {selectedCrypto.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Última atualização: {selectedCrypto.lastUpdated.toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
                <CryptoChart data={selectedCrypto.chartData || []} symbol={selectedCrypto.symbol} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Principais Criptos
                </h3>
                <div className="space-y-3">
                  {cryptoData.slice(0, 3).map((crypto) => (
                    <CryptoPriceCard
                      key={crypto.id}
                      symbol={crypto.symbol}
                      name={crypto.name}
                      price={crypto.price}
                      change24h={crypto.change24h}
                      changePercent24h={crypto.changePercent24h}
                      onClick={() => setSelectedCrypto(crypto)}
                    />
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="w-4 h-4 mr-2" />
                    Conectar Carteira
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Mercado de Criptomoedas
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Total de criptos: {cryptoData.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Capitalização total: $1.2T
                </span>
              </div>
            </div>
            <CryptoTable data={cryptoData} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
