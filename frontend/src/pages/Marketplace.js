import React from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, TrendingUp, Shield, Zap, Globe } from 'lucide-react'

const Marketplace = () => {
  const intermediacaoFeatures = [
    {
      icon: Users,
      title: 'Conectamos Produtores e Compradores',
      description: 'Facilitamos o encontro entre quem produz e quem precisa comprar produtos agrícolas'
    },
    {
      icon: Heart,
      title: 'Intermediação Inteligente',
      description: 'Nossa IA analisa ofertas e demandas para criar matches perfeitos'
    },
    {
      icon: TrendingUp,
      title: 'Melhores Preços',
      description: 'Negociação transparente com cotações em tempo real do mercado'
    },
    {
      icon: Shield,
      title: 'Transações Seguras',
      description: 'Escrow automático e garantias para ambas as partes'
    },
    {
      icon: Zap,
      title: 'Processo Rápido',
      description: 'De acordo a entrega em questão de horas, não dias'
    },
    {
      icon: Globe,
      title: 'Rede Nacional',
      description: 'Conectamos produtores e compradores de todo o Brasil'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mx-auto max-w-7xl'>
        {/* Hero Section */}
        <div className='mb-16 text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='mb-6 text-5xl font-bold text-white md:text-6xl'
          >
            <span className='text-gradient'>Intermediação</span> Inteligente
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-400'
          >
            Conectamos produtores e compradores através de nossa plataforma de intermediação inteligente.{' '}
            <strong>Não vendemos produtos, facilitamos negócios.</strong>
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {intermediacaoFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className='card-futuristic space-y-4 p-6 text-center transition-all duration-300 hover:shadow-neon'
            >
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple'>
                <feature.icon className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white'>{feature.title}</h3>
              <p className='text-sm leading-relaxed text-gray-400'>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Como Funciona */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className='card-futuristic mb-16 p-8'
        >
          <h2 className='mb-8 text-center text-3xl font-bold text-white'>
            Como Funciona Nossa <span className='text-gradient'>Intermediação</span>
          </h2>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-neon-green to-emerald-500 text-2xl font-bold text-white'>
                1
              </div>
              <h3 className='text-xl font-semibold text-white'>Produtor Publica</h3>
              <p className='text-gray-400'>Produtores cadastram seus produtos com preços, quantidades e localização</p>
            </div>

            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-neon-blue to-cyan-500 text-2xl font-bold text-white'>
                2
              </div>
              <h3 className='text-xl font-semibold text-white'>IA Faz o Match</h3>
              <p className='text-gray-400'>Nossa inteligência artificial conecta ofertas com demandas compatíveis</p>
            </div>

            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-neon-purple to-violet-500 text-2xl font-bold text-white'>
                3
              </div>
              <h3 className='text-xl font-semibold text-white'>Negócio Fechado</h3>
              <p className='text-gray-400'>
                <strong>Compradores e vendedores negociam diretamente</strong> através de nossa mensageria privada
              </p>
            </div>
          </div>
        </motion.div>

        {/* Modelo de Negócio */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className='card-futuristic mb-16 p-8'
        >
          <h2 className='mb-8 text-center text-3xl font-bold text-white'>
            Nosso <span className='text-gradient'>Modelo de Negócio</span>
          </h2>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-neon-blue to-cyan-500'>
                <span className='text-2xl'>💰</span>
              </div>
              <h3 className='text-xl font-semibold text-white'>Cobramos Assinaturas</h3>
              <p className='text-gray-400'>
                Você paga um plano mensal para publicar seus produtos e fretes na plataforma
              </p>
            </div>

            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-neon-green to-emerald-500'>
                <span className='text-2xl'>🚫</span>
              </div>
              <h3 className='text-xl font-semibold text-white'>Sem Comissões</h3>
              <p className='text-gray-400'>
                <strong>Não cobramos comissão sobre vendas</strong>. Você negocia diretamente com o comprador
              </p>
            </div>

            <div className='space-y-4 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-neon-purple to-violet-500'>
                <span className='text-2xl'>🤝</span>
              </div>
              <h3 className='text-xl font-semibold text-white'>Só Intermediamos</h3>
              <p className='text-gray-400'>Facilitamos a conexão. A negociação e venda é entre vocês, diretamente</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className='text-center'
        >
          <h2 className='mb-6 text-3xl font-bold text-white'>
            Pronto para <span className='text-gradient'>Intermediar</span> Seus Negócios?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-gray-400'>
            Seja você produtor ou comprador, nossa plataforma conecta você com os melhores parceiros de negócio.
            <strong> Você negocia diretamente, nós só facilitamos a conexão!</strong>
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <button className='btn-primary px-8 py-4'>Sou Produtor</button>
            <button className='btn-secondary px-8 py-4'>Sou Comprador</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Marketplace
