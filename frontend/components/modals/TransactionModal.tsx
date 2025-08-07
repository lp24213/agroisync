'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Transaction {
  hash: string;
  type: 'stake' | 'unstake' | 'claim' | 'transfer';
  amount?: number;
  token?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  if (!transaction) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stake':
        return 'bg-[#00FF00]/20 text-[#00FF00]';
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
        return 'Stake';
      case 'unstake':
        return 'Unstake';
      case 'claim':
        return 'Claim';
      case 'transfer':
        return 'Transfer';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#00FF00]/20 text-[#00FF00]';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Hash copiado para a área de transferência!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Transação">
      <div className="space-y-6">
        {/* Transaction Type */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Tipo:</span>
          <Badge className={getTypeColor(transaction.type)}>
            {getTypeText(transaction.type)}
          </Badge>
        </div>

        {/* Amount */}
        {transaction.amount && transaction.token && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Quantidade:</span>
            <span className="text-white font-semibold">
              {transaction.amount} {transaction.token}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status:</span>
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status}
          </Badge>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Data/Hora:</span>
          <span className="text-white">
            {transaction.timestamp.toLocaleString('pt-BR')}
          </span>
        </div>

        {/* Transaction Hash */}
        <div>
          <span className="text-gray-400 block mb-2">Hash da Transação:</span>
          <div className="flex items-center gap-2">
            <code className="bg-agro-dark px-3 py-2 rounded text-sm text-white flex-1 break-all">
              {transaction.hash}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(transaction.hash)}
            >
              Copiar
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fechar
          </Button>
          {transaction.status === 'confirmed' && (
            <Button variant="primary" className="flex-1">
              Ver no Explorer
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
} 