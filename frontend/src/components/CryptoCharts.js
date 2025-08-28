import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart,
  Calendar, Clock, RefreshCw, Download, Settings,
  ZoomIn, ZoomOut, Move, Layers
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const CryptoCharts = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [chartType, setChartType] = useState('candlestick');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [technicalIndicators, setTechnicalIndicators] = useState({
    sma: true,
    ema: true,
    bollinger: false,
    rsi: false,
    macd: false
  });

  const popularCryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
  ];

  const timeframes = [
    { value: '1d', label: '24h', days: 1 },
    { value: '7d', label: '7d', days: 7 },
    { value: '30d', label: '30d', days: 30 },
    { value: '90d', label: '90d', days: 90 },
    { value: '1y', label: '1a', days: 365 }
  ];

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { value: 'line', label: 'Linha', icon: LineChart },
    { value: 'area', label: 'Área', icon: TrendingUp }
  ];

  useEffect(() => {
    loadChartData();
  }, [selectedCrypto, timeframe]);

  const loadChartData = useCallback(async () => {
    setLoading(true);
    try {
      const selectedTimeframe = timeframes.find(t => t.value === timeframe);
      const days = selectedTimeframe ? selectedTimeframe.days : 7;
      
      const data = await cryptoService.getHistoricalData(selectedCrypto, days, 'usd');
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do gráfico:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCrypto, timeframe]);

  const calculateSMA = (prices, period) => {
    if (prices.length < period) return [];
    
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  const calculateEMA = (prices, period) => {
    if (prices.length < period) return [];
    
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // Primeiro valor é SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    ema.push(sum / period);
    
    // Calcular EMA
    for (let i = period; i < prices.length; i++) {
      const newEMA = (prices[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
      ema.push(newEMA);
    }
    
    return ema;
  };

  const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
    if (prices.length < period) return { upper: [], middle: [], lower: [] };
    
    const sma = calculateSMA(prices, period);
    const upper = [];
    const lower = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upper.push(mean + (standardDeviation * stdDev));
      lower.push(mean - (standardDeviation * stdDev));
    }
    
    return { upper, middle: sma, lower };
  };

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return [];
    
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsi = [];
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
      
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
    
    return rsi;
  };

  const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    if (prices.length < slowPeriod) return { macd: [], signal: [], histogram: [] };
    
    const fastEMA = calculateEMA(prices, fastPeriod);
    const slowEMA = calculateEMA(prices, slowPeriod);
    
    const macd = [];
    for (let i = 0; i < fastEMA.length; i++) {
      const slowIndex = i + (slowPeriod - fastPeriod);
      if (slowIndex < slowEMA.length) {
        macd.push(fastEMA[i] - slowEMA[slowIndex]);
      }
    }
    
    const signal = calculateEMA(macd, signalPeriod);
    const histogram = macd.slice(signalPeriod - 1).map((value, index) => value - signal[index]);
    
    return { macd, signal, histogram };
  };

  const renderChart = () => {
    if (!chartData || !chartData.prices) {
      return (
        <div className="h-96 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? 'Carregando dados...' : 'Nenhum dado disponível'}
            </p>
          </div>
        </div>
      );
    }

    const prices = chartData.prices.map(p => p.price);
    const timestamps = chartData.prices.map(p => p.timestamp);
    
    // Calcular indicadores técnicos
    const sma20 = calculateSMA(prices, 20);
    const ema12 = calculateEMA(prices, 12);
    const bollinger = calculateBollingerBands(prices, 20, 2);
    const rsi = calculateRSI(prices, 14);
    const macd = calculateMACD(prices);

    return (
      <div className="space-y-6">
        {/* Gráfico Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gráfico de Preços - {getCryptoName(selectedCrypto)}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={loadChartData}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Atualizar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Mover">
                <Move className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área do Gráfico */}
          <div className="h-96 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
            {/* Simulação de gráfico - em produção usar biblioteca como Chart.js ou TradingView */}
            <div className="h-full flex items-end justify-between">
              {prices.slice(-20).map((price, index) => {
                const height = (price / Math.max(...prices)) * 100;
                const color = index > 0 && price > prices[prices.length - 21 + index - 1] ? 'bg-green-500' : 'bg-red-500';
                
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-3 ${color} rounded-t`}
                    title={`$${price.toFixed(2)}`}
                  />
                );
              })}
            </div>

            {/* Indicadores técnicos */}
            {technicalIndicators.sma && sma20.length > 0 && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-blue-600 dark:text-blue-400">SMA 20</span>
                </div>
              </div>
            )}

            {technicalIndicators.ema && ema12.length > 0 && (
              <div className="absolute top-8 left-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-0.5 bg-purple-500"></div>
                  <span className="text-purple-600 dark:text-purple-400">EMA 12</span>
                </div>
              </div>
            )}

            {technicalIndicators.bollinger && bollinger.upper.length > 0 && (
              <div className="absolute top-12 left-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-0.5 bg-yellow-500"></div>
                  <span className="text-yellow-600 dark:text-yellow-400">Bollinger</span>
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas do Gráfico */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Preço Atual</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${prices[prices.length - 1]?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Máximo 24h</p>
              <p className="text-lg font-semibold text-green-600">
                ${Math.max(...prices.slice(-24))?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Mínimo 24h</p>
              <p className="text-lg font-semibold text-red-600">
                ${Math.min(...prices.slice(-24))?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${chartData.volumes?.[chartData.volumes.length - 1]?.volume?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Indicadores Técnicos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RSI */}
          {technicalIndicators.rsi && rsi.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                RSI (14)
              </h4>
              <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                <div className="h-full flex items-end justify-between">
                  {rsi.slice(-20).map((value, index) => {
                    const height = (value / 100) * 100;
                    const color = value > 70 ? 'bg-red-500' : value < 30 ? 'bg-green-500' : 'bg-blue-500';
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-2 ${color} rounded-t`}
                        title={`RSI: ${value.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
                {/* Linhas de sobrecompra/sobrevenda */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="border-t border-red-300 h-1/3"></div>
                  <div className="border-t border-green-300 h-1/3"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Valor atual: {rsi[rsi.length - 1]?.toFixed(2) || '0.00'}
              </div>
            </div>
          )}

          {/* MACD */}
          {technicalIndicators.macd && macd.macd.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                MACD
              </h4>
              <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="h-full flex items-end justify-between">
                  {macd.macd.slice(-20).map((value, index) => {
                    const height = Math.abs(value) * 1000; // Escalar para visualização
                    const color = value > 0 ? 'bg-green-500' : 'bg-red-500';
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(height, 100)}%` }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-2 ${color} rounded-t`}
                        title={`MACD: ${value.toFixed(4)}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                MACD: {macd.macd[macd.macd.length - 1]?.toFixed(4) || '0.0000'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getCryptoName = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.name : cryptoId;
  };

  const getCryptoIcon = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.icon : cryptoId.toUpperCase().charAt(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gráficos Interativos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Análise técnica avançada com indicadores em tempo real
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Seleção de Cripto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Criptomoeda
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {popularCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.icon} {crypto.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Gráfico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {chartTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <option key={type.value} value={type.value}>
                    <Icon className="w-4 h-4" /> {type.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Indicadores Técnicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Indicadores
            </label>
            <button
              onClick={() => setTechnicalIndicators(prev => ({ ...prev, sma: !prev.sma }))}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                technicalIndicators.sma
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              SMA/EMA
            </button>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Configurações Avançadas
            </h4>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={technicalIndicators.sma}
                onChange={(e) => setTechnicalIndicators(prev => ({ ...prev, sma: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">SMA</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={technicalIndicators.ema}
                onChange={(e) => setTechnicalIndicators(prev => ({ ...prev, ema: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">EMA</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={technicalIndicators.bollinger}
                onChange={(e) => setTechnicalIndicators(prev => ({ ...prev, bollinger: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Bollinger</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={technicalIndicators.rsi}
                onChange={(e) => setTechnicalIndicators(prev => ({ ...prev, rsi: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">RSI</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={technicalIndicators.macd}
                onChange={(e) => setTechnicalIndicators(prev => ({ ...prev, macd: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">MACD</span>
            </label>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      {renderChart()}
    </div>
  );
};

export default CryptoCharts;
