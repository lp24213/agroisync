'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoPriceCardProps {
  data: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
  };
  delay: number;
}

export function CryptoPriceCard({ data, delay }: CryptoPriceCardProps) {
  const isPositive = data.change24h >= 0;
  const formattedPrice = data.price >= 1 ? 
    `$${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
    `$${data.price.toFixed(6)}`;
  
  const formattedVolume = data.volume >= 1000000000 ? 
    `$${(data.volume / 1000000000).toFixed(1)}B` :
    data.volume >= 1000000 ? 
    `$${(data.volume / 1000000).toFixed(1)}M` :
    `$${(data.volume / 1000).toFixed(1)}K`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">{data.symbol}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{data.symbol}</h3>
            <p className="text-gray-400 text-sm">
              {data.symbol === 'BTC' ? 'Bitcoin' :
               data.symbol === 'ETH' ? 'Ethereum' :
               data.symbol === 'SOL' ? 'Solana' :
               data.symbol === 'USDT' ? 'Tether' :
               'Real Brasileiro'}
            </p>
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
          {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
        </div>
      </div>
      
      {/* Volume */}
      <div className="text-gray-400 text-sm">
        Volume: {formattedVolume}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
