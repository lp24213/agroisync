'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple';
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon, 
  trend = 'neutral',
  color = 'blue' 
}: MetricsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-400 bg-green-500/20';
      case 'blue':
        return 'text-blue-400 bg-blue-500/20';
      case 'red':
        return 'text-red-400 bg-red-500/20';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'purple':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
              <span className="text-xl">{icon}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        
        {change !== undefined && (
          <div className="text-right">
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              <span>{getTrendIcon()}</span>
              <span className="text-sm font-semibold">
                {change >= 0 ? '+' : ''}{change}%
              </span>
            </div>
            {changeLabel && (
              <p className="text-xs text-gray-400">{changeLabel}</p>
            )}
          </div>
        )}
      </div>
      
      {trend !== 'neutral' && (
        <div className="flex items-center gap-2">
          <Badge 
            variant="default" 
            className={trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
          >
            {trend === 'up' ? 'Crescendo' : 'Decrescendo'}
          </Badge>
        </div>
      )}
    </Card>
  );
} 