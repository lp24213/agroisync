import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Ticker = () => {
  const { t } = useTranslation();
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    // Simular dados do ticker (manter lógica existente)
    const mockData = [
      { symbol: 'VALE3', price: 65.42, change: 1.25, changePercent: 1.95 },
      { symbol: 'PETR4', price: 32.18, change: -0.45, changePercent: -1.38 },
      { symbol: 'ITUB4', price: 28.90, change: 0.32, changePercent: 1.12 },
      { symbol: 'BBDC4', price: 15.67, change: -0.23, changePercent: -1.45 },
      { symbol: 'ABEV3', price: 12.45, change: 0.18, changePercent: 1.47 },
      { symbol: 'WEGE3', price: 45.20, change: 0.89, changePercent: 2.01 },
      { symbol: 'MGLU3', price: 8.90, change: -0.12, changePercent: -1.33 },
      { symbol: 'RENT3', price: 22.15, change: 0.45, changePercent: 2.07 }
    ];
    
    setTickerData(mockData);
  }, []);

  const formatPrice = (price) => {
    const locale = t('locale') || 'pt-BR';
    return price.toLocaleString(locale, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatChange = (change) => {
    const locale = t('locale') || 'pt-BR';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toLocaleString(locale, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatChangePercent = (changePercent) => {
    const locale = t('locale') || 'pt-BR';
    const sign = changePercent >= 0 ? '+' : '';
    return `(${sign}${changePercent.toLocaleString(locale, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}%)`;
  };

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        <div className="ticker-label">
          <span>Bolsa de Valores</span>
        </div>
        
        <div className="ticker-scroll">
          <motion.div
            className="ticker-items"
            animate={{ x: [0, -100] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
          >
            {tickerData.map((item, index) => (
              <div key={index} className="ticker-item">
                <span className="symbol">{item.symbol}</span>
                <span className="price">R${formatPrice(item.price)}</span>
                <span className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                  {formatChange(item.change)}
                </span>
                <span className={`change-percent ${item.change >= 0 ? 'positive' : 'negative'}`}>
                  {formatChangePercent(item.changePercent)}
                </span>
                <span className="separator">—</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      <style jsx>{`
        .ticker-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1001;
          background: linear-gradient(90deg, var(--nav-gradient-start) 0%, var(--nav-gradient-end) 100%);
          border-bottom: 1px solid var(--border-light);
          height: 40px;
          overflow: hidden;
        }
        
        .ticker-content {
          display: flex;
          align-items: center;
          height: 100%;
          max-width: 100%;
        }
        
        .ticker-label {
          background: var(--accent-metal);
          padding: 0 var(--spacing-sm);
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          border-right: 1px solid var(--border-light);
        }
        
        .ticker-scroll {
          flex: 1;
          overflow: hidden;
          height: 100%;
        }
        
        .ticker-items {
          display: flex;
          align-items: center;
          height: 100%;
          white-space: nowrap;
        }
        
        .ticker-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: 0 var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--muted);
        }
        
        .symbol {
          font-weight: 600;
          color: var(--text);
        }
        
        .price {
          font-weight: 500;
        }
        
        .change.positive {
          color: #059669;
        }
        
        .change.negative {
          color: #dc2626;
        }
        
        .change-percent.positive {
          color: #059669;
        }
        
        .change-percent.negative {
          color: #dc2626;
        }
        
        .separator {
          color: var(--text-light);
          margin: 0 var(--spacing-xs);
        }
        
        @media (max-width: 768px) {
          .ticker-container {
            height: 36px;
          }
          
          .ticker-item {
            font-size: 0.7rem;
            gap: 0.25rem;
            padding: 0 0.5rem;
          }
          
          .ticker-label {
            font-size: 0.7rem;
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Ticker;
