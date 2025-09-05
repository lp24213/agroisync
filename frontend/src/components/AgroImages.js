import React from 'react';
import { motion } from 'framer-motion';

const AgroImages = () => {
  const images = [
    {
      id: 'agroisync-logo',
      title: 'AGROISYNC Logo',
      description: 'Logo principal do AGROISYNC com design futurístico e gradiente azul-ciano',
      alt: 'Logo AGROISYNC - hexágono com planta estilizada em gradiente azul-ciano',
      category: 'logo'
    },
    {
      id: 'agro-connecta-logo',
      title: 'Agro Connecta Logo',
      description: 'Logo do Agro Connecta com ícone quadrado verde e design orgânico',
      alt: 'Logo Agro Connecta - quadrado verde com quatro folhas e semente central dourada',
      category: 'logo'
    },
    {
      id: 'staking-farming',
      title: 'Staking / Farming',
      description: 'Interface de staking e farming com plantas digitais e circuitos',
      alt: 'Interface Staking/Farming com plantas brilhantes e rede de circuitos',
      category: 'feature'
    },
    {
      id: 'nft-minting',
      title: 'NFT Minting',
      description: 'Processo de criação de NFTs com planta crescendo em moeda NFT',
      alt: 'NFT Minting - planta crescendo culminando em moeda NFT',
      category: 'feature'
    },
    {
      id: 'cyber-defense',
      title: 'Cyber Defense',
      description: 'Sistema de defesa cibernética com escudo e planta em rede digital',
      alt: 'Cyber Defense - escudo com planta e ícones de IA e dados',
      category: 'security'
    },
    {
      id: 'interactive-dashboard',
      title: 'Interactive Dashboard',
      description: 'Painel interativo com visualizações de dados e métricas',
      alt: 'Dashboard interativo com gráficos, ícones DeFi e indicadores',
      category: 'dashboard'
    },
    {
      id: 'premium-farmer',
      title: 'Premium Farmer',
      description: 'Fazendeiro premium com óculos futurísticos e badge premium',
      alt: 'Fazendeiro futurístico com chapéu, óculos e badge premium',
      category: 'character'
    },
    {
      id: 'smart-farming',
      title: 'Smart Farming',
      description: 'Cena de agricultura inteligente com drones e interface holográfica',
      alt: 'Campo com drones, celeiro iluminado e interface digital sobreposta',
      category: 'technology'
    }
  ];

  const getImagePath = (id) => {
    // Como as imagens foram fornecidas via descrição, vamos usar placeholders
    // que representam as imagens descritas
    return `/images/agro/${id}.png`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      logo: 'from-blue-500 to-cyan-500',
      feature: 'from-emerald-500 to-green-500',
      security: 'from-red-500 to-pink-500',
      dashboard: 'from-purple-500 to-indigo-500',
      character: 'from-orange-500 to-yellow-500',
      technology: 'from-teal-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      logo: '🏷️',
      feature: '⚡',
      security: '🛡️',
      dashboard: '📊',
      character: '👨‍🌾',
      technology: '🚁'
    };
    return icons[category] || '📷';
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-agro mb-4">
          Galeria de Imagens AgroSync
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Explore nossa coleção de imagens que representam a inovação e tecnologia no agronegócio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="card-premium overflow-hidden">
              {/* Placeholder para a imagem */}
              <div className={`h-48 bg-gradient-to-br ${getCategoryColor(image.category)} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{getCategoryIcon(image.category)}</div>
                    <div className="text-sm font-medium opacity-90">{image.title}</div>
                  </div>
                </div>
                
                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </div>

              {/* Informações da imagem */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {image.title}
                </h3>
                <p className="text-white/60 text-sm mb-3 line-clamp-2">
                  {image.description}
                </p>
                
                {/* Tags */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(image.category)} text-white`}>
                    {image.category}
                  </span>
                  <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Ver detalhes →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seção de uso das imagens */}
      <div className="card-premium p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Como Usar Estas Imagens
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Logos e Identidade</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Use o logo AGROISYNC em cabeçalhos e branding</li>
              <li>• Logo Agro Connecta para seções de conexão</li>
              <li>• Mantenha proporções e cores originais</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Funcionalidades</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Staking/Farming para seções de investimento</li>
              <li>• NFT Minting para marketplace de tokens</li>
              <li>• Cyber Defense para áreas de segurança</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Interface</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Dashboard interativo para painéis de controle</li>
              <li>• Smart Farming para seções tecnológicas</li>
              <li>• Premium Farmer para áreas premium</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Implementação</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Otimizar para web (WebP, AVIF)</li>
              <li>• Responsive design para todos os dispositivos</li>
              <li>• Lazy loading para performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroImages;
