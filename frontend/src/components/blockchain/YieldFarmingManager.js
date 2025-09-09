import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Wheat, Loader2, CheckCircle, Clock, RefreshCw, AlertCircle, DollarSign, TrendingUp, Plus } from 'lucide-react';

const YieldFarmingManager = ({ userId }) => {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  const fetchFarmingData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/yield-farming?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setFarms(data.farms || []);
        setTotalValue(data.totalValue || 0);
        setTotalRewards(data.totalRewards || 0);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('farming.error', 'Erro ao carregar dados de yield farming'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchFarmingData();
  }, [fetchFarmingData]);

  const harvestRewards = async (farmId) => {
    try {
      const response = await fetch(`/api/blockchain/yield-farming/${farmId}/harvest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchFarmingData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('farming.harvestError', 'Erro ao colher recompensas'));
    }
  };

  const addLiquidity = async (farmId, amount) => {
    try {
      const response = await fetch(`/api/blockchain/yield-farming/${farmId}/add-liquidity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchFarmingData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('farming.addLiquidityError', 'Erro ao adicionar liquidez'));
    }
  };

  const removeLiquidity = async (farmId, amount) => {
    try {
      const response = await fetch(`/api/blockchain/yield-farming/${farmId}/remove-liquidity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchFarmingData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('farming.removeLiquidityError', 'Erro ao remover liquidez'));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
          <span className="text-gray-600">{t('farming.loading', 'Carregando dados...')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchFarmingData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('common.tryAgain', 'Tentar Novamente')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
            <Wheat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('farming.title', 'Yield Farming')}
            </h2>
            <p className="text-gray-600">
              {t('farming.subtitle', 'Gerencie suas posições de liquidez')}
            </p>
          </div>
        </div>
        <button
          onClick={fetchFarmingData}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('farming.totalValue', 'Valor Total')}</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('farming.totalRewards', 'Recompensas Totais')}</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRewards)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wheat className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('farming.activeFarms', 'Farms Ativas')}</p>
              <p className="text-xl font-bold text-gray-900">{farms.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farms List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('farming.myFarms', 'Minhas Farms')}
        </h3>
        
        {farms.length === 0 ? (
          <div className="text-center py-12">
            <Wheat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {t('farming.noFarms', 'Nenhuma farm ativa')}
            </h4>
            <p className="text-gray-600 mb-4">
              {t('farming.noFarmsDescription', 'Comece adicionando liquidez a uma farm para começar a ganhar recompensas.')}
            </p>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              {t('farming.addLiquidity', 'Adicionar Liquidez')}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {farms.map((farm) => (
              <motion.div
                key={farm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{farm.name}</h4>
                    <p className="text-sm text-gray-600">{farm.pair}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('farming.apy', 'APY')}</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPercentage(farm.apy)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('farming.liquidity', 'Liquidez')}</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(farm.liquidity)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('farming.rewards', 'Recompensas')}</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(farm.rewards)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('farming.duration', 'Duração')}</p>
                    <p className="font-semibold text-gray-900">{farm.duration} dias</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('farming.status', 'Status')}</p>
                    <div className="flex items-center gap-1">
                      {farm.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {farm.status === 'active' ? t('farming.active', 'Ativa') : t('farming.pending', 'Pendente')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => harvestRewards(farm.id)}
                    disabled={farm.rewards <= 0}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('farming.harvest', 'Colher')}
                  </button>
                  <button
                    onClick={() => addLiquidity(farm.id, 1000)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('farming.addMore', 'Adicionar')}
                  </button>
                  <button
                    onClick={() => removeLiquidity(farm.id, 500)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('farming.remove', 'Remover')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldFarmingManager;

