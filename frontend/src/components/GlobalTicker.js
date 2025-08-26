import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';
import stockService from '../services/stockService';

const GlobalTicker = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stocks');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadMarketData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await stockService.getMarketOverview();
      setMarketData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados do mercado:', error);
      setError('Erro ao carregar dados do mercado');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-blue-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-blue-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <BarChart3 className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-600">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadMarketData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  const { stocks, commodities, rates } = marketData;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bolsa de Valores</h3>
        <button
          onClick={loadMarketData}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('stocks')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'stocks'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Ações
        </button>
        <button
          onClick={() => setActiveTab('commodities')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'commodities'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Commodities
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'rates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Câmbio
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <div className="space-y-3">
        {activeTab === 'stocks' && (
          <div className="space-y-2">
            {stocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{stock.symbol}</span>
                    <span className="text-xs text-gray-500">{stock.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Vol: {formatVolume(stock.volume)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatPrice(stock.price)}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${getChangeColor(stock.change)}`}>
                    {getChangeIcon(stock.change)}
                    <span>
                      {stock.change > 0 ? '+' : ''}{formatPrice(stock.change)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'commodities' && (
          <div className="space-y-2">
            {commodities.map((commodity, index) => (
              <motion.div
                key={commodity.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{commodity.symbol}</span>
                    <span className="text-xs text-gray-500">{commodity.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {commodity.exchange} • {commodity.unit}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${commodity.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${getChangeColor(commodity.change)}`}>
                    {getChangeIcon(commodity.change)}
                    <span>
                      {commodity.change > 0 ? '+' : ''}${commodity.change.toFixed(2)} ({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="space-y-2">
            {rates.map((rate, index) => (
              <motion.div
                key={rate.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{rate.symbol}</span>
                    <span className="text-xs text-gray-500">{rate.name}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {rate.rate.toFixed(4)}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${getChangeColor(rate.change)}`}>
                    {getChangeIcon(rate.change)}
                    <span>
                      {rate.change > 0 ? '+' : ''}{rate.change.toFixed(4)} ({rate.changePercent > 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Última atualização */}
      {lastUpdate && (
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobalTicker;
