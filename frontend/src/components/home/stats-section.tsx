'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  Database
} from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Usuários Ativos',
    description: 'Agricultores e empresas confiam na plataforma',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Globe,
    value: '150+',
    label: 'Países',
    description: 'Cobertura global com presença internacional',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Shield,
    value: '99.99%',
    label: 'Uptime',
    description: 'Disponibilidade garantida com redundância',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Zap,
    value: '<100ms',
    label: 'Latência',
    description: 'Performance otimizada para máxima velocidade',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    icon: TrendingUp,
    value: '24/7',
    label: 'Monitoramento',
    description: 'Vigilância contínua com IA avançada',
    color: 'from-red-500 to-pink-600',
  },
  {
    icon: Database,
    value: '1M+',
    label: 'Transações',
    description: 'Processamento seguro de operações',
    color: 'from-indigo-500 to-purple-600',
  },
]

export function StatsSection() {
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
            Números que <span className="gradient-text">Impressionam</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados comprovados de uma plataforma que revoluciona a agricultura digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="glass-card p-8 h-full border border-border/50 hover:border-primary/50 transition-all duration-300 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`w-10 h-10 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-primary mb-2">
                    {stat.label}
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {stat.description}
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
              Crescimento <span className="gradient-text">Exponencial</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa plataforma continua expandindo rapidamente, atendendo cada vez mais agricultores 
              e empresas em todo o mundo com soluções inovadoras e confiáveis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">300%</div>
                <div className="text-sm text-muted-foreground">Crescimento Anual</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Satisfação do Cliente</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Suporte Técnico</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
