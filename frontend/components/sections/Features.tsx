'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import Image from 'next/image';

export function Features() {
  const features = [
    {
      icon: '/images/leaf.svg',
      title: 'Agricultura Sustentável',
      description: 'Tecnologia blockchain para rastreabilidade e sustentabilidade agrícola',
      color: '[#00bfff]'
    },
    {
      icon: '/images/coin.svg',
      title: 'Staking DeFi',
      description: 'Ganhe recompensas através de staking e yield farming',
      color: '[#00bfff]'
    },
    {
      icon: '/images/nft.svg',
      title: 'NFTs Agrícolas',
      description: 'Tokenização de ativos agrícolas únicos',
      color: '[#00bfff]'
    },
    {
      icon: '/images/chart.svg',
      title: 'Analytics Avançados',
      description: 'Dados em tempo real e métricas de performance',
      color: '[#00bfff]'
    },
    {
      icon: '/images/wallet.svg',
      title: 'Carteira Integrada',
      description: 'Carteira Web3 integrada para transações seguras',
      color: '[#00bfff]'
    },
    {
      icon: '/images/check.svg',
      title: 'Governança DAO',
      description: 'Participação na governança descentralizada',
      color: '[#00bfff]'
    }
  ];

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/3 right-1/5 w-32 h-32 rounded-full bg-[#00bfff]/20 blur-xl"
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
          className="absolute bottom-1/4 left-1/5 w-40 h-40 rounded-full bg-[#00bfff]/20 blur-xl"
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00bfff] mb-4 animate-fadeIn">
            Por que escolher <span className="text-[#00bfff]">AGROTM</span>?
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-3xl mx-auto">
            Plataforma revolucionária que conecta agricultores e investidores através da tecnologia blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
                             <Card className="h-full bg-black/70 border border-[#00bfff]/20 hover:shadow-neon transition-all duration-300">
                 <div className="text-center p-6">
                   <div className={`w-16 h-16 bg-[#00bfff]/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                     <Image
                       src={feature.icon}
                       alt={feature.title}
                       width={32}
                       height={32}
                       className="w-8 h-8"
                     />
                   </div>
                   <h3 className="text-xl font-orbitron font-semibold text-[#00bfff] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#cccccc] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}