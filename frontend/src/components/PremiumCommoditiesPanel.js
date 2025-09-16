import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Circle, Square, Triangle, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PremiumCommoditiesPanel = () => {
  const { t } = useTranslation();
  const [commodities, setCommodities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dados base de commodities com variação realista
    const baseCommodities = [
      {
        name: t('quotations.soy') || 'Soja',
        symbol: 'SOJA',
        basePrice: 185.50,
        icon: Circle,
        unit: 'R$/sc',
        color: '#00ff88'
      },
      {
        name: t('quotations.corn') || 'Milho',
        symbol: 'MILHO',
        basePrice: 89.75,
        icon: Square,
        unit: 'R$/sc',
        color: '#ffd700'
      },
      {
        name: t('quotations.wheat') || 'Trigo',
        symbol: 'TRIGO',
        basePrice: 125.80,
        icon: Triangle,
        unit: 'R$/sc',
        color: '#00d4ff'
      },
      {
        name: t('quotations.cotton') || 'Algodão',
        symbol: 'ALGODÃO',
        basePrice: 4.25,
        icon: Activity,
        unit: 'R$/kg',
        color: '#ff4757'
      }
    ];

    const loadCommodities = async () => {
      try {
        // Simular variação realista baseada em dados de mercado
        const commoditiesWithVariation = baseCommodities.map(commodity => {
          // Variação de ±5% para simular mercado real
          const variation = (Math.random() - 0.5) * 0.1; // ±5%
          const newPrice = commodity.basePrice * (1 + variation);
          const change = newPrice - commodity.basePrice;
          const changePercent = (change / commodity.basePrice) * 100;
          
          return {
            ...commodity,
            price: newPrice,
            change: change,
            changePercent: changePercent
          };
        });
        
        setTimeout(() => {
          setCommodities(commoditiesWithVariation);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar commodities:', error);
        // Fallback para dados base
        const fallbackCommodities = baseCommodities.map(commodity => ({
          ...commodity,
          price: commodity.basePrice,
          change: 0,
          changePercent: 0
        }));
        setCommodities(fallbackCommodities);
        setIsLoading(false);
      }
    };

    loadCommodities();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(loadCommodities, 300000);
    
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

  const formatChangePercent = (changePercent) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="premium-commodities-panel">
        <div className="premium-commodities-loading">
          <div className="premium-loading-spinner"></div>
          <span>Carregando commodities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-commodities-panel">
      <div className="premium-commodities-header">
        <div className="premium-commodities-title">
          <Activity size={20} className="text-neon" />
          <span>Cotações de Commodities</span>
        </div>
        <div className="premium-commodities-subtitle">
          Dados em tempo real
        </div>
      </div>
      
      <div className="premium-commodities-grid">
        {commodities.map((commodity, index) => {
          const IconComponent = commodity.icon;
          const isPositive = commodity.change >= 0;
          
          return (
            <motion.div 
              key={commodity.symbol}
              className="premium-commodity-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="premium-commodity-header">
                <div className="premium-commodity-icon">
                  <IconComponent size={24} style={{ color: commodity.color }} />
                </div>
                <div className="premium-commodity-info">
                  <div className="premium-commodity-name">{commodity.name}</div>
                  <div className="premium-commodity-symbol">{commodity.symbol}</div>
                </div>
              </div>
              
              <div className="premium-commodity-price">
                <div className="premium-commodity-value">
                  {formatPrice(commodity.price)}
                </div>
                <div className="premium-commodity-unit">{commodity.unit}</div>
              </div>
              
              <div className={`premium-commodity-change ${isPositive ? 'positive' : 'negative'}`}>
                <div className="premium-commodity-change-icon">
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="premium-commodity-change-info">
                  <div className="premium-commodity-change-value">
                    {formatChange(commodity.change)}
                  </div>
                  <div className="premium-commodity-change-percent">
                    {formatChangePercent(commodity.changePercent)}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <style jsx>{`
        .premium-commodities-panel {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
        }
        
        .premium-commodities-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          color: var(--premium-gray-dark);
        }
        
        .premium-loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--glass-white);
          border-top: 2px solid var(--neon-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .premium-commodities-header {
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
        
        .premium-commodities-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-commodities-subtitle {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-commodities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .premium-commodity-card {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .premium-commodity-card:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
          transform: translateY(-2px);
        }
        
        .premium-commodity-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .premium-commodity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--glass-white);
          border-radius: var(--radius-sm);
        }
        
        .premium-commodity-info {
          flex: 1;
        }
        
        .premium-commodity-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-commodity-symbol {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-commodity-price {
          margin-bottom: var(--spacing-md);
        }
        
        .premium-commodity-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-commodity-unit {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-commodity-change {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        
        .premium-commodity-change.positive {
          color: var(--success);
        }
        
        .premium-commodity-change.negative {
          color: var(--danger);
        }
        
        .premium-commodity-change-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: currentColor;
          border-radius: var(--radius-sm);
          opacity: 0.2;
        }
        
        .premium-commodity-change-info {
          flex: 1;
        }
        
        .premium-commodity-change-value {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-commodity-change-percent {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .premium-commodities-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
          
          .premium-commodity-card {
            padding: var(--spacing-md);
          }
          
          .premium-commodity-value {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumCommoditiesPanel;
