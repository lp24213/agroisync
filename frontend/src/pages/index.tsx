import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ArrowTrendingUpIcon, 
  FireIcon, 
  StarIcon, 
  ArrowRightIcon,
  ArrowTrendingDownIcon
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
      bgColor: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Staking & Farming Rewards',
      description: 'Sistema de recompensas baseado em staking e farming de ativos agrícolas',
      icon: '/images/staking-farming.svg',
      bgColor: 'from-green-600 to-emerald-500'
    },
    {
      title: 'Cyber Defense & Security',
      description: 'Proteção avançada com blockchain e criptografia para seus ativos digitais',
      icon: '/images/cyber-defense.svg',
      bgColor: 'from-purple-600 to-pink-500'
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

      <main className="min-h-screen bg-black text-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900 py-20">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-slate-300 bg-clip-text text-transparent">
                AGROISYNC
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                A revolução da agricultura inteligente está aqui. Combine tecnologia de ponta com 
                tradição agrícola para maximizar seus lucros e sustentabilidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/marketplace" className="bg-gradient-to-r from-blue-500 to-slate-300 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-400 hover:to-slate-200 transition-all duration-200 hover:scale-105 transform">
                  Explorar Marketplace
                </Link>
                <Link href="/dashboard" className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-400 hover:text-black transition-all duration-200">
                  Ver Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Crypto Prices Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
              Preços de Criptomoedas em Tempo Real
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoData.map((crypto, index) => (
                <Card key={crypto.symbol} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 enhanced-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${crypto.change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {crypto.change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">{crypto.symbol}</p>
                        <p className="text-sm text-gray-400">Cap: ${crypto.marketCap}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-100">${crypto.price.toFixed(2)}</p>
                      <p className={`text-sm ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-100 mb-4">
                Tecnologia de Ponta para Agricultura
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Nossa plataforma combina as mais avançadas tecnologias para revolucionar 
                a agricultura tradicional
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 enhanced-shadow group-hover:scale-105">
                    <div className="text-center">
                      <div className="mb-6 flex justify-center">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <FireIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-2">+150%</h3>
                <p className="text-gray-400">Aumento na Produtividade</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-2">+2000</h3>
                <p className="text-gray-400">Fazendeiros Ativos</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-2">+85%</h3>
                <p className="text-gray-400">Redução de Custos</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-4 inline-flex p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-2">24/7</h3>
                <p className="text-gray-400">Monitoramento Ativo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Preview Section */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="enhanced-shadow">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">
                  Gráfico de Performance em Tempo Real
                </h2>
                <p className="text-gray-400">
                  Acompanhe o desempenho dos seus ativos agrícolas e criptomoedas
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-950 to-gray-900 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-lg">
                  Gráfico interativo será carregado aqui
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-100 mb-6">
              Pronto para Revolucionar sua Agricultura?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de fazendeiros que já estão usando AGROISYNC para 
              maximizar seus lucros e produtividade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform">
                Começar Agora
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-200">
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
