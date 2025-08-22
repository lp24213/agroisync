'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wheat, TrendingUp, TrendingDown, BarChart3, Globe, Calendar, DollarSign, MapPin, RefreshCw } from 'lucide-react';
import { GrainsPriceCard } from './grains-price-card';
import { GrainsChart } from './grains-chart';
import { FuturesMarket } from './futures-market';
import { ExportData } from './export-data';
import { useAgrolinkGrains } from '@/lib/hooks/use-agrolink-grains';
import { useGeolocation } from '@/lib/hooks/use-geolocation';

export function GrainsDashboard() {
  const { location, regionInfo, loading: locationLoading, error: locationError } = useGeolocation();
  const { 
    grainsData, 
    marketData, 
    loading: grainsLoading, 
    error: grainsError, 
    refreshData 
  } = useAgrolinkGrains();

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Atualizar timestamp da última atualização
  useEffect(() => {
    if (grainsData.length > 0) {
      setLastUpdate(new Date());
    }
  }, [grainsData]);

  const handleRefresh = () => {
    refreshData();
    setLastUpdate(new Date());
  };

  const isLoading = locationLoading || grainsLoading;
  const hasError = locationError || grainsError;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header com informações de localização */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4">
          Commodities & Grãos
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
          Preços em tempo real baseados na sua localização via API Agrolink
        </p>
        
        {/* Informações de localização */}
        {regionInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 inline-block"
          >
            <div className="flex items-center gap-3 text-green-400">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">
                {regionInfo.city}, {regionInfo.state} - {regionInfo.region}
              </span>
            </div>
            {location && (
              <div className="text-sm text-gray-400 mt-1">
                Coordenadas: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </div>
            )}
          </motion.div>
        )}

        {/* Status de atualização */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span>{isLoading ? 'Carregando...' : 'Conectado'}</span>
          </div>
          <span>•</span>
          <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </motion.div>

      {/* Mensagens de erro */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-center"
        >
          <p className="text-red-400">
            {locationError || grainsError}
          </p>
        </motion.div>
      )}

      {/* Preços em Tempo Real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Wheat className="text-green-400" />
          Preços em Tempo Real - {regionInfo?.region || 'Região'}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : grainsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grainsData.map((grain, index) => (
              <GrainsPriceCard
                key={grain.id}
                data={{
                  name: grain.grain,
                  symbol: grain.symbol,
                  price: grain.price,
                  change24h: grain.change24h,
                  volume: grain.volume,
                  unit: grain.unit,
                }}
                delay={index * 0.1}
                region={grain.region}
                source={grain.source}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum dado de grãos disponível para esta região</p>
          </div>
        )}
      </motion.div>

      {/* Gráficos Comparativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BarChart3 className="text-yellow-400" />
          Análise Histórica & Comparativa
        </h2>
        <GrainsChart marketData={marketData} />
      </motion.div>

      {/* Mercado Futuro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Calendar className="text-blue-400" />
          Mercado Futuro (B3 API)
        </h2>
        <FuturesMarket />
      </motion.div>

      {/* Dados de Exportação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Globe className="text-purple-400" />
          Exportações Globais (FAO API)
        </h2>
        <ExportData />
      </motion.div>

      {/* Footer com informações da API */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-16 text-center text-sm text-gray-500"
      >
        <p>
          Dados fornecidos pela API Agrolink • Atualização automática baseada na localização
        </p>
        <p className="mt-2">
          Região detectada: {regionInfo?.region || 'Não identificada'} • 
          Estado: {regionInfo?.state || 'Não identificado'} • 
          Cidade: {regionInfo?.city || 'Não identificada'}
        </p>
      </motion.div>
    </div>
  );
}
