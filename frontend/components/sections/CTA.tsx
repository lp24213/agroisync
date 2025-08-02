'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function CTA() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/20 to-agro-green/20 z-0">
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="digital-rain"></div>
      </div>
      
      {/* Glowing orbs */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-agro-blue/20 blur-xl z-0"
        animate={{ 
          x: [0, 30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-agro-green/20 blur-xl z-0"
        animate={{ 
          x: [0, -30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut" 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden cyberpunk-border p-0.5">
          <div className="bg-agro-darker/90 backdrop-blur-md p-12 rounded-lg relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-agro-blue"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-agro-green"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-agro-green"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-agro-blue"></div>
            <div className="text-center">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 text-glow cyberpunk-glitch"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.span 
                      className="absolute inset-0 text-agro-blue opacity-30 blur-sm"
                      initial={{ x: -4, opacity: 0 }}
                      animate={{ x: -2, opacity: 0.3 }}
                      exit={{ x: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Pronto para revolucionar a agricultura?
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-agro-blue to-agro-green relative z-10">
                  Pronto para revolucionar a agricultura?
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Junte-se à revolução da agricultura DeFi e comece a ganhar recompensas
                enquanto apoia projetos sustentáveis com tecnologia blockchain.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="group relative overflow-hidden neon-box cyberpunk-button"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Conectar Carteira
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-0.5 bg-gradient-to-r from-agro-blue to-agro-green opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 group-hover:blur-md"></span>
                  
                  {/* Animated corner accents */}
                  <span className="absolute top-0 left-0 w-2 h-0 bg-agro-blue group-hover:h-full transition-all duration-300 delay-100"></span>
                  <span className="absolute bottom-0 right-0 w-2 h-0 bg-agro-green group-hover:h-full transition-all duration-300 delay-100"></span>
                  <span className="absolute bottom-0 left-0 h-2 w-0 bg-agro-green group-hover:w-full transition-all duration-300 delay-200"></span>
                  <span className="absolute top-0 right-0 h-2 w-0 bg-agro-blue group-hover:w-full transition-all duration-300 delay-200"></span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group relative overflow-hidden border-agro-green/50 hover:border-agro-green cyberpunk-button-outline"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Ler Whitepaper
                  </span>
                  <span className="absolute inset-0 bg-agro-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-0.5 bg-agro-green opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 group-hover:blur-md"></span>
                  
                  {/* Animated corner accents */}
                  <span className="absolute top-0 left-0 w-2 h-0 bg-agro-green group-hover:h-full transition-all duration-300 delay-100"></span>
                  <span className="absolute bottom-0 right-0 w-2 h-0 bg-agro-green group-hover:h-full transition-all duration-300 delay-100"></span>
                  <span className="absolute bottom-0 left-0 h-2 w-0 bg-agro-green group-hover:w-full transition-all duration-300 delay-200"></span>
                  <span className="absolute top-0 right-0 h-2 w-0 bg-agro-green group-hover:w-full transition-all duration-300 delay-200"></span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}