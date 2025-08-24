import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const GlobalTicker = () => {
  const { isDark } = useTheme();
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados simulados de cotações (em produção, integrar com APIs reais)
  const mockTickerData = [
    { symbol: 'USD/BRL', value: '5.12', change: '+0.8%', trend: 'up' },
    { symbol: 'EUR/BRL', value: '5.58', change: '+1.2%', trend: 'up' },
    { symbol: 'BTC/USD', value: '43,250', change: '+2.1%', trend: 'up' },
    { symbol: 'ETH/USD', value: '2,680', change: '-0.5%', trend: 'down' },
    { symbol: 'BOVESPA', value: '128,450', change: '+0.9%', trend: 'up' },
    { symbol: 'NASDAQ', value: '16,890', change: '+1.3%', trend: 'up' },
    { symbol: 'S&P500', value: '4,890', change: '+0.7%', trend: 'up' },
    { symbol: 'DOW', value: '38,450', change: '+0.4%', trend: 'up' },
    { symbol: 'SOJA', value: 'R$ 180,50', change: '+1.8%', trend: 'up' },
    { symbol: 'MILHO', value: 'R$ 85,30', change: '-0.3%', trend: 'down' },
    { symbol: 'CAFÉ', value: 'R$ 1.250,00', change: '+2.5%', trend: 'up' },
    { symbol: 'BOI GORDO', value: 'R$ 320,00', change: '+0.9%', trend: 'up' }
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
      } border-b shadow-sm sticky top-0 z-50`}
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
              <span className={`font-semibold text-sm ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
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
              <span className={`font-semibold text-sm ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
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
