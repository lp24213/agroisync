import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap, DollarSign, Bitcoin, Euro } from 'lucide-react';

const StockMarketTicker = () => {
  const [marketData, setMarketData] = useState({
    indices: [
      { name: 'IBOV', value: '128.450', change: '+1,2%', trend: 'up' },
      { name: 'IFIX', value: '2.845', change: '-0,8%', trend: 'down' },
      { name: 'IDIV', value: '1.234', change: '+0,5%', trend: 'up' }
    ],
    currencies: [
      { name: 'USD/BRL', value: '4,85', change: '-0,3%', trend: 'down' },
      { name: 'EUR/BRL', value: '5,32', change: '+0,2%', trend: 'up' }
    ],
    crypto: [
      { name: 'BTC', value: 'R$ 245.000', change: '+2,1%', trend: 'up' },
      { name: 'ETH', value: 'R$ 12.800', change: '-1,5%', trend: 'down' }
    ]
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-agro-accent-emerald" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-agro-accent-amber" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-agro-accent-emerald';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-agro-accent-amber';
    }
  };

  const renderMarketItem = (item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center space-x-2 px-3 py-1 bg-agro-bg-secondary/30 rounded-lg border border-agro-border-secondary"
    >
      <span className="text-xs font-medium text-agro-text-primary">{item.name}</span>
      <span className="text-xs font-bold text-agro-text-primary">{item.value}</span>
      <div className="flex items-center space-x-1">
        {getTrendIcon(item.trend)}
        <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
          {item.change}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="h-16 bg-agro-bg-secondary/90 border-b border-agro-border-secondary backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Índices */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-agro-accent-emerald" />
              <span className="text-xs font-semibold text-agro-text-secondary">ÍNDICES</span>
            </div>
            <div className="flex items-center space-x-2">
              {marketData.indices.map((item, index) => renderMarketItem(item, index))}
            </div>
          </div>

          {/* Moedas */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-agro-accent-sky" />
              <span className="text-xs font-semibold text-agro-text-secondary">MOEDAS</span>
            </div>
            <div className="flex items-center space-x-2">
              {marketData.currencies.map((item, index) => renderMarketItem(item, index))}
            </div>
          </div>

          {/* Cripto */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bitcoin className="w-4 h-4 text-agro-accent-amber" />
              <span className="text-xs font-semibold text-agro-text-secondary">CRIPTO</span>
            </div>
            <div className="flex items-center space-x-2">
              {marketData.crypto.map((item, index) => renderMarketItem(item, index))}
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-agro-accent-emerald rounded-full animate-pulse"></div>
            <span className="text-xs text-agro-text-tertiary font-mono">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMarketTicker;
