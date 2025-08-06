'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Shield, Leaf, Zap, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-black-matte min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Conteúdo Principal */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transformando o Agronegócio com{' '}
              <span className="text-[#00bfff]">Tecnologia de Ponta</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#00bfff] leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Conectando o campo ao futuro digital com segurança, rastreabilidade e eficiência.
            </motion.p>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="btn-primary flex items-center justify-center gap-2 group">
              Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Saiba Mais
            </button>
          </motion.div>

          {/* Estatísticas */}
          <motion.div 
            className="grid grid-cols-3 gap-8 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00bfff] mb-2">500+</div>
              <div className="text-sm text-[#00bfff]">Produtores Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00bfff] mb-2">$2.5M</div>
              <div className="text-sm text-[#00bfff]">Volume Transacionado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00bfff] mb-2">99.9%</div>
              <div className="text-sm text-[#00bfff]">Segurança Garantida</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Imagem Principal */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/hero/farmer-tech-character.png"
              alt="Farmer Tech Character - Agricultor com Tecnologia Futurista"
              fill
              className="object-cover"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Features Cards */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Tecnologia no Agro */}
          <motion.div 
            className="cyberpunk-card p-6 backdrop-blur-sm"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                <Leaf className="w-6 h-6 text-[#00bfff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00bfff] mb-1">Tecnologia no Agro</h3>
                <p className="text-sm text-[#00bfff]">Soluções Digitais Avançadas</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Segurança */}
          <motion.div 
            className="cyberpunk-card p-6 backdrop-blur-sm"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                <Shield className="w-6 h-6 text-[#00bfff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00bfff] mb-1">Segurança</h3>
                <p className="text-sm text-[#00bfff]">Protocolos Avançados</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Inovação */}
          <motion.div 
            className="cyberpunk-card p-6 backdrop-blur-sm"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                <Zap className="w-6 h-6 text-[#00bfff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00bfff] mb-1">Inovação</h3>
                <p className="text-sm text-[#00bfff]">Tecnologia de Ponta</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;