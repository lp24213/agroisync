'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

export function CryptoChart() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const cryptos = [
    { code: 'BTC', name: 'Bitcoin', color: 'from-yellow-400 to-orange-500' },
    { code: 'ETH', name: 'Ethereum', color: 'from-blue-400 to-purple-500' },
    { code: 'SOL', name: 'Solana', color: 'from-green-400 to-cyan-500' },
  ];

  const timeframes = [
    { value: '1h', label: '1 Hora' },
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' },
    { value: '1y', label: '1 Ano' },
  ];

  useEffect(() => {
    // Simular dados da TradingView API
    const generateMockData = () => {
      const data: ChartData[] = [];
      const basePrice = selectedCrypto === 'BTC' ? 43250 : selectedCrypto === 'ETH' ? 2650 : 98;
      
      for (let i = 0; i < 24; i++) {
        const time = `${i.toString().padStart(2, '0')}:00`;
        const price = basePrice + (Math.random() - 0.5) * 1000;
        const volume = Math.random() * 1000000000 + 500000000;
        
        data.push({ time, price, volume });
      }
      
      return data;
    };

    setLoading(true);
    setTimeout(() => {
      setChartData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [selectedCrypto, timeframe]);

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[0]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100) || 0;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Análise Técnica</h3>
          <p className="text-gray-400">Gráficos em tempo real e indicadores avançados</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Crypto Selector */}
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            {cryptos.map((crypto) => (
              <option key={crypto.code} value={crypto.code}>
                {crypto.name}
              </option>
            ))}
          </select>
          
          {/* Timeframe Selector */}
          <div className="flex bg-white/10 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === tf.value
                    ? 'bg-cyan-400 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Preço Atual</div>
          <div className="text-3xl font-bold text-white">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Variação ({timeframe})</div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Volume 24h</div>
          <div className="text-2xl font-bold text-white">
            ${(chartData.reduce((sum, data) => sum + data.volume, 0) / 24 / 1000000000).toFixed(2)}B
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="h-96 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando dados...</p>
          </div>
        ) : (
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Gráfico TradingView</h4>
            <p className="text-gray-400 max-w-md">
              Integração com TradingView API para gráficos profissionais e indicadores técnicos avançados
            </p>
            <div className="mt-4 p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
              <p className="text-sm text-cyan-400">
                API Key: {process.env.NEXT_PUBLIC_TRADINGVIEW_API_KEY || 'Configurar TradingView API'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Technical Indicators */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-1">RSI</div>
          <div className="text-lg font-semibold text-white">65.4</div>
          <div className="text-xs text-green-400">Neutro</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-1">MACD</div>
          <div className="text-lg font-semibold text-white">+2.45</div>
          <div className="text-xs text-green-400">Bullish</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Bollinger</div>
          <div className="text-lg font-semibold text-white">$42.8K</div>
          <div className="text-xs text-yellow-400">Médio</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Volume</div>
          <div className="text-lg font-semibold text-white">2.8B</div>
          <div className="text-xs text-green-400">Alto</div>
        </div>
      </div>
    </motion.div>
  );
}
