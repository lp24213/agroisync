'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Zap } from 'lucide-react';

const stakingPools = [
  {
    id: 1,
    name: 'SOL Staking Pool',
    token: 'SOL',
    apy: 12.5,
    staked: 45.67,
    earned: 2.34,
    lockPeriod: '30 days',
    color: '#9945FF',
  },
  {
    id: 2,
    name: 'AGROTM Staking Pool',
    token: 'AGROTM',
    apy: 18.2,
    staked: 1234.56,
    earned: 45.67,
    lockPeriod: '90 days',
    color: '#22C55E',
  },
  {
    id: 3,
    name: 'RAY Staking Pool',
    token: 'RAY',
    apy: 15.8,
    staked: 89.12,
    earned: 3.45,
    lockPeriod: '60 days',
    color: '#FF6B6B',
  },
];

export function StakingOverview() {
  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.staked, 0);
  const totalEarned = stakingPools.reduce((sum, pool) => sum + pool.earned, 0);
  const averageApy = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Staking Overview</h3>
          <p className="text-sm text-gray-400">Your staked assets and rewards</p>
        </div>
        <Zap className="h-5 w-5 text-primary-400" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Total Staked</p>
            <p className="text-lg font-bold text-white">{totalStaked.toLocaleString()}</p>
          </div>
          <TrendingUp className="h-5 w-5 text-primary-400" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="text-lg font-bold text-green-400">{totalEarned.toLocaleString()}</p>
          </div>
          <Clock className="h-5 w-5 text-accent-400" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Average APY</p>
            <p className="text-lg font-bold text-primary-400">{averageApy.toFixed(1)}%</p>
          </div>
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
      </div>

      {/* Staking Pools */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Active Stakes</h4>
        {stakingPools.map((pool, index) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pool.color }}
                />
                <span className="text-sm font-medium text-white">{pool.name}</span>
              </div>
              <span className="text-sm text-primary-400 font-medium">{pool.apy}% APY</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Staked</p>
                <p className="text-white font-medium">{pool.staked.toLocaleString()} {pool.token}</p>
              </div>
              <div>
                <p className="text-gray-400">Earned</p>
                <p className="text-green-400 font-medium">{pool.earned.toLocaleString()} {pool.token}</p>
              </div>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">Lock: {pool.lockPeriod}</span>
              <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Claim Rewards
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary text-sm py-2">
            Stake More
          </button>
          <button className="btn-outline text-sm py-2">
            View All Pools
          </button>
        </div>
      </div>
    </div>
  );
} 