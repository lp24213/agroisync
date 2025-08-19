import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Staking: NextPage = () => {
  const { t } = useI18n();
  
  const stakingPools = [
    {
      id: 1,
      name: 'AGRO Token Staking',
      apy: 12.5,
      totalStaked: '2.5M AGRO',
      yourStake: '15K AGRO',
      rewards: '1.2K AGRO',
      image: '/images/staking-farming.svg',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 2,
      name: 'ETH/AGRO Liquidity Pool',
      apy: 18.2,
      totalStaked: '1.8M LP',
      yourStake: '8.5K LP',
      rewards: '2.1K AGRO',
      image: '/images/futuristic-farm.svg',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 3,
      name: 'BTC/AGRO Farming',
      apy: 22.8,
      totalStaked: '950K LP',
      yourStake: '12K LP',
      rewards: '3.8K AGRO',
      image: '/images/cyber-defense.svg',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const stakingStats = [
    { labelKey: 'staking_stats_total_staked', value: '5.25M AGRO', change: '+15.2%', changeType: 'positive' },
    { labelKey: 'staking_stats_total_rewards', value: '125K AGRO', change: '+8.7%', changeType: 'positive' },
    { labelKey: 'staking_stats_apy', value: '17.8%', change: '+2.1%', changeType: 'positive' },
    { labelKey: 'staking_stats_active_users', value: '1,250+', change: '+12.3%', changeType: 'positive' }
  ]

  return (
    <>
      <Head>
        <title>{t('staking_title')} - {t('app_name')}</title>
        <meta name="description" content={t('staking_subtitle')} />
      </Head>

      <div className="min-h-screen cosmic-background text-white relative overflow-hidden">
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
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
        </div>

        {/* Header */}
        <div className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in">
              <SparklesIcon className="h-5 w-5 text-cyan-400 animate-sparkle" />
              <span className="text-cyan-400 font-semibold text-sm">🚀 {t('staking_badge_text')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-cosmic-glow mb-6 animate-fade-in animation-delay-300">
              {t('staking_title')}
            </h1>
            <p className="text-xl text-purple-silver max-w-3xl mx-auto animate-fade-in animation-delay-600">
              {t('staking_subtitle')}
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stakingStats.map((stat, index) => (
              <div key={index} className="cosmic-card text-center hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-cosmic-glow mb-2 animate-energy-pulse">{stat.value}</h3>
                  <p className="text-purple-silver mb-2">{t(stat.labelKey)}</p>
                  <div className={`inline-flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1 animate-pulse" />
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Staking Pools */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cosmic-glow mb-8 text-center">
              {t('staking_pools_title')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {stakingPools.map((pool) => (
                <div key={pool.id} className="cosmic-card hover:scale-105 transition-all duration-500 hover:-translate-y-2 group">
                  <div className="text-center p-6">
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                      <img 
                        src={pool.image} 
                        alt={pool.name}
                        className="w-24 h-24 object-contain filter drop-shadow-2xl"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-cosmic-glow mb-4 group-hover:text-cyan-400 transition-colors duration-300">{pool.name}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-silver">{t('staking_pool_apy')}:</span>
                        <span className="text-2xl font-bold text-green-400 animate-energy-pulse">{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-silver">{t('staking_pool_total_staked')}:</span>
                        <span className="text-cosmic-glow font-medium">{pool.totalStaked}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-silver">{t('staking_pool_your_stake')}:</span>
                        <span className="text-cosmic-glow font-medium">{pool.yourStake}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-silver">{t('staking_pool_rewards')}:</span>
                        <span className="text-green-400 font-medium">{pool.rewards}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 cosmic-button px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                        {t('staking_pool_stake_button')}
                      </button>
                      <button className="flex-1 border border-cyan-400 text-cyan-400 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-105">
                        {t('staking_pool_unstake_button')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cosmic-glow mb-8 text-center">
              {t('staking_how_it_works_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="cosmic-card text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-cyan-500/25">
                    <LockClosedIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-glow mb-3 group-hover:text-cyan-400 transition-colors duration-300">1. {t('staking_step1_title')}</h3>
                  <p className="text-purple-silver">
                    {t('staking_step1_desc')}
                  </p>
                </div>
              </div>

              <div className="cosmic-card text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/25">
                    <FireIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-glow mb-3 group-hover:text-emerald-400 transition-colors duration-300">2. {t('staking_step2_title')}</h3>
                  <p className="text-purple-silver">
                    {t('staking_step2_desc')}
                  </p>
                </div>
              </div>

              <div className="cosmic-card text-center group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/25">
                    <CurrencyDollarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cosmic-glow mb-3 group-hover:text-purple-400 transition-colors duration-300">3. {t('staking_step3_title')}</h3>
                  <p className="text-purple-silver">
                    {t('staking_step3_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cosmic-glow mb-8 text-center">
              {t('staking_benefits_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="cosmic-card group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cosmic-glow mb-4 group-hover:text-cyan-400 transition-colors duration-300">{t('staking_benefit1_title')}</h3>
                                      <ul className="space-y-2 text-purple-silver">
                      <li>• {t('staking_benefit1_item1')}</li>
                      <li>• {t('staking_benefit1_item2')}</li>
                      <li>• {t('staking_benefit1_item3')}</li>
                      <li>• {t('staking_benefit1_item4')}</li>
                    </ul>
                </div>
              </div>

              <div className="cosmic-card group hover:scale-105 transition-all duration-500 hover-cosmic-pulse">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cosmic-glow mb-4 group-hover:text-purple-400 transition-colors duration-300">{t('staking_benefit2_title')}</h3>
                                      <ul className="space-y-2 text-purple-silver">
                      <li>• {t('staking_benefit2_item1')}</li>
                      <li>• {t('staking_benefit2_item2')}</li>
                      <li>• {t('staking_benefit2_item3')}</li>
                      <li>• {t('staking_benefit2_item4')}</li>
                    </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="cosmic-card bg-gradient-to-r from-cyan-900 to-purple-900 relative overflow-hidden">
              {/* Efeitos de fundo cósmicos */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-cosmic-pulse"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
              
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-cosmic-glow mb-4">
                  {t('staking_cta_title')}
                </h3>
                <p className="text-purple-silver mb-6">
                  {t('staking_cta_subtitle')}
                </p>
                <button className="cosmic-button px-8 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform duration-300">
                  <span className="flex items-center space-x-2">
                    <RocketLaunchIcon className="h-5 w-5" />
                    <span>{t('staking_cta_button')}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Staking
