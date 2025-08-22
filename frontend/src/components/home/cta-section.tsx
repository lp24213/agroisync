'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Play, 
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Proteção avançada contra todas as ameaças',
  },
  {
    icon: Zap,
    title: 'Performance Premium',
    'description': 'Velocidade e responsividade excepcionais',
  },
  {
    icon: Globe,
    title: 'Cobertura Global',
    description: 'Disponível em mais de 150 países',
  },
]

export function CTASection() {
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
            Pronto para <span className="gradient-text">Revolucionar</span> sua Agricultura?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Junte-se a milhares de agricultores que já transformaram suas operações 
            com a plataforma AgroSync. Comece hoje mesmo!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue/90 hover:to-neon-cyan/90 text-white px-8 py-4 text-lg font-semibold shadow-neon-blue"
                asChild
              >
                <Link href="/store">
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-8 text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Avaliação 5.0/5.0 pelos Usuários
            </h3>
            <p className="text-muted-foreground mb-4">
              "AgroSync transformou completamente nossa operação agrícola. 
              A segurança e performance são excepcionais!" - João Silva, Fazenda Verde
            </p>
            <Link 
              href="/contact"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Falar com Especialista →
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground text-sm">
            🚀 Plataforma em constante evolução • 🔒 Segurança de nível bancário • 🌍 Disponível globalmente
          </p>
        </motion.div>
      </div>
    </section>
  )
}
