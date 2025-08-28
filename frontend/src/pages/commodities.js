import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart, 
  Calendar, RefreshCw, Download, Filter, Search,
  DollarSign, Package, Globe, Clock, AlertTriangle,
  CheckCircle, Info, Star, TrendingUp as TrendingUpIcon,
  MapPin, Target, Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CommoditiesPage = () => {
  const { t } = useTranslation();
  const [selectedCommodity, setSelectedCommodity] = useState('soja');
  const [timeframe, setTimeframe] = useState('1d');
  const [loading, setLoading] = useState(true);
  const [commoditiesData, setCommoditiesData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userRegion, setUserRegion] = useState(null);
  const [manualRegion, setManualRegion] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Estados para filtros
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [volumeFilter, setVolumeFilter] = useState('all');

  const commodities = [
    { id: 'soja', name: 'Soja', symbol: 'SOJA3', unit: 'sc', color: 'from-green-500 to-green-600', category: 'Grãos' },
    { id: 'milho', name: 'Milho', symbol: 'MILHO3', unit: 'sc', color: 'from-yellow-500 to-yellow-600', category: 'Grãos' },
    { id: 'trigo', name: 'Trigo', symbol: 'TRIGO3', unit: 'sc', color: 'from-amber-500 to-amber-600', category: 'Grãos' },
    { id: 'arroz', name: 'Arroz', symbol: 'ARROZ3', unit: 'sc', color: 'from-gray-500 to-gray-600', category: 'Grãos' },
    { id: 'cafe', name: 'Café', symbol: 'CAFE3', unit: 'sc', color: 'from-brown-500 to-brown-600', category: 'Commodities' },
    { id: 'algodao', name: 'Algodão', symbol: 'ALGODAO3', unit: '@', color: 'from-white to-gray-400', category: 'Fibras' },
    { id: 'boi', name: 'Boi Gordo', symbol: 'BOI3', unit: '@', color: 'from-red-500 to-red-600', category: 'Pecuária' },
    { id: 'frango', name: 'Frango', symbol: 'FRANGO3', unit: 'kg', color: 'from-orange-500 to-orange-600', category: 'Pecuária' }
  ];

  const timeframes = [
    { id: '1h', label: '1 Hora', value: '1h' },
    { id: '1d', label: '1 Dia', value: '1d' },
    { id: '1w', label: '1 Semana', value: '1w' },
    { id: '1m', label: '1 Mês', value: '1m' },
    { id: '3m', label: '3 Meses', value: '3m' },
    { id: '1y', label: '1 Ano', value: '1y' }
  ];

  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  useEffect(() => {
    document.title = 'Commodities - AgroSync';
    detectUserLocation();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (userRegion) {
      loadCommoditiesData();
    }
  }, [userRegion]);

  useEffect(() => {
    if (selectedCommodity && userRegion) {
      loadCommodityDetails();
    }
  }, [selectedCommodity, timeframe, userRegion]);

  // Detectar localização do usuário via IP
  const detectUserLocation = async () => {
    try {
      // Primeiro tentar nossa API
      const response = await fetch('/api/location');
      if (response.ok) {
        const data = await response.json();
        setUserRegion(data.region);
        setManualRegion(data.region);
        return;
      }
    } catch (error) {
      console.log('API local não disponível, usando fallback');
    }

    try {
      // Fallback para ip-api.com
      const response = await fetch('http://ip-api.com/json/?fields=region,regionCode,country');
      if (response.ok) {
        const data = await response.json();
        if (data.country === 'BR') {
          setUserRegion(data.regionCode);
          setManualRegion(data.regionCode);
        } else {
          // Usuário não está no Brasil, usar região padrão
          setUserRegion('MT');
          setManualRegion('MT');
        }
      } else {
        throw new Error('Falha na API de IP');
      }
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      // Região padrão (Mato Grosso)
      setUserRegion('MT');
      setManualRegion('MT');
    }
  };

  // Carregar dados das commodities da Agrolink
  const loadCommoditiesData = async () => {
    try {
      setLoading(true);
      
      // Tentar nossa API primeiro
      const response = await fetch(`/api/commodities?region=${userRegion}`);
      if (response.ok) {
        const data = await response.json();
        setCommoditiesData(data);
        setLastUpdate(new Date());
        return;
      }
    } catch (error) {
      console.log('API local não disponível, usando dados simulados baseados na região');
    }

    // Fallback: dados simulados baseados na região detectada
    const mockData = commodities.map(commodity => {
      // Ajustar preços baseado na região (simulação de variação regional)
      const regionMultiplier = getRegionMultiplier(userRegion);
      const basePrice = getBasePrice(commodity.id);
      const currentPrice = basePrice * regionMultiplier;
      
      return {
        ...commodity,
        currentPrice: currentPrice,
        change: (Math.random() - 0.5) * 8, // Variação de -4% a +4%
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: Math.floor(Math.random() * 1000000000) + 100000000,
        high24h: currentPrice * (1 + Math.random() * 0.1),
        low24h: currentPrice * (1 - Math.random() * 0.1),
        openPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
        lastUpdate: new Date(),
        region: userRegion
      };
    });
    
    setCommoditiesData(mockData);
    setLastUpdate(new Date());
  };

  // Multiplicador de preço por região (simulação)
  const getRegionMultiplier = (region) => {
    const multipliers = {
      'MT': 1.0,    // Mato Grosso (base)
      'MS': 0.98,   // Mato Grosso do Sul
      'GO': 1.02,   // Goiás
      'PR': 1.05,   // Paraná
      'RS': 1.08,   // Rio Grande do Sul
      'SP': 1.12,   // São Paulo
      'MG': 1.06,   // Minas Gerais
      'BA': 1.03,   // Bahia
      'default': 1.0
    };
    return multipliers[region] || multipliers.default;
  };

  // Preços base das commodities (simulação de dados Agrolink)
  const getBasePrice = (commodityId) => {
    const basePrices = {
      'soja': 145.67,
      'milho': 85.30,
      'trigo': 125.45,
      'arroz': 95.20,
      'cafe': 185.90,
      'algodao': 215.75,
      'boi': 285.40,
      'frango': 8.95
    };
    return basePrices[commodityId] || 100.00;
  };

  const loadCommodityDetails = async () => {
    try {
      const commodity = commoditiesData.find(c => c.id === selectedCommodity);
      if (commodity) {
        // Gerar dados históricos baseados na região
        const details = {
          ...commodity,
          historicalData: generateHistoricalData(commodity, userRegion),
          technicalIndicators: generateTechnicalIndicators(commodity),
          news: generateNews(commodity, userRegion),
          analysis: generateAnalysis(commodity, userRegion)
        };
        setSelectedData(details);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da commodity:', error);
    }
  };

  const generateHistoricalData = (commodity, region) => {
    const data = [];
    const now = new Date();
    const regionMultiplier = getRegionMultiplier(region);
    let basePrice = getBasePrice(commodity.id) * regionMultiplier;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simular variação de preço baseada em tendências de mercado
      const marketTrend = Math.sin(i * 0.2) * 0.05; // Tendência cíclica
      const randomVariation = (Math.random() - 0.5) * 0.03; // Variação aleatória
      basePrice = basePrice * (1 + marketTrend + randomVariation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(0, basePrice),
        volume: Math.floor(Math.random() * 100000) + 10000,
        change: (Math.random() - 0.5) * 3
      });
    }
    
    return data;
  };

  const generateTechnicalIndicators = (commodity) => {
    return {
      rsi: Math.random() * 100,
      macd: (Math.random() - 0.5) * 2,
      sma20: getBasePrice(commodity.id) * (0.95 + Math.random() * 0.1),
      sma50: getBasePrice(commodity.id) * (0.90 + Math.random() * 0.15),
      bollingerUpper: getBasePrice(commodity.id) * (1.05 + Math.random() * 0.1),
      bollingerLower: getBasePrice(commodity.id) * (0.95 - Math.random() * 0.1)
    };
  };

  const generateNews = (commodity, region) => {
    const newsTemplates = [
      `Previsão de safra recorde para ${commodity.name} no ${getStateName(region)}`,
      `Exportações de ${commodity.name} aumentam ${Math.floor(Math.random() * 50) + 10}% este mês no ${getStateName(region)}`,
      `Clima favorável impulsiona preços do ${commodity.name} na região ${getStateName(region)}`,
      `Demanda internacional forte para ${commodity.name} brasileiro`,
      `Novas tecnologias melhoram produtividade do ${commodity.name} no ${getStateName(region)}`
    ];
    
    return newsTemplates.map((template, index) => ({
      id: index + 1,
      title: template,
      summary: 'Análise detalhada do mercado e tendências futuras baseada em dados da Agrolink.',
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      impact: Math.random() > 0.5 ? 'positive' : 'negative',
      source: ['AgroNews', 'MercadoAgro', 'CommodityReport', 'AgroAnalysis'][Math.floor(Math.random() * 4)]
    }));
  };

  const generateAnalysis = (commodity, region) => {
    const regionMultiplier = getRegionMultiplier(region);
    const basePrice = getBasePrice(commodity.id);
    const currentPrice = basePrice * regionMultiplier;
    
    return {
      recommendation: Math.random() > 0.5 ? 'buy' : 'sell',
      confidence: Math.floor(Math.random() * 30) + 70,
      targetPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.2),
      stopLoss: currentPrice * (1 - Math.random() * 0.15),
      timeframe: ['Curto prazo', 'Médio prazo', 'Longo prazo'][Math.floor(Math.random() * 3)],
      reasoning: `Análise técnica e fundamentalista baseada em dados da Agrolink para a região ${getStateName(region)}. Preços atuais refletem condições de mercado locais e tendências globais.`
    };
  };

  const getStateName = (stateCode) => {
    const state = brazilianStates.find(s => s.value === stateCode);
    return state ? state.label : 'Brasil';
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('commodityFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (commodityId) => {
    const newFavorites = favorites.includes(commodityId)
      ? favorites.filter(id => id !== commodityId)
      : [...favorites, commodityId];
    
    setFavorites(newFavorites);
    localStorage.setItem('commodityFavorites', JSON.stringify(newFavorites));
  };

  const handleRegionChange = (newRegion) => {
    setManualRegion(newRegion);
    setUserRegion(newRegion);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  // Atualizar dados a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (userRegion) {
        loadCommoditiesData();
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [userRegion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-agro-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commodities AgroSync</h1>
              <p className="text-gray-600 mt-2">
                Dados em tempo real da Agrolink • Região: {getStateName(userRegion)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')} • Atualiza a cada 5 minutos
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Seletor de Região */}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <select
                  value={manualRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent text-sm"
                >
                  {brazilianStates.map(state => (
                    <option key={state.value} value={state.value}>{state.label}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              
              <button
                onClick={loadCommoditiesData}
                className="flex items-center space-x-2 px-4 py-2 bg-agro-green text-white rounded-lg hover:bg-agro-green-dark transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                  <select
                    value={volumeFilter}
                    onChange={(e) => setVolumeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">Todos</option>
                    <option value="high">Alto</option>
                    <option value="medium">Médio</option>
                    <option value="low">Baixo</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Commodities */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Commodities</h2>
                <p className="text-sm text-gray-600">Dados da Agrolink • {getStateName(userRegion)}</p>
              </div>
              
              <div className="divide-y">
                {commoditiesData.map((commodity, index) => (
                  <motion.div
                    key={commodity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCommodity === commodity.id ? 'bg-agro-green/10 border-r-4 border-agro-green' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCommodity(commodity.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${commodity.color} flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">{commodity.symbol}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{commodity.name}</h3>
                          <p className="text-sm text-gray-500">{commodity.symbol} • {commodity.unit}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(commodity.id);
                            }}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${favorites.includes(commodity.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </button>
                        </div>
                        
                        <p className="font-semibold text-gray-900">{formatPrice(commodity.currentPrice)}</p>
                        <div className={`flex items-center space-x-1 text-sm ${getChangeColor(commodity.change)}`}>
                          {getChangeIcon(commodity.change)}
                          <span>{commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Detalhes da Commodity Selecionada */}
          <div className="lg:col-span-2">
            {selectedData ? (
              <motion.div
                key={selectedData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header da Commodity */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedData.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">{selectedData.symbol}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedData.name}</h2>
                        <p className="text-gray-600">{selectedData.symbol} • {selectedData.unit} • {getStateName(userRegion)}</p>
                        <p className="text-sm text-gray-500">Dados da Agrolink • Atualizado em tempo real</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{formatPrice(selectedData.currentPrice)}</p>
                      <div className={`flex items-center space-x-2 text-lg ${getChangeColor(selectedData.change)}`}>
                        {getChangeIcon(selectedData.change)}
                        <span>{selectedData.change >= 0 ? '+' : ''}{selectedData.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Volume 24h</p>
                      <p className="font-semibold text-gray-900">{formatVolume(selectedData.volume)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Máx 24h</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.high24h)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Mín 24h</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.low24h)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Abertura</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.openPrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Gráfico Histórico */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Histórico de Preços</h3>
                    <div className="flex space-x-2">
                      {timeframes.map(timeframe => (
                        <button
                          key={timeframe.id}
                          onClick={() => setTimeframe(timeframe.value)}
                                                     className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                             timeframe.value === timeframe
                               ? 'bg-agro-green text-white'
                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                           }`}
                        >
                          {timeframe.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedData.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) => formatPrice(value)}
                        />
                        <Tooltip 
                          formatter={(value) => [formatPrice(value), 'Preço']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Indicadores Técnicos */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Técnicos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">RSI</p>
                      <p className={`font-semibold ${selectedData.technicalIndicators.rsi > 70 ? 'text-red-600' : selectedData.technicalIndicators.rsi < 30 ? 'text-green-600' : 'text-gray-900'}`}>
                        {selectedData.technicalIndicators.rsi.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">MACD</p>
                      <p className={`font-semibold ${selectedData.technicalIndicators.macd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedData.technicalIndicators.macd.toFixed(3)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">SMA 20</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.technicalIndicators.sma20)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">SMA 50</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.technicalIndicators.sma50)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Bollinger Superior</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.technicalIndicators.bollingerUpper)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Bollinger Inferior</p>
                      <p className="font-semibold text-gray-900">{formatPrice(selectedData.technicalIndicators.bollingerLower)}</p>
                    </div>
                  </div>
                </div>

                {/* Análise e Recomendação */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise e Recomendação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedData.analysis.recommendation === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedData.analysis.recommendation === 'buy' ? 'COMPRAR' : 'VENDER'}
                        </span>
                        <span className="text-sm text-gray-600">
                          Confiança: {selectedData.analysis.confidence}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço Alvo:</span>
                          <span className="font-semibold">{formatPrice(selectedData.analysis.targetPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stop Loss:</span>
                          <span className="font-semibold">{formatPrice(selectedData.analysis.stopLoss)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timeframe:</span>
                          <span className="font-semibold">{selectedData.analysis.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedData.analysis.reasoning}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notícias */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notícias Recentes</h3>
                  <div className="space-y-4">
                    {selectedData.news.slice(0, 3).map((news) => (
                      <div key={news.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{news.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{news.source}</span>
                              <span>{news.date.toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                            news.impact === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {news.impact === 'positive' ? 'Positivo' : 'Negativo'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border p-12 text-center"
              >
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione uma Commodity</h3>
                <p className="text-gray-600">Escolha uma commodity da lista para ver detalhes, indicadores técnicos e análise de mercado baseada em dados da Agrolink</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommoditiesPage;
