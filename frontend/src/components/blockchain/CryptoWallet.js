import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Send, Receive, Copy, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const CryptoWallet = () => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('solana'); // 'solana' ou 'polygon'

  // Criptomoedas suportadas para INTERMEDIAÇÃO
  const supportedCryptos = [
    { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '🟣', network: 'solana', commissionRate: 0.05 },
    { id: 'matic', name: 'Polygon', symbol: 'MATIC', icon: '🟣', network: 'polygon', commissionRate: 0.05 },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '🔵', network: 'both', commissionRate: 0.05 },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '🟡', network: 'both', commissionRate: 0.05 },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '🟠', network: 'bitcoin', commissionRate: 0.05 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🔷', network: 'ethereum', commissionRate: 0.05 }
  ];


  // Carregar carteira
  const loadWallet = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/blockchain/wallet', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setWallet(data.wallet);
        setIsConnected(true);
        
        analytics.trackEvent('crypto_wallet_loaded', {
          network: data.wallet.network,
          has_balance: data.wallet.balance > 0
        });
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  }, [analytics]);

  // Carregar preços das criptomoedas
  const loadCryptoPrices = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/prices');
      const data = await response.json();
      
      if (data.success) {
        setCryptoPrices(data.prices);
      }
    } catch (error) {
      console.error('Error loading crypto prices:', error);
    }
  }, []);

  // Carregar transações
  const loadTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, []);

  // Conectar carteira
  const connectWallet = useCallback(async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        const publicKey = response.publicKey.toString();
        
        // Registrar carteira no backend
        const backendResponse = await fetch('/api/blockchain/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            publicKey,
            network: 'solana'
          })
        });

        const data = await backendResponse.json();

        if (data.success) {
          setIsConnected(true);
          setWallet(data.wallet);
          
          analytics.trackEvent('crypto_wallet_connected', {
            network: 'solana',
            public_key: publicKey
          });
        }
      } else {
        alert(t('crypto.phantomNotFound', 'Phantom wallet não encontrado. Instale a extensão Phantom.'));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(t('crypto.connectionError', 'Erro ao conectar carteira'));
    }
  }, [analytics, t]);

  // Desconectar carteira
  const disconnectWallet = useCallback(async () => {
    try {
      await fetch('/api/blockchain/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setIsConnected(false);
      setWallet(null);
      
      analytics.trackEvent('crypto_wallet_disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [analytics]);


  // Trocar rede
  const switchNetwork = useCallback(async (newNetwork) => {
    try {
      const response = await fetch('/api/blockchain/switch-network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          network: newNetwork
        })
      });

      const data = await response.json();

      if (data.success) {
        setNetwork(newNetwork);
        loadWallet();
        
        analytics.trackEvent('crypto_network_switched', {
          network: newNetwork
        });
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  }, [loadWallet, analytics]);

  // Copiar endereço
  const copyAddress = useCallback((address) => {
    navigator.clipboard.writeText(address);
    analytics.trackEvent('crypto_address_copied');
  }, [analytics]);

  // Carregar dados iniciais
  useEffect(() => {
    loadWallet();
    loadCryptoPrices();
    loadTransactions();
  }, [loadWallet, loadCryptoPrices, loadTransactions]);

  // Atualizar preços periodicamente
  useEffect(() => {
    const interval = setInterval(loadCryptoPrices, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, [loadCryptoPrices]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-agro-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            {t('crypto.loading', 'Carregando carteira...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('crypto.wallet', 'Carteira Cripto')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('crypto.walletSubtitle', 'Gerencie suas criptomoedas e NFTs')}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {/* Seletor de rede */}
          <select
            value={network}
            onChange={(e) => switchNetwork(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="solana">Solana</option>
            <option value="polygon">Polygon</option>
          </select>

          {isConnected ? (
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('crypto.disconnect', 'Desconectar')}
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('crypto.connect', 'Conectar Carteira')}
            </button>
          )}
        </div>
      </div>

      {!isConnected ? (
        /* Estado desconectado */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('crypto.connectWallet', 'Conecte sua carteira')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('crypto.connectWalletDescription', 'Conecte sua carteira Phantom ou MetaMask para começar a usar criptomoedas')}
          </p>
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('crypto.connectNow', 'Conectar Agora')}
          </button>
        </div>
      ) : (
        /* Carteira conectada */
        <div className="space-y-6">
          {/* Resumo da carteira */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('crypto.walletOverview', 'Visão Geral')}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('crypto.network', 'Rede')}:
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {network.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  R$ {wallet?.totalValue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('crypto.totalValue', 'Valor Total')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {wallet?.balance?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('crypto.currencies', 'Moedas')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {wallet?.nfts?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('crypto.nfts', 'NFTs')}
                </div>
              </div>
            </div>

            {/* Endereço da carteira */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('crypto.walletAddress', 'Endereço da Carteira')}
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {wallet?.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}` : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyAddress(wallet?.address)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://explorer.solana.com/address/${wallet?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Saldos das criptomoedas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('crypto.balances', 'Saldos')}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {wallet?.balance?.map((balance) => {
                const crypto = supportedCryptos.find(c => c.id === balance.currency);
                const price = cryptoPrices[balance.currency] || 0;
                const value = balance.amount * price;
                const change = Math.random() * 20 - 10; // Simular mudança de preço

                return (
                  <div key={balance.currency} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-lg">{crypto?.icon || '🪙'}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {crypto?.name || balance.currency.toUpperCase()}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {crypto?.symbol || balance.currency.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {balance.amount.toFixed(6)} {crypto?.symbol || balance.currency.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          R$ {value.toFixed(2)}
                        </div>
                        <div className={`text-xs flex items-center ${
                          change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NFTs */}
          {wallet?.nfts && wallet.nfts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('crypto.nfts', 'NFTs')}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallet.nfts.map((nft) => (
                    <div key={nft.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {nft.image ? (
                          <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-4xl">🖼️</div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {nft.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {nft.collection}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transações recentes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('crypto.recentTransactions', 'Transações Recentes')}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'send' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
                      }`}>
                        {transaction.type === 'send' ? (
                          <Send className="w-4 h-4 text-red-600" />
                        ) : (
                          <Receive className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'send' ? t('crypto.sent', 'Enviado') : t('crypto.received', 'Recebido')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.currency.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.currency.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoWallet;

