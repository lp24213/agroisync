'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, Shield, Leaf, TrendingUp } from 'lucide-react';

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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-[#00bfff] mb-6 animate-fadeIn">
              AGROTM
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-[#00bfff]">
                Revolução Digital no Agronegócio
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#00bfff] mb-8 max-w-2xl mx-auto lg:mx-0">
              Plataforma blockchain avançada para tokenização, gestão inteligente e rentabilização de ativos agrícolas com tecnologia de ponta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="btn-primary">
                Começar Agora
              </button>
              <button className="btn-secondary">
                Saiba Mais
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden border border-[#00bfff]/20 shadow-neon-blue">
              <Image
                src="/assets/images/hero/farmer-tech-character.png"
                alt="Agricultor Digital - Tecnologia Avançada no Campo"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Features Cards - CAIXAS MENORES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cyberpunk-card p-4 text-center bg-black/70 border border-[#00bfff]/20 backdrop-blur-sm hover:shadow-neon-blue transition-all duration-300"
              >
                <div className="bg-[#00bfff]/20 p-3 rounded-lg mb-3 inline-block">
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

        {/* Stats - MENORES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-orbitron font-bold text-[#00bfff] mb-1">
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
    </section>
  );
};

export default Hero;