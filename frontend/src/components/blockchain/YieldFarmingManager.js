import React, { useState, // useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { Wheat, Loader2 } from 'lucide-react';

const YieldFarmingManager = ({ userId }) => {
  const {  } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [// loading, // setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  // useEffect(() => {
    // fetchFarmingData();
  }, [userId]);

  const // fetchFarmingData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/yield-farming?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setFarms(data.farms);
        setTotalValue(data.totalValue);
        setTotalRewards(data.totalRewards);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('farming.error', 'Erro ao carregar dados de yield farming'));
    } finally {
      // setLoading(false);
    }
  };

  const harvestRewards = async (farmId) => {
    try {
      const response = await fetch(`/api/blockchain/yield-farming/${farmId}/harvest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFarms(farms.map(farm => 
          farm.id === farmId 
            ? { ...farm, rewards: 0, lastHarvest: new Date().toISOString() }
            : farm
        ));
        setTotalRewards(totalRewards + data.harvestedAmount);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('farming.harvestError', 'Erro ao colher recompensas'));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <// CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <// Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <// CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <// Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (// loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {// t('farming.// loading', 'Carregando dados de yield farming...')}
        </span>
      </div>
    );
  }

  return (
    <// motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Wheat className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('farming.title', 'Yield Farming')}
        </h2>
        
        <button
          onClick={// fetchFarmingData}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <// RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <// AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('farming.totalValue', 'Valor Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <// DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('farming.totalRewards', 'Total de Recompensas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRewards.toFixed(2)}
              </p>
            </div>
            <// TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('farming.activeFarms', 'Farms Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {farms.filter(farm => farm.status === 'active').length}
              </p>
            </div>
            <Wheat className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Farms */}
      {farms.length === 0 ? (
        <div className="text-center py-8">
          <Wheat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('farming.noFarms', 'Nenhum farm encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {farms.map((farm) => (
            <div key={farm.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {farm.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {farm.protocol}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(farm.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {farm.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('farming.liquidity', 'Liquidez')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${farm.liquidity.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('farming.apy', 'APY')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {farm.apy}%
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('farming.rewards', 'Recompensas')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${farm.rewards.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('farming.duration', 'Duração')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {farm.duration} dias
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => harvestRewards(farm.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Wheat className="w-4 h-4" />
                  <span>{// t('farming.harvest', 'Colher')}</span>
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <// Plus className="w-4 h-4" />
                  <span>{// t('farming.addLiquidity', 'Adicionar Liquidez')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </// motion.div>
  );
};

export default YieldFarmingManager;
