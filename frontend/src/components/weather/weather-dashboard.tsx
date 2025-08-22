'use client';

import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, MapPin, Thermometer, Droplets, Eye } from 'lucide-react';

export function WeatherDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            Clima & Geodados
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Monitoramento meteorológico em tempo real e análise geográfica 
            para otimizar suas operações agrícolas.
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
            <Thermometer className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">28°C</div>
            <div className="text-gray-400">Temperatura</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Droplets className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">65%</div>
            <div className="text-gray-400">Umidade</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Wind className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">12 km/h</div>
            <div className="text-gray-400">Vento</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Eye className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">10 km</div>
            <div className="text-gray-400">Visibilidade</div>
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
              <h3 className="text-2xl font-bold text-white mb-4">Previsão do Tempo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-6 h-6 text-yellow-400" />
                    <span className="text-gray-300">Hoje</span>
                  </div>
                  <span className="text-white font-bold">28°C / 18°C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cloud className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-300">Amanhã</span>
                  </div>
                  <span className="text-white font-bold">25°C / 17°C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CloudRain className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-300">Quinta</span>
                  </div>
                  <span className="text-white font-bold">22°C / 16°C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-6 h-6 text-yellow-400" />
                    <span className="text-gray-300">Sexta</span>
                  </div>
                  <span className="text-white font-bold">26°C / 19°C</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Condições Agrícolas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Índice UV</span>
                  <span className="text-yellow-400 font-medium">Alto (8)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pressão Atmosférica</span>
                  <span className="text-white font-medium">1013 hPa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Ponto de Orvalho</span>
                  <span className="text-white font-medium">20°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Qualidade do Ar</span>
                  <span className="text-green-400 font-medium">Boa (45)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Dados Geográficos</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-sky-400/10 to-blue-600/10 border border-sky-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Localização</h4>
                  <div className="text-2xl font-bold text-sky-400">São Paulo, SP</div>
                  <p className="text-gray-400">Coordenadas: -23.5505, -46.6333</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">Altitude</h4>
                  <div className="text-2xl font-bold text-green-400">760m</div>
                  <p className="text-gray-400">Acima do nível do mar</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">APIs Integradas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">OpenWeather</div>
                  <div className="text-lg font-bold text-blue-400">Ativo</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">IBGE</div>
                  <div className="text-lg font-bold text-green-400">Ativo</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Google Maps</div>
                  <div className="text-lg font-bold text-purple-400">Ativo</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Baidu Maps</div>
                  <div className="text-lg font-bold text-cyan-400">Ativo</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center">
            <MapPin className="w-16 h-16 text-sky-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Mapa Interativo</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Visualização geográfica com sobreposição de dados meteorológicos, 
              condições agrícolas e informações regionais.
            </p>
            <div className="mt-6 p-4 bg-sky-400/10 border border-sky-400/30 rounded-lg inline-block">
              <p className="text-sm text-sky-400">
                Integração com OpenWeather, IBGE e APIs de geolocalização
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
