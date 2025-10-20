import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Copy, Check, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const MetaMaskIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Endereço da carteira central (REMOVIDO POR SEGURANÇA)
  const CENTRAL_WALLET = '';

  const checkConnection = useCallback(async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        await getBalance(accounts[0]);
        await loadTransactions();
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    }
  }, []);

  useEffect(() => {
    // Verificar se MetaMask está instalado
    if (typeof window.ethereum !== 'undefined') {
      checkConnection();
    }
  }, [checkConnection]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask não está instalado. Por favor, instale a extensão MetaMask.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        await getBalance(accounts[0]);
        await loadTransactions();
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      setError('Erro ao conectar com MetaMask. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBalance = async address => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      // Converter de wei para ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      setBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
    }
  };

  const loadTransactions = async () => {
    // Simular transações (em produção, buscar do backend)
    const mockTransactions = [
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
        amount: 0.1,
        price: 3200,
        total: 320,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
      }
    ];
    setTransactions(mockTransactions);
  };

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const buyCrypto = async (crypto, amount) => {
    if (!isConnected) {
      setError('Conecte sua carteira primeiro');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular compra (em produção, integrar com smart contract)
      const transaction = {
        id: Date.now(),
        type: 'buy',
        crypto: crypto,
        amount: amount,
        price: crypto === 'BTC' ? 45000 : crypto === 'ETH' ? 3200 : 100,
        total: amount * (crypto === 'BTC' ? 45000 : crypto === 'ETH' ? 3200 : 100),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      setTransactions(prev => [transaction, ...prev]);

      // Simular confirmação
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => (tx.id === transaction.id ? { ...tx, status: 'completed' } : tx)));
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Erro na compra:', error);
      setError('Erro ao processar compra');
      setIsLoading(false);
    }
  };

  const formatAddress = address => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='metamask-integration'>
      <div className='metamask-header'>
        <div className='metamask-title'>
          <Wallet size={24} className='text-neon' />
          <span>MetaMask Integration</span>
        </div>
        <div className='metamask-subtitle'>Compre e venda criptomoedas com segurança</div>
      </div>

      {!isConnected ? (
        <div className='metamask-connect'>
          <div className='metamask-connect-content'>
            <Wallet size={48} className='metamask-icon' />
            <h3>Conecte sua Carteira</h3>
            <p>Conecte sua carteira MetaMask para começar a negociar criptomoedas</p>
            <button className='btn-premium-primary' onClick={connectWallet} disabled={isLoading}>
              {isLoading ? 'Conectando...' : 'Conectar MetaMask'}
            </button>
          </div>
        </div>
      ) : (
        <div className='metamask-dashboard'>
          <div className='metamask-account'>
            <div className='metamask-account-info'>
              <div className='metamask-account-address'>
                <span>Endereço:</span>
                <div className='metamask-address'>
                  <span>{formatAddress(account)}</span>
                  <button className='metamask-copy-btn' onClick={() => copyToClipboard(account)}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className='metamask-balance'>
                <span>Saldo:</span>
                <span className='metamask-balance-value'>{balance} ETH</span>
              </div>
            </div>
          </div>

          <div className='metamask-actions'>
            <div className='metamask-buy-section'>
              <h4>Comprar Criptomoedas</h4>
              <div className='metamask-crypto-grid'>
                {[
                  { symbol: 'BTC', name: 'Bitcoin', price: 45000 },
                  { symbol: 'ETH', name: 'Ethereum', price: 3200 },
                  { symbol: 'AVAX', name: 'Avalanche', price: 35 }
                ].map(crypto => (
                  <div key={crypto.symbol} className='metamask-crypto-card'>
                    <div className='metamask-crypto-info'>
                      <span className='metamask-crypto-symbol'>{crypto.symbol}</span>
                      <span className='metamask-crypto-name'>{crypto.name}</span>
                      <span className='metamask-crypto-price'>${crypto.price.toLocaleString()}</span>
                    </div>
                    <button
                      className='btn-premium-gold'
                      onClick={() => buyCrypto(crypto.symbol, 0.001)}
                      disabled={isLoading}
                    >
                      Comprar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='metamask-transactions'>
            <h4>Transações Recentes</h4>
            <div className='metamask-transactions-list'>
              {transactions.map(tx => (
                <div key={tx.id} className='metamask-transaction'>
                  <div className='metamask-transaction-type'>
                    {tx.type === 'buy' ? (
                      <TrendingUp size={16} className='text-success' />
                    ) : (
                      <TrendingDown size={16} className='text-danger' />
                    )}
                    <span className={`metamask-transaction-type-text ${tx.type}`}>
                      {tx.type === 'buy' ? 'Compra' : 'Venda'}
                    </span>
                  </div>
                  <div className='metamask-transaction-details'>
                    <span className='metamask-transaction-crypto'>{tx.crypto}</span>
                    <span className='metamask-transaction-amount'>{tx.amount}</span>
                    <span className='metamask-transaction-total'>${tx.total}</span>
                  </div>
                  <div className='metamask-transaction-meta'>
                    <span className='metamask-transaction-date'>{formatDate(tx.timestamp)}</span>
                    <span className={`metamask-transaction-status ${tx.status}`}>
                      {tx.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='metamask-error'>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className='metamask-info'>
        <div className='metamask-info-item'>
          <span className='metamask-info-label'>Carteira Central:</span>
          <div className='metamask-info-value'>
            <span>{formatAddress(CENTRAL_WALLET)}</span>
            <button className='metamask-copy-btn' onClick={() => copyToClipboard(CENTRAL_WALLET)}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        <p className='metamask-info-text'>
          Todas as transações são processadas através da carteira central AgroSync para máxima segurança.
        </p>
      </div>

      <style jsx>{`
        .metamask-integration {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
        }

        .metamask-header {
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }

        .metamask-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }

        .metamask-subtitle {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }

        .metamask-connect {
          display: flex;
          justify-content: center;
          padding: var(--spacing-xl);
        }

        .metamask-connect-content {
          text-align: center;
          max-width: 400px;
        }

        .metamask-icon {
          color: var(--neon-blue);
          margin-bottom: var(--spacing-md);
        }

        .metamask-connect-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-sm);
        }

        .metamask-connect-content p {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
          margin-bottom: var(--spacing-lg);
          line-height: 1.5;
        }

        .metamask-dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .metamask-account {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
        }

        .metamask-account-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metamask-account-address {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .metamask-account-address span:first-child {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }

        .metamask-address {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .metamask-address span {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          color: var(--premium-white);
        }

        .metamask-copy-btn {
          background: var(--glass-white);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-sm);
          padding: var(--spacing-xs);
          color: var(--premium-gray-dark);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .metamask-copy-btn:hover {
          background: var(--glass-neon);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
        }

        .metamask-balance {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: right;
        }

        .metamask-balance span:first-child {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }

        .metamask-balance-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--light-gold);
        }

        .metamask-actions h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-md);
        }

        .metamask-crypto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .metamask-crypto-card {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .metamask-crypto-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .metamask-crypto-symbol {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--premium-white);
        }

        .metamask-crypto-name {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }

        .metamask-crypto-price {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--neon-blue);
        }

        .metamask-transactions h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-md);
        }

        .metamask-transactions-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .metamask-transaction {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-sm);
          padding: var(--spacing-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metamask-transaction-type {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .metamask-transaction-type-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .metamask-transaction-type-text.buy {
          color: var(--success);
        }

        .metamask-transaction-type-text.sell {
          color: var(--danger);
        }

        .metamask-transaction-details {
          display: flex;
          gap: var(--spacing-md);
          font-size: 0.875rem;
        }

        .metamask-transaction-crypto {
          color: var(--premium-white);
          font-weight: 600;
        }

        .metamask-transaction-amount {
          color: var(--premium-gray-dark);
        }

        .metamask-transaction-total {
          color: var(--light-gold);
          font-weight: 600;
        }

        .metamask-transaction-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: right;
        }

        .metamask-transaction-date {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }

        .metamask-transaction-status {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .metamask-transaction-status.completed {
          color: var(--success);
        }

        .metamask-transaction-status.pending {
          color: var(--warning);
        }

        .metamask-error {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--danger-glow);
          border: 1px solid var(--danger);
          border-radius: var(--radius-sm);
          color: var(--danger);
          font-size: 0.875rem;
          margin-top: var(--spacing-md);
        }

        .metamask-info {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--glass-white);
        }

        .metamask-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .metamask-info-label {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }

        .metamask-info-value {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .metamask-info-value span {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          color: var(--premium-white);
        }

        .metamask-info-text {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
          line-height: 1.4;
          margin-top: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .metamask-account-info {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }

          .metamask-balance {
            text-align: left;
          }

          .metamask-crypto-grid {
            grid-template-columns: 1fr;
          }

          .metamask-transaction {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
          }

          .metamask-transaction-meta {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default MetaMaskIntegration;
