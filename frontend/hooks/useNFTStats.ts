import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { logger } from '../utils/logger';

interface NFTStats {
  totalNFTs: number;
  totalValue: number;
  averageValue: number;
  topCollection: string;
  recentMints: number;
  floorPrice: number;
}

interface NFTCollection {
  name: string;
  count: number;
  totalValue: number;
  floorPrice: number;
}

export const useNFTStats = () => {
  const { isConnected, publicKey } = useWeb3();
  const [stats, setStats] = useState<NFTStats>({
    totalNFTs: 0,
    totalValue: 0,
    averageValue: 0,
    topCollection: '',
    recentMints: 0,
    floorPrice: 0
  });
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setStats({
        totalNFTs: 0,
        totalValue: 0,
        averageValue: 0,
        topCollection: '',
        recentMints: 0,
        floorPrice: 0
      });
      setCollections([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock NFT stats
      const mockStats: NFTStats = {
        totalNFTs: 25,
        totalValue: 125000,
        averageValue: 5000,
        topCollection: 'AGRO Farms',
        recentMints: 3,
        floorPrice: 2500
      };

      const mockCollections: NFTCollection[] = [
        {
          name: 'AGRO Farms',
          count: 12,
          totalValue: 75000,
          floorPrice: 3000
        },
        {
          name: 'Crop Tokens',
          count: 8,
          totalValue: 35000,
          floorPrice: 2000
        },
        {
          name: 'Equipment NFTs',
          count: 5,
          totalValue: 15000,
          floorPrice: 1500
        }
      ];

      setStats(mockStats);
      setCollections(mockCollections);

      logger.info('NFT stats fetched successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFT stats';
      setError(errorMessage);
      logger.error('Failed to fetch NFT stats:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    collections,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Função para obter estatísticas de NFTs (para uso em summary-export)
 * @returns Promise com estatísticas de NFTs
 */
export const getNFTStats = async (): Promise<NFTStats> => {
  try {
    const response = await fetch('/api/nft/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch NFT stats');
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    logger.error('Error fetching NFT stats:', error);
    throw error;
  }
};