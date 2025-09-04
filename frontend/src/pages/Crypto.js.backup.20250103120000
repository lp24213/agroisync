import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  RefreshCw, Eye, Heart, Star, Clock, ArrowUpRight,
  ArrowDownRight, Coins, Wallet, Shield, Globe,
  Zap, Activity, Target, Users, Volume2
} from 'lucide-react';

const CryptoPage = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // Mock data para demonstração
  const mockCryptoData = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.67,
      change24h: 2.45,
      change7d: -1.23,
      marketCap: 845.2,
      volume24h: 28.5,
      circulatingSupply: 19.5,
      maxSupply: 21.0,
      rank: 1,
      sparkline: [42000, 42500, 41800, 43000, 42800, 43200, 43250],
      isPositive: true
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.34,
      change24h: -1.87,
      change7d: 3.21,
      marketCap: 318.7,
      volume24h: 15.2,
      circulatingSupply: 120.2,
      maxSupply: null,
      rank: 2,
      sparkline: [2700, 2680, 2650, 2670, 2640, 2660, 2650],
      isPositive: false
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      price: 312.45,
      change24h: 0.92,
      change7d: 5.67,
      marketCap: 48.9,
      volume24h: 2.1,
      circulatingSupply: 156.8,
      maxSupply: 200.0,
      rank: 3,
      sparkline: [305, 308, 310, 309, 312, 311, 312],
      isPositive: true
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 98.76,
      change24h: 4.32,
      change7d: 12.45,
      marketCap: 42.3,
      volume24h: 3.8,
      circulatingSupply: 428.5,
      maxSupply: 533.0,
      rank: 4,
      sparkline: [95, 96, 97, 98, 99, 98.5, 98.76],
      isPositive: true
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.485,
      change24h: -2.15,
      change7d: -8.76,
      marketCap: 17.2,
      volume24h: 1.2,
      circulatingSupply: 35.5,
      maxSupply: 45.0,
      rank: 5,
      sparkline: [0.49, 0.485, 0.48, 0.475, 0.48, 0.485, 0.485],
      isPositive: false
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setCryptoData(mockCryptoData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatMarketCap = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}T`;
    }
    return `$${value.toFixed(1)}B`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  };

  const timeframes = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '1y', label: '1Y' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full border-2 border-emerald-500 border-t-transparent w-12 h-12 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Carregando dados de criptomoedas...</h3>
            <p className="text-white/60">Aguarde enquanto carregamos os dados em tempo real.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Header Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-sky-900/20">
          <div className="absolute inset-0 bg-black opacity-95"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gradient-agro mb-6">
              Criptomoedas
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Acompanhe os preços em tempo real das principais criptomoedas do mercado
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-emerald mb-2">$2.1T</div>
                <div className="text-white/60">Market Cap Total</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-emerald mb-2">$85.2B</div>
                <div className="text-white/60">Volume 24h</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-emerald mb-2">2,295</div>
                <div className="text-white/60">Criptomoedas</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-emerald mb-2">51.2%</div>
                <div className="text-white/60">Dominância BTC</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">Top Criptomoedas</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <motion.button
                  key={tf.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    timeframe === tf.value
                      ? 'bg-emerald-500 text-black'
                      : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
                  }`}
                >
                  {tf.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Crypto Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Nome</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">Preço</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">24h %</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">7d %</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">Market Cap</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">Volume (24h)</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">Circulating Supply</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white/60">Gráfico 7d</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {cryptoData.map((crypto, index) => (
                    <motion.tr
                      key={crypto.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                      className="transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-white/60">{crypto.rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{crypto.symbol[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{crypto.name}</div>
                            <div className="text-sm text-white/60">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-white">{formatCurrency(crypto.price)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${getChangeColor(crypto.change24h)}`}>
                          {getChangeIcon(crypto.change24h)}
                          <span className="font-semibold">{formatPercentage(crypto.change24h)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${getChangeColor(crypto.change7d)}`}>
                          {getChangeIcon(crypto.change7d)}
                          <span className="font-semibold">{formatPercentage(crypto.change7d)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-white">{formatMarketCap(crypto.marketCap)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-white">{formatMarketCap(crypto.volume24h)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-white">
                          {crypto.circulatingSupply.toLocaleString()} {crypto.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-12 flex items-end space-x-1">
                            {crypto.sparkline.map((value, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${(value / Math.max(...crypto.sparkline)) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`flex-1 rounded-sm ${
                                  crypto.isPositive ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                                style={{ minHeight: '2px' }}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            
            {/* Fear & Greed Index */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Índice Medo e Ganância</h3>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-400">65</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-pulse"></div>
                </div>
                <div className="text-lg font-semibold text-emerald-400 mb-2">Ganância</div>
                <p className="text-white/60 text-sm">O mercado está otimista com as criptomoedas</p>
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Sentimento do Mercado</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Bullish</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-emerald-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-emerald-400 font-semibold">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Neutral</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '25%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="bg-yellow-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-yellow-400 font-semibold">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Bearish</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '10%' }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="bg-red-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-red-400 font-semibold">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Tools */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Ferramentas de Trading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="card p-6 text-center hover-agro"
              >
                <Wallet className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Conectar Wallet</h4>
                <p className="text-white/60 text-sm mb-4">Conecte sua carteira para acompanhar seus ativos</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full"
                >
                  Conectar
                </motion.button>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="card p-6 text-center hover-agro"
              >
                <BarChart3 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Análise Técnica</h4>
                <p className="text-white/60 text-sm mb-4">Indicadores técnicos e análise de tendências</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary w-full"
                >
                  Analisar
                </motion.button>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="card p-6 text-center hover-agro"
              >
                <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Alertas de Preço</h4>
                <p className="text-white/60 text-sm mb-4">Configure alertas para movimentos de preço</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary w-full"
                >
                  Configurar
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CryptoPage;
