import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  totalStaked: number;
  maxStake: number;
  minStake: number;
  lockPeriod: number;
  rewards: number;
  status: 'active' | 'paused' | 'closed';
}

interface StakingPosition {
  id: string;
  poolId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  rewards: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface UseStakingDataReturn {
  pools: StakingPool[];
  positions: StakingPosition[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPoolById: (id: string) => StakingPool | undefined;
  getPositionsByPool: (poolId: string) => StakingPosition[];
}

export const useStakingData = (): UseStakingDataReturn => {
  const { publicKey, isConnected } = useWeb3();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (connected && publicKey) {
        // Mock data for now - in production this would fetch from blockchain
        const mockPools: StakingPool[] = [
          {
            id: 'pool_1',
            name: 'AGRO Farm Pool',
            token: 'AGRO',
            apy: 12.5,
            totalStaked: 1000000,
            maxStake: 100000,
            minStake: 100,
            lockPeriod: 30,
            rewards: 50000,
            status: 'active'
          },
          {
            id: 'pool_2',
            name: 'Crop Token Pool',
            token: 'CROP',
            apy: 8.2,
            totalStaked: 750000,
            maxStake: 50000,
            minStake: 50,
            lockPeriod: 15,
            rewards: 25000,
            status: 'active'
          }
        ];

        const mockPositions: StakingPosition[] = [
          {
            id: 'pos_1',
            poolId: 'pool_1',
            amount: 5000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            rewards: 250,
            status: 'active'
          }
        ];

        setPools(mockPools);
        setPositions(mockPositions);
      } else {
        setPools([]);
        setPositions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de staking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingData();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchStakingData();
  };

  const getPoolById = (id: string): StakingPool | undefined => {
    return pools.find(pool => pool.id === id);
  };

  const getPositionsByPool = (poolId: string): StakingPosition[] => {
    return positions.filter(position => position.poolId === poolId);
  };

  return {
    pools,
    positions,
    loading,
    error,
    refetch,
    getPoolById,
    getPositionsByPool
  };
};
