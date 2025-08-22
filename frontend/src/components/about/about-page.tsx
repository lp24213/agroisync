'use client'

import { motion } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Rocket, 
  Users, 
  Globe,
  Shield,
  Zap,
  Database,
  Cloud,
  BarChart3,
  Bot,
  Truck,
  Wheat,
  Coins,
  ShoppingCart
} from 'lucide-react'

const mission = {
  title: 'Nossa Missão',
  description: 'Revolucionar a agricultura através da tecnologia, conectando produtores, transportadores e consumidores em uma plataforma inteligente e sustentável.',
  icon: Target,
  color: 'from-green-500 to-emerald-600',
}

const vision = {
  title: 'Nossa Visão',
  description: 'Ser a principal plataforma de agricultura digital do mundo, integrando Web3, IA e analytics para criar um ecossistema agrícola mais eficiente e lucrativo.',
  icon: Eye,
  color: 'from-blue-500 to-cyan-600',
}

const roadmap = [
  {
    phase: 'Fase 1',
    title: 'Fundação da Plataforma',
    description: 'Desenvolvimento da infraestrutura básica, autenticação e sistema de usuários.',
    year: '2024',
    status: 'completed',
    features: ['Sistema de autenticação', 'Perfis de usuário', 'Interface responsiva'],
  },
  {
    phase: 'Fase 2',
    title: 'Funcionalidades Core',
    description: 'Implementação das funcionalidades principais: loja, fretes e analytics.',
    year: '2024',
    status: 'completed',
    features: ['Loja online', 'Marketplace de fretes', 'Dashboard básico'],
  },
  {
    phase: 'Fase 3',
    title: 'Integração Web3',
    description: 'Implementação de blockchain, smart contracts e carteiras digitais.',
    year: '2025',
    status: 'in-progress',
    features: ['Smart contracts', 'Carteiras Web3', 'Tokens agrícolas'],
  },
  {
    phase: 'Fase 4',
    title: 'IA e Automação',
    description: 'Sistema de IA avançado para previsões, otimização e automação.',
    year: '2025',
    status: 'planned',
    features: ['Chatbot GPT', 'Previsões de preços', 'Automação de processos'],
  },
  {
    phase: 'Fase 5',
    title: 'Expansão Global',
    description: 'Expansão para mercados internacionais e integração com sistemas globais.',
    year: '2026',
    status: 'planned',
    features: ['Múltiplos idiomas', 'Integração global', 'Compliance internacional'],
  },
]

const technologies = [
  {
    name: 'Next.js 14',
    description: 'Framework React moderno com App Router e Server Components',
    icon: Zap,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'TypeScript',
    description: 'Tipagem estática para desenvolvimento mais seguro e eficiente',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Tailwind CSS',
    description: 'Framework CSS utility-first para design responsivo e moderno',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Framer Motion',
    description: 'Biblioteca de animações para experiências fluidas e interativas',
    icon: Rocket,
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'AWS Amplify',
    description: 'Plataforma de desenvolvimento full-stack na nuvem AWS',
    icon: Cloud,
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'Solana Web3',
    description: 'Integração com blockchain Solana para funcionalidades Web3',
    icon: Coins,
    color: 'from-green-500 to-emerald-600',
  },
]

const features = [
  {
    title: 'Loja Online',
    description: 'Catálogo completo de produtos agrícolas com sistema de pagamento integrado',
    icon: ShoppingCart,
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'AgroConecta',
    description: 'Marketplace de fretes conectando transportadores e produtores',
    icon: Truck,
    color: 'from-orange-500 to-red-600',
  },
  {
    title: 'Gestão de Grãos',
    description: 'Monitoramento de preços e análise de mercado em tempo real',
    icon: Wheat,
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Criptomoedas',
    description: 'Trading e cotações de criptomoedas com integração Web3',
    icon: Coins,
    color: 'from-yellow-500 to-orange-600',
  },
  {
    title: 'Analytics',
    description: 'Dashboards interativos com KPIs e métricas em tempo real',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Chatbot IA',
    description: 'Assistente inteligente para suporte e automação de processos',
    icon: Bot,
    color: 'from-indigo-500 to-purple-600',
  },
]

export function AboutPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'planned': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído'
      case 'in-progress': return 'Em Andamento'
      case 'planned': return 'Planejado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Sobre a <span className="gradient-text">AgroSync</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça nossa missão, visão e a tecnologia que está revolucionando 
              a agricultura digital no Brasil e no mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 border border-border/50"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${mission.color} rounded-2xl flex items-center justify-center mb-6`}>
                <mission.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{mission.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-8 border border-border/50"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${vision.color} rounded-2xl flex items-center justify-center mb-6`}>
                <vision.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{vision.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{vision.description}</p>
            </motion.div>
          </div>

          <div className="glass-card p-8 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Roadmap <span className="gradient-text">Web3</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nossa jornada de desenvolvimento e as próximas etapas para 
                revolucionar a agricultura digital.
              </p>
            </div>

            <div className="space-y-8">
              {roadmap.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 p-6 bg-secondary/30 rounded-xl border border-border/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(phase.status)}`}>
                          {getStatusLabel(phase.status)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>
                  
                  <div className="lg:ml-auto">
                    <div className="text-right mb-2">
                      <span className="text-sm font-medium text-primary">{phase.year}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-card border border-border rounded text-xs text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Tecnologias <span className="gradient-text">Utilizadas</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stack moderno e robusto para garantir performance, segurança 
                e escalabilidade da plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center mb-4`}>
                    <tech.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Funcionalidades <span className="gradient-text">Principais</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conheça as principais funcionalidades que fazem da AgroSync 
                a plataforma mais completa para agricultura digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
