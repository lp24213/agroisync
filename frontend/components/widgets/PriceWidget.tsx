'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const priceData = [
  { time: '00:00', price: 0.145, volume: 1250000 },
  { time: '04:00', price: 0.148, volume: 1350000 },
  { time: '08:00', price: 0.152, volume: 1450000 },
  { time: '12:00', price: 0.149, volume: 1400000 },
  { time: '16:00', price: 0.151, volume: 1500000 },
  { time: '20:00', price: 0.150, volume: 1420000 },
];

const marketData = {
  currentPrice: 0.150,
  priceChange: 0.005,
  priceChangePercent: 3.45,
  marketCap: 22500000,
  volume24h: 1420000,
  circulatingSupply: 150000000,
  totalSupply: 200000000,
  allTimeHigh: 0.185,
  allTimeLow: 0.095
};

const timeframes = [
  { value: '1H', label: '1H' },
  { value: '24H', label: '24H' },
  { value: '7D', label: '7D' },
  { value: '30D', label: '30D' },
  { value: '1Y', label: '1Y' }
];

export function PriceWidget() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const [isPositive, setIsPositive] = useState(marketData.priceChangePercent > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">AGROTM Price</h3>
          <p className="text-sm text-gray-400">Live market data</p>
        </div>
        <div className="p-2 bg-green-500/20 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-400" />
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(marketData.currentPrice)}
          </div>
          <div className="flex items-center justify-center text-sm mb-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
              {formatPercentage(marketData.priceChangePercent)}
            </span>
            <span className="text-gray-400 ml-1">({formatCurrency(marketData.priceChange)})</span>
          </div>
          <p className="text-xs text-gray-400">Last updated: Just now</p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedTimeframe === timeframe.value
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={10}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={{ fill: isPositive ? "#22c55e" : "#ef4444", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Market Stats */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Market Cap</span>
              <BarChart3 className="w-3 h-3 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-white">
              ${formatNumber(marketData.marketCap)}
            </p>
          </div>
          
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">24h Volume</span>
              <BarChart3 className="w-3 h-3 text-green-400" />
            </div>
            <p className="text-sm font-medium text-white">
              ${formatNumber(marketData.volume24h)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Circulating</span>
              <BarChart3 className="w-3 h-3 text-yellow-400" />
            </div>
            <p className="text-sm font-medium text-white">
              {formatNumber(marketData.circulatingSupply)}
            </p>
          </div>
          
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Total Supply</span>
              <BarChart3 className="w-3 h-3 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-white">
              {formatNumber(marketData.totalSupply)}
            </p>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400">ATH:</span>
            <span className="text-white ml-1">{formatCurrency(marketData.allTimeHigh)}</span>
          </div>
          <div>
            <span className="text-gray-400">ATL:</span>
            <span className="text-white ml-1">{formatCurrency(marketData.allTimeLow)}</span>
          </div>
        </div>
        
        {/* Price Range Bar */}
        <div className="mt-2 relative">
          <div className="w-full h-2 bg-white/10 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
              style={{
                width: `${((marketData.currentPrice - marketData.allTimeLow) / (marketData.allTimeHigh - marketData.allTimeLow)) * 100}%`
              }}
            />
          </div>
          <div 
            className="absolute top-0 w-2 h-2 bg-white rounded-full transform -translate-y-1"
            style={{
              left: `${((marketData.currentPrice - marketData.allTimeLow) / (marketData.allTimeHigh - marketData.allTimeLow)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 btn-primary text-sm py-2">
          Buy AGROTM
        </button>
        <button className="flex-1 btn-outline text-sm py-2">
          Trade
        </button>
      </div>
    </motion.div>
  );
} 