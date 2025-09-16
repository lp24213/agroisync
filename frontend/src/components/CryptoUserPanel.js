import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Eye,
  Download,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const CryptoUserPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    cryptos: [],
    transactions: [],
    stats: {
      totalInvested: 0,
      totalProfit: 0,
      profitPercentage: 0
    }
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados do usuário
    const mockPortfolio = {
      totalValue: 2840.75,
      cryptos: [
        { symbol: 'BTC', amount: 0.002, value: 90, change: 2.5 },
        { symbol: 'ETH', amount: 0.1, value: 320, change: -1.2 },
        { symbol: 'AVAX', amount: 5, value: 175, change: 5.8 },
        { symbol: 'BNB', amount: 2, value: 640, change: 3.2 }
      ],
      transactions: [
        {
          id: 1,
          type: 'buy',
          crypto: 'BTC',
          amount: 0.001,
          price: 45000,
          total: 45,
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          type: 'sell',
          crypto: 'ETH',
          amount: 0.05,
          price: 3200,
          total: 160,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        }
      ],
      stats: {
        totalInvested: 2500,
        totalProfit: 340.75,
        profitPercentage: 13.63
      }
    };

    setTimeout(() => {
      setPortfolio(mockPortfolio);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const refreshData = () => {
    loadUserData();
  };

  const exportPortfolio = () => {
    // Simular exportação do portfólio
    console.log('Exportando portfólio do usuário');
  };

  return (
    <div className="crypto-user-panel">
      <div className="crypto-user-header">
        <div className="crypto-user-title">
          <Wallet size={24} className="text-neon" />
          <span>Meu Portfólio de Criptomoedas</span>
        </div>
        <div className="crypto-user-actions">
          <button 
            className="crypto-user-refresh-btn"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Atualizar</span>
          </button>
          <button 
            className="crypto-user-export-btn"
            onClick={exportPortfolio}
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Resumo do Portfólio */}
      <div className="crypto-user-summary">
        <div className="crypto-user-summary-card">
          <div className="crypto-user-summary-icon">
            <DollarSign size={32} />
          </div>
          <div className="crypto-user-summary-content">
            <div className="crypto-user-summary-value">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="crypto-user-summary-label">Valor Total do Portfólio</div>
          </div>
        </div>
        
        <div className="crypto-user-summary-card">
          <div className="crypto-user-summary-icon">
            <TrendingUp size={32} />
          </div>
          <div className="crypto-user-summary-content">
            <div className="crypto-user-summary-value">
              {formatCurrency(portfolio.stats.totalProfit)}
            </div>
            <div className="crypto-user-summary-label">Lucro Total</div>
          </div>
        </div>
        
        <div className="crypto-user-summary-card">
          <div className="crypto-user-summary-icon">
            <BarChart3 size={32} />
          </div>
          <div className="crypto-user-summary-content">
            <div className={`crypto-user-summary-value ${portfolio.stats.profitPercentage >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(portfolio.stats.profitPercentage)}
            </div>
            <div className="crypto-user-summary-label">Rentabilidade</div>
          </div>
        </div>
      </div>

      {/* Criptomoedas do Portfólio */}
      <div className="crypto-user-section">
        <div className="crypto-user-section-header">
          <h3>Minhas Criptomoedas</h3>
          <div className="crypto-user-section-actions">
            <button className="crypto-user-add-btn">
              <Plus size={16} />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
        
        <div className="crypto-user-cryptos">
          {portfolio.cryptos.map((crypto) => (
            <motion.div 
              key={crypto.symbol}
              className="crypto-user-crypto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="crypto-user-crypto-header">
                <div className="crypto-user-crypto-info">
                  <span className="crypto-user-crypto-symbol">{crypto.symbol}</span>
                  <span className="crypto-user-crypto-amount">{crypto.amount}</span>
                </div>
                <div className={`crypto-user-crypto-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{formatPercentage(crypto.change)}</span>
                </div>
              </div>
              
              <div className="crypto-user-crypto-value">
                <span className="crypto-user-crypto-value-text">
                  {formatCurrency(crypto.value)}
                </span>
              </div>
              
              <div className="crypto-user-crypto-actions">
                <button className="crypto-user-crypto-buy-btn">
                  <Plus size={14} />
                  <span>Comprar</span>
                </button>
                <button className="crypto-user-crypto-sell-btn">
                  <Minus size={14} />
                  <span>Vender</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="crypto-user-section">
        <div className="crypto-user-section-header">
          <h3>Transações Recentes</h3>
          <div className="crypto-user-section-actions">
            <button className="crypto-user-view-all-btn">
              <Eye size={16} />
              <span>Ver Todas</span>
            </button>
          </div>
        </div>
        
        <div className="crypto-user-transactions">
          {portfolio.transactions.map((tx) => (
            <motion.div 
              key={tx.id}
              className="crypto-user-transaction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="crypto-user-transaction-type">
                {tx.type === 'buy' ? (
                  <TrendingUp size={16} className="text-success" />
                ) : (
                  <TrendingDown size={16} className="text-danger" />
                )}
                <span className={`crypto-user-transaction-type-text ${tx.type}`}>
                  {tx.type === 'buy' ? 'Compra' : 'Venda'}
                </span>
              </div>
              
              <div className="crypto-user-transaction-details">
                <span className="crypto-user-transaction-crypto">{tx.crypto}</span>
                <span className="crypto-user-transaction-amount">{tx.amount}</span>
                <span className="crypto-user-transaction-total">{formatCurrency(tx.total)}</span>
              </div>
              
              <div className="crypto-user-transaction-meta">
                <span className="crypto-user-transaction-date">{formatDate(tx.timestamp)}</span>
                <span className={`crypto-user-transaction-status ${tx.status}`}>
                  {tx.status === 'completed' ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estatísticas de Investimento */}
      <div className="crypto-user-section">
        <div className="crypto-user-section-header">
          <h3>Estatísticas de Investimento</h3>
        </div>
        
        <div className="crypto-user-stats">
          <div className="crypto-user-stat">
            <div className="crypto-user-stat-label">Total Investido</div>
            <div className="crypto-user-stat-value">{formatCurrency(portfolio.stats.totalInvested)}</div>
          </div>
          
          <div className="crypto-user-stat">
            <div className="crypto-user-stat-label">Lucro/Prejuízo</div>
            <div className={`crypto-user-stat-value ${portfolio.stats.totalProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(portfolio.stats.totalProfit)}
            </div>
          </div>
          
          <div className="crypto-user-stat">
            <div className="crypto-user-stat-label">Rentabilidade</div>
            <div className={`crypto-user-stat-value ${portfolio.stats.profitPercentage >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(portfolio.stats.profitPercentage)}
            </div>
          </div>
          
          <div className="crypto-user-stat">
            <div className="crypto-user-stat-label">Total de Transações</div>
            <div className="crypto-user-stat-value">{portfolio.transactions.length}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crypto-user-panel {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
        }
        
        .crypto-user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .crypto-user-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-user-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .crypto-user-refresh-btn,
        .crypto-user-export-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--glass-white);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-sm);
          color: var(--premium-white);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .crypto-user-refresh-btn:hover,
        .crypto-user-export-btn:hover {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
        }
        
        .crypto-user-refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .crypto-user-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .crypto-user-summary-card {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          transition: all 0.3s ease;
        }
        
        .crypto-user-summary-card:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .crypto-user-summary-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--glass-neon);
          border-radius: var(--radius-sm);
          color: var(--neon-blue);
        }
        
        .crypto-user-summary-content {
          flex: 1;
        }
        
        .crypto-user-summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .crypto-user-summary-value.positive {
          color: var(--success);
        }
        
        .crypto-user-summary-value.negative {
          color: var(--danger);
        }
        
        .crypto-user-summary-label {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-user-section {
          margin-bottom: var(--spacing-xl);
        }
        
        .crypto-user-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .crypto-user-section-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-user-add-btn,
        .crypto-user-view-all-btn {
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
        
        .crypto-user-add-btn:hover,
        .crypto-user-view-all-btn:hover {
          background: var(--light-gold);
          color: var(--matte-black);
          box-shadow: var(--shadow-gold);
        }
        
        .crypto-user-cryptos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .crypto-user-crypto {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
        }
        
        .crypto-user-crypto:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .crypto-user-crypto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .crypto-user-crypto-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .crypto-user-crypto-symbol {
          font-size: 1rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-user-crypto-amount {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-user-crypto-change {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .crypto-user-crypto-change.positive {
          color: var(--success);
        }
        
        .crypto-user-crypto-change.negative {
          color: var(--danger);
        }
        
        .crypto-user-crypto-value {
          margin-bottom: var(--spacing-md);
        }
        
        .crypto-user-crypto-value-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--light-gold);
        }
        
        .crypto-user-crypto-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .crypto-user-crypto-buy-btn,
        .crypto-user-crypto-sell-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .crypto-user-crypto-buy-btn {
          background: var(--glass-neon);
          border: 1px solid var(--neon-blue);
          color: var(--neon-blue);
        }
        
        .crypto-user-crypto-buy-btn:hover {
          background: var(--neon-blue);
          color: var(--matte-black);
        }
        
        .crypto-user-crypto-sell-btn {
          background: var(--glass-white);
          border: 1px solid var(--glass-white);
          color: var(--premium-white);
        }
        
        .crypto-user-crypto-sell-btn:hover {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
        }
        
        .crypto-user-transactions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .crypto-user-transaction {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .crypto-user-transaction-type {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .crypto-user-transaction-type-text {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .crypto-user-transaction-type-text.buy {
          color: var(--success);
        }
        
        .crypto-user-transaction-type-text.sell {
          color: var(--danger);
        }
        
        .crypto-user-transaction-details {
          display: flex;
          gap: var(--spacing-md);
          font-size: 0.875rem;
        }
        
        .crypto-user-transaction-crypto {
          color: var(--premium-white);
          font-weight: 600;
        }
        
        .crypto-user-transaction-amount {
          color: var(--premium-gray-dark);
        }
        
        .crypto-user-transaction-total {
          color: var(--light-gold);
          font-weight: 600;
        }
        
        .crypto-user-transaction-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: right;
        }
        
        .crypto-user-transaction-date {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-user-transaction-status {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .crypto-user-transaction-status.completed {
          color: var(--success);
        }
        
        .crypto-user-transaction-status.pending {
          color: var(--warning);
        }
        
        .crypto-user-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .crypto-user-stat {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .crypto-user-stat:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .crypto-user-stat-label {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
          margin-bottom: var(--spacing-sm);
        }
        
        .crypto-user-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--premium-white);
        }
        
        .crypto-user-stat-value.positive {
          color: var(--success);
        }
        
        .crypto-user-stat-value.negative {
          color: var(--danger);
        }
        
        @media (max-width: 768px) {
          .crypto-user-summary {
            grid-template-columns: 1fr;
          }
          
          .crypto-user-cryptos {
            grid-template-columns: 1fr;
          }
          
          .crypto-user-transaction {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }
          
          .crypto-user-transaction-meta {
            text-align: left;
          }
          
          .crypto-user-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .crypto-user-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoUserPanel;
