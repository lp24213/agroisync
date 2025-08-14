import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface StakingHistoryEntry {
  id: string;
  poolId: string;
  poolName: string;
  action: 'stake' | 'unstake' | 'claim_rewards' | 'compound';
  amount: number;
  timestamp: Date;
  transactionHash: string;
  rewards?: number;
  status: 'success' | 'pending' | 'failed';
}

interface StakingHistoryStats {
  totalStaked: number;
  totalUnstaked: number;
  totalRewards: number;
  averageStakeDuration: number;
  totalTransactions: number;
}

interface UseStakingHistoryReturn {
  history: StakingHistoryEntry[];
  stats: StakingHistoryStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getHistoryByPool: (poolId: string) => StakingHistoryEntry[];
  getHistoryByDateRange: (startDate: Date, endDate: Date) => StakingHistoryEntry[];
}

export const useStakingHistory = (): UseStakingHistoryReturn => {
  const { publicKey, isConnected } = useWeb3();
  const [history, setHistory] = useState<StakingHistoryEntry[]>([]);
  const [stats, setStats] = useState<StakingHistoryStats>({
    totalStaked: 0,
    totalUnstaked: 0,
    totalRewards: 0,
    averageStakeDuration: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakingHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (connected && publicKey) {
        // Mock data for now - in production this would fetch from blockchain
        const mockHistory: StakingHistoryEntry[] = [
          {
            id: 'hist_1',
            poolId: 'pool_1',
            poolName: 'AGRO Farm Pool',
            action: 'stake',
            amount: 5000,
            timestamp: new Date('2024-01-01'),
            transactionHash: '0x1234...5678',
            status: 'success'
          },
          {
            id: 'hist_2',
            poolId: 'pool_1',
            poolName: 'AGRO Farm Pool',
            action: 'claim_rewards',
            amount: 0,
            timestamp: new Date('2024-01-15'),
            transactionHash: '0x8765...4321',
            rewards: 250,
            status: 'success'
          },
          {
            id: 'hist_3',
            poolId: 'pool_2',
            poolName: 'Crop Token Pool',
            action: 'stake',
            amount: 2000,
            timestamp: new Date('2024-02-01'),
            transactionHash: '0x9876...5432',
            status: 'success'
          }
        ];

        const mockStats: StakingHistoryStats = {
          totalStaked: 7000,
          totalUnstaked: 0,
          totalRewards: 250,
          averageStakeDuration: 22.5,
          totalTransactions: 3
        };

        setHistory(mockHistory);
        setStats(mockStats);
      } else {
        setHistory([]);
        setStats({
          totalStaked: 0,
          totalUnstaked: 0,
          totalRewards: 0,
          averageStakeDuration: 0,
          totalTransactions: 0
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico de staking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingHistory();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchStakingHistory();
  };

  const getHistoryByPool = (poolId: string): StakingHistoryEntry[] => {
    return history.filter(entry => entry.poolId === poolId);
  };

  const getHistoryByDateRange = (startDate: Date, endDate: Date): StakingHistoryEntry[] => {
    return history.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  };

  return {
    history,
    stats,
    loading,
    error,
    refetch,
    getHistoryByPool,
    getHistoryByDateRange
  };
};
