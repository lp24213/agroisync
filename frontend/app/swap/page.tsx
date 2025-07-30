'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, 
  RefreshCw, 
  Settings, 
  Info, 
  AlertTriangle,
  ChevronDown,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';

const tokens = [
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 12.345,
    price: 120.75,
    logo: '/images/sol-logo.png',
    color: '#9945FF'
  },
  {
    symbol: 'AGROTM',
    name: 'AgroTM',
    balance: 1250.5,
    price: 2.34,
    logo: '/images/agrotm-logo.png',
    color: '#22C55E'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 5000.0,
    price: 1.0,
    logo: '/images/usdc-logo.png',
    color: '#3B82F6'
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    balance: 500.75,
    price: 4.56,
    logo: '/images/ray-logo.png',
    color: '#FF6B6B'
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    balance: 1000000.0,
    price: 0.00001234,
    logo: '/images/bonk-logo.png',
    color: '#F59E0B'
  }
];

export default function SwapPage() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromTokenList, setShowFromTokenList] = useState(false);
  const [showToTokenList, setShowToTokenList] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [priceImpact, setPriceImpact] = useState('0.12');
  const [isLoading, setIsLoading] = useState(false);
  const [swapRoute, setSwapRoute] = useState([
    { protocol: 'Jupiter', percentage: 80 },
    { protocol: 'Raydium', percentage: 20 }
  ]);

  // Calculate to amount based on from amount
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromValue = parseFloat(fromAmount) * fromToken.price;
      const toValue = fromValue / toToken.price;
      setToAmount(toValue.toFixed(toToken.symbol === 'BONK' ? 2 : 6));
      
      // Calculate price impact (simplified)
      const impact = (parseFloat(fromAmount) / fromToken.balance) * 0.1;
      setPriceImpact(impact > 5 ? '5.00+' : impact.toFixed(2));
    } else {
      setToAmount('');
      setPriceImpact('0.00');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setIsLoading(true);
    
    // Simulate swap process
    setTimeout(() => {
      setIsLoading(false);
      setFromAmount('');
      setToAmount('');
      // Here you would typically show a success message
    }, 2000);
  };

  const getMaxAmount = () => {
    setFromAmount(fromToken.balance.toString());
  };

  const getButtonText = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      return 'Enter an amount';
    }
    if (parseFloat(fromAmount) > fromToken.balance) {
      return `Insufficient ${fromToken.symbol} balance`;
    }
    return 'Swap';
  };

  const isSwapDisabled = () => {
    return !fromAmount || 
           parseFloat(fromAmount) <= 0 || 
           parseFloat(fromAmount) > fromToken.balance || 
           isLoading;
  };

  return (
    <div className="min-h-screen bg-agro-darker overflow-hidden relative">
      {/* Background grid animation */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid-animation"></div>
      </div>
      
      {/* Animated orbs */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-agro-blue/20 blur-xl z-0"
        animate={{ 
          x: [0, 30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-agro-green/20 blur-xl z-0"
        animate={{ 
          x: [0, -30, 0], 
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut" 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-glow">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-agro-blue to-agro-green">
              Token Swap
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Swap tokens instantly with the best rates across multiple liquidity sources
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Swap Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-2/3"
          >
            <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
              <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Swap</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark hover:text-white transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark hover:text-white transition-colors">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-agro-dark/50 p-4 rounded-lg">
                        <h3 className="text-white font-medium mb-3">Transaction Settings</h3>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-300 mb-2">Slippage Tolerance</label>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setSlippage('0.1')}
                              className={`px-3 py-1 rounded-lg text-sm ${slippage === '0.1' ? 'bg-agro-blue text-white' : 'bg-agro-dark text-gray-300 hover:bg-agro-dark/80'}`}
                            >
                              0.1%
                            </button>
                            <button 
                              onClick={() => setSlippage('0.5')}
                              className={`px-3 py-1 rounded-lg text-sm ${slippage === '0.5' ? 'bg-agro-blue text-white' : 'bg-agro-dark text-gray-300 hover:bg-agro-dark/80'}`}
                            >
                              0.5%
                            </button>
                            <button 
                              onClick={() => setSlippage('1.0')}
                              className={`px-3 py-1 rounded-lg text-sm ${slippage === '1.0' ? 'bg-agro-blue text-white' : 'bg-agro-dark text-gray-300 hover:bg-agro-dark/80'}`}
                            >
                              1.0%
                            </button>
                            <div className="relative flex-1">
                              <input 
                                type="text" 
                                value={slippage}
                                onChange={(e) => setSlippage(e.target.value)}
                                className="w-full p-1 bg-agro-dark border border-gray-700 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <span className="text-gray-400 text-sm">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Transaction Deadline</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value="30"
                              className="w-16 p-1 bg-agro-dark border border-gray-700 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors"
                            />
                            <span className="text-gray-400 text-sm">minutes</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* From Token */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">From</span>
                    <span className="text-sm text-gray-400">
                      Balance: {fromToken.balance.toFixed(4)} {fromToken.symbol}
                    </span>
                  </div>
                  <div className="bg-agro-dark/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none"
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center">
                          <button 
                            onClick={getMaxAmount}
                            className="text-xs px-2 py-1 rounded bg-agro-blue/20 text-agro-blue hover:bg-agro-blue/30 transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setShowFromTokenList(!showFromTokenList)}
                          className="flex items-center space-x-2 ml-4 px-3 py-2 rounded-lg bg-agro-dark hover:bg-agro-dark/80 transition-colors"
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box"
                            style={{ 
                              backgroundColor: `${fromToken.color}20`,
                              boxShadow: `0 0 10px ${fromToken.color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: fromToken.color }}>
                              {fromToken.symbol.charAt(0)}
                            </span>
                          </div>
                          <span className="text-white font-medium">{fromToken.symbol}</span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                        
                        {/* From Token Dropdown */}
                        <AnimatePresence>
                          {showFromTokenList && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-64 rounded-lg overflow-hidden z-10 cyberpunk-border p-0.5"
                            >
                              <div className="bg-agro-darker/95 backdrop-blur-md rounded-lg max-h-60 overflow-y-auto">
                                <div className="p-3 border-b border-gray-700">
                                  <input 
                                    type="text" 
                                    placeholder="Search token"
                                    className="w-full p-2 bg-agro-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors text-sm"
                                  />
                                </div>
                                <div className="p-2">
                                  {tokens.map((token) => (
                                    <button
                                      key={token.symbol}
                                      onClick={() => {
                                        setFromToken(token);
                                        setShowFromTokenList(false);
                                      }}
                                      className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-agro-dark/50 transition-colors ${token.symbol === fromToken.symbol ? 'bg-agro-dark/30' : ''}`}
                                      disabled={token.symbol === toToken.symbol}
                                    >
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center neon-box"
                                        style={{ 
                                          backgroundColor: `${token.color}20`,
                                          boxShadow: `0 0 10px ${token.color}30`
                                        }}
                                      >
                                        <span className="text-sm font-bold" style={{ color: token.color }}>
                                          {token.symbol.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="flex-1 text-left">
                                        <p className="text-white font-medium">{token.symbol}</p>
                                        <p className="text-xs text-gray-400">{token.name}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-white">{token.balance.toFixed(4)}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      ≈ ${(parseFloat(fromAmount || '0') * fromToken.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Swap Button */}
                <div className="flex justify-center -my-3 z-10 relative">
                  <motion.button 
                    onClick={handleSwapTokens}
                    className="w-10 h-10 rounded-full bg-agro-dark border border-gray-700 flex items-center justify-center text-white hover:bg-agro-dark/80 transition-colors"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </motion.button>
                </div>
                
                {/* To Token */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">To</span>
                    <span className="text-sm text-gray-400">
                      Balance: {toToken.balance.toFixed(4)} {toToken.symbol}
                    </span>
                  </div>
                  <div className="bg-agro-dark/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text" 
                        value={toAmount}
                        readOnly
                        placeholder="0.00"
                        className="w-full bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none"
                      />
                      <div className="relative">
                        <button 
                          onClick={() => setShowToTokenList(!showToTokenList)}
                          className="flex items-center space-x-2 ml-4 px-3 py-2 rounded-lg bg-agro-dark hover:bg-agro-dark/80 transition-colors"
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box"
                            style={{ 
                              backgroundColor: `${toToken.color}20`,
                              boxShadow: `0 0 10px ${toToken.color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: toToken.color }}>
                              {toToken.symbol.charAt(0)}
                            </span>
                          </div>
                          <span className="text-white font-medium">{toToken.symbol}</span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                        
                        {/* To Token Dropdown */}
                        <AnimatePresence>
                          {showToTokenList && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-64 rounded-lg overflow-hidden z-10 cyberpunk-border p-0.5"
                            >
                              <div className="bg-agro-darker/95 backdrop-blur-md rounded-lg max-h-60 overflow-y-auto">
                                <div className="p-3 border-b border-gray-700">
                                  <input 
                                    type="text" 
                                    placeholder="Search token"
                                    className="w-full p-2 bg-agro-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors text-sm"
                                  />
                                </div>
                                <div className="p-2">
                                  {tokens.map((token) => (
                                    <button
                                      key={token.symbol}
                                      onClick={() => {
                                        setToToken(token);
                                        setShowToTokenList(false);
                                      }}
                                      className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-agro-dark/50 transition-colors ${token.symbol === toToken.symbol ? 'bg-agro-dark/30' : ''}`}
                                      disabled={token.symbol === fromToken.symbol}
                                    >
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center neon-box"
                                        style={{ 
                                          backgroundColor: `${token.color}20`,
                                          boxShadow: `0 0 10px ${token.color}30`
                                        }}
                                      >
                                        <span className="text-sm font-bold" style={{ color: token.color }}>
                                          {token.symbol.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="flex-1 text-left">
                                        <p className="text-white font-medium">{token.symbol}</p>
                                        <p className="text-xs text-gray-400">{token.name}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-white">{token.balance.toFixed(4)}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      ≈ ${(parseFloat(toAmount || '0') * toToken.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Swap Details */}
                {fromAmount && parseFloat(fromAmount) > 0 && (
                  <div className="bg-agro-dark/30 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Rate</span>
                      <span className="text-sm text-white">
                        1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-1">Price Impact</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className={`text-sm ${parseFloat(priceImpact) > 3 ? 'text-yellow-400' : 'text-agro-green'}`}>
                        {priceImpact}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-1">Slippage Tolerance</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-sm text-white">{slippage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Estimated Fee</span>
                      <span className="text-sm text-white">0.3%</span>
                    </div>
                  </div>
                )}
                
                {/* Swap Route */}
                {fromAmount && parseFloat(fromAmount) > 0 && (
                  <div className="bg-agro-dark/30 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-1">Swap Route</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-agro-blue/20 text-agro-blue">
                        Best Price
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {swapRoute.map((route, index) => (
                        <div key={route.protocol} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-white font-medium">{route.protocol}</span>
                            <span className="text-xs text-gray-400">{route.percentage}%</span>
                          </div>
                          {index < swapRoute.length - 1 && (
                            <ArrowDown className="h-4 w-4 text-gray-400 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Warning */}
                {fromAmount && parseFloat(fromAmount) > 0 && parseFloat(priceImpact) > 3 && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg mb-6">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-400">
                      The price impact is relatively high. You might receive significantly less tokens than expected.
                    </p>
                  </div>
                )}
                
                {/* Swap Button */}
                <motion.button
                  onClick={handleSwap}
                  disabled={isSwapDisabled()}
                  className={`w-full py-4 rounded-lg font-medium text-white ${isSwapDisabled() ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
                  whileHover={!isSwapDisabled() ? { scale: 1.02 } : {}}
                  whileTap={!isSwapDisabled() ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Swapping...
                    </span>
                  ) : (
                    getButtonText()
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/3 space-y-6"
          >
            {/* Market Info */}
            <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
              <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Market Info</h2>
                
                <div className="space-y-4">
                  {tokens.slice(0, 3).map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center neon-box"
                          style={{ 
                            backgroundColor: `${token.color}20`,
                            boxShadow: `0 0 10px ${token.color}30`
                          }}
                        >
                          <span className="text-sm font-bold" style={{ color: token.color }}>
                            {token.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{token.symbol}</p>
                          <p className="text-xs text-gray-400">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">${token.price.toFixed(2)}</p>
                        <p className="text-xs text-agro-green">+2.45%</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 py-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark hover:text-white transition-colors text-sm">
                  View All Markets
                </button>
              </div>
            </div>
            
            {/* Recent Swaps */}
            <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
              <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Recent Swaps</h2>
                
                <div className="space-y-4">
                  <div className="bg-agro-dark/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box z-10"
                            style={{ 
                              backgroundColor: `${tokens[0].color}20`,
                              boxShadow: `0 0 10px ${tokens[0].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[0].color }}>
                              {tokens[0].symbol.charAt(0)}
                            </span>
                          </div>
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box -ml-2"
                            style={{ 
                              backgroundColor: `${tokens[1].color}20`,
                              boxShadow: `0 0 10px ${tokens[1].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[1].color }}>
                              {tokens[1].symbol.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <span className="text-white font-medium">
                          {tokens[0].symbol} → {tokens[1].symbol}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">2m ago</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">2.5 {tokens[0].symbol} for 583.25 {tokens[1].symbol}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-agro-green/20 text-agro-green">Completed</span>
                    </div>
                  </div>
                  
                  <div className="bg-agro-dark/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box z-10"
                            style={{ 
                              backgroundColor: `${tokens[2].color}20`,
                              boxShadow: `0 0 10px ${tokens[2].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[2].color }}>
                              {tokens[2].symbol.charAt(0)}
                            </span>
                          </div>
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box -ml-2"
                            style={{ 
                              backgroundColor: `${tokens[0].color}20`,
                              boxShadow: `0 0 10px ${tokens[0].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[0].color }}>
                              {tokens[0].symbol.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <span className="text-white font-medium">
                          {tokens[2].symbol} → {tokens[0].symbol}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">15m ago</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">500 {tokens[2].symbol} for 4.15 {tokens[0].symbol}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-agro-green/20 text-agro-green">Completed</span>
                    </div>
                  </div>
                  
                  <div className="bg-agro-dark/30 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box z-10"
                            style={{ 
                              backgroundColor: `${tokens[3].color}20`,
                              boxShadow: `0 0 10px ${tokens[3].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[3].color }}>
                              {tokens[3].symbol.charAt(0)}
                            </span>
                          </div>
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center neon-box -ml-2"
                            style={{ 
                              backgroundColor: `${tokens[4].color}20`,
                              boxShadow: `0 0 10px ${tokens[4].color}30`
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: tokens[4].color }}>
                              {tokens[4].symbol.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <span className="text-white font-medium">
                          {tokens[3].symbol} → {tokens[4].symbol}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">32m ago</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">25 {tokens[3].symbol} for 9,125,000 {tokens[4].symbol}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-agro-green/20 text-agro-green">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tips Card */}
            <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
              <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center neon-box"
                    style={{ 
                      backgroundColor: `${tokens[1].color}20`,
                      boxShadow: `0 0 10px ${tokens[1].color}30`
                    }}
                  >
                    <Zap className="h-5 w-5" style={{ color: tokens[1].color }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Swap Tips</h2>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-agro-blue mt-1.5" />
                    <p className="text-sm text-gray-300">Use slippage tolerance to control price impact during high volatility.</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-agro-blue mt-1.5" />
                    <p className="text-sm text-gray-300">Swapping large amounts may result in higher price impact.</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-agro-blue mt-1.5" />
                    <p className="text-sm text-gray-300">Our router automatically finds the best price across multiple liquidity sources.</p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}