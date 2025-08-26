import React, { useState, useEffect } from 'react';
import cryptoService from '../../services/cryptoService';

const CryptoTicker = () => {
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 15000); // Atualizar a cada 15 segundos
    return () => clearInterval(interval);
  }, []);

  const loadTickerData = async () => {
    try {
      setLoading(true);
      const [cryptoData, market] = await Promise.all([
        cryptoService.getTopCryptos(15),
        cryptoService.getMarketData()
      ]);
      
      setTickerData(cryptoData);
      setMarketData(market);
    } catch (error) {
      console.error('Erro ao carregar dados do ticker:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`font-mono text-xs ${isPositive ? 'text-blue-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </span>
    );
  };

  const formatMarketCap = (value) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-900 py-4 overflow-hidden">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">Carregando cotações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700">
      {/* Market Overview */}
      {marketData && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 px-4 py-3 border-b border-gray-700">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Cap Total:</span>
              <span className="text-white font-semibold">
                {formatMarketCap(marketData.totalMarketCap)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Volume 24h:</span>
              <span className="text-white font-semibold">
                {formatMarketCap(marketData.totalVolume)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Variação 24h:</span>
              <span className={`font-semibold ${
                marketData.marketCapChangePercentage24h >= 0 ? 'text-blue-400' : 'text-red-400'
              }`}>
                {marketData.marketCapChangePercentage24h >= 0 ? '+' : ''}
                {marketData.marketCapChangePercentage24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Criptos Ativas:</span>
              <span className="text-white font-semibold">
                {marketData.activeCryptocurrencies.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Última Atualização:</span>
              <span className="text-white font-semibold">
                {new Date(marketData.lastUpdated).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ticker Bar */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll">
          {/* Primeira passagem */}
          <div className="flex items-center space-x-8 py-4 px-4 whitespace-nowrap">
            {tickerData.map((crypto) => (
              <div
                key={`first-${crypto.id}`}
                className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-sm">{crypto.symbol}</span>
                    {formatPercentage(crypto.priceChangePercentage24h)}
                  </div>
                  <div className="text-white font-bold text-sm">
                    {formatPrice(crypto.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Segunda passagem (para loop infinito) */}
          <div className="flex items-center space-x-8 py-4 px-4 whitespace-nowrap">
            {tickerData.map((crypto) => (
              <div
                key={`second-${crypto.id}`}
                className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-sm">{crypto.symbol}</span>
                    {formatPercentage(crypto.priceChangePercentage24h)}
                  </div>
                  <div className="text-white font-bold text-sm">
                    {formatPrice(crypto.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de atualização */}
        <div className="absolute top-2 right-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-xs font-medium">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoTicker;
