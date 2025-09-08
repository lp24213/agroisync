import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { Globe, Loader2 } from 'lucide-react';

const MetaverseManager = ({ userId }) => {
  const {  } = useTranslation();
  const [worlds, setWorlds] = useState([]);
  const [`loading, `setLoading] = useState(`true);
  const [error, setError] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [activeWorlds, setActiveWorlds] = useState(0);

  // useEffect(() => {
    // fetchMetaverseData();
  }, [userId]);

  const // fetchMetaverseData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/metaverse?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWorlds(data.worlds);
        setTotalValue(data.totalValue);
        setActiveWorlds(data.activeWorlds);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('metaverse.error', 'Erro ao carregar dados do metaverso'));
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
          {// t('metaverse.// loading', 'Carregando dados do metaverso...')}
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
          <// Globe className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('metaverse.title', 'Metaverse Manager')}
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
                {// t('metaverse.totalValue', 'Valor Total')}
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
                {// t('metaverse.activeWorlds', 'Mundos Ativos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeWorlds}
              </p>
            </div>
            <// Globe className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('metaverse.totalWorlds', 'Total de Mundos')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {worlds.length}
              </p>
            </div>
            <// Globe className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mundos */}
      {worlds.length === 0 ? (
        <div className="text-center py-8">
          <// Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('metaverse.noWorlds', 'Nenhum mundo encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {worlds.map((world) => (
            <div key={world.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {world.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {world.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(world.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {world.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('metaverse.landValue', 'Valor do Terreno')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${world.landValue.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('metaverse.players', 'Jogadores')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {world.players}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('metaverse.landSize', 'Tamanho do Terreno')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {world.landSize} m²
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('metaverse.date', 'Data')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {world.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {// t('metaverse.coordinates', 'Coordenadas')}: {world.coordinates}
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// MapPin className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <// Users className="w-4 h-4" />
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

export default MetaverseManager;
