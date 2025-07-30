'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { validation } from '@/utils/validation';

interface Stat {
  id: string;
  label: string;
  value: number;
  unit: string;
  change?: number;
}

const stats: Stat[] = [
  {
    id: '1',
    label: 'Total Value Locked',
    value: 12500000,
    unit: 'USD',
    change: 2.5,
  },
  {
    id: '2',
    label: 'Usuários Ativos',
    value: 25430,
    unit: '',
    change: 12.3,
  },
  {
    id: '3',
    label: 'APR Médio',
    value: 18.5,
    unit: '%',
    change: -0.3,
  },
  {
    id: '4',
    label: 'Transações Totais',
    value: 156789,
    unit: '',
    change: 8.7,
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-agro-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Números Impressionantes
          </h2>
          <p className="text-xl text-gray-400">
            Nossa plataforma em números
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.id} className="text-center">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {validation.formatNumber(stat.value)}
                  {stat.unit && <span className="text-gray-400 ml-1">{stat.unit}</span>}
                </h3>
              </div>
              <p className="text-gray-400 mb-2">{stat.label}</p>
              {stat.change !== undefined && (
                <div className={`text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change >= 0 ? '+' : ''}{validation.formatPercentage(stat.change)}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 