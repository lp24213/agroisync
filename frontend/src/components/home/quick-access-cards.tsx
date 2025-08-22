'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Coins, 
  Wheat, 
  Truck, 
  BarChart3, 
  Bot,
  ArrowRight
} from 'lucide-react'

const quickAccessItems = [
  {
    title: 'Gestão Agrícola',
    description: 'Controle completo da sua operação agrícola',
    icon: Wheat,
    href: '/grains',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    title: 'Analytics',
    description: 'Dashboards e KPIs em tempo real',
    icon: BarChart3,
    href: '/analytics',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    title: 'Loja Online',
    description: 'Catálogo de produtos agrícolas',
    icon: ShoppingCart,
    href: '/store',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    title: 'Criptomoedas',
    description: 'Trading e cotações em tempo real',
    icon: Coins,
    href: '/crypto',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    title: 'AgroConecta',
    description: 'Marketplace de fretes agrícolas',
    icon: Truck,
    href: '/agroconecta',
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    title: 'Chatbot IA',
    description: 'Assistente inteligente para agricultura',
    icon: Bot,
    href: '/chatbot',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
]

export function QuickAccessCards() {
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
            Acesso <span className="gradient-text">Rápido</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acesse todas as funcionalidades da plataforma AgroSync de forma intuitiva e eficiente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {quickAccessItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={item.href}>
                <div className={`glass-card p-8 h-full border ${item.borderColor} hover:border-primary/50 transition-all duration-300 cursor-pointer`}>
                  <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-8 h-8 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                      Acessar
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
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
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Precisa de algo específico?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para ajudar com soluções personalizadas para sua operação agrícola
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <span>Falar com Especialista</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
