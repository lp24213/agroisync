import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { 
  LockClosedIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface StakingPool {
  id: string
  name: string
  apy: string
  totalStaked: string
  minStake: string
  maxStake: string
  lockPeriod: string
  rewards: string
}

interface UserStake {
  id: string
  poolId: string
  amount: string
  startDate: string
  endDate: string
  rewards: string
  status: 'active' | 'locked' | 'completed'
}

const Staking: NextPage = () => {
  const [pools, setPools] = useState<StakingPool[]>([])
  const [userStakes, setUserStakes] = useState<UserStake[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPool, setSelectedPool] = useState<string>('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [showStakeModal, setShowStakeModal] = useState(false)

  useEffect(() => {
    fetchStakingData()
  }, [])

  const fetchStakingData = async () => {
    try {
      const [poolsResponse, stakesResponse] = await Promise.all([
        fetch('/api/staking'),
        fetch('/api/staking/user-stakes')
      ])
      
      const poolsData = await poolsResponse.json()
      const stakesData = await stakesResponse.json()
      
      if (poolsData.success) {
        setPools(poolsData.data.pools)
      }
      
      if (stakesData.success) {
        setUserStakes(stakesData.data.stakes || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados de staking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return
    
    try {
      const response = await fetch('/api/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: selectedPool,
          amount: stakeAmount,
          walletAddress: '0x1234...5678' // Mock wallet
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setShowStakeModal(false)
        setStakeAmount('')
        setSelectedPool('')
        fetchStakingData() // Refresh data
      }
    } catch (error) {
      console.error('Erro ao fazer stake:', error)
    }
  }

  const totalStaked = userStakes.reduce((sum, stake) => sum + parseFloat(stake.amount), 0)
  const totalRewards = userStakes.reduce((sum, stake) => sum + parseFloat(stake.rewards), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Staking - AgroSync</title>
        <meta name="description" content="Faça stake dos seus tokens AGRO e ganhe recompensas" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Staking de Tokens AGRO
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ganhe recompensas fazendo stake dos seus tokens e participe da governança da plataforma
              </p>
            </div>
          </div>
        </section>

        {/* User Stats */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="p-6">
                  <LockClosedIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {totalStaked.toLocaleString()} AGRO
                  </h3>
                  <p className="text-gray-600">Total em Stake</p>
                </div>
              </Card>
              
              <Card className="text-center">
                <div className="p-6">
                  <CurrencyDollarIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {totalRewards.toLocaleString()} AGRO
                  </h3>
                  <p className="text-gray-600">Recompensas Acumuladas</p>
                </div>
              </Card>
              
              <Card className="text-center">
                <div className="p-6">
                  <ChartBarIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {userStakes.length}
                  </h3>
                  <p className="text-gray-600">Stakes Ativos</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Staking Pools */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Pools de Staking Disponíveis</h2>
              <Button onClick={() => setShowStakeModal(true)}>
                Novo Stake
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pools.map((pool) => (
                <Card key={pool.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{pool.name}</h3>
                      <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">APY:</span>
                        <span className="font-semibold text-green-600">{pool.apy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Stakeado:</span>
                        <span className="font-semibold">{pool.totalStaked}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stake Mínimo:</span>
                        <span className="font-semibold">{pool.minStake}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Período de Lock:</span>
                        <span className="font-semibold">{pool.lockPeriod}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedPool(pool.id)
                        setShowStakeModal(true)
                      }}
                    >
                      Fazer Stake
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* User Stakes */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Meus Stakes</h2>
            
            {userStakes.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-500 text-lg">Você ainda não possui stakes ativos</p>
                <Button className="mt-4" onClick={() => setShowStakeModal(true)}>
                  Fazer Primeiro Stake
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userStakes.map((stake) => (
                  <Card key={stake.id}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Stake #{stake.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stake.status === 'active' ? 'bg-green-100 text-green-800' :
                          stake.status === 'locked' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stake.status === 'active' ? 'Ativo' :
                           stake.status === 'locked' ? 'Bloqueado' : 'Completo'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantidade:</span>
                          <span className="font-semibold">{stake.amount} AGRO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recompensas:</span>
                          <span className="font-semibold text-green-600">{stake.rewards} AGRO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Início:</span>
                          <span className="font-semibold">{new Date(stake.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fim:</span>
                          <span className="font-semibold">{new Date(stake.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stake Modal */}
        {showStakeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Stake</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pool de Staking
                  </label>
                  <select
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione uma pool</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name} - {pool.apy} APY
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade (AGRO)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowStakeModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleStake}
                  disabled={!selectedPool || !stakeAmount}
                >
                  Confirmar Stake
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Staking
