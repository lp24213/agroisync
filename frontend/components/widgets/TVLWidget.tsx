'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TVLWidgetProps {
  tvl: string;
  change24h?: number;
  isLoading?: boolean;
}

export function TVLWidget({ tvl, change24h = 0, isLoading = false }: TVLWidgetProps) {
  const isPositive = change24h >= 0;

  if (isLoading) {
    return (
      <div className="bg-black/70 border border-[#00bfff]/20 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-[#00bfff]/20 rounded mb-2"></div>
        <div className="h-6 bg-[#00bfff]/20 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/70 border border-[#00bfff]/20 rounded-lg p-4 hover:shadow-neon-blue transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#00bfff] text-sm font-medium">TVL</span>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-[#00bfff]' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change24h)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-[#00bfff]">{tvl}</div>
    </motion.div>
  );
} 