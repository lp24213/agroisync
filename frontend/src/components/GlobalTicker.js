import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const GlobalTicker = () => {
  const { isDark } = useTheme();
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados simulados de cotações em tempo real (em produção, integrar com APIs reais)
  const mockTickerData = [
    // Moedas Fiat - Yahoo Finance
    { 
      symbol: 'USD/BRL', 
      value: '5.12', 
      change: '+0.8%', 
      trend: 'up', 
      type: 'currency',
      description: 'Dólar Americano'
    },
    { 
      symbol: 'EUR/BRL', 
      value: '5.58', 
      change: '+1.2%', 
      trend: 'up', 
      type: 'currency',
      description: 'Euro'
    },
    
    // Criptomoedas - CoinGecko
    { 
      symbol: 'BTC/USD', 
      value: '43,250', 
      change: '+2.1%', 
      trend: 'up', 
      type: 'crypto',
      description: 'Bitcoin'
    },
    { 
      symbol: 'ETH/USD', 
      value: '2,680', 
      change: '-0.5%', 
      trend: 'down', 
      type: 'crypto',
      description: 'Ethereum'
    },
    { 
      symbol: 'BNB/USD', 
      value: '315', 
      change: '+1.8%', 
      trend: 'up', 
      type: 'crypto',
      description: 'Binance Coin'
    },
    { 
      symbol: 'SOL/USD', 
      value: '98.50', 
      change: '+3.2%', 
      trend: 'up', 
      type: 'crypto',
      description: 'Solana'
    },
    { 
      symbol: 'USDT/USD', 
      value: '1.00', 
      change: '0.0%', 
      trend: 'neutral', 
      type: 'crypto',
      description: 'Tether'
    },
    
    // Bolsa Brasileira - Yahoo Finance
    { 
      symbol: 'IBOV', 
      value: '128,450', 
      change: '+0.9%', 
      trend: 'up', 
      type: 'stock',
      description: 'Índice Bovespa'
    },
    
    // Bolsas Internacionais - Yahoo Finance
    { 
      symbol: 'NASDAQ', 
      value: '16,890', 
      change: '+1.3%', 
      trend: 'up', 
      type: 'stock',
      description: 'Nasdaq Composite'
    },
    { 
      symbol: 'S&P500', 
      value: '4,890', 
      change: '+0.7%', 
      trend: 'up', 
      type: 'stock',
      description: 'S&P 500'
    },
    { 
      symbol: 'DOW', 
      value: '38,450', 
      change: '+0.4%', 
      trend: 'up', 
      type: 'stock',
      description: 'Dow Jones'
    },
    
    // Commodities Agrícolas - Agrolink
    { 
      symbol: 'SOJA', 
      value: 'R$ 180,50', 
      change: '+1.8%', 
      trend: 'up', 
      type: 'commodity',
      description: 'Soja'
    },
    { 
      symbol: 'MILHO', 
      value: 'R$ 85,30', 
      change: '-0.3%', 
      trend: 'down', 
      type: 'commodity',
      description: 'Milho'
    },
    { 
      symbol: 'CAFÉ', 
      value: 'R$ 1.250,00', 
      change: '+2.5%', 
      trend: 'up', 
      type: 'commodity',
      description: 'Café'
    },
    { 
      symbol: 'BOI GORDO', 
      value: 'R$ 320,00', 
      change: '+0.9%', 
      trend: 'up', 
      type: 'commodity',
      description: 'Boi Gordo'
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setTickerData(mockTickerData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
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

  const getChangeColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`w-full py-3 ${
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
      className={`w-full py-3 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'
      } border-b shadow-lg`}
    >
      {/* Header do Ticker */}
      <div className={`text-xs font-semibold text-center mb-2 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        📊 COTAÇÕES EM TEMPO REAL • AGROSYNC
      </div>

      {/* Ticker Principal */}
      <div className="overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {tickerData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                  : 'bg-white/50 hover:bg-gray-100/50 border border-gray-200 shadow-sm'
              }`}
            >
              {/* Símbolo */}
              <div className="text-center">
                <div className={`font-bold text-sm ${getTypeColor(item.type)}`}>
                  {item.symbol}
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </div>
              </div>

              {/* Valor */}
              <div className={`font-mono text-sm font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.value}
              </div>

              {/* Variação */}
              <div className="flex items-center space-x-1">
                {getTrendIcon(item.trend)}
                <span className={`text-xs font-medium ${getChangeColor(item.trend)}`}>
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
          
          {/* Duplicar para loop contínuo */}
          {tickerData.map((item, index) => (
            <motion.div
              key={`duplicate-${index}`}
              className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                  : 'bg-white/50 hover:bg-gray-100/50 border border-gray-200 shadow-sm'
              }`}
            >
              <div className="text-center">
                <div className={`font-bold text-sm ${getTypeColor(item.type)}`}>
                  {item.symbol}
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </div>
              </div>

              <div className={`font-mono text-sm font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.value}
              </div>

              <div className="flex items-center space-x-1">
                {getTrendIcon(item.trend)}
                <span className={`text-xs font-medium ${getChangeColor(item.trend)}`}>
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer do Ticker */}
      <div className={`text-xs text-center mt-2 ${
        isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>
        💰 Dados simulados • Em produção: CoinGecko + Yahoo Finance + Agrolink
      </div>
    </motion.div>
  );
};

export default GlobalTicker;
