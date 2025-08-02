'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import Image from 'next/image';

const features = [
  {
    icon: '/assets/icons/leaf.svg',
    title: 'Agricultura Sustentável',
    description: 'Tecnologia blockchain para rastreamento completo da cadeia agrícola, garantindo transparência e sustentabilidade.',
    color: 'agro-green'
  },
  {
    icon: '/assets/icons/coin.svg',
    title: 'DeFi & Staking',
    description: 'Stake seus tokens AGROTM e ganhe recompensas enquanto apoia projetos agrícolas sustentáveis.',
    color: 'agro-blue'
  },
  {
    icon: '/assets/icons/nft.svg',
    title: 'NFTs Agrícolas',
    description: 'Tokenize propriedades rurais e ativos agrícolas como NFTs únicos e valiosos.',
    color: 'agro-purple'
  },
  {
    icon: '/assets/icons/chart.svg',
    title: 'Analytics Avançados',
    description: 'Dashboard completo com métricas em tempo real sobre performance agrícola e retornos DeFi.',
    color: 'agro-yellow'
  },
  {
    icon: '/assets/icons/wallet.svg',
    title: 'Wallet Integrado',
    description: 'Carteira digital segura integrada para gerenciar seus ativos AGROTM e NFTs.',
    color: 'agro-red'
  },
  {
    icon: '/assets/icons/check.svg',
    title: 'Governança DAO',
    description: 'Participe das decisões da plataforma através de votação descentralizada com tokens AGROTM.',
    color: 'agro-neon'
  }
];

export function Features() {
  return (
    <section className="py-20 bg-agro-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/3 right-1/5 w-32 h-32 rounded-full bg-agro-blue/20 blur-xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/5 w-40 h-40 rounded-full bg-agro-green/20 blur-xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4 text-glow">
            Por que escolher a <span className="text-agro-green">AGROTM</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Nossa plataforma combina inovação DeFi com sustentabilidade agrícola,
            oferecendo oportunidades únicas de investimento.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center hover:transform hover:scale-105 transition-transform duration-300 bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="relative z-10 p-6">
                  <motion.div 
                    className="text-4xl mb-4 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <Image src={feature.icon} alt={feature.title} width={64} height={64} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}