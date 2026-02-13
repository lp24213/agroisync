import React, { useState, useEffect } from 'react';

const ExportData = () => {
  const [exportData, setExportData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    // Simulated FAO export data
    const mockExportData = {
      2024: [
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
      2023: [
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

  const filteredData =
    selectedRegion === 'all' ? exportData : exportData.filter(item => item.region === selectedRegion);

  const totalVolume = filteredData.reduce((sum, item) => sum + item.volume, 0);
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className='rounded-xl border border-neutral-700 bg-neutral-800 p-6'>
      <div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h3 className='mb-2 text-2xl font-bold text-white'>Dados de Exportação - FAO</h3>
          <p className='text-neutral-400'>Estatísticas de exportação agrícola brasileira</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-3 lg:mt-0'>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
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

      <div className='mb-6 grid grid-cols-1 gap-4 lg:grid-cols-6'>
        {regions.map(region => (
          <button
            key={region.id}
            onClick={() => setSelectedRegion(region.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              selectedRegion === region.id
                ? 'bg-green-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg border border-neutral-600 bg-neutral-700/50 p-4'>
          <h4 className='mb-2 text-lg font-semibold text-white'>Volume Total</h4>
          <p className='text-3xl font-bold text-blue-400'>{totalVolume.toFixed(1)}M t</p>
          <p className='text-sm text-neutral-400'>Milhões de toneladas exportadas</p>
        </div>

        <div className='rounded-lg border border-neutral-600 bg-neutral-700/50 p-4'>
          <h4 className='mb-2 text-lg font-semibold text-white'>Valor Total</h4>
          <p className='text-3xl font-bold text-green-400'>US$ {totalValue.toFixed(1)}B</p>
          <p className='text-sm text-neutral-400'>Bilhões de dólares em exportações</p>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-neutral-700'>
              <th className='px-4 py-3 text-left font-medium text-neutral-300'>Grão</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Volume (M t)</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Valor (US$ B)</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Crescimento (%)</th>
              <th className='px-4 py-3 text-left font-medium text-neutral-300'>Região</th>
              <th className='px-4 py-3 text-left font-medium text-neutral-300'>Principais Destinos</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.grain}
                className={`border-b border-neutral-700/50 transition-colors duration-200 hover:bg-neutral-700/30 ${
                  index % 2 === 0 ? 'bg-neutral-800/50' : ''
                }`}
              >
                <td className='px-4 py-3 font-medium text-white'>{item.grain}</td>
                <td className='px-4 py-3 text-right font-mono text-white'>{item.volume.toFixed(1)}</td>
                <td className='px-4 py-3 text-right font-mono text-white'>{item.value.toFixed(1)}</td>
                <td
                  className={`px-4 py-3 text-right font-mono ${item.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {item.growth >= 0 ? '+' : ''}
                  {item.growth}%
                </td>
                <td className='px-4 py-3 text-neutral-300'>{item.region}</td>
                <td className='px-4 py-3 text-sm text-neutral-300'>{item.topDestinations.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 rounded-lg border border-neutral-600 bg-neutral-700/50 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='mb-1 text-lg font-semibold text-white'>Fonte dos Dados</h4>
            <p className='text-sm text-neutral-400'>Dados simulados baseados em padrões reais da FAO e MDIC</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-neutral-300'>Última atualização</p>
            <p className='font-mono text-sm text-white'>{new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
