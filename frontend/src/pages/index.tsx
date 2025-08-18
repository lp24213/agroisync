import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon, 
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'

const Home: NextPage = () => {
  const [cryptoData, setCryptoData] = useState([
    { symbol: 'BTC', price: 43250.00, change: 3.2, marketCap: '845.2B' },
    { symbol: 'ETH', price: 2650.00, change: 2.8, marketCap: '318.7B' },
    { symbol: 'ADA', price: 0.48, change: -1.2, marketCap: '16.9B' },
    { symbol: 'SOL', price: 98.50, change: 5.7, marketCap: '42.1B' },
    { symbol: 'DOT', price: 7.25, change: 1.9, marketCap: '9.8B' },
    { symbol: 'LINK', price: 15.80, change: -0.8, marketCap: '8.9B' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.02),
        change: crypto.change + (Math.random() - 0.5) * 2
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: 'Futuristic Agricultural Technology',
      description: 'Integração avançada de drones, IoT e IA para monitoramento agrícola inteligente',
      icon: '/images/futuristic-farm.svg',
      bgColor: 'from-cyan-600 via-blue-600 to-purple-600',
      delay: 'animation-delay-0'
    },
    {
      title: 'Staking & Farming Rewards',
      description: 'Sistema de recompensas baseado em staking e farming de ativos agrícolas',
      icon: '/images/staking-farming.svg',
      bgColor: 'from-emerald-600 via-green-600 to-teal-600',
      delay: 'animation-delay-300'
    },
    {
      title: 'Cyber Defense & Security',
      description: 'Proteção avançada com blockchain e criptografia para seus ativos digitais',
      icon: '/images/cyber-defense.svg',
      bgColor: 'from-purple-600 via-pink-600 to-rose-600',
      delay: 'animation-delay-600'
    }
  ]

  return (
    <>
      <Head>
        <title>AGROISYNC - Plataforma Agrícola Inteligente</title>
        <meta name="description" content="Plataforma inovadora que combina agricultura inteligente com tecnologia blockchain para maximizar produtividade e lucros" />
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

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900 py-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              {/* Animated Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in animation-delay-300">
                <SparklesIcon className="h-5 w-5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-semibold text-sm">🚀 Plataforma Revolucionária</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight animate-fade-in animation-delay-600">
                AGROISYNC
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-900">
                A <span className="text-cyan-400 font-bold">revolução da agricultura inteligente</span> está aqui. 
                Combine <span className="text-blue-400 font-bold">tecnologia de ponta</span> com 
                <span className="text-purple-400 font-bold"> tradição agrícola</span> para maximizar seus lucros e sustentabilidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-1200">
                <Link href="/marketplace" className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                  <span className="relative z-10 flex items-center space-x-3">
                    <RocketLaunchIcon className="h-6 w-6 group-hover:animate-bounce" />
                    <span>Explorar Marketplace</span>
                  </span>
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
                
                <Link href="/dashboard" className="group border-2 border-cyan-400 text-cyan-400 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden">
                  <span className="relative z-10 flex items-center space-x-3">
                    <CpuChipIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Ver Dashboard</span>
                  </span>
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </Link>
              </div>

              {/* Floating Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in animation-delay-1500">
                <div className="text-center group">
                  <div className="text-4xl font-black text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">+150%</div>
                  <div className="text-gray-400 font-medium">Aumento na Produtividade</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">+2000</div>
                  <div className="text-gray-400 font-medium">Fazendeiros Ativos</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">+85%</div>
                  <div className="text-gray-400 font-medium">Redução de Custos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Crypto Prices Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-100 mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Preços de Criptomoedas em Tempo Real
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Acompanhe os preços das principais criptomoedas com dados atualizados a cada segundo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cryptoData.map((crypto, index) => (
                <Card key={crypto.symbol} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl ${crypto.change >= 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'} group-hover:scale-110 transition-transform duration-300`}>
                        {crypto.change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-8 w-8 text-green-400" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-8 w-8 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-100 text-lg">{crypto.symbol}</p>
                        <p className="text-sm text-gray-400">Cap: ${crypto.marketCap}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-100">${crypto.price.toFixed(2)}</p>
                      <p className={`text-sm font-bold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'} bg-${crypto.change >= 0 ? 'green' : 'red'}-400/20 px-3 py-1 rounded-full`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-100 mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Tecnologia de Ponta para Agricultura
              </h2>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto">
                Nossa plataforma combina as mais avançadas tecnologias para revolucionar 
                a agricultura tradicional com inovação e eficiência
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50 overflow-hidden">
                    <div className="text-center p-8">
                      <div className="mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-40 h-40 object-contain filter drop-shadow-2xl"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                      
                      {/* Animated Border */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="text-center group">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-cyan-500/25">
                  <FireIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-100 mb-3 group-hover:text-cyan-400 transition-colors duration-300">+150%</h3>
                <p className="text-gray-400 text-lg font-medium">Aumento na Produtividade</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-emerald-500/25">
                  <StarIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-100 mb-3 group-hover:text-emerald-400 transition-colors duration-300">+2000</h3>
                <p className="text-gray-400 text-lg font-medium">Fazendeiros Ativos</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-purple-500/25">
                  <ArrowTrendingUpIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-100 mb-3 group-hover:text-purple-400 transition-colors duration-300">+85%</h3>
                <p className="text-gray-400 text-lg font-medium">Redução de Custos</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-blue-500/25">
                  <CpuChipIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-100 mb-3 group-hover:text-blue-400 transition-colors duration-300">24/7</h3>
                <p className="text-gray-400 text-lg font-medium">Monitoramento Ativo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Preview Section */}
        <section className="py-24 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <div className="text-center mb-12 p-8">
                <h2 className="text-4xl font-black text-gray-100 mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Gráfico de Performance em Tempo Real
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Acompanhe o desempenho dos seus ativos agrícolas e criptomoedas com análises avançadas
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl p-12 text-center mx-8 mb-8 border border-cyan-500/20">
                <div className="text-cyan-400 text-2xl font-bold mb-4">
                  📊 Gráfico Interativo Avançado
                </div>
                <div className="text-gray-400 text-lg">
                  Dados em tempo real • Análises preditivas • Indicadores técnicos
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-black text-gray-100 mb-8">
              Pronto para Revolucionar sua Agricultura?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Junte-se a milhares de fazendeiros que já estão usando AGROISYNC para 
              maximizar seus lucros e produtividade com tecnologia de ponta
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link href="/marketplace" className="group relative bg-white text-black px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                <span className="relative z-10 flex items-center space-x-4">
                  <RocketLaunchIcon className="h-8 w-8 group-hover:animate-bounce" />
                  <span>Começar Agora</span>
                </span>
                {/* Shine Effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              <Link href="/contact" className="group border-2 border-white text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden">
                <span className="relative z-10">Falar com Especialista</span>
                {/* Hover Glow */}
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
