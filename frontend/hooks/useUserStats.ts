import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { logger } from '../utils/logger';

interface UserStats {
  totalTransactions: number;
  totalVolume: number;
  averageTransaction: number;
  joinDate: string;
  lastActivity: string;
  nftCount: number;
  stakedAmount: number;
  rewardsEarned: number;
}

interface UserActivity {
  id: string;
  type: 'stake' | 'unstake' | 'buy' | 'sell' | 'mint' | 'transfer';
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export const useUserStats = () => {
  const { isConnected, publicKey } = useWeb3();
  const [stats, setStats] = useState<UserStats>({
    totalTransactions: 0,
    totalVolume: 0,
    averageTransaction: 0,
    joinDate: '',
    lastActivity: '',
    nftCount: 0,
    stakedAmount: 0,
    rewardsEarned: 0
  });
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setStats({
        totalTransactions: 0,
        totalVolume: 0,
        averageTransaction: 0,
        joinDate: '',
        lastActivity: '',
        nftCount: 0,
        stakedAmount: 0,
        rewardsEarned: 0
      });
      setActivities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock user stats
      const mockStats: UserStats = {
        totalTransactions: 45,
        totalVolume: 125000,
        averageTransaction: 2777.78,
        joinDate: '2024-01-15',
        lastActivity: '2024-03-20',
        nftCount: 8,
        stakedAmount: 5000,
        rewardsEarned: 250
      };

      const mockActivities: UserActivity[] = [
        {
          id: '1',
          type: 'stake',
          amount: 1000,
          timestamp: '2024-03-20T10:30:00Z',
          status: 'completed'
        },
        {
          id: '2',
          type: 'buy',
          amount: 500,
          timestamp: '2024-03-19T15:45:00Z',
          status: 'completed'
        },
        {
          id: '3',
          type: 'mint',
          amount: 200,
          timestamp: '2024-03-18T09:15:00Z',
          status: 'completed'
        },
        {
          id: '4',
          type: 'unstake',
          amount: 300,
          timestamp: '2024-03-17T14:20:00Z',
          status: 'completed'
        },
        {
          id: '5',
          type: 'sell',
          amount: 750,
          timestamp: '2024-03-16T11:30:00Z',
          status: 'completed'
        }
      ];

      setStats(mockStats);
      setActivities(mockActivities);

      logger.info('User stats fetched successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user stats';
      setError(errorMessage);
      logger.error('Failed to fetch user stats:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    activities,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Função para obter estatísticas de usuários (para uso em summary-export)
 * @returns Promise com estatísticas de usuários
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await fetch('/api/users/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    throw error;
  }
};

export default useUserStats;