'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

export function OriginalImages() {
  const { t } = useTranslation('common');

  const originalImages = [
    {
      title: 'Interactive Dashboard',
      description: 'Advanced analytics and monitoring interface',
      src: '/assets/images/dashboard/interactive-dashboard.png',
      category: 'dashboard'
    },
    {
      title: 'Cyber Defense',
      description: 'Advanced security and protection systems',
      src: '/assets/images/security/cyber-defense.png',
      category: 'security'
    },
    {
      title: 'Staking & Farming',
      description: 'DeFi staking and yield farming platform',
      src: '/assets/images/staking/staking-farming.png',
      category: 'staking'
    },
    {
      title: 'NFT Minting',
      description: 'Agricultural NFT creation and management',
      src: '/assets/images/nft/nft-minting.png',
      category: 'nft'
    },
    {
      title: 'Smart Farm',
      description: 'Futuristic smart agriculture technology',
      src: '/assets/images/farm/smart-farm-futuristic.png',
      category: 'farm'
    },
    {
      title: 'Farmer Tech Character',
      description: 'Premium farmer with advanced technology',
      src: '/assets/images/hero/farmer-tech-character.png',
      category: 'hero'
    }
  ];

  return (
    <section className="py-20 bg-agro-darker relative overflow-hidden">
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
          <h2 className="text-4xl font-bold text-white mb-4 text-glow">
            {t('originalImages')} <span className="text-agro-blue">AGROTM</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('originalImagesDescription')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {originalImages.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center hover:transform hover:scale-105 transition-transform duration-300 bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="relative z-10 p-6">
                  <motion.div 
                    className="mb-4 inline-block"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <Image 
                      src={image.src} 
                      alt={image.title} 
                      width={200} 
                      height={150}
                      className="w-full h-48 object-cover rounded-lg border border-agro-blue/20"
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{image.title}</h3>
                  <p className="text-gray-400 mb-3">{image.description}</p>
                  <span className="inline-block px-3 py-1 bg-agro-blue/20 text-agro-blue text-sm rounded-full border border-agro-blue/30">
                    {image.category}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 