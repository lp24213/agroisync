'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Euro, Bitcoin, RefreshCw, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CryptoData {
  symbol: string;
  price: string;
  change24h: string;
  volume: string;
  marketCap: string;
  isPositive: boolean;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
}

export function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const mockCryptoData: CryptoData[] = [
      {
        symbol: 'BTC',
        price: '$43,250.67',
        change24h: '+2.45%',
        volume: '$28.5B',
        marketCap: '$845.2B',
        isPositive: true
      },
      {
        symbol: 'ETH',
        price: '$2,680.34',
        change24h: '+1.87%',
        volume: '$15.2B',
        marketCap: '$322.1B',
        isPositive: true
      },
      {
        symbol: 'SOL',
        price: '$98.45',
        change24h: '+5.23%',
        volume: '$2.8B',
        marketCap: '$42.8B',
        isPositive: true
      },
      {
        symbol: 'USDT',
        price: '$1.00',
        change24h: '0.00%',
        volume: '$45.1B',
        marketCap: '$95.3B',
        isPositive: true
      }
    ];

    const mockExchangeRates: ExchangeRate[] = [
      { from: 'USD', to: 'BRL', rate: 4.95, change: 0.02 },
      { from: 'EUR', to: 'BRL', rate: 5.42, change: -0.01 },
      { from: 'BTC', to: 'USD', rate: 43250.67, change: 2.45 },
      { from: 'ETH', to: 'USD', rate: 2680.34, change: 1.87 }
    ];

    setCryptoData(mockCryptoData);
    setExchangeRates(mockExchangeRates);
    setLoading(false);
  }, []);

  const chartData = [
    { time: '00:00', price: 43200 },
    { time: '04:00', price: 43300 },
    { time: '08:00', price: 43100 },
    { time: '12:00', price: 43400 },
    { time: '16:00', price: 43500 },
    { time: '20:00', price: 43250 },
    { time: '24:00', price: 43250 }
  ];

  const timeframes = ['1h', '24h', '7d', '30d', '1y'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Criptomoedas</h1>
          <p className="text-gray-400">Preços em tempo real e conversões de moedas</p>
        </div>
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-medium rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Atualizar
        </motion.button>
      </motion.div>

      {/* Crypto Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.1)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{crypto.symbol}</h3>
                  <p className="text-gray-400 text-sm">Bitcoin</p>
                </div>
              </div>
              {crypto.isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">{crypto.price}</div>
              <div className={`text-sm font-medium ${crypto.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h}
              </div>
              <div className="text-gray-400 text-sm">
                Volume: {crypto.volume}
              </div>
              <div className="text-gray-400 text-sm">
                Market Cap: {crypto.marketCap}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Gráfico de Preços</h2>
            <p className="text-gray-400">Variação de preços em tempo real</p>
          </div>
          
          <div className="flex space-x-2 mt-4 lg:mt-0">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeframe === tf
                    ? 'bg-cyan-400 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Exchange Rates */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Taxas de Câmbio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exchangeRates.map((rate, index) => (
            <motion.div
              key={`${rate.from}-${rate.to}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {rate.from === 'BTC' ? (
                    <Bitcoin className="w-5 h-5 text-yellow-500" />
                  ) : rate.from === 'USD' ? (
                    <DollarSign className="w-5 h-5 text-green-500" />
                  ) : (
                    <Euro className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="text-white font-medium">{rate.from}</span>
                </div>
                <span className="text-gray-400">→</span>
                <span className="text-white font-medium">{rate.to}</span>
              </div>
              
              <div className="text-2xl font-bold text-white mb-1">
                {rate.rate.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: rate.to === 'BRL' ? 'BRL' : 'USD' 
                })}
              </div>
              
              <div className={`text-sm font-medium ${
                rate.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {rate.change >= 0 ? '+' : ''}{rate.change}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.button
          className="p-6 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Bitcoin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Comprar Cripto</h3>
            <p className="text-gray-400 text-sm">Adicione criptomoedas ao seu portfólio</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-2xl hover:border-green-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Staking</h3>
            <p className="text-gray-400 text-sm">Ganhe recompensas com staking</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-2xl hover:border-purple-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">Análise avançada do seu portfólio</p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
