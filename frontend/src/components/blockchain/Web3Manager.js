import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  Zap, 
  Users,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus,
  ExternalLink
} from 'lucide-react';

const Web3Manager = ({ userId }) => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [activeApplications, setActiveApplications] = useState(0);

  useEffect(() => {
    fetchWeb3Data();
  }, [userId]);

  const fetchWeb3Data = async () => {
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
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('web3.loading', 'Carregando dados de Web3...')}
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
          <Globe className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('web3.title', 'Web3 Manager')}
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
                {t('web3.totalValue', 'Valor Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('web3.activeApplications', 'Aplicações Ativas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeApplications}
              </p>
            </div>
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('web3.totalApplications', 'Total de Aplicações')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.length}
              </p>
            </div>
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Aplicações */}
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('web3.noApplications', 'Nenhuma aplicação encontrada')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {application.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {application.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(application.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {application.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('web3.value', 'Valor')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${application.value.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('web3.users', 'Usuários')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {application.users}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('web3.transactions', 'Transações')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {application.transactions}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('web3.uptime', 'Uptime')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {application.uptime}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('web3.lastActivity', 'Última Atividade')}: {application.lastActivity}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Shield className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Users className="w-4 h-4" />
                  </button>
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

export default Web3Manager;
