'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';

export function OriginalImages() {
  const originalImages = [
    {
      title: 'Dashboard Interativo',
      description: 'Interface avançada de analytics e monitoramento',
      src: '/assets/images/dashboard/interactive-dashboard.png',
      category: 'dashboard'
    },
    {
      title: 'Cyber Defense',
      description: 'Sistemas avançados de segurança e proteção',
      src: '/assets/images/security/cyber-defense.png',
      category: 'security'
    },
    {
      title: 'Staking & Farming',
      description: 'Plataforma DeFi de staking e yield farming',
      src: '/assets/images/staking/staking-farming.png',
      category: 'staking'
    },
    {
      title: 'NFT Minting',
      description: 'Criação e gerenciamento de NFTs agrícolas',
      src: '/assets/images/nft/nft-minting.png',
      category: 'nft'
    },
    {
      title: 'Smart Farm',
      description: 'Tecnologia agrícola inteligente futurista',
      src: '/assets/images/farm/smart-farm-futuristic.png',
      category: 'farm'
    },
    {
      title: 'Farmer Tech Character',
      description: 'Fazendeiro premium com tecnologia avançada',
      src: '/assets/images/hero/farmer-tech-character.png',
      category: 'hero'
    }
  ];

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00FF7F] mb-4 animate-fadeIn">
            Imagens Originais <span className="text-[#00FF7F]">AGROTM</span>
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-3xl mx-auto">
            Visualize as imagens originais que inspiraram o design da plataforma AGROTM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {originalImages.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="text-center bg-black/70 border border-[#00FF7F]/20 backdrop-blur-sm overflow-hidden relative group hover:shadow-neon transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">
                    {image.title}
                  </h3>
                  <p className="text-[#cccccc] text-sm">
                    {image.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 