'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Users, DollarSign, Shield, Zap } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      title: 'Produtores Ativos',
      value: '500+',
      change: '+12%',
      isPositive: true,
      icon: Users
    },
    {
      title: 'Volume Transacionado',
      value: 'R$ 50M+',
      change: '+25%',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'Segurança Garantida',
      value: '99.9%',
      change: '+0.1%',
      isPositive: true,
      icon: Shield
    },
    {
      title: 'Tecnologia Avançada',
      value: '24/7',
      change: '100%',
      isPositive: true,
      icon: Zap
    }
  ];

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div 
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-[#00bfff]/20 blur-xl"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      ></div>
      
      <div 
        className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-[#00bfff]/20 blur-xl"
        style={{ animation: 'float 8s ease-in-out infinite reverse' }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00bfff] mb-4 animate-fadeIn">
            Números <span className="text-[#00bfff]">Impressionantes</span>
          </h2>
          <p className="text-lg md:text-xl text-[#00bfff] max-w-3xl mx-auto">
            Resultados que comprovam a eficiência e confiabilidade da plataforma AGROTM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-black/70 border border-[#00bfff]/20 p-6 text-center hover:shadow-neon-blue transition-all duration-300">
                <div className="w-16 h-16 bg-[#00bfff]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-[#00bfff] text-2xl">
                    <stat.icon className="w-8 h-8" />
                  </span>
                </div>
                
                <div 
                  className="text-3xl font-orbitron font-bold text-[#00bfff] mb-2"
                  style={{ textShadow: '0 0 10px rgba(0, 191, 255, 0.5)' }}
                >
                  {stat.value}
                </div>
                
                <div className="text-[#00bfff] font-medium mb-2">
                  {stat.title}
                </div>
                
                <div className={`flex items-center justify-center gap-1 text-sm ${
                  stat.change > 0 ? 'text-[#00bfff]' : 'text-red-400'
                }`}>
                  {stat.change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}