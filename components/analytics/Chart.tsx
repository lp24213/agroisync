'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'bar' | 'pie';
  height?: number;
}

export function Chart({ title, data, type = 'line', height = 300 }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <div className="relative" style={{ height }}>
        {type === 'line' && (
          <div className="flex items-end justify-between h-full">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-agro-blue rounded-t"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {type === 'bar' && (
          <div className="flex items-end justify-between h-full">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 bg-agro-green rounded-t"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {type === 'pie' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-agro-blue flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">
                  {Math.round((data[0]?.value || 0) / maxValue * 100)}%
                </span>
              </div>
              <p className="text-gray-400">{data[0]?.label}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{item.label}</span>
            <span className="text-white font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
} 