'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Cyber Defense',
    description: 'Proteção avançada contra ataques cibernéticos',
    color: 'text-cyan-400'
  },
  {
    icon: Lock,
    title: 'Smart Contracts',
    description: 'Contratos inteligentes auditados e seguros',
    color: 'text-blue-400'
  },
  {
    icon: Eye,
    title: 'Monitoramento 24/7',
    description: 'Vigilância contínua de todas as transações',
    color: 'text-green-400'
  },
  {
    icon: Zap,
    title: 'AI Protection',
    description: 'Inteligência artificial para detecção de fraudes',
    color: 'text-purple-400'
  }
];

export function SecuritySection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-medium">Security First</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Cyber Defense
            </span>
            <br />
            <span className="text-white">Proteção Avançada</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Sua segurança é nossa prioridade. Implementamos as mais avançadas tecnologias
            de proteção cibernética para garantir a integridade dos seus investimentos.
          </motion.p>
        </div>

        {/* Security Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="flex justify-center">
              <img 
                src="/assets/images/security/cyber-defense.png" 
                alt="Cyber Defense AGROTM" 
                className="w-full max-w-4xl h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 