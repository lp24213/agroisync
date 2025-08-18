import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface DashboardStats {
  totalRevenue: string
  totalUsers: number
  totalNFTs: number
  totalStaked: string
  revenueChange: number
  usersChange: number
  nftsChange: number
  stakingChange: number
}

interface RecentActivity {
  id: string
  type: 'nft_minted' | 'stake_created' | 'transaction' | 'user_registered'
  description: string
  amount?: string
  timestamp: string
  user: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}

const Dashboard: NextPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetch(`/api/analytics?period=${selectedPeriod}`),
        fetch('/api/analytics/recent-activity')
      ])
      
      const statsData = await statsResponse.json()
      const activityData = await activityResponse.json()
      
      if (statsData.success) {
        setStats(statsData.data.stats)
      }
      
      if (activityData.success) {
        setRecentActivity(activityData.data.activities)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'nft_minted':
        return <CubeIcon className="h-5 w-5 text-blue-600" />
      case 'stake_created':
        return <ChartBarIcon className="h-5 w-5 text-green-600" />
      case 'transaction':
        return <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
      case 'user_registered':
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />
      default:
        return <CubeIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'nft_minted':
        return 'bg-blue-100 text-blue-800'
      case 'stake_created':
        return 'bg-green-100 text-green-800'
      case 'transaction':
        return 'bg-yellow-100 text-yellow-800'
      case 'user_registered':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'nft_minted':
        return 'NFT Mintado'
      case 'stake_created':
        return 'Stake Criado'
      case 'transaction':
        return 'Transação'
      case 'user_registered':
        return 'Usuário Registrado'
      default:
        return type
    }
  }

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
        <title>Dashboard - AgroSync</title>
        <meta name="description" content="Painel de controle e análises da plataforma AgroSync" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                  Visão geral da plataforma AgroSync
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="1y">Último ano</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalRevenue || 'R$ 0,00'}</p>
                    </div>
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center">
                    {stats?.revenueChange && stats.revenueChange >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stats?.revenueChange && stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats?.revenueChange ? Math.abs(stats.revenueChange) : 0}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                  </div>
                </div>
              </Card>

              {/* Users Card */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                    </div>
                    <UserGroupIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-4 flex items-center">
                    {stats?.usersChange && stats.usersChange >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stats?.usersChange && stats.usersChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats?.usersChange ? Math.abs(stats.usersChange) : 0}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                  </div>
                </div>
              </Card>

              {/* NFTs Card */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">NFTs Criados</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalNFTs || 0}</p>
                    </div>
                    <CubeIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-4 flex items-center">
                    {stats?.nftsChange && stats.nftsChange >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stats?.nftsChange && stats.nftsChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats?.nftsChange ? Math.abs(stats.nftsChange) : 0}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                  </div>
                </div>
              </Card>

              {/* Staking Card */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total em Stake</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalStaked || '0 AGRO'}</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="mt-4 flex items-center">
                    {stats?.stakingChange && stats.stakingChange >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stats?.stakingChange && stats.stakingChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats?.stakingChange ? Math.abs(stats.stakingChange) : 0}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Período</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de receita será implementado</p>
                  </div>
                </div>
              </Card>

              {/* Users Chart */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Usuários</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de usuários será implementado</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Atividade Recente</h2>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
            
            <Card>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma atividade recente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{activity.user}</span>
                            <span>•</span>
                            <span>{getActivityLabel(activity.type)}</span>
                            {activity.amount && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-green-600">{activity.amount}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <CubeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Criar NFT</h3>
                  <p className="text-gray-600 mb-4">Tokenize seus ativos agrícolas</p>
                  <Button>Começar</Button>
                </div>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <ChartBarIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fazer Stake</h3>
                  <p className="text-gray-600 mb-4">Ganhe recompensas com seus tokens</p>
                  <Button>Stake</Button>
                </div>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <UserGroupIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Convidar Amigos</h3>
                  <p className="text-gray-600 mb-4">Expanda sua rede agrícola</p>
                  <Button>Convidar</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Dashboard
