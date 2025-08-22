'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wheat, Leaf, Coffee, TreePine } from 'lucide-react';

interface GrainsPriceCardProps {
  data: {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    unit: string;
  };
  delay: number;
}

export function GrainsPriceCard({ data, delay }: GrainsPriceCardProps) {
  const isPositive = data.change24h >= 0;
  
  const getIcon = (symbol: string) => {
    switch (symbol) {
      case 'SOJA': return Leaf;
      case 'MILHO': return TreePine;
      case 'TRIGO': return Wheat;
      case 'CAFE': return Coffee;
      default: return Wheat;
    }
  };

  const getColor = (symbol: string) => {
    switch (symbol) {
      case 'SOJA': return 'from-green-400 to-emerald-600';
      case 'MILHO': return 'from-yellow-400 to-orange-600';
      case 'TRIGO': return 'from-amber-400 to-yellow-600';
      case 'CAFE': return 'from-brown-400 to-amber-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const IconComponent = getIcon(data.symbol);
  const colorClass = getColor(data.symbol);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-400/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{data.name}</h3>
            <p className="text-gray-400 text-sm">{data.symbol}</p>
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
        <div className="text-3xl font-bold text-white mb-2">
          R$ {data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-400 mb-2">por {data.unit}</div>
        <div className={`text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
        </div>
      </div>
      
      {/* Volume */}
      <div className="text-gray-400 text-sm">
        Volume: {(data.volume / 1000).toFixed(1)}k {data.unit}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
