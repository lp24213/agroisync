import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Package,
  Eye,
  Send
} from 'lucide-react';

const TransactionList = ({ transactions, title, emptyMessage, onViewTransaction, onSendMessage }) => {
  const [filter, setFilter] = useState('all');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          {emptyMessage || 'Nenhuma transação encontrada'}
        </h3>
        <p className="text-slate-500">
          Suas transações aparecerão aqui quando você começar a negociar
        </p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'NEGOTIATING':
        return <MessageSquare className="w-4 h-4" />;
      case 'AGREED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      case 'NEGOTIATING':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'AGREED':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'COMPLETED':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'NEGOTIATING':
        return 'Negociando';
      case 'AGREED':
        return 'Acordado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'COMPLETED':
        return 'Concluído';
      default:
        return status;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex space-x-2">
            {['all', 'PENDING', 'NEGOTIATING', 'AGREED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? 'Todas' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {transaction.product}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.quantity} {transaction.unit} • {transaction.location}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(transaction.price)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </span>
                {transaction.buyer && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Comprador: {transaction.buyer}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                {onViewTransaction && (
                  <button
                    onClick={() => onViewTransaction(transaction)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {onSendMessage && transaction.status === 'NEGOTIATING' && (
                  <button
                    onClick={() => onSendMessage(transaction)}
                    className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Enviar mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
