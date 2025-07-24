"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./useWeb3";

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
  riskLevel: string;
  minStake: number;
  maxStake?: number;
  description?: string;
  isVerified?: boolean;
}

interface PoolsState {
  pools: Pool[];
  loading: boolean;
  error: string | null;
}

export function useDeFiPools() {
  const { signer, account, isConnected } = useWeb3();
  const [state, setState] = useState<PoolsState>({
    pools: [],
    loading: true,
    error: null
  });

  const fetchPools = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulação de API - substitua por integração real com contratos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPools: Pool[] = [
        {
          id: "1",
          name: "AGRO/USDC",
          address: "0x1234567890123456789012345678901234567890",
          token0: "AGRO",
          token1: "USDC",
          apr: 24.5,
          tvl: 1250000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 30, // Added
          riskLevel: "High", // Added
          minStake: 100, // Added
          maxStake: 10000, // Added
          description: "A high-risk, high-reward pool for experienced traders.", // Added
          isVerified: true // Added
        },
        {
          id: "2",
          name: "AGRO/SOL",
          address: "0x2345678901234567890123456789012345678901",
          token0: "AGRO",
          token1: "SOL",
          apr: 18.3,
          tvl: 850000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 60, // Added
          riskLevel: "Medium", // Added
          minStake: 10, // Added
          maxStake: 1000, // Added
          description: "A medium-risk pool for investors looking for stable returns.", // Added
          isVerified: true // Added
        },
        {
          id: "3",
          name: "AGRO/BTC",
          address: "0x3456789012345678901234567890123456789012",
          token0: "AGRO",
          token1: "BTC",
          apr: 31.2,
          tvl: 650000,
          userStaked: 0,
          userRewards: 0,
          isActive: true,
          lockPeriod: 90, // Added
          riskLevel: "Low", // Added
          minStake: 1, // Added
          maxStake: 100, // Added
          description: "A low-risk pool for beginners and conservative investors.", // Added
          isVerified: true // Added
        }
      ];

      // Se conectado, buscar posições do usuário
      if (isConnected && account) {
        // Aqui você faria chamadas reais para os contratos
        // const userPositions = await fetchUserPositions(account);
        // mockPools.forEach(pool => {
        //   const position = userPositions.find(p => p.poolId === pool.id);
        //   if (position) {
        //     pool.userStaked = position.staked;
        //     pool.userRewards = position.rewards;
        //   }
        // });
      }

      setState({
        pools: mockPools,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Erro ao buscar pools"
      }));
    }
  }, [isConnected, account]);

  const stakeInPool = useCallback(async (poolId: string, amount: string) => {
    if (!signer) throw new Error("Carteira não conectada");

    try {
      const pool = state.pools.find(p => p.id === poolId);
      if (!pool) throw new Error("Pool não encontrado");

      // Simulação - substitua por chamada real ao contrato
      const contractABI = [
        "function stake(uint256 amount) external",
        "function approve(address spender, uint256 amount) external returns (bool)"
      ];

      const poolContract = new ethers.Contract(pool.address, contractABI, signer);
      const amountWei = ethers.parseEther(amount);

      // Primeiro aprovar o token (se necessário)
      // const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
      // await tokenContract.approve(pool.address, amountWei);

      // Fazer stake
      const tx = await poolContract.stake(amountWei);
      await tx.wait();

      // Atualizar estado local
      setState(prev => ({
        ...prev,
        pools: prev.pools.map(p => 
          p.id === poolId 
            ? { ...p, userStaked: p.userStaked + parseFloat(amount) }
            : p
        )
      }));

      return tx;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer stake");
    }
  }, [signer, state.pools]);

  const unstakeFromPool = useCallback(async (poolId: string, amount: string) => {
    if (!signer) throw new Error("Carteira não conectada");

    try {
      const pool = state.pools.find(p => p.id === poolId);
      if (!pool) throw new Error("Pool não encontrado");

      const contractABI = [
        "function unstake(uint256 amount) external"
      ];

      const poolContract = new ethers.Contract(pool.address, contractABI, signer);
      const amountWei = ethers.parseEther(amount);

      const tx = await poolContract.unstake(amountWei);
      await tx.wait();

      // Atualizar estado local
      setState(prev => ({
        ...prev,
        pools: prev.pools.map(p => 
          p.id === poolId 
            ? { ...p, userStaked: Math.max(0, p.userStaked - parseFloat(amount)) }
            : p
        )
      }));

      return tx;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer unstake");
    }
  }, [signer, state.pools]);

  const claimRewards = useCallback(async (poolId: string) => {
    if (!signer) throw new Error("Carteira não conectada");

    try {
      const pool = state.pools.find(p => p.id === poolId);
      if (!pool) throw new Error("Pool não encontrado");

      const contractABI = [
        "function claimRewards() external"
      ];

      const poolContract = new ethers.Contract(pool.address, contractABI, signer);
      const tx = await poolContract.claimRewards();
      await tx.wait();

      // Atualizar estado local
      setState(prev => ({
        ...prev,
        pools: prev.pools.map(p => 
          p.id === poolId 
            ? { ...p, userRewards: 0 }
            : p
        )
      }));

      return tx;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao reivindicar recompensas");
    }
  }, [signer, state.pools]);

  const getPoolAPR = useCallback(async (poolId: string): Promise<number> => {
    try {
      const pool = state.pools.find(p => p.id === poolId);
      if (!pool) return 0;

      // Aqui você faria cálculo real do APR baseado em dados on-chain
      // const apr = await calculateAPR(pool.address);
      return pool.apr;
    } catch (error) {
      console.error("Erro ao calcular APR:", error);
      return 0;
    }
  }, [state.pools]);

  const getTotalUserValue = useCallback(() => {
    return state.pools.reduce((total, pool) => total + pool.userStaked, 0);
  }, [state.pools]);

  const getTotalUserRewards = useCallback(() => {
    return state.pools.reduce((total, pool) => total + pool.userRewards, 0);
  }, [state.pools]);

  // Buscar pools na inicialização e quando conectar
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Atualizar dados periodicamente
  useEffect(() => {
    const interval = setInterval(fetchPools, 30000); // A cada 30 segundos
    return () => clearInterval(interval);
  }, [fetchPools]);

  return {
    ...state,
    stakeInPool,
    unstakeFromPool,
    claimRewards,
    getPoolAPR,
    getTotalUserValue,
    getTotalUserRewards,
    refetch: fetchPools
  };
}
