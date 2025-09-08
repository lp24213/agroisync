import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, Users, TrendingUp, Smartphone, Truck, BarChart3 } from 'lucide-react'

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

  return (
    <div className='bg-primary min-h-screen'>
      {/* Hero Section */}
      <section className='hero-section'>
        <div className='container-futuristic'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='text-white'
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='mb-6 text-5xl font-bold md:text-6xl'
              >
                O Futuro do <span className='text-white'>Agronegócio</span> é{' '}
                <span className='text-yellow-300'>Agora</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='mb-8 text-xl leading-relaxed text-white/90'
              >
                A plataforma mais avançada e futurista do mundo para conectar produtores, compradores e transportadores.
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
                  className='text-primary flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold transition-colors hover:bg-white/90'
                >
                  Começar Agora
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to='/sobre'
                  className='hover:text-primary rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white'
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
              <div className='glass-card p-8 text-center'>
                <div className='bg-primary-gradient mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full'>
                  <TrendingUp size={48} className='text-white' />
                </div>
                <h3 className='mb-4 text-2xl font-bold text-white'>Performance em Tempo Real</h3>
                <p className='text-white/80'>Dados atualizados a cada segundo para decisões mais inteligentes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-secondary py-20'>
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
                <div className='text-gradient mb-2 text-4xl font-bold md:text-5xl'>{stat.number}</div>
                <div className='text-secondary font-medium'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-primary py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
              Tecnologia que <span className='text-yellow-300'>Impressiona</span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-white/80'>
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
                className='glass-card p-6 text-center transition-transform hover:scale-105'
              >
                <div className='bg-primary-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl'>
                  <feature.icon size={32} className='text-white' />
                </div>
                <h3 className='mb-3 text-xl font-bold text-white'>{feature.title}</h3>
                <p className='text-white/80'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className='bg-secondary py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='text-primary mb-6 text-4xl font-bold md:text-5xl'>
              Nossos <span className='text-gradient'>Serviços</span>
            </h2>
            <p className='text-secondary mx-auto max-w-3xl text-xl'>
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
                className='product-card group'
              >
                <div className='bg-primary-gradient mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-transform group-hover:scale-110'>
                  <service.icon size={32} className='text-white' />
                </div>
                <h3 className='text-primary mb-4 text-2xl font-bold'>{service.title}</h3>
                <p className='text-secondary mb-6'>{service.description}</p>
                <Link to={service.link} className='btn-futuristic w-full text-center'>
                  Conhecer
                  <ArrowRight size={16} className='ml-2' />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary-gradient py-20'>
        <div className='container-futuristic text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
              Pronto para o <span className='text-yellow-300'>Futuro</span>?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-white/90'>
              Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia AgroSync
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                to='/cadastro'
                className='text-primary flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold transition-colors hover:bg-white/90'
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </Link>
              <Link
                to='/contato'
                className='hover:text-primary rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white'
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
