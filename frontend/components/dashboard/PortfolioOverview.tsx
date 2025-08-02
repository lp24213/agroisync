'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { validation } from '../../lib/utils';

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
}

interface PortfolioOverviewProps {
  totalValue: number;
  change24h: number;
  assets: PortfolioAsset[];
}

export function PortfolioOverview({ totalValue, change24h, assets }: PortfolioOverviewProps) {
  const isPositive = change24h >= 0;

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Visão Geral do Portfólio</h2>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-3xl font-bold text-white">
              {validation.formatCurrency(totalValue)}
            </p>
            <p className="text-gray-400">Valor Total</p>
          </div>
          <div className={`text-lg font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{validation.formatPercentage(change24h)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Seus Ativos</h3>
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between p-4 bg-agro-dark/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-agro-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{asset.symbol[0]}</span>
              </div>
              <div>
                <p className="text-white font-semibold">{asset.symbol}</p>
                <p className="text-gray-400 text-sm">{asset.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white font-semibold">
                {validation.formatCurrency(asset.value)}
              </p>
              <p className="text-gray-400 text-sm">
                {validation.formatNumber(asset.balance)} {asset.symbol}
              </p>
            </div>
            
            <div className={`text-sm font-semibold ${
              asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {asset.change24h >= 0 ? '+' : ''}{validation.formatPercentage(asset.change24h)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 