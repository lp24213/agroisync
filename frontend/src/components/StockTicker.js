import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados da bolsa de valores brasileira
  const mockStocks = [
    { symbol: 'VALE3', name: 'Vale S.A.', price: 65.42, change: 1.23, changePercent: 1.92 },
    { symbol: 'PETR4', name: 'Petrobras', price: 32.18, change: -0.45, changePercent: -1.38 },
    { symbol: 'ITUB4', name: 'Itaú Unibanco', price: 28.75, change: 0.67, changePercent: 2.39 },
    { symbol: 'BBDC4', name: 'Bradesco', price: 22.91, change: -0.32, changePercent: -1.38 },
    { symbol: 'ABEV3', name: 'Ambev', price: 12.34, change: 0.15, changePercent: 1.23 },
    { symbol: 'WEGE3', name: 'WEG', price: 45.67, change: 0.89, changePercent: 1.99 },
    { symbol: 'MGLU3', name: 'Magazine Luiza', price: 3.21, change: -0.12, changePercent: -3.60 },
    { symbol: 'SUZB3', name: 'Suzano', price: 58.90, change: 1.45, changePercent: 2.52 },
    { symbol: 'JBSS3', name: 'JBS', price: 25.43, change: 0.34, changePercent: 1.36 },
    { symbol: 'RENT3', name: 'Localiza', price: 41.22, change: -0.78, changePercent: -1.86 }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const loadStocks = async () => {
      setIsLoading(true);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adicionar variações aleatórias aos preços para simular tempo real
      const updatedStocks = mockStocks.map(stock => {
        const randomChange = (Math.random() - 0.5) * 2; // -1 a +1
        const newPrice = Math.max(0.01, stock.price + randomChange);
        const newChange = newPrice - stock.price;
        const newChangePercent = (newChange / stock.price) * 100;
        
        return {
          ...stock,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent
        };
      });
      
      setStocks(updatedStocks);
      setIsLoading(false);
    };

    loadStocks();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadStocks, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const formatChange = (change) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  const formatChangePercent = (changePercent) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-neon-blue dark:to-neon-purple text-white py-2 overflow-hidden">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Carregando cotações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-neon-blue dark:to-neon-purple text-white py-2 overflow-hidden relative">
      {/* Título do ticker */}
      <div className="absolute left-0 top-0 bottom-0 bg-black/20 dark:bg-white/10 px-4 flex items-center z-10">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-bold">B3</span>
        </div>
      </div>

      {/* Conteúdo do ticker */}
      <div className="ml-20">
        <div className="flex animate-scroll space-x-8">
          {stocks.map((stock, index) => (
            <div key={`${stock.symbol}-${index}`} className="flex items-center space-x-3 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{stock.symbol}</span>
                <span className="text-xs opacity-80 truncate max-w-20">{stock.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">R$ {formatPrice(stock.price)}</span>
                <div className={`flex items-center space-x-1 text-xs ${
                  stock.change >= 0 
                    ? 'text-green-200 dark:text-green-300' 
                    : 'text-red-200 dark:text-red-300'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{formatChange(stock.change)}</span>
                  <span>({formatChangePercent(stock.changePercent)})</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Duplicar para loop contínuo */}
          {stocks.map((stock, index) => (
            <div key={`${stock.symbol}-duplicate-${index}`} className="flex items-center space-x-3 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{stock.symbol}</span>
                <span className="text-xs opacity-80 truncate max-w-20">{stock.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">R$ {formatPrice(stock.price)}</span>
                <div className={`flex items-center space-x-1 text-xs ${
                  stock.change >= 0 
                    ? 'text-green-200 dark:text-green-300' 
                    : 'text-red-200 dark:text-red-300'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{formatChange(stock.change)}</span>
                  <span>({formatChangePercent(stock.changePercent)})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradiente nas bordas para efeito de fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary-500 to-transparent dark:from-neon-blue dark:to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary-600 to-transparent dark:from-neon-purple dark:to-transparent pointer-events-none"></div>
    </div>
  );
};

export default StockTicker;
