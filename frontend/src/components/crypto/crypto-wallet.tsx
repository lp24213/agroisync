'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, QrCode, Bitcoin, Plus, Minus, ArrowRight } from 'lucide-react';

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  asset: string;
  amount: number;
  value: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export function CryptoWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTab, setSelectedTab] = useState<'assets' | 'transactions' | 'payments'>('assets');

  useEffect(() => {
    // Mock data
    const mockAssets: WalletAsset[] = [
      { symbol: 'BTC', name: 'Bitcoin', balance: 0.125, value: 5415.63, change24h: 2.5 },
      { symbol: 'ETH', name: 'Ethereum', balance: 2.45, value: 6492.50, change24h: 1.8 },
      { symbol: 'SOL', name: 'Solana', balance: 45.2, value: 4443.04, change24h: 5.2 },
      { symbol: 'USDT', name: 'Tether', balance: 1000, value: 1000.00, change24h: 0.0 },
    ];

    const mockTransactions: Transaction[] = [
      { id: '1', type: 'buy', asset: 'BTC', amount: 0.025, value: 1083.13, date: '2024-01-15', status: 'completed' },
      { id: '2', type: 'sell', asset: 'ETH', amount: 0.5, value: 1325.00, date: '2024-01-14', status: 'completed' },
      { id: '3', type: 'deposit', asset: 'USDT', amount: 500, value: 500.00, date: '2024-01-13', status: 'completed' },
      { id: '4', type: 'buy', asset: 'SOL', amount: 10, value: 982.50, date: '2024-01-12', status: 'completed' },
    ];

    setAssets(mockAssets);
    setTransactions(mockTransactions);
  }, []);

  const connectWallet = async () => {
    // Simular conexão Metamask
    setIsConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange24h = assets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);

  const tabs = [
    { id: 'assets', label: 'Ativos', icon: Wallet },
    { id: 'transactions', label: 'Transações', icon: ArrowRight },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      {/* Wallet Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Carteira Integrada</h3>
          <p className="text-gray-400">Metamask + Stripe + Pix em uma única interface</p>
        </div>
        
        {!isConnected ? (
          <motion.button
            onClick={connectWallet}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-medium rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="w-5 h-5 inline mr-2" />
            Conectar Carteira
          </motion.button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg">
              <span className="text-green-400 text-sm font-medium">Conectado</span>
            </div>
            <div className="text-sm text-gray-400">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        )}
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Valor Total</div>
          <div className="text-3xl font-bold text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Variação 24h</div>
          <div className="text-2xl font-bold text-white">
            ${totalChange24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Ativos</div>
          <div className="text-2xl font-bold text-white">{assets.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedTab === tab.id
                ? 'bg-cyan-400 text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'assets' && (
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{asset.symbol}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{asset.name}</h4>
                    <p className="text-gray-400 text-sm">{asset.balance} {asset.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-400/20' :
                    tx.type === 'sell' ? 'bg-red-400/20' :
                    'bg-blue-400/20'
                  }`}>
                    {tx.type === 'buy' ? <Plus className="w-5 h-5 text-green-400" /> :
                     tx.type === 'sell' ? <Minus className="w-5 h-5 text-red-400" /> :
                     <ArrowRight className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium capitalize">{tx.type}</h4>
                    <p className="text-gray-400 text-sm">{tx.asset}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {tx.amount} {tx.asset}
                  </div>
                  <div className="text-gray-400 text-sm">
                    ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs ${
                    tx.status === 'completed' ? 'text-green-400' :
                    tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            className="p-6 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-xl hover:border-cyan-400/50 transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bitcoin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Comprar com Cripto</h3>
              <p className="text-gray-400 text-sm">Metamask + Stripe</p>
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl hover:border-green-400/50 transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Cartão de Crédito</h3>
              <p className="text-gray-400 text-sm">Stripe Integration</p>
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-xl hover:border-purple-400/50 transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Pix Instantâneo</h3>
              <p className="text-gray-400 text-sm">OpenPix API</p>
            </div>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
