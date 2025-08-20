import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  LockClosedIcon,
  LockOpenIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

interface StakingPool {
  id: string
  name: string
  description: string
  apy: number
  tvl: number
  minStake: number
  maxStake: number
  lockPeriod: number
  totalStaked: number
  userStaked: number
  userRewards: number
  status: 'active' | 'locked' | 'full'
  risk: 'low' | 'medium' | 'high'
  features: string[]
  icon: string
}

interface StakingHistory {
  id: string
  type: 'stake' | 'unstake' | 'claim'
  amount: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
  pool: string
}

const Staking: NextPage = () => {
  const { t } = useI18n()
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([])
  const [stakingHistory, setStakingHistory] = useState<StakingHistory[]>([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)

  // Dados simulados de pools de staking
  const mockStakingPools: StakingPool[] = [
    {
      id: '1',
      name: 'Pool AgroSync Premium',
      description: 'Pool de alta performance com tecnologia blockchain avançada e segurança máxima',
      apy: 24.5,
      tvl: 2500000,
      minStake: 100,
      maxStake: 100000,
      lockPeriod: 30,
      totalStaked: 1800000,
      userStaked: 5000,
      userRewards: 187.5,
      status: 'active',
      risk: 'low',
      features: ['Segurança máxima', 'Liquidez garantida', 'Suporte 24/7', 'Auditoria externa'],
      icon: '🌱'
    },
    {
      id: '2',
      name: 'Pool Solana High Yield',
      description: 'Pool especializada em Solana com yield otimizado e estratégias avançadas',
      apy: 32.8,
      tvl: 1800000,
      minStake: 50,
      maxStake: 50000,
      lockPeriod: 90,
      totalStaked: 1500000,
      userStaked: 2500,
      userRewards: 182.0,
      status: 'locked',
      risk: 'medium',
      features: ['Yield otimizado', 'Estratégias avançadas', 'Composição automática', 'Hedging'],
      icon: '◎'
    },
    {
      id: '3',
      name: 'Pool Ethereum Liquid Staking',
      description: 'Staking líquido de Ethereum com flexibilidade total e yield competitivo',
      apy: 18.7,
      tvl: 3200000,
      minStake: 200,
      maxStake: 200000,
      lockPeriod: 0,
      totalStaked: 2800000,
      userStaked: 10000,
      userRewards: 217.5,
      status: 'active',
      risk: 'low',
      features: ['Liquidez total', 'Sem período de lock', 'Yield competitivo', 'Integração DeFi'],
      icon: 'Ξ'
    },
    {
      id: '4',
      name: 'Pool Bitcoin Yield Farming',
      description: 'Pool inovadora que combina staking de Bitcoin com estratégias de yield farming',
      apy: 28.3,
      tvl: 950000,
      minStake: 75,
      maxStake: 75000,
      lockPeriod: 60,
      totalStaked: 800000,
      userStaked: 0,
      userRewards: 0,
      status: 'active',
      risk: 'high',
      features: ['Yield farming', 'Estratégias inovadoras', 'Alto potencial', 'Risco elevado'],
      icon: '₿'
    },
    {
      id: '5',
      name: 'Pool Cardano Staking',
      description: 'Pool dedicada ao ecossistema Cardano com validação descentralizada',
      apy: 15.2,
      tvl: 680000,
      minStake: 100,
      maxStake: 100000,
      lockPeriod: 0,
      totalStaked: 600000,
      userStaked: 0,
      userRewards: 0,
      status: 'active',
      risk: 'low',
      features: ['Validação descentralizada', 'Governança participativa', 'Sustentabilidade', 'Baixo risco'],
      icon: '₳'
    }
  ]

  // Dados simulados de histórico
  const mockStakingHistory: StakingHistory[] = [
    {
      id: '1',
      type: 'stake',
      amount: 5000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x1234...5678',
      pool: 'Pool AgroSync Premium'
    },
    {
      id: '2',
      type: 'claim',
      amount: 187.5,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x8765...4321',
      pool: 'Pool AgroSync Premium'
    },
    {
      id: '3',
      type: 'stake',
      amount: 2500,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x9876...5432',
      pool: 'Pool Solana High Yield'
    },
    {
      id: '4',
      type: 'unstake',
      amount: 1000,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x5432...1098',
      pool: 'Pool Ethereum Liquid Staking'
    }
  ]

  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/staking?userId=user-123') // TODO: Pegar do contexto de autenticação
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setStakingPools(data.data.stakingPools || [])
            setStakingHistory(data.data.stakingHistory || [])
            
            // Calcular totais
            const totalStakedValue = (data.data.stakingPools || []).reduce((sum: number, pool: any) => sum + pool.userStaked, 0)
            setTotalStaked(totalStakedValue)
            
            const totalRewardsValue = (data.data.stakingPools || []).reduce((sum: number, pool: any) => sum + pool.userRewards, 0)
            setTotalRewards(totalRewardsValue)
          } else {
            // Fallback para dados mock se a API falhar
            setFallbackData()
          }
        } else {
          // Fallback para dados mock se a API falhar
          setFallbackData()
        }
      } catch (error) {
        console.error('Erro ao carregar dados de staking:', error)
        // Fallback para dados mock em caso de erro
        setFallbackData()
      } finally {
        setLoading(false)
      }
    }

    const setFallbackData = () => {
      setStakingPools(mockStakingPools)
      setStakingHistory(mockStakingHistory)
      
      // Calcular totais
      const totalStakedValue = mockStakingPools.reduce((sum, pool) => sum + pool.userStaked, 0)
      setTotalStaked(totalStakedValue)
      
      const totalRewardsValue = mockStakingPools.reduce((sum, pool) => sum + pool.userRewards, 0)
      setTotalRewards(totalRewardsValue)
    }

    fetchStakingData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Baixo'
      case 'medium': return 'Médio'
      case 'high': return 'Alto'
      default: return 'Desconhecido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'locked': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'full': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'locked': return 'Bloqueado'
      case 'full': return 'Lotado'
      default: return 'Desconhecido'
    }
  }

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) return
    
    const amount = parseFloat(stakeAmount)
    if (amount < selectedPool.minStake || amount > selectedPool.maxStake) {
      alert('Valor fora dos limites permitidos')
      return
    }

    // Simular stake
    setStakingPools(prev => prev.map(pool =>
      pool.id === selectedPool.id
        ? { ...pool, userStaked: pool.userStaked + amount }
        : pool
    ))

    setTotalStaked(prev => prev + amount)
    setStakeAmount('')
    setShowStakeModal(false)
    setSelectedPool(null)
  }

  const handleUnstake = () => {
    if (!selectedPool || !unstakeAmount) return
    
    const amount = parseFloat(unstakeAmount)
    if (amount > selectedPool.userStaked) {
      alert('Valor maior que o staked')
      return
    }

    // Simular unstake
    setStakingPools(prev => prev.map(pool =>
      pool.id === selectedPool.id
        ? { ...pool, userStaked: pool.userStaked - amount }
        : pool
    ))

    setTotalStaked(prev => prev - amount)
    setUnstakeAmount('')
    setShowUnstakeModal(false)
    setSelectedPool(null)
  }

  const claimRewards = (poolId: string) => {
    setStakingPools(prev => prev.map(pool =>
      pool.id === poolId
        ? { ...pool, userRewards: 0 }
        : pool
    ))

    setTotalRewards(prev => prev - (stakingPools.find(p => p.id === poolId)?.userRewards || 0))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">{t('staking_loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('staking_title')} - {t('app_name')}</title>
        <meta name="description" content={t('staking_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header da Página */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('staking_title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('staking_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Resumo do Staking */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('staking_total_staked')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalStaked)}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <LockClosedIcon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+15.3% este mês</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('staking_total_rewards')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalRewards)}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <StarIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <FireIcon className="h-4 w-4 mr-1" />
                <span>APY médio: 24.5%</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{t('staking_active_pools')}</p>
                  <p className="text-2xl font-bold text-white">{stakingPools.filter(p => p.status === 'active').length}</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <ChartBarIcon className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-cyan-400 text-sm">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                <span>Segurança máxima</span>
              </div>
            </div>
          </div>

          {/* Pools de Staking */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <StarIcon className="h-6 w-6 mr-2 text-purple-400" />
              {t('staking_available_pools')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map(pool => (
                <div
                  key={pool.id}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  {/* Header do Pool */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{pool.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                        <p className="text-sm text-gray-400">{pool.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(pool.status)}`}>
                        {getStatusLabel(pool.status)}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full border ${getRiskColor(pool.risk)}`}>
                        {getRiskLabel(pool.risk)}
                      </span>
                    </div>
                  </div>

                  {/* Estatísticas do Pool */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">{formatPercentage(pool.apy)}</div>
                      <div className="text-xs text-gray-400">APY</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="text-lg font-bold text-white">{formatCurrency(pool.tvl)}</div>
                      <div className="text-xs text-gray-400">TVL</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="text-lg font-bold text-white">{formatNumber(pool.totalStaked)}</div>
                      <div className="text-xs text-gray-400">Total Staked</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="text-lg font-bold text-white">{formatCurrency(pool.minStake)}</div>
                      <div className="text-xs text-gray-400">Min. Stake</div>
                    </div>
                  </div>

                  {/* Informações do Usuário */}
                  {pool.userStaked > 0 && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-400">Seu Stake</span>
                        <span className="text-sm text-white">{formatCurrency(pool.userStaked)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Recompensas Acumuladas</span>
                        <span className="text-sm text-green-400">{formatCurrency(pool.userRewards)}</span>
                      </div>
                    </div>
                  )}

                  {/* Features do Pool */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3">Características</h4>
                    <div className="flex flex-wrap gap-2">
                      {pool.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex space-x-3">
                    {pool.userStaked > 0 ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPool(pool)
                            setShowUnstakeModal(true)
                          }}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-xl font-semibold border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <LockOpenIcon className="h-4 w-4" />
                          <span>Unstake</span>
                        </button>
                        <button
                          onClick={() => claimRewards(pool.id)}
                          disabled={pool.userRewards === 0}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-4 rounded-xl font-semibold border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <StarIcon className="h-4 w-4" />
                          <span>Claim</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPool(pool)
                          setShowStakeModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <LockClosedIcon className="h-5 w-5" />
                        <span>Stake Agora</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico de Staking */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <ClockIcon className="h-6 w-6 mr-2 text-purple-400" />
              {t('staking_history')}
            </h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="space-y-4">
                {stakingHistory.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'stake' ? 'bg-green-500/20 text-green-400' :
                        transaction.type === 'unstake' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {transaction.type === 'stake' ? <LockClosedIcon className="h-4 w-4" /> :
                         transaction.type === 'unstake' ? <LockOpenIcon className="h-4 w-4" /> :
                         <StarIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white capitalize">
                          {transaction.type === 'stake' ? 'Stake' :
                           transaction.type === 'unstake' ? 'Unstake' :
                           'Claim'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.pool}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'stake' ? 'text-green-400' :
                        transaction.type === 'unstake' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {transaction.type === 'stake' ? '+' : transaction.type === 'unstake' ? '-' : '+'}{formatCurrency(transaction.amount)}
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
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Modal de Stake */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-96 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Stake em {selectedPool.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Valor para Stake</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder={`Min: ${formatCurrency(selectedPool.minStake)}`}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                APY: {formatPercentage(selectedPool.apy)} • Lock: {selectedPool.lockPeriod} dias
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStake}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirmar Stake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Unstake */}
      {showUnstakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-96 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Unstake de {selectedPool.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Valor para Unstake</label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder={`Max: ${formatCurrency(selectedPool.userStaked)}`}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Stake atual: {formatCurrency(selectedPool.userStaked)}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUnstakeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUnstake}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Unstake
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Staking
