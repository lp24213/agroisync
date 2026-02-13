import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  ExternalLink
} from 'lucide-react';

const BlockchainTransactions = ({ userId }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blockchain/transactions?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setTransactions(data.transactions);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(t('transactions.error', 'Erro ao carregar transações'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, t]);

  const getTransactionIcon = type => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className='h-5 w-5 text-red-500' />;
      case 'receive':
        return <ArrowDownLeft className='h-5 w-5 text-green-500' />;
      default:
        return <Clock className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600' />;
      case 'failed':
        return <AlertCircle className='h-5 w-5 text-red-600' />;
      default:
        return <Clock className='h-5 w-5 text-gray-600' />;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='text-agro-emerald h-8 w-8 animate-spin' />
        <span className='ml-3 text-gray-600 dark:text-gray-300'>
          {t('transactions.loading', 'Carregando transações...')}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'
    >
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          {t('transactions.title', 'Transações Blockchain')}
        </h2>

        <div className='flex space-x-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder={t('transactions.search', 'Buscar...')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className='rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          >
            <option value='all'>{t('transactions.all', 'Todas')}</option>
            <option value='send'>{t('transactions.send', 'Enviadas')}</option>
            <option value='receive'>{t('transactions.receive', 'Recebidas')}</option>
          </select>
        </div>
      </div>

      {error && <div className='mb-4 text-red-500'>{error}</div>}

      {filteredTransactions.length === 0 ? (
        <p className='py-8 text-center text-gray-600 dark:text-gray-400'>
          {t('transactions.noTransactions', 'Nenhuma transação encontrada')}
        </p>
      ) : (
        <div className='space-y-4'>
          {filteredTransactions.map(tx => (
            <div key={tx.id} className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
              <div className='mb-2 flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  {getTransactionIcon(tx.type)}
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>{tx.description}</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{tx.hash}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  {getStatusIcon(tx.status)}
                  <span className='text-sm text-gray-600 dark:text-gray-400'>{tx.status}</span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>{tx.date}</div>

                <div className='flex items-center space-x-2'>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {tx.amount} {tx.currency}
                  </span>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <ExternalLink className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BlockchainTransactions;
