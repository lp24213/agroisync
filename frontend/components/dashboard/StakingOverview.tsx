'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { validation } from '../../utils/validation';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  stakedAmount: number;
  rewards: number;
  apr: number;
  lockPeriod: number;
  isLocked: boolean;
}

interface StakingOverviewProps {
  pools: StakingPool[];
  onStake: (poolId: string) => void;
  onUnstake: (poolId: string) => void;
  onClaim: (poolId: string) => void;
}

export function StakingOverview({ pools, onStake, onUnstake, onClaim }: StakingOverviewProps) {
  const totalStaked = pools.reduce((sum, pool) => sum + pool.stakedAmount, 0);
  const totalRewards = pools.reduce((sum, pool) => sum + pool.rewards, 0);

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Staking Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-agro-dark/50 rounded-lg">
            <p className="text-gray-400 text-sm">Total Staked</p>
            <p className="text-2xl font-bold text-white">
              {validation.formatCurrency(totalStaked)}
            </p>
          </div>
          <div className="p-4 bg-agro-dark/50 rounded-lg">
            <p className="text-gray-400 text-sm">Total Rewards</p>
            <p className="text-2xl font-bold text-agro-green">
              {validation.formatCurrency(totalRewards)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Seus Pools</h3>
        {pools.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Você ainda não tem pools ativos</p>
            <Button variant="primary">Começar a Staking</Button>
          </div>
        ) : (
          pools.map((pool) => (
            <div key={pool.id} className="p-4 bg-agro-dark/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{pool.name}</h4>
                  <p className="text-gray-400 text-sm">{pool.token}</p>
                </div>
                <div className="text-right">
                  <p className="text-agro-green font-bold">
                    {validation.formatPercentage(pool.apr)} APR
                  </p>
                  <p className="text-gray-400 text-sm">
                    {pool.lockPeriod} dias lock
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Staked</p>
                  <p className="text-white font-semibold">
                    {validation.formatNumber(pool.stakedAmount)} {pool.token}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rewards</p>
                  <p className="text-agro-blue font-semibold">
                    {validation.formatNumber(pool.rewards)} {pool.token}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStake(pool.id)}
                >
                  Stake
                </Button>
                {pool.stakedAmount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUnstake(pool.id)}
                    disabled={pool.isLocked}
                  >
                    Unstake
                  </Button>
                )}
                {pool.rewards > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onClaim(pool.id)}
                  >
                    Claim
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
} 