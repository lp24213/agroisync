'use client';
import { useState, useEffect } from 'react';
import { AnimatedCard } from '../AnimatedCard';
import { NeonButton } from '../NeonButton';
import { PriceWidget } from '../widgets/PriceWidget';
import { TVLWidget } from '../widgets/TVLWidget';
import { APRWidget } from '../widgets/APRWidget';
import { motion } from 'framer-motion';

interface Pool {
  id: string;
  name: string;
  apr: number;
  tvl: number;
  userStaked: number;
  token0: string;
  token1: string;
}

export function DeFiDashboard() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        // Simulação de API - substitua por integração real
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockPools: Pool[] = [
          {
            id: '1',
            name: 'AGRO/USDC',
            apr: 24.5,
            tvl: 1250000,
            userStaked: 0,
            token0: 'AGRO',
            token1: 'USDC',
          },
          {
            id: '2',
            name: 'AGRO/SOL',
            apr: 18.3,
            tvl: 850000,
            userStaked: 0,
            token0: 'AGRO',
            token1: 'SOL',
          },
          {
            id: '3',
            name: 'AGRO/BTC',
            apr: 31.2,
            tvl: 650000,
            userStaked: 0,
            token0: 'AGRO',
            token1: 'BTC',
          },
        ];
        setPools(mockPools);
      } catch (error) {
        console.error('Erro ao buscar pools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  const formatTVL = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <AnimatedCard key={i} className="animate-pulse">
            <div className="h-32 bg-gray-600 rounded"></div>
          </AnimatedCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Widgets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PriceWidget />
        <TVLWidget />
        <APRWidget />
      </div>

      {/* Pools Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold gradient-text">Liquidity Pools</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pools.map((pool: Pool, index: number) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard className="p-6 hover:border-neon-blue/50">
                <div className="space-y-4">
                  {/* Pool Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center text-xs font-bold text-matte-black">
                        {pool.token0[0]}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-neon-purple flex items-center justify-center text-xs font-bold text-white">
                        {pool.token1[0]}
                      </div>
                    </div>
                  </div>

                  {/* Pool Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">APR</p>
                      <p className="text-lg font-bold text-success-green">{pool.apr.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">TVL</p>
                      <p className="text-lg font-bold text-white">{formatTVL(pool.tvl)}</p>
                    </div>
                  </div>

                  {/* User Position */}
                  {pool.userStaked > 0 && (
                    <div className="p-3 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                      <p className="text-xs text-gray-400">Your Position</p>
                      <p className="text-sm font-semibold text-neon-blue">
                        ${pool.userStaked.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <NeonButton size="sm" className="flex-1" onClick={() => {}}>
                      Stake
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={pool.userStaked === 0}
                    >
                      Unstake
                    </NeonButton>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold gradient-text mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-blue">$0.00</p>
            <p className="text-sm text-gray-400">Total Staked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-green">$0.00</p>
            <p className="text-sm text-gray-400">Rewards Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-yellow">0.00%</p>
            <p className="text-sm text-gray-400">Avg APR</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-purple">0</p>
            <p className="text-sm text-gray-400">Active Positions</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
