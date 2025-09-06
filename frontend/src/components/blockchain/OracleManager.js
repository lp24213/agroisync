import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Database, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const OracleManager = ({ userId }) => {
  const { t } = useTranslation();
  const [oracles, setOracles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [activeOracles, setActiveOracles] = useState(0);

  useEffect(() => {
    fetchOracleData();
  }, [userId]);

  const fetchOracleData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/oracles?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setOracles(data.oracles);
        setTotalDataPoints(data.totalDataPoints);
        setActiveOracles(data.activeOracles);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('oracle.error', 'Erro ao carregar dados de oráculos'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
    return <Clock className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('oracle.loading', 'Carregando dados de oráculos...')}
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
          <Database className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('oracle.title', 'Oracle Manager')}
        </h2>
        
        <button
          onClick={fetchOracleData}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
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
                {t('oracle.totalDataPoints', 'Total de Pontos de Dados')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalDataPoints.toLocaleString()}
              </p>
            </div>
            <Database className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('oracle.activeOracles', 'Oráculos Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeOracles}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('oracle.totalOracles', 'Total de Oráculos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {oracles.length}
              </p>
            </div>
            <Database className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Oráculos */}
      {oracles.length === 0 ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('oracle.noOracles', 'Nenhum oráculo encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {oracles.map((oracle) => (
            <div key={oracle.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {oracle.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {oracle.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(oracle.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {oracle.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('oracle.currentValue', 'Valor Atual')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {oracle.currentValue}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('oracle.change', 'Mudança')}:
                  </p>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(oracle.change)}
                    <span className={`font-medium ${oracle.change > 0 ? 'text-green-600' : oracle.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {oracle.change > 0 ? '+' : ''}{oracle.change}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('oracle.updateFrequency', 'Frequência de Atualização')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {oracle.updateFrequency}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('oracle.lastUpdate', 'Última Atualização')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {oracle.lastUpdate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('oracle.dataSource', 'Fonte de Dados')}: {oracle.dataSource}
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OracleManager;
