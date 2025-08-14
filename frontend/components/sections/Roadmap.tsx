'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Fase 1',
    title: 'Lançamento da Plataforma',
    description: 'Staking básico e pools de liquidez iniciais',
    status: 'completed',
    date: 'Q1 2024',
  },
  {
    id: '2',
    phase: 'Fase 2',
    title: 'Yield Farming Avançado',
    description: 'Estratégias de yield farming e otimização de retornos',
    status: 'completed',
    date: 'Q2 2024',
  },
  {
    id: '3',
    phase: 'Fase 3',
    title: 'Governança DAO',
    description: 'Sistema de governança descentralizada e votação',
    status: 'in-progress',
    date: 'Q3 2024',
  },
  {
    id: '4',
    phase: 'Fase 4',
    title: 'Expansão Global',
    description: 'Integração com outras blockchains e mercados globais',
    status: 'upcoming',
    date: 'Q4 2024',
  },
  {
    id: '5',
    phase: 'Fase 5',
    title: 'Ecosystem Completo',
    description: 'Marketplace de NFTs agrícolas e metaverso',
    status: 'upcoming',
    date: 'Q1 2025',
  },
];

export function Roadmap() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-agro-green text-white';
      case 'in-progress':
        return 'bg-agro-blue text-white';
      case 'upcoming':
        return 'bg-agro-purple text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Progresso';
      case 'upcoming':
        return 'Próximo';
      default:
        return 'Próximo';
    }
  };

  return (
    <section className="py-20 bg-agro-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 z-0 opacity-5 digital-rain"></div>
      
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
          className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-agro-purple/20 blur-xl"
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
            <span className="relative z-10">Roadmap</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green opacity-0 blur-lg"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </h2>
          <p className="text-xl text-gray-400">
            Nossa jornada de desenvolvimento e crescimento
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-agro-blue via-agro-purple to-agro-green"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Pulse effect on timeline */}
            <motion.div 
              className="absolute w-3 h-3 rounded-full bg-agro-neon blur-sm"
              animate={{ 
                y: [0, '100%'],
                opacity: [1, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
          </motion.div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Timeline dot with pulse effect */}
                <motion.div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${getStatusColor(item.status)} z-10`}
                  whileHover={{ scale: 1.5 }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-white opacity-50"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Connecting line to card */}
                <motion.div 
                  className={`absolute top-0 ${index % 2 === 0 ? 'right-1/2' : 'left-1/2'} h-px w-[calc(8%-1rem)] bg-gradient-to-${index % 2 === 0 ? 'l' : 'r'} from-transparent ${index % 2 === 0 ? 'to-agro-blue' : 'to-agro-purple'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: 'calc(8%-1rem)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                />

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card className="relative bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden group cyberpunk-card">
                    {/* Card corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-agro-blue opacity-70"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-agro-blue opacity-70"></div>
                    
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <motion.span 
                          className="text-sm font-medium text-agro-blue text-glow-blue"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.phase}
                        </motion.span>
                        <motion.span 
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {getStatusText(item.status)}
                        </motion.span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-glow transition-all duration-300">{item.title}</h3>
                      <p className="text-gray-400 mb-3">{item.description}</p>
                      <span className="text-sm text-agro-neon">{item.date}</span>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}