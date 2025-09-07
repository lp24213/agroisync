import React, { useState, // useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { Users, Share, Loader2 } from 'lucide-react';

const SocialFiManager = ({ userId }) => {
  const {  } = useTranslation();
  const [platforms, setPlatforms] = useState([]);
  const [// loading, // setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activePlatforms, setActivePlatforms] = useState(0);

  // useEffect(() => {
    // fetchSocialFiData();
  }, [userId]);

  const // fetchSocialFiData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/socialfi?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPlatforms(data.platforms);
        setTotalEarnings(data.totalEarnings);
        setActivePlatforms(data.activePlatforms);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('socialfi.error', 'Erro ao carregar dados de SocialFi'));
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
          {// t('socialfi.// loading', 'Carregando dados de SocialFi...')}
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
          <// Users className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('socialfi.title', 'SocialFi Manager')}
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
                {// t('socialfi.totalEarnings', 'Total de Ganhos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            <// Heart className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('socialfi.activePlatforms', 'Plataformas Ativas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activePlatforms}
              </p>
            </div>
            <// Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('socialfi.totalPlatforms', 'Total de Plataformas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {platforms.length}
              </p>
            </div>
            <// Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Plataformas */}
      {platforms.length === 0 ? (
        <div className="text-center py-8">
          <// Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('socialfi.noPlatforms', 'Nenhuma plataforma encontrada')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {platform.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(platform.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {platform.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('socialfi.earnings', 'Ganhos')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${platform.earnings.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('socialfi.followers', 'Seguidores')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {platform.followers}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('socialfi.posts', 'Posts')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {platform.posts}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('socialfi.engagement', 'Engajamento')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {platform.engagement}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {// t('socialfi.lastActivity', 'Última Atividade')}: {platform.lastActivity}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Share className="w-4 h-4" />
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

export default SocialFiManager;
