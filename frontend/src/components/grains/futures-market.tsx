'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

interface FuturesContract {
  symbol: string;
  name: string;
  maturity: string;
  price: number;
  change: number;
  volume: number;
  openInterest: number;
}

export function FuturesMarket() {
  const [contracts, setContracts] = useState<FuturesContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados da B3 API
    const mockContracts: FuturesContract[] = [
      { symbol: 'SOJA24', name: 'Soja Mar/24', maturity: '2024-03-15', price: 128.50, change: 1.8, volume: 15420, openInterest: 284750 },
      { symbol: 'MILHO24', name: 'Milho Mar/24', maturity: '2024-03-15', price: 79.80, change: -0.5, volume: 12850, openInterest: 158420 },
      { symbol: 'TRIGO24', name: 'Trigo Mar/24', maturity: '2024-03-15', price: 97.20, change: 2.1, volume: 8540, openInterest: 32480 },
      { symbol: 'CAFE24', name: 'Café Mar/24', maturity: '2024-03-15', price: 188.50, change: 0.8, volume: 3250, openInterest: 12500 },
      { symbol: 'SOJA25', name: 'Soja Mar/25', maturity: '2025-03-15', price: 132.00, change: 2.2, volume: 9850, openInterest: 187420 },
      { symbol: 'MILHO25', name: 'Milho Mar/25', maturity: '2025-03-15', price: 82.50, change: 1.5, volume: 7650, openInterest: 124580 },
    ];
    
    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Contratos Futuros</h3>
        <p className="text-gray-400">Mercado futuro agrícola da B3 - Especulação e Hedge</p>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 border border-blue-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Total Volume</div>
          <div className="text-2xl font-bold text-white">
            {(contracts.reduce((sum, c) => sum + c.volume, 0) / 1000).toFixed(1)}k
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Open Interest</div>
          <div className="text-2xl font-bold text-white">
            {(contracts.reduce((sum, c) => sum + c.openInterest, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Contratos</div>
          <div className="text-2xl font-bold text-white">{contracts.length}</div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-yellow-400/10 to-orange-600/10 border border-yellow-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Vencimento</div>
          <div className="text-2xl font-bold text-white">Mar/24</div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-gray-400 font-medium">Contrato</th>
              <th className="text-left p-4 text-gray-400 font-medium">Vencimento</th>
              <th className="text-left p-4 text-gray-400 font-medium">Preço</th>
              <th className="text-left p-4 text-gray-400 font-medium">Variação</th>
              <th className="text-left p-4 text-gray-400 font-medium">Volume</th>
              <th className="text-left p-4 text-gray-400 font-medium">Open Interest</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <motion.tr
                key={contract.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
              >
                <td className="p-4">
                  <div>
                    <div className="text-white font-semibold">{contract.symbol}</div>
                    <div className="text-gray-400 text-sm">{contract.name}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{new Date(contract.maturity).toLocaleDateString('pt-BR')}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white font-semibold">
                    R$ {contract.price.toFixed(2)}
                  </div>
                </td>
                <td className="p-4">
                  <div className={`flex items-center space-x-1 ${
                    contract.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {contract.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {contract.change >= 0 ? '+' : ''}{contract.change.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">
                    {(contract.volume / 1000).toFixed(1)}k
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">
                    {(contract.openInterest / 1000).toFixed(1)}k
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trading Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl hover:border-green-400/50 transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Comprar Futuro</h3>
            <p className="text-gray-400 text-sm">Hedge ou especulação</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-red-400/10 to-pink-600/10 border border-red-400/30 rounded-xl hover:border-red-400/50 transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Vender Futuro</h3>
            <p className="text-gray-400 text-sm">Proteção de preços</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 border border-blue-400/30 rounded-xl hover:border-blue-400/50 transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Rollover</h3>
            <p className="text-gray-400 text-sm">Renovar posições</p>
          </div>
        </motion.button>
      </div>

      {/* API Info */}
      <div className="mt-8 p-4 bg-blue-400/10 border border-blue-400/30 rounded-xl">
        <div className="flex items-center space-x-2 text-blue-400">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-medium">
            B3 API - Dados de mercado futuro em tempo real
          </span>
        </div>
      </div>
    </motion.div>
  );
}
