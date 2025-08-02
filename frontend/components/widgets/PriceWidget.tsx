'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { validation } from '../../lib/utils';

interface PriceWidgetProps {
  price: number;
  change24h?: number;
  symbol?: string;
  isLoading?: boolean;
}

export function PriceWidget({ 
  price, 
  change24h = 0, 
  symbol = 'AGRO', 
  isLoading = false 
}: PriceWidgetProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
      </Card>
    );
  }

  const isPositive = change24h >= 0;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400">Preço {symbol}</h3>
          <p className="text-2xl font-bold text-white">
            {validation.formatCurrency(price)}
          </p>
        </div>
        {change24h !== 0 && (
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{validation.formatPercentage(change24h)}
          </div>
        )}
      </div>
    </Card>
  );
} 