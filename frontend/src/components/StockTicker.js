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

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: '#000000',
          color: '#ffffff',
          padding: '8px 0',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#ffffff',
              borderRadius: '50%',
              animation: 'pulse 1s infinite'
            }}
          ></div>
          <span style={{ fontSize: '14px' }}>Carregando dados da bolsa...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#000000',
        color: '#ffffff',
        padding: '8px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1000,
        borderBottom: '1px solid #333'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          animation: 'scroll 120s linear infinite',
          whiteSpace: 'nowrap',
          width: 'max-content',
          padding: '0 20px'
        }}
      >
        {stocks.map((stock, index) => (
          <div
            key={stock.symbol}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              minWidth: '280px',
              flexShrink: 0,
              padding: '0 16px',
              height: '40px',
              borderRight: '1px solid #333'
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '14px',
                minWidth: '70px',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              {stock.symbol}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: '#ccc',
                minWidth: '100px',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {stock.name}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                minWidth: '80px',
                textAlign: 'right',
                color: '#ffffff'
              }}
            >
              R$ {stock.price.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: stock.change >= 0 ? '#4ade80' : '#f87171',
                minWidth: '90px',
                textAlign: 'right'
              }}
            >
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        /* Reduzir ou desativar rolagem no mobile/landscape e em preferências de movimento reduzido */
        @media (max-width: 768px) {
          div[style*="animation: scroll"] { animation-duration: 180s !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation: scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StockTicker;
