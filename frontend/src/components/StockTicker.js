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
          { symbol: 'VALE3', name: 'Vale', price: 68.20, change: -1.30, changePercent: -1.87 },
          { symbol: 'ITUB4', name: 'Itaú', price: 28.90, change: 0.45, changePercent: 1.58 },
          { symbol: 'BBDC4', name: 'Bradesco', price: 22.15, change: -0.25, changePercent: -1.12 },
          { symbol: 'ABEV3', name: 'Ambev', price: 12.80, change: 0.20, changePercent: 1.59 },
          { symbol: 'MGLU3', name: 'Magazine Luiza', price: 8.45, change: 0.15, changePercent: 1.81 },
          { symbol: 'WEGE3', name: 'WEG', price: 45.60, change: -0.80, changePercent: -1.72 },
          { symbol: 'RENT3', name: 'Localiza', price: 55.30, change: 1.20, changePercent: 2.22 }
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
      <div style={{ 
        background: '#000000', 
        color: '#ffffff', 
        padding: '8px 0', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            background: '#ffffff', 
            borderRadius: '50%',
            animation: 'pulse 1s infinite'
          }}></div>
          <span style={{ fontSize: '14px' }}>Carregando dados da bolsa...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#000000', 
      color: '#ffffff', 
      padding: '8px 0', 
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1000,
      borderBottom: '1px solid #333'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '32px',
        animation: 'scroll 60s linear infinite',
        whiteSpace: 'nowrap'
      }}>
        {stocks.map((stock, index) => (
          <div key={stock.symbol} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            minWidth: '200px'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{stock.symbol}</span>
            <span style={{ fontSize: '12px', color: '#ccc' }}>{stock.name}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>R$ {stock.price.toFixed(2)}</span>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: stock.change >= 0 ? '#4ade80' : '#f87171'
            }}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
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
      `}</style>
    </div>
  );
};

export default StockTicker;