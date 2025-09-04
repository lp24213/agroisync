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
        return 'text-emerald-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-amber-400';
    }
  };

  const renderMarketItem = (item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 min-w-[110px]"
    >
      <span className="text-xs font-medium text-white/90">{item.name}</span>
      <span className="text-xs font-bold text-white">{item.value}</span>
      <div className="flex items-center space-x-1">
        {getTrendIcon(item.trend)}
        <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
          {item.change}
        </span>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="h-16 bg-black/90 border-b border-emerald-500/20 backdrop-blur-sm overflow-hidden" 
      style={{ maxHeight: '72px' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Índices */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-1">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </motion.div>
              <span className="text-xs font-semibold text-white/70">B3</span>
            </div>
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {marketData.indices.map((item, index) => renderMarketItem(item, index))}
            </motion.div>
          </motion.div>

          {/* Moedas */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DollarSign className="w-3 h-3 text-sky-400" />
              </motion.div>
              <span className="text-xs font-semibold text-white/70">FX</span>
            </div>
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {marketData.currencies.map((item, index) => renderMarketItem(item, index))}
            </motion.div>
          </motion.div>

          {/* Cripto */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-1">
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Bitcoin className="w-3 h-3 text-amber-400" />
              </motion.div>
              <span className="text-xs font-semibold text-white/70">CRYPTO</span>
            </div>
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ x: [0, -15, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {marketData.crypto.map((item, index) => renderMarketItem(item, index))}
            </motion.div>
          </motion.div>

          {/* Live Indicator */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div 
              className="w-2 h-2 bg-emerald-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-xs text-white/60 font-mono">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockMarketTicker;
