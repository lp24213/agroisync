'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';

export function DashboardSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl text-[#00FF7F] font-bold tracking-wide drop-shadow-neon mb-8 animate-fadeIn">
              Dashboard Interativo
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-10">
              Analytics avançados e interface de monitoramento em tempo real com tecnologia Web3 de ponta para maximizar seus investimentos.
            </p>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron text-lg">Analytics em Tempo Real</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron text-lg">Métricas Avançadas</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron text-lg">Acompanhamento de Performance</span>
              </motion.div>
            </div>
            
            {/* Feature Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              <div className="text-center">
                <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon">
                  <BarChart3 className="text-[#00FF7F]" size={32} />
                </div>
                <div className="text-[#00FF7F] font-orbitron text-sm">Analytics</div>
              </div>
              <div className="text-center">
                <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon">
                  <TrendingUp className="text-[#00FF7F]" size={32} />
                </div>
                <div className="text-[#00FF7F] font-orbitron text-sm">Trends</div>
              </div>
              <div className="text-center">
                <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon">
                  <Activity className="text-[#00FF7F]" size={32} />
                </div>
                <div className="text-[#00FF7F] font-orbitron text-sm">Performance</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/images/dashboard/interactive-dashboard.png" 
                alt="AGROTM Interactive Dashboard" 
                width={600} 
                height={400}
                className="rounded-3xl shadow-neon hover:scale-105 transition-transform duration-500"
                unoptimized={true}
                priority
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('interactive-dashboard.png')) {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              {/* Fallback */}
              <div className="hidden w-[600px] h-[400px] bg-gradient-to-br from-[#00FF7F]/10 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon">
                <div className="text-center">
                  <div className="text-8xl mb-4">📊</div>
                  <div className="text-[#00FF7F] font-orbitron text-2xl mb-2">Dashboard Interativo</div>
                  <div className="text-gray-300 text-lg">Analytics em Tempo Real</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 