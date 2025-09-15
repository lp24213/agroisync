import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Building2 } from 'lucide-react';
import stockService from '../services/stockService';

const StockWidget = () => {
  const [stocks, setStocks] = useState([]);
  const [bovespaIndex, setBovespaIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStockData();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(loadStockData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadStockData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [brazilianStocks, index] = await Promise.all([
        stockService.getBrazilianStocks(),
        stockService.getBovespaIndex()
      ]);
      
      setStocks(brazilianStocks);
      setBovespaIndex(index);
    } catch (err) {
      setError('Erro ao carregar dados da bolsa');
      console.error('Erro ao carregar bolsa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#39FF14' : '#FF4500';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="txc-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stocks.length) {
    return (
      <div className="txc-card p-6 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{error || 'Erro ao carregar dados da bolsa'}</p>
      </div>
    );
  }

  return (
    <div className="txc-card p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Bolsa de Valores</h3>
            <p className="text-sm text-gray-400">
              Atualizado: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>

        {/* Índice Bovespa */}
        {bovespaIndex && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {bovespaIndex.name} ({bovespaIndex.symbol})
                </h4>
                <div className="text-sm text-gray-400">
                  Índice Principal
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {bovespaIndex.value.toLocaleString('pt-BR')}
                </div>
                <div 
                  className="text-sm flex items-center justify-end space-x-1"
                  style={{ color: getChangeColor(bovespaIndex.change) }}
                >
                  {getChangeIcon(bovespaIndex.change)}
                  <span>{formatChange(bovespaIndex.change)}</span>
                  <span>({formatChangePercent(bovespaIndex.changePercent)})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Ações */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Principais Ações</h4>
          <div className="space-y-3">
            {stocks.map((stock) => (
              <motion.div
                key={stock.symbol}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {stock.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {stock.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatPrice(stock.price)}
                  </div>
                  <div 
                    className="text-xs flex items-center justify-end space-x-1"
                    style={{ color: getChangeColor(stock.change) }}
                  >
                    {getChangeIcon(stock.change)}
                    <span>{formatChange(stock.change)}</span>
                    <span>({formatChangePercent(stock.changePercent)})</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resumo do Mercado */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-3">Resumo do Mercado</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400">Volume Total</div>
              <div className="text-lg font-semibold text-white">
                {stocks.reduce((sum, stock) => sum + stock.volume, 0).toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400">Alta/Baixa</div>
              <div className="text-lg font-semibold text-white">
                {stocks.filter(s => s.change > 0).length}/{stocks.filter(s => s.change < 0).length}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico Simples */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-3">Performance</h4>
          <div className="h-32 bg-gray-800 rounded-lg p-4 relative">
            <div className="flex items-end justify-between h-full">
              {stocks.slice(0, 5).map((stock, index) => {
                const maxChange = Math.max(...stocks.slice(0, 5).map(s => Math.abs(s.changePercent)));
                const height = (Math.abs(stock.changePercent) / maxChange) * 100;
                
                return (
                  <motion.div
                    key={stock.symbol}
                    className="flex flex-col items-center"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div 
                      className="w-6 rounded-t"
                      style={{ 
                        backgroundColor: getChangeColor(stock.change),
                        height: `${height}%`
                      }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {stock.symbol}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StockWidget;
