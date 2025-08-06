'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { validation } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Stat {
  id: string;
  label: string;
  value: number;
  unit: string;
  change?: number;
}

export function Stats() {
  const stats: Stat[] = [
    {
      id: '1',
      label: 'Valor Total Bloqueado',
      value: 12500000,
      unit: 'USD',
      change: 2.5,
    },
    {
      id: '2',
      label: 'Usuários Ativos',
      value: 25430,
      unit: '',
      change: 12.3,
    },
    {
      id: '3',
      label: 'APR Médio',
      value: 18.5,
      unit: '%',
      change: -0.3,
    },
    {
      id: '4',
      label: 'Total de Transações',
      value: 156789,
      unit: '',
      change: 8.7,
    },
  ];

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-[#00F0FF]/20 blur-xl"
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
          className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-[#00F0FF]/20 blur-xl"
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
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00F0FF] mb-4 animate-fadeIn">
            Números Impressionantes
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-3xl mx-auto">
            Resultados que demonstram o sucesso e crescimento da plataforma AGROTM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-black/70 border border-[#00F0FF]/20 p-6 text-center hover:shadow-neon transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="mb-4"
                >
                  <div className="w-16 h-16 bg-[#00F0FF]/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-[#00F0FF] text-2xl">
                      {index === 0 && '💰'}
                      {index === 1 && '👥'}
                      {index === 2 && '📈'}
                      {index === 3 && '🔄'}
                    </span>
                  </div>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  className="text-3xl font-orbitron font-bold text-[#00F0FF] mb-2"
                >
                  {validation.formatCurrency(stat.value, stat.unit)}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.4 }}
                  className="text-[#cccccc] font-orbitron mb-2"
                >
                  {stat.label}
                </motion.p>
                
                {stat.change && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.5 }}
                    className={`flex items-center justify-center space-x-1 ${
                      stat.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    <span className="text-sm">
                      {stat.change > 0 ? '↗' : '↘'} {Math.abs(stat.change)}%
                    </span>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}