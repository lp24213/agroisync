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
    name: 'AGROTM Farms',
    creator: 'AGROTM Team',
    verified: true,
    items: 150,
    floorPrice: 0.5,
    volume: 1250,
    banner: '/images/collection-banner-1.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#22C55E',
    description: 'Revolutionary agricultural technology NFTs',
  },
  {
    id: 2,
    name: 'Crypto Crops',
    creator: 'FarmDAO',
    verified: true,
    items: 89,
    floorPrice: 0.3,
    volume: 890,
    banner: '/images/collection-banner-2.jpg',
    logo: '/images/crypto-crops-logo.png',
    color: '#F59E0B',
    description: 'Digital representation of premium crops',
  },
  {
    id: 3,
    name: 'Smart Seeds',
    creator: 'SeedTech',
    verified: false,
    items: 234,
    floorPrice: 0.2,
    volume: 567,
    banner: '/images/collection-banner-3.jpg',
    logo: '/images/smart-seeds-logo.png',
    color: '#8B5CF6',
    description: 'Genetically optimized seed NFTs',
  },
];

const nfts: NFT[] = [
  {
    id: 1,
    name: 'Fazenda Digital #042',
    collection: 'AGROTM Farms',
    creator: 'AGROTM Team',
    price: 0.5,
    currency: 'ETH',
    image: '/images/nft-1.jpg',
    likes: 234,
    listed: true,
    lastSale: 3.2,
    owner: '0x1234...5678',
    rarity: 'Rare',
    views: 156,
    auction: false,
    description: 'Fazenda digital com 500 hectares de área cultivável',
    color: '#22C55E',
    attributes: [
      { trait_type: 'Background', value: 'Farm Field', rarity: 15 },
      { trait_type: 'Crop Type', value: 'Soybeans', rarity: 25 },
      { trait_type: 'Technology', value: 'IoT Sensors', rarity: 10 },
      { trait_type: 'Rarity', value: 'Rare', rarity: 8 },
    ],
  },
  {
    id: 2,
    name: 'Drone Agrícola #013',
    collection: 'AGROTM Farms',
    creator: 'AGROTM Team',
    price: 0.8,
    currency: 'ETH',
    image: '/images/nft-2.jpg',
    likes: 189,
    listed: true,
    lastSale: 2.1,
    owner: '0x8765...4321',
    rarity: 'Epic',
    views: 203,
    auction: true,
    description: 'Drone agrícola para monitoramento de plantações',
    color: '#22C55E',
    attributes: [
      { trait_type: 'Drone Type', value: 'Survey', rarity: 12 },
      { trait_type: 'Range', value: '10km', rarity: 18 },
      { trait_type: 'Battery', value: '8 hours', rarity: 22 },
      { trait_type: 'Rarity', value: 'Epic', rarity: 5 },
    ],
  },
  {
    id: 3,
    name: 'Sementes Premium #007',
    collection: 'Smart Seeds',
    creator: 'SeedTech',
    price: 0.3,
    currency: 'ETH',
    image: '/images/nft-3.jpg',
    likes: 156,
    listed: true,
    lastSale: 1.8,
    owner: '0x5678...9012',
    rarity: 'Common',
    views: 98,
    auction: false,
    description: 'Sementes geneticamente otimizadas',
    color: '#8B5CF6',
    attributes: [
      { trait_type: 'Seed Type', value: 'Corn', rarity: 30 },
      { trait_type: 'Yield', value: 'High', rarity: 20 },
      { trait_type: 'Resistance', value: 'Drought', rarity: 15 },
      { trait_type: 'Rarity', value: 'Common', rarity: 35 },
    ],
  },
  {
    id: 4,
    name: 'Tractor Autônomo #025',
    collection: 'AGROTM Farms',
    creator: 'AGROTM Team',
    price: 1.2,
    currency: 'ETH',
    image: '/images/nft-4.jpg',
    likes: 312,
    listed: true,
    lastSale: 4.5,
    owner: '0x3456...7890',
    rarity: 'Legendary',
    views: 445,
    auction: false,
    description: 'Trator autônomo com IA avançada',
    color: '#22C55E',
    attributes: [
      { trait_type: 'Engine', value: 'Electric', rarity: 8 },
      { trait_type: 'Autonomy', value: '12 hours', rarity: 5 },
      { trait_type: 'AI Level', value: 'Advanced', rarity: 3 },
      { trait_type: 'Rarity', value: 'Legendary', rarity: 2 },
    ],
  },
  {
    id: 5,
    name: 'Grãos Dourados #089',
    collection: 'Crypto Crops',
    creator: 'FarmDAO',
    price: 0.4,
    currency: 'ETH',
    image: '/images/nft-5.jpg',
    likes: 178,
    listed: true,
    lastSale: 2.8,
    owner: '0x9012...3456',
    rarity: 'Rare',
    views: 134,
    auction: false,
    description: 'Grãos premium certificados',
    color: '#F59E0B',
    attributes: [
      { trait_type: 'Grain Type', value: 'Wheat', rarity: 25 },
      { trait_type: 'Quality', value: 'Premium', rarity: 12 },
      { trait_type: 'Certification', value: 'Organic', rarity: 18 },
      { trait_type: 'Rarity', value: 'Rare', rarity: 8 },
    ],
  },
  {
    id: 6,
    name: 'Sistema de Irrigação #015',
    collection: 'AGROTM Farms',
    creator: 'AGROTM Team',
    price: 0.6,
    currency: 'ETH',
    image: '/images/nft-6.jpg',
    likes: 245,
    listed: true,
    lastSale: 3.1,
    owner: '0x6789...0123',
    rarity: 'Epic',
    views: 167,
    auction: true,
    description: 'Sistema inteligente de irrigação',
    color: '#22C55E',
    attributes: [
      { trait_type: 'Coverage', value: '100 acres', rarity: 10 },
      { trait_type: 'Efficiency', value: '95%', rarity: 8 },
      { trait_type: 'Technology', value: 'Smart', rarity: 12 },
      { trait_type: 'Rarity', value: 'Epic', rarity: 5 },
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
    <div className='container mx-auto py-8 px-4 max-w-7xl'>
      <h1 className='text-3xl font-bold mb-2'>NFT Marketplace</h1>
      <p className='mb-6 text-gray-600'>Descubra e compre NFTs únicos da agricultura digital</p>

      {/* Filtros */}
      <div className='mb-8 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Input
            placeholder='Buscar NFTs...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className='p-2 border border-gray-300 rounded-md'
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
            className='p-2 border border-gray-300 rounded-md'
          >
            <option value='recent'>Mais Recentes</option>
            <option value='price-low'>Preço: Menor</option>
            <option value='price-high'>Preço: Maior</option>
            <option value='popular'>Mais Populares</option>
          </select>
          <select
            value={filterRarity}
            onChange={e => setFilterRarity(e.target.value)}
            className='p-2 border border-gray-300 rounded-md'
          >
            <option value='all'>Todas as Raridades</option>
            <option value='common'>Comum</option>
            <option value='rare'>Raro</option>
            <option value='epic'>Épico</option>
            <option value='legendary'>Lendário</option>
          </select>
        </div>
      </div>

      {/* Coleções */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-4'>Coleções em Destaque</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {collections.map(collection => (
            <Card key={collection.id} className='overflow-hidden'>
              <div
                className='h-32 bg-cover bg-center'
                style={{
                  backgroundImage: `url(${collection.banner})`,
                  backgroundColor: collection.color,
                }}
              />
              <div className='p-4'>
                <div className='flex items-center mb-2'>
                  <img
                    src={collection.logo}
                    alt={collection.name}
                    className='w-8 h-8 rounded-full mr-2'
                  />
                  <h3 className='font-semibold'>{collection.name}</h3>
                  {collection.verified && <span className='ml-1 text-blue-500'>✓</span>}
                </div>
                <p className='text-sm text-gray-600 mb-2'>{collection.description}</p>
                <div className='flex justify-between text-sm'>
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
        <h2 className='text-2xl font-bold mb-4'>NFTs Disponíveis</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedNFTs.map(nft => (
            <Card key={nft.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='relative'>
                <img src={nft.image} alt={nft.name} className='w-full h-48 object-cover' />
                <div className='absolute top-2 right-2'>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium text-white',
                      nft.rarity === 'Common' && 'bg-gray-500',
                      nft.rarity === 'Rare' && 'bg-blue-500',
                      nft.rarity === 'Epic' && 'bg-purple-500',
                      nft.rarity === 'Legendary' && 'bg-yellow-500',
                    )}
                  >
                    {nft.rarity}
                  </span>
                </div>
                {nft.auction && (
                  <div className='absolute top-2 left-2'>
                    <span className='px-2 py-1 rounded text-xs font-medium text-white bg-red-500'>
                      Auction
                    </span>
                  </div>
                )}
              </div>
              <div className='p-4'>
                <h3 className='font-semibold mb-1'>{nft.name}</h3>
                <p className='text-sm text-gray-600 mb-2'>{nft.collection}</p>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-lg font-bold text-green-600'>
                    {nft.price} {nft.currency}
                  </span>
                  <div className='flex items-center text-sm text-gray-500'>
                    <span>♥ {nft.likes}</span>
                    <span className='ml-2'>👁 {nft.views}</span>
                  </div>
                </div>
                <div className='flex justify-between items-center text-xs text-gray-500 mb-2'>
                  <span>Listed: 2 hours ago</span>
                  <span>Last sale: {nft.lastSale} ETH</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>Owner: {nft.owner}</span>
                  <Button size='sm' variant='default'>
                    Buy Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NFTMarketplacePage;
