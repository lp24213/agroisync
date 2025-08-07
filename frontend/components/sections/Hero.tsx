'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Shield, Leaf, TrendingUp, Play, Star } from 'lucide-react';
import { ParticleEffect } from '../ui/ParticleEffect';
import { AnimatedGradient } from '../ui/AnimatedGradient';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-premium-black">
      {/* Background Effects */}
      <ParticleEffect />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-premium-black via-premium-dark to-premium-black"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        <div className="absolute inset-0 scanlines opacity-10"></div>
        
        {/* Animated Background Circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-premium-neon-blue/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-premium-neon-green/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-premium-neon-purple/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black mb-8"
            style={{ y, opacity }}
          >
            <span className="bg-gradient-to-r from-premium-neon-blue via-premium-neon-cyan to-premium-neon-green bg-clip-text text-transparent animate-pulse-neon">
              AGROTM
            </span>
            <span className="text-premium-neon-green">.</span>
            <span className="text-premium-neon-purple">SOL</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-3xl text-premium-light mb-16 max-w-5xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('hero.description')}
          </motion.p>
        </motion.div>

        {/* Central Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-20"
        >
          <div className="relative w-40 h-40 mx-auto">
            <motion.div
              className="w-full h-full bg-gradient-to-br from-premium-neon-blue/20 to-premium-neon-green/20 rounded-full border-2 border-premium-neon-blue flex items-center justify-center shadow-neon-blue relative overflow-hidden"
              animate={{
                rotate: 360,
                boxShadow: [
                  "0 0 30px rgba(0, 240, 255, 0.5)",
                  "0 0 60px rgba(0, 240, 255, 0.8)",
                  "0 0 30px rgba(0, 240, 255, 0.5)"
                ]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-premium-neon-blue to-premium-neon-green rounded-full flex items-center justify-center relative overflow-hidden">
                <span className="text-premium-black font-orbitron font-black text-3xl z-10">A</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="btn-primary px-12 py-4 text-lg font-orbitron flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('hero.enterPlatform')}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="btn-secondary px-12 py-4 text-lg font-orbitron flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('hero.learnMore')}</span>
            <Play className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { icon: Zap, title: t('hero.features.technology.title'), description: t('hero.features.technology.description') },
            { icon: Shield, title: t('hero.features.security.title'), description: t('hero.features.security.description') },
            { icon: Leaf, title: t('hero.features.sustainability.title'), description: t('hero.features.sustainability.description') },
            { icon: TrendingUp, title: t('hero.features.growth.title'), description: t('hero.features.growth.description') },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card-premium text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-premium-neon-blue to-premium-neon-green rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-8 h-8 text-premium-black" />
              </motion.div>
              <h3 className="text-xl font-orbitron font-bold text-premium-neon-blue mb-2">
                {feature.title}
              </h3>
              <p className="text-premium-light/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {[
            { number: '1,000+', label: t('hero.stats.farms') },
            { number: '$50M+', label: t('hero.stats.assets') },
            { number: '99.9%', label: t('hero.stats.uptime') },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-4xl md:text-5xl font-orbitron font-bold text-premium-neon-blue mb-2 animate-pulse-neon">
                {stat.number}
              </div>
              <div className="text-premium-light/80 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;