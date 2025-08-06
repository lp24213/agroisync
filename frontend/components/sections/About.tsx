'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/3 left-1/5 w-32 h-32 rounded-full bg-[#00FF7F]/20 blur-xl"
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
          className="absolute bottom-1/4 right-1/5 w-40 h-40 rounded-full bg-[#00FF7F]/20 blur-xl"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl text-[#00FF7F] mb-6 animate-fadeIn">
              Sobre a <span className="text-[#00FF7F]">AGROTM</span>
            </h2>
            <p className="text-lg md:text-xl text-[#cccccc] mb-6">
              Plataforma revolucionária que conecta agricultores e investidores através da tecnologia blockchain, criando um ecossistema sustentável e transparente.
            </p>
            <p className="text-lg md:text-xl text-[#cccccc] mb-6">
              Nossa missão é democratizar o acesso ao agronegócio, permitindo que qualquer pessoa participe do mercado agrícola através de tokens digitais.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                className="relative bg-black/70 border border-[#00FF7F]/30 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FF7F]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FF7F]"></div>
                <motion.h3 
                  className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  25K+
                </motion.h3>
                <p className="text-[#cccccc]">Usuários Ativos</p>
              </motion.div>
              <motion.div 
                className="relative bg-black/70 border border-[#00FF7F]/30 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FF7F]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FF7F]"></div>
                <motion.h3 
                  className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  $12.5M
                </motion.h3>
                <p className="text-[#cccccc]">TVL Total</p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Card className="bg-black/70 border border-[#00FF7F]/20 p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00FF7F] text-2xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F]">Agricultura Tokenizada</h3>
                    <p className="text-[#cccccc]">Ativos agrícolas transformados em tokens digitais</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00FF7F] text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F]">Segurança Blockchain</h3>
                    <p className="text-[#cccccc]">Transações seguras e transparentes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00FF7F]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00FF7F] text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F]">Analytics Avançados</h3>
                    <p className="text-[#cccccc]">Dados em tempo real e métricas de performance</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}