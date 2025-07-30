import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Interface para estatísticas de staking
interface StakingStats {
  totalStaked: number;
  totalStakers: number;
  averageAPY: number;
  stakingGrowth: number;
  totalValueLocked: number;
  activePools: number;
  monthlyRewards: number;
  weeklyGrowth: number;
}

// Interface para retorno do hook
interface UseStakingStatsReturn {
  stats: StakingStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Dados mock para demonstração
const mockStats: StakingStats = {
  totalStaked: 15750000,
  totalStakers: 8420,
  averageAPY: 15.2,
  stakingGrowth: 12.8,
  totalValueLocked: 18500000,
  activePools: 6,
  monthlyRewards: 245000,
  weeklyGrowth: 2.3
};

/**
 * Hook para buscar estatísticas de staking
 * @returns Objeto com estatísticas, estado de loading, erro e função de refetch
 */
export const useStakingStats = (): UseStakingStatsReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState<StakingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakingStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));

      if (connected && publicKey) {
        // In a real implementation, you would fetch stats from blockchain
        // For now, we'll use mock data with some randomization
        const randomizedStats = {
          ...mockStats,
          totalStaked: mockStats.totalStaked + Math.floor(Math.random() * 2000000 - 1000000),
          stakingGrowth: mockStats.stakingGrowth + (Math.random() * 5 - 2.5),
          weeklyGrowth: mockStats.weeklyGrowth + (Math.random() * 2 - 1)
        };
        
        setStats(randomizedStats);
      } else {
        setStats(mockStats); // Return mock data even when not connected for demo
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas de staking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingStats();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchStakingStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

/**
 * Função para obter estatísticas de staking (para uso em summary-export)
 * @returns Promise com estatísticas de staking
 */
export const getStakingStats = async (): Promise<StakingStats> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    ...mockStats,
    totalStaked: mockStats.totalStaked + Math.floor(Math.random() * 2000000 - 1000000),
    stakingGrowth: mockStats.stakingGrowth + (Math.random() * 5 - 2.5),
    weeklyGrowth: mockStats.weeklyGrowth + (Math.random() * 2 - 1)
  };
};

export default useStakingStats;