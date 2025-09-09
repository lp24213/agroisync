import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StockMarketTicker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketData, setMarketData] = useState([
    { name: 'SOJA', value: 'R$ 1.450,00', trend: 'up', change: '+2.3%' },
    { name: 'MILHO', value: 'R$ 890,00', trend: 'down', change: '-1.2%' },
    { name: 'BOI', value: 'R$ 285,00', trend: 'up', change: '+0.8%' },
    { name: 'CAFÉ', value: 'R$ 1.120,00', trend: 'up', change: '+1.5%' },
    { name: 'AÇÚCAR', value: 'R$ 1.680,00', trend: 'down', change: '-0.9%' },
    { name: 'ALGODÃO', value: 'R$ 4.200,00', trend: 'up', change: '+3.1%' },
    { name: 'TRIGO', value: 'R$ 1.890,00', trend: 'down', change: '-2.1%' },
    { name: 'ETANOL', value: 'R$ 2.340,00', trend: 'up', change: '+1.8%' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-amber-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-amber-600 dark:text-amber-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Mercado Aberto
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
        </div>
        
        <div className="flex items-center space-x-6 overflow-x-auto">
          {marketData.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-md border border-emerald-200 dark:border-emerald-800 min-w-[110px] whitespace-nowrap"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{item.name}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.value}</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon(item.trend)}
                <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockMarketTicker;
