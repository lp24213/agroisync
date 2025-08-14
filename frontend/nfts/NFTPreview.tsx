import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3Hook } from '../hooks/useWeb3';
import useNFTData from '../hooks/useNFTData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatAddress, formatPrice } from '../lib/utils';

interface NFTPreviewProps {
  nftId: string;
  showDetails?: boolean;
  showActions?: boolean;
  onBuy?: (nftId: string, price: number) => void;
  onSell?: (nftId: string, price: number) => void;
  onTransfer?: (nftId: string, to: string) => void;
  onBurn?: (nftId: string) => void;
  className?: string;
}

interface NFTData {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  metadataUrl: string;
  chain: string;
  contractAddress: string;
  owner: string;
  creator: string;
  category: string;
  attributes: Record<string, any>;
  price: number;
  isListed: boolean;
  floorPrice: number;
  lastSale: number;
  volume24h: number;
  rarity: string;
  rarityScore: number;
  createdAt: string;
  updatedAt: string;
}

export const NFTPreview: React.FC<NFTPreviewProps> = ({
  nftId,
  showDetails = true,
  showActions = true,
  onBuy,
  onSell,
  onTransfer,
  onBurn,
  className = ''
}) => {
  const { publicKey: account, isConnected } = useWeb3Hook();
  const { nfts, loading, error } = useNFTData();
  const nft = nfts.find(n => n.id === nftId);
  
  // Mock NFT data for development to match expected interface
  const mockNFT: NFTData | null = nft ? {
    id: nft.id,
    tokenId: nft.tokenId,
    name: nft.name,
    description: nft.metadata.description || 'No description available',
    imageUrl: nft.imageUrl,
    metadataUrl: '',
    chain: 'ethereum',
    contractAddress: '0x0000000000000000000000000000000000000000',
    owner: nft.owner,
    creator: nft.owner,
    category: nft.type,
    attributes: nft.metadata,
    price: nft.estimatedValue / 1000000, // Convert to USDC equivalent
    isListed: true,
    floorPrice: nft.estimatedValue / 1000000,
    lastSale: nft.estimatedValue / 1000000,
    volume24h: nft.estimatedValue / 1000000,
    rarity: 'Common',
    rarityScore: 1,
    createdAt: nft.lastValuation,
    updatedAt: nft.lastValuation
  } : null;
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (mockNFT && account) {
      setIsOwner(mockNFT.owner.toLowerCase() === account.toLowerCase());
    }
  }, [mockNFT, account]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBuy = () => {
    if (mockNFT && onBuy) {
      onBuy(mockNFT.id, mockNFT.price);
    }
  };

  const handleSell = () => {
    if (mockNFT && onSell) {
      onSell(mockNFT.id, mockNFT.price);
    }
  };

  const handleTransfer = () => {
    setShowModal(true);
  };

  const handleBurn = () => {
    if (mockNFT && onBurn && confirm('Are you sure you want to burn this NFT? This action cannot be undone.')) {
      onBurn(mockNFT.id);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'bg-yellow-500 text-black';
      case 'epic':
        return 'bg-purple-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      case 'uncommon':
        return 'bg-[#00FF00] text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'farm':
        return '🌾';
      case 'equipment':
        return '🚜';
      case 'crop':
        return '🌱';
      case 'land':
        return '🏞️';
      case 'animal':
        return '🐄';
      default:
        return '🎨';
    }
  };

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (error || !nft || !mockNFT) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <div className="p-4 text-center">
          <p className="text-red-600">Failed to load NFT</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group ${className}`}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* NFT Image */}
          <div className="relative aspect-square bg-gradient-to-br from-[#00FF00]/10 to-[#00bfff]/10">
            {!imageError ? (
              <Image
                src={mockNFT.imageUrl}
                alt={mockNFT.name}
                fill
                className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
                onClick={() => setShowFullImage(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-6xl">{getCategoryIcon(mockNFT.category)}</div>
              </div>
            )}
            
            {/* Overlay with quick info */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
              <div className="absolute top-2 left-2 space-y-1">
                <Badge className={getRarityColor(mockNFT.rarity)}>
                  {mockNFT.rarity}
                </Badge>
                <Badge variant="secondary">
                  {getCategoryIcon(mockNFT.category)} {mockNFT.category}
                </Badge>
              </div>
              
              {mockNFT.isListed && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white text-[#00FF00]">
                    Listed
                  </Badge>
                </div>
              )}
            </div>

            {/* Price overlay */}
            {mockNFT.isListed && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-bold text-[#00FF00]">
                    {formatPrice(mockNFT.price)} USDC
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* NFT Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg truncate">{mockNFT.name}</h3>
              <p className="text-sm text-gray-600 truncate">{mockNFT.description}</p>
            </div>

            {showDetails && (
              <div className="space-y-2">
                {/* Market Data */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Floor</p>
                    <p className="font-medium">{formatPrice(mockNFT.floorPrice)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Sale</p>
                    <p className="font-medium">{formatPrice(mockNFT.lastSale)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">24h Vol</p>
                    <p className="font-medium">{formatPrice(mockNFT.volume24h)}</p>
                  </div>
                </div>

                {/* Rarity Score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Rarity Score</span>
                  <span className="text-xs font-medium">{mockNFT.rarityScore}</span>
                </div>

                {/* Owner */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Owner</span>
                  <span className="text-xs font-mono">
                    {formatAddress(mockNFT.owner)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="space-y-2 pt-2">
                {mockNFT.isListed && !isOwner && (
                  <Button
                    onClick={handleBuy}
                    className="w-full"
                    disabled={!isConnected}
                  >
                    Buy for {formatPrice(mockNFT.price)} USDC
                  </Button>
                )}

                {isOwner && (
                  <div className="grid grid-cols-2 gap-2">
                    {!mockNFT.isListed && (
                      <Button
                        onClick={handleSell}
                        variant="outline"
                        size="sm"
                        disabled={!isConnected}
                      >
                        List for Sale
                      </Button>
                    )}
                    <Button
                      onClick={handleTransfer}
                      variant="outline"
                      size="sm"
                      disabled={!isConnected}
                    >
                      Transfer
                    </Button>
                    <Button
                      onClick={handleBurn}
                      variant="destructive"
                      size="sm"
                      disabled={!isConnected}
                    >
                      Burn
                    </Button>
                  </div>
                )}

                {!isConnected && (
                  <Button variant="outline" className="w-full" disabled>
                    Connect Wallet
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <Modal
            isOpen={showFullImage}
            onClose={() => setShowFullImage(false)}
            size="lg"
          >
            <div className="relative">
              <Image
                src={mockNFT.imageUrl}
                alt={mockNFT.name}
                width={600}
                height={600}
                className="w-full h-auto rounded-lg"
                onError={handleImageError}
              />
              <div className="mt-4">
                <h3 className="text-xl font-bold">{mockNFT.name}</h3>
                <p className="text-gray-600 mt-2">{mockNFT.description}</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Transfer NFT"
      >
        <TransferForm
                          nftId={mockNFT.id}
          onTransfer={onTransfer}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

// Transfer Form Component
interface TransferFormProps {
  nftId: string;
  onTransfer?: (nftId: string, to: string) => void;
  onClose: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ nftId, onTransfer, onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !onTransfer) return;

    setLoading(true);
    try {
      await onTransfer(nftId, recipient);
      onClose();
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
          required
        />
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="submit"
          disabled={loading || !recipient}
          className="flex-1"
        >
          {loading ? 'Transferring...' : 'Transfer'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default NFTPreview; 