'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const portfolioData = [
  { name: 'Jan', value: 20000, staked: 12000, rewards: 800 },
  { name: 'Feb', value: 22000, staked: 13500, rewards: 950 },
  { name: 'Mar', value: 24000, staked: 15000, rewards: 1100 },
  { name: 'Apr', value: 23500, staked: 14800, rewards: 1050 },
  { name: 'May', value: 25000, staked: 16000, rewards: 1200 },
  { name: 'Jun', value: 24567, staked: 15234, rewards: 1156 },
];

const assetAllocation = [
  { name: 'AGROTM Staked', value: 62, color: '#22c55e' },
  { name: 'AGROTM Liquid', value: 23, color: '#3b82f6' },
  { name: 'Other Tokens', value: 15, color: '#f59e0b' },
];

const recentTransactions = [
  {
    id: 1,
    type: 'stake',
    amount: '5,000 AGROTM',
    value: '$750.00',
    timestamp: '2 hours ago',
    status: 'completed',
    change: '+2.5%',
  },
  {
    id: 2,
    type: 'reward',
    amount: '150 AGROTM',
    value: '$22.50',
    timestamp: '1 day ago',
    status: 'completed',
    change: '+1.2%',
  },
  {
    id: 3,
    type: 'unstake',
    amount: '2,000 AGROTM',
    value: '$300.00',
    timestamp: '3 days ago',
    status: 'completed',
    change: '-0.8%',
  },
];

export function PortfolioOverview() {
  const [timeframe, setTimeframe] = useState('6M');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTotalValue = () => {
    const latest = portfolioData[portfolioData.length - 1];
    return latest.value;
  };

  const getTotalChange = () => {
    const first = portfolioData[0];
    const last = portfolioData[portfolioData.length - 1];
    return ((last.value - first.value) / first.value) * 100;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>Portfolio Overview</h2>
          <p className='text-gray-400'>Track your investments and performance</p>
        </div>
        <div className='flex items-center space-x-2'>
          {['1M', '3M', '6M', '1Y'].map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Value Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='card'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-white'>Total Portfolio Value</h3>
            <p className='text-gray-400'>Current market value of all assets</p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-white'>{formatCurrency(getTotalValue())}</div>
            <div
              className={`flex items-center text-sm ${
                getTotalChange() >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {getTotalChange() >= 0 ? (
                <ArrowUpRight className='w-4 h-4 mr-1' />
              ) : (
                <ArrowDownRight className='w-4 h-4 mr-1' />
              )}
              {formatPercentage(getTotalChange())}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id='portfolioGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#22c55e' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
              <XAxis dataKey='name' stroke='#9ca3af' fontSize={12} />
              <YAxis
                stroke='#9ca3af'
                fontSize={12}
                tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke='#22c55e'
                strokeWidth={2}
                fill='url(#portfolioGradient)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Asset Allocation & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='card'
        >
          <h3 className='text-lg font-semibold text-white mb-4'>Asset Allocation</h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4 space-y-2'>
            {assetAllocation.map((asset, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className='text-sm text-gray-300'>{asset.name}</span>
                </div>
                <span className='text-sm font-medium text-white'>{asset.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className='card'
        >
          <h3 className='text-lg font-semibold text-white mb-4'>Recent Transactions</h3>
          <div className='space-y-3'>
            {recentTransactions.map(tx => (
              <div
                key={tx.id}
                className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
              >
                <div className='flex items-center'>
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      tx.type === 'stake'
                        ? 'bg-green-400'
                        : tx.type === 'reward'
                          ? 'bg-blue-400'
                          : 'bg-yellow-400'
                    }`}
                  />
                  <div>
                    <p className='text-sm font-medium text-white capitalize'>{tx.type}</p>
                    <p className='text-xs text-gray-400'>{tx.timestamp}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-white'>{tx.amount}</p>
                  <p className='text-xs text-gray-400'>{tx.value}</p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    tx.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.change}
                </div>
              </div>
            ))}
          </div>
          <button className='w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors'>
            View All Transactions
          </button>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
      >
        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>Total Staked</p>
              <p className='text-2xl font-bold text-white'>$15,234</p>
            </div>
            <div className='p-2 bg-green-500/20 rounded-lg'>
              <div className='w-6 h-6 text-green-400' />
            </div>
          </div>
          <div className='mt-2 flex items-center text-green-400 text-sm'>
            <TrendingUp className='w-4 h-4 mr-1' />
            +8.3%
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>Total Rewards</p>
              <p className='text-2xl font-bold text-white'>$1,156</p>
            </div>
            <div className='p-2 bg-blue-500/20 rounded-lg'>
              <DollarSign className='w-6 h-6 text-blue-400' />
            </div>
          </div>
          <div className='mt-2 flex items-center text-green-400 text-sm'>
            <TrendingUp className='w-4 h-4 mr-1' />
            +12.5%
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>APY</p>
              <p className='text-2xl font-bold text-white'>15.3%</p>
            </div>
            <div className='p-2 bg-yellow-500/20 rounded-lg'>
              <TrendingUp className='w-6 h-6 text-yellow-400' />
            </div>
          </div>
          <div className='mt-2 flex items-center text-green-400 text-sm'>
            <TrendingUp className='w-4 h-4 mr-1' />
            +2.1%
          </div>
        </div>
      </motion.div>
    </div>
  );
}
