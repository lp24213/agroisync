import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

interface CryptoAsset {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  change7d: number
  balance: number
  value: number
  icon: string
}

interface StakingPool {
  id: string
  name: string
  apy: number
  tvl: number
  stakedTokens: number
  rewards: number
  lockPeriod: number
  status: 'active' | 'locked' | 'completed'
}

interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'stake' | 'unstake' | 'reward' | 'transfer'
  asset: string
  amount: number
  value: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  hash?: string
}

const Dashboard: NextPage = () => {
  const { t } = useI18n()
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [totalYield, setTotalYield] = useState(0)
  const [monthlyPerformance, setMonthlyPerformance] = useState(0)
  const [annualPerformance, setAnnualPerformance] = useState(0)
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([])
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Dados simulados de criptomoedas
  const mockCryptoAssets: CryptoAsset[] = [
    {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000.00,
      change24h: 2.5,
      change7d: 8.3,
      balance: 0.25,
      value: 11250.00,
      icon: '₿'
    },
    {
      id: '2',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3200.00,
      change24h: -1.2,
      change7d: 12.7,
      balance: 2.5,
      value: 8000.00,
      icon: 'Ξ'
    },
    {
      id: '3',
      symbol: 'SOL',
      name: 'Solana',
      price: 95.00,
      change24h: 5.8,
      change7d: 25.4,
      balance: 50,
      value: 4750.00,
      icon: '◎'
    },
    {
      id: '4',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.85,
      change24h: -0.8,
      change7d: 3.2,
      balance: 5000,
      value: 4250.00,
      icon: '₳'
    },
    {
      id: '5',
      symbol: 'DOT',
      name: 'Polkadot',
      price: 18.50,
      change24h: 1.5,
      change7d: 7.8,
      balance: 200,
      value: 3700.00,
      icon: '●'
    }
  ]

  // Dados simulados de pools de staking
  const mockStakingPools: StakingPool[] = [
    {
      id: '1',
      name: 'Pool AgroSync Premium',
      apy: 12.5,
      tvl: 2500000,
      stakedTokens: 15000,
      rewards: 187.5,
      lockPeriod: 30,
      status: 'active'
    },
    {
      id: '2',
      name: 'Pool Solana High Yield',
      apy: 18.2,
      tvl: 1800000,
      stakedTokens: 12000,
      rewards: 182.0,
      lockPeriod: 90,
      status: 'locked'
    },
    {
      id: '3',
      name: 'Pool Ethereum Staking',
      apy: 8.7,
      tvl: 3200000,
      stakedTokens: 25000,
      rewards: 217.5,
      lockPeriod: 0,
      status: 'active'
    }
  ]

  // Dados simulados de transações
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'stake',
      asset: 'AGRO',
      amount: 1000,
      value: 5000.00,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: 'completed',
      hash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'reward',
      asset: 'SOL',
      amount: 25,
      value: 2375.00,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      status: 'completed'
    },
    {
      id: '3',
      type: 'buy',
      asset: 'BTC',
      amount: 0.1,
      value: 4500.00,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      status: 'completed',
      hash: '0x8765...4321'
    },
    {
      id: '4',
      type: 'unstake',
      asset: 'ETH',
      amount: 5,
      value: 16000.00,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      status: 'completed',
      hash: '0x9876...5432'
    }
  ]

    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard?userId=user-123') // TODO: Pegar do contexto de autenticação
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setCryptoAssets(data.data.cryptoAssets || [])
            setStakingPools(data.data.stakingPools || [])
            setRecentTransactions(data.data.recentTransactions || [])
            setPortfolioValue(data.data.portfolioValue || 0)
            setTotalRewards(data.data.totalRewards || 0)
            setTotalYield(data.data.totalYield || 0)
            setMonthlyPerformance(data.data.monthlyPerformance || 0)
            setAnnualPerformance(data.data.annualPerformance || 0)
          } else {
            // Fallback para dados mock se a API falhar
            setFallbackData()
          }
        } else {
          // Fallback para dados mock se a API falhar
          setFallbackData()
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        // Fallback para dados mock em caso de erro
        setFallbackData()
      } finally {
        setLoading(false)
      }
    }

    const setFallbackData = () => {
      setCryptoAssets(mockCryptoAssets)
      setStakingPools(mockStakingPools)
      setRecentTransactions(mockTransactions)
      
      const totalValue = mockCryptoAssets.reduce((sum, asset) => sum + asset.value, 0)
      setPortfolioValue(totalValue)

      const totalRewardsValue = mockStakingPools.reduce((sum, pool) => sum + pool.rewards, 0)
      setTotalRewards(totalRewardsValue)

      const totalYieldValue = mockStakingPools.reduce((sum, pool) => {
        const poolValue = (pool.stakedTokens / 100) * (pool.tvl / 1000000) * 1000
        return sum + (poolValue * pool.apy / 100)
      }, 0)
      setTotalYield(totalYieldValue)

      setMonthlyPerformance(8.5)
      setAnnualPerformance(42.3)
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy': return '🟢'
      case 'sell': return '🔴'
      case 'stake': return '🔒'
      case 'unstake': return '🔓'
      case 'reward': return '⭐'
      case 'transfer': return '↔️'
      default: return '📊'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'reward':
        return 'text-green-400'
      case 'sell':
      case 'unstake':
        return 'text-red-400'
      default:
        return 'text-blue-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">{t('dashboard_loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('dashboard_title')} - {t('app_name')}</title>
        <meta name="description" content={t('dashboard_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header do Dashboard */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {t('dashboard_header_title')}
                </h1>
                <p className="text-gray-300">
                  {t('dashboard_header_subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <BellIcon className="h-6 w-6" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <CogIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('dashboard_portfolio_value')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>{formatPercentage(monthlyPerformance)} este mês</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('dashboard_staking_rewards')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalRewards)}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <StarIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>+12.5% APY</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('dashboard_total_yield')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalYield)}</p>
                </div>
                                 <div className="p-3 bg-cyan-500/20 rounded-xl">
                   <ArrowTrendingUpIcon className="h-6 w-6 text-cyan-400" />
                 </div>
              </div>
              <div className="mt-4 flex items-center text-cyan-400 text-sm">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>{formatPercentage(annualPerformance)} este ano</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('dashboard_user_level')}</p>
                  <p className="text-2xl font-bold text-white">Premium</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-yellow-400 text-sm">
                <span>Próximo nível: Diamond</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Criptomoedas */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-purple-400" />
                  {t('dashboard_crypto_holdings')}
                </h2>
                
                <div className="space-y-4">
                  {cryptoAssets.map(asset => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{asset.icon}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">{asset.symbol}</span>
                            <span className="text-sm text-gray-400">{asset.name}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {asset.balance} {asset.symbol}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatCurrency(asset.value)}</div>
                        <div className="text-sm text-gray-400">{formatCurrency(asset.price)}</div>
                        <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(asset.change24h)} 24h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pools de Staking */}
            <div>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <StarIcon className="h-6 w-6 mr-2 text-purple-400" />
                  {t('dashboard_staking_pools')}
                </h2>
                
                <div className="space-y-4">
                  {stakingPools.map(pool => (
                    <div
                      key={pool.id}
                      className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{pool.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pool.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          pool.status === 'locked' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {pool.status === 'active' ? 'Ativo' : pool.status === 'locked' ? 'Bloqueado' : 'Concluído'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">APY:</span>
                          <span className="text-green-400 font-semibold">{pool.apy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">TVL:</span>
                          <span className="text-white">{formatCurrency(pool.tvl)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Staked:</span>
                          <span className="text-white">{formatNumber(pool.stakedTokens)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recompensas:</span>
                          <span className="text-green-400">{formatCurrency(pool.rewards)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="mt-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-purple-400" />
                {t('dashboard_recent_transactions')}
              </h2>
              
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <div className="font-semibold text-white capitalize">
                          {transaction.type === 'buy' ? 'Compra' :
                           transaction.type === 'sell' ? 'Venda' :
                           transaction.type === 'stake' ? 'Stake' :
                           transaction.type === 'unstake' ? 'Unstake' :
                           transaction.type === 'reward' ? 'Recompensa' :
                           'Transferência'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.asset} • {transaction.amount}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {formatCurrency(transaction.value)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {transaction.timestamp.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        {transaction.status === 'completed' && <CheckCircleIcon className="h-3 w-3 text-green-400" />}
                        <span className="capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de Performance */}
          <div className="mt-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-purple-400" />
                  {t('dashboard_performance_chart')}
                </h2>
              
              <div className="h-64 bg-gray-700/30 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Gráfico de Performance</p>
                  <p className="text-sm">Integração com biblioteca de gráficos em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mt-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-6">{t('dashboard_quick_actions')}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💱</div>
                    <span className="text-sm font-medium text-white">Comprar</span>
                  </div>
                </button>
                
                <button className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔒</div>
                    <span className="text-sm font-medium text-white">Stake</span>
                  </div>
                </button>
                
                <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</div>
                    <span className="text-sm font-medium text-white">Analisar</span>
                  </div>
                </button>
                
                <button className="p-4 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📈</div>
                    <span className="text-sm font-medium text-white">Relatórios</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Chatbot */}
      <Chatbot />
    </>
  )
}

export default Dashboard
