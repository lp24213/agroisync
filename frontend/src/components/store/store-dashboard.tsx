'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Package, Star, Users, TrendingUp, DollarSign } from 'lucide-react';

export function StoreDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Marketplace Agro
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A maior loja online de produtos agrícolas do Brasil. 
            Sementes, fertilizantes, máquinas e insumos com qualidade garantida.
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
            <Package className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">45.2K</div>
            <div className="text-gray-400">Produtos</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">8.7K</div>
            <div className="text-gray-400">Vendedores</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <ShoppingCart className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">156.3K</div>
            <div className="text-gray-400">Vendas</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">4.8</div>
            <div className="text-gray-400">Avaliação</div>
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
              <h3 className="text-2xl font-bold text-white mb-4">Categorias Principais</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Sementes</span>
                  <span className="text-orange-400 font-bold">32.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Fertilizantes</span>
                  <span className="text-blue-400 font-bold">28.7%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Máquinas</span>
                  <span className="text-green-400 font-bold">18.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Insumos</span>
                  <span className="text-purple-400 font-bold">20.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Planos de Anúncio</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-orange-400/10 to-red-600/10 border border-orange-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Plano Mensal</h4>
                  <div className="text-2xl font-bold text-orange-400">R$ 25</div>
                  <p className="text-gray-400">Por produto</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Plano Anual</h4>
                  <div className="text-2xl font-bold text-green-400">R$ 250</div>
                  <p className="text-gray-400">2 meses grátis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Métricas de Vendas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Receita Total</span>
                  <span className="text-white font-bold">R$ 45.2M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Ticket Médio</span>
                  <span className="text-white font-bold">R$ 289.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Taxa de Conversão</span>
                  <span className="text-green-400 font-bold">3.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Retorno de Cliente</span>
                  <span className="text-blue-400 font-bold">67.2%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Formas de Pagamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Pix</div>
                  <div className="text-lg font-bold text-green-400">Instantâneo</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Cartão</div>
                  <div className="text-lg font-bold text-blue-400">Stripe</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Cripto</div>
                  <div className="text-lg font-bold text-purple-400">Metamask</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Boleto</div>
                  <div className="text-lg font-bold text-orange-400">3 dias</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-400/10 via-red-500/10 to-pink-600/10 border border-orange-400/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para vender seus produtos agrícolas?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de vendedores que já estão lucrando 
              com o Marketplace Agro mais completo do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-600 text-black font-bold rounded-lg hover:from-orange-500 hover:to-red-700 transition-all duration-300">
                Cadastrar Produtos
              </button>
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300">
                Ver Planos
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
