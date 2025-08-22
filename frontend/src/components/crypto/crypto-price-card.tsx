'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoPriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  onClick: () => void;
}

export function CryptoPriceCard({ symbol, name, price, change24h, changePercent24h, onClick }: CryptoPriceCardProps) {
  const isPositive = changePercent24h >= 0;
  const formattedPrice = price >= 1 ? 
    `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
    `$${price.toFixed(6)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/20 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">{symbol}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{symbol}</h3>
            <p className="text-gray-400 text-sm">{name}</p>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-green-400" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-400" />
        )}
      </div>
      
      {/* Price */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-white mb-2">{formattedPrice}</div>
        <div className={`text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{changePercent24h.toFixed(2)}%
        </div>
      </div>
      
      {/* Change 24h */}
      <div className="text-gray-400 text-sm">
        Variação 24h: {isPositive ? '+' : ''}{change24h.toFixed(2)}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
