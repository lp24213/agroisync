'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Lock, Users, Coins, BarChart3 } from 'lucide-react';

const tvlData = [
  { date: 'Jan', tvl: 18000000, users: 12500, pools: 8 },
  { date: 'Feb', tvl: 19500000, users: 14200, pools: 10 },
  { date: 'Mar', tvl: 21000000, users: 15800, pools: 12 },
  { date: 'Apr', tvl: 20500000, users: 15200, pools: 12 },
  { date: 'May', tvl: 22000000, users: 16800, pools: 14 },
  { date: 'Jun', tvl: 22500000, users: 17500, pools: 15 },
];

const protocolStats = {
  totalValueLocked: 22500000,
  tvlChange: 2500000,
  tvlChangePercent: 12.5,
  totalUsers: 17500,
  activePools: 15,
  averageAPY: 13.8,
  totalRewards: 1850000,
  securityScore: 9.8,
};

const topPools = [
  {
    name: 'AGROTM-SOL LP',
    tvl: 8500000,
    apy: 18.5,
    change: 2.3,
    color: '#22c55e',
  },
  {
    name: 'AGROTM-USDC LP',
    tvl: 6200000,
    apy: 15.2,
    change: 1.8,
    color: '#3b82f6',
  },
  {
    name: 'AGROTM-RAY LP',
    tvl: 4200000,
    apy: 16.8,
    change: 3.1,
    color: '#f59e0b',
  },
  {
    name: 'AGROTM-ORCA LP',
    tvl: 3600000,
    apy: 14.3,
    change: 1.2,
    color: '#8b5cf6',
  },
];

export function TVLWidget() {
  const [selectedMetric, setSelectedMetric] = useState('tvl');
  const [isPositive, setIsPositive] = useState(protocolStats.tvlChangePercent > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChartData = () => {
    return tvlData.map(item => ({
      date: item.date,
      value: item[selectedMetric as keyof typeof item] as number,
    }));
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'tvl':
        return 'Total Value Locked';
      case 'users':
        return 'Total Users';
      case 'pools':
        return 'Active Pools';
      default:
        return 'Total Value Locked';
    }
  };

  const getMetricValue = () => {
    switch (selectedMetric) {
      case 'tvl':
        return formatCurrency(protocolStats.totalValueLocked);
      case 'users':
        return formatNumber(protocolStats.totalUsers);
      case 'pools':
        return protocolStats.activePools.toString();
      default:
        return formatCurrency(protocolStats.totalValueLocked);
    }
  };

  const getMetricChange = () => {
    const latest = tvlData[tvlData.length - 1];
    const previous = tvlData[tvlData.length - 2];
    const current = latest[selectedMetric as keyof typeof latest] as number;
    const prev = previous[selectedMetric as keyof typeof previous] as number;
    return ((current - prev) / prev) * 100;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='card'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-white'>Protocol Stats</h3>
          <p className='text-sm text-gray-400'>Total Value Locked & metrics</p>
        </div>
        <div className='p-2 bg-blue-500/20 rounded-lg'>
          <Lock className='w-5 h-5 text-blue-400' />
        </div>
      </div>

      {/* Main Metric Display */}
      <div className='mb-6'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-white mb-1'>{getMetricValue()}</div>
          <div className='flex items-center justify-center text-sm mb-2'>
            {getMetricChange() > 0 ? (
              <TrendingUp className='w-4 h-4 text-green-400 mr-1' />
            ) : (
              <TrendingDown className='w-4 h-4 text-red-400 mr-1' />
            )}
            <span className={getMetricChange() > 0 ? 'text-green-400' : 'text-red-400'}>
              {formatPercentage(getMetricChange())}
            </span>
            <span className='text-gray-400 ml-1'>this month</span>
          </div>
          <p className='text-xs text-gray-400'>{getMetricLabel()}</p>
        </div>
      </div>

      {/* Metric Selector */}
      <div className='mb-4'>
        <div className='grid grid-cols-3 gap-2'>
          {[
            { key: 'tvl', label: 'TVL', icon: Lock },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'pools', label: 'Pools', icon: Coins },
          ].map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedMetric === metric.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <metric.icon className='w-3 h-3 mx-auto mb-1' />
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className='h-32 mb-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={getChartData()}>
            <defs>
              <linearGradient id='tvlGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='date' stroke='#9ca3af' fontSize={10} />
            <YAxis
              stroke='#9ca3af'
              fontSize={10}
              tickFormatter={value =>
                selectedMetric === 'tvl' ? `$${(value / 1e6).toFixed(0)}M` : value.toString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [
                selectedMetric === 'tvl' ? formatCurrency(value) : value.toString(),
                getMetricLabel(),
              ]}
            />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#3b82f6'
              strokeWidth={2}
              fill='url(#tvlGradient)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Protocol Stats */}
      <div className='space-y-3'>
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-3 bg-white/5 rounded-lg'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-xs text-gray-400'>Avg APY</span>
              <BarChart3 className='w-3 h-3 text-green-400' />
            </div>
            <p className='text-sm font-medium text-white'>{protocolStats.averageAPY}%</p>
          </div>

          <div className='p-3 bg-white/5 rounded-lg'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-xs text-gray-400'>Security</span>
              <BarChart3 className='w-3 h-3 text-blue-400' />
            </div>
            <p className='text-sm font-medium text-white'>{protocolStats.securityScore}/10</p>
          </div>
        </div>

        <div className='p-3 bg-white/5 rounded-lg'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs text-gray-400'>Total Rewards Distributed</span>
            <BarChart3 className='w-3 h-3 text-yellow-400' />
          </div>
          <p className='text-sm font-medium text-white'>
            {formatCurrency(protocolStats.totalRewards)}
          </p>
        </div>
      </div>

      {/* Top Pools */}
      <div className='mt-4 pt-4 border-t border-white/10'>
        <h4 className='text-sm font-medium text-white mb-3'>Top Liquidity Pools</h4>
        <div className='space-y-2'>
          {topPools.map((pool, index) => (
            <div
              key={pool.name}
              className='flex items-center justify-between p-2 bg-white/5 rounded-lg'
            >
              <div className='flex items-center'>
                <div
                  className='w-2 h-2 rounded-full mr-2'
                  style={{ backgroundColor: pool.color }}
                />
                <div>
                  <p className='text-xs font-medium text-white'>{pool.name}</p>
                  <p className='text-xs text-gray-400'>{formatCurrency(pool.tvl)}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-xs font-medium text-green-400'>{pool.apy}% APY</p>
                <p className='text-xs text-gray-400'>{formatPercentage(pool.change)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-4 flex space-x-2'>
        <button className='flex-1 btn-primary text-sm py-2'>Add Liquidity</button>
        <button className='flex-1 btn-outline text-sm py-2'>View Pools</button>
      </div>
    </motion.div>
  );
}
