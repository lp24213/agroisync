'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Globe, 
  Bot, 
  Lock,
  Cpu,
  Database,
  Cloud,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Proteção avançada contra ataques DDoS, firewalls de última geração e criptografia de ponta a ponta.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Zap,
    title: 'Performance Premium',
    description: 'Infraestrutura otimizada para máxima velocidade e responsividade em todas as operações.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Analytics em Tempo Real',
    description: 'Dashboards interativos com dados atualizados instantaneamente para tomada de decisões ágil.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Globe,
    title: 'Integração Global',
    description: 'Conectividade com mercados internacionais e sistemas de terceiros através de APIs seguras.',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Bot,
    title: 'IA Avançada',
    description: 'Chatbot inteligente com machine learning para automação e suporte personalizado.',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Lock,
    title: 'Compliance Total',
    description: 'Conformidade com todas as regulamentações de segurança e privacidade de dados.',
    color: 'from-red-500 to-pink-600',
  },
  {
    icon: Cpu,
    title: 'Processamento Edge',
    description: 'Computação distribuída para reduzir latência e melhorar performance global.',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    icon: Database,
    title: 'Banco de Dados Distribuído',
    description: 'Arquitetura de dados resiliente com backup automático e recuperação de desastres.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Cloud,
    title: 'Infraestrutura em Nuvem',
    description: 'Escalabilidade automática e alta disponibilidade com redundância geográfica.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Monitoramento Avançado',
    description: 'Sistema de alertas inteligentes e métricas detalhadas para operação proativa.',
    color: 'from-emerald-500 to-green-600',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recursos <span className="gradient-text">Avançados</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tecnologia de ponta para garantir segurança, performance e confiabilidade em todas as operações
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="glass-card p-8 h-full border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Tecnologia de <span className="gradient-text">Ponta</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa plataforma utiliza as mais recentes tecnologias de segurança, IA e computação em nuvem 
              para oferecer uma experiência premium e confiável para sua operação agrícola.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-secondary/50 rounded-full">AWS Amplify</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Next.js 14</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">TypeScript</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Tailwind CSS</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Framer Motion</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Solana Web3</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
