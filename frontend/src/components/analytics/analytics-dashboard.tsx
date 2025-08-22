'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react';

export function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Análise completa e insights em tempo real do seu agronegócio. 
            Dados que transformam decisões em resultados.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">R$ 2.4M</div>
            <div className="text-gray-400">Receita Total</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">15.2K</div>
            <div className="text-gray-400">Usuários Ativos</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">89.7%</div>
            <div className="text-gray-400">Taxa de Conversão</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">+24.5%</div>
            <div className="text-gray-400">Crescimento</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Métricas Principais</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ROI Médio</span>
                  <span className="text-green-400 font-bold">+156%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Custo por Aquisição</span>
                  <span className="text-white font-bold">R$ 45.20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Lifetime Value</span>
                  <span className="text-white font-bold">R$ 2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Churn Rate</span>
                  <span className="text-red-400 font-bold">3.2%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Tendências</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vendas Online</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">+18.5%</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">App Downloads</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">+32.1%</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Engajamento</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">+12.7%</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Segmentação</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Produtores</h4>
                  <div className="text-2xl font-bold text-purple-400">68%</div>
                  <p className="text-gray-400">Maior segmento</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 border border-blue-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Empresas</h4>
                  <div className="text-2xl font-bold text-blue-400">22%</div>
                  <p className="text-gray-400">Segmento corporativo</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Investidores</h4>
                  <div className="text-2xl font-bold text-green-400">10%</div>
                  <p className="text-gray-400">Mercado financeiro</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Uptime</div>
                  <div className="text-lg font-bold text-green-400">99.9%</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Latência</div>
                  <div className="text-lg font-bold text-blue-400">45ms</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Throughput</div>
                  <div className="text-lg font-bold text-purple-400">2.5K/s</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Errors</div>
                  <div className="text-lg font-bold text-red-400">0.01%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Gráficos Interativos</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Visualizações avançadas e dashboards personalizáveis para análise profunda dos dados
            </p>
            <div className="mt-6 p-4 bg-purple-400/10 border border-purple-400/30 rounded-lg inline-block">
              <p className="text-sm text-purple-400">
                Integração com TradingView, Chart.js e D3.js
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
