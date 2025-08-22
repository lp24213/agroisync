'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MapPin, BarChart3, Globe, Wheat, Leaf, TreePine } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GrainData {
  name: string;
  price: string;
  change24h: string;
  volume: string;
  market: string;
  isPositive: boolean;
  icon: any;
}

interface MarketData {
  region: string;
  soja: number;
  milho: number;
  trigo: number;
  color: string;
}

export function GrainsDashboard() {
  const [grainData, setGrainData] = useState<GrainData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrain, setSelectedGrain] = useState('soja');

  useEffect(() => {
    const mockGrainData: GrainData[] = [
      {
        name: 'Soja',
        price: 'R$ 180,50/saca',
        change24h: '+2.34%',
        volume: '45.2M sacas',
        market: 'B3',
        isPositive: true,
        icon: Leaf
      },
      {
        name: 'Milho',
        price: 'R$ 95,80/saca',
        change24h: '+1.87%',
        volume: '38.7M sacas',
        market: 'B3',
        isPositive: true,
        icon: TreePine
      },
      {
        name: 'Trigo',
        price: 'R$ 125,40/saca',
        change24h: '-0.45%',
        volume: '12.3M sacas',
        market: 'B3',
        isPositive: false,
        icon: Wheat
      },
      {
        name: 'Arroz',
        price: 'R$ 85,20/saca',
        change24h: '+0.78%',
        volume: '8.9M sacas',
        market: 'B3',
        isPositive: true,
        icon: Wheat
      }
    ];

    const mockMarketData: MarketData[] = [
      { region: 'Centro-Oeste', soja: 45, milho: 38, trigo: 5, color: '#06B6D4' },
      { region: 'Sul', soja: 32, milho: 28, trigo: 15, color: '#3B82F6' },
      { region: 'Sudeste', soja: 18, milho: 20, trigo: 8, color: '#8B5CF6' },
      { region: 'Nordeste', soja: 5, milho: 14, trigo: 2, color: '#EC4899' }
    ];

    setGrainData(mockGrainData);
    setMarketData(mockMarketData);
    setLoading(false);
  }, []);

  const priceHistory = [
    { date: 'Jan', soja: 175, milho: 92, trigo: 128 },
    { date: 'Fev', soja: 178, milho: 94, trigo: 126 },
    { date: 'Mar', soja: 182, milho: 96, trigo: 125 },
    { date: 'Abr', soja: 179, milho: 95, trigo: 127 },
    { date: 'Mai', soja: 183, milho: 97, trigo: 124 },
    { date: 'Jun', soja: 180, milho: 95, trigo: 125 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Wheat className="w-8 h-8 text-cyan-400" />
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
          <h1 className="text-3xl font-bold text-white mb-2">Grãos & Commodities</h1>
          <p className="text-gray-400">Preços em tempo real e análise de mercado agrícola</p>
        </div>
        <div className="flex space-x-2">
          {['soja', 'milho', 'trigo'].map((grain) => (
            <button
              key={grain}
              onClick={() => setSelectedGrain(grain)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedGrain === grain
                  ? 'bg-cyan-400 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {grain.charAt(0).toUpperCase() + grain.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grain Price Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {grainData.map((grain, index) => (
          <motion.div
            key={grain.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.1)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <grain.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{grain.name}</h3>
                  <p className="text-gray-400 text-sm">{grain.market}</p>
                </div>
              </div>
              {grain.isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">{grain.price}</div>
              <div className={`text-sm font-medium ${grain.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {grain.change24h}
              </div>
              <div className="text-gray-400 text-sm">
                Volume: {grain.volume}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Histórico de Preços</h2>
          <p className="text-gray-400">Evolução dos preços dos principais grãos</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value}`}
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
                dataKey="soja"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="milho"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="trigo"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Market Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Regional Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Distribuição Regional</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="region" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
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
                <Bar dataKey="soja" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="milho" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="trigo" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Insights do Mercado</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Soja em Alta',
                description: 'Preços subindo devido à forte demanda chinesa',
                trend: '+2.34%',
                color: 'text-green-400'
              },
              {
                title: 'Milho Estável',
                description: 'Mercado equilibrado com boa oferta',
                trend: '+1.87%',
                color: 'text-blue-400'
              },
              {
                title: 'Trigo em Queda',
                description: 'Redução na demanda de exportação',
                trend: '-0.45%',
                color: 'text-red-400'
              }
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{insight.title}</h4>
                  <span className={`text-sm font-medium ${insight.color}`}>
                    {insight.trend}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{insight.description}</p>
              </motion.div>
            ))}
          </div>
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
          className="p-6 bg-gradient-to-r from-yellow-400/10 to-orange-600/10 border border-yellow-400/30 rounded-2xl hover:border-yellow-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Análise Técnica</h3>
            <p className="text-gray-400 text-sm">Indicadores e tendências de mercado</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-2xl hover:border-green-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Mapa de Produção</h3>
            <p className="text-gray-400 text-sm">Visualize a distribuição geográfica</p>
          </div>
        </motion.button>

        <motion.button
          className="p-6 bg-gradient-to-r from-blue-400/10 to-purple-600/10 border border-blue-400/30 rounded-2xl hover:border-blue-400/50 transition-all duration-300 group"
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Mercado Global</h3>
            <p className="text-gray-400 text-sm">Preços internacionais e tendências</p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
