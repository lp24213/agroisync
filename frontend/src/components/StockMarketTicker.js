import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StockMarketTicker = () => {
  const [commodities, setCommodities] = useState([
    { name: 'Soja', price: 'R$ 180,50', change: '+2,3%', trend: 'up', region: 'Mato Grosso' },
    { name: 'Milho', price: 'R$ 95,80', change: '-1,2%', trend: 'down', region: 'Paraná' },
    { name: 'Café', price: 'R$ 1.250,00', change: '+0,8%', trend: 'up', region: 'Minas Gerais' },
    { name: 'Algodão', price: 'R$ 4,85', change: '+1,5%', trend: 'up', region: 'Bahia' },
    { name: 'Trigo', price: 'R$ 1.180,00', change: '-0,5%', trend: 'down', region: 'Rio Grande do Sul' },
    { name: 'Arroz', price: 'R$ 85,90', change: '+0,3%', trend: 'up', region: 'Rio Grande do Sul' },
    { name: 'Feijão', price: 'R$ 8,45', change: '-0,8%', trend: 'down', region: 'Goiás' },
    { name: 'Cana', price: 'R$ 0,85', change: '+1,1%', trend: 'up', region: 'São Paulo' }
  ]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <section className="py-2 px-4 bg-gradient-premium border-b-2 border-accent-emerald relative overflow-hidden">
      {/* Gradiente de fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/20 via-accent-gold/20 to-accent-blue/20 opacity-30"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 container-premium">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4 text-accent-emerald" />
              <span className="text-white font-semibold text-xs">Bolsa de Valores</span>
            </motion.div>
            
            <span className="text-white/70 text-xs">|</span>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 text-xs"
            >
              Commodities em Tempo Real
            </motion.span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-white/60 text-xs"
          >
            Atualizado: {new Date().toLocaleTimeString('pt-BR')}
          </motion.div>
        </div>
        
        {/* Ticker de commodities com animação de rolagem */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-3"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Primeira linha de commodities */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className="bg-white shadow-premium-soft px-2 py-1.5 min-w-[110px] group relative overflow-hidden hover:scale-105 transition-all duration-300 flex-shrink-0"
              >
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-accent-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-premium-dark-gray text-xs">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-premium-dark-gray">{commodity.price}</div>
                    <div className={`text-xs font-medium ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-premium-gray">{commodity.region}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Segunda linha de commodities (duplicada para efeito contínuo) */}
            {commodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-2`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeOut",
                  delay: (index + commodities.length) * 0.1
                }}
                className="bg-white shadow-premium-soft px-2 py-1.5 min-w-[110px] group relative overflow-hidden hover:scale-105 transition-all duration-300 flex-shrink-0"
              >
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-accent-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-premium-dark-gray text-xs">{commodity.name}</span>
                    {getTrendIcon(commodity.trend)}
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-premium-dark-gray">{commodity.price}</div>
                    <div className={`text-xs font-medium ${getTrendColor(commodity.trend)}`}>
                      {commodity.change}
                    </div>
                    <div className="text-xs text-premium-gray">{commodity.region}</div>
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
