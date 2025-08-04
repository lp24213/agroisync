'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp, Leaf, Zap } from 'lucide-react';

const stakingFeatures = [
  {
    icon: Coins,
    title: 'Staking Rewards',
    description: 'Ganhe recompensas por fazer stake dos seus tokens',
    color: 'text-yellow-400'
  },
  {
    icon: TrendingUp,
    title: 'Yield Farming',
    description: 'Maximize seus retornos com farming inteligente',
    color: 'text-green-400'
  },
  {
    icon: Leaf,
    title: 'Agricultura Sustentável',
    description: 'Apoie projetos agrícolas eco-friendly',
    color: 'text-emerald-400'
  },
  {
    icon: Zap,
    title: 'APR Alto',
    description: 'Taxas de retorno atrativas e competitivas',
    color: 'text-blue-400'
  }
];

export function StakingSection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Coins className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Staking & Farming</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 to-green-600 bg-clip-text text-transparent">
              Staking
            </span>
            <br />
            <span className="text-white">& Farming</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Faça stake dos seus tokens e participe do yield farming para maximizar
            seus retornos enquanto apoia a agricultura sustentável.
          </motion.p>
        </div>

        {/* Staking Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="flex justify-center">
              <img 
                src="/assets/images/staking/staking-farming.png" 
                alt="Staking & Farming AGROTM" 
                className="w-full max-w-4xl h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Staking Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stakingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-4`}>
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