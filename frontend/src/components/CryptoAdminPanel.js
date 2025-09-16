import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Wallet,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CryptoAdminPanel = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalVolume: 2847392.50,
    totalTransactions: 8934,
    activeUsers: 892
  });
  const [transactions, setTransactions] = useState([]);
  const [userPortfolios, setUserPortfolios] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados do admin
    const mockTransactions = [
      {
        id: 1,
        userId: 'user_001',
        userName: 'João Silva',
        type: 'buy',
        crypto: 'BTC',
        amount: 0.001,
        price: 45000,
        total: 45,
        timestamp: new Date().toISOString(),
        status: 'completed',
        wallet: '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1'
      },
      {
        id: 2,
        userId: 'user_002',
        userName: 'Maria Santos',
        type: 'sell',
        crypto: 'ETH',
        amount: 0.1,
        price: 3200,
        total: 320,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed',
        wallet: '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1'
      },
      {
        id: 3,
        userId: 'user_003',
        userName: 'Pedro Costa',
        type: 'buy',
        crypto: 'AVAX',
        amount: 10,
        price: 35,
        total: 350,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'pending',
        wallet: '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1'
      }
    ];

    const mockPortfolios = [
      {
        userId: 'user_001',
        userName: 'João Silva',
        totalValue: 1250.75,
        cryptos: [
          { symbol: 'BTC', amount: 0.001, value: 45 },
          { symbol: 'ETH', amount: 0.05, value: 160 },
          { symbol: 'AVAX', amount: 5, value: 175 }
        ],
        lastActivity: new Date().toISOString()
      },
      {
        userId: 'user_002',
        userName: 'Maria Santos',
        totalValue: 2840.20,
        cryptos: [
          { symbol: 'BTC', amount: 0.002, value: 90 },
          { symbol: 'ETH', amount: 0.1, value: 320 },
          { symbol: 'BNB', amount: 2, value: 640 }
        ],
        lastActivity: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setUserPortfolios(mockPortfolios);
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

  const exportData = (type) => {
    // Simular exportação de dados
    console.log(`Exportando dados: ${type}`);
  };

  const refreshData = () => {
    loadAdminData();
  };

  return (
    <div className="crypto-admin-panel">
      <div className="crypto-admin-header">
        <div className="crypto-admin-title">
          <BarChart3 size={24} className="text-neon" />
          <span>Painel Administrativo - Criptomoedas</span>
        </div>
        <div className="crypto-admin-actions">
          <button 
            className="crypto-admin-refresh-btn"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Atualizar</span>
          </button>
          <button 
            className="crypto-admin-export-btn"
            onClick={() => exportData('transactions')}
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="crypto-admin-stats">
        <div className="crypto-admin-stats-grid">
          <div className="crypto-admin-stat-card">
            <div className="crypto-admin-stat-icon">
              <Users size={24} />
            </div>
            <div className="crypto-admin-stat-content">
              <div className="crypto-admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
              <div className="crypto-admin-stat-label">Total de Usuários</div>
            </div>
          </div>
          
          <div className="crypto-admin-stat-card">
            <div className="crypto-admin-stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="crypto-admin-stat-content">
              <div className="crypto-admin-stat-value">{formatCurrency(stats.totalVolume)}</div>
              <div className="crypto-admin-stat-label">Volume Total</div>
            </div>
          </div>
          
          <div className="crypto-admin-stat-card">
            <div className="crypto-admin-stat-icon">
              <Activity size={24} />
            </div>
            <div className="crypto-admin-stat-content">
              <div className="crypto-admin-stat-value">{stats.totalTransactions.toLocaleString()}</div>
              <div className="crypto-admin-stat-label">Transações</div>
            </div>
          </div>
          
          <div className="crypto-admin-stat-card">
            <div className="crypto-admin-stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="crypto-admin-stat-content">
              <div className="crypto-admin-stat-value">{stats.activeUsers.toLocaleString()}</div>
              <div className="crypto-admin-stat-label">Usuários Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="crypto-admin-section">
        <div className="crypto-admin-section-header">
          <h3>Transações Recentes</h3>
          <div className="crypto-admin-section-actions">
            <button className="crypto-admin-view-all-btn">
              <Eye size={16} />
              <span>Ver Todas</span>
            </button>
          </div>
        </div>
        
        <div className="crypto-admin-transactions">
          {transactions.map((tx) => (
            <motion.div 
              key={tx.id}
              className="crypto-admin-transaction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="crypto-admin-transaction-type">
                {tx.type === 'buy' ? (
                  <TrendingUp size={16} className="text-success" />
                ) : (
                  <TrendingDown size={16} className="text-danger" />
                )}
                <span className={`crypto-admin-transaction-type-text ${tx.type}`}>
                  {tx.type === 'buy' ? 'Compra' : 'Venda'}
                </span>
              </div>
              
              <div className="crypto-admin-transaction-user">
                <span className="crypto-admin-transaction-user-name">{tx.userName}</span>
                <span className="crypto-admin-transaction-user-id">ID: {tx.userId}</span>
              </div>
              
              <div className="crypto-admin-transaction-details">
                <span className="crypto-admin-transaction-crypto">{tx.crypto}</span>
                <span className="crypto-admin-transaction-amount">{tx.amount}</span>
                <span className="crypto-admin-transaction-total">{formatCurrency(tx.total)}</span>
              </div>
              
              <div className="crypto-admin-transaction-meta">
                <span className="crypto-admin-transaction-date">{formatDate(tx.timestamp)}</span>
                <span className={`crypto-admin-transaction-status ${tx.status}`}>
                  {tx.status === 'completed' ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfólios dos Usuários */}
      <div className="crypto-admin-section">
        <div className="crypto-admin-section-header">
          <h3>Portfólios dos Usuários</h3>
        </div>
        
        <div className="crypto-admin-portfolios">
          {userPortfolios.map((portfolio) => (
            <motion.div 
              key={portfolio.userId}
              className="crypto-admin-portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="crypto-admin-portfolio-header">
                <div className="crypto-admin-portfolio-user">
                  <span className="crypto-admin-portfolio-user-name">{portfolio.userName}</span>
                  <span className="crypto-admin-portfolio-user-id">ID: {portfolio.userId}</span>
                </div>
                <div className="crypto-admin-portfolio-total">
                  <span className="crypto-admin-portfolio-total-value">
                    {formatCurrency(portfolio.totalValue)}
                  </span>
                </div>
              </div>
              
              <div className="crypto-admin-portfolio-cryptos">
                {portfolio.cryptos.map((crypto) => (
                  <div key={crypto.symbol} className="crypto-admin-portfolio-crypto">
                    <span className="crypto-admin-portfolio-crypto-symbol">{crypto.symbol}</span>
                    <span className="crypto-admin-portfolio-crypto-amount">{crypto.amount}</span>
                    <span className="crypto-admin-portfolio-crypto-value">{formatCurrency(crypto.value)}</span>
                  </div>
                ))}
              </div>
              
              <div className="crypto-admin-portfolio-footer">
                <span className="crypto-admin-portfolio-last-activity">
                  Última atividade: {formatDate(portfolio.lastActivity)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .crypto-admin-panel {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
        }
        
        .crypto-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .crypto-admin-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-admin-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .crypto-admin-refresh-btn,
        .crypto-admin-export-btn {
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
        
        .crypto-admin-refresh-btn:hover,
        .crypto-admin-export-btn:hover {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
        }
        
        .crypto-admin-refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .crypto-admin-stats {
          margin-bottom: var(--spacing-xl);
        }
        
        .crypto-admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .crypto-admin-stat-card {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          transition: all 0.3s ease;
        }
        
        .crypto-admin-stat-card:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .crypto-admin-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--glass-neon);
          border-radius: var(--radius-sm);
          color: var(--neon-blue);
        }
        
        .crypto-admin-stat-content {
          flex: 1;
        }
        
        .crypto-admin-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .crypto-admin-stat-label {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-section {
          margin-bottom: var(--spacing-xl);
        }
        
        .crypto-admin-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .crypto-admin-section-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-admin-view-all-btn {
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
        
        .crypto-admin-view-all-btn:hover {
          background: var(--light-gold);
          color: var(--matte-black);
          box-shadow: var(--shadow-gold);
        }
        
        .crypto-admin-transactions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .crypto-admin-transaction {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: var(--spacing-lg);
          align-items: center;
        }
        
        .crypto-admin-transaction-type {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .crypto-admin-transaction-type-text {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .crypto-admin-transaction-type-text.buy {
          color: var(--success);
        }
        
        .crypto-admin-transaction-type-text.sell {
          color: var(--danger);
        }
        
        .crypto-admin-transaction-user {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .crypto-admin-transaction-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-admin-transaction-user-id {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-transaction-details {
          display: flex;
          gap: var(--spacing-md);
          font-size: 0.875rem;
        }
        
        .crypto-admin-transaction-crypto {
          color: var(--premium-white);
          font-weight: 600;
        }
        
        .crypto-admin-transaction-amount {
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-transaction-total {
          color: var(--light-gold);
          font-weight: 600;
        }
        
        .crypto-admin-transaction-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: right;
        }
        
        .crypto-admin-transaction-date {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-transaction-status {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .crypto-admin-transaction-status.completed {
          color: var(--success);
        }
        
        .crypto-admin-transaction-status.pending {
          color: var(--warning);
        }
        
        .crypto-admin-portfolios {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .crypto-admin-portfolio {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
        }
        
        .crypto-admin-portfolio:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
        }
        
        .crypto-admin-portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .crypto-admin-portfolio-user {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .crypto-admin-portfolio-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-admin-portfolio-user-id {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-portfolio-total-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--light-gold);
        }
        
        .crypto-admin-portfolio-cryptos {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }
        
        .crypto-admin-portfolio-crypto {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm);
          background: var(--glass-white);
          border-radius: var(--radius-sm);
        }
        
        .crypto-admin-portfolio-crypto-symbol {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
        }
        
        .crypto-admin-portfolio-crypto-amount {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .crypto-admin-portfolio-crypto-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neon-blue);
        }
        
        .crypto-admin-portfolio-footer {
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--glass-white);
        }
        
        .crypto-admin-portfolio-last-activity {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        @media (max-width: 768px) {
          .crypto-admin-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .crypto-admin-transaction {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
          
          .crypto-admin-transaction-meta {
            text-align: left;
          }
          
          .crypto-admin-portfolios {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoAdminPanel;
