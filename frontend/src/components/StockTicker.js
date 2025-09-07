import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dados mockados da bolsa (em produção, usar API real)
    const mockStocks = [
      { symbol: 'VALE3', name: 'Vale S.A.', price: 65.42, change: 1.25, changePercent: 1.95 },
      { symbol: 'PETR4', name: 'Petrobras', price: 32.18, change: -0.45, changePercent: -1.38 },
      { symbol: 'ITUB4', name: 'Itaú Unibanco', price: 28.75, change: 0.32, changePercent: 1.13 },
      { symbol: 'BBDC4', name: 'Bradesco', price: 22.91, change: -0.18, changePercent: -0.78 },
      { symbol: 'ABEV3', name: 'Ambev', price: 12.34, change: 0.15, changePercent: 1.23 },
      { symbol: 'WEGE3', name: 'WEG', price: 45.67, change: 0.89, changePercent: 1.99 },
      { symbol: 'MGLU3', name: 'Magazine Luiza', price: 8.92, change: -0.12, changePercent: -1.33 },
      { symbol: 'SUZB3', name: 'Suzano', price: 52.18, change: 0.67, changePercent: 1.30 },
      { symbol: 'JBSS3', name: 'JBS', price: 28.45, change: -0.23, changePercent: -0.80 },
      { symbol: 'RENT3', name: 'Localiza', price: 41.23, change: 0.56, changePercent: 1.38 }
    ];

    // Simular carregamento de dados da API
    const loadStocks = async () => {
      try {
        // Em produção, fazer chamada para API real da bolsa
        // const response = await fetch('https://api.b3.com.br/...');
        // const data = await response.json();
        
        // Por enquanto, usar dados mockados
        setTimeout(() => {
          setStocks(mockStocks);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados da bolsa:', error);
        setStocks(mockStocks);
        setIsLoading(false);
      }
    };

    loadStocks();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadStocks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="stock-ticker">
        <div className="stock-ticker-content">
          <div className="flex items-center gap-8 text-sm">
            <span className="text-muted">Carregando dados da bolsa...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-ticker">
      <motion.div 
        className="stock-ticker-content"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      >
        <div className="flex items-center gap-8 text-sm">
          <span className="font-semibold text-primary">B3 - Bolsa de Valores</span>
          
          {stocks.map((stock, index) => (
            <div key={stock.symbol} className="flex items-center gap-2">
              <span className="font-medium text-primary">{stock.symbol}</span>
              <span className="text-secondary">{formatPrice(stock.price)}</span>
              <span className={`font-medium ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatChange(stock.change)} ({formatChangePercent(stock.changePercent)})
              </span>
            </div>
          ))}
          
          <span className="font-semibold text-primary">B3 - Bolsa de Valores</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StockTicker;