import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, LineChart,
  RefreshCw, Settings,
  ZoomIn, ZoomOut, Move
} from 'lucide-react';

const CryptoCharts = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [chartType, setChartType] = useState('candlestick');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ prices: [] });
  const [showSettings, setShowSettings] = useState(false);

  const cryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB', icon: '🟡' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: '●' }
  ];

  const timeframes = useMemo(() => [
    { value: '1d', label: '1 Dia', days: 1 },
    { value: '7d', label: '7 Dias', days: 7 },
    { value: '30d', label: '30 Dias', days: 30 },
    { value: '90d', label: '90 Dias', days: 90 },
    { value: '1y', label: '1 Ano', days: 365 }
  ], []);

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { value: 'line', label: 'Linha', icon: LineChart },
    { value: 'area', label: 'Área', icon: TrendingUp }
  ];

  const generateMockData = useCallback(() => {
    const selectedTimeframe = timeframes.find(t => t.value === timeframe);
    const days = selectedTimeframe ? selectedTimeframe.days : 7;
    const mockData = [];
    let basePrice = 45000; // Preço base do Bitcoin
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const volatility = 0.05; // 5% de volatilidade
      const change = (Math.random() - 0.5) * volatility;
      const open = basePrice;
      const close = basePrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      
      basePrice = close;
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 500000
      });
    }
    
    setChartData({ prices: mockData });
  }, [timeframe, timeframes]);

  const loadChartData = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados mockados para demonstração
      generateMockData();
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  const calculateSMA = (prices, period) => {
    if (prices.length < period) return [];
    
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((acc, price) => acc + price.close, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return [];
    
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i].close - prices[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsi = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  const getPriceChange = () => {
    if (chartData.prices.length < 2) return { change: 0, percentage: 0 };
    
    const firstPrice = chartData.prices[0].close;
    const lastPrice = chartData.prices[chartData.prices.length - 1].close;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return { change, percentage };
  };

  const priceChange = getPriceChange();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gráficos de Criptomoedas</h2>
            <p className="text-gray-600">Análise técnica em tempo real</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={loadChartData}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Crypto Selection */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Criptomoeda:</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {cryptos.map(crypto => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.icon} {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Selection */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Período:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
        </div>

        {/* Chart Type Selection */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Tipo:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {chartTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Summary */}
      {chartData.prices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Preço Atual</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(chartData.prices[chartData.prices.length - 1].close)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Variação</p>
            <p className={`text-xl font-bold ${priceChange.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange.change >= 0 ? '+' : ''}{formatPrice(priceChange.change)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Variação %</p>
            <p className={`text-xl font-bold ${priceChange.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Volume 24h</p>
            <p className="text-xl font-bold text-gray-900">
              {formatVolume(chartData.prices[chartData.prices.length - 1].volume)}
            </p>
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="h-96 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="text-gray-600">Carregando dados...</span>
            </div>
          ) : (
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gráfico de {cryptos.find(c => c.id === selectedCrypto)?.name}</h3>
              <p className="text-gray-600 mb-4">
                {chartData.prices.length} pontos de dados para {timeframes.find(t => t.value === timeframe)?.label}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                  <Move className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Indicators */}
      {chartData.prices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Média Móvel (SMA 20)</h4>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(calculateSMA(chartData.prices, 20).slice(-1)[0] || 0)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">RSI (14)</h4>
            <p className="text-2xl font-bold text-gray-900">
              {calculateRSI(chartData.prices).slice(-1)[0]?.toFixed(2) || 'N/A'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Suporte/Resistência</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Suporte: {formatPrice(Math.min(...chartData.prices.map(p => p.low)))}
              </p>
              <p className="text-sm text-gray-600">
                Resistência: {formatPrice(Math.max(...chartData.prices.map(p => p.high)))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-4">Configurações do Gráfico</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indicadores Técnicos
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Média Móvel Simples</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">RSI</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">MACD</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Configurações de Exibição
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Mostrar Volume</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Mostrar Grid</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Modo Escuro</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CryptoCharts;