import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import useCoinChart from '../hooks/useCoinChart';
import { connectMetaMask, buyWithMetaMask, formatAddress, formatBalance } from '../lib/wallet';

const CryptoWidget = () => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');

  const { points, loading, error } = useCoinChart('bitcoin', 1);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const walletData = await connectMetaMask();
      setWallet(walletData);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBuy = async () => {
    if (!wallet || !buyAmount) {
      alert('Conecte sua carteira e insira um valor');
      return;
    }

    setIsBuying(true);
    try {
      const txHash = await buyWithMetaMask(parseFloat(buyAmount));
      setLastTxHash(txHash);
      alert(`Transação enviada! Hash: ${txHash}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsBuying(false);
    }
  };

  // Calcular variação de preço
  const getPriceChange = () => {
    if (points.length < 2) return { change: 0, isPositive: true };
    
    const currentPrice = points[points.length - 1].y;
    const previousPrice = points[0].y;
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    return {
      change: Math.abs(change),
      isPositive: change >= 0
    };
  };

  const priceChange = getPriceChange();
  const currentPrice = points.length > 0 ? points[points.length - 1].y : 0;

  return (
    <div className="crypto-widget">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
        style={{
          padding: '2rem',
          background: 'var(--card-bg)',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
          border: '1px solid rgba(42, 127, 79, 0.1)'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            color: 'var(--accent)', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <DollarSign size={24} />
            Bitcoin (BTC)
          </h3>
          
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} className="animate-spin" />
              <span style={{ color: 'var(--muted)' }}>Carregando preço...</span>
            </div>
          ) : error ? (
            <span style={{ color: '#ef4444' }}>Erro ao carregar dados</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: priceChange.isPositive ? '#10b981' : '#ef4444'
              }}>
                {priceChange.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{priceChange.change.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico Simples */}
        <div style={{ 
          height: '200px', 
          background: 'linear-gradient(135deg, rgba(42, 127, 79, 0.1) 0%, rgba(42, 127, 79, 0.05) 100%)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {points.length > 0 ? (
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
              <polyline
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                points={points.map((point, index) => {
                  const x = (index / (points.length - 1)) * 100;
                  const y = 100 - ((point.y - Math.min(...points.map(p => p.y))) / 
                    (Math.max(...points.map(p => p.y)) - Math.min(...points.map(p => p.y)))) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
            </svg>
          ) : (
            <span style={{ color: 'var(--muted)' }}>Gráfico indisponível</span>
          )}
        </div>

        {/* Carteira */}
        <div style={{ marginBottom: '1.5rem' }}>
          {wallet ? (
            <div style={{
              background: 'rgba(42, 127, 79, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(42, 127, 79, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Wallet size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: '600' }}>Carteira Conectada</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                <div>Endereço: {formatAddress(wallet.address)}</div>
                <div>Saldo: {formatBalance(wallet.balance)} ETH</div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn"
              style={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Wallet size={20} />
              {isConnecting ? 'Conectando...' : 'Conectar MetaMask'}
            </button>
          )}
        </div>

        {/* Compra */}
        {wallet && (
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
              Comprar Bitcoin
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="Valor em ETH"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid rgba(42, 127, 79, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'rgba(42, 127, 79, 0.05)'
                }}
              />
              <button
                onClick={handleBuy}
                disabled={isBuying || !buyAmount}
                className="btn"
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isBuying ? 'Comprando...' : 'Comprar'}
              </button>
            </div>
            
            {lastTxHash && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ExternalLink size={16} />
                <span>Última transação: {formatAddress(lastTxHash)}</span>
              </div>
            )}
          </div>
        )}

        {/* Informações */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(42, 127, 79, 0.05)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'var(--muted)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            Dados atualizados a cada 5 minutos via CoinGecko API
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CryptoWidget;
