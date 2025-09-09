import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, Clock, Unlock, AlertCircle, TrendingUp, Plus, Minus } from 'lucide-react';

const StakingManager = ({ userId }) => {
  const { t } = useTranslation();
  const [stakes, setStakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

useEffect(() => {
fetchStakingData();
  }, [userId]);

  const fetchStakingData = async () => {
setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/staking?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setStakes(data.stakes);
        setTotalStaked(data.totalStaked);
        setTotalRewards(data.totalRewards);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('staking.error', 'Erro ao carregar dados de staking'));
    } finally {
setLoading(false);
    }
  };

  const stakeTokens = async (amount, currency) => {
    try {
      const response = await fetch('/api/blockchain/staking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ amount, currency, userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStakes([...stakes, data.stake]);
        setTotalStaked(totalStaked + amount);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('staking.stakeError', 'Erro ao fazer stake'));
    }
  };

  const unstakeTokens = async (stakeId) => {
    try {
      const response = await fetch(`/api/blockchain/staking/${stakeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStakes(stakes.filter(stake => stake.id !== stakeId));
        setTotalStaked(totalStaked - data.amount);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('staking.unstakeError', 'Erro ao fazer unstake'));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <Unlock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('staking.loading', 'Carregando dados de staking...')}
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Lock className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('staking.title', 'Staking')}
        </h2>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('staking.totalStaked', 'Total em Stake')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalStaked.toFixed(2)}
              </p>
            </div>
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('staking.totalRewards', 'Total de Recompensas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRewards.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('staking.activeStakes', 'Stakes Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stakes.filter(stake => stake.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stakes */}
      {stakes.length === 0 ? (
        <div className="text-center py-8">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('staking.noStakes', 'Nenhum stake encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stakes.map((stake) => (
            <div key={stake.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {stake.currency} Stake
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stake.protocol}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(stake.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stake.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('staking.amount', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${stake.amount.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('staking.apy', 'APY')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stake.apy}%
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('staking.rewards', 'Recompensas')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${stake.rewards.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('staking.duration', 'Duração')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stake.duration} dias
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => stakeTokens(100, stake.currency)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('staking.addMore', 'Adicionar Mais')}</span>
                </button>
                <button
                  onClick={() => unstakeTokens(stake.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Minus className="w-4 h-4" />
                  <span>{t('staking.unstake', 'Fazer Unstake')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StakingManager;


