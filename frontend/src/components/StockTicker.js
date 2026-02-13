import React, { useState, useEffect } from 'react';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Simulando dados da bolsa brasileira (B3)
        const mockStocks = [
          { symbol: 'PETR4', name: 'Petrobras', price: 32.45, change: 0.85, changePercent: 2.69 },
          { symbol: 'VALE3', name: 'Vale', price: 68.2, change: -1.3, changePercent: -1.87 },
          { symbol: 'ITUB4', name: 'Itaú', price: 28.9, change: 0.45, changePercent: 1.58 },
          { symbol: 'BBDC4', name: 'Bradesco', price: 22.15, change: -0.25, changePercent: -1.12 },
          { symbol: 'ABEV3', name: 'Ambev', price: 12.8, change: 0.2, changePercent: 1.59 },
          { symbol: 'MGLU3', name: 'Magazine Luiza', price: 8.45, change: 0.15, changePercent: 1.81 },
          { symbol: 'WEGE3', name: 'WEG', price: 45.6, change: -0.8, changePercent: -1.72 },
          { symbol: 'RENT3', name: 'Localiza', price: 55.3, change: 1.2, changePercent: 2.22 }
        ];

        setStocks(mockStocks);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da bolsa:', error);
        setLoading(false);
      }
    };

    fetchStockData();

    // Atualizar a cada 5 minutos ao invés de 30s para reduzir carga
    const interval = setInterval(fetchStockData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
      style={{
        background: '#000000',
        color: '#ffffff',
        padding: '4px 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1000,
        maxHeight: '32px'
      }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              background: '#ffffff',
              borderRadius: '50%',
              animation: 'pulse 1s infinite'
            }}
          ></div>
          <span style={{ fontSize: '11px' }}>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#000000',
        color: '#ffffff',
        padding: '4px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1000,
        borderBottom: '1px solid #333',
        maxHeight: '32px'
      }}
    >
      <div
        className='ticker-scroll'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          whiteSpace: 'nowrap',
          width: 'max-content',
          padding: '0 20px',
          willChange: 'transform'
        }}
      >
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '220px',
              flexShrink: 0,
              padding: '0 10px',
              height: '24px',
              borderRight: '1px solid #333'
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '11px',
                minWidth: '50px',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              {stock.symbol}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: '#999',
                minWidth: '60px',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'none'
              }}
              className='hidden md:inline'
            >
              {stock.name}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                minWidth: '55px',
                textAlign: 'right',
                color: '#ffffff'
              }}
            >
              R$ {stock.price.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: stock.change >= 0 ? '#4ade80' : '#ef4444',
                minWidth: '65px',
                textAlign: 'right',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0',
                margin: '0'
              }}
            >
              {stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .ticker-scroll {
          animation: tickerScroll 60s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .ticker-scroll { animation-duration: 90s !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-scroll { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StockTicker;
