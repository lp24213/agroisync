import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Loader2, Clock, CheckCircle, AlertCircle, Search, ExternalLink } from 'lucide-react';

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

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('transactions.loading', 'Carregando transações...')}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('transactions.title', 'Transações Blockchain')}
        </h2>
        
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('transactions.search', 'Buscar...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t('transactions.all', 'Todas')}</option>
            <option value="send">{t('transactions.send', 'Enviadas')}</option>
            <option value="receive">{t('transactions.receive', 'Recebidas')}</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          {t('transactions.noTransactions', 'Nenhuma transação encontrada')}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tx.description}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tx.hash}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tx.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {tx.date}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tx.amount} {tx.currency}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <ExternalLink className="w-4 h-4" />
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
