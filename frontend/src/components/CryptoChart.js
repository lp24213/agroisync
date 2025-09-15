import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import cryptoService from '../services/cryptoService';

const CryptoChart = ({ selectedCoin = 'bitcoin' }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [marketTrends, setMarketTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCryptoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [prices, historical, trends] = await Promise.all([
        cryptoService.getCryptoPrices(),
        cryptoService.getHistoricalData(selectedCoin, 7),
        cryptoService.getMarketTrends()
      ]);
      
      setCryptoData(prices);
      setHistoricalData(historical);
      setMarketTrends(trends);
    } catch (err) {
      setError('Erro ao carregar dados de criptomoedas');
      console.error('Erro ao carregar cripto:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCoin]);

  useEffect(() => {
    loadCryptoData();
    
    // Atualizar dados a cada 2 minutos
    const interval = setInterval(loadCryptoData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCoin, loadCryptoData]);

  const selectedCrypto = cryptoData.find(crypto => crypto.id === selectedCoin);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#39FF14' : '#FF4500';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="txc-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedCrypto) {
    return (
      <div className="txc-card p-6 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{error || 'Erro ao carregar dados de criptomoedas'}</p>
      </div>
    );
  }

  return (
    <div className="txc-card p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              {selectedCrypto.name} ({selectedCrypto.symbol})
            </h3>
            <p className="text-sm text-gray-400">
              Atualizado: {new Date(selectedCrypto.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatPrice(selectedCrypto.priceUSD)}
            </div>
            <div className="text-sm text-gray-400">
              R$ {selectedCrypto.priceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Variação 24h */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {getChangeIcon(selectedCrypto.change24h)}
            <span 
              className="text-lg font-semibold"
              style={{ color: getChangeColor(selectedCrypto.change24h) }}
            >
              {formatChange(selectedCrypto.change24h)}
            </span>
            <span className="text-sm text-gray-400">24h</span>
          </div>
          <div className="text-sm text-gray-400">
            Volume: ${cryptoService.formatNumber(selectedCrypto.volume24h)}
          </div>
        </div>

        {/* Gráfico Simples */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Últimos 7 dias</h4>
          <div className="h-48 bg-gray-800 rounded-lg p-4 relative">
            <div className="flex items-end justify-between h-full">
              {historicalData.slice(-7).map((point, index) => {
                const maxPrice = Math.max(...historicalData.slice(-7).map(p => p.price));
                const minPrice = Math.min(...historicalData.slice(-7).map(p => p.price));
                const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                
                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div 
                      className="w-8 rounded-t"
                      style={{ 
                        backgroundColor: getChangeColor(selectedCrypto.change24h),
                        height: `${height}%`
                      }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {point.date.toLocaleDateString('pt-BR', { day: '2-digit' })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Cryptos */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Top Criptomoedas</h4>
          <div className="space-y-3">
            {cryptoData.slice(0, 5).map((crypto) => (
              <motion.div
                key={crypto.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {crypto.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {crypto.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {crypto.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatPrice(crypto.priceUSD)}
                  </div>
                  <div 
                    className="text-xs flex items-center justify-end space-x-1"
                    style={{ color: getChangeColor(crypto.change24h) }}
                  >
                    {getChangeIcon(crypto.change24h)}
                    <span>{formatChange(crypto.change24h)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Market Trends */}
        {marketTrends && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3">Tendências do Mercado</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Market Cap</div>
                <div className="text-lg font-semibold text-white">
                  ${cryptoService.formatNumber(marketTrends.totalMarketCap)}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Volume 24h</div>
                <div className="text-lg font-semibold text-white">
                  ${cryptoService.formatNumber(marketTrends.totalVolume)}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CryptoChart;