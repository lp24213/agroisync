import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
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

const Dashboard: NextPage = () => {
  const { t } = useI18n();
  
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
        <title>{t('dashboard_title')} - {t('app_name')}</title>
        <meta name="description" content={t('dashboard_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen cosmic-background text-white relative overflow-hidden">
        {/* Efeitos cósmicos de fundo */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Nebulosas flutuantes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-4000"></div>
          
          {/* Portais quânticos */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full animate-quantum-orbital animation-delay-4000"></div>
          
          {/* Ondas de energia cósmica */}
          <div className="absolute top-1/2 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-1/3 right-0 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-cosmic-wave animation-delay-2000"></div>
          
          {/* Estrelas cintilantes */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-sparkle animation-delay-100"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle animation-delay-3000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-sparkle animation-delay-4000"></div>
          
          {/* Partículas flutuantes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-black text-cosmic-glow mb-4">
                  {t('dashboard_header_title')}
                </h1>
                <p className="text-xl text-purple-silver">
                  {t('dashboard_header_subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-400/30 hover:to-blue-400/30 hover:border-cyan-400/50 transition-all duration-300 group hover:scale-110">
                  <BellIcon className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300" />
                </button>
                <button className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-400/30 hover:to-pink-400/30 hover:border-purple-400/50 transition-all duration-300 group hover:scale-110">
                  <CogIcon className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                </button>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl px-4 py-2 group hover:scale-105 transition-transform duration-300">
                  <UserCircleIcon className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-cyan-400 font-semibold">{t('dashboard_user_level')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="cosmic-card p-6 text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-cyan-500/25">
                  <CurrencyDollarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-cosmic-glow mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  ${portfolioValue.toLocaleString()}
                </h3>
                <p className="text-purple-silver font-medium">{t('dashboard_portfolio_value')}</p>
              </div>

              <div className="cosmic-card p-6 text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-emerald-500/25">
                  <FireIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-cosmic-glow mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                  ${stakingRewards.toLocaleString()}
                </h3>
                <p className="text-purple-silver font-medium">{t('dashboard_staking_rewards')}</p>
              </div>

              <div className="cosmic-card p-6 text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-purple-500/25">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-cosmic-glow mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {totalYield.toFixed(1)}%
                </h3>
                <p className="text-purple-silver font-medium">{t('dashboard_total_yield')}</p>
              </div>

              <div className="cosmic-card p-6 text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-yellow-500/25">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-cosmic-glow mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  +12.5%
                </h3>
                <p className="text-purple-silver font-medium">{t('dashboard_monthly_performance')}</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Crypto Holdings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Crypto Holdings */}
              <div className="cosmic-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-cosmic-glow">{t('dashboard_crypto_holdings')}</h2>
                  <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group hover:scale-105">
                    <span>{t('dashboard_view_all')}</span>
                    <ArrowTrendingUpIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {cryptoHoldings.map((crypto, index) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-xl hover:from-gray-700/50 hover:to-gray-600/50 hover:border-cyan-500/30 transition-all duration-300 group hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${crypto.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <span className="text-white font-bold text-lg">{crypto.symbol}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-cosmic-glow">{crypto.symbol}</p>
                          <p className="text-sm text-purple-silver">{crypto.amount} {crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cosmic-glow">${crypto.value.toLocaleString()}</p>
                        <p className={`text-sm font-semibold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'} bg-${crypto.change >= 0 ? 'green' : 'red'}-400/20 px-2 py-1 rounded-full`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staking Pools */}
              <div className="cosmic-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-cosmic-glow">{t('dashboard_staking_pools')}</h2>
                  <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group hover:scale-105">
                    <span>{t('dashboard_stake_now')}</span>
                    <RocketLaunchIcon className="h-4 w-4 group-hover:animate-bounce" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stakingPools.map((pool, index) => (
                    <div key={pool.name} className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-xl hover:from-gray-700/50 hover:to-gray-600/50 hover:border-cyan-500/30 transition-all duration-300 group hover:scale-105">
                      <div className="text-center">
                        <h3 className="font-semibold text-cosmic-glow mb-2">{pool.name}</h3>
                        <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${pool.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                          {pool.apy}%
                        </div>
                        <p className="text-sm text-purple-silver mb-3">{t('dashboard_apy')}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-silver">{t('dashboard_tvl')}:</span>
                            <span className="text-cosmic-glow">${pool.tvl}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-silver">{t('dashboard_staked')}:</span>
                            <span className="text-cosmic-glow">${pool.staked.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-8">
              {/* Recent Transactions */}
              <div className="cosmic-card p-6">
                <h2 className="text-2xl font-bold text-cosmic-glow mb-6">{t('dashboard_recent_transactions')}</h2>
                
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/30 rounded-lg hover:from-gray-700/50 hover:to-gray-600/50 hover:border-cyan-500/20 transition-all duration-300 group hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        } group-hover:scale-110 transition-transform duration-300`}>
                          {tx.status === 'success' ? (
                            <SparklesIcon className="h-4 w-4" />
                          ) : (
                            <CpuChipIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-cosmic-glow">{tx.type}</p>
                          <p className="text-sm text-purple-silver">{tx.asset}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount}
                        </p>
                        <p className="text-xs text-purple-silver">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="cosmic-card p-6">
                <h2 className="text-2xl font-bold text-cosmic-glow mb-6">{t('dashboard_quick_actions')}</h2>
                
                <div className="space-y-3">
                  <button className="w-full cosmic-button py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 transform group">
                    <span className="flex items-center justify-center space-x-2">
                      <RocketLaunchIcon className="h-5 w-5 group-hover:animate-bounce" />
                      <span>{t('dashboard_action_stake')}</span>
                    </span>
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 transform group">
                    <span className="flex items-center justify-center space-x-2">
                      <FireIcon className="h-5 w-5 group-hover:animate-pulse" />
                      <span>{t('dashboard_action_harvest')}</span>
                    </span>
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform group">
                    <span className="flex items-center justify-center space-x-2">
                      <ChartBarIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{t('dashboard_action_charts')}</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Performance Chart Preview */}
              <div className="cosmic-card p-6">
                <h2 className="text-2xl font-bold text-cosmic-glow mb-6">{t('dashboard_performance')}</h2>
                
                <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl p-8 text-center border border-cyan-500/20 relative overflow-hidden">
                  {/* Efeitos de fundo cósmicos */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-cosmic-pulse"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                  
                  <div className="text-cyan-400 text-3xl font-bold mb-4 relative z-10">
                    📈 {t('dashboard_chart_title')}
                  </div>
                  <div className="text-purple-silver text-lg mb-4 relative z-10">
                    {t('dashboard_chart_subtitle')}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 animate-energy-pulse">+24.5%</div>
                      <div className="text-purple-silver">{t('dashboard_this_month')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 animate-energy-pulse animation-delay-500">+156.8%</div>
                      <div className="text-purple-silver">{t('dashboard_this_year')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard
