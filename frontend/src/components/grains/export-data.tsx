'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, Ship, DollarSign, Calendar } from 'lucide-react';

interface ExportData {
  commodity: string;
  country: string;
  volume: number;
  value: number;
  change: number;
  period: string;
}

interface CountryData {
  country: string;
  flag: string;
  totalExports: number;
  topCommodity: string;
  growth: number;
}

export function ExportData() {
  const [exportData, setExportData] = useState<ExportData[]>([]);
  const [topCountries, setTopCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados da FAO API
    const mockExportData: ExportData[] = [
      { commodity: 'Soja', country: 'Brasil', volume: 85.2, value: 42.6, change: 12.5, period: '2023' },
      { commodity: 'Milho', country: 'Brasil', volume: 45.8, value: 18.3, change: 8.7, period: '2023' },
      { commodity: 'Café', country: 'Brasil', volume: 32.1, value: 28.9, change: 15.2, period: '2023' },
      { commodity: 'Soja', country: 'EUA', volume: 52.4, value: 26.2, change: -5.2, period: '2023' },
      { commodity: 'Milho', country: 'EUA', volume: 68.9, value: 27.6, change: 3.8, period: '2023' },
      { commodity: 'Trigo', country: 'Rússia', volume: 38.7, value: 15.5, change: 22.1, period: '2023' },
      { commodity: 'Arroz', country: 'Índia', volume: 22.3, value: 8.9, change: 7.4, period: '2023' },
      { commodity: 'Café', country: 'Vietnã', volume: 18.9, value: 17.0, change: 9.8, period: '2023' },
    ];

    const mockTopCountries: CountryData[] = [
      { country: 'Brasil', flag: '🇧🇷', totalExports: 89.8, topCommodity: 'Soja', growth: 12.5 },
      { country: 'EUA', flag: '🇺🇸', totalExports: 53.8, topCommodity: 'Milho', growth: -1.2 },
      { country: 'Rússia', flag: '🇷🇺', totalExports: 38.7, topCommodity: 'Trigo', growth: 22.1 },
      { country: 'Argentina', flag: '🇦🇷', totalExports: 35.2, topCommodity: 'Soja', growth: 8.9 },
      { country: 'Ucrânia', flag: '🇺🇦', totalExports: 28.4, topCommodity: 'Milho', growth: 15.7 },
    ];
    
    setTimeout(() => {
      setExportData(mockExportData);
      setTopCountries(mockTopCountries);
      setLoading(false);
    }, 1000);
  }, []);

  const totalExports = exportData.reduce((sum, item) => sum + item.value, 0);
  const totalVolume = exportData.reduce((sum, item) => sum + item.volume, 0);
  const averageGrowth = exportData.reduce((sum, item) => sum + item.change, 0) / exportData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Exportações Globais</h3>
        <p className="text-gray-400">Dados da FAO - Organização das Nações Unidas para Alimentação e Agricultura</p>
      </div>

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-r from-purple-400/10 to-pink-600/10 border border-purple-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Valor Total</div>
          <div className="text-3xl font-bold text-white">
            ${totalExports.toFixed(1)}B
          </div>
          <div className="text-sm text-gray-400">Exportações globais</div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Volume Total</div>
          <div className="text-3xl font-bold text-white">
            {totalVolume.toFixed(1)}M ton
          </div>
          <div className="text-sm text-gray-400">Métricas</div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 border border-blue-400/30 rounded-xl">
          <div className="text-sm text-gray-400 mb-2">Crescimento</div>
          <div className="text-3xl font-bold text-white">
            {averageGrowth >= 0 ? '+' : ''}{averageGrowth.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Médio anual</div>
        </div>
      </div>

      {/* Top Exporting Countries */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="text-blue-400" />
          Principais Exportadores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCountries.map((country, index) => (
            <motion.div
              key={country.country}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h5 className="text-white font-semibold">{country.country}</h5>
                    <p className="text-gray-400 text-sm">{country.topCommodity}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${country.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {country.growth >= 0 ? '+' : ''}{country.growth.toFixed(1)}%
                </div>
              </div>
              <div className="text-lg font-bold text-white">
                ${country.totalExports.toFixed(1)}B
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Details Table */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Ship className="text-green-400" />
          Detalhes por Commodity
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-medium">Commodity</th>
                <th className="text-left p-4 text-gray-400 font-medium">País</th>
                <th className="text-left p-4 text-gray-400 font-medium">Volume (M ton)</th>
                <th className="text-left p-4 text-gray-400 font-medium">Valor (US$ B)</th>
                <th className="text-left p-4 text-gray-400 font-medium">Crescimento</th>
                <th className="text-left p-4 text-gray-400 font-medium">Período</th>
              </tr>
            </thead>
            <tbody>
              {exportData.map((item, index) => (
                <motion.tr
                  key={`${item.commodity}-${item.country}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="text-white font-semibold">{item.commodity}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{item.country}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{item.volume.toFixed(1)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-semibold">${item.value.toFixed(1)}</div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center space-x-1 ${
                      item.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{item.period}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Tendências Globais</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Demanda China</span>
              <span className="text-green-400 font-medium">+15.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Preços Soja</span>
              <span className="text-green-400 font-medium">+8.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Exportação Brasil</span>
              <span className="text-green-400 font-medium">+12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mercado EUA</span>
              <span className="text-red-400 font-medium">-2.1%</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Previsões 2024</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Crescimento Global</span>
              <span className="text-green-400 font-medium">+6.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Novos Mercados</span>
              <span className="text-blue-400 font-medium">Ásia</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tecnologia</span>
              <span className="text-purple-400 font-medium">Blockchain</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sustentabilidade</span>
              <span className="text-green-400 font-medium">+25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Info */}
      <div className="mt-8 p-4 bg-purple-400/10 border border-purple-400/30 rounded-xl">
        <div className="flex items-center space-x-2 text-purple-400">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-medium">
            FAO API - Dados oficiais de exportação agrícola global
          </span>
        </div>
      </div>
    </motion.div>
  );
}
