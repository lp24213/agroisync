import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface StakingReward {
  id: string;
  poolId: string;
  poolName: string;
  amount: number;
  timestamp: Date;
  type: 'daily' | 'weekly' | 'monthly' | 'compound';
  status: 'pending' | 'claimed' | 'compounded';
  transactionHash?: string;
}

interface RewardsSummary {
  totalEarned: number;
  totalClaimed: number;
  totalCompounded: number;
  pendingRewards: number;
  averageDailyReward: number;
  estimatedMonthlyReward: number;
  estimatedYearlyReward: number;
}

interface UseStakingRewardsReturn {
  rewards: StakingReward[];
  summary: RewardsSummary;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  claimRewards: (poolId: string) => Promise<boolean>;
  compoundRewards: (poolId: string) => Promise<boolean>;
  getRewardsByPool: (poolId: string) => StakingReward[];
  getRewardsByDateRange: (startDate: Date, endDate: Date) => StakingReward[];
}

export const useStakingRewards = (): UseStakingRewardsReturn => {
  const { publicKey, isConnected } = useWeb3();
  const [rewards, setRewards] = useState<StakingReward[]>([]);
  const [summary, setSummary] = useState<RewardsSummary>({
    totalEarned: 0,
    totalClaimed: 0,
    totalCompounded: 0,
    pendingRewards: 0,
    averageDailyReward: 0,
    estimatedMonthlyReward: 0,
    estimatedYearlyReward: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakingRewards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (connected && publicKey) {
        // Mock data for now - in production this would fetch from blockchain
        const mockRewards: StakingReward[] = [
          {
            id: 'reward_1',
            poolId: 'pool_1',
            poolName: 'AGRO Farm Pool',
            amount: 25.5,
            timestamp: new Date('2024-01-15'),
            type: 'daily',
            status: 'claimed',
            transactionHash: '0x1234...5678'
          },
          {
            id: 'reward_2',
            poolId: 'pool_1',
            poolName: 'AGRO Farm Pool',
            amount: 30.2,
            timestamp: new Date('2024-01-16'),
            type: 'daily',
            status: 'pending'
          },
          {
            id: 'reward_3',
            poolId: 'pool_2',
            poolName: 'Crop Token Pool',
            amount: 15.8,
            timestamp: new Date('2024-02-01'),
            type: 'weekly',
            status: 'compounded'
          }
        ];

        const mockSummary: RewardsSummary = {
          totalEarned: 71.5,
          totalClaimed: 25.5,
          totalCompounded: 15.8,
          pendingRewards: 30.2,
          averageDailyReward: 2.38,
          estimatedMonthlyReward: 71.4,
          estimatedYearlyReward: 856.8
        };

        setRewards(mockRewards);
        setSummary(mockSummary);
      } else {
        setRewards([]);
        setSummary({
          totalEarned: 0,
          totalClaimed: 0,
          totalCompounded: 0,
          pendingRewards: 0,
          averageDailyReward: 0,
          estimatedMonthlyReward: 0,
          estimatedYearlyReward: 0
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar recompensas de staking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingRewards();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchStakingRewards();
  };

  const claimRewards = async (poolId: string): Promise<boolean> => {
    try {
      // Simulate claiming rewards
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setRewards(prev => prev.map(reward => 
        reward.poolId === poolId && reward.status === 'pending'
          ? { ...reward, status: 'claimed' as const }
          : reward
      ));
      
      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return false;
    }
  };

  const compoundRewards = async (poolId: string): Promise<boolean> => {
    try {
      // Simulate compounding rewards
      await new Promise(resolve => setTimeout(resolve => resolve, 2000));
      
      // Update local state
      setRewards(prev => prev.map(reward => 
        reward.poolId === poolId && reward.status === 'pending'
          ? { ...reward, status: 'compounded' as const }
          : reward
      ));
      
      return true;
    } catch (error) {
      console.error('Error compounding rewards:', error);
      return false;
    }
  };

  const getRewardsByPool = (poolId: string): StakingReward[] => {
    return rewards.filter(reward => reward.poolId === poolId);
  };

  const getRewardsByDateRange = (startDate: Date, endDate: Date): StakingReward[] => {
    return rewards.filter(reward => 
      reward.timestamp >= startDate && reward.timestamp <= endDate
    );
  };

  return {
    rewards,
    summary,
    loading,
    error,
    refetch,
    claimRewards,
    compoundRewards,
    getRewardsByPool,
    getRewardsByDateRange
  };
};
