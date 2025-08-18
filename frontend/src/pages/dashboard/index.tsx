import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'

const Dashboard: NextPage = () => {
  const [marketData, setMarketData] = useState({
    soja: { price: 15.85, change: 12.5, volume: '2.5M ton' },
    milho: { price: 8.50, change: 3.2, volume: '1.8M ton' },
    algodao: { price: 4.25, change: 7.8, volume: '850K ton' }
  })

  const [cryptoData, setCryptoData] = useState([
    { symbol: 'BTC', price: 43250.00, change: 3.2, marketCap: '845.2B' },
    { symbol: 'ETH', price: 2650.00, change: 2.8, marketCap: '318.7B' },
    { symbol: 'ADA', price: 0.48, change: -1.2, marketCap: '16.9B' },
    { symbol: 'SOL', price: 98.50, change: 5.7, marketCap: '42.1B' },
    { symbol: 'DOT', price: 7.25, change: 1.9, marketCap: '9.8B' },
    { symbol: 'LINK', price: 15.80, change: -0.8, marketCap: '8.9B' }
  ])

  const [portfolioValue, setPortfolioValue] = useState(125000)
  const [stakingRewards, setStakingRewards] = useState(8750)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        soja: { 
          ...prev.soja, 
          price: prev.soja.price + (Math.random() - 0.5) * 0.1,
          change: prev.soja.change + (Math.random() - 0.5) * 2
        },
        milho: { 
          ...prev.milho, 
          price: prev.milho.price + (Math.random() - 0.5) * 0.05,
          change: prev.milho.change + (Math.random() - 0.5) * 1
        },
        algodao: { 
          ...prev.algodao, 
          price: prev.algodao.price + (Math.random() - 0.5) * 0.02,
          change: prev.algodao.change + (Math.random() - 0.5) * 1
        }
      }))

      setCryptoData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.02),
        change: crypto.change + (Math.random() - 0.5) * 2
      })))

      setPortfolioValue(prev => prev * (1 + (Math.random() - 0.5) * 0.01))
      setStakingRewards(prev => prev * (1 + (Math.random() - 0.5) * 0.005))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const recentTransactions = [
    { id: 1, type: 'Compra', asset: 'Soja', amount: '50 ton', value: 'R$ 792,50', time: '2 min atrás' },
    { id: 2, type: 'Venda', asset: 'Milho', amount: '30 ton', value: 'R$ 255,00', time: '15 min atrás' },
    { id: 3, type: 'Staking', asset: 'AGRO Token', amount: '1000', value: '+R$ 45,20', time: '1 hora atrás' },
    { id: 4, type: 'Compra', asset: 'BTC', amount: '0.05', value: 'R$ 2.162,50', time: '2 horas atrás' },
    { id: 5, type: 'Farming', asset: 'ETH/AGRO LP', amount: '2.5 LP', value: '+R$ 125,00', time: '4 horas atrás' }
  ]

  return (
    <>
      <Head>
        <title>Dashboard - AGROISYNC</title>
        <meta name="description" content="Dashboard completo para monitoramento de seus ativos agrícolas e criptomoedas" />
      </Head>

      <div className="min-h-screen bg-black text-gray-100">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-6">
          <h1 className="text-3xl font-bold text-gray-100">Dashboard AGROISYNC</h1>
          <p className="text-gray-400 mt-2">Monitore seus ativos e performance em tempo real</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Valor do Portfólio</p>
                  <p className="text-2xl font-bold">R$ {portfolioValue.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <FireIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Recompensas Staking</p>
                  <p className="text-2xl font-bold">R$ {stakingRewards.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Total de Ativos</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">Performance 30d</p>
                  <p className="text-2xl font-bold text-green-400">+18.5%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Crypto Prices Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Preços de Criptomoedas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoData.map((crypto, index) => (
                <Card key={crypto.symbol} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${crypto.change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {crypto.change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">{crypto.symbol}</p>
                        <p className="text-sm text-gray-400">Cap: ${crypto.marketCap}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-100">${crypto.price.toFixed(2)}</p>
                      <p className={`text-sm ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Prices Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Preços Agrícolas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(marketData).map(([product, data]) => (
                <Card key={product} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
                  <div className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-black font-bold text-lg">{product.toUpperCase()}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">
                      R$ {data.price.toFixed(2)}
                    </h3>
                    <p className={`text-lg font-medium ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Volume: {data.volume}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Chart and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <Card className="enhanced-shadow">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-100 mb-2">Gráfico de Performance</h3>
                <p className="text-gray-400">Evolução dos seus ativos nos últimos 30 dias</p>
              </div>
              <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-lg">
                  Gráfico interativo será carregado aqui
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="enhanced-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-100 mb-2">Transações Recentes</h3>
                <p className="text-gray-400">Suas últimas operações na plataforma</p>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'Compra' ? 'bg-green-500' : 
                        transaction.type === 'Venda' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">{transaction.type} {transaction.asset}</p>
                        <p className="text-xs text-gray-400">{transaction.amount} • {transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-100">{transaction.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
