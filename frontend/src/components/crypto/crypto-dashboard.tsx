'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Euro, Bitcoin, Coins, Wallet } from 'lucide-react';
import { CryptoPriceCard } from './crypto-price-card';
import { CryptoConverter } from './crypto-converter';
import { CryptoChart } from './crypto-chart';
import { CryptoWallet } from './crypto-wallet';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: number;
}

export function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados da Binance API
    const mockData: CryptoData[] = [
      { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change24h: 1250.75, changePercent24h: 2.5, volume: 28475000000 },
      { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change24h: 47.25, changePercent24h: 1.8, volume: 15842000000 },
      { symbol: 'SOL', name: 'Solana', price: 98.25, change24h: 4.85, changePercent24h: 5.2, volume: 3248000000 },
      { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.00, changePercent24h: 0.0, volume: 45680000000 },
      { symbol: 'BRL', name: 'Real Brasileiro', price: 0.21, change24h: -0.001, changePercent24h: -0.5, volume: 1250000000 },
    ];
    
    setTimeout(() => {
      setCryptoData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Criptomoedas & Financeiro
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Mercado digital em tempo real, carteira integrada e análise avançada de ativos
        </p>
      </motion.div>

      {/* Preços em Tempo Real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <TrendingUp className="text-cyan-400" />
          Preços em Tempo Real
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cryptoData.map((crypto, index) => (
            <CryptoPriceCard
              key={crypto.symbol}
              symbol={crypto.symbol}
              name={crypto.name}
              price={crypto.price}
              change24h={crypto.change24h}
              changePercent24h={crypto.changePercent24h}
              onClick={() => {}}
            />
          ))}
        </div>
      </motion.div>

      {/* Conversor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <DollarSign className="text-green-400" />
          Conversor Universal
        </h2>
        <CryptoConverter />
      </motion.div>

      {/* Gráficos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Coins className="text-yellow-400" />
          Análise Técnica
        </h2>
        <CryptoChart data={[]} symbol="BTC" />
      </motion.div>

      {/* Carteira */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Wallet className="text-purple-400" />
          Carteira Integrada
        </h2>
        <CryptoWallet />
      </motion.div>
    </div>
  );
}
