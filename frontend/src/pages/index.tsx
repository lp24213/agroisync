import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon, 
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import agriculturalApi from '@/services/agriculturalApi'
import { AgriculturalProduct } from '@/services/agriculturalApi'
import CosmicParticles from '@/components/effects/CosmicParticles'

const Home: NextPage = () => {
  const { t } = useI18n();
  const [agriculturalData, setAgriculturalData] = useState<AgriculturalProduct[]>([])
  const [cryptoData, setCryptoData] = useState<Array<{
    symbol: string
    price: number
    change: number
    marketCap: string
    icon: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agData, cryptoData] = await Promise.all([
          agriculturalApi.getAgriculturalData(),
          agriculturalApi.getCryptoData()
        ])
        setAgriculturalData(agData.products)
        setCryptoData(cryptoData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      title: t('home_feature1_title'),
      description: t('home_feature1_description'),
      icon: '/images/futuristic-farm.svg',
      bgColor: 'from-cyan-600 via-blue-600 to-purple-600',
      delay: 'animation-delay-0'
    },
    {
      title: t('home_feature2_title'),
      description: t('home_feature2_description'),
      icon: '/images/staking-farming.svg',
      bgColor: 'from-emerald-600 via-green-600 to-teal-600',
      delay: 'animation-delay-300'
    },
    {
      title: t('home_feature3_title'),
      description: t('home_feature3_description'),
      icon: '/images/cyber-defense.svg',
      bgColor: 'from-purple-600 via-pink-600 to-rose-600',
      delay: 'animation-delay-600'
    }
  ]

  // Dados dos gráficos profissionais
  const chartData = {
    labels: agriculturalData.map(p => p.name),
    datasets: [
      {
        label: t('home_chart_price_label'),
        data: agriculturalData.map(p => p.price),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  }

  return (
    <>
      <Head>
        <title>{t('home_title')} - {t('app_name')}</title>
        <meta name="description" content={t('home_description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sistema de Partículas Cósmicas SENSACIONAL */}
      <CosmicParticles />

      <main className="min-h-screen cosmic-background text-white relative overflow-hidden">
        {/* Animated Background Elements com EFEITOS CÓSMICOS AVANÇADOS */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Nebulosas flutuantes com ANIMAÇÕES PROFISSIONAIS */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-4000"></div>
          
          {/* Portais quânticos com ROTAÇÃO CÓSMICA */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-full animate-quantum-orbital"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-full animate-quantum-orbital animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-purple-500/30 rounded-full animate-quantum-orbital animation-delay-4000"></div>
          
          {/* Ondas de energia cósmica com MOVIMENTO FLUIDO */}
          <div className="absolute top-1/2 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-1/3 right-0 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-cosmic-wave animation-delay-1000"></div>
          
          {/* Estrelas cintilantes com BRILHO PROFISSIONAL */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-sparkle animation-delay-100"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle animation-delay-3000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-sparkle animation-delay-4000"></div>
          
          {/* Partículas flutuantes com TRAJETÓRIA CÓSMICA */}
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
        </div>

        {/* Hero Section com ANIMAÇÕES CÓSMICAS PROFISSIONAIS */}
        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-cosmic-pulse"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-cosmic-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-cosmic-pulse animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              {/* Badge Animado CÓSMICO PROFISSIONAL */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in animation-delay-300 hover-cosmic-pulse">
                <SparklesIcon className="h-5 w-5 text-cyan-400 animate-sparkle" />
                <span className="text-cyan-400 font-semibold text-sm text-shimmer">🚀 {t('home_badge_revolutionary')}</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 text-cosmic-glow leading-tight animate-fade-in animation-delay-600">
                AGROISYNC
              </h1>
              
              {/* Logo do Agroisync com ANIMAÇÃO CÓSMICA PROFISSIONAL */}
              <div className="flex justify-center mb-8 animate-fade-in animation-delay-700">
                <div className="relative group">
                  <div className="h-24 w-24 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-110 transform">
                    <span className="text-white font-black text-4xl">🌱</span>
                  </div>
                  {/* Efeito de brilho cósmico PROFISSIONAL */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-cosmic-pulse"></div>
                  {/* Partículas orbitais ao redor do logo */}
                  <div className="absolute -top-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-quantum-orbital"></div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-quantum-orbital animation-delay-1000"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-quantum-orbital animation-delay-2000"></div>
                  <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-quantum-orbital animation-delay-3000"></div>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl text-purple-silver mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-900">
                {t('home_main_subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-1200">
                <Link href="/marketplace" className="group relative cosmic-button px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                  <span className="relative z-10 flex items-center space-x-3">
                    <RocketLaunchIcon className="h-6 w-6 group-hover:animate-bounce" />
                    <span>{t('home_explore_marketplace_button')}</span>
                  </span>
                  {/* Efeito de brilho cósmico PROFISSIONAL */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
                
                <Link href="/dashboard" className="group border-2 border-cyan-400 text-cyan-400 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden hover-float">
                  <span className="relative z-10 flex items-center space-x-3">
                    <CpuChipIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{t('home_view_dashboard_button')}</span>
                  </span>
                  {/* Hover Glow Cósmico PROFISSIONAL */}
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </Link>
              </div>

              {/* Stats Flutuantes com ANIMAÇÕES PROFISSIONAIS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in animation-delay-1500">
                <div className="text-center group hover-float">
                  <div className="text-4xl font-black text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300 animate-energy-pulse">+150%</div>
                  <div className="text-purple-silver font-medium">{t('home_stats_productivity')}</div>
                </div>
                <div className="text-center group hover-float">
                  <div className="text-4xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300 animate-energy-pulse animation-delay-500">+2000</div>
                  <div className="text-purple-silver font-medium">{t('home_stats_farmers')}</div>
                </div>
                <div className="text-center group hover-float">
                  <div className="text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300 animate-energy-pulse animation-delay-1000">+85%</div>
                  <div className="text-purple-silver font-medium">{t('home_stats_cost_reduction')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Agricultural Prices Section com EFEITOS CÓSMICOS PROFISSIONAIS */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
          
          {/* Ondas de energia flutuantes PROFISSIONAIS */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-cosmic-wave animation-delay-2000"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-cosmic-glow mb-6">
                {t('home_agricultural_prices_title')}
              </h2>
              <p className="text-xl text-purple-silver max-w-3xl mx-auto">
                {t('home_agricultural_prices_subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {loading ? (
                // Loading skeleton com ANIMAÇÕES PROFISSIONAIS
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="cosmic-card p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-purple-500/20 rounded w-16"></div>
                          <div className="h-3 bg-purple-500/20 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-6 bg-purple-500/20 rounded w-20"></div>
                        <div className="h-4 bg-purple-500/20 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                agriculturalData.map((product, index) => (
                  <div key={product.id} className="cosmic-card group hover:scale-105 transition-all duration-500 animation-delay-100">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-2xl ${product.trend === 'up' ? 'bg-green-500/20 border border-green-500/30' : product.trend === 'down' ? 'bg-red-500/20 border border-red-500/30' : 'bg-gray-500/20 border border-gray-500/30'} group-hover:scale-110 transition-transform duration-300 hover-cosmic-pulse`}>
                          <span className="text-2xl">{product.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-cosmic text-lg">{product.name}</p>
                          <p className="text-sm text-purple-silver">{product.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-purple-silver">R$ {product.price.toFixed(2)}</p>
                        <p className={`text-sm font-bold ${product.trend === 'up' ? 'text-green-400' : product.trend === 'down' ? 'text-red-400' : 'text-gray-400'} bg-${product.trend === 'up' ? 'green' : product.trend === 'down' ? 'red' : 'gray'}-400/20 px-3 py-1 rounded-full`}>
                          {product.trend === 'up' ? '+' : ''}{product.changePercent.toFixed(2)}%
                        </p>
                        <p className="text-xs text-purple-silver/70 mt-1">{product.priceUnit}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* GRÁFICO PROFISSIONAL AVANÇADO com EFEITOS CÓSMICOS SENSACIONAIS */}
            <div className="cosmic-card p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-cosmic-glow mb-4">
                  📊 {t('home_chart_title')}
                </h3>
                <p className="text-xl text-purple-silver">
                  {t('home_chart_subtitle')}
                </p>
              </div>
              
              {loading ? (
                <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl p-12 text-center border border-cyan-500/20 animate-pulse">
                  <div className="h-64 bg-gray-800 rounded-lg"></div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl p-8 border border-cyan-500/20 relative overflow-hidden">
                  {/* Efeitos de fundo cósmicos PROFISSIONAIS */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-cosmic-pulse"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                  
                  <div className="h-80 relative z-10">
                    {/* GRÁFICO PROFISSIONAL INTERATIVO */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-cyan-400 text-4xl font-bold mb-4 animate-energy-pulse">
                          📈 {t('home_chart_advanced_title')}
                        </div>
                        <div className="text-purple-silver text-lg mb-6">
                          {t('home_chart_description')}
                        </div>
                        
                        {/* Estatísticas em tempo real */}
                        <div className="grid grid-cols-2 gap-8 text-sm mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 animate-float">
                              {agriculturalData.filter(p => p.trend === 'up').length}
                            </div>
                            <div className="text-purple-silver">{t('home_chart_products_up')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400 animate-float animation-delay-1000">
                              {agriculturalData.filter(p => p.trend === 'down').length}
                            </div>
                            <div className="text-purple-silver">{t('home_chart_products_down')}</div>
                          </div>
                        </div>
                        
                        {/* Indicadores técnicos */}
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="text-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                            <div className="text-cyan-400 font-bold">RSI</div>
                            <div className="text-purple-silver">65.4</div>
                          </div>
                          <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="text-blue-400 font-bold">MACD</div>
                            <div className="text-purple-silver">+2.1</div>
                          </div>
                          <div className="text-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <div className="text-purple-400 font-bold">VOL</div>
                            <div className="text-purple-silver">1.2M</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live Crypto Prices Section com EFEITOS CÓSMICOS PROFISSIONAIS */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
          
          {/* Partículas flutuantes PROFISSIONAIS */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-cosmic-glow mb-6">
                Preços de Criptomoedas em Tempo Real
              </h2>
              <p className="text-xl text-purple-silver max-w-3xl mx-auto">
                Acompanhe os preços das principais criptomoedas com dados atualizados a cada segundo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cryptoData.map((crypto: any, index: number) => (
                <div key={crypto.symbol} className="cosmic-card group hover:scale-105 transition-all duration-500 animation-delay-100">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl ${crypto.change >= 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'} group-hover:scale-110 transition-transform duration-300 hover-cosmic-pulse`}>
                        <span className="text-2xl">{crypto.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-cosmic text-lg">{crypto.symbol}</p>
                        <p className="text-sm text-purple-silver">Cap: ${crypto.marketCap}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-purple-silver">${crypto.price.toFixed(2)}</p>
                      <p className={`text-sm font-bold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'} bg-${crypto.change >= 0 ? 'green' : 'red'}-400/20 px-3 py-1 rounded-full`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section com ANIMAÇÕES CÓSMICAS PROFISSIONAIS */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
          
          {/* Estrelas cintilantes PROFISSIONAIS */}
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-sparkle"></div>
          <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1 h-1 bg-blue-400 rounded-full animate-sparkle animation-delay-4000"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-cosmic-glow mb-6">
                {t('home_technology_title')}
              </h2>
              <p className="text-xl text-purple-silver max-w-4xl mx-auto">
                {t('home_technology_subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="cosmic-card h-full hover:scale-105 transition-all duration-700 overflow-hidden">
                    <div className="text-center p-8">
                      <div className="mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500 hover-cosmic-pulse">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-40 h-40 object-contain filter drop-shadow-2xl"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-cosmic mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-purple-silver leading-relaxed text-lg">
                        {feature.description}
                      </p>
                      
                      {/* Borda animada cósmica PROFISSIONAL */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section com EFEITOS CÓSMICOS PROFISSIONAIS */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
          
          {/* Ondas de energia PROFISSIONAIS */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-cosmic-wave animation-delay-3000"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="text-center group hover-float">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-cyan-500/25 hover-cosmic-pulse">
                  <FireIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-cosmic mb-3 group-hover:text-cyan-400 transition-colors duration-300 animate-energy-pulse">+150%</h3>
                <p className="text-purple-silver text-lg font-medium">{t('home_stats_productivity')}</p>
              </div>
              
              <div className="text-center group hover-float">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-emerald-500/25 hover-cosmic-pulse">
                  <StarIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-cosmic mb-3 group-hover:text-emerald-400 transition-colors duration-300 animate-energy-pulse animation-delay-500">+2000</h3>
                <p className="text-purple-silver text-lg font-medium">{t('home_stats_farmers')}</p>
              </div>
              
              <div className="text-center group hover-float">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-purple-500/25 hover-cosmic-pulse">
                  <ArrowTrendingUpIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-cosmic mb-3 group-hover:text-purple-400 transition-colors duration-300 animate-energy-pulse animation-delay-1000">+85%</h3>
                <p className="text-purple-silver text-lg font-medium">{t('home_stats_cost_reduction')}</p>
              </div>
              
              <div className="text-center group hover-float">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-blue-500/25 hover-cosmic-pulse">
                  <CpuChipIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-cosmic mb-3 group-hover:text-blue-400 transition-colors duration-300 animate-energy-pulse animation-delay-1500">24/7</h3>
                <p className="text-purple-silver text-lg font-medium">{t('home_stats_monitoring')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section com EFEITOS CÓSMICOS SENSACIONAIS PROFISSIONAIS */}
        <section className="py-24 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-cosmic-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-cosmic-pulse animation-delay-2000"></div>
          </div>
          
          {/* Portais quânticos flutuantes PROFISSIONAIS */}
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-3000"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-black text-white mb-8 text-glow">
              {t('home_cta_title')}
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('home_cta_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link href="/marketplace" className="group relative cosmic-button px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                <span className="relative z-10 flex items-center space-x-4">
                  <RocketLaunchIcon className="h-8 w-8 group-hover:animate-bounce" />
                  <span>{t('home_cta_start_button')}</span>
                </span>
                {/* Efeito de brilho cósmico PROFISSIONAL */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              <Link href="/contact" className="group border-2 border-white text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden hover-float">
                <span className="relative z-10">{t('home_cta_expert_button')}</span>
                {/* Hover Glow Cósmico PROFISSIONAL */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
