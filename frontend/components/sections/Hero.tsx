'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute w-full h-full object-cover opacity-40"
          style={{ filter: 'brightness(0.4) contrast(1.2) saturate(1.2)' }}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-agro-darker/80 via-agro-darker to-agro-darker"></div>
        
        {/* Additional Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/5 via-transparent to-agro-green/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-gradient-to-br from-agro-blue/10 via-agro-green/5 to-agro-purple/10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
            }}
          />
        </div>
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="digital-rain"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-agro-blue/20 blur-xl"
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
          className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-agro-green/20 blur-xl"
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
        <motion.div 
          className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-agro-purple/15 blur-lg"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 15, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/3 w-20 h-20 rounded-full bg-agro-neon/10 blur-md"
          animate={{ 
            x: [0, 25, 0], 
            y: [0, -10, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 9,
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight cyberpunk-glitch">
            <span className="text-white text-glow-white">O Futuro da</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-agro-blue via-blue-400 to-agro-green text-glow neon-text">Agricultura DeFi</span>
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Revolucionando a agricultura sustentável através da blockchain. 
            Stake, farm e ganhe enquanto apoia práticas agrícolas eco-friendly.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-start items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button variant="primary" size="lg" className="group relative overflow-hidden cyberpunk-button">
              <span className="relative z-10">Começar Agora</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-agro-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-0.5 bg-gradient-to-r from-agro-blue to-agro-green opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 group-hover:blur-md"></span>
            </Button>
            <Button variant="outline" size="lg" className="group relative overflow-hidden border-agro-blue/50 hover:border-agro-blue cyberpunk-button-outline">
              <span className="relative z-10">Saiba Mais</span>
              <span className="absolute inset-0 bg-agro-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-0.5 bg-agro-blue opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 group-hover:blur-md"></span>
            </Button>
          </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <img 
                src="/assets/images/hero/farmer-tech-character.png" 
                alt="Fazendeiro Tecnológico AGROTM" 
                className="w-full max-w-md h-auto object-contain"
              />
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* Connecting Lines */}
          <div className="absolute left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-agro-blue/30 to-transparent top-1/2 -translate-y-24 hidden md:block"></div>
          <div className="absolute left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-agro-green/30 to-transparent top-1/2 translate-y-24 hidden md:block"></div>
          <motion.div 
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="text-center relative z-10 p-6">
                <div className="text-3xl font-bold text-agro-blue mb-2 flex items-center justify-center cyberpunk-value">
                  <span className="mr-2">$</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    12.5M
                  </motion.span>
                </div>
                <div className="text-gray-400">Total Value Locked</div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-agro-darker/80 border border-agro-green/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              <div className="absolute inset-0 bg-gradient-to-r from-agro-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-green to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-green to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="text-center relative z-10 p-6">
                <div className="text-3xl font-bold text-agro-green mb-2 flex items-center justify-center cyberpunk-value">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    25K
                  </motion.span>
                  <span className="ml-1">+</span>
                </div>
                <div className="text-gray-400">Usuários Ativos</div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-agro-darker/80 border border-agro-purple/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              <div className="absolute inset-0 bg-gradient-to-r from-agro-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="text-center relative z-10 p-6">
                <div className="text-3xl font-bold text-agro-purple mb-2 flex items-center justify-center cyberpunk-value">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    18.5
                  </motion.span>
                  <span className="ml-1">%</span>
                </div>
                <div className="text-gray-400">APR Médio</div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}