import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

const TickerB3 = () => {
  const { isEnabled, getValue } = useFeatureFlags();
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data para quando USE_MOCK estiver ativo
  const mockData = [
    { symbol: 'PETR4', price: 28.45, change: 0.85, changePercent: 3.08 },
    { symbol: 'VALE3', price: 67.32, change: -1.23, changePercent: -1.79 },
    { symbol: 'ITUB4', price: 34.12, change: 0.28, changePercent: 0.83 },
    { symbol: 'BBDC4', price: 15.67, change: -0.12, changePercent: -0.76 },
    { symbol: 'ABEV3', price: 12.89, change: 0.45, changePercent: 3.62 },
    { symbol: 'WEGE3', price: 36.78, change: 0.67, changePercent: 1.86 },
    { symbol: 'RENT3', price: 45.23, change: -0.89, changePercent: -1.93 },
    { symbol: 'LREN3', price: 23.45, change: 0.34, changePercent: 1.47 }
  ];

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          // Usar dados mock
          setTickerData(mockData);
        } else {
          // TODO: Implementar chamada real para API de bolsa
          // Por enquanto, usar mock como fallback
          setTickerData(mockData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da bolsa:', error);
        setTickerData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickerData();

    // Atualizar dados periodicamente
    const refreshInterval = getValue('TICKER_REFRESH_MS', 15000);
    const interval = setInterval(fetchTickerData, refreshInterval);

    return () => clearInterval(interval);
  }, [isEnabled, getValue]);

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-neutral-400" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-neutral-400';
  };

  if (!isEnabled('FEATURE_TICKER_B3')) {
    return null;
  }

  return (
    <div className="bg-neutral-950/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden h-14 max-w-4xl">
      <div className="flex items-center h-full">
        <div className="bg-emerald-500/20 px-3 py-1 border-r border-white/10">
          <span className="text-xs font-semibold text-emerald-400">B3</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center h-full"
            animate={{ x: [0, -100] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-6 px-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-12 h-3 bg-neutral-800 rounded animate-pulse"></div>
                    <div className="w-8 h-3 bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-6 px-4">
                {tickerData.map((item, index) => (
                  <motion.div
                    key={item.symbol}
                    className="flex items-center space-x-2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-xs font-semibold text-neutral-100">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-neutral-300">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(item.change)}
                      <span className={`text-xs font-medium ${getChangeColor(item.change)}`}>
                        {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TickerB3;
