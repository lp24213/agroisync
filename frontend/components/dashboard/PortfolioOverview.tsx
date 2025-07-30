'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

const portfolioData = [
  { name: 'SOL', value: 45.2, color: '#9945FF', amount: 123.45, change: 12.5 },
  { name: 'AGROTM', value: 28.7, color: '#22C55E', amount: 5678.90, change: 8.2 },
  { name: 'USDC', value: 15.3, color: '#2775CA', amount: 2345.67, change: 0.1 },
  { name: 'RAY', value: 10.8, color: '#FF6B6B', amount: 89.12, change: -2.3 },
];

export function PortfolioOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const totalValue = portfolioData.reduce((sum, item) => sum + item.amount, 0);
  const totalChange = portfolioData.reduce((sum, item) => sum + item.change, 0) / portfolioData.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
          <p className="text-sm text-gray-400">Your asset allocation and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
          >
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="1y">1y</option>
          </select>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
          </div>
          <div className="flex items-center">
            {totalChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              totalChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-6">
        <div className="relative w-full h-48 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {portfolioData.map((item, index) => {
              const previousTotal = portfolioData
                .slice(0, index)
                .reduce((sum, prevItem) => sum + prevItem.value, 0);
              const startAngle = (previousTotal / 100) * 360;
              const endAngle = ((previousTotal + item.value) / 100) * 360;
              
              const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = item.value > 50 ? 1 : 0;
              
              return (
                <path
                  key={item.name}
                  d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-lg font-bold text-white">100%</p>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {portfolioData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-400">{item.value.toFixed(1)}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                ${item.amount.toLocaleString()}
              </p>
              <div className="flex items-center">
                {item.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                )}
                <span className={`text-xs ${
                  item.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 