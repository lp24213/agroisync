'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Calculator } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export function CryptoConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(false);

  const currencies: Currency[] = [
    { code: 'USD', name: 'Dólar Americano', symbol: '$', rate: 1 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', rate: 4.95 },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿', rate: 0.000023 },
    { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', rate: 0.00037 },
    { code: 'SOL', name: 'Solana', symbol: '◎', rate: 0.0102 },
  ];

  const convertCurrency = async () => {
    setLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const from = currencies.find(c => c.code === fromCurrency);
    const to = currencies.find(c => c.code === toCurrency);
    
    if (from && to) {
      const convertedAmount = (amount / from.rate) * to.rate;
      setResult(convertedAmount);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  const formatResult = (value: number) => {
    if (value < 0.01) {
      return value.toFixed(8);
    } else if (value < 1) {
      return value.toFixed(4);
    } else {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* From Currency */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">De</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all duration-300"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white text-2xl font-bold focus:border-cyan-400 focus:outline-none transition-all duration-300"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Convert Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={convertCurrency}
            disabled={loading}
            className="p-4 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* To Currency */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Para</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all duration-300"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          
          <div className="w-full p-4 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-xl">
            <div className="text-2xl font-bold text-white mb-1">
              {formatResult(result)}
            </div>
            <div className="text-sm text-gray-400">
              {currencies.find(c => c.code === toCurrency)?.symbol} {toCurrency}
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10"
      >
        <div className="flex items-center justify-center space-x-2 text-gray-300">
          <Calculator className="w-4 h-4" />
          <span>
            1 {fromCurrency} = {formatResult(currencies.find(c => c.code === fromCurrency)?.rate || 0)} {toCurrency}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
