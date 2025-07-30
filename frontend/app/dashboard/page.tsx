'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  RefreshCw,
  Shield,
  Star,
  Wallet,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const portfolioData = {
  totalValue: '$124,567.89',
  change24h: '+12.5%',
  isPositive: true,
  assets: [
    {
      name: 'AGROTM',
      value: '$45,234.56',
      percentage: 36.3,
      change: '+8.2%',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'SOL',
      value: '$32,123.45',
      percentage: 25.8,
      change: '+15.7%',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: 'USDC',
      value: '$28,456.78',
      percentage: 22.9,
      change: '+0.1%',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'ETH',
      value: '$18,753.10',
      percentage: 15.0,
      change: '+5.3%',
      color: 'from-gray-500 to-slate-600',
    },
  ],
};

const recentTransactions = [
  { type: 'Stake', amount: '+1,000 AGROTM', time: '2 min ago', status: 'success' },
  { type: 'Farm', amount: '+500 SOL', time: '15 min ago', status: 'success' },
  { type: 'Swap', amount: '-2,000 USDC', time: '1 hour ago', status: 'success' },
  { type: 'Harvest', amount: '+150 AGROTM', time: '3 hours ago', status: 'success' },
  { type: 'Unstake', amount: '-500 AGROTM', time: '1 day ago', status: 'pending' },
];

const farmingPools = [
  { name: 'AGROTM-SOL LP', apy: '156.7%', tvl: '$2.4M', staked: '$12,345', rewards: '234 AGROTM' },
  { name: 'AGROTM-USDC LP', apy: '89.2%', tvl: '$1.8M', staked: '$8,901', rewards: '156 AGROTM' },
  { name: 'SOL-USDC LP', apy: '45.3%', tvl: '$3.2M', staked: '$5,678', rewards: '89 SOL' },
];

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = ['1H', '24H', '7D', '30D', '1Y', 'ALL'];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-4xl font-bold text-white mb-2'
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-gray-400'
          >
            Welcome back! Here's your portfolio overview.
          </motion.p>
        </div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'
        >
          {/* Total Portfolio Value */}
          <div className='lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-1'>Portfolio Value</h3>
                <div className='flex items-center space-x-2'>
                  <span className='text-3xl font-bold text-white'>{portfolioData.totalValue}</span>
                  <div className='flex items-center space-x-1'>
                    {portfolioData.isPositive ? (
                      <ArrowUpRight className='w-4 h-4 text-green-400' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4 text-red-400' />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        portfolioData.isPositive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {portfolioData.change24h}
                    </span>
                  </div>
                </div>
              </div>
              <div className='w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center'>
                <DollarSign className='w-8 h-8 text-green-400' />
              </div>
            </div>

            {/* Asset Distribution Chart */}
            <div className='h-32 flex items-end space-x-2'>
              {portfolioData.assets.map((asset, index) => (
                <div
                  key={asset.name}
                  className='flex-1 bg-gradient-to-t from-green-500/30 to-emerald-500/30 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer'
                  style={{ height: `${asset.percentage}%` }}
                />
              ))}
            </div>

            {/* Asset List */}
            <div className='mt-4 space-y-2'>
              {portfolioData.assets.map((asset, index) => (
                <div key={asset.name} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className={`w-3 h-3 bg-gradient-to-r ${asset.color} rounded-full`} />
                    <span className='text-sm text-gray-300'>{asset.name}</span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-white'>{asset.value}</div>
                    <div className='text-xs text-green-400'>{asset.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-6'>Quick Actions</h3>
            <div className='space-y-4'>
              <button className='w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Wallet className='w-5 h-5 text-green-400' />
                  <span className='text-white font-medium'>Connect Wallet</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-green-400' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-400' />
                  <span className='text-white font-medium'>Start Farming</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-gray-400' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Shield className='w-5 h-5 text-blue-400' />
                  <span className='text-white font-medium'>Stake Tokens</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-gray-400' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Zap className='w-5 h-5 text-purple-400' />
                  <span className='text-white font-medium'>Swap Tokens</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-gray-400' />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
        >
          {/* Performance Chart */}
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-white'>Portfolio Performance</h3>
              <div className='flex items-center space-x-2'>
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTimeframe === timeframe
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div className='h-64 flex items-end space-x-2'>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className='flex-1 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t transition-all duration-300 hover:opacity-80'
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>

          {/* Farming Pools */}
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-white'>Active Farms</h3>
              <button className='p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300'>
                <RefreshCw className='w-4 h-4 text-gray-400' />
              </button>
            </div>

            <div className='space-y-4'>
              {farmingPools.map((pool, index) => (
                <div key={pool.name} className='p-4 bg-white/5 rounded-xl border border-white/10'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-white'>{pool.name}</h4>
                    <span className='text-green-400 font-bold'>{pool.apy}</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-400'>TVL:</span>
                      <span className='text-white ml-2'>{pool.tvl}</span>
                    </div>
                    <div>
                      <span className='text-gray-400'>Staked:</span>
                      <span className='text-white ml-2'>{pool.staked}</span>
                    </div>
                  </div>
                  <div className='mt-3 pt-3 border-t border-white/10'>
                    <span className='text-gray-400 text-sm'>Rewards:</span>
                    <span className='text-yellow-400 ml-2 font-medium'>{pool.rewards}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
        >
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-white'>Recent Transactions</h3>
            <button className='flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300'>
              <Download className='w-4 h-4 text-gray-400' />
              <span className='text-sm text-gray-400'>Export</span>
            </button>
          </div>

          <div className='space-y-3'>
            {recentTransactions.map((tx, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10'
              >
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.status === 'success' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                    }`}
                  >
                    <Activity
                      className={`w-5 h-5 ${
                        tx.status === 'success' ? 'text-green-400' : 'text-yellow-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className='font-medium text-white'>{tx.type}</div>
                    <div className='text-sm text-gray-400'>{tx.time}</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-white'>{tx.amount}</div>
                  <div
                    className={`text-sm ${
                      tx.status === 'success' ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
