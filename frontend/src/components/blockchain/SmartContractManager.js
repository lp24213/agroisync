import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileCode, Loader2, CheckCircle, Clock, AlertCircle, Eye, Copy, Download, FileText } from 'lucide-react';

const SmartContractManager = ({ userId }) => {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/contracts?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setContracts(data.contracts);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('contracts.error', 'Erro ao carregar contratos'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600' />;
      case 'expired':
        return <AlertCircle className='h-5 w-5 text-red-600' />;
      default:
        return <Clock className='h-5 w-5 text-gray-600' />;
    }
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='text-agro-emerald h-8 w-8 animate-spin' />
        <span className='ml-3 text-gray-600 dark:text-gray-300'>
          {t('contracts.loading', 'Carregando contratos...')}
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
      <h2 className='mb-4 flex items-center text-2xl font-bold text-gray-900 dark:text-white'>
        <FileText className='text-agro-emerald mr-2 h-6 w-6' />
        {t('contracts.title', 'Contratos Inteligentes')}
      </h2>

      {error && <div className='mb-4 text-red-500'>{error}</div>}

      {contracts.length === 0 ? (
        <p className='text-gray-600 dark:text-gray-400'>{t('contracts.noContracts', 'Nenhum contrato encontrado')}</p>
      ) : (
        <div className='space-y-4'>
          {contracts.map(contract => (
            <div key={contract.id} className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
              <div className='mb-2 flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900 dark:text-white'>{contract.title}</h3>
                <div className='flex items-center space-x-2'>
                  {getStatusIcon(contract.status)}
                  <span className='text-sm text-gray-600 dark:text-gray-400'>{contract.status}</span>
                </div>
              </div>

              <p className='mb-3 text-gray-600 dark:text-gray-400'>{contract.description}</p>

              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {t('contracts.created', 'Criado em')}: {contract.createdAt}
                </div>

                <div className='flex space-x-2'>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <Eye className='h-4 w-4' />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <Copy className='h-4 w-4' />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <Download className='h-4 w-4' />
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

export default SmartContractManager;
