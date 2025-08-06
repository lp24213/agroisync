'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

export function StakingSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl text-[#00F0FF] mb-6 animate-fadeIn">
              Staking & Farming
            </h2>
            <p className="text-lg md:text-xl text-[#cccccc] leading-relaxed mb-8">
              Ganhe recompensas através de staking DeFi e yield farming com taxas APY competitivas.
            </p>
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-[#00F0FF] rounded-full shadow-neon"></div>
                <span className="text-[#cccccc] font-orbitron">Staking de Alto Rendimento</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-[#00F0FF] rounded-full shadow-neon"></div>
                <span className="text-[#cccccc] font-orbitron">Mining de Liquidez</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-[#00F0FF] rounded-full shadow-neon"></div>
                <span className="text-[#cccccc] font-orbitron">Direitos de Governança</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/staking.png" 
                alt="AGROTM Staking & Farming" 
                width={600} 
                height={400}
                className="rounded-2xl shadow-neon hover:shadow-neon transition-all duration-500"
                unoptimized={true}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('staking.png')) {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              <div className="w-[600px] h-[400px] bg-gradient-to-br from-[#00F0FF]/10 to-[#000000] border-2 border-[#00F0FF]/30 rounded-2xl flex items-center justify-center shadow-neon">
                <div className="text-center">
                  <div className="text-8xl mb-4">💰</div>
                  <div className="text-[#00F0FF] font-orbitron text-2xl mb-2">Staking & Farming</div>
                  <div className="text-[#cccccc] text-lg">Alto Rendimento DeFi</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 