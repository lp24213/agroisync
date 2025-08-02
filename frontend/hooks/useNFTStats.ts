import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface NFTStats {
  totalNFTs: number;
  totalValue: number;
  averageValue: number;
  farmCount: number;
  machineryCount: number;
  grainLotsCount: number;
  certificatesCount: number;
  farmValue: number;
  machineryValue: number;
  grainLotsValue: number;
  certificatesValue: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
  topPerformers: Array<{
    id: string;
    name: string;
    type: string;
    value: number;
    growth: number;
  }>;
}

interface UseNFTStatsReturn {
  stats: NFTStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock stats data
const mockStats: NFTStats = {
  totalNFTs: 156,
  totalValue: 12450000,
  averageValue: 79807,
  farmCount: 45,
  machineryCount: 32,
  grainLotsCount: 67,
  certificatesCount: 12,
  farmValue: 8500000,
  machineryValue: 2800000,
  grainLotsValue: 950000,
  certificatesValue: 200000,
  monthlyGrowth: 12.5,
  weeklyGrowth: 3.2,
  topPerformers: [
    {
      id: '1',
      name: 'Fazenda São João',
      type: 'Fazenda',
      value: 2500000,
      growth: 15.2
    },
    {
      id: '2',
      name: 'Trator John Deere 8R',
      type: 'Maquinário',
      value: 850000,
      growth: 8.7
    },
    {
      id: '3',
      name: 'Fazenda Vista Alegre',
      type: 'Fazenda',
      value: 1800000,
      growth: 11.3
    },
    {
      id: '4',
      name: 'Colheitadeira Case IH',
      type: 'Maquinário',
      value: 950000,
      growth: 6.8
    },
    {
      id: '5',
      name: 'Lote de Soja Premium',
      type: 'Lote de Grãos',
      value: 75000,
      growth: 22.1
    }
  ]
};

export const useNFTStats = (): UseNFTStatsReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState<NFTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (connected && publicKey) {
        // Fetch real NFT stats from blockchain
        const response = await fetch(`/api/nft/stats?address=${publicKey.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch NFT stats');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } else {
        setStats(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTStats();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchNFTStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
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