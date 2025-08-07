'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coins, Lock, TrendingUp, Shield } from 'lucide-react';

const StakingSection: React.FC = () => {
  const features = [
    {
      icon: <Coins className="w-5 h-5" />,
      title: 'Staking Inteligente',
      description: 'Rentabilização automática de ativos agrícolas'
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Segurança Total',
      description: 'Proteção blockchain para todos os investimentos'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Yield Farming',
      description: 'Maximização de retornos com estratégias avançadas'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Transparência',
      description: 'Auditoria completa de todas as operações'
    }
  ];

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-[#00bfff] mb-6">
              Staking <span className="text-[#00bfff]">Inteligente</span>
            </h2>
            
            <p className="text-lg text-[#00bfff] mb-8 max-w-2xl mx-auto lg:mx-0">
              Plataforma DeFi avançada para staking e yield farming de ativos agrícolas com rentabilização automática e segurança blockchain.
            </p>

            {/* Features - CAIXAS MENORES */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/70 border border-[#00bfff]/20 backdrop-blur-sm p-4 rounded-lg hover:shadow-neon-blue transition-all duration-300"
                >
                  <div className="bg-[#00bfff]/20 p-2 rounded-lg mb-3 inline-block">
                    <div className="text-[#00bfff]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-orbitron font-semibold text-[#00bfff] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#00bfff]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden border border-[#00bfff]/20 shadow-neon-blue">
              <Image
                src="/assets/images/staking/staking-farming.png"
                alt="Staking Inteligente - Plataforma DeFi Avançada"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StakingSection; 