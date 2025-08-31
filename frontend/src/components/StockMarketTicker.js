import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-2 h-2 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-2 h-2 text-red-400" />;
      default:
        return <Minus className="w-2 h-2 text-gray-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section className="py-1 px-3 bg-gradient-to-r from-slate-900 to-black border-b border-slate-800 relative overflow-hidden">
      {/* Gradiente futurista */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-blue-500/3 to-purple-500/3"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-1.5"
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 font-medium text-xs">Commodities</span>
            </motion.div>
            
            <span className="text-slate-600 text-xs">|</span>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-slate-500 text-xs"
            >
              Live
            </motion.span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 text-xs"
          >
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </motion.div>
        </div>
        
        {/* Ticker ultra compacto */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-2"
            animate={{ x: [0, -600] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Primeira linha */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-1`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.03
                }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/20 px-2 py-1 min-w-[70px] group relative overflow-hidden hover:bg-slate-800/60 transition-all duration-200 flex-shrink-0 rounded-md"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-slate-200 text-xs">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{commodity.price}</div>
                    <div className={`text-xs font-medium ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-slate-500">{commodity.region}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Segunda linha (duplicada) */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-2`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: (index + commodities.length) * 0.03
                }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/20 px-2 py-1 min-w-[70px] group relative overflow-hidden hover:bg-slate-800/60 transition-all duration-200 flex-shrink-0 rounded-md"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-slate-200 text-xs">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{commodity.price}</div>
                    <div className={`text-xs font-medium ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-slate-500">{commodity.region}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StockMarketTicker;
