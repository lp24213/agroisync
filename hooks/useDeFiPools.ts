'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';

interface Pool {
  id: string;
  name: string;
  address: string;
  token0: string;
  token1: string;
  apr: number;
  tvl: number;
  userStaked: number;
  userRewards: number;
  isActive: boolean;
  lockPeriod: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  minStake: number;
  maxStake: number;
  description: string;
  isVerified: boolean;
}

interface PoolsState {
  pools: Pool[];
  loading: boolean;
  error: string | null;
}

export function useDeFiPools() {
  const { isConnected, publicKey } = useWeb3();
  const [state, setState] = useState<PoolsState>({
    pools: [],
    loading: true,
    error: null,
  });

  const fetchPools = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulação de API - substitua por integração real
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockPools: Pool[] = [
        {
          id: '1',
          name: 'AGRO/USDC',
          address: 'AGROUSDCpools111111111111111111111111111111111',
          token0: 'AGRO',
          token1: 'USDC',
          apr: 24.5,
          tvl: 5000000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 30,
          riskLevel: 'High',
          minStake: 100,
          maxStake: 10000,
          description: 'A high-risk, high-reward pool for experienced traders.',
          isVerified: true,
        },
        {
          id: '2',
          name: 'AGRO/SOL',
          address: 'AGROSOLpools222222222222222222222222222222222',
          token0: 'AGRO',
          token1: 'SOL',
          apr: 18.3,
          tvl: 7500000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 60,
          riskLevel: 'Medium',
          minStake: 10,
          maxStake: 1000,
          description: 'A medium-risk pool for investors looking for stable returns.',
          isVerified: true,
        },
        {
          id: '3',
          name: 'AGRO/BTC',
          address: 'AGROBTCpools333333333333333333333333333333333',
          token0: 'AGRO',
          token1: 'BTC',
          apr: 31.2,
          tvl: 2000000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 90,
          riskLevel: 'Low',
          minStake: 1,
          maxStake: 100,
          description: 'A low-risk pool for beginners and conservative investors.',
          isVerified: true,
        },
      ];

      setState((prev) => ({ ...prev, pools: mockPools, loading: false }));
    } catch (error: any) {
      console.error('Erro ao buscar pools:', error);
      setState((prev) => ({
        ...prev,
        error: error.message || 'Erro ao carregar pools',
        loading: false,
      }));
    }
  }, []);

  const stakeInPool = useCallback(
    async (poolId: string, amount: string) => {
      try {
        const pool = state.pools.find((p) => p.id === poolId);
        if (!pool) throw new Error('Pool não encontrado');

        // Simulação - substitua por chamada real
        console.log(`Staking ${amount} in pool ${poolId}`);

        // Atualizar estado local
        setState((prev) => ({
          ...prev,
          pools: prev.pools.map((p) =>
            p.id === poolId
              ? { ...p, userStaked: p.userStaked + parseFloat(amount) }
              : p,
          ),
        }));

        return { signature: 'mock-signature' };
      } catch (error: any) {
        throw new Error(error.message || 'Erro ao fazer stake');
      }
    },
    [state.pools],
  );

  const unstakeFromPool = useCallback(
    async (poolId: string, amount: string) => {
      try {
        const pool = state.pools.find((p) => p.id === poolId);
        if (!pool) throw new Error('Pool não encontrado');

        // Simulação - substitua por chamada real
        console.log(`Unstaking ${amount} from pool ${poolId}`);

        // Atualizar estado local
        setState((prev) => ({
          ...prev,
          pools: prev.pools.map((p) =>
            p.id === poolId
              ? { ...p, userStaked: p.userStaked - parseFloat(amount) }
              : p,
          ),
        }));

        return { signature: 'mock-signature' };
      } catch (error: any) {
        throw new Error(error.message || 'Erro ao fazer unstake');
      }
    },
    [state.pools],
  );

  const claimRewards = useCallback(
    async (poolId: string) => {
      try {
        const pool = state.pools.find((p) => p.id === poolId);
        if (!pool) throw new Error('Pool não encontrado');

        // Simulação - substitua por chamada real
        console.log(`Claiming rewards from pool ${poolId}`);

        // Atualizar estado local
        setState((prev) => ({
          ...prev,
          pools: prev.pools.map((p) =>
            p.id === poolId ? { ...p, userRewards: 0 } : p,
          ),
        }));

        return { signature: 'mock-signature' };
      } catch (error: any) {
        throw new Error(error.message || 'Erro ao reivindicar recompensas');
      }
    },
    [state.pools],
  );

  const getPoolAPR = useCallback(
    async (poolId: string): Promise<number> => {
      const pool = state.pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool não encontrado');
      return pool.apr;
    },
    [state.pools],
  );

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return {
    ...state,
    stakeInPool,
    unstakeFromPool,
    claimRewards,
    getPoolAPR,
  };
} 