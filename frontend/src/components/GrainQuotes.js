import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Circle, Square, Triangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext'; // Removido para evitar warning

const GrainQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  // const { isDarkMode } = useTheme(); // Removido para evitar warning

  useEffect(() => {
    // Dados mockados de grãos (em produção, usar API de cotações)
    const mockQuotes = [
      {
        name: t('quotations.soy'),
        symbol: 'SOJA',
        price: 185.50,
        change: 2.30,
        changePercent: 1.25,
        icon: Circle,
        unit: 'R$/sc'
      },
      {
        name: t('quotations.corn'),
        symbol: 'MILHO',
        price: 89.75,
        change: -1.20,
        changePercent: -1.32,
        icon: Square,
        unit: 'R$/sc'
      },
      {
        name: t('quotations.wheat'),
        symbol: 'TRIGO',
        price: 125.80,
        change: 0.85,
        changePercent: 0.68,
        icon: Triangle,
        unit: 'R$/sc'
      },
      {
        name: t('quotations.cotton'),
        symbol: 'ALGODÃO',
        price: 4.25,
        change: -0.15,
        changePercent: -3.41,
        icon: TrendingUp,
        unit: 'R$/kg'
      }
    ];

    const loadQuotes = async () => {
      try {
        // Em produção, fazer chamada para API de cotações
        // const response = await fetch('https://api.cotacoes.com.br/...');
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
  }, [t]);

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
      <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
        <span className="font-semibold flex items-center gap-2 text-base text-primary">
          <Circle size={16} className="text-primary" />
          Cotações
        </span>
        
        {quotes.map((quote, index) => {
          const IconComponent = quote.icon;
          const isPositive = quote.change >= 0;
          
          return (
            <motion.div 
              key={quote.symbol}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-light shadow-sm hover:shadow-md transition-all bg-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IconComponent size={12} className="text-primary" />
              <span className="font-semibold text-xs text-primary">{quote.symbol}</span>
              <span className="text-xs font-medium text-muted">{formatPrice(quote.price)}</span>
              <div className={`flex items-center gap-1 ${isPositive ? 'text-primary' : 'text-danger'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="text-xs font-medium">
                  {formatChange(quote.change)}
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
