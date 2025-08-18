import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  FireIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  UserCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'

const Dashboard: NextPage = () => {
  const [portfolioValue, setPortfolioValue] = useState(125000)
  const [stakingRewards, setStakingRewards] = useState(8750)
  const [totalYield, setTotalYield] = useState(18.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.5) * 1000)
      setStakingRewards(prev => prev + (Math.random() - 0.5) * 100)
      setTotalYield(prev => prev + (Math.random() - 0.5) * 0.5)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const cryptoHoldings = [
    { symbol: 'BTC', amount: 2.5, value: 108125, change: 3.2, color: 'from-orange-500 to-yellow-500' },
    { symbol: 'ETH', amount: 15.8, value: 41870, change: 2.8, color: 'from-blue-500 to-cyan-500' },
    { symbol: 'SOL', amount: 425, value: 41825, change: 5.7, color: 'from-purple-500 to-pink-500' },
    { symbol: 'ADA', amount: 25000, value: 12000, change: -1.2, color: 'from-emerald-500 to-teal-500' }
  ]

  const recentTransactions = [
    { type: 'Stake', amount: '+5000', asset: 'AGROISYNC', time: '2 min ago', status: 'success' },
    { type: 'Harvest', amount: '+1250', asset: 'Rewards', time: '15 min ago', status: 'success' },
    { type: 'Swap', amount: '-0.5', asset: 'BTC → ETH', time: '1 hour ago', status: 'success' },
    { type: 'Deposit', amount: '+10000', asset: 'USDC', time: '3 hours ago', status: 'pending' }
  ]

  const stakingPools = [
    { name: 'AGROISYNC Premium', apy: 24.5, tvl: '2.5M', staked: 15000, color: 'from-cyan-500 to-blue-500' },
    { name: 'Liquid Staking', apy: 18.2, tvl: '1.8M', staked: 8500, color: 'from-emerald-500 to-teal-500' },
    { name: 'Flexible Pool', apy: 12.8, tvl: '950K', staked: 3200, color: 'from-purple-500 to-pink-500' }
  ]

  return (
    <>
      <Head>
        <title>Dashboard - AGROISYNC</title>
        <meta name="description" content="Dashboard completo da plataforma AGROISYNC com métricas em tempo real" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/10 to-cyan-900/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce animation-delay-3000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-black text-gradient-primary mb-4">
                  Dashboard AGROISYNC
                </h1>
                <p className="text-xl text-gray-400">
                  Bem-vindo de volta! Aqui está o resumo completo da sua carteira
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 group">
                  <BellIcon className="h-6 w-6 text-gray-400 group-hover:text-cyan-400" />
                </button>
                <button className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 group">
                  <CogIcon className="h-6 w-6 text-gray-400 group-hover:text-cyan-400" />
                </button>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl px-4 py-2">
                  <UserCircleIcon className="h-6 w-6 text-cyan-400" />
                  <span className="text-cyan-400 font-semibold">Fazendeiro Pro</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50 group">
                <div className="p-6 text-center">
                  <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-cyan-500/25">
                    <CurrencyDollarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    ${portfolioValue.toLocaleString()}
                  </h3>
                  <p className="text-gray-400 font-medium">Valor Total da Carteira</p>
                </div>
              </Card>

              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-emerald-500/50 group">
                <div className="p-6 text-center">
                  <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-emerald-500/25">
                    <FireIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-100 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                    ${stakingRewards.toLocaleString()}
                  </h3>
                  <p className="text-gray-400 font-medium">Recompensas de Staking</p>
                </div>
              </Card>

              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500/50 group">
                <div className="p-6 text-center">
                  <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-purple-500/25">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-100 mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {totalYield.toFixed(1)}%
                  </h3>
                  <p className="text-gray-400 font-medium">Yield Total Anual</p>
                </div>
              </Card>

              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-yellow-500/50 group">
                <div className="p-6 text-center">
                  <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-yellow-500/25">
                    <StarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-100 mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    +12.5%
                  </h3>
                  <p className="text-gray-400 font-medium">Performance Mensal</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Crypto Holdings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Crypto Holdings */}
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Criptomoedas</h2>
                    <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                      <span>Ver Todas</span>
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {cryptoHoldings.map((crypto, index) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300 group hover:scale-105">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${crypto.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-white font-bold text-lg">{crypto.symbol}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-100">{crypto.symbol}</p>
                            <p className="text-sm text-gray-400">{crypto.amount} {crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-100">${crypto.value.toLocaleString()}</p>
                          <p className={`text-sm font-semibold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'} bg-${crypto.change >= 0 ? 'green' : 'red'}-400/20 px-2 py-1 rounded-full`}>
                            {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Staking Pools */}
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Pools de Staking</h2>
                    <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                      <span>Stake Agora</span>
                      <RocketLaunchIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stakingPools.map((pool, index) => (
                      <div key={pool.name} className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300 group hover:scale-105 border border-gray-700 hover:border-cyan-500/50">
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-100 mb-2">{pool.name}</h3>
                          <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${pool.color} bg-clip-text text-transparent`}>
                            {pool.apy}%
                          </div>
                          <p className="text-sm text-gray-400 mb-3">APY</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">TVL:</span>
                              <span className="text-gray-200">${pool.tvl}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Staked:</span>
                              <span className="text-gray-200">${pool.staked.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-8">
              {/* Recent Transactions */}
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Transações Recentes</h2>
                  
                  <div className="space-y-4">
                    {recentTransactions.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300 group">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            tx.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status === 'success' ? (
                              <SparklesIcon className="h-4 w-4" />
                            ) : (
                              <CpuChipIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-100">{tx.type}</p>
                            <p className="text-sm text-gray-400">{tx.asset}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount}
                          </p>
                          <p className="text-xs text-gray-400">{tx.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Ações Rápidas</h2>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 transform group">
                      <span className="flex items-center justify-center space-x-2">
                        <RocketLaunchIcon className="h-5 w-5 group-hover:animate-bounce" />
                        <span>Stake AGROISYNC</span>
                      </span>
                    </button>
                    
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 transform group">
                      <span className="flex items-center justify-center space-x-2">
                        <FireIcon className="h-5 w-5 group-hover:animate-pulse" />
                        <span>Harvest Rewards</span>
                      </span>
                    </button>
                    
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform group">
                      <span className="flex items-center justify-center space-x-2">
                        <ChartBarIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Ver Gráficos</span>
                      </span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Performance Chart Preview */}
              <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Performance</h2>
                  
                  <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl p-8 text-center border border-cyan-500/20">
                    <div className="text-cyan-400 text-3xl font-bold mb-4">
                      📈 Gráfico Avançado
                    </div>
                    <div className="text-gray-400 text-lg mb-4">
                      Análise completa da sua carteira
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">+24.5%</div>
                        <div className="text-gray-400">Este Mês</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">+156.8%</div>
                        <div className="text-gray-400">Este Ano</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard
