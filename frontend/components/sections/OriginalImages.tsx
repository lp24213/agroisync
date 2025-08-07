import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const OriginalImages: React.FC = () => {
  const professionalImages = [
    {
      title: 'Interface de Monitoramento Inteligente',
      description: 'Dashboard avançado com analytics em tempo real para gestão completa do agronegócio',
      src: '/assets/images/dashboard/interactive-dashboard.png',
      category: 'dashboard'
    },
    {
      title: 'Sistema de Proteção Digital',
      description: 'Protocolos avançados de segurança blockchain para proteção de ativos agrícolas',
      src: '/assets/images/security/cyber-defense.png',
      category: 'security'
    },
    {
      title: 'Plataforma de Investimento Digital',
      description: 'Sistema DeFi para rentabilização de ativos agrícolas com transparência total',
      src: '/assets/images/staking/staking-farming.png',
      category: 'staking'
    },
    {
      title: 'Tokenização de Produtos Agrícolas',
      description: 'Transformação digital de commodities com rastreabilidade blockchain',
      src: '/assets/images/nft/nft-minting.png',
      category: 'nft'
    },
    {
      title: 'Tecnologia Agrícola Avançada',
      description: 'Automação inteligente e IoT aplicada ao agronegócio moderno',
      src: '/assets/images/farm/smart-farm-futuristic.png',
      category: 'farm'
    },
    {
      title: 'Agricultor Digital',
      description: 'Integração de tecnologia avançada com práticas agrícolas tradicionais',
      src: '/assets/images/hero/farmer-tech-character.png',
      category: 'hero'
    }
  ];

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00bfff] mb-4 animate-fadeIn">
            Tecnologia <span className="text-[#00bfff]">AGROTM</span>
          </h2>
          <p className="text-lg md:text-xl text-[#00bfff] max-w-3xl mx-auto">
            Soluções digitais avançadas para o agronegócio do futuro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionalImages.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center bg-black/70 border border-[#00bfff]/20 backdrop-blur-sm overflow-hidden relative group hover:shadow-neon-blue transition-all duration-300 rounded-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-orbitron font-semibold text-[#00bfff] mb-2">
                  {image.title}
                </h3>
                <p className="text-[#00bfff] text-sm">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OriginalImages;
