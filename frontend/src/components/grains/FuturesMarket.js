import React, { useState, useEffect } from 'react';

const FuturesMarket = () => {
  const [futuresData, setFuturesData] = useState([]);
  const [selectedGrain, setSelectedGrain] = useState('soja');
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    // Simulated futures market data
    const mockFuturesData = {
      soja: [
        { month: 'Jan/25', price: 165.50, change: 2.3, volume: 15420 },
        { month: 'Mar/25', price: 168.20, change: 1.8, volume: 12850 },
        { month: 'May/25', price: 170.80, change: 1.5, volume: 11200 },
        { month: 'Jul/25', price: 172.40, change: 0.9, volume: 9800 },
        { month: 'Sep/25', price: 174.10, change: 0.7, volume: 8500 },
        { month: 'Nov/25', price: 175.60, change: 0.4, volume: 7200 }
      ],
      milho: [
        { month: 'Jan/25', price: 78.30, change: 1.2, volume: 22100 },
        { month: 'Mar/25', price: 79.80, change: 1.9, volume: 19800 },
        { month: 'May/25', price: 81.20, change: 1.7, volume: 17500 },
        { month: 'Jul/25', price: 82.50, change: 1.6, volume: 15200 },
        { month: 'Sep/25', price: 83.80, change: 1.5, volume: 13100 },
        { month: 'Nov/25', price: 84.90, change: 1.3, volume: 11000 }
      ],
      trigo: [
        { month: 'Jan/25', price: 210.40, change: 0.8, volume: 8900 },
        { month: 'Mar/25', price: 212.60, change: 1.0, volume: 7600 },
        { month: 'May/25', price: 214.80, change: 1.0, volume: 6800 },
        { month: 'Jul/25', price: 216.90, change: 0.9, volume: 5900 },
        { month: 'Sep/25', price: 218.70, change: 0.8, volume: 5100 },
        { month: 'Nov/25', price: 220.20, change: 0.6, volume: 4400 }
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
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Mercado Futuro - B3
          </h3>
          <p className="text-neutral-400">
            Contratos futuros de grãos negociados na B3
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          {grains.map((grain) => (
            <button
              key={grain.id}
              onClick={() => setSelectedGrain(grain.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {timeframes.map((tf) => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              timeframe === tf.id
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {tf.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="text-left py-3 px-4 text-neutral-300 font-medium">
                Vencimento
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Preço (R$/sc)
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Variação (%)
              </th>
              <th className="text-right py-3 px-4 text-neutral-300 font-medium">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {futuresData.map((contract, index) => (
              <tr
                key={contract.month}
                className={`border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-neutral-800/50' : ''
                }`}
              >
                <td className="py-3 px-4 text-white font-medium">
                  {contract.month}
                </td>
                <td className="py-3 px-4 text-right text-white font-mono">
                  {contract.price.toFixed(2)}
                </td>
                <td className={`py-3 px-4 text-right font-mono ${
                  contract.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {contract.change >= 0 ? '+' : ''}{contract.change}%
                </td>
                <td className="py-3 px-4 text-right text-neutral-300 font-mono">
                  {contract.volume.toLocaleString()}
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
              Informações do Mercado
            </h4>
            <p className="text-neutral-400 text-sm">
              Dados simulados baseados em padrões reais da B3
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

export default FuturesMarket;
