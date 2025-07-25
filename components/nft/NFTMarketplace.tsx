'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { Modal } from '@/components/Modal';
import {
  Leaf,
  ShoppingCart,
  Eye,
  Heart,
  Share2,
  Search,
  TrendingUp,
  Award,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  Users,
  Star,
} from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: 'SOL' | 'AGROTM';
  creator: string;
  owner: string;
  category: 'farm' | 'equipment' | 'land' | 'carbon' | 'harvest';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: { trait_type: string; value: string }[];
  carbonOffset: number;
  yieldBonus: number;
  stakingRewards: number;
  isListed: boolean;
  likes: number;
  views: number;
  createdAt: Date;
}

const mockNFTs: NFTItem[] = [
  {
    id: '1',
    name: 'Organic Farm Genesis',
    description: 'A premium organic farm NFT that provides 15% yield bonus and carbon credits',
    image: '/nft/farm-genesis.jpg',
    price: 2.5,
    currency: 'SOL',
    creator: '0x1234...5678',
    owner: '0x1234...5678',
    category: 'farm',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Size', value: '100 Acres' },
      { trait_type: 'Soil Quality', value: 'Premium' },
      { trait_type: 'Water Access', value: 'River' },
      { trait_type: 'Climate', value: 'Temperate' },
    ],
    carbonOffset: 50,
    yieldBonus: 15,
    stakingRewards: 12,
    isListed: true,
    likes: 234,
    views: 1567,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Smart Tractor Pro',
    description: 'AI-powered farming equipment that increases efficiency by 25%',
    image: '/nft/tractor-pro.jpg',
    price: 1.8,
    currency: 'SOL',
    creator: '0x2345...6789',
    owner: '0x2345...6789',
    category: 'equipment',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Efficiency', value: '+25%' },
      { trait_type: 'Fuel Type', value: 'Electric' },
      { trait_type: 'AI Level', value: 'Advanced' },
      { trait_type: 'Durability', value: 'High' },
    ],
    carbonOffset: 30,
    yieldBonus: 10,
    stakingRewards: 8,
    isListed: true,
    likes: 156,
    views: 892,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Carbon Credit Certificate',
    description: 'Verified carbon offset certificate representing 100 tons of CO2',
    image: '/nft/carbon-certificate.jpg',
    price: 500,
    currency: 'AGROTM',
    creator: '0x3456...7890',
    owner: '0x3456...7890',
    category: 'carbon',
    rarity: 'rare',
    attributes: [
      { trait_type: 'CO2 Offset', value: '100 tons' },
      { trait_type: 'Verification', value: 'Gold Standard' },
      { trait_type: 'Project Type', value: 'Reforestation' },
      { trait_type: 'Location', value: 'Brazil' },
    ],
    carbonOffset: 100,
    yieldBonus: 0,
    stakingRewards: 15,
    isListed: true,
    likes: 89,
    views: 445,
    createdAt: new Date('2024-02-10'),
  },
];

export function NFTMarketplace() {
  const { isConnected, account, connectWallet } = useWeb3();
  const [nfts, setNfts] = useState<NFTItem[]>(mockNFTs);
  const [filteredNfts, setFilteredNfts] = useState<NFTItem[]>(mockNFTs);
  const [selectedNft, setSelectedNft] = useState<NFTItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    filterAndSortNFTs();
  }, [searchTerm, selectedCategory, selectedRarity, sortBy, nfts]);

  const filterAndSortNFTs = () => {
    let filtered = [...nfts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((nft) => nft.category === selectedCategory);
    }

    // Apply rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter((nft) => nft.rarity === selectedRarity);
    }

    // Apply sorting
    filtered.sort((a: NFTItem, b: NFTItem) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'popular':
          return b.likes - a.likes;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });

    setFilteredNfts(filtered);
  };

  const handleBuyNFT = async (nft: NFTItem) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading(true);
    try {
      // Simulate NFT purchase
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update NFT status
      setNfts((prev) =>
        prev.map((item) =>
          item.id === nft.id ? { ...item, owner: account!, isListed: false } : item,
        ),
      );

      setShowDetails(false);
      // Show success message
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeNFT = (nftId: string) => {
    setNfts((prev) =>
      prev.map((nft) => (nft.id === nftId ? { ...nft, likes: nft.likes + 1 } : nft)),
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400 border-gray-400';
      case 'rare':
        return 'text-blue-400 border-blue-400';
      case 'epic':
        return 'text-purple-400 border-purple-400';
      case 'legendary':
        return 'text-yellow-400 border-yellow-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'farm':
        return <Leaf className="w-4 h-4" />;
      case 'equipment':
        return <Zap className="w-4 h-4" />;
      case 'land':
        return <Globe className="w-4 h-4" />;
      case 'carbon':
        return <Award className="w-4 h-4" />;
      case 'harvest':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-blue-400" />
                NFT Marketplace
              </h1>
              <p className="text-gray-400 mt-1">Trade agricultural NFTs and carbon credits</p>
            </div>

            {!isConnected && <NeonButton onClick={connectWallet}>Connect Wallet</NeonButton>}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-white">{/* stats.totalVolume */}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-white">{/* stats.totalSales */}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Average Price</p>
                <p className="text-2xl font-bold text-white">{/* stats.averagePrice */}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-white">{/* stats.activeListings */}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Carbon Offset</p>
                <p className="text-2xl font-bold text-white">{/* stats.carbonOffsetTotal */}</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AnimatedCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400"
                >
                  <option value="all">All Categories</option>
                  <option value="farm">Farms</option>
                  <option value="equipment">Equipment</option>
                  <option value="land">Land</option>
                  <option value="carbon">Carbon Credits</option>
                  <option value="harvest">Harvest</option>
                </select>

                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* NFT Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredNfts.map((nft: NFTItem, index: number) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard className="overflow-hidden group cursor-pointer">
                {/* NFT Image */}
                <div className="relative aspect-square bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRarityColor(nft.rarity)}`}
                    >
                      {nft.rarity.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {getCategoryIcon(nft.category)}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Eye className="w-4 h-4" />
                      {nft.views}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeNFT(nft.id);
                      }}
                      className="flex items-center gap-1 text-white text-sm hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {nft.likes}
                    </button>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {nft.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{nft.description}</p>

                  {/* Benefits */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {nft.yieldBonus > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Yield Bonus</p>
                        <p className="text-sm font-semibold text-green-400">+{nft.yieldBonus}%</p>
                      </div>
                    )}
                    {nft.carbonOffset > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Carbon Offset</p>
                        <p className="text-sm font-semibold text-blue-400">{nft.carbonOffset}t</p>
                      </div>
                    )}
                    {nft.stakingRewards > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Staking APR</p>
                        <p className="text-sm font-semibold text-yellow-400">
                          {nft.stakingRewards}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-lg font-bold text-white">
                        {nft.price} {nft.currency}
                      </p>
                    </div>

                    <NeonButton
                      size="sm"
                      onClick={() => {
                        setSelectedNft(nft);
                        setShowDetails(true);
                      }}
                      disabled={!nft.isListed}
                    >
                      {nft.isListed ? 'View Details' : 'Not Listed'}
                    </NeonButton>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredNfts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* NFT Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedNft?.name || ''}
        size="lg"
      >
        {selectedNft && (
          <div className="space-y-6">
            {/* NFT Image and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-800 rounded-lg relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(selectedNft.rarity)}`}
                  >
                    {selectedNft.rarity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedNft.name}</h3>
                  <p className="text-gray-300">{selectedNft.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Creator</p>
                    <p className="text-white font-mono text-sm">
                      {selectedNft.creator.slice(0, 6)}...{selectedNft.creator.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Owner</p>
                    <p className="text-white font-mono text-sm">
                      {selectedNft.owner.slice(0, 6)}...{selectedNft.owner.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedNft.yieldBonus > 0 && (
                      <div className="text-center">
                        <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Yield Bonus</p>
                        <p className="text-sm font-semibold text-green-400">
                          +{selectedNft.yieldBonus}%
                        </p>
                      </div>
                    )}
                    {selectedNft.carbonOffset > 0 && (
                      <div className="text-center">
                        <Award className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Carbon Offset</p>
                        <p className="text-sm font-semibold text-blue-400">
                          {selectedNft.carbonOffset}t CO2
                        </p>
                      </div>
                    )}
                    {selectedNft.stakingRewards > 0 && (
                      <div className="text-center">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Staking APR</p>
                        <p className="text-sm font-semibold text-yellow-400">
                          {selectedNft.stakingRewards}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Attributes</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedNft.attributes.map((attr, index: number) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">{attr.trait_type}</p>
                    <p className="text-sm font-semibold text-white">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase */}
            {selectedNft.isListed && (
              <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Current Price</p>
                    <p className="text-3xl font-bold text-white">
                      {selectedNft.price} {selectedNft.currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">USD Value</p>
                    <p className="text-lg font-semibold text-gray-300">
                      ≈ $
                      {(selectedNft.price * (selectedNft.currency === 'SOL' ? 100 : 1)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <NeonButton
                    onClick={() => handleBuyNFT(selectedNft)}
                    className="flex-1"
                    loading={loading}
                    disabled={!isConnected}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isConnected ? 'Buy Now' : 'Connect Wallet'}
                  </NeonButton>

                  <NeonButton variant="secondary" size="md">
                    <Heart className="w-5 h-5" />
                  </NeonButton>

                  <NeonButton variant="secondary" size="md">
                    <Share2 className="w-5 h-5" />
                  </NeonButton>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
