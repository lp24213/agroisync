'use client';

import React from 'react';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { validation } from '@/utils/validation';

export default function PoolsPage() {
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();

  const handleStake = async (poolId: string, amount: string) => {
    try {
      await stakeInPool(poolId, amount);
      alert('Stake realizado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao fazer stake: ${error.message}`);
    }
  };

  const handleUnstake = async (poolId: string, amount: string) => {
    try {
      await unstakeFromPool(poolId, amount);
      alert('Unstake realizado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao fazer unstake: ${error.message}`);
    }
  };

  const handleClaimRewards = async (poolId: string) => {
    try {
      await claimRewards(poolId);
      alert('Recompensas reivindicadas com sucesso!');
    } catch (error: any) {
      alert(`Erro ao reivindicar recompensas: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-agro-darker p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pools de Liquidez</h1>
          <p className="text-gray-400">
            Explore e participe dos pools de liquidez disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <Card key={pool.id} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                  <p className="text-gray-400 text-sm">{pool.description}</p>
                </div>
                <Badge 
                  variant={
                    pool.riskLevel === 'Low' ? 'success' :
                    pool.riskLevel === 'Medium' ? 'warning' :
                    'error'
                  }
                >
                  {pool.riskLevel}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">APR:</span>
                  <span className="text-agro-green font-bold">
                    {validation.formatPercentage(pool.apr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TVL:</span>
                  <span className="text-white">
                    {validation.formatCurrency(pool.tvl)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seu Stake:</span>
                  <span className="text-white">
                    {validation.formatNumber(pool.userStaked)}
                  </span>
                </div>
                {pool.userRewards > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recompensas:</span>
                    <span className="text-agro-blue font-bold">
                      {validation.formatNumber(pool.userRewards)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Período de Lock:</span>
                  <span className="text-white">{pool.lockPeriod} dias</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleStake(pool.id, '100')}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  Stake 100 AGRO
                </Button>
                
                {pool.userStaked > 0 && (
                  <>
                    <Button
                      onClick={() => handleUnstake(pool.id, '50')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Unstake 50 AGRO
                    </Button>
                    
                    {pool.userRewards > 0 && (
                      <Button
                        onClick={() => handleClaimRewards(pool.id)}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        Reivindicar Recompensas
                      </Button>
                    )}
                  </>
                )}
              </div>

              {pool.isVerified && (
                <div className="absolute top-4 right-4">
                  <Badge variant="success" size="sm">Verificado</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 