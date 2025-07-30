'use client';

import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { StakingForm } from '@/components/forms/StakingForm';
import { WalletConnectForm } from '@/components/forms/WalletConnectForm';
import { Card } from '@/components/ui/Card';
import { validation } from '@/utils/validation';

export default function StakingPage() {
  const { isConnected, publicKey } = useWeb3();
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <WalletConnectForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Staking</h1>
          <p className="text-gray-400">
            Stake seus tokens AGRO e ganhe recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Form */}
          <div className="lg:col-span-1">
            <StakingForm
              pools={pools.map(pool => ({
                id: pool.id,
                name: pool.name,
                apr: pool.apr,
                minStake: pool.minStake,
                maxStake: pool.maxStake,
                lockPeriod: pool.lockPeriod,
              }))}
              onStake={stakeInPool}
              onUnstake={unstakeFromPool}
              onClaim={claimRewards}
            />
          </div>

          {/* Pools Overview */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Pools Disponíveis</h2>
                <p className="text-gray-400">Escolha um pool para fazer stake</p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pools.map((pool) => (
                    <div
                      key={pool.id}
                      className="p-6 bg-agro-dark/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                          <p className="text-gray-400">{pool.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-agro-green">
                            {validation.formatPercentage(pool.apr)}
                          </p>
                          <p className="text-sm text-gray-400">APR</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">TVL</p>
                          <p className="text-white font-semibold">
                            {validation.formatCurrency(pool.tvl)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Seu Stake</p>
                          <p className="text-white font-semibold">
                            {validation.formatNumber(pool.userStaked)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Recompensas</p>
                          <p className="text-agro-blue font-semibold">
                            {validation.formatNumber(pool.userRewards)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Lock Period</p>
                          <p className="text-white font-semibold">
                            {pool.lockPeriod} dias
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            pool.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                            pool.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {pool.riskLevel}
                          </span>
                          {pool.isVerified && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Min: {pool.minStake} | Max: {pool.maxStake}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Staking Statistics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Staked</h3>
                  <p className="text-3xl font-bold text-agro-green">
                    {validation.formatCurrency(pools.reduce((sum, pool) => sum + pool.tvl, 0))}
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">APR Médio</h3>
                  <p className="text-3xl font-bold text-agro-blue">
                    {validation.formatPercentage(pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length)}
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Pools Ativos</h3>
                  <p className="text-3xl font-bold text-purple-400">
                    {pools.filter(pool => pool.isActive).length}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 