'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Lock, 
  Unlock, 
  Plus, 
  Minus,
  DollarSign,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const stakingPools = [
  {
    id: 1,
    name: 'Flexible Staking',
    apy: 8.5,
    totalStaked: 2500000,
    minStake: 100,
    maxStake: 100000,
    lockPeriod: 0,
    rewards: 125.50,
    stakedAmount: 5000,
    color: '#22c55e'
  },
  {
    id: 2,
    name: '30-Day Lock',
    apy: 12.3,
    totalStaked: 1800000,
    minStake: 500,
    maxStake: 50000,
    lockPeriod: 30,
    rewards: 89.75,
    stakedAmount: 3000,
    color: '#3b82f6'
  },
  {
    id: 3,
    name: '90-Day Lock',
    apy: 15.7,
    totalStaked: 1200000,
    minStake: 1000,
    maxStake: 100000,
    lockPeriod: 90,
    rewards: 156.25,
    stakedAmount: 4000,
    color: '#f59e0b'
  },
  {
    id: 4,
    name: '180-Day Lock',
    apy: 18.2,
    totalStaked: 800000,
    minStake: 2000,
    maxStake: 100000,
    lockPeriod: 180,
    rewards: 234.10,
    stakedAmount: 6000,
    color: '#8b5cf6'
  }
];

const stakingHistory = [
  { date: 'Jan', staked: 12000, rewards: 800, apy: 8.5 },
  { date: 'Feb', staked: 13500, rewards: 950, apy: 9.2 },
  { date: 'Mar', staked: 15000, rewards: 1100, apy: 10.1 },
  { date: 'Apr', staked: 14800, rewards: 1050, apy: 9.8 },
  { date: 'May', staked: 16000, rewards: 1200, apy: 11.2 },
  { date: 'Jun', staked: 15234, rewards: 1156, apy: 10.8 },
];

const recentStakes = [
  {
    id: 1,
    pool: 'Flexible Staking',
    amount: '5,000 AGROTM',
    value: '$750.00',
    timestamp: '2 hours ago',
    status: 'active',
    apy: '8.5%'
  },
  {
    id: 2,
    pool: '90-Day Lock',
    amount: '3,000 AGROTM',
    value: '$450.00',
    timestamp: '1 day ago',
    status: 'locked',
    apy: '15.7%'
  },
  {
    id: 3,
    pool: '30-Day Lock',
    amount: '2,500 AGROTM',
    value: '$375.00',
    timestamp: '3 days ago',
    status: 'active',
    apy: '12.3%'
  }
];

export function StakingOverview() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.stakedAmount, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0);
  const averageAPY = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Staking Overview</h2>
          <p className="text-gray-400">Manage your staked assets and rewards</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowStakeModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Stake
          </button>
          <button 
            onClick={() => setShowUnstakeModal(true)}
            className="btn-outline flex items-center"
          >
            <Minus className="w-4 h-4 mr-2" />
            Unstake
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Staked</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalStaked)}</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8.3%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Rewards</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRewards)}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average APY</p>
              <p className="text-2xl font-bold text-white">{averageAPY.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.1%
          </div>
        </motion.div>
      </div>

      {/* Staking Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Staking Pools</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stakingPools.map((pool) => (
            <div
              key={pool.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedPool === pool.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedPool(pool.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{pool.name}</h4>
                  <p className="text-sm text-gray-400">
                    {pool.lockPeriod === 0 ? 'No lock period' : `${pool.lockPeriod}-day lock`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{pool.apy}%</div>
                  <div className="text-sm text-gray-400">APY</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your Stake:</span>
                  <span className="text-white">{formatCurrency(pool.stakedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rewards Earned:</span>
                  <span className="text-green-400">{formatCurrency(pool.rewards)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Pool:</span>
                  <span className="text-white">{formatCurrency(pool.totalStaked)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {pool.lockPeriod > 0 ? (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    Min: {formatNumber(pool.minStake)} AGROTM
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-primary-500 text-white text-xs rounded-md hover:bg-primary-600 transition-colors">
                    Stake
                  </button>
                  {pool.stakedAmount > 0 && (
                    <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors">
                      Unstake
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Staking History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stakingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="staked"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Staked Amount"
                />
                <Line
                  type="monotone"
                  dataKey="rewards"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Rewards"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* APY Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">APY Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stakingPools}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value}%`, 'APY']}
                />
                <Bar dataKey="apy" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Stakes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Stakes</h3>
        <div className="space-y-3">
          {recentStakes.map((stake) => (
            <div key={stake.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  stake.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{stake.pool}</p>
                  <p className="text-xs text-gray-400">{stake.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{stake.amount}</p>
                <p className="text-xs text-gray-400">{stake.value}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-400">{stake.apy}</p>
                <p className="text-xs text-gray-400">APY</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All Stakes
        </button>
      </motion.div>

      {/* Modals would go here */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Stake Tokens</h3>
            {/* Stake form would go here */}
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowStakeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                Stake
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnstakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Unstake Tokens</h3>
            {/* Unstake form would go here */}
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowUnstakeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Unstake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 