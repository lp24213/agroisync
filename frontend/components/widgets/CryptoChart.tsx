'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  changePercent7d?: string;
  icon: string;
  color: string;
}

const cryptoList: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: '45000',
    changePercent24Hr: '2.5',
    icon: '₿',
    color: '#F7931A'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: '3200',
    changePercent24Hr: '1.8',
    icon: 'Ξ',
    color: '#627EEA'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: '95',
    changePercent24Hr: '5.2',
    icon: '◎',
    color: '#14F195'
  },
  {
    id: 'matic-network',
    symbol: 'MATIC',
    name: 'Polygon',
    priceUsd: '0.85',
    changePercent24Hr: '3.1',
    icon: '◊',
    color: '#8247E5'
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    priceUsd: '1.00',
    changePercent24Hr: '0.0',
    icon: '₮',
    color: '#26A17B'
  },
  {
    id: 'agrotm',
    symbol: 'AGROTM',
    name: 'AGROTM',
    priceUsd: '0.85',
    changePercent24Hr: '12.5',
    icon: '🌾',
    color: '#00FF7F'
  }
];

export function CryptoChart() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(cryptoList);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate data loading
    setCryptoData(cryptoList);
  }, []);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${numPrice.toFixed(6)}`;
    }
  };

  const formatChange = (change: string) => {
    const numChange = parseFloat(change);
    return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  };

  const getChangeColor = (change: string) => {
    const numChange = parseFloat(change);
    return numChange >= 0 ? 'text-premium-neon-green' : 'text-red-400';
  };

  const getChangeIcon = (change: string) => {
    const numChange = parseFloat(change);
    return numChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const generateChartData = () => {
    // Generate mock data for demo
    const data = [];
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      data.push({
        time: now - (23 - i) * (timeframe === '24h' ? 3600000 : 86400000),
        price: Math.random() * 1000 + 50000
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-6 shadow-2xl shadow-premium-neon-blue/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white mb-1">
            {t('dashboard.crypto.title')}
          </h3>
          <p className="text-gray-400 text-sm font-orbitron">
            Preços em tempo real
          </p>
        </div>
        <Activity className="w-6 h-6 text-premium-neon-blue" />
      </div>

      {/* Crypto List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {cryptoData.map((crypto) => (
          <motion.button
            key={crypto.id}
            onClick={() => setSelectedCrypto(crypto.id)}
            className={`p-3 rounded-xl border transition-all duration-300 ${
              selectedCrypto === crypto.id
                ? 'border-premium-neon-blue bg-premium-neon-blue/10'
                : 'border-premium-neon-blue/20 hover:border-premium-neon-blue/40'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: crypto.color }}
              >
                {crypto.icon}
              </div>
              <span className="text-white font-orbitron font-medium text-sm">
                {crypto.symbol}
              </span>
            </div>
            <div className="text-left">
              <p className="text-white font-orbitron text-sm font-bold">
                {formatPrice(crypto.priceUsd)}
              </p>
              <div className={`flex items-center space-x-1 text-xs ${getChangeColor(crypto.changePercent24Hr)}`}>
                {getChangeIcon(crypto.changePercent24Hr)}
                <span className="font-orbitron">
                  {formatChange(crypto.changePercent24Hr)}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-premium-black/30 rounded-xl p-4 border border-premium-neon-blue/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: cryptoData.find(c => c.id === selectedCrypto)?.color }}
            >
              {cryptoData.find(c => c.id === selectedCrypto)?.icon}
            </div>
            <div>
              <h4 className="text-white font-orbitron font-bold">
                {cryptoData.find(c => c.id === selectedCrypto)?.name}
              </h4>
              <p className="text-gray-400 text-sm font-orbitron">
                {formatPrice(cryptoData.find(c => c.id === selectedCrypto)?.priceUsd || '0')}
              </p>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-premium-black/50 rounded-lg p-1 border border-premium-neon-blue/20">
            <button
              onClick={() => setTimeframe('24h')}
              className={`px-3 py-1 rounded-md text-xs font-orbitron transition-all ${
                timeframe === '24h'
                  ? 'bg-premium-neon-blue text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-md text-xs font-orbitron transition-all ${
                timeframe === '7d'
                  ? 'bg-premium-neon-blue text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              7d
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32 relative">
          <div className="relative h-full">
            {/* Chart Line */}
            <svg className="w-full h-full" viewBox={`0 0 ${chartData.length * 20} 120`}>
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00FF7F" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00FF7F" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area */}
              <path
                d={`M 0 ${120 - (chartData[0]?.price || 0) / 10} ${chartData.map((point, i) => 
                  `L ${i * 20} ${120 - point.price / 10}`
                ).join(' ')} L ${(chartData.length - 1) * 20} 120 Z`}
                fill="url(#chartGradient)"
              />
              
              {/* Line */}
              <path
                d={`M 0 ${120 - (chartData[0]?.price || 0) / 10} ${chartData.map((point, i) => 
                  `L ${i * 20} ${120 - point.price / 10}`
                ).join(' ')}`}
                stroke="#00FF7F"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Change Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-premium-neon-blue/10">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-premium-neon-blue" />
            <span className="text-gray-400 text-sm font-orbitron">
              {t('dashboard.crypto.price')}
            </span>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor(cryptoData.find(c => c.id === selectedCrypto)?.changePercent24Hr || '0')}`}>
            {getChangeIcon(cryptoData.find(c => c.id === selectedCrypto)?.changePercent24Hr || '0')}
            <span className="font-orbitron font-medium">
              {formatChange(cryptoData.find(c => c.id === selectedCrypto)?.changePercent24Hr || '0')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
