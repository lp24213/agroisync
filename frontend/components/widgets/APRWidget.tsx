'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const aprData = [
  { date: 'Jan', flexible: 8.2, lock30: 11.8, lock90: 15.2, lock180: 17.8 },
  { date: 'Feb', flexible: 8.5, lock30: 12.1, lock90: 15.5, lock180: 18.1 },
  { date: 'Mar', flexible: 8.8, lock30: 12.3, lock90: 15.7, lock180: 18.2 },
  { date: 'Apr', flexible: 8.3, lock30: 12.0, lock90: 15.4, lock180: 17.9 },
  { date: 'May', flexible: 8.6, lock30: 12.2, lock90: 15.6, lock180: 18.0 },
  { date: 'Jun', flexible: 8.5, lock30: 12.3, lock90: 15.7, lock180: 18.2 },
];

const stakingPools = [
  {
    name: 'Flexible Staking',
    currentAPR: 8.5,
    change: 0.3,
    trend: 'up',
    color: '#22c55e',
    description: 'No lock period, withdraw anytime',
  },
  {
    name: '30-Day Lock',
    currentAPR: 12.3,
    change: 0.2,
    trend: 'up',
    color: '#3b82f6',
    description: 'Lock for 30 days, higher rewards',
  },
  {
    name: '90-Day Lock',
    currentAPR: 15.7,
    change: 0.1,
    trend: 'up',
    color: '#f59e0b',
    description: 'Lock for 90 days, premium rewards',
  },
  {
    name: '180-Day Lock',
    currentAPR: 18.2,
    change: 0.4,
    trend: 'up',
    color: '#8b5cf6',
    description: 'Lock for 180 days, maximum rewards',
  },
];

export function APRWidget() {
  const [selectedPool, setSelectedPool] = useState('flexible');
  const [timeframe, setTimeframe] = useState('6M');

  const currentPool =
    stakingPools.find(pool => pool.name.toLowerCase().includes(selectedPool)) || stakingPools[0];

  const getChartData = () => {
    const dataKey =
      selectedPool === 'flexible'
        ? 'flexible'
        : selectedPool === '30-day'
          ? 'lock30'
          : selectedPool === '90-day'
            ? 'lock90'
            : 'lock180';

    return aprData.map(item => ({
      date: item.date,
      apr: item[dataKey as keyof typeof item] as number,
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='card'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-white'>APR Overview</h3>
          <p className='text-sm text-gray-400'>Current staking rates</p>
        </div>
        <div className='p-2 bg-primary-500/20 rounded-lg'>
          <Target className='w-5 h-5 text-primary-400' />
        </div>
      </div>

      {/* Current APR Display */}
      <div className='mb-6'>
        <div className='text-center'>
          <div className='text-3xl font-bold text-white mb-1'>{currentPool.currentAPR}%</div>
          <div className='flex items-center justify-center text-sm'>
            {currentPool.trend === 'up' ? (
              <TrendingUp className='w-4 h-4 text-green-400 mr-1' />
            ) : (
              <TrendingDown className='w-4 h-4 text-red-400 mr-1' />
            )}
            <span className={currentPool.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
              +{currentPool.change}%
            </span>
            <span className='text-gray-400 ml-1'>this week</span>
          </div>
          <p className='text-xs text-gray-400 mt-2'>{currentPool.description}</p>
        </div>
      </div>

      {/* Pool Selector */}
      <div className='mb-4'>
        <div className='grid grid-cols-2 gap-2'>
          {stakingPools.map(pool => (
            <button
              key={pool.name}
              onClick={() => setSelectedPool(pool.name.toLowerCase().split(' ')[0])}
              className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                pool.name.toLowerCase().includes(selectedPool)
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span>{pool.name.split(' ')[0]}</span>
                <span>{pool.currentAPR}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* APR Chart */}
      <div className='h-32 mb-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='date' stroke='#9ca3af' fontSize={10} />
            <YAxis stroke='#9ca3af' fontSize={10} tickFormatter={value => `${value}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value}%`, 'APR']}
            />
            <Line
              type='monotone'
              dataKey='apr'
              stroke={currentPool.color}
              strokeWidth={2}
              dot={{ fill: currentPool.color, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pool Comparison */}
      <div className='space-y-2'>
        {stakingPools.map(pool => (
          <div
            key={pool.name}
            className='flex items-center justify-between p-2 bg-white/5 rounded-lg'
          >
            <div className='flex items-center'>
              <div className='w-2 h-2 rounded-full mr-2' style={{ backgroundColor: pool.color }} />
              <span className='text-xs text-gray-300'>{pool.name}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-xs font-medium text-white'>{pool.currentAPR}%</span>
              {pool.trend === 'up' ? (
                <TrendingUp className='w-3 h-3 text-green-400' />
              ) : (
                <TrendingDown className='w-3 h-3 text-red-400' />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='mt-4 pt-4 border-t border-white/10'>
        <button className='w-full btn-primary text-sm py-2 flex items-center justify-center'>
          <Zap className='w-4 h-4 mr-2' />
          Stake Now
        </button>
      </div>
    </motion.div>
  );
}
