import { NextPage } from 'next'
import Head from 'next/head'
import Card from '@/components/ui/Card'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon,
  LockClosedIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const Staking: NextPage = () => {
  const stakingPools = [
    {
      id: 1,
      name: 'AGRO Token Staking',
      apy: 12.5,
      totalStaked: '2.5M AGRO',
      yourStake: '15K AGRO',
      rewards: '1.2K AGRO',
      image: '/images/staking-farming.svg'
    },
    {
      id: 2,
      name: 'ETH/AGRO Liquidity Pool',
      apy: 18.2,
      totalStaked: '1.8M LP',
      yourStake: '8.5K LP',
      rewards: '2.1K AGRO',
      image: '/images/futuristic-farm.svg'
    },
    {
      id: 3,
      name: 'BTC/AGRO Farming',
      apy: 22.8,
      totalStaked: '950K LP',
      yourStake: '12K LP',
      rewards: '3.8K AGRO',
      image: '/images/cyber-defense.svg'
    }
  ]

  const stakingStats = [
    { label: 'Total Staked', value: '5.25M AGRO', change: '+15.2%', changeType: 'positive' },
    { label: 'Total Rewards', value: '125K AGRO', change: '+8.7%', changeType: 'positive' },
    { label: 'APY Médio', value: '17.8%', change: '+2.1%', changeType: 'positive' },
    { label: 'Usuários Ativos', value: '1,250+', change: '+12.3%', changeType: 'positive' }
  ]

  return (
    <>
      <Head>
        <title>Staking & Farming - AGROISYNC</title>
        <meta name="description" content="Sistema avançado de staking e farming para maximizar seus retornos na plataforma AGROISYNC" />
      </Head>

      <div className="min-h-screen bg-black text-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
              Staking & Farming
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Maximize seus retornos com nosso sistema avançado de staking e farming. 
              Ganhe recompensas passivas enquanto apoia a rede AGROISYNC.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stakingStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">{stat.value}</h3>
                  <p className="text-gray-400 mb-2">{stat.label}</p>
                  <div className={`inline-flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Staking Pools */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
              Pools de Staking Disponíveis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {stakingPools.map((pool) => (
                <Card key={pool.id} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 enhanced-shadow">
                  <div className="text-center p-6">
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={pool.image} 
                        alt={pool.name}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-4">{pool.name}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">APY:</span>
                        <span className="text-2xl font-bold text-green-400">{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Staked:</span>
                        <span className="text-gray-100 font-medium">{pool.totalStaked}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Seu Stake:</span>
                        <span className="text-gray-100 font-medium">{pool.yourStake}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Recompensas:</span>
                        <span className="text-green-400 font-medium">{pool.rewards}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-slate-300 text-black px-4 py-2 rounded-lg font-semibold hover:from-blue-400 hover:to-slate-200 transition-all duration-200">
                        Stake
                      </button>
                      <button className="flex-1 border border-blue-400 text-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-400 hover:text-black transition-all duration-200">
                        Unstake
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
              Como Funciona o Staking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center enhanced-shadow">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3">1. Stake seus Tokens</h3>
                  <p className="text-gray-400">
                    Bloqueie seus AGRO tokens em um dos pools disponíveis para começar a ganhar recompensas
                  </p>
                </div>
              </Card>

              <Card className="text-center enhanced-shadow">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FireIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3">2. Ganhe Recompensas</h3>
                  <p className="text-gray-400">
                    Receba recompensas automaticamente baseadas no APY do pool e no tempo de staking
                  </p>
                </div>
              </Card>

              <Card className="text-center enhanced-shadow">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3">3. Compostagem</h3>
                  <p className="text-gray-400">
                    Reinvesta suas recompensas para maximizar os retornos com juros compostos
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
              Benefícios do Staking AGROISYNC
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="enhanced-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-4">Recompensas Passivas</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Ganhe até 25% APY em recompensas</li>
                    <li>• Pagamentos automáticos a cada bloco</li>
                    <li>• Sem necessidade de trading ativo</li>
                    <li>• Compostagem automática disponível</li>
                  </ul>
                </div>
              </Card>

              <Card className="enhanced-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-4">Segurança e Transparência</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Smart contracts auditados</li>
                    <li>• Liquidez sempre disponível</li>
                    <li>• Governança descentralizada</li>
                    <li>• Transparência total das operações</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-900 to-purple-900 enhanced-shadow">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-100 mb-4">
                  Pronto para Começar a Ganhar?
                </h3>
                <p className="text-gray-300 mb-6">
                  Junte-se aos milhares de usuários que já estão ganhando recompensas 
                  com o staking AGROISYNC
                </p>
                <button className="bg-white text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform">
                  Começar Staking Agora
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default Staking
