'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Eye, User, Zap } from 'lucide-react';

const NFTSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Tokenização Avançada',
      description: 'Transformação digital de commodities agrícolas'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Rastreabilidade Total',
      description: 'Histórico completo de origem e qualidade'
    },
    {
      icon: <User className="w-5 h-5" />,
      title: 'Propriedade Digital',
      description: 'Certificação blockchain de propriedade'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Mercado Seguro',
      description: 'Negociação transparente e segura'
    }
  ];

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-[#00bfff] mb-6">
              NFTs <span className="text-[#00bfff]">Agrícolas</span>
            </h2>
            
            <p className="text-lg text-[#00bfff] mb-8 max-w-2xl mx-auto lg:mx-0">
              Tokenização de produtos agrícolas com rastreabilidade blockchain completa e marketplace seguro para negociação de ativos digitais.
            </p>

            {/* Features - CAIXAS MENORES */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/70 border border-[#00bfff]/20 backdrop-blur-sm p-4 rounded-lg hover:shadow-neon-blue transition-all duration-300"
                >
                  <div className="bg-[#00bfff]/20 p-2 rounded-lg mb-3 inline-block">
                    <div className="text-[#00bfff]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-orbitron font-semibold text-[#00bfff] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#00bfff]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden border border-[#00bfff]/20 shadow-neon-blue">
              <Image
                src="/assets/images/nft/nft-minting.png"
                alt="NFTs Agrícolas - Tokenização de Commodities"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NFTSection; 