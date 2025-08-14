'use client';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, Eye, Clock, User } from 'lucide-react';

// Interfaces
interface NFTAttribute {
  trait_type: string;
  value: string;
  rarity: number;
}

interface NFT {
  id: number;
  name: string;
  collection: string;
  creator: string;
  price: number;
  currency: string;
  image: string;
  likes: number;
  listed: boolean;
  attributes: NFTAttribute[];
  color: string;
  lastSale: number;
  owner: string;
  rarity: string;
  views: number;
  auction: boolean;
  description: string;
}

interface Collection {
  id: number;
  name: string;
  creator: string;
  verified: boolean;
  items: number;
  floorPrice: number;
  volume: number;
  banner: string;
  logo: string;
  color: string;
  description: string;
}

// Dados simulados
const collections: Collection[] = [
  {
    id: 1,
    name: 'AgroTech Collection',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 1000,
    floorPrice: 0.5,
    volume: 1250,
    banner: '/assets/images/nft/agrotech-banner.jpg',
    logo: '/assets/images/logo/agrotm-logo.png',
    color: '#00FF7F',
    description: 'NFTs exclusivos representando tecnologias agrícolas inovadoras, incluindo sensores IoT, drones de monitoramento e sistemas de irrigação inteligente.',
  },
  {
    id: 2,
    name: 'Farm Animals',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 500,
    floorPrice: 0.3,
    volume: 850,
    banner: '/assets/images/nft/farm-animals-banner.jpg',
    logo: '/assets/images/logo/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Animais de fazenda tokenizados com características únicas, incluindo raças raras, linhagens premiadas e animais com histórico genético excepcional.',
  },
  {
    id: 3,
    name: 'Crop Seasons',
    creator: 'Equipe AGROTM',
    verified: false,
    items: 750,
    floorPrice: 0.8,
    volume: 2100,
    banner: '/assets/images/nft/crop-seasons-banner.jpg',
    logo: '/assets/images/logo/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Safras sazonais em NFT, representando diferentes culturas agrícolas com variações climáticas, qualidade do solo e técnicas de cultivo.',
  },
  {
    id: 4,
    name: 'Land Plots',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 250,
    floorPrice: 2.5,
    volume: 5000,
    banner: '/assets/images/nft/land-plots-banner.jpg',
    logo: '/assets/images/logo/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Parcelas de terra tokenizadas com dados reais de produtividade, localização estratégica e potencial de desenvolvimento agrícola.',
  },
];

const nfts: NFT[] = [
  {
    id: 1,
    name: 'Sensores IoT Avançados',
    collection: 'AgroTech Collection',
    creator: 'AGROTM Labs',
    price: 0.8,
    currency: 'ETH',
    image: '/assets/images/nft/sensors-iot.jpg',
    likes: 156,
    listed: true,
    attributes: [
      { trait_type: 'Tecnologia', value: 'IoT', rarity: 85 },
      { trait_type: 'Precisão', value: '99.9%', rarity: 95 },
      { trait_type: 'Durabilidade', value: '10 anos', rarity: 90 },
    ],
    color: '#00FF7F',
    lastSale: 0.75,
    owner: '0x1234...5678',
    rarity: 'Épico',
    views: 342,
    auction: false,
    description: 'Sistema de sensores IoT de última geração para monitoramento agrícola em tempo real.',
  },
  {
    id: 2,
    name: 'Drone de Monitoramento',
    collection: 'AgroTech Collection',
    creator: 'AGROTM Labs',
    price: 1.2,
    currency: 'ETH',
    image: '/assets/images/nft/drone-monitoring.jpg',
    likes: 234,
    listed: true,
    attributes: [
      { trait_type: 'Autonomia', value: '8 horas', rarity: 88 },
      { trait_type: 'Alcance', value: '15km', rarity: 92 },
      { trait_type: 'Câmera', value: '4K', rarity: 85 },
    ],
    color: '#00FF7F',
    lastSale: 1.1,
    owner: '0x8765...4321',
    rarity: 'Lendário',
    views: 567,
    auction: true,
    description: 'Drone especializado em monitoramento agrícola com câmeras de alta resolução e sensores multiespectrais.',
  },
  {
    id: 3,
    name: 'Sistema de Irrigação Inteligente',
    collection: 'AgroTech Collection',
    creator: 'AGROTM Labs',
    price: 0.6,
    currency: 'ETH',
    image: '/assets/images/nft/smart-irrigation.jpg',
    likes: 89,
    listed: true,
    attributes: [
      { trait_type: 'Eficiência', value: '95%', rarity: 90 },
      { trait_type: 'Cobertura', value: '50 hectares', rarity: 85 },
      { trait_type: 'Automação', value: '100%', rarity: 95 },
    ],
    color: '#00FF7F',
    lastSale: 0.55,
    owner: '0x9876...5432',
    rarity: 'Raro',
    views: 198,
    auction: false,
    description: 'Sistema de irrigação inteligente que otimiza o uso de água baseado em dados climáticos e do solo.',
  },
  {
    id: 4,
    name: 'Vaca Holandesa Premium',
    collection: 'Farm Animals',
    creator: 'AGROTM Genetics',
    price: 0.4,
    currency: 'ETH',
    image: '/assets/images/nft/holstein-cow.jpg',
    likes: 123,
    listed: true,
    attributes: [
      { trait_type: 'Raça', value: 'Holandesa', rarity: 80 },
      { trait_type: 'Produção', value: '45L/dia', rarity: 95 },
      { trait_type: 'Linhagem', value: 'Premium', rarity: 90 },
    ],
    color: '#00FF7F',
    lastSale: 0.38,
    owner: '0x5432...9876',
    rarity: 'Raro',
    views: 245,
    auction: false,
    description: 'Vaca Holandesa de linhagem premium com histórico genético excepcional e alta produtividade leiteira.',
  },
  {
    id: 5,
    name: 'Safra de Soja Premium',
    collection: 'Crop Seasons',
    creator: 'AGROTM Crops',
    price: 0.9,
    currency: 'ETH',
    image: '/assets/images/nft/soybean-crop.jpg',
    likes: 178,
    listed: true,
    attributes: [
      { trait_type: 'Variedade', value: 'Premium', rarity: 85 },
      { trait_type: 'Produtividade', value: '4.2t/ha', rarity: 92 },
      { trait_type: 'Qualidade', value: 'A+', rarity: 88 },
    ],
    color: '#00FF7F',
    lastSale: 0.85,
    owner: '0x6789...1234',
    rarity: 'Épico',
    views: 312,
    auction: true,
    description: 'Safra de soja premium com alta produtividade e qualidade excepcional, cultivada com técnicas avançadas.',
  },
  {
    id: 6,
    name: 'Parcela de Terra Fértil',
    collection: 'Land Plots',
    creator: 'AGROTM Land',
    price: 3.2,
    currency: 'ETH',
    image: '/assets/images/nft/fertile-land.jpg',
    likes: 456,
    listed: true,
    attributes: [
      { trait_type: 'Área', value: '100 hectares', rarity: 90 },
      { trait_type: 'Fertilidade', value: 'Alta', rarity: 95 },
      { trait_type: 'Localização', value: 'Estratégica', rarity: 88 },
    ],
    color: '#00FF7F',
    lastSale: 3.0,
    owner: '0x3456...7890',
    rarity: 'Lendário',
    views: 789,
    auction: false,
    description: 'Parcela de terra de 100 hectares com solo fértil e localização estratégica para desenvolvimento agrícola.',
  },
];

const NFTMarketplacePage: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterRarity, setFilterRarity] = useState('all');
  const [priceRange] = useState({ min: 0, max: 10 });

  // Filtrar NFTs baseado nos critérios
  const filteredNFTs = nfts.filter(nft => {
    const matchesCollection = selectedCollection === 'all' || nft.collection === selectedCollection;
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || nft.rarity.toLowerCase() === filterRarity;
    const matchesPrice = nft.price >= priceRange.min && nft.price <= priceRange.max;

    return matchesCollection && matchesSearch && matchesRarity && matchesPrice;
  });

  // Ordenar NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'recent':
        return b.id - a.id;
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-animation"></div>
        </div>
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines opacity-10"></div>

        <div className="container mx-auto max-w-7xl px-4 py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-orbitron text-4xl md:text-6xl gradient-text font-bold mb-4">
              NFT Marketplace
            </h1>
            <p className="text-lg md:text-xl text-[#cccccc] leading-relaxed max-w-3xl mx-auto">
              Descubra e compre NFTs únicos da agricultura digital - Tecnologias, animais, safras e terras tokenizadas
            </p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="cyberpunk-card p-6 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FF7F] w-4 h-4" />
                  <Input
                    placeholder="Buscar NFTs..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="pl-10 bg-black/70 border border-[#00FF7F]/20 text-[#ffffff] placeholder-[#cccccc] focus:ring-2 focus:ring-[#00FF7F] font-orbitron"
                  />
                </div>
                <select
                  value={selectedCollection}
                  onChange={e => setSelectedCollection(e.target.value)}
                  className="p-3 bg-black/70 border border-[#00FF7F]/20 rounded-xl text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F] font-orbitron"
                >
                  <option value="all">Todas as Coleções</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="p-3 bg-black/70 border border-[#00FF7F]/20 rounded-xl text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F] font-orbitron"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="price-low">Preço: Menor</option>
                  <option value="price-high">Preço: Maior</option>
                  <option value="popular">Mais Populares</option>
                </select>
                <select
                  value={filterRarity}
                  onChange={e => setFilterRarity(e.target.value)}
                  className="p-3 bg-black/70 border border-[#00FF7F]/20 rounded-xl text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F] font-orbitron"
                >
                  <option value="all">Todas as Raridades</option>
                  <option value="comum">Comum</option>
                  <option value="raro">Raro</option>
                  <option value="épico">Épico</option>
                  <option value="lendário">Lendário</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Coleções */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-orbitron text-3xl font-bold mb-6 gradient-text">Coleções em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="cyberpunk-card overflow-hidden backdrop-blur-sm hover:shadow-neon-green transition-all duration-300">
                    <div
                      className="h-32 bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url(${collection.banner})`,
                        backgroundColor: collection.color,
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLDivElement;
                        target.style.backgroundImage = 'none';
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={collection.logo}
                          alt={collection.name}
                          className="w-8 h-8 rounded-full mr-3 border border-[#00FF7F]/30"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/images/logo/agrotm-logo.png';
                          }}
                        />
                        <h3 className="font-orbitron font-semibold text-[#ffffff]">{collection.name}</h3>
                        {collection.verified && <span className="ml-2 text-[#00FF7F]">✓</span>}
                      </div>
                      <p className="text-sm text-[#cccccc] mb-3 leading-relaxed">{collection.description}</p>
                      <div className="flex justify-between text-sm text-[#cccccc]">
                        <span>{collection.items} itens</span>
                        <span className="text-[#00FF7F]">Floor: {collection.floorPrice} ETH</span>
                        <span>{collection.volume} ETH</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NFTs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="font-orbitron text-3xl font-bold mb-6 gradient-text">NFTs Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="cyberpunk-card overflow-hidden backdrop-blur-sm hover:shadow-neon-green transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/assets/images/nft/nft-placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={cn(
                            'px-2 py-1 rounded text-xs font-medium text-black font-orbitron',
                            nft.rarity === 'Comum' && 'bg-[#00FF7F]',
                            nft.rarity === 'Raro' && 'bg-[#00FF7F]',
                            nft.rarity === 'Épico' && 'bg-[#00FF7F]',
                            nft.rarity === 'Lendário' && 'bg-[#00FF7F]',
                          )}
                        >
                          {nft.rarity}
                        </span>
                      </div>
                      {nft.auction && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 rounded text-xs font-medium text-black bg-[#00FF7F] font-orbitron">
                            Leilão
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-orbitron font-semibold mb-1 text-[#ffffff]">{nft.name}</h3>
                      <p className="text-sm text-[#cccccc] mb-2">{nft.collection}</p>
                      <p className="text-xs text-[#cccccc] mb-3 leading-relaxed">{nft.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-orbitron font-bold text-[#00FF7F]">
                          {nft.price} {nft.currency}
                        </span>
                        <div className="flex items-center text-sm text-[#cccccc]">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{nft.likes}</span>
                          <Eye className="w-4 h-4 ml-2 mr-1" />
                          <span>{nft.views}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-[#cccccc] mb-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Listado: 2 horas atrás
                        </span>
                        <span>Última venda: {nft.lastSale} ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#cccccc] flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {nft.owner}
                        </span>
                        <Button size="sm" variant="default" className="bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black hover:shadow-neon-green font-orbitron">
                          Comprar Agora
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NFTMarketplacePage;
