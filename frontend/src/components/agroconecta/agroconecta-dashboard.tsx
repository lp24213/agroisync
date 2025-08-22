'use client';

import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, DollarSign, Users, Package } from 'lucide-react';

export function AgroConectaDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            AgroConecta
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A plataforma de frete agrícola mais inteligente do Brasil. Conectando produtores, 
            transportadores e empresas com tecnologia de ponta.
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
            <Truck className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">2,847</div>
            <div className="text-gray-400">Caminhões Ativos</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">156</div>
            <div className="text-gray-400">Cidades Cobertas</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">45.2K</div>
            <div className="text-gray-400">Fretes Realizados</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">12.5K</div>
            <div className="text-gray-400">Usuários Ativos</div>
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
              <h3 className="text-2xl font-bold text-white mb-4">Como Funciona</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold">1</div>
                  <div>
                    <h4 className="text-white font-semibold">Cadastre-se</h4>
                    <p className="text-gray-400">Produtores e transportadores se registram na plataforma</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-black font-bold">2</div>
                  <div>
                    <h4 className="text-white font-semibold">Conecte</h4>
                    <p className="text-gray-400">Encontre a melhor oferta de frete ou carga</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold">3</div>
                  <div>
                    <h4 className="text-white font-semibold">Execute</h4>
                    <p className="text-gray-400">Acompanhe em tempo real e receba o pagamento</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Vantagens</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Frete em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Preços competitivos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Rastreamento GPS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Comunidade verificada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Planos e Preços</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Plano Mensal</h4>
                  <div className="text-3xl font-bold text-cyan-400">R$ 50</div>
                  <p className="text-gray-400">Acesso completo à plataforma</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Plano Anual</h4>
                  <div className="text-3xl font-bold text-green-400">R$ 500</div>
                  <p className="text-gray-400">2 meses grátis + suporte premium</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Tecnologias</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">GPS Tracking</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">IA Matching</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Blockchain</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Cloud Computing</div>
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
          <div className="bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 border border-cyan-400/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para revolucionar o frete agrícola?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de produtores e transportadores que já estão 
              usando o AgroConecta para otimizar suas operações.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300">
                Começar Agora
              </button>
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300">
                Saiba Mais
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
