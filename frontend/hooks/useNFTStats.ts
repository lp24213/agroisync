import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { logger } from '../utils/logger';

interface NFTStats {
  totalNFTs: number;
  totalValue: number;
  recentMints: number;
  averageValue: number;
  totalVolume: number;
  growthRate: number;
}

interface NFTCollection {
  id: string;
  name: string;
  type: string;
  count: number;
  totalValue: number;
  averageValue: number;
}

interface UseNFTStatsReturn {
  stats: NFTStats;
  collections: NFTCollection[];
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
  getStatsByPeriod: (period: '7d' | '30d' | '90d' | '1y') => Promise<NFTStats>;
}

const useNFTStats = (): UseNFTStatsReturn => {
  const [stats, setStats] = useState<NFTStats>({
    totalNFTs: 0,
    totalValue: 0,
    recentMints: 0,
    averageValue: 0,
    totalVolume: 0,
    growthRate: 0
  });

  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mock para demonstração
  const mockStats: NFTStats = {
    totalNFTs: 1500,
    totalValue: 125000000,
    recentMints: 47,
    averageValue: 83333,
    totalVolume: 25000000,
    growthRate: 12.5
  };

  const mockCollections: NFTCollection[] = [
    {
      id: '1',
      name: 'Fazendas Premium',
      type: 'Fazenda',
      count: 120,
      totalValue: 75000000,
      averageValue: 625000
    },
    {
      id: '2',
      name: 'Maquinário Agrícola',
      type: 'Maquinário',
      count: 350,
      totalValue: 25000000,
      averageValue: 71429
    },
    {
      id: '3',
      name: 'Lotes de Grãos',
      type: 'Lote de Grãos',
      count: 580,
      totalValue: 15000000,
      averageValue: 25862
    },
    {
      id: '4',
      name: 'Certificados Agrícolas',
      type: 'Certificado',
      count: 450,
      totalValue: 10000000,
      averageValue: 22222
    }
  ];

  // Simular carregamento de dados
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/nft/stats');
      // const data = await response.json();

      setStats(mockStats);
      setCollections(mockCollections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas por período
  const getStatsByPeriod = useCallback(async (period: '7d' | '30d' | '90d' | '1y'): Promise<NFTStats> => {
    try {
      // Simular dados diferentes por período
      const periodMultipliers = {
        '7d': { value: 0.8, growth: 0.6 },
        '30d': { value: 1.0, growth: 1.0 },
        '90d': { value: 1.2, growth: 1.3 },
        '1y': { value: 1.5, growth: 1.8 }
      };

      const multiplier = periodMultipliers[period];
      
      return {
        ...mockStats,
        totalValue: Math.round(mockStats.totalValue * multiplier.value),
        growthRate: mockStats.growthRate * multiplier.growth
      };
    } catch (err) {
      console.error('Erro ao carregar estatísticas por período:', err);
      throw err;
    }
  }, []);

  // Função para atualizar estatísticas
  const refreshStats = useCallback(() => {
    loadStats();
  }, [loadStats]);

  // Carregar dados iniciais
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Simular atualizações em tempo real (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      // Em produção, aqui seria uma verificação de novas transações
      // ou um webhook para atualizações em tempo real
      if (!loading) {
        setStats(prev => ({
          ...prev,
          recentMints: prev.recentMints + Math.floor(Math.random() * 3),
          totalValue: prev.totalValue + Math.floor(Math.random() * 100000)
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading]);

  return {
    stats,
    collections,
    loading,
    error,
    refreshStats,
    getStatsByPeriod
  };
};

export default useNFTStats;

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