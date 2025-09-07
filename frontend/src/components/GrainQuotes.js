import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Circle, Square, Triangle } from 'lucide-react';

const GrainQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dados mockados de grãos (em produção, usar API do AgroLink)
    const mockQuotes = [
      {
        name: 'Soja',
        symbol: 'SOJA',
        price: 185.50,
        change: 2.30,
        changePercent: 1.25,
        icon: Circle,
        unit: 'R$/sc'
      },
      {
        name: 'Milho',
        symbol: 'MILHO',
        price: 89.75,
        change: -1.20,
        changePercent: -1.32,
        icon: Square,
        unit: 'R$/sc'
      },
      {
        name: 'Trigo',
        symbol: 'TRIGO',
        price: 125.80,
        change: 0.85,
        changePercent: 0.68,
        icon: Triangle,
        unit: 'R$/sc'
      },
      {
        name: 'Algodão',
        symbol: 'ALGODAO',
        price: 4.25,
        change: -0.15,
        changePercent: -3.41,
        icon: TrendingUp,
        unit: 'R$/kg'
      }
    ];

    const loadQuotes = async () => {
      try {
        // Em produção, fazer chamada para API do AgroLink
        // const response = await fetch('https://api.agrolink.com.br/...');
        // const data = await response.json();
        
        // Por enquanto, usar dados mockados
        setTimeout(() => {
          setQuotes(mockQuotes);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar cotações de grãos:', error);
        setQuotes(mockQuotes);
        setIsLoading(false);
      }
    };

    loadQuotes();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(loadQuotes, 300000);
    
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
      <div className="grain-quotes">
        <div className="flex items-center gap-4">
          <div className="animate-pulse bg-gray-200 rounded h-4 w-32"></div>
          <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain-quotes">
      <div className="flex items-center gap-6 text-sm">
        <span className="font-semibold text-primary flex items-center gap-2">
          <Circle size={16} />
          Cotações AgroLink
        </span>
        
        {quotes.map((quote, index) => {
          const IconComponent = quote.icon;
          const isPositive = quote.change >= 0;
          
          return (
            <motion.div 
              key={quote.symbol}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IconComponent size={14} className="text-primary" />
              <span className="font-medium text-primary">{quote.symbol}</span>
              <span className="text-secondary">{formatPrice(quote.price)}</span>
              <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="font-medium">
                  {formatChange(quote.change)} ({formatChangePercent(quote.changePercent)})
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GrainQuotes;
