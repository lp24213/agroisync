import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GrainsPriceCard from './GrainsPriceCard';
import GrainsChart from './GrainsChart';
import FuturesMarket from './FuturesMarket';
import ExportData from './ExportData';
import { useAgrolinkGrains } from '../../services/agrolinkAPI';
import { useGeolocation } from '../../services/geoService';

const GrainsDashboard = () => {
  const { regionInfo, loading: locationLoading, error: locationError } = useGeolocation();
  const { 
    grainsData, 
    loading: grainsLoading, 
    error: grainsError, 
    refreshData 
  } = useAgrolinkGrains(regionInfo);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Atualizar timestamp da última atualização
  useEffect(() => {
    if (grainsData.length > 0) {
      setLastUpdate(new Date());
    }
  }, [grainsData]);



  const handleRefresh = useCallback(() => {
    refreshData();
    setLastUpdate(new Date());
  }, [refreshData]);

  const isLoading = locationLoading || grainsLoading;
  const hasError = locationError || grainsError;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (hasError) {
    return (
      <motion.div 
        className="min-h-screen bg-black text-white p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Erro ao Carregar Dados</h2>
            <p className="text-gray-300 mb-6">
              {locationError || grainsError || 'Erro desconhecido'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-white p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Dashboard de Grãos
                </h1>
                <p className="text-gray-400">Cotações em tempo real baseadas na sua localização</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
                <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
              </button>
            </div>
          </div>

          {/* Localização */}
          {regionInfo && (
            <motion.div 
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="font-medium">
                  {regionInfo.city}, {regionInfo.state} - {regionInfo.country}
                </span>
                <span className="text-sm text-gray-500">
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-400">Carregando dados de cotações...</p>
          </motion.div>
        )}

        {/* Grains Cards */}
        {!isLoading && grainsData.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={itemVariants}
          >
            {grainsData.map((grain) => (
              <GrainsPriceCard 
                key={grain.id} 
                grain={grain}
                location={regionInfo}
              />
            ))}
          </motion.div>
        )}

        {/* Charts and Analysis */}
        {!isLoading && grainsData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div variants={itemVariants}>
              <GrainsChart data={grainsData} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FuturesMarket />
            </motion.div>
          </div>
        )}

        {/* Export Data */}
        {!isLoading && (
          <motion.div variants={itemVariants}>
            <ExportData />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GrainsDashboard;
