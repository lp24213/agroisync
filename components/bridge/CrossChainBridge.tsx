'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { blockchainAnalytics } from '@/services/blockchain-analytics';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { Modal } from '@/components/Modal';
import {
  ArrowLeftRight,
  ChevronDown,
  Info,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Globe
} from 'lucide-react';
// Definir tipo Token localmente se não existir
type Token = {
  symbol: string;
  balance: number;
};

interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
  bridgeSupported: boolean;
  gasPrice: number;
  blockTime: number;
}

interface BridgeRoute {
  id: string;
  fromChain: string;
  toChain: string;
  estimatedTime: number;
  fees: number;
  slippage: number;
  security: 'high' | 'medium' | 'low';
  protocol: string;
  maxAmount: number;
  minAmount: number;
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  amount: number;
  token: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash: string;
  estimatedCompletion: Date;
  actualCompletion?: Date;
}

const supportedChains: Chain[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '/chains/solana.svg',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: 'SOL',
    bridgeSupported: true,
    gasPrice: 0.000005,
    blockTime: 0.4
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/chains/ethereum.svg',
    rpcUrl: 'https://mainnet.infura.io',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: 'ETH',
    bridgeSupported: true,
    gasPrice: 0.02,
    blockTime: 12
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '/chains/polygon.svg',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: 'MATIC',
    bridgeSupported: true,
    gasPrice: 0.001,
    blockTime: 2
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    icon: '/chains/bsc.svg',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: 'BNB',
    bridgeSupported: true,
    gasPrice: 0.003,
    blockTime: 3
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '/chains/avalanche.svg',
    rpcUrl: 'https://api.avax.network',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: 'AVAX',
    bridgeSupported: true,
    gasPrice: 0.025,
    blockTime: 1
  }
];

export function CrossChainBridge() {
  const { isConnected, connectWallet } = useWeb3();
  const [fromChain, setFromChain] = useState<Chain>(supportedChains[0]!);
  const [toChain, setToChain] = useState<Chain>(supportedChains[1]!);
  const [amount, setAmount] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('AGROTM');
  const [bridgeRoutes, setBridgeRoutes] = useState<BridgeRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BridgeRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [bridgeAnalysis, setBridgeAnalysis] = useState<any>(null);

  const tokens = [
    { symbol: 'AGROTM', name: 'AGROTM Token', balance: 1250.5 },
    { symbol: 'SOL', name: 'Solana', balance: 12.8 },
    { symbol: 'USDC', name: 'USD Coin', balance: 5420.0 },
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15 }
  ];

  useEffect(() => {
    if (fromChain && toChain && amount) {
      findBridgeRoutes();
    }
  }, [fromChain, toChain, amount, selectedToken]);

  const findBridgeRoutes = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      // Simulate finding bridge routes
      const routes: BridgeRoute[] = [
        {
          id: 'wormhole',
          fromChain: fromChain.id,
          toChain: toChain.id,
          estimatedTime: 300, // 5 minutes
          fees: 0.01,
          slippage: 0.1,
          security: 'high',
          protocol: 'Wormhole',
          maxAmount: 100000,
          minAmount: 1
        },
        {
          id: 'allbridge',
          fromChain: fromChain.id,
          toChain: toChain.id,
          estimatedTime: 600, // 10 minutes
          fees: 0.005,
          slippage: 0.15,
          security: 'high',
          protocol: 'Allbridge',
          maxAmount: 50000,
          minAmount: 5
        },
        {
          id: 'portal',
          fromChain: fromChain.id,
          toChain: toChain.id,
          estimatedTime: 180, // 3 minutes
          fees: 0.015,
          slippage: 0.05,
          security: 'medium',
          protocol: 'Portal Bridge',
          maxAmount: 25000,
          minAmount: 10
        }
      ];

      setBridgeRoutes(routes);
      if (routes[0]) setSelectedRoute(routes[0]);

      // Get bridge analysis
      const analysis = await blockchainAnalytics.analyzeCrossChainBridge(
        fromChain.id,
        toChain.id,
        parseFloat(amount)
      );
      setBridgeAnalysis(analysis);
    } catch (error) {
      console.error('Failed to find bridge routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const executeBridge = async () => {
    if (!selectedRoute || !amount || !isConnected) return;

    setLoading(true);
    try {
      // Simulate bridge execution
      const transaction: BridgeTransaction = {
        id: `bridge_${Date.now()}`,
        fromChain: fromChain.id,
        toChain: toChain.id,
        amount: parseFloat(amount),
        token: selectedToken,
        status: 'pending',
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        estimatedCompletion: new Date(Date.now() + selectedRoute.estimatedTime * 1000)
      };

      setTransactions(prev => [transaction, ...prev]);
      
      // Simulate status updates
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
          tx.id === transaction.id 
            ? { ...tx, status: 'processing' }
            : tx
        ));
      }, 2000);

      setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
          tx.id === transaction.id 
            ? { ...tx, status: 'completed', actualCompletion: new Date() }
            : tx
        ));
      }, selectedRoute.estimatedTime * 1000);

      setAmount('');
      setShowRoutes(false);
    } catch (error) {
      console.error('Bridge execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ArrowLeftRight className="w-8 h-8 mr-3 text-blue-400" />
                Cross-Chain Bridge
              </h1>
              <p className="text-gray-400 mt-1">
                Transfer assets seamlessly across different blockchains
              </p>
            </div>

            <div className="flex items-center gap-4">
              <NeonButton
                onClick={() => setShowTransactions(true)}
                variant="secondary"
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                History ({transactions.length})
              </NeonButton>

              {!isConnected && (
                <NeonButton onClick={connectWallet}>
                  Connect Wallet
                </NeonButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bridge Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <AnimatedCard className="p-8">
            <div className="space-y-6">
              {/* From Chain */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  From
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={fromChain.id}
                      onChange={(e) => setFromChain(supportedChains.find(c => c.id === e.target.value)!)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none"
                    >
                      {supportedChains.map((chain: Chain) => (
                        <option key={chain.id} value={chain.id}>
                          {chain.name} ({chain.symbol})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none"
                    >
                      {tokens.map((token: Token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.balance}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapChains}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-600 hover:border-blue-400"
                >
                  <ArrowLeftRight className="w-6 h-6 text-blue-400" />
                </button>
              </div>

              {/* To Chain */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  To
                </label>
                <div className="relative">
                  <select
                    value={toChain.id}
                    onChange={(e) => setToChain(supportedChains.find(c => c.id === e.target.value)!)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none"
                  >
                    {supportedChains.filter((c: Chain) => c.id !== fromChain.id).map((chain: Chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name} ({chain.symbol})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    step="0.01"
                    min="0"
                  />
                  <button
                    onClick={() => {
                      const token = tokens.find(t => t.symbol === selectedToken);
                      if (token) setAmount(token.balance.toString());
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300"
                  >
                    MAX
                  </button>
                </div>
                {selectedToken && (
                  <p className="text-xs text-gray-400 mt-1">
                    Balance: {tokens.find(t => t.symbol === selectedToken)?.balance} {selectedToken}
                  </p>
                )}
              </div>

              {/* Bridge Routes */}
              {bridgeRoutes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">
                      Bridge Route
                    </label>
                    <button
                      onClick={() => setShowRoutes(!showRoutes)}
                      className="text-blue-400 text-sm hover:text-blue-300 flex items-center"
                    >
                      {showRoutes ? 'Hide' : 'Show'} All Routes
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showRoutes ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {selectedRoute && (
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{selectedRoute.protocol}</h4>
                        <span className={`text-sm font-semibold ${getSecurityColor(selectedRoute.security)}`}>
                          {selectedRoute.security.toUpperCase()} SECURITY
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Time</p>
                          <p className="text-white flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            ~{Math.round(selectedRoute.estimatedTime / 60)}m
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Fees</p>
                          <p className="text-white flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${selectedRoute.fees.toFixed(3)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Slippage</p>
                          <p className="text-white">{selectedRoute.slippage}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {showRoutes && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {bridgeRoutes.map((route: BridgeRoute) => (
                          <div
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedRoute?.id === route.id
                                ? 'border-blue-400 bg-blue-400/10'
                                : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">{route.protocol}</h4>
                              <span className={`text-xs font-semibold ${getSecurityColor(route.security)}`}>
                                {route.security.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Time</p>
                                <p className="text-white">~{Math.round(route.estimatedTime / 60)}m</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Fees</p>
                                <p className="text-white">${route.fees.toFixed(3)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Slippage</p>
                                <p className="text-white">{route.slippage}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Bridge Analysis */}
              {bridgeAnalysis && (
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Info className="w-5 h-5 text-blue-400 mr-2" />
                    <h4 className="font-semibold text-white">Bridge Analysis</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Health Score</p>
                      <p className="text-white">{(bridgeAnalysis.bridgeHealth * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Est. Time</p>
                      <p className="text-white">{Math.round(bridgeAnalysis.estimatedTime / 60)}m</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Fees</p>
                      <p className="text-white">${bridgeAnalysis.fees.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Slippage</p>
                      <p className="text-white">{(bridgeAnalysis.slippage * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                  {bridgeAnalysis.recommendations && bridgeAnalysis.recommendations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm mb-1">Recommendations:</p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {bridgeAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Bridge Button */}
              <NeonButton
                onClick={executeBridge}
                className="w-full"
                size="md"
                loading={loading}
                disabled={!isConnected || !amount || !selectedRoute || parseFloat(amount) <= 0}
              >
                {!isConnected ? (
                  'Connect Wallet'
                ) : !amount || parseFloat(amount) <= 0 ? (
                  'Enter Amount'
                ) : !selectedRoute ? (
                  'Select Route'
                ) : (
                  <>
                    <ArrowLeftRight className="w-5 h-5 mr-2" />
                    Bridge {amount} {selectedToken}
                  </>
                )}
              </NeonButton>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Chain Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-400" />
              Chain Comparison
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[fromChain, toChain].map((chain) => (
                <div key={chain.id} className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mr-3" />
                    <div>
                      <h4 className="font-semibold text-white">{chain.name}</h4>
                      <p className="text-sm text-gray-400">{chain.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Gas Price</p>
                      <p className="text-white">${chain.gasPrice.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Block Time</p>
                      <p className="text-white">{chain.blockTime}s</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Bridge Support</span>
                    {chain.bridgeSupported ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  
                  <a
                    href={chain.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Explorer
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Transaction History Modal */}
      <Modal
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
        title="Bridge Transaction History"
        size="lg"
      >
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No bridge transactions yet</p>
            </div>
          ) : (
            transactions.map((tx: BridgeTransaction) => (
              <div key={tx.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(tx.status)}
                    <span className={`ml-2 font-semibold ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {tx.actualCompletion?.toLocaleString() || tx.estimatedCompletion.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <p className="text-white capitalize">{tx.fromChain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">To</p>
                    <p className="text-white capitalize">{tx.toChain}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-white">{tx.amount} {tx.token}</p>
                  </div>
                  <a
                    href={`${supportedChains.find((c: Chain) => c.id === tx.fromChain)?.explorerUrl}/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Transaction
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
