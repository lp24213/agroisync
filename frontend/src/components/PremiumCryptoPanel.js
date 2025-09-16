import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Bitcoin, Zap, Coins, Link, Activity, Wallet } from 'lucide-react';
import MetaMaskIntegration from './MetaMaskIntegration';

const PremiumCryptoPanel = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [showMetaMask, setShowMetaMask] = useState(false);

  useEffect(() => {
    // Dados base de criptomoedas
    const baseCryptoData = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        basePrice: 45000,
        icon: Bitcoin,
        color: '#f7931a',
        marketCap: 850000000000,
        volume24h: 25000000000
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        basePrice: 3200,
        icon: Zap,
        color: '#627eea',
        marketCap: 385000000000,
        volume24h: 15000000000
      },
      {
        name: 'Avalanche',
        symbol: 'AVAX',
        basePrice: 35,
        icon: Activity,
        color: '#e84142',
        marketCap: 8500000000,
        volume24h: 500000000
      },
      {
        name: 'BNB',
        symbol: 'BNB',
        basePrice: 320,
        icon: Coins,
        color: '#f3ba2f',
        marketCap: 50000000000,
        volume24h: 2000000000
      },
      {
        name: 'Cardano',
        symbol: 'ADA',
        icon: Coins,
        color: '#0033ad',
        basePrice: 0.45,
        marketCap: 15000000000,
        volume24h: 800000000
      },
      {
        name: 'Chainlink',
        symbol: 'LINK',
        icon: Link,
        color: '#2a5ada',
        basePrice: 15,
        marketCap: 8000000000,
        volume24h: 400000000
      }
    ];

    const loadCryptoData = async () => {
      try {
        // Simular variação realista baseada em dados de mercado
        const cryptoWithVariation = baseCryptoData.map(crypto => {
          // Variação de ±10% para simular mercado real
          const variation = (Math.random() - 0.5) * 0.2; // ±10%
          const newPrice = crypto.basePrice * (1 + variation);
          const change = newPrice - crypto.basePrice;
          const changePercent = (change / crypto.basePrice) * 100;
          
          return {
            ...crypto,
            price: newPrice,
            change: change,
            changePercent: changePercent
          };
        });
        
        setTimeout(() => {
          setCryptoData(cryptoWithVariation);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar dados de criptomoedas:', error);
        // Fallback para dados base
        const fallbackCrypto = baseCryptoData.map(crypto => ({
          ...crypto,
          price: crypto.basePrice,
          change: 0,
          changePercent: 0
        }));
        setCryptoData(fallbackCrypto);
        setIsLoading(false);
      }
    };

    loadCryptoData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  const timeframes = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' }
  ];

  if (isLoading) {
    return (
      <div className="premium-crypto-panel">
        <div className="premium-crypto-loading">
          <div className="premium-loading-spinner"></div>
          <span>Carregando dados de criptomoedas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-crypto-panel">
      <div className="premium-crypto-header">
        <div className="premium-crypto-title">
          <Bitcoin size={24} className="text-neon" />
          <span>Criptomoedas</span>
        </div>
        <div className="premium-crypto-controls">
          <div className="premium-crypto-timeframes">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                className={`premium-crypto-timeframe ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
                onClick={() => setSelectedTimeframe(timeframe.value)}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
          <button 
            className="premium-crypto-metamask-btn"
            onClick={() => setShowMetaMask(!showMetaMask)}
          >
            <Wallet size={16} />
            <span>{showMetaMask ? 'Voltar' : 'MetaMask'}</span>
          </button>
        </div>
      </div>
      
      {showMetaMask ? (
        <MetaMaskIntegration />
      ) : (
        <div className="premium-crypto-grid">
          {cryptoData.map((crypto, index) => {
            const IconComponent = crypto.icon;
            const isPositive = crypto.change >= 0;
            
            return (
              <motion.div 
                key={crypto.symbol}
                className="premium-crypto-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="premium-crypto-header-card">
                  <div className="premium-crypto-icon">
                    <IconComponent size={28} style={{ color: crypto.color }} />
                  </div>
                  <div className="premium-crypto-info">
                    <div className="premium-crypto-name">{crypto.name}</div>
                    <div className="premium-crypto-symbol">{crypto.symbol}</div>
                  </div>
                  <div className={`premium-crypto-change-indicator ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                </div>
                
                <div className="premium-crypto-price">
                  <div className="premium-crypto-value">
                    {formatPrice(crypto.price)}
                  </div>
                  <div className={`premium-crypto-change ${isPositive ? 'positive' : 'negative'}`}>
                    <span className="premium-crypto-change-value">
                      {formatChange(crypto.change)}
                    </span>
                    <span className="premium-crypto-change-percent">
                      ({formatChangePercent(crypto.changePercent)})
                    </span>
                  </div>
                </div>
                
                <div className="premium-crypto-stats">
                  <div className="premium-crypto-stat">
                    <span className="premium-crypto-stat-label">Market Cap</span>
                    <span className="premium-crypto-stat-value">
                      {formatMarketCap(crypto.marketCap)}
                    </span>
                  </div>
                  <div className="premium-crypto-stat">
                    <span className="premium-crypto-stat-label">Volume 24h</span>
                    <span className="premium-crypto-stat-value">
                      {formatVolume(crypto.volume24h)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        .premium-crypto-panel {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
        }
        
        .premium-crypto-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          color: var(--premium-gray-dark);
        }
        
        .premium-loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--glass-white);
          border-top: 2px solid var(--neon-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .premium-crypto-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }
        
        .premium-crypto-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .premium-crypto-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .premium-crypto-timeframes {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .premium-crypto-timeframe {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--glass-white);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-sm);
          color: var(--premium-gray-dark);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .premium-crypto-timeframe:hover {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
        }
        
        .premium-crypto-timeframe.active {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .premium-crypto-metamask-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--glass-gold);
          border: 1px solid var(--light-gold);
          border-radius: var(--radius-sm);
          color: var(--light-gold);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .premium-crypto-metamask-btn:hover {
          background: var(--light-gold);
          color: var(--matte-black);
          box-shadow: var(--shadow-gold);
        }
        
        .premium-crypto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .premium-crypto-card {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .premium-crypto-card:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
          transform: translateY(-2px);
        }
        
        .premium-crypto-header-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .premium-crypto-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--glass-white);
          border-radius: var(--radius-sm);
        }
        
        .premium-crypto-info {
          flex: 1;
        }
        
        .premium-crypto-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-crypto-symbol {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-crypto-change-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
        }
        
        .premium-crypto-change-indicator.positive {
          background: var(--success-glow);
          color: var(--success);
        }
        
        .premium-crypto-change-indicator.negative {
          background: var(--danger-glow);
          color: var(--danger);
        }
        
        .premium-crypto-price {
          margin-bottom: var(--spacing-md);
        }
        
        .premium-crypto-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-crypto-change {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        
        .premium-crypto-change.positive {
          color: var(--success);
        }
        
        .premium-crypto-change.negative {
          color: var(--danger);
        }
        
        .premium-crypto-change-value {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .premium-crypto-change-percent {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .premium-crypto-stats {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .premium-crypto-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .premium-crypto-stat-label {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-crypto-stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        @media (max-width: 768px) {
          .premium-crypto-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
          
          .premium-crypto-card {
            padding: var(--spacing-md);
          }
          
          .premium-crypto-value {
            font-size: 1.25rem;
          }
          
          .premium-crypto-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumCryptoPanel;
