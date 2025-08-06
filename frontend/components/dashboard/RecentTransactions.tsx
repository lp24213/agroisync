'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'transfer';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { t } = useTranslation('common');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stake':
        return 'bg-green-500/20 text-green-400';
      case 'unstake':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'claim':
        return 'bg-blue-500/20 text-blue-400';
      case 'transfer':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'stake':
        return t('stake');
      case 'unstake':
        return t('unstake');
      case 'claim':
        return t('claim');
      case 'transfer':
        return t('transfer');
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('confirmed');
      case 'pending':
        return t('pending');
      case 'failed':
        return t('failed');
      default:
        return status;
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{t('recentTransactions')}</h2>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">{t('noTransactionsFound')}</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-agro-dark/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="default" className={getTypeColor(tx.type)}>
                  {getTypeText(tx.type)}
                </Badge>
                <div>
                  <p className="text-white font-semibold">
                    {tx.amount} {tx.token}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {tx.timestamp.toLocaleDateString('pt-BR')} {tx.timestamp.toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge variant="default" className={getStatusColor(tx.status)}>
                  {getStatusText(tx.status)}
                </Badge>
                <p className="text-gray-400 text-xs mt-1">
                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
} 