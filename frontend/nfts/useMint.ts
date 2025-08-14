import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3Hook } from '../hooks/useWeb3';
import { NFTMetadata, validateNFTMetadata, createMetadataURI } from './metadata/schema';

// Mock logger for development
const logger = {
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data),
  error: (message: string, data?: any) => console.error(`[ERROR] ${message}`, data),
  warn: (message: string, data?: any) => console.warn(`[WARN] ${message}`, data)
};

interface MintState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  tokenId: string | null;
  transactionHash: string | null;
  gasEstimate: string;
  mintFee: string;
}

interface MintOptions {
  metadata: NFTMetadata;
  supply: number;
  price: string;
  onSuccess?: (tokenId: string, txHash: string) => void;
  onError?: (error: string) => void;
}

interface MintProgress {
  step: 'preparing' | 'uploading' | 'minting' | 'confirming' | 'complete';
  progress: number;
  message: string;
}

export const useMint = () => {
  const { publicKey: account, isConnected } = useWeb3Hook();
  const provider = null; // Mock provider for development
  const chainId = 1; // Mock chain ID for development
  const [mintState, setMintState] = useState<MintState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    tokenId: null,
    transactionHash: null,
    gasEstimate: '0',
    mintFee: '0'
  });

  const [mintProgress, setMintProgress] = useState<MintProgress>({
    step: 'preparing',
    progress: 0,
    message: 'Preparing mint...'
  });

  // Calculate fees based on metadata and supply
  const calculateFees = useCallback((metadata: NFTMetadata, supply: number) => {
    const baseFee = 0.01; // 0.01 ETH base fee
    const rarityMultiplier = {
      'Common': 1,
      'Uncommon': 1.5,
      'Rare': 2,
      'Epic': 3,
      'Legendary': 5,
      'Mythic': 10
    };
    
    const supplyMultiplier = supply > 1 ? 1.2 : 1;
    const categoryMultiplier = metadata.category === 'Farm Land' ? 2 : 1;
    
    const totalFee = baseFee * 
      rarityMultiplier[metadata.rarity as keyof typeof rarityMultiplier] * 
      supplyMultiplier * 
      categoryMultiplier;
    
    const gasEstimate = totalFee * 0.1; // 10% of mint fee for gas
    
    return {
      mintFee: totalFee.toFixed(4),
      gasEstimate: gasEstimate.toFixed(4)
    };
  }, []);

  // Upload file to IPFS with premium features
  const uploadToIPFS = useCallback(async (file: File): Promise<string> => {
    try {
      // Validate file size and type
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please use JPEG, PNG, GIF, or WebP');
      }

      // Create form data for IPFS upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pin', 'true');
      formData.append('metadata', JSON.stringify({
        name: file.name,
        description: 'AGROTM NFT Asset',
        created: new Date().toISOString()
      }));

      // Upload to multiple IPFS gateways for redundancy
      const gateways = [
        'https://ipfs.infura.io:5001/api/v0/add',
        'https://ipfs.pinata.cloud/api/v1/pinFileToIPFS',
        'https://api.web3.storage/upload'
      ];

      const uploadPromises = gateways.map(async (gateway) => {
        try {
          const response = await fetch(gateway, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_IPFS_API_KEY || ''}`
            }
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();
          return result.Hash || result.cid || result.ipfsHash;
        } catch (error) {
          logger.error(`IPFS upload failed for gateway ${gateway}`, error);
          return null;
        }
      });

      // Wait for at least one successful upload
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<string> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      if (successfulUploads.length === 0) {
        throw new Error('All IPFS upload attempts failed');
      }

      // Return the first successful hash
      const ipfsHash = successfulUploads[0];
      logger.info('File uploaded to IPFS successfully', { hash: ipfsHash, fileName: file.name });
      
      return `ipfs://${ipfsHash}`;
    } catch (error) {
      logger.error('IPFS upload failed', { error, fileName: file.name });
      throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Upload metadata to IPFS
  const uploadMetadata = useCallback(async (metadata: NFTMetadata): Promise<string> => {
    try {
      const metadataString = JSON.stringify(metadata, null, 2);
      const metadataBlob = new Blob([metadataString], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
      
      return await uploadToIPFS(metadataFile);
    } catch (error) {
      throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [uploadToIPFS]);

  // Mint NFT on blockchain with premium features
  const mintOnBlockchain = useCallback(async (
    metadataURI: string, 
    supply: number, 
    price: string,
    provider: null // Mock provider for development
  ): Promise<{ tokenId: string; transactionHash: string }> => {
    try {
      const signer = null; // Mock signer for development
      
      // Get contract instance
      const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('NFT contract address not configured');
      }

      // Import contract ABI
      const contractABI = [
        'function mint(address to, string memory tokenURI, uint256 supply, uint256 price) external returns (uint256)',
        'function tokenURI(uint256 tokenId) external view returns (string memory)',
        'function ownerOf(uint256 tokenId) external view returns (address)',
        'function totalSupply() external view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        'event Minted(address indexed to, uint256 indexed tokenId, string tokenURI)'
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Estimate gas before minting (mock for development)
      const gasEstimate = '100000'; // Mock gas estimate
              const gasPrice = ethers.parseUnits('20', 'gwei'); // Mock gas price
      
      // Add 20% buffer for gas estimation
              const gasLimit = '120000'; // Mock gas limit

      // Prepare transaction (mock for development)
      const mintTx = {
        wait: async () => ({ events: [] })
      };

      // Wait for transaction confirmation
      const receipt = await mintTx.wait(); // Wait for confirmation
      
      // Mock successful mint for development
      const tokenId = `AGROTM-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      // Log successful mint
      logger.info('NFT minted successfully', {
        tokenId,
        transactionHash: 'mock-transaction-hash',
        metadataURI,
        supply,
        price,
        gasUsed: '100000',
        blockNumber: 12345
      });

      // Emit analytics event (mock for development)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'nft_minted', {
          token_id: tokenId,
          transaction_hash: 'mock-transaction-hash',
          supply: supply,
          price: price,
          gas_used: '100000'
        });
      }
      
      return {
        tokenId,
        transactionHash: 'mock-transaction-hash'
      };
    } catch (error) {
      logger.error('Blockchain minting failed', { error, metadataURI, supply, price });
      throw new Error(`Blockchain minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [account]);

  // Main mint function
  const mint = useCallback(async (options: MintOptions) => {
    if (!isConnected || !provider || !account) {
      throw new Error('Wallet not connected');
    }

    // Validate metadata
    const validation = validateNFTMetadata(options.metadata);
    if (!validation.isValid) {
      throw new Error(`Invalid metadata: ${validation.errors.join(', ')}`);
    }

    setMintState(prev => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null
    }));

    setMintProgress({
      step: 'preparing',
      progress: 0,
      message: 'Preparing mint...'
    });

    try {
      // Step 1: Calculate fees
      setMintProgress({
        step: 'preparing',
        progress: 10,
        message: 'Calculating fees...'
      });

      const fees = calculateFees(options.metadata, options.supply);
      setMintState(prev => ({
        ...prev,
        gasEstimate: fees.gasEstimate,
        mintFee: fees.mintFee
      }));

      // Step 2: Upload image if it's a file
      setMintProgress({
        step: 'uploading',
        progress: 20,
        message: 'Uploading image...'
      });

      let imageURI = options.metadata.image;
      if (imageURI.startsWith('blob:') || imageURI.startsWith('data:')) {
        // Convert blob/data URL to file and upload
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const file = new File([blob], 'nft-image.png', { type: blob.type });
        imageURI = await uploadToIPFS(file);
      }

      // Step 3: Update metadata with image URI
      setMintProgress({
        step: 'uploading',
        progress: 40,
        message: 'Preparing metadata...'
      });

      const updatedMetadata = {
        ...options.metadata,
        image: imageURI,
        tokenId: undefined, // Will be set after minting
        contractAddress: undefined, // Will be set after minting
        creator: account,
        createdAt: new Date().toISOString()
      };

      // Step 4: Upload metadata to IPFS
      setMintProgress({
        step: 'uploading',
        progress: 60,
        message: 'Uploading metadata...'
      });

      const metadataURI = await uploadMetadata(updatedMetadata);

      // Step 5: Mint on blockchain
      setMintProgress({
        step: 'minting',
        progress: 80,
        message: 'Minting on blockchain...'
      });

      const { tokenId, transactionHash } = await mintOnBlockchain(
        metadataURI,
        options.supply,
        options.price,
        provider
      );

      // Step 6: Confirm transaction
      setMintProgress({
        step: 'confirming',
        progress: 90,
        message: 'Confirming transaction...'
      });

      // Step 7: Complete
      setMintProgress({
        step: 'complete',
        progress: 100,
        message: 'Mint completed successfully!'
      });

      setMintState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: true,
        tokenId,
        transactionHash
      }));

      options.onSuccess?.(tokenId, transactionHash);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Minting failed';
      
      setMintState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage
      }));

      setMintProgress({
        step: 'preparing',
        progress: 0,
        message: 'Mint failed'
      });

      options.onError?.(errorMessage);
    }
  }, [isConnected, provider, account, calculateFees, uploadToIPFS, uploadMetadata, mintOnBlockchain]);

  // Reset mint state
  const reset = useCallback(() => {
    setMintState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      tokenId: null,
      transactionHash: null,
      gasEstimate: '0',
      mintFee: '0'
    });

    setMintProgress({
      step: 'preparing',
      progress: 0,
      message: 'Preparing mint...'
    });
  }, []);

  // Batch mint function
  const batchMint = useCallback(async (
    items: Array<{ metadata: NFTMetadata; supply: number; price: string }>,
    onProgress?: (completed: number, total: number) => void
  ) => {
    const results = [];
    let completed = 0;

    for (const item of items) {
      try {
        await mint({
          ...item,
          onSuccess: (tokenId, txHash) => {
            results.push({ success: true, tokenId, txHash, metadata: item.metadata });
            completed++;
            onProgress?.(completed, items.length);
          },
          onError: (error) => {
            results.push({ success: false, error, metadata: item.metadata });
            completed++;
            onProgress?.(completed, items.length);
          }
        });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: item.metadata 
        });
        completed++;
        onProgress?.(completed, items.length);
      }
    }

    return results;
  }, [mint]);

  // Estimate gas for minting
  const estimateGas = useCallback(async (metadata: NFTMetadata, supply: number): Promise<string> => {
    try {
      const fees = calculateFees(metadata, supply);
      return fees.gasEstimate;
    } catch (error) {
      logger.error('Error estimating gas:', error);
      return '0';
    }
  }, [calculateFees]);

  // Check if user has enough balance for minting
  const checkBalance = useCallback(async (metadata: NFTMetadata, supply: number): Promise<boolean> => {
    if (!account) return false;

    try {
      // Mock balance check for development
      const balance = ethers.parseEther('1.0'); // Mock 1 ETH balance
      const fees = calculateFees(metadata, supply);
      const requiredAmount = ethers.parseEther(fees.mintFee) + ethers.parseEther(fees.gasEstimate);
      
      return balance >= requiredAmount;
    } catch (error) {
      logger.error('Error checking balance:', error);
      return false;
    }
  }, [provider, account, calculateFees]);

  // Get minting history for the connected wallet
  const getMintingHistory = useCallback(async (): Promise<Array<{
    tokenId: string;
    transactionHash: string;
    timestamp: number;
    metadata: NFTMetadata;
  }>> => {
    if (!account) return [];

    try {
      // Mock minting history for development
      const events: any[] = [];
      
      return events.map((event: any) => ({
        tokenId: event.transactionHash || '',
        transactionHash: event.transactionHash,
        timestamp: Date.now(),
        metadata: JSON.parse('{}')
      }));
    } catch (error) {
      logger.error('Error fetching minting history:', error);
      return [];
    }
  }, [account]);

  return {
    // State
    ...mintState,
    mintProgress,
    
    // Actions
    mint,
    batchMint,
    reset,
    estimateGas,
    checkBalance,
    getMintingHistory,
    
    // Utilities
    calculateFees,
    uploadToIPFS,
    uploadMetadata
  };
}; 