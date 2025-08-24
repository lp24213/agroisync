import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const GlobalTicker = () => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Dados simulados do ticker
  const mockTickerData = [
    { symbol: 'USD/BRL', value: '5,23', change: '+0,15%', trend: 'up' },
    { symbol: 'EUR/BRL', value: '5,67', change: '-0,08%', trend: 'down' },
    { symbol: 'BTC/USD', value: '43,250', change: '+2,34%', trend: 'up' },
    { symbol: 'ETH/USD', value: '2,680', change: '+1,87%', trend: 'up' },
    { symbol: 'IBOV', value: '128.450', change: '+0,67%', trend: 'up' },
    { symbol: 'SOJA', value: 'R$ 180,50', change: '+1,25%', trend: 'up' },
    { symbol: 'MILHO', value: 'R$ 95,30', change: '-0,45%', trend: 'down' },
    { symbol: 'BOI GORDO', value: 'R$ 320,00', change: '+0,89%', trend: 'up' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockTickerData.length);
    }, 3000);

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

  if (!isVisible) return null;

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
            <motion.div
              key={currentIndex}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center space-x-4"
            >
              {mockTickerData[currentIndex] && (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {mockTickerData[currentIndex].symbol}
                  </span>
                  <span className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {mockTickerData[currentIndex].value}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    mockTickerData[currentIndex].trend === 'up'
                      ? 'text-green-600 bg-green-100'
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {mockTickerData[currentIndex].change}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex space-x-1">
            {mockTickerData.map((_, index) => (
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
