import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3';
import { NFTMetadata, validateNFTMetadata, createMetadataURI } from './metadata/schema';

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
  const { account, provider, isConnected, chainId } = useWeb3();
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

  // Upload file to IPFS
  const uploadToIPFS = useCallback(async (file: File): Promise<string> => {
    try {
      // In a real implementation, this would use IPFS
      // For now, we'll simulate the upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock IPFS upload
      return new Promise((resolve) => {
        setTimeout(() => {
          const hash = btoa(file.name + Date.now()).substring(0, 46);
          resolve(`ipfs://${hash}`);
        }, 1000);
      });
    } catch (error) {
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

  // Mint NFT on blockchain
  const mintOnBlockchain = useCallback(async (
    metadataURI: string, 
    supply: number, 
    price: string,
    provider: ethers.providers.Web3Provider
  ): Promise<{ tokenId: string; transactionHash: string }> => {
    try {
      const signer = provider.getSigner();
      
      // Mock contract interaction
      // In a real implementation, this would call the actual NFT contract
      const mockContract = {
        mint: async (to: string, tokenURI: string, supply: number, price: string) => {
          // Simulate transaction
          const mockTx = {
            hash: `0x${Math.random().toString(16).substring(2)}`,
            wait: async () => ({
              status: 1,
              blockNumber: Math.floor(Math.random() * 1000000) + 1
            })
          };
          
          return mockTx;
        }
      };

      const tx = await mockContract.mint(account!, metadataURI, supply, price);
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      const tokenId = `AGROTM-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      return {
        tokenId,
        transactionHash: tx.hash
      };
    } catch (error) {
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
      console.error('Error estimating gas:', error);
      return '0';
    }
  }, [calculateFees]);

  // Check if user has enough balance for minting
  const checkBalance = useCallback(async (metadata: NFTMetadata, supply: number): Promise<boolean> => {
    if (!provider || !account) return false;

    try {
      const balance = await provider.getBalance(account);
      const fees = calculateFees(metadata, supply);
      const requiredAmount = ethers.utils.parseEther(fees.mintFee).add(ethers.utils.parseEther(fees.gasEstimate));
      
      return balance.gte(requiredAmount);
    } catch (error) {
      console.error('Error checking balance:', error);
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
      // In a real implementation, this would query the blockchain or API
      // For now, return mock data
      return [
        {
          tokenId: 'AGROTM-1234567890-abc123',
          transactionHash: '0x1234567890abcdef',
          timestamp: Date.now() - 86400000, // 1 day ago
          metadata: {
            name: 'Sample Farm Land',
            description: 'A sample agricultural NFT',
            image: 'ipfs://sample-hash',
            attributes: [],
            category: 'Farm Land',
            rarity: 'Common'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching minting history:', error);
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