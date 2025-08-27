import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart, 
  PieChart, Activity, RefreshCw, Calendar,
  DollarSign, Percent, Users, Globe,
  ArrowUpRight, ArrowDownRight, Minus,
  Info, AlertTriangle, CheckCircle
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const MarketAnalysis = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [cryptoData, setCryptoData] = useState(null);
  const [marketData, setMarketData] = useState({});
  const [technicalIndicators, setTechnicalIndicators] = useState({});
  const [news, setNews] = useState([]);

  const popularCryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
  ];

  const timeframes = [
    { value: '1d', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '90d', label: '90d' },
    { value: '1y', label: '1a' }
  ];

  useEffect(() => {
    loadCryptoData();
    loadMarketData();
    loadTechnicalIndicators();
    loadNews();
  }, [selectedCrypto, timeframe]);

  const loadCryptoData = async () => {
    setLoading(true);
    try {
      const data = await cryptoService.getCryptoInfo(selectedCrypto);
      setCryptoData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da cripto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketData = async () => {
    try {
      const data = await cryptoService.getBinanceMarketData(selectedCrypto.toUpperCase() + 'USDT');
      setMarketData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de mercado:', error);
    }
  };

  const loadTechnicalIndicators = async () => {
    try {
      const historicalData = await cryptoService.getHistoricalData(selectedCrypto, timeframe === '1d' ? 1 : parseInt(timeframe), 'usd');
      
      // Calcular indicadores técnicos
      const indicators = calculateTechnicalIndicators(historicalData);
      setTechnicalIndicators(indicators);
    } catch (error) {
      console.error('Erro ao carregar indicadores técnicos:', error);
    }
  };

  const loadNews = async () => {
    // Simular notícias do mercado
    const mockNews = [
      {
        id: 1,
        title: 'Bitcoin atinge nova máxima histórica',
        summary: 'A principal criptomoeda superou a marca de $70.000 pela primeira vez',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Ethereum 2.0: Atualização importante',
        summary: 'Nova versão traz melhorias significativas na escalabilidade',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Regulamentação de criptomoedas',
        summary: 'Novas diretrizes podem impactar o mercado global',
        sentiment: 'neutral',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    setNews(mockNews);
  };

  const calculateTechnicalIndicators = (data) => {
    if (!data || !data.prices || data.prices.length < 2) return {};

    const prices = data.prices.map(p => p[1]);
    const volumes = data.total_volumes?.map(v => v[1]) || [];

    // Média Móvel Simples (SMA) - 20 períodos
    const sma20 = prices.length >= 20 ? 
      prices.slice(-20).reduce((sum, price) => sum + price, 0) / 20 : null;

    // Média Móvel Simples (SMA) - 50 períodos
    const sma50 = prices.length >= 50 ? 
      prices.slice(-50).reduce((sum, price) => sum + price, 0) / 50 : null;

    // RSI (Relative Strength Index)
    const rsi = calculateRSI(prices, 14);

    // MACD
    const macd = calculateMACD(prices);

    // Bollinger Bands
    const bollingerBands = calculateBollingerBands(prices, 20, 2);

    // Volume médio
    const avgVolume = volumes.length > 0 ? 
      volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length : null;

    return {
      sma20,
      sma50,
      rsi,
      macd,
      bollingerBands,
      avgVolume,
      currentPrice: prices[prices.length - 1],
      priceChange: prices[prices.length - 1] - prices[0],
      priceChangePercent: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
    };
  };

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  };

  const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    if (prices.length < slowPeriod) return null;

    const ema12 = calculateEMA(prices, fastPeriod);
    const ema26 = calculateEMA(prices, slowPeriod);
    const macdLine = ema12 - ema26;
    const signalLine = calculateEMA([...Array(slowPeriod - fastPeriod).fill(0), macdLine], signalPeriod);
    const histogram = macdLine - signalLine;

    return { macdLine, signalLine, histogram };
  };

  const calculateEMA = (prices, period) => {
    if (prices.length < period) return null;

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  };

  const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
    if (prices.length < period) return null;

    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((sum, price) => sum + price, 0) / period;
    
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + (stdDev * standardDeviation),
      middle: sma,
      lower: sma - (stdDev * standardDeviation)
    };
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRSIColor = (rsi) => {
    if (rsi >= 70) return 'text-red-600';
    if (rsi <= 30) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getRSIStatus = (rsi) => {
    if (rsi >= 70) return 'Sobrecomprado';
    if (rsi <= 30) return 'Sobrevendido';
    return 'Neutro';
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatNumber = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Análise de Mercado
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Análise técnica e fundamental completa para suas decisões de investimento
        </p>
      </div>

      {/* Controles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Seleção de Criptomoeda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criptomoeda
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {popularCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.icon} {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div className="sm:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botão Atualizar */}
          <div className="sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={loadCryptoData}
              className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {cryptoData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo da Cripto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{popularCryptos.find(c => c.id === selectedCrypto)?.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {cryptoData.name} ({cryptoData.symbol?.toUpperCase()})
                    </h3>
                    <p className="text-gray-600">Rank #{cryptoData.market_cap_rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(cryptoData.market_data?.current_price?.usd)}
                  </div>
                  <div className={`text-sm ${
                    technicalIndicators.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(technicalIndicators.priceChangePercent)}
                  </div>
                </div>
              </div>

              {/* Estatísticas de Mercado */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Market Cap</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(cryptoData.market_data?.market_cap?.usd)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Volume 24h</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(cryptoData.market_data?.total_volume?.usd)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Circulating Supply</div>
                  <div className="font-semibold text-gray-900">
                    {formatNumber(cryptoData.market_data?.circulating_supply)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Max Supply</div>
                  <div className="font-semibold text-gray-900">
                    {cryptoData.market_data?.max_supply ? 
                      formatNumber(cryptoData.market_data.max_supply) : '∞'}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores Técnicos */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Indicadores Técnicos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RSI */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">RSI (14)</span>
                    <span className={`font-semibold ${getRSIColor(technicalIndicators.rsi)}`}>
                      {technicalIndicators.rsi ? technicalIndicators.rsi.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        technicalIndicators.rsi >= 70 ? 'bg-red-500' :
                        technicalIndicators.rsi <= 30 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, technicalIndicators.rsi || 0))}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {getRSIStatus(technicalIndicators.rsi)}
                  </div>
                </div>

                {/* MACD */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">MACD</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Linha MACD:</span>
                      <span className="font-mono">
                        {technicalIndicators.macd?.macdLine ? 
                          technicalIndicators.macd.macdLine.toFixed(4) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Linha Sinal:</span>
                      <span className="font-mono">
                        {technicalIndicators.macd?.signalLine ? 
                          technicalIndicators.macd.signalLine.toFixed(4) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Histograma:</span>
                      <span className="font-mono">
                        {technicalIndicators.macd?.histogram ? 
                          technicalIndicators.macd.histogram.toFixed(4) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Médias Móveis */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Médias Móveis</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>SMA (20):</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.sma20)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SMA (50):</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.sma50)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Preço Atual:</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.currentPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bollinger Bands */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Bollinger Bands</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Banda Superior:</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.bollingerBands?.upper)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Média:</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.bollingerBands?.middle)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Banda Inferior:</span>
                      <span className="font-mono">
                        {formatCurrency(technicalIndicators.bollingerBands?.lower)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados de Mercado Binance */}
            {marketData.symbol && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados de Mercado (Binance)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Volume 24h</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(marketData.volume)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Variação 24h</div>
                    <div className={`font-semibold ${
                      marketData.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(marketData.priceChangePercent)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Preço Máximo</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(marketData.highPrice)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Preço Mínimo</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(marketData.lowPrice)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notícias do Mercado */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notícias do Mercado
              </h3>
              
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-start space-x-2">
                      {getSentimentIcon(item.sentiment)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getSentimentColor(item.sentiment)}`}>
                            {item.sentiment === 'positive' ? 'Positivo' :
                             item.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações da Cripto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sobre {cryptoData.name}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {cryptoData.categories?.join(', ') || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Descrição:</span>
                  <p className="text-sm text-gray-900 line-clamp-3">
                    {cryptoData.description?.en || 'Descrição não disponível'}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Links:</span>
                  <div className="flex space-x-2 mt-1">
                    {cryptoData.links?.homepage?.[0] && (
                      <a
                        href={cryptoData.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        Website
                      </a>
                    )}
                    {cryptoData.links?.blockchain_site?.[0] && (
                      <a
                        href={cryptoData.links.blockchain_site[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        Blockchain
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;
