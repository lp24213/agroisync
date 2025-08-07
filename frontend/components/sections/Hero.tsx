'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Leaf, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Tecnologia Avançada',
      description: 'Soluções digitais de ponta para o agronegócio'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança Blockchain',
      description: 'Proteção total de ativos agrícolas'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Sustentabilidade',
      description: 'Práticas agrícolas responsáveis'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Crescimento Inteligente',
      description: 'Maximização de resultados'
    }
  ];

  const stats = [
    { value: '500+', label: 'Fazendas Conectadas' },
    { value: 'R$ 50M+', label: 'Ativos Tokenizados' },
    { value: '99.9%', label: 'Uptime Garantido' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black-matte">
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold text-[#00bfff] mb-6 animate-fadeIn">
              AGROTM<span className="text-[#00bfff]">.SOL</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#00bfff] mb-12 max-w-4xl mx-auto">
              A maior plataforma para o agronegócio mundial. Staking, NFTs agrícolas e governança descentralizada na Solana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="btn-primary flex items-center gap-2 group px-8 py-4 text-lg">
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary px-8 py-4 text-lg">
                Documentação
              </button>
            </div>
          </motion.div>

          {/* Ícone Central */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full bg-gradient-to-br from-[#00bfff]/20 to-[#0080ff]/20 rounded-full border-2 border-[#00bfff] flex items-center justify-center shadow-neon-blue">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00bfff] to-[#0080ff] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">A</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Cards - CAIXAS MENORES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#00bfff]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00bfff]/30">
                    <div className="text-[#00bfff]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-orbitron font-semibold text-[#00bfff] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#00bfff]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats - MENORES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-orbitron font-bold text-[#00bfff] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#00bfff]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;