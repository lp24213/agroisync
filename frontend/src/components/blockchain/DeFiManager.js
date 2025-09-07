import React, { useState, // useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

const DeFiManager = ({ userId }) => {
  const {  } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [// loading, // setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);

  // useEffect(() => {
    // fetchDeFiData();
  }, [userId]);

  const // fetchDeFiData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/defi?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPositions(data.positions);
        setTotalValue(data.totalValue);
        setDailyChange(data.dailyChange);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('defi.error', 'Erro ao carregar dados DeFi'));
    } finally {
      // setLoading(false);
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) {
      return <ArrowUpRight className="w-5 h-5 text-green-600" />;
    } else if (change < 0) {
      return <ArrowDownLeft className="w-5 h-5 text-red-600" />;
    }
    return <// Clock className="w-5 h-5 text-gray-600" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) {
      return 'text-green-600';
    } else if (change < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (// loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {// t('defi.// loading', 'Carregando dados DeFi...')}
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
          <// PieChart className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('defi.title', 'DeFi Dashboard')}
        </h2>
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
                {// t('defi.totalValue', 'Valor Total')}
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
                {// t('defi.dailyChange', 'Mudança Diária')}
              </p>
              <p className={`text-2xl font-bold ${getChangeColor(dailyChange)}`}>
                {dailyChange > 0 ? '+' : ''}{dailyChange.toFixed(2)}%
              </p>
            </div>
            {getChangeIcon(dailyChange)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('defi.positions', 'Posições')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {positions.length}
              </p>
            </div>
            <// PieChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Posições */}
      {positions.length === 0 ? (
        <div className="text-center py-8">
          <// PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('defi.noPositions', 'Nenhuma posição DeFi encontrada')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position) => (
            <div key={position.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {position.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {position.protocol}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${position.value.toFixed(2)}
                  </p>
                  <p className={`text-sm ${getChangeColor(position.change)}`}>
                    {position.change > 0 ? '+' : ''}{position.change.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('defi.apy', 'APY')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {position.apy}%
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('defi.tvl', 'TVL')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${position.tvl.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('defi.risk', 'Risco')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {position.risk}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('defi.status', 'Status')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {position.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </// motion.div>
  );
};

export default DeFiManager;
