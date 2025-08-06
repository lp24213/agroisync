'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Leaf, TrendingUp, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export function Hero() {
  const { t } = useTranslation('common');

  return (
    <section className="min-h-screen bg-black-matte relative overflow-hidden flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-10"></div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-orbitron text-4xl md:text-6xl lg:text-7xl gradient-text font-bold tracking-wide mb-6 animate-fadeIn"
            >
              Transformando o Agronegócio com Tecnologia de Ponta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-[#00F0FF] mb-12 max-w-4xl mx-auto font-orbitron leading-relaxed"
            >
              Conectando o campo ao futuro digital com segurança, rastreabilidade e eficiência.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4 rounded-xl font-orbitron font-bold flex items-center justify-center gap-3"
              >
                Começar Agora
              </motion.button>
              <Link href="/documentation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-10 py-4 rounded-xl font-orbitron font-bold transition-all duration-300"
                >
                  Saiba Mais
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Image 
                src="/assets/images/hero/farmer-tech-character.jpg" 
                alt="Farmer Tech Character" 
                width={600} 
                height={500}
                className="rounded-3xl shadow-neon-green"
                unoptimized={true}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-[600px] h-[500px] bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <div className="text-[#00F0FF] font-orbitron text-xl">Tecnologia no Agro</div>
                  <div className="text-[#00F0FF] text-base">Soluções Digitais Avançadas</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <Zap className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-[#00FF7F] mb-4">Inovação Contínua</h3>
            <p className="text-[#00F0FF] text-base leading-relaxed">Tecnologia avançada para transformar o setor agrícola</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <Shield className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-[#00FF7F] mb-4">Segurança Digital</h3>
            <p className="text-[#00F0FF] text-base leading-relaxed">Proteção avançada para dados, transações e ativos agrícolas</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <Leaf className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-[#00FF7F] mb-4">Sustentabilidade</h3>
            <p className="text-[#00F0FF] text-base leading-relaxed">Compromisso com práticas agrícolas responsáveis e ecológicas</p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">10K+</div>
            <div className="text-[#00F0FF] font-orbitron text-sm">Usuários Ativos</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="text-center"
          >
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">99.9%</div>
            <div className="text-[#00F0FF] font-orbitron text-sm">Uptime</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-center"
          >
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">25+</div>
            <div className="text-[#00F0FF] font-orbitron text-sm">Países</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center"
          >
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">24/7</div>
            <div className="text-[#00F0FF] font-orbitron text-sm">Suporte</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}