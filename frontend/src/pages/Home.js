import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, Users, TrendingUp, Smartphone, Truck, BarChart3, Newspaper, Clock } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia de nível bancário e autenticação 2FA'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'Tecnologia de ponta para transações instantâneas e processamento em tempo real'
    },
    {
      icon: Globe,
      title: 'Global & Local',
      description: 'Conectividade mundial com foco no agronegócio brasileiro e internacional'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Rede de produtores, compradores e transportadores em constante crescimento'
    }
  ]

  const services = [
    {
      icon: Smartphone,
      title: 'Marketplace Digital',
      description: 'Plataforma completa para compra e venda de produtos agrícolas',
      link: '/marketplace'
    },
    {
      icon: Truck,
      title: 'AgroConecta',
      description: 'Intermediação inteligente de fretes agrícolas',
      link: '/agroconecta'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Dados em tempo real sobre preços, tendências e oportunidades',
      link: '/analytics'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: 'R$ 50M+', label: 'Volume Transacionado' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Premium' }
  ]

  const news = [
    {
      id: 1,
      title: 'Soja atinge maior preço em 3 meses com alta da demanda chinesa',
      summary: 'Commodity brasileira registra valorização de 8% na semana',
      source: 'Globo Rural',
      publishedAt: '2024-01-15T10:30:00Z',
      category: 'Commodities'
    },
    {
      id: 2,
      title: 'Tecnologia 5G revoluciona monitoramento de safras no Brasil',
      summary: 'Fazendas conectadas aumentam produtividade em 15%',
      source: 'AgroRevista',
      publishedAt: '2024-01-15T09:15:00Z',
      category: 'Tecnologia'
    },
    {
      id: 3,
      title: 'Chuva em excesso preocupa produtores de milho no Centro-Oeste',
      summary: 'Previsão indica mais 10 dias de precipitação intensa',
      source: 'Canal Rural',
      publishedAt: '2024-01-15T08:45:00Z',
      category: 'Clima'
    }
  ]

  const formatTimeAgo = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Agora há pouco'
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gray-50 py-24'>
        <div className='container-futuristic'>
          <div className='grid grid-cols-1 items-center gap-16 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='text-gray-900'
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='heading-1 mb-8'
              >
                O Futuro do <span className='text-gray-700'>Agronegócio</span> é{' '}
                <span className='text-gray-600'>Agora</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='subtitle mb-12 max-w-2xl'
              >
                A plataforma mais avançada do mundo para conectar produtores, compradores e transportadores.
                Tecnologia de ponta, segurança máxima e performance extrema.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='flex flex-col gap-4 sm:flex-row'
              >
                <Link
                  to='/cadastro'
                  className='btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg'
                >
                  Começar Agora
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to='/sobre'
                  className='btn-secondary px-8 py-4 text-lg'
                >
                  Saiba Mais
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='relative'
            >
              <div className='card-futuristic p-8 text-center'>
                <div className='bg-gray-100 mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full'>
                  <TrendingUp size={48} className='text-gray-700' />
                </div>
                <h3 className='heading-3 mb-4 text-gray-900'>Performance em Tempo Real</h3>
                <p className='body-text text-gray-600'>Dados atualizados a cada segundo para decisões mais inteligentes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='grid grid-cols-2 gap-8 md:grid-cols-4'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='text-center'
              >
                <div className='text-gray-900 mb-2 text-4xl font-bold md:text-5xl'>{stat.number}</div>
                <div className='text-gray-600 font-medium'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-gray-50 py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-6 text-gray-900'>
              Tecnologia que <span className='text-gray-700'>Impressiona</span>
            </h2>
            <p className='subtitle mx-auto max-w-3xl text-gray-600'>
              Recursos avançados que colocam o AgroSync anos à frente da concorrência
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='card-futuristic p-6 text-center transition-all duration-300 hover:shadow-medium'
              >
                <div className='bg-gray-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl'>
                  <feature.icon size={32} className='text-gray-700' />
                </div>
                <h3 className='heading-4 mb-3 text-gray-900'>{feature.title}</h3>
                <p className='body-text text-gray-600'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-6 text-gray-900'>
              Nossos <span className='text-gray-700'>Serviços</span>
            </h2>
            <p className='subtitle mx-auto max-w-3xl text-gray-600'>
              Soluções completas para todas as necessidades do agronegócio moderno
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='card-futuristic p-8 group transition-all duration-300 hover:shadow-medium'
              >
                <div className='bg-gray-100 mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-transform group-hover:scale-105'>
                  <service.icon size={32} className='text-gray-700' />
                </div>
                <h3 className='heading-4 mb-4 text-gray-900'>{service.title}</h3>
                <p className='body-text mb-6 text-gray-600'>{service.description}</p>
                <Link to={service.link} className='btn-primary w-full text-center flex items-center justify-center gap-2'>
                  Conhecer
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className='bg-gray-50 py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-6 text-gray-900'>
              Notícias do <span className='text-gray-700'>Agronegócio</span>
            </h2>
            <p className='subtitle mx-auto max-w-3xl text-gray-600'>
              Mantenha-se atualizado com as últimas notícias e tendências do setor
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='card-futuristic p-6 transition-all duration-300 hover:shadow-medium'
              >
                <div className='mb-4 flex items-center gap-3'>
                  <div className='bg-gray-100 p-2 rounded-lg'>
                    <Newspaper size={20} className='text-gray-700' />
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Clock size={14} />
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
                
                <div className='mb-3'>
                  <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium'>
                    {article.category}
                  </span>
                </div>
                
                <h3 className='heading-4 mb-3 text-gray-900 line-clamp-2'>
                  {article.title}
                </h3>
                
                <p className='body-text mb-4 text-gray-600 line-clamp-3'>
                  {article.summary}
                </p>
                
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>{article.source}</span>
                  <Link 
                    to='#' 
                    className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                  >
                    Ler mais →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gray-900 py-20'>
        <div className='container-futuristic text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='heading-2 mb-6 text-white'>
              Pronto para o <span className='text-gray-300'>Futuro</span>?
            </h2>
            <p className='subtitle mx-auto mb-8 max-w-2xl text-gray-300'>
              Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia AgroSync
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                to='/cadastro'
                className='btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg'
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </Link>
              <Link
                to='/contato'
                className='btn-secondary px-8 py-4 text-lg'
              >
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
