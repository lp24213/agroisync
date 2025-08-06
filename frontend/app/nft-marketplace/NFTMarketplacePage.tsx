'use client';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import React, { useState } from 'react';

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
    banner: '/images/collection-banner-1.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'NFTs exclusivos da tecnologia agrícola',
  },
  {
    id: 2,
    name: 'Farm Animals',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 500,
    floorPrice: 0.3,
    volume: 850,
    banner: '/images/collection-banner-2.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Animais de fazenda tokenizados',
  },
  {
    id: 3,
    name: 'Crop Seasons',
    creator: 'Equipe AGROTM',
    verified: false,
    items: 750,
    floorPrice: 0.8,
    volume: 2100,
    banner: '/images/collection-banner-3.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Safras sazonais em NFT',
  },
  {
    id: 4,
    name: 'Land Plots',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 250,
    floorPrice: 2.5,
    volume: 5000,
    banner: '/images/collection-banner-4.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Terrenos agrícolas digitais',
  },
  {
    id: 5,
    name: 'Equipment NFTs',
    creator: 'Equipe AGROTM',
    verified: false,
    items: 400,
    floorPrice: 1.2,
    volume: 1800,
    banner: '/images/collection-banner-5.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Maquinários agrícolas',
  },
  {
    id: 6,
    name: 'Seed Collection',
    creator: 'Equipe AGROTM',
    verified: true,
    items: 2000,
    floorPrice: 0.1,
    volume: 300,
    banner: '/images/collection-banner-6.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#00FF7F',
    description: 'Sementes raras e especiais',
  },
];

const nfts: NFT[] = [
  {
    id: 1,
    name: 'AgroTech Drone #001',
    collection: 'AgroTech Collection',
    creator: 'Equipe AGROTM',
    price: 0.5,
    currency: 'ETH',
    image: '/images/nft-1.jpg',
    likes: 234,
    listed: true,
    lastSale: 3.2,
    owner: '0x1234...5678',
    rarity: 'Raro',
    views: 156,
    auction: false,
    description: 'Drone agrícola de alta tecnologia',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Drone Type', value: 'Survey', rarity: 12 },
      { trait_type: 'Range', value: '10km', rarity: 18 },
      { trait_type: 'Battery', value: '8 hours', rarity: 22 },
      { trait_type: 'Rarity', value: 'Rare', rarity: 5 },
    ],
  },
  {
    id: 2,
    name: 'Smart Tractor #042',
    collection: 'Equipment NFTs',
    creator: 'Equipe AGROTM',
    price: 1.2,
    currency: 'ETH',
    image: '/images/nft-2.jpg',
    likes: 189,
    listed: true,
    lastSale: 2.1,
    owner: '0x8765...4321',
    rarity: 'Épico',
    views: 203,
    auction: true,
    description: 'Trator inteligente com IA',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Engine', value: 'Electric', rarity: 8 },
      { trait_type: 'Autonomy', value: '12 hours', rarity: 5 },
      { trait_type: 'AI Level', value: 'Advanced', rarity: 3 },
      { trait_type: 'Rarity', value: 'Epic', rarity: 2 },
    ],
  },
  {
    id: 3,
    name: 'Golden Wheat Field',
    collection: 'Crop Seasons',
    creator: 'Equipe AGROTM',
    price: 0.8,
    currency: 'ETH',
    image: '/images/nft-3.jpg',
    likes: 156,
    listed: true,
    lastSale: 1.8,
    owner: '0x5678...9012',
    rarity: 'Comum',
    views: 98,
    auction: false,
    description: 'Campo de trigo dourado',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Crop Type', value: 'Wheat', rarity: 30 },
      { trait_type: 'Yield', value: 'High', rarity: 20 },
      { trait_type: 'Resistance', value: 'Drought', rarity: 15 },
      { trait_type: 'Rarity', value: 'Common', rarity: 35 },
    ],
  },
  {
    id: 4,
    name: 'Rare Corn Seed',
    collection: 'Seed Collection',
    creator: 'Equipe AGROTM',
    price: 0.1,
    currency: 'ETH',
    image: '/images/nft-4.jpg',
    likes: 312,
    listed: true,
    lastSale: 4.5,
    owner: '0x3456...7890',
    rarity: 'Lendário',
    views: 445,
    auction: false,
    description: 'Semente de milho rara',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Seed Type', value: 'Corn', rarity: 30 },
      { trait_type: 'Yield', value: 'High', rarity: 20 },
      { trait_type: 'Resistance', value: 'Drought', rarity: 15 },
      { trait_type: 'Rarity', value: 'Legendary', rarity: 2 },
    ],
  },
  {
    id: 5,
    name: 'Farm Plot #123',
    collection: 'Land Plots',
    creator: 'Equipe AGROTM',
    price: 2.5,
    currency: 'ETH',
    image: '/images/nft-5.jpg',
    likes: 178,
    listed: true,
    lastSale: 2.8,
    owner: '0x9012...3456',
    rarity: 'Épico',
    views: 134,
    auction: false,
    description: 'Terreno agrícola premium',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Area', value: '100 acres', rarity: 10 },
      { trait_type: 'Quality', value: 'Premium', rarity: 8 },
      { trait_type: 'Technology', value: 'Smart', rarity: 12 },
      { trait_type: 'Rarity', value: 'Epic', rarity: 5 },
    ],
  },
  {
    id: 6,
    name: 'Smart Cow #007',
    collection: 'Farm Animals',
    creator: 'Equipe AGROTM',
    price: 0.3,
    currency: 'ETH',
    image: '/images/nft-6.jpg',
    likes: 245,
    listed: true,
    lastSale: 3.1,
    owner: '0x6789...0123',
    rarity: 'Raro',
    views: 167,
    auction: true,
    description: 'Vaca com chip de monitoramento',
    color: '#00FF7F',
    attributes: [
      { trait_type: 'Animal Type', value: 'Cow', rarity: 10 },
      { trait_type: 'Chip', value: 'Smart', rarity: 8 },
      { trait_type: 'Technology', value: 'IoT', rarity: 12 },
      { trait_type: 'Rarity', value: 'Rare', rarity: 5 },
    ],
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
    <div className='min-h-screen bg-[#000000] py-8 px-4'>
      <div className='container mx-auto max-w-7xl'>
        <h1 className='font-orbitron text-4xl md:text-5xl text-[#00FF7F] mb-4 animate-fadeIn'>NFT Marketplace</h1>
        <p className='text-lg md:text-xl text-[#cccccc] leading-relaxed mb-8'>Descubra e compre NFTs únicos da agricultura digital</p>

        {/* Filtros */}
        <div className='mb-8 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Input
              placeholder='Buscar NFTs...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='bg-black/70 border border-[#00FF7F]/20 text-[#ffffff] placeholder-[#cccccc] focus:ring-2 focus:ring-[#00FF7F]'
            />
            <select
              value={selectedCollection}
              onChange={e => setSelectedCollection(e.target.value)}
              className='p-2 bg-black/70 border border-[#00FF7F]/20 rounded-md text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F]'
            >
              <option value='all'>Todas as Coleções</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='p-2 bg-black/70 border border-[#00FF7F]/20 rounded-md text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F]'
            >
              <option value='recent'>Mais Recentes</option>
              <option value='price-low'>Preço: Menor</option>
              <option value='price-high'>Preço: Maior</option>
              <option value='popular'>Mais Populares</option>
            </select>
            <select
              value={filterRarity}
              onChange={e => setFilterRarity(e.target.value)}
              className='p-2 bg-black/70 border border-[#00FF7F]/20 rounded-md text-[#ffffff] focus:ring-2 focus:ring-[#00FF7F]'
            >
              <option value='all'>Todas as Raridades</option>
              <option value='comum'>Comum</option>
              <option value='raro'>Raro</option>
              <option value='épico'>Épico</option>
              <option value='lendário'>Lendário</option>
            </select>
          </div>
        </div>

        {/* Coleções */}
        <div className='mb-8'>
          <h2 className='font-orbitron text-2xl font-bold mb-4 text-[#00FF7F]'>Coleções em Destaque</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {collections.map(collection => (
              <Card key={collection.id} className='overflow-hidden bg-black/70 border border-[#00FF7F]/20 hover:shadow-neon'>
                <div
                  className='h-32 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${collection.banner})`,
                    backgroundColor: collection.color,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLDivElement;
                    target.style.backgroundImage = 'none';
                  }}
                />
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <img
                      src={collection.logo}
                      alt={collection.name}
                      className='w-8 h-8 rounded-full mr-2'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/nft-placeholder.svg';
                      }}
                    />
                    <h3 className='font-orbitron font-semibold text-[#ffffff]'>{collection.name}</h3>
                    {collection.verified && <span className='ml-1 text-[#00FF7F]'>✓</span>}
                  </div>
                  <p className='text-sm text-[#cccccc] mb-2'>{collection.description}</p>
                  <div className='flex justify-between text-sm text-[#cccccc]'>
                    <span>{collection.items} itens</span>
                    <span>Floor: {collection.floorPrice} ETH</span>
                    <span>{collection.volume} ETH</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* NFTs */}
        <div>
          <h2 className='font-orbitron text-2xl font-bold mb-4 text-[#00FF7F]'>NFTs Disponíveis</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sortedNFTs.map(nft => (
              <Card key={nft.id} className='overflow-hidden bg-black/70 border border-[#00FF7F]/20 hover:shadow-neon transition-all'>
                <div className='relative'>
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className='w-full h-48 object-cover'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/nft-placeholder.svg';
                    }}
                  />
                  <div className='absolute top-2 right-2'>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium text-black',
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
                    <div className='absolute top-2 left-2'>
                      <span className='px-2 py-1 rounded text-xs font-medium text-black bg-[#00FF7F]'>
                        Leilão
                      </span>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-orbitron font-semibold mb-1 text-[#ffffff]'>{nft.name}</h3>
                  <p className='text-sm text-[#cccccc] mb-2'>{nft.collection}</p>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-lg font-orbitron font-bold text-[#00FF7F]'>
                      {nft.price} {nft.currency}
                    </span>
                    <div className='flex items-center text-sm text-[#cccccc]'>
                      <span>♥ {nft.likes}</span>
                      <span className='ml-2'>👁 {nft.views}</span>
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-xs text-[#cccccc] mb-2'>
                    <span>Listado: 2 horas atrás</span>
                    <span>Última venda: {nft.lastSale} ETH</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-[#cccccc]'>Proprietário: {nft.owner}</span>
                    <Button size='sm' variant='default' className='bg-[#00FF7F] text-black hover:bg-[#00d4e0]'>
                      Comprar Agora
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMarketplacePage;
