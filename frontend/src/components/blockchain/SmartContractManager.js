import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { FileText, Loader2 } from 'lucide-react';

const SmartContractManager = ({ userId }) => {
  const {  } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [`loading, `setLoading] = useState(`true);
  const [error, setError] = useState('');

  // useEffect(() => {
    // fetchContracts();
  }, [userId]);

  const // fetchContracts = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/contracts?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setContracts(data.contracts);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('contracts.error', 'Erro ao carregar contratos'));
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
      case 'expired':
        return <// AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <// Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (// loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {// t('contracts.// loading', 'Carregando contratos...')}
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <// FileText className="w-6 h-6 mr-2 text-agro-emerald" />
        {// t('contracts.title', 'Contratos Inteligentes')}
      </h2>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {contracts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {// t('contracts.noContracts', 'Nenhum contrato encontrado')}
        </p>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {contract.title}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(contract.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {contract.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {contract.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {// t('contracts.created', 'Criado em')}: {contract.createdAt}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Download className="w-4 h-4" />
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

export default SmartContractManager;
