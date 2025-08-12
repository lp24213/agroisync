import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '../hooks/useWeb3';
import { useNFTData } from '../hooks/useNFTData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatAddress, formatPrice } from '../lib/utils';

interface NFTMintFormProps {
  onMintSuccess?: (tokenId: string) => void;
  onMintError?: (error: string) => void;
  className?: string;
}

interface MintFormData {
  name: string;
  description: string;
  category: string;
  rarity: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  image: File | null;
  metadata: File | null;
  price: string;
  supply: number;
  farmData?: {
    location: string;
    cropType: string;
    harvestDate: string;
    yield: string;
    quality: string;
  };
}

const NFT_CATEGORIES = [
  'Farm Land',
  'Crop Token',
  'Equipment',
  'Harvest',
  'Certificate',
  'Insurance',
  'Yield Bond',
  'Carbon Credit'
];

const RARITY_LEVELS = [
  'Common',
  'Uncommon', 
  'Rare',
  'Epic',
  'Legendary',
  'Mythic'
];

export const NFTMintForm: React.FC<NFTMintFormProps> = ({
  onMintSuccess,
  onMintError,
  className = ''
}) => {
  const { account, provider, isConnected } = useWeb3();
  const [formData, setFormData] = useState<MintFormData>({
    name: '',
    description: '',
    category: 'Farm Land',
    rarity: 'Common',
    attributes: [],
    image: null,
    metadata: null,
    price: '0',
    supply: 1
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
  const [gasEstimate, setGasEstimate] = useState<string>('0');
  const [mintFee, setMintFee] = useState<string>('0');

  useEffect(() => {
    if (formData.image) {
      const url = URL.createObjectURL(formData.image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.image]);

  useEffect(() => {
    calculateFees();
  }, [formData.category, formData.rarity, formData.supply]);

  const calculateFees = async () => {
    try {
      // Mock fee calculation - in real implementation, this would call contract
      const baseFee = 0.01; // 0.01 ETH base fee
      const rarityMultiplier = {
        'Common': 1,
        'Uncommon': 1.5,
        'Rare': 2,
        'Epic': 3,
        'Legendary': 5,
        'Mythic': 10
      };
      
      const supplyMultiplier = formData.supply > 1 ? 1.2 : 1;
      const categoryMultiplier = formData.category === 'Farm Land' ? 2 : 1;
      
      const totalFee = baseFee * rarityMultiplier[formData.rarity as keyof typeof rarityMultiplier] * supplyMultiplier * categoryMultiplier;
      
      setMintFee(totalFee.toFixed(4));
      setGasEstimate((totalFee * 0.1).toFixed(4)); // 10% of mint fee for gas
    } catch (error) {
      console.error('Error calculating fees:', error);
    }
  };

  const handleInputChange = (field: keyof MintFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'image' | 'metadata', file: File) => {
    if (field === 'image') {
      if (file.type.startsWith('image/')) {
        handleInputChange('image', file);
      } else {
        alert('Please select a valid image file');
      }
    } else {
      handleInputChange('metadata', file);
    }
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      alert('Please enter a name for your NFT');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return false;
    }
    if (!formData.image) {
      alert('Please select an image');
      return false;
    }
    if (parseFloat(formData.price) < 0) {
      alert('Price must be non-negative');
      return false;
    }
    if (formData.supply < 1) {
      alert('Supply must be at least 1');
      return false;
    }
    return true;
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    // Mock IPFS upload - in real implementation, this would use IPFS
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`ipfs://${Math.random().toString(36).substring(2)}`);
      }, 1000);
    });
  };

  const mintNFT = async () => {
    if (!isConnected || !provider) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMintProgress(0);

    try {
      // Step 1: Upload image to IPFS
      setMintProgress(10);
      const imageHash = await uploadToIPFS(formData.image!);
      
      // Step 2: Create metadata
      setMintProgress(30);
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageHash,
        category: formData.category,
        rarity: formData.rarity,
        attributes: formData.attributes.filter(attr => attr.trait_type && attr.value),
        farmData: formData.farmData,
        external_url: `https://agroisync.com/nft/${Date.now()}`,
        animation_url: formData.metadata ? await uploadToIPFS(formData.metadata) : undefined
      };

      // Step 3: Upload metadata to IPFS
      setMintProgress(50);
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
      const metadataHash = await uploadToIPFS(metadataFile);

      // Step 4: Mint NFT on blockchain
      setMintProgress(70);
      const tokenId = await mintOnBlockchain(metadataHash, formData.supply);

      // Step 5: Complete
      setMintProgress(100);
      
      onMintSuccess?.(tokenId);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Farm Land',
        rarity: 'Common',
        attributes: [],
        image: null,
        metadata: null,
        price: '0',
        supply: 1
      });
      setPreviewUrl('');

    } catch (error) {
      console.error('Minting error:', error);
      onMintError?.(error instanceof Error ? error.message : 'Minting failed');
    } finally {
      setIsLoading(false);
      setMintProgress(0);
    }
  };

  const mintOnBlockchain = async (metadataHash: string, supply: number): Promise<string> => {
    // Mock blockchain minting - in real implementation, this would call smart contract
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`AGROTM-${Date.now()}-${Math.random().toString(36).substring(2)}`);
      }, 2000);
    });
  };

  const handleFarmDataChange = (field: keyof MintFormData['farmData'], value: string) => {
    setFormData(prev => ({
      ...prev,
      farmData: {
        ...prev.farmData,
        [field]: value
      } as MintFormData['farmData']
    }));
  };

  return (
    <div className={`nft-mint-form ${className}`}>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mint New NFT</h2>
          <p className="text-gray-600">Create and mint your agricultural NFT on AGROTM</p>
        </div>

        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Please connect your wallet to mint NFTs</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); mintNFT(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <Input
                label="NFT Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter NFT name"
                required
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your NFT"
                rows={4}
                required
              />

              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                options={NFT_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
              />

              <Select
                label="Rarity"
                value={formData.rarity}
                onChange={(e) => handleInputChange('rarity', e.target.value)}
                options={RARITY_LEVELS.map(rarity => ({ value: rarity, label: rarity }))}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NFT Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('image', e.target.files?.[0]!)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="absolute top-2 right-2"
                  >
                    View Full
                  </Button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata File (Optional)
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileChange('metadata', e.target.files?.[0]!)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Farm Data (for agricultural NFTs) */}
          {formData.category.includes('Farm') && (
                    <div className="mt-6 p-4 bg-[#00FF00]/10 border border-[#00FF00]/20 rounded-lg">
          <h3 className="text-lg font-semibold text-[#00FF00] mb-4">Farm Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={formData.farmData?.location || ''}
                  onChange={(e) => handleFarmDataChange('location', e.target.value)}
                  placeholder="Farm location"
                />
                <Input
                  label="Crop Type"
                  value={formData.farmData?.cropType || ''}
                  onChange={(e) => handleFarmDataChange('cropType', e.target.value)}
                  placeholder="Type of crop"
                />
                <Input
                  label="Harvest Date"
                  type="date"
                  value={formData.farmData?.harvestDate || ''}
                  onChange={(e) => handleFarmDataChange('harvestDate', e.target.value)}
                />
                <Input
                  label="Expected Yield"
                  value={formData.farmData?.yield || ''}
                  onChange={(e) => handleFarmDataChange('yield', e.target.value)}
                  placeholder="Expected yield (tons)"
                />
                <Input
                  label="Quality Grade"
                  value={formData.farmData?.quality || ''}
                  onChange={(e) => handleFarmDataChange('quality', e.target.value)}
                  placeholder="A, B, C, etc."
                />
              </div>
            </div>
          )}

          {/* Attributes */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attributes</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttribute}
              >
                Add Attribute
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.attributes.map((attr, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    placeholder="Trait name"
                    className="flex-1"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    placeholder="Trait value"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttribute(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing and Supply */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price (ETH)"
              type="number"
              step="0.001"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.0"
            />

            <Input
              label="Supply"
              type="number"
              min="1"
              max="10000"
              value={formData.supply}
              onChange={(e) => handleInputChange('supply', parseInt(e.target.value))}
              placeholder="1"
            />
          </div>

          {/* Fee Information */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mint Fee:</span>
                <span className="font-semibold">{mintFee} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Gas:</span>
                <span className="font-semibold">{gasEstimate} ETH</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-900 font-semibold">Total:</span>
                <span className="text-gray-900 font-bold">
                  {(parseFloat(mintFee) + parseFloat(gasEstimate)).toFixed(4)} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Mint Progress */}
          {isLoading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Minting Progress</span>
                <span>{mintProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mintProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={!isConnected || isLoading}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Minting...' : 'Mint NFT'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <Modal onClose={() => setShowPreview(false)}>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">NFT Preview</h3>
              <img
                src={previewUrl}
                alt="NFT Preview"
                className="w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NFTMintForm; 