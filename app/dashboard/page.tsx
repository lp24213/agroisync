'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { DeFiDashboard } from '@/components/defi/DeFiDashboard';
import { PriceWidget } from '@/components/widgets/PriceWidget';
import { TVLWidget } from '@/components/widgets/TVLWidget';
import { APRWidget } from '@/components/widgets/APRWidget';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { Loader } from '@/components/Loader';
import {
  TrendingUp,
  Wallet,
  DollarSign,
  BarChart3,
  Coins,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';

interface DashboardStats {
  totalValue: number;
  totalStaked: number;
  totalRewards: number;
  portfolioChange: number;
}

export default function DashboardPage() {
  const { isConnected, account, connectWallet } = useWeb3();
  const { pools } = useDeFiPools();
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: 0,
    totalStaked: 0,
    totalRewards: 0,
    portfolioChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && pools.length > 0) {
      calculateStats();
    }
    setLoading(false);
  }, [isConnected, pools]);

  const calculateStats = () => {
    const totalStaked = pools.reduce((sum: number, pool) => sum + (pool.userStaked || 0), 0);
    const totalRewards = pools.reduce((sum: number, pool) => sum + (pool.userRewards || 0), 0);
    const totalValue = totalStaked + totalRewards;
    const portfolioChange = Math.random() * 20 - 10; // Simulated change

    setStats({
      totalValue,
      totalStaked,
      totalRewards,
      portfolioChange,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mb-8">
            <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h1>
            <p className="text-gray-400">
              Connect your wallet to access your AGROTM dashboard and start earning rewards.
            </p>
          </div>

          <NeonButton onClick={connectWallet} size="md" className="w-full">
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </NeonButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm">
                Welcome back, {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Wallet Balance</p>
                <p className="text-lg font-semibold text-white">
                  {/* balance?.toFixed(4) */}
                  SOL
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalValue.toLocaleString()}
                </p>
                <p
                  className={`text-sm flex items-center mt-1 ${
                    stats.portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stats.portfolioChange >= 0 ? '+' : ''}
                  {stats.portfolioChange.toFixed(2)}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Staked</p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalStaked.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">{pools.length} positions</p>
              </div>
              <Coins className="w-8 h-8 text-green-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalRewards.toLocaleString()}
                </p>
                <p className="text-sm text-blue-400 mt-1">Ready to claim</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Security Score</p>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-sm text-green-400 mt-1">Excellent</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Market Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <PriceWidget />
          <TVLWidget />
          <APRWidget />
        </motion.div>

        {/* DeFi Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
              DeFi Positions
            </h2>

            <NeonButton size="md" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              Auto-Compound
            </NeonButton>
          </div>

          <DeFiDashboard />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <NeonButton variant="secondary" className="w-full">
                Stake More
              </NeonButton>

              <NeonButton variant="secondary" className="w-full">
                Claim All Rewards
              </NeonButton>

              <NeonButton variant="secondary" className="w-full">
                Bridge Assets
              </NeonButton>

              <NeonButton variant="secondary" className="w-full">
                View Analytics
              </NeonButton>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
