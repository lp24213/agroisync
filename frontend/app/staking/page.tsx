'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Lock, 
  Users, 
  Zap,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';
import { StakingForm } from '@/components/forms/StakingForm';

const stakingPools = [
  {
    id: 1,
    name: 'SOL Staking Pool',
    token: 'SOL',
    apy: 12.5,
    totalStaked: 1250000,
    participants: 15420,
    minStake: 1,
    maxStake: 10000,
    lockPeriod: '30 days',
    risk: 'Low',
    color: '#9945FF',
    description: 'Stake SOL and earn rewards with our secure staking pool.',
    features: ['Auto-compounding', 'Instant rewards', 'Flexible unstaking'],
  },
  {
    id: 2,
    name: 'AGROTM Staking Pool',
    token: 'AGROTM',
    apy: 18.2,
    totalStaked: 850000,
    participants: 8920,
    minStake: 100,
    maxStake: 50000,
    lockPeriod: '90 days',
    risk: 'Medium',
    color: '#22C55E',
    description: 'High-yield staking for AGROTM token holders with bonus rewards.',
    features: ['Bonus rewards', 'Governance rights', 'Early access to features'],
  },
  {
    id: 3,
    name: 'RAY Staking Pool',
    token: 'RAY',
    apy: 15.8,
    totalStaked: 450000,
    participants: 5670,
    minStake: 10,
    maxStake: 25000,
    lockPeriod: '60 days',
    risk: 'Medium',
    color: '#FF6B6B',
    description: 'Stake RAY tokens and participate in Raydium ecosystem rewards.',
    features: ['Liquidity mining', 'Trading fee sharing', 'Protocol governance'],
  },
];

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0]);
  const [showStakingForm, setShowStakingForm] = useState(false);

  const totalValueLocked = stakingPools.reduce((sum, pool) => sum + pool.totalStaked, 0);
  const averageApy = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;
  const totalParticipants = stakingPools.reduce((sum, pool) => sum + pool.participants, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Staking Pools</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Earn passive income by staking your tokens in our secure and high-yield pools
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-primary-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">${(totalValueLocked / 1000000).toFixed(1)}M</p>
            <p className="text-gray-400">Total Value Locked</p>
          </div>
          <div className="card text-center">
            <Zap className="h-8 w-8 text-accent-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{averageApy.toFixed(1)}%</p>
            <p className="text-gray-400">Average APY</p>
          </div>
          <div className="card text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{totalParticipants.toLocaleString()}</p>
            <p className="text-gray-400">Active Stakers</p>
          </div>
        </motion.div>

        {/* Staking Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stakingPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card hover:scale-105 transition-transform duration-300"
            >
              {/* Pool Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: pool.color }}
                  >
                    {pool.token.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                    <p className="text-sm text-gray-400">{pool.token} Token</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-400">{pool.apy}%</p>
                  <p className="text-sm text-gray-400">APY</p>
                </div>
              </div>

              {/* Pool Description */}
              <p className="text-gray-300 mb-4">{pool.description}</p>

              {/* Pool Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Total Staked</p>
                  <p className="text-lg font-semibold text-white">
                    ${(pool.totalStaked / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Participants</p>
                  <p className="text-lg font-semibold text-white">
                    {pool.participants.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Min Stake</p>
                  <p className="text-lg font-semibold text-white">
                    {pool.minStake} {pool.token}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lock Period</p>
                  <p className="text-lg font-semibold text-white">{pool.lockPeriod}</p>
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Risk Level</span>
                <div className="flex items-center space-x-1">
                  {pool.risk === 'Low' && (
                    <>
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">Low</span>
                    </>
                  )}
                  {pool.risk === 'Medium' && (
                    <>
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-medium">Medium</span>
                    </>
                  )}
                  {pool.risk === 'High' && (
                    <>
                      <Zap className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400 font-medium">High</span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Features</p>
                <div className="space-y-1">
                  {pool.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedPool(pool);
                  setShowStakingForm(true);
                }}
                className="w-full btn-primary"
              >
                Stake Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Staking Form Modal */}
        {showStakingForm && (
          <StakingForm
            pool={selectedPool}
            onClose={() => setShowStakingForm(false)}
          />
        )}
      </div>
    </div>
  );
} 