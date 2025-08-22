import React, { useState, useEffect } from 'react';

const ExportData = () => {
  const [exportData, setExportData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    // Simulated FAO export data
    const mockExportData = {
      '2024': [
        {
          grain: 'Soja',
          volume: 95.2,
          value: 45.8,
          topDestinations: ['China', 'União Europeia', 'Tailândia'],
          growth: 8.5,
          region: 'Centro-Oeste'
        },
        {
          grain: 'Milho',
          volume: 42.8,
          value: 8.9,
          topDestinations: ['Irã', 'Japão', 'Coreia do Sul'],
          growth: 12.3,
          region: 'Sul'
        },
        {
          grain: 'Trigo',
          volume: 2.1,
          value: 0.8,
          topDestinations: ['Argélia', 'Marrocos', 'Tunísia'],
          growth: -5.2,
          region: 'Sul'
        },
        {
          grain: 'Arroz',
          volume: 1.8,
          value: 1.2,
          topDestinations: ['Venezuela', 'Senegal', 'Cuba'],
          growth: 3.1,
          region: 'Sul'
        },
        {
          grain: 'Café',
          volume: 35.6,
          value: 8.4,
          topDestinations: ['Estados Unidos', 'Alemanha', 'Itália'],
          growth: 6.8,
          region: 'Sudeste'
        },
        {
          grain: 'Algodão',
          volume: 2.3,
          value: 1.8,
          topDestinations: ['China', 'Bangladesh', 'Vietnã'],
          growth: 15.7,
          region: 'Centro-Oeste'
        }
      ],
      '2023': [
        {
          grain: 'Soja',
          volume: 87.9,
          value: 42.1,
          topDestinations: ['China', 'União Europeia', 'Tailândia'],
          growth: 5.2,
          region: 'Centro-Oeste'
        },
        {
          grain: 'Milho',
          volume: 38.1,
          value: 7.9,
          topDestinations: ['Irã', 'Japão', 'Coreia do Sul'],
          growth: 8.7,
          region: 'Sul'
        },
        {
          grain: 'Trigo',
          volume: 2.2,
          value: 0.9,
          topDestinations: ['Argélia', 'Marrocos', 'Tunísia'],
          growth: -2.1,
          region: 'Sul'
        },
        {
          grain: 'Arroz',
          volume: 1.7,
          value: 1.1,
          topDestinations: ['Venezuela', 'Senegal', 'Cuba'],
          growth: 1.8,
          region: 'Sul'
        },
        {
          grain: 'Café',
          volume: 33.4,
          value: 7.9,
          topDestinations: ['Estados Unidos', 'Alemanha', 'Itália'],
          growth: 4.2,
          region: 'Sudeste'
        },
        {
          grain: 'Algodão',
          volume: 2.0,
          value: 1.6,
          topDestinations: ['China', 'Bangladesh', 'Vietnã'],
          growth: 12.3,
          region: 'Centro-Oeste'
        }
      ]
    };

    setExportData(mockExportData[selectedYear] || []);
  }, [selectedYear]);

  const years = ['2024', '2023', '2022'];
  const regions = [
    { id: 'all', name: 'Todas as Regiões' },
    { id: 'Centro-Oeste', name: 'Centro-Oeste' },
    { id: 'Sul', name: 'Sul' },
    { id: 'Sudeste', name: 'Sudeste' },
    { id: 'Nordeste', name: 'Nordeste' },
    { id: 'Norte', name: 'Norte' }
  ];

  const filteredData = selectedRegion === 'all' 
    ? exportData 
    : exportData.filter(item => item.region === selectedRegion);

  const totalVolume = filteredData.reduce((sum, item) => sum + item.volume, 0);
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Dados de Exportação - FAO
          </h3>
          <p className="text-neutral-400">
            Estatísticas de exportação agrícola brasileira
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedYear === year
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setSelectedRegion(region.id)}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              selectedRegion === region.id
                ? 'bg-green-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
          <h4 className="text-lg font-semibold text-white mb-2">
            Volume Total
          </h4>
          <p className="text-3xl font-bold text-blue-400">
            {totalVolume.toFixed(1)}M t
          </p>
          <p className="text-neutral-400 text-sm">
            Milhões de toneladas exportadas
          </p>
        </div>
        
        <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
          <h4 className="text-lg font-semibold text-white mb-2">
            Valor Total
          </h4>
          <p className="text-3xl font-bold text-green-400">
            US$ {totalValue.toFixed(1)}B
          </p>
          <p className="text-neutral-400 text-sm">
            Bilhões de dólares em exportações
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="text-left py-3 px-4 text-neutral-300 font-medium">
                Grão
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Volume (M t)
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Valor (US$ B)
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Crescimento (%)
              </th>
              <th className="text-left py-3 px-4 text-neutral-300 font-medium">
                Região
              </th>
              <th className="text-left py-3 px-4 text-neutral-300 font-medium">
                Principais Destinos
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.grain}
                className={`border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-neutral-800/50' : ''
                }`}
              >
                <td className="py-3 px-4 text-white font-medium">
                  {item.grain}
                </td>
                <td className="py-3 px-4 text-right text-white font-mono">
                  {item.volume.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-right text-white font-mono">
                  {item.value.toFixed(1)}
                </td>
                <td className={`py-3 px-4 text-right font-mono ${
                  item.growth >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.growth >= 0 ? '+' : ''}{item.growth}%
                </td>
                <td className="py-3 px-4 text-neutral-300">
                  {item.region}
                </td>
                <td className="py-3 px-4 text-neutral-300 text-sm">
                  {item.topDestinations.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">
              Fonte dos Dados
            </h4>
            <p className="text-neutral-400 text-sm">
              Dados simulados baseados em padrões reais da FAO e MDIC
            </p>
          </div>
          <div className="text-right">
            <p className="text-neutral-300 text-sm">
              Última atualização
            </p>
            <p className="text-white font-mono text-sm">
              {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
