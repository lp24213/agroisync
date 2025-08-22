'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Globe, TrendingUp, Users, Rocket } from 'lucide-react';

export function FeaturesShowcase() {
  const features = [
    {
      icon: Zap,
      title: 'Tecnologia de Ponta',
      description: 'Blockchain, IA e IoT integrados para máxima eficiência',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Criptografia avançada e compliance LGPD garantidos',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Mercado Global',
      description: 'Acesso a mercados internacionais e criptomoedas',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Avançado',
      description: 'Insights em tempo real para decisões estratégicas',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Rede de produtores, investidores e especialistas',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Rocket,
      title: 'Inovação Constante',
      description: 'Sempre na vanguarda da tecnologia agrícola',
      color: 'from-red-400 to-pink-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="py-16"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Por que escolher o AgroSync?
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A plataforma mais avançada do mundo para agronegócio, 
          combinando tecnologia de ponta com simplicidade de uso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-16"
      >
        <div className="bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 border border-cyan-400/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para o futuro do agronegócio?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de produtores que já estão revolucionando 
            suas operações com o AgroSync + AgroConecta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300">
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300">
              Ver Demonstração
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
