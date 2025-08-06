'use client';

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Coins, Zap, Globe, Users } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation('common');
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#000000] overflow-hidden">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="lg" iconOnly={true} />
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-orbitron text-4xl md:text-6xl lg:text-7xl gradient-text font-bold tracking-wide mb-6 animate-fadeIn"
          >
            {t('hero.title', 'O Futuro do Agronegócio na Blockchain')}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-orbitron leading-relaxed"
          >
            {t('hero.subtitle', 'Staking, NFTs e Smart Farms com tecnologia avançada para revolucionar o agronegócio.')}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-10 py-4 rounded-xl font-orbitron font-bold flex items-center justify-center gap-3"
            >
              {t('hero.button', 'Começar Agora')}
              <ArrowRight size={24} />
            </motion.button>
            <Link href="/documentation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-10 py-4 rounded-xl font-orbitron font-bold transition-all duration-300"
              >
                {t('hero.docButton', 'Ver Documentação')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Hero Image - Farmer Tech Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/images/hero/farmer-tech-character.png" 
                alt="Premium Farmer Tech Character" 
                width={400} 
                height={400}
                className="drop-shadow-[0_0_40px_rgba(0,255,127,0.8)] rounded-3xl"
                unoptimized={true}
                priority
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('farmer-tech-character.png')) {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              {/* Fallback */}
              <div className="hidden w-[400px] h-[400px] bg-gradient-to-br from-[#00FF7F]/20 to-[#00FF7F]/5 border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌾</div>
                  <div className="text-[#00FF7F] font-orbitron text-2xl">AGROTM</div>
                  <div className="text-gray-300 text-lg">Premium Farming</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* Staking Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center cyberpunk-card p-8 rounded-2xl backdrop-blur-sm"
            >
              <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
                <TrendingUp className="text-[#00FF7F]" size={40} />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">{t('features.stakingPremium.title', 'Staking Premium')}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{t('features.stakingPremium.description', 'Ganhe recompensas através de staking DeFi e yield farming avançado')}</p>
            </motion.div>

            {/* Security Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center cyberpunk-card p-8 rounded-2xl backdrop-blur-sm"
            >
              <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
                <Shield className="text-[#00FF7F]" size={40} />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">{t('features.advancedSecurity.title', 'Segurança Avançada')}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{t('features.advancedSecurity.description', 'Proteção blockchain de última geração e auditoria contínua')}</p>
            </motion.div>

            {/* NFTs Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center cyberpunk-card p-8 rounded-2xl backdrop-blur-sm"
            >
              <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
                <Coins className="text-[#00FF7F]" size={40} />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">{t('features.agriculturalNFTs.title', 'NFTs Agrícolas')}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{t('features.agriculturalNFTs.description', 'Crie e negocie ativos digitais agrícolas únicos e valiosos')}</p>
            </motion.div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">$50M+</div>
              <div className="text-gray-400 font-orbitron">{t('stats.tvl', 'TVL Total')}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">10K+</div>
              <div className="text-gray-400 font-orbitron">{t('stats.activeUsers', 'Usuários Ativos')}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">500+</div>
              <div className="text-gray-400 font-orbitron">{t('features.agriculturalNFTs.title', 'NFTs Criados')}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">99.9%</div>
              <div className="text-gray-400 font-orbitron">Uptime</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}