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

const stats: Stat[] = [
  {
    id: '1',
    label: 'Total Value Locked',
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
    label: 'Transações Totais',
    value: 156789,
    unit: '',
    change: 8.7,
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-agro-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-agro-blue/20 blur-xl"
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
          className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-agro-green/20 blur-xl"
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
          <h2 className="text-4xl font-bold text-white mb-4 text-glow relative inline-block">
            <span className="relative z-10">Números Impressionantes</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green opacity-0 blur-lg"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </h2>
          <p className="text-xl text-gray-400">
            Nossa plataforma em números
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="text-center bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                {/* Card corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-agro-blue opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-agro-blue opacity-70"></div>
                
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Horizontal lines */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="relative z-10 p-6">
                  <motion.div 
                    className="mb-4"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 + index * 0.1 }}
                  >
                    <h3 className="text-3xl font-bold text-white text-glow">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      >
                        {validation.formatNumber(stat.value)}
                      </motion.span>
                      {stat.unit && <span className="text-agro-blue ml-1">{stat.unit}</span>}
                    </h3>
                  </motion.div>
                  <p className="text-gray-400 mb-2 group-hover:text-gray-300 transition-colors duration-300">{stat.label}</p>
                  {stat.change !== undefined && (
                    <motion.div 
                      className={`text-sm font-medium ${
                        stat.change >= 0 ? 'text-agro-green' : 'text-red-400'
                      } flex items-center justify-center`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="mr-1">
                        {stat.change >= 0 ? '↑' : '↓'}
                      </span>
                      {stat.change >= 0 ? '+' : ''}{validation.formatPercentage(stat.change)}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}