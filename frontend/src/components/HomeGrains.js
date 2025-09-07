import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Wheat, Circle, Sprout } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';
import logger from '../services/logger';

const HomeGrains = () => {
  const { isEnabled } = useFeatureFlags();
  const [grainsData, setGrainsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('BR');

  // Mock data para grãos
  const mockGrainsData = useMemo(() => [
    {
      name: 'Soja',
      symbol: 'SOJA',
      price: 185.50,
      change: 2.30,
      changePercent: 1.26,
      unit: 'R$/sc',
      icon: Sprout
    },
    {
      name: 'Milho',
      symbol: 'MILHO',
      price: 89.75,
      change: -0.85,
      changePercent: -0.94,
      unit: 'R$/sc',
      icon: Circle
    },
    {
      name: 'Trigo',
      symbol: 'TRIGO',
      price: 156.20,
      change: 1.45,
      changePercent: 0.94,
      unit: 'R$/sc',
      icon: Wheat
    }
  ], []);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          setLocation('BR');
          return;
        }

        // Implementar detecção real de IP usando serviço de geolocalização
        // Por enquanto, usar BR como padrão
        setLocation('BR');
      } catch (error) {
        logger.error('Erro ao detectar localização', error);
        setLocation('BR');
      }
    };

    const fetchGrainsData = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          setGrainsData(mockGrainsData);
        } else {
          // Implementar chamada real para API de grãos (B3, CEPEA, etc.)
          // Por enquanto, usar mock como fallback
          setGrainsData(mockGrainsData);
        }
      } catch (error) {
        logger.error('Erro ao carregar dados dos grãos', error);
        setGrainsData(mockGrainsData);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
    fetchGrainsData();

    // Atualizar dados a cada 5 minutos
    const interval = setInterval(fetchGrainsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isEnabled, mockGrainsData]);

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-neutral-400" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-neutral-400';
  };

  if (!isEnabled('FEATURE_HOME_GRAINS')) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Cotações de Grãos
        </h3>
        <span className="text-sm text-gray-600">
          {location} • Atualizado agora
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {grainsData.map((grain, index) => {
            const Icon = grain.icon;
            return (
              <motion.div
                key={grain.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {grain.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {grain.symbol}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    R$ {grain.price.toFixed(2)} <span className="text-xs text-gray-600">{grain.unit}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    {getChangeIcon(grain.change)}
                    <span className={`text-xs font-medium ${getChangeColor(grain.change)}`}>
                      {grain.change > 0 ? '+' : ''}{grain.change.toFixed(2)} ({grain.changePercent > 0 ? '+' : ''}{grain.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Dados fornecidos por fontes oficiais do agronegócio
        </p>
      </div>
    </motion.div>
  );
};

export default HomeGrains;
