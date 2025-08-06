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
      src: '/assets/dashboard.png',
      category: 'dashboard'
    },
    {
      title: 'Cyber Defense',
      description: 'Sistemas avançados de segurança e proteção',
      src: '/assets/security.png',
      category: 'security'
    },
    {
      title: 'Staking & Farming',
      description: 'Plataforma DeFi de staking e yield farming',
      src: '/assets/staking.png',
      category: 'staking'
    },
    {
      title: 'NFT Minting',
      description: 'Criação e gerenciamento de NFTs agrícolas',
      src: '/assets/nft.png',
      category: 'nft'
    },
    {
      title: 'Smart Farm',
      description: 'Tecnologia agrícola inteligente futurista',
      src: '/assets/farm.png',
      category: 'farm'
    },
    {
      title: 'Farmer Tech Character',
      description: 'Fazendeiro premium com tecnologia avançada',
      src: '/assets/hero.png',
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
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00F0FF] mb-4 animate-fadeIn">
            Imagens Originais <span className="text-[#00F0FF]">AGROTM</span>
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-3xl mx-auto">
            Galeria de imagens premium que demonstram a tecnologia e inovação da plataforma
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
              <Card className="text-center bg-black/70 border border-[#00F0FF]/20 backdrop-blur-sm overflow-hidden relative group hover:shadow-neon transition-all duration-300">
                <div className="relative z-10 p-6">
                  <motion.div 
                    className="mb-4 inline-block"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <Image 
                      src={image.src} 
                      alt={image.title}
                      width={300}
                      height={200}
                      className="rounded-2xl shadow-neon hover:shadow-neon transition-all duration-500"
                      unoptimized={true}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/dashboard.png";
                      }}
                    />
                  </motion.div>
                  
                  <h3 className="text-xl font-orbitron font-semibold text-[#00F0FF] mb-2">
                    {image.title}
                  </h3>
                  <p className="text-[#cccccc] leading-relaxed">
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