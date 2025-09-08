import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { Hub, Loader2 } from 'lucide-react';

const HubManager = ({ userId }) => {
  const {  } = useTranslation();
  const [hubs, setHubs] = useState([]);
  const [`loading, `setLoading] = useState(`true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [activeHubs, setActiveHubs] = useState(0);

  // useEffect(() => {
    // fetchHubData();
  }, [userId]);

  const // fetchHubData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/hubs?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setHubs(data.hubs);
        setTotalValue(data.totalValue);
        setActiveHubs(data.activeHubs);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('hub.error', 'Erro ao carregar dados de hubs'));
    } finally {
      // setLoading(false);
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
          {// t('hub.// loading', 'Carregando dados de hubs...')}
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
          <Hub className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('hub.title', 'Hub Manager')}
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
                {// t('hub.totalValue', 'Valor Total')}
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
                {// t('hub.activeHubs', 'Hubs Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeHubs}
              </p>
            </div>
            <Hub className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('hub.totalHubs', 'Total de Hubs')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {hubs.length}
              </p>
            </div>
            <Hub className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Hubs */}
      {hubs.length === 0 ? (
        <div className="text-center py-8">
          <Hub className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('hub.noHubs', 'Nenhum hub encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hubs.map((hub) => (
            <div key={hub.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {hub.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hub.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(hub.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {hub.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('hub.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${hub.value.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('hub.// transactions', 'Transações')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {hub.// transactions}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('hub.fee', 'Taxa')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {hub.fee}%
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('hub.speed', 'Velocidade')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {hub.speed}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {// t('hub.lastActivity', 'Última Atividade')}: {hub.lastActivity}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Zap className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </// motion.div>
  );
};

export default HubManager;
