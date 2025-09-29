import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, Loader2, CheckCircle, Clock, AlertCircle, Zap, Shield, Users, ExternalLink } from 'lucide-react';

const Web3Manager = ({ userId }) => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [activeApplications, setActiveApplications] = useState(0);

  const fetchWeb3Data = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/web3?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
        setTotalValue(data.totalValue);
        setActiveApplications(data.activeApplications);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('web3.error', 'Erro ao carregar dados de Web3'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchWeb3Data();
  }, [fetchWeb3Data]);

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600' />;
      case 'completed':
        return <CheckCircle className='h-5 w-5 text-blue-600' />;
      default:
        return <Clock className='h-5 w-5 text-gray-600' />;
    }
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='text-agro-emerald h-8 w-8 animate-spin' />
        <span className='ml-3 text-gray-600 dark:text-gray-300'>
          {t('web3.loading', 'Carregando dados de Web3...')}
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
        <h2 className='flex items-center text-2xl font-bold text-gray-900 dark:text-white'>
          <Globe className='text-agro-emerald mr-2 h-6 w-6' />
          {t('web3.title', 'Web3 Manager')}
        </h2>
      </div>

      {error && (
        <div className='mb-4 flex items-center text-red-500'>
          <AlertCircle className='mr-2 h-5 w-5' />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('web3.totalValue', 'Valor Total')}</p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>${totalValue.toFixed(2)}</p>
            </div>
            <Zap className='h-8 w-8 text-gray-400' />
          </div>
        </div>

        <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('web3.activeApplications', 'Aplicações Ativas')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>{activeApplications}</p>
            </div>
            <Globe className='h-8 w-8 text-gray-400' />
          </div>
        </div>

        <div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('web3.totalApplications', 'Total de Aplicações')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>{applications.length}</p>
            </div>
            <Globe className='h-8 w-8 text-gray-400' />
          </div>
        </div>
      </div>

      {/* Aplicações */}
      {applications.length === 0 ? (
        <div className='py-8 text-center'>
          <Globe className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <p className='mb-4 text-gray-600 dark:text-gray-400'>
            {t('web3.noApplications', 'Nenhuma aplicação encontrada')}
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {applications.map(application => (
            <div key={application.id} className='rounded-lg border border-gray-200 p-6 dark:border-gray-700'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>{application.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{application.description}</p>
                </div>

                <div className='flex items-center space-x-2'>
                  {getStatusIcon(application.status)}
                  <span className='text-sm text-gray-600 dark:text-gray-400'>{application.status}</span>
                </div>
              </div>

              <div className='mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                <div>
                  <p className='text-gray-600 dark:text-gray-400'>{t('web3.value', 'Valor')}:</p>
                  <p className='font-medium text-gray-900 dark:text-white'>${application.value.toFixed(2)}</p>
                </div>

                <div>
                  <p className='text-gray-600 dark:text-gray-400'>{t('web3.users', 'Usuários')}:</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{application.users}</p>
                </div>

                <div>
                  <p className='text-gray-600 dark:text-gray-400'>{t('web3.transactions', 'Transações')}:</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{application.transactions}</p>
                </div>

                <div>
                  <p className='text-gray-600 dark:text-gray-400'>{t('web3.uptime', 'Uptime')}:</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{application.uptime}%</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {t('web3.lastActivity', 'Última Atividade')}: {application.lastActivity}
                </div>

                <div className='flex space-x-2'>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <Shield className='h-4 w-4' />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                    <Users className='h-4 w-4' />
                  </button>
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

export default Web3Manager;
