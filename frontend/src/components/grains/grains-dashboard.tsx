'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wheat, TrendingUp, TrendingDown, BarChart3, Globe, Calendar, DollarSign } from 'lucide-react';
import { GrainsPriceCard } from './grains-price-card';
import { GrainsChart } from './grains-chart';
import { FuturesMarket } from './futures-market';
import { ExportData } from './export-data';

interface GrainData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  unit: string;
}

export function GrainsDashboard() {
  const [grainsData, setGrainsData] = useState<GrainData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados da Agrolink API
    const mockData: GrainData[] = [
      { name: 'Soja', symbol: 'SOJA', price: 125.50, change24h: 1.2, volume: 2847500, unit: 'sc/60kg' },
      { name: 'Milho', symbol: 'MILHO', price: 78.25, change24h: -0.8, volume: 1584200, unit: 'sc/60kg' },
      { name: 'Trigo', symbol: 'TRIGO', price: 95.80, change24h: 2.1, volume: 324800, unit: 'sc/60kg' },
      { name: 'Café', symbol: 'CAFE', price: 185.30, change24h: 0.5, volume: 125000, unit: 'sc/60kg' },
      { name: 'Arroz', symbol: 'ARROZ', price: 45.90, change24h: -1.5, volume: 890000, unit: 'sc/50kg' },
      { name: 'Feijão', symbol: 'FEIJAO', price: 125.75, change24h: 3.2, volume: 450000, unit: 'sc/60kg' },
    ];
    
    setTimeout(() => {
      setGrainsData(mockData);
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
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4">
          Commodities & Grãos
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Preços em tempo real, mercado futuro e dados de exportação global
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
          <Wheat className="text-green-400" />
          Preços em Tempo Real (Agrolink API)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grainsData.map((grain, index) => (
            <GrainsPriceCard
              key={grain.symbol}
              data={grain}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Gráficos Comparativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BarChart3 className="text-yellow-400" />
          Análise Histórica & Comparativa
        </h2>
        <GrainsChart />
      </motion.div>

      {/* Mercado Futuro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Calendar className="text-blue-400" />
          Mercado Futuro (B3 API)
        </h2>
        <FuturesMarket />
      </motion.div>

      {/* Dados de Exportação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Globe className="text-purple-400" />
          Exportações Globais (FAO API)
        </h2>
        <ExportData />
      </motion.div>
    </div>
  );
}
