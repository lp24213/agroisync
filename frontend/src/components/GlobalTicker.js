import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const GlobalTicker = () => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [tickerData, setTickerData] = useState([]);

  // Dados simulados mais realistas e profissionais do ticker
  const mockTickerData = [
    { symbol: 'USD/BRL', value: '5,23', change: '+0,15%', trend: 'up', type: 'currency', description: 'Dólar Americano' },
    { symbol: 'EUR/BRL', value: '5,67', change: '-0,08%', trend: 'down', type: 'currency', description: 'Euro' },
    { symbol: 'BTC/USD', value: '43,250', change: '+2,34%', trend: 'up', type: 'crypto', description: 'Bitcoin' },
    { symbol: 'ETH/USD', value: '2,680', change: '+1,87%', trend: 'up', type: 'crypto', description: 'Ethereum' },
    { symbol: 'IBOV', value: '128.450', change: '+0,67%', trend: 'up', type: 'stock', description: 'Índice Bovespa' },
    { symbol: 'SOJA', value: 'R$ 180,50', change: '+1,25%', trend: 'up', type: 'commodity', description: 'Soja Tipo 1' },
    { symbol: 'MILHO', value: 'R$ 95,30', change: '-0,45%', trend: 'down', type: 'commodity', description: 'Milho Seco' },
    { symbol: 'BOI GORDO', value: 'R$ 320,00', change: '+0,89%', trend: 'up', type: 'commodity', description: 'Boi Nelore' },
    { symbol: 'CAFÉ', value: 'R$ 1.250,00', change: '+2,15%', trend: 'up', type: 'commodity', description: 'Café Arábica' },
    { symbol: 'ALGODÃO', value: 'R$ 4,85', change: '-0,32%', trend: 'down', type: 'commodity', description: 'Algodão Pluma' }
  ];

  useEffect(() => {
    // Simular carregamento de dados reais
    const timer = setTimeout(() => {
      setTickerData(mockTickerData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockTickerData.length);
    }, 4000); // Aumentado para 4 segundos para melhor visualização

    return () => clearInterval(interval);
  }, [mockTickerData.length]);

  // Ocultar ticker em telas muito pequenas
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  if (!isVisible || tickerData.length === 0) return null;

  return (
    <div 
      className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
        isDark ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-sm border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Ticker Label */}
          <div className={`flex items-center space-x-2 ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold uppercase tracking-wider">
              📊 COTAÇÕES EM TEMPO REAL • AGROISYNC
            </span>
          </div>

          {/* Ticker Content */}
          <div className="flex-1 mx-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex items-center space-x-4"
              >
                {tickerData[currentIndex] && (
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${getTypeColor(tickerData[currentIndex].type)}`}>
                      {tickerData[currentIndex].symbol}
                    </span>
                    <span className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {tickerData[currentIndex].value}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(tickerData[currentIndex].trend)}
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        tickerData[currentIndex].trend === 'up'
                          ? 'text-green-600 bg-green-100'
                          : tickerData[currentIndex].trend === 'down'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {tickerData[currentIndex].change}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex space-x-1">
            {tickerData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? (isDark ? 'bg-green-400' : 'bg-green-600')
                    : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTicker;
