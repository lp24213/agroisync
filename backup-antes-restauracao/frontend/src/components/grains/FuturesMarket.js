import React, { useState, useEffect } from 'react';

const FuturesMarket = () => {
  const [futuresData, setFuturesData] = useState([]);
  const [selectedGrain, setSelectedGrain] = useState('soja');
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    // Simulated futures market data
    const mockFuturesData = {
      soja: [
        { month: 'Jan/25', price: 165.5, change: 2.3, volume: 15420 },
        { month: 'Mar/25', price: 168.2, change: 1.8, volume: 12850 },
        { month: 'May/25', price: 170.8, change: 1.5, volume: 11200 },
        { month: 'Jul/25', price: 172.4, change: 0.9, volume: 9800 },
        { month: 'Sep/25', price: 174.1, change: 0.7, volume: 8500 },
        { month: 'Nov/25', price: 175.6, change: 0.4, volume: 7200 }
      ],
      milho: [
        { month: 'Jan/25', price: 78.3, change: 1.2, volume: 22100 },
        { month: 'Mar/25', price: 79.8, change: 1.9, volume: 19800 },
        { month: 'May/25', price: 81.2, change: 1.7, volume: 17500 },
        { month: 'Jul/25', price: 82.5, change: 1.6, volume: 15200 },
        { month: 'Sep/25', price: 83.8, change: 1.5, volume: 13100 },
        { month: 'Nov/25', price: 84.9, change: 1.3, volume: 11000 }
      ],
      trigo: [
        { month: 'Jan/25', price: 210.4, change: 0.8, volume: 8900 },
        { month: 'Mar/25', price: 212.6, change: 1.0, volume: 7600 },
        { month: 'May/25', price: 214.8, change: 1.0, volume: 6800 },
        { month: 'Jul/25', price: 216.9, change: 0.9, volume: 5900 },
        { month: 'Sep/25', price: 218.7, change: 0.8, volume: 5100 },
        { month: 'Nov/25', price: 220.2, change: 0.6, volume: 4400 }
      ]
    };

    setFuturesData(mockFuturesData[selectedGrain] || []);
  }, [selectedGrain]);

  const grains = [
    { id: 'soja', name: 'Soja', color: 'from-green-500 to-green-600' },
    { id: 'milho', name: 'Milho', color: 'from-yellow-500 to-yellow-600' },
    { id: 'trigo', name: 'Trigo', color: 'from-amber-500 to-amber-600' }
  ];

  const timeframes = [
    { id: '1M', name: '1 Mês' },
    { id: '3M', name: '3 Meses' },
    { id: '6M', name: '6 Meses' },
    { id: '1Y', name: '1 Ano' }
  ];

  return (
    <div className='rounded-xl border border-neutral-700 bg-neutral-800 p-6'>
      <div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h3 className='mb-2 text-2xl font-bold text-white'>Mercado Futuro - B3</h3>
          <p className='text-neutral-400'>Contratos futuros de grãos negociados na B3</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-3 lg:mt-0'>
          {grains.map(grain => (
            <button
              key={grain.id}
              onClick={() => setSelectedGrain(grain.id)}
              className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                selectedGrain === grain.id
                  ? `bg-gradient-to-r ${grain.color} text-white shadow-lg`
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {grain.name}
            </button>
          ))}
        </div>
      </div>

      <div className='mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4'>
        {timeframes.map(tf => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id)}
            className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
              timeframe === tf.id ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {tf.name}
          </button>
        ))}
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-neutral-700'>
              <th className='px-4 py-3 text-left font-medium text-neutral-300'>Vencimento</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Preço (R$/sc)</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Variação (%)</th>
              <th className='px-4 py-3 text-right font-medium text-neutral-300'>Volume</th>
            </tr>
          </thead>
          <tbody>
            {futuresData.map((contract, index) => (
              <tr
                key={contract.month}
                className={`border-b border-neutral-700/50 transition-colors duration-200 hover:bg-neutral-700/30 ${
                  index % 2 === 0 ? 'bg-neutral-800/50' : ''
                }`}
              >
                <td className='px-4 py-3 font-medium text-white'>{contract.month}</td>
                <td className='px-4 py-3 text-right font-mono text-white'>{contract.price.toFixed(2)}</td>
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    contract.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {contract.change >= 0 ? '+' : ''}
                  {contract.change}%
                </td>
                <td className='px-4 py-3 text-right font-mono text-neutral-300'>{contract.volume.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 rounded-lg border border-neutral-600 bg-neutral-700/50 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='mb-1 text-lg font-semibold text-white'>Informações do Mercado</h4>
            <p className='text-sm text-neutral-400'>Dados simulados baseados em padrões reais da B3</p>
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

export default FuturesMarket;
