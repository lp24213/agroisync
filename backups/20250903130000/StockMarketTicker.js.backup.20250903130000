import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

const StockMarketTicker = () => {
  const [commodities, setCommodities] = useState([
    { name: 'Soja', price: 'R$ 180,50', change: '+2,3%', trend: 'up', region: 'MT' },
    { name: 'Milho', price: 'R$ 95,80', change: '-1,2%', trend: 'down', region: 'PR' },
    { name: 'Café', price: 'R$ 1.250', change: '+0,8%', trend: 'up', region: 'MG' },
    { name: 'Algodão', price: 'R$ 4,85', change: '+1,5%', trend: 'up', region: 'BA' },
    { name: 'Trigo', price: 'R$ 1.180', change: '-0,5%', trend: 'down', region: 'RS' },
    { name: 'Arroz', price: 'R$ 85,90', change: '+0,3%', trend: 'up', region: 'RS' },
    { name: 'Feijão', price: 'R$ 8,45', change: '-0,8%', trend: 'down', region: 'GO' },
    { name: 'Cana', price: 'R$ 0,85', change: '+1,1%', trend: 'up', region: 'SP' }
  ]);

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
        return <Minus className="w-3 h-3 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'down':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  const getTrendBgColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'border-emerald-500/20 bg-emerald-500/5';
      case 'down':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-yellow-500/20 bg-yellow-500/5';
    }
  };

  return (
    <section className="py-2 px-4 bg-gradient-to-r from-slate-900 via-black to-slate-900 border-b border-slate-800/50 relative overflow-hidden">
      {/* Gradiente futurista */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 font-semibold text-sm">Commodities</span>
            </motion.div>
            
            <span className="text-slate-600 text-sm">|</span>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center space-x-1"
            >
              <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-slate-400 text-xs font-medium">Live</span>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-400 text-xs font-mono"
          >
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </motion.div>
        </div>
        
        {/* Ticker compacto e moderno */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-3"
            animate={{ x: [0, -800] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Primeira linha */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-1`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05
                }}
                className={`backdrop-blur-sm border px-3 py-2 min-w-[120px] group relative overflow-hidden hover:scale-105 transition-all duration-300 flex-shrink-0 rounded-lg ${getTrendBgColor(commodity.trend)}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 text-sm">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">{commodity.price}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{commodity.region}</div>
                  </div>
                </div>
                
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
            
            {/* Segunda linha (duplicada para continuidade) */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-2`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: (index + commodities.length) * 0.05
                }}
                className={`backdrop-blur-sm border px-3 py-2 min-w-[120px] group relative overflow-hidden hover:scale-105 transition-all duration-300 flex-shrink-0 rounded-lg ${getTrendBgColor(commodity.trend)}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 text-sm">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">{commodity.price}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{commodity.region}</div>
                  </div>
                </div>
                
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StockMarketTicker;
