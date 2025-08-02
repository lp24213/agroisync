import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { logger } from '../utils/logger';

interface StakingStats {
  totalStaked: number;
  totalRewards: number;
  averageAPR: number;
  activeStakers: number;
  totalPools: number;
  userStaked: number;
  userRewards: number;
  userAPR: number;
}

interface StakingPool {
  id: string;
  name: string;
  apr: number;
  totalStaked: number;
  userStaked: number;
  rewards: number;
  lockPeriod: number;
}

export const useStakingStats = () => {
  const { isConnected, publicKey } = useWeb3();
  const [stats, setStats] = useState<StakingStats>({
    totalStaked: 0,
    totalRewards: 0,
    averageAPR: 0,
    activeStakers: 0,
    totalPools: 0,
    userStaked: 0,
    userRewards: 0,
    userAPR: 0
  });
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setStats({
        totalStaked: 0,
        totalRewards: 0,
        averageAPR: 0,
        activeStakers: 0,
        totalPools: 0,
        userStaked: 0,
        userRewards: 0,
        userAPR: 0
      });
      setPools([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock staking stats
      const mockStats: StakingStats = {
        totalStaked: 5000000,
        totalRewards: 250000,
        averageAPR: 15.5,
        activeStakers: 1250,
        totalPools: 3,
        userStaked: 5000,
        userRewards: 250,
        userAPR: 12.5
      };

      const mockPools: StakingPool[] = [
        {
          id: 'pool-1',
          name: 'AGRO Token Pool',
          apr: 12.5,
          totalStaked: 2000000,
          userStaked: 3000,
          rewards: 150,
          lockPeriod: 30
        },
        {
          id: 'pool-2',
          name: 'Liquidity Pool',
          apr: 18.2,
          totalStaked: 1500000,
          userStaked: 1500,
          rewards: 75,
          lockPeriod: 60
        },
        {
          id: 'pool-3',
          name: 'Governance Pool',
          apr: 20.0,
          totalStaked: 1500000,
          userStaked: 500,
          rewards: 25,
          lockPeriod: 90
        }
      ];

      setStats(mockStats);
      setPools(mockPools);

      logger.info('Staking stats fetched successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staking stats';
      setError(errorMessage);
      logger.error('Failed to fetch staking stats:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    pools,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Função para obter estatísticas de staking (para uso em summary-export)
 * @returns Promise com estatísticas de staking
 */
export const getStakingStats = async (): Promise<StakingStats> => {
  try {
    const response = await fetch('/api/staking/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch staking stats');
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    logger.error('Error fetching staking stats:', error);
    throw error;
  }
};

export default useStakingStats;