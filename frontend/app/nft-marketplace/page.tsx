'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown,
  Heart,
  Clock,
  Tag,
  Zap,
  Eye,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

// Types
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
  description: string;
}

interface NFTAttribute {
  trait_type: string;
  value: string;
  rarity: number;
}

interface NFT {
  id: number;
  name: string;
  collection: string;
  image: string;
  price: number;
  lastSale: number;
  owner: string;
  creator: string;
  rarity: string;
  likes: number;
  views: number;
  listed: boolean;
  auction: boolean;
  auctionEndTime?: string;
  attributes: NFTAttribute[];
  description: string;
}

interface NFTCardProps {
  nft: NFT;
  onLike: (nftId: number) => void;
  onBuy: (nftId: number) => void;
  onBid: (nftId: number, amount: number) => void;
  isLiked: boolean;
}

interface CollectionCardProps {
  collection: Collection;
  onClick: (collectionId: number) => void;
}

const collections = [
  {
    id: 1,
    name: 'AgroTech Pioneers',
    creator: 'AgroTM Labs',
    verified: true,
    items: 1000,
    floorPrice: 2.5,
    volume: 1250,
    banner: '/images/nft-collection-1.jpg',
    logo: '/images/agrotm-logo.png',
    color: '#22C55E'
  },
  {
    id: 2,
    name: 'Solana Farmers',
    creator: 'SolFarm',
    verified: true,
    items: 5000,
    floorPrice: 0.8,
    volume: 3500,
    banner: '/images/nft-collection-2.jpg',
    logo: '/images/sol-logo.png',
    color: '#9945FF'
  },
  {
    id: 3,
    name: 'Crypto Crops',
    creator: 'CryptoArt Collective',
    verified: false,
    items: 750,
    floorPrice: 1.2,
    volume: 450,
    banner: '/images/nft-collection-3.jpg',
    logo: '/images/ray-logo.png',
    color: '#FF6B6B'
  }
];

const nfts = [
  {
    id: 1,
    name: 'AgroTech Pioneer #042',
    collection: 'AgroTech Pioneers',
    creator: 'AgroTM Labs',
    price: 3.5,
    currency: 'SOL',
    image: '/images/nft-1.jpg',
    likes: 24,
    listed: '2 hours ago',
    attributes: [
      { trait: 'Background', value: 'Farm Field', rarity: 15 },
      { trait: 'Crop Type', value: 'Wheat', rarity: 25 },
      { trait: 'Tech Level', value: 'Advanced', rarity: 10 },
      { trait: 'Season', value: 'Summer', rarity: 20 },
      { trait: 'Rarity', value: 'Rare', rarity: 8 }
    ],
    color: '#22C55E'
  },
  {
    id: 2,
    name: 'Solana Farmer #189',
    collection: 'Solana Farmers',
    creator: 'SolFarm',
    price: 1.2,
    currency: 'SOL',
    image: '/images/nft-2.jpg',
    likes: 18,
    listed: '5 hours ago',
    attributes: [
      { trait: 'Background', value: 'Mountain', rarity: 20 },
      { trait: 'Tool', value: 'Tractor', rarity: 15 },
      { trait: 'Outfit', value: 'Overalls', rarity: 30 },
      { trait: 'Accessory', value: 'Straw Hat', rarity: 25 },
      { trait: 'Rarity', value: 'Common', rarity: 35 }
    ],
    color: '#9945FF'
  },
  {
    id: 3,
    name: 'Crypto Crop #103',
    collection: 'Crypto Crops',
    creator: 'CryptoArt Collective',
    price: 1.8,
    currency: 'SOL',
    image: '/images/nft-3.jpg',
    likes: 12,
    listed: '1 day ago',
    attributes: [
      { trait: 'Background', value: 'Greenhouse', rarity: 18 },
      { trait: 'Crop Type', value: 'Digital Corn', rarity: 22 },
      { trait: 'Growth Stage', value: 'Mature', rarity: 30 },
      { trait: 'Weather', value: 'Rainy', rarity: 25 },
      { trait: 'Rarity', value: 'Uncommon', rarity: 15 }
    ],
    color: '#FF6B6B'
  },
  {
    id: 4,
    name: 'AgroTech Pioneer #108',
    collection: 'AgroTech Pioneers',
    creator: 'AgroTM Labs',
    price: 4.2,
    currency: 'SOL',
    image: '/images/nft-4.jpg',
    likes: 32,
    listed: '3 hours ago',
    attributes: [
      { trait: 'Background', value: 'Laboratory', rarity: 12 },
      { trait: 'Crop Type', value: 'GMO Soybean', rarity: 8 },
      { trait: 'Tech Level', value: 'Futuristic', rarity: 5 },
      { trait: 'Season', value: 'All-Season', rarity: 10 },
      { trait: 'Rarity', value: 'Epic', rarity: 3 }
    ],
    color: '#22C55E'
  },
  {
    id: 5,
    name: 'Solana Farmer #275',
    collection: 'Solana Farmers',
    creator: 'SolFarm',
    price: 0.95,
    currency: 'SOL',
    image: '/images/nft-5.jpg',
    likes: 9,
    listed: '12 hours ago',
    attributes: [
      { trait: 'Background', value: 'River', rarity: 22 },
      { trait: 'Tool', value: 'Hoe', rarity: 35 },
      { trait: 'Outfit', value: 'Plaid Shirt', rarity: 40 },
      { trait: 'Accessory', value: 'Bandana', rarity: 28 },
      { trait: 'Rarity', value: 'Common', rarity: 45 }
    ],
    color: '#9945FF'
  },
  {
    id: 6,
    name: 'Crypto Crop #057',
    collection: 'Crypto Crops',
    creator: 'CryptoArt Collective',
    price: 2.1,
    currency: 'SOL',
    image: '/images/nft-6.jpg',
    likes: 15,
    listed: '8 hours ago',
    attributes: [
      { trait: 'Background', value: 'Vertical Farm', rarity: 14 },
      { trait: 'Crop Type', value: 'Pixel Tomato', rarity: 18 },
      { trait: 'Growth Stage', value: 'Seedling', rarity: 25 },
      { trait: 'Weather', value: 'Sunny', rarity: 30 },
      { trait: 'Rarity', value: 'Rare', rarity: 12 }
    ],
    color: '#FF6B6B'
  },
  {
    id: 7,
    name: 'AgroTech Pioneer #299',
    collection: 'AgroTech Pioneers',
    creator: 'AgroTM Labs',
    price: 2.8,
    currency: 'SOL',
    image: '/images/nft-7.jpg',
    likes: 21,
    listed: '1 day ago',
    attributes: [
      { trait: 'Background', value: 'Drone View', rarity: 18 },
      { trait: 'Crop Type', value: 'Rice', rarity: 22 },
      { trait: 'Tech Level', value: 'Intermediate', rarity: 15 },
      { trait: 'Season', value: 'Spring', rarity: 25 },
      { trait: 'Rarity', value: 'Uncommon', rarity: 12 }
    ],
    color: '#22C55E'
  },
  {
    id: 8,
    name: 'Solana Farmer #412',
    collection: 'Solana Farmers',
    creator: 'SolFarm',
    price: 1.5,
    currency: 'SOL',
    image: '/images/nft-8.jpg',
    likes: 14,
    listed: '2 days ago',
    attributes: [
      { trait: 'Background', value: 'Sunset Field', rarity: 18 },
      { trait: 'Tool', value: 'Drone', rarity: 12 },
      { trait: 'Outfit', value: 'Tech Suit', rarity: 15 },
      { trait: 'Accessory', value: 'Smart Glasses', rarity: 10 },
      { trait: 'Rarity', value: 'Rare', rarity: 8 }
    ],
    color: '#9945FF'
  }
];

const NFTCard = ({ nft, onBuy, onLike, isLiked }: NFTCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const handleBuy = () => {
    setIsBuying(true);
    
    // Simulate purchase process
    setTimeout(() => {
      onBuy(nft.id);
      setIsBuying(false);
    }, 1500);
  };
  
  return (
    <motion.div 
      className="cyberpunk-border p-0.5 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="bg-agro-darker/90 backdrop-blur-md rounded-lg overflow-hidden">
        <div className="relative">
          {/* NFT Image */}
          <div className="aspect-square bg-agro-dark/50 relative overflow-hidden">
            <div 
              className="w-full h-full bg-gradient-to-br from-agro-dark to-agro-darker flex items-center justify-center"
              style={{ 
                backgroundColor: `${nft.color}10`,
              }}
            >
              <span className="text-6xl font-bold opacity-20" style={{ color: nft.color }}>
                {nft.name.charAt(0)}
              </span>
            </div>
            
            {/* Overlay on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div 
                  className="absolute inset-0 bg-agro-darker/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    onClick={handleBuy}
                    disabled={isBuying}
                    className={`w-full py-2 rounded-lg font-medium text-white mb-3 ${isBuying ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
                    whileHover={!isBuying ? { scale: 1.05 } : {}}
                    whileTap={!isBuying ? { scale: 0.95 } : {}}
                  >
                    {isBuying ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Buy Now
                      </span>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.open('#', '_blank')}
                    className="w-full py-2 rounded-lg font-medium text-white bg-agro-dark/70 hover:bg-agro-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Collection Badge */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-agro-darker/80 backdrop-blur-sm text-xs text-white flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: nft.color }}
            ></div>
            {nft.collection}
          </div>
          
          {/* Like Button */}
          <button 
            onClick={() => onLike(nft.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-agro-darker/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 truncate">{nft.name}</h3>
          
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-400">{nft.creator}</div>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-400">{nft.listed}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-lg font-bold text-white flex items-center">
                {nft.price} {nft.currency}
                <span className="text-xs text-gray-400 ml-1">
                  (${(nft.price * 120).toFixed(2)})
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-400">{nft.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <motion.div 
      className="cyberpunk-border p-0.5 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-agro-darker/90 backdrop-blur-md rounded-lg overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-agro-dark/50 relative overflow-hidden">
          <div 
            className="w-full h-full bg-gradient-to-br from-agro-dark to-agro-darker flex items-center justify-center"
            style={{ 
              backgroundColor: `${collection.color}10`,
            }}
          >
            <span className="text-6xl font-bold opacity-20" style={{ color: collection.color }}>
              {collection.name.charAt(0)}
            </span>
          </div>
          
          {/* Collection Logo */}
          <div className="absolute -bottom-8 left-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center neon-box"
              style={{ 
                backgroundColor: `${collection.color}20`,
                boxShadow: `0 0 10px ${collection.color}30`
              }}
            >
              <span className="text-2xl font-bold" style={{ color: collection.color }}>
                {collection.name.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Verified Badge */}
          {collection.verified && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-agro-blue flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-4 pt-10">
          <h3 className="text-lg font-bold text-white mb-1">{collection.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{collection.creator}</p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Floor</p>
              <p className="text-sm font-bold text-white">{collection.floorPrice} SOL</p>
            </div>
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Items</p>
              <p className="text-sm font-bold text-white">{collection.items}</p>
            </div>
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Volume</p>
              <p className="text-sm font-bold text-white">{collection.volume} SOL</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => window.open('#', '_blank')}
            className="w-full py-2 rounded-lg font-medium text-white bg-agro-dark/70 hover:bg-agro-dark transition-colors text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              View Collection
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function NFTMarketplacePage() {
  const [activeNFTs, setActiveNFTs] = useState(nfts);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [sortBy, setSortBy] = useState('recently_listed'); // recently_listed, price_low_high, price_high_low
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [likedNFTs, setLikedNFTs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort NFTs
  useEffect(() => {
    let filtered = [...nfts];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(nft => 
      nft.price >= priceRange[0] && nft.price <= priceRange[1]
    );
    
    // Apply collection filter
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(nft => 
        selectedCollections.includes(nft.collection)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recently_listed':
          // Simple sorting based on id (higher id = more recent in our mock data)
          return b.id - a.id;
        case 'price_low_high':
          return a.price - b.price;
        case 'price_high_low':
          return b.price - a.price;
        default:
          return b.id - a.id;
      }
    });
    
    setActiveNFTs(filtered);
  }, [searchTerm, priceRange, selectedCollections, sortBy]);
  
  const handleBuy = (nftId: number) => {
    // In a real app, this would call a contract method
    console.log(`Buying NFT ${nftId}`);
  };
  
  const handleLike = (nftId: number) => {
    if (likedNFTs.includes(nftId)) {
      setLikedNFTs(likedNFTs.filter(id => id !== nftId));
    } else {
      setLikedNFTs([...likedNFTs, nftId]);
    }
  };
  
  const handleCollectionFilter = (collectionName: string) => {
    if (selectedCollections.includes(collectionName)) {
      setSelectedCollections(selectedCollections.filter(name => name !== collectionName));
    } else {
      setSelectedCollections([...selectedCollections, collectionName]);
    }
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  return (
    <div className="min-h-screen bg-agro-darker overflow-hidden relative">
      {/* Background grid animation */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid-animation"></div>
      </div>
      
      {/* Animated orbs */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-agro-blue/20 blur-xl z-0"
        animate={{ 
          x: [0, 30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-agro-green/20 blur-xl z-0"
        animate={{ 
          x: [0, -30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut" 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-glow">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-agro-blue to-agro-green">
              NFT Marketplace
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover, collect, and sell extraordinary NFTs
          </p>
        </motion.div>
        
        {/* Featured Collections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Collections</h2>
            <button className="text-sm text-agro-blue hover:underline">
              View All Collections
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </motion.div>
        
        {/* Marketplace */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Marketplace</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters (Sidebar) */}
            <div className="lg:w-1/4">
              <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden sticky top-4">
                <div className="bg-agro-darker/90 backdrop-blur-md p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4 lg:hidden">
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80"
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <div className={`space-y-6 ${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}>
                    {/* Search */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Search</h4>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search NFTs"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full bg-agro-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                        />
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Price Range</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(parseFloat(e.target.value), priceRange[1])}
                          className="w-full bg-agro-dark/50 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(priceRange[0], parseFloat(e.target.value))}
                          className="w-full bg-agro-dark/50 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                        />
                      </div>
                      <div className="text-sm text-gray-400">
                        Price: {priceRange[0]} SOL - {priceRange[1]} SOL
                      </div>
                    </div>
                    
                    {/* Collections */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Collections</h4>
                      <div className="space-y-2">
                        {collections.map((collection) => (
                          <div key={collection.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`collection-${collection.id}`}
                              checked={selectedCollections.includes(collection.name)}
                              onChange={() => handleCollectionFilter(collection.name)}
                              className="w-4 h-4 rounded border-gray-700 text-agro-blue focus:ring-agro-blue bg-agro-dark/50"
                            />
                            <label htmlFor={`collection-${collection.id}`} className="ml-2 text-gray-300">
                              {collection.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sort By */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Sort By</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-agro-dark/50 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                      >
                        <option value="recently_listed">Recently Listed</option>
                        <option value="price_low_high">Price: Low to High</option>
                        <option value="price_high_low">Price: High to Low</option>
                      </select>
                    </div>
                    
                    {/* Reset Filters */}
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 5]);
                        setSelectedCollections([]);
                        setSortBy('recently_listed');
                      }}
                      className="w-full py-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark hover:text-white transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* NFT Grid */}
            <div className="lg:w-3/4">
              {activeNFTs.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {activeNFTs.map((nft) => (
                    <NFTCard 
                      key={nft.id} 
                      nft={nft} 
                      onBuy={handleBuy} 
                      onLike={handleLike}
                      isLiked={likedNFTs.includes(nft.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-agro-dark/30 rounded-lg">
                  <Zap className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search term</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}