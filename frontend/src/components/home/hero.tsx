'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Play, 
  Shield, 
  Zap, 
  TrendingUp,
  Globe,
  Bot
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Proteção avançada contra ataques DDoS e ameaças cibernéticas',
  },
  {
    icon: Zap,
    title: 'Performance Premium',
    description: 'Velocidade e responsividade excepcionais em todas as operações',
  },
  {
    icon: TrendingUp,
    title: 'Analytics em Tempo Real',
    description: 'Dados e insights atualizados instantaneamente',
  },
  {
    icon: Globe,
    title: 'Integração Global',
    description: 'Conectividade com mercados e sistemas internacionais',
  },
  {
    icon: Bot,
    title: 'IA Avançada',
    description: 'Chatbot inteligente para suporte e automação',
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Plataforma Premium de Agricultura Inteligente
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">AgroSync</span>
            <br />
            <span className="text-foreground">
              O Futuro da
            </span>
            <br />
            <span className="gradient-text">Agricultura</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Integre tecnologia Web3, criptomoedas e analytics avançados para 
            revolucionar sua operação agrícola com segurança total e performance premium.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue/90 hover:to-neon-cyan/90 text-white px-8 py-4 text-lg font-semibold shadow-neon-blue"
              asChild
            >
              <Link href="/store">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"
      />
    </section>
  )
}
