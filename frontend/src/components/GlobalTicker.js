import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const GlobalTicker = () => {
  const { isDark } = useTheme();
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados simulados de cotações (em produção, integrar com APIs reais)
  const mockTickerData = [
    // Moedas Fiat
    { symbol: 'USD/BRL', value: '5.12', change: '+0.8%', trend: 'up', type: 'currency' },
    { symbol: 'EUR/BRL', value: '5.58', change: '+1.2%', trend: 'up', type: 'currency' },
    
    // Criptomoedas
    { symbol: 'BTC/USD', value: '43,250', change: '+2.1%', trend: 'up', type: 'crypto' },
    { symbol: 'ETH/USD', value: '2,680', change: '-0.5%', trend: 'down', type: 'crypto' },
    { symbol: 'BNB/USD', value: '315', change: '+1.8%', trend: 'up', type: 'crypto' },
    { symbol: 'SOL/USD', value: '98.50', change: '+3.2%', trend: 'up', type: 'crypto' },
    { symbol: 'USDT/USD', value: '1.00', change: '0.0%', trend: 'neutral', type: 'crypto' },
    
    // Bolsa Brasileira
    { symbol: 'IBOV', value: '128,450', change: '+0.9%', trend: 'up', type: 'stock' },
    
    // Bolsas Internacionais
    { symbol: 'NASDAQ', value: '16,890', change: '+1.3%', trend: 'up', type: 'stock' },
    { symbol: 'S&P500', value: '4,890', change: '+0.7%', trend: 'up', type: 'stock' },
    { symbol: 'DOW', value: '38,450', change: '+0.4%', trend: 'up', type: 'stock' },
    
    // Commodities Agrícolas
    { symbol: 'SOJA', value: 'R$ 180,50', change: '+1.8%', trend: 'up', type: 'commodity' },
    { symbol: 'MILHO', value: 'R$ 85,30', change: '-0.3%', trend: 'down', type: 'commodity' },
    { symbol: 'CAFÉ', value: 'R$ 1.250,00', change: '+2.5%', trend: 'up', type: 'commodity' },
    { symbol: 'BOI GORDO', value: 'R$ 320,00', change: '+0.9%', trend: 'up', type: 'commodity' }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setTickerData(mockTickerData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'crypto':
        return isDark ? 'text-cyan-400' : 'text-cyan-600';
      case 'currency':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'stock':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'commodity':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`w-full py-2 ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-500">Carregando cotações...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full py-2 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'
      } border-b shadow-sm`}
    >
      <div className="overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {tickerData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-2 px-4 py-1 mx-2 rounded-lg bg-opacity-10"
            >
              <span className={`font-semibold text-sm ${getTypeColor(item.type)}`}>
                {item.symbol}
              </span>
              <span className={`font-mono text-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.value}
              </span>
              <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                {getTrendIcon(item.trend)} {item.change}
              </span>
            </motion.div>
          ))}
          
          {/* Duplicar para loop contínuo */}
          {tickerData.map((item, index) => (
            <motion.div
              key={`duplicate-${index}`}
              className="flex items-center space-x-2 px-4 py-1 mx-2 rounded-lg bg-opacity-10"
            >
              <span className={`font-semibold text-sm ${getTypeColor(item.type)}`}>
                {item.symbol}
              </span>
              <span className={`font-mono text-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.value}
              </span>
              <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                {getTrendIcon(item.trend)} {item.change}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalTicker;
