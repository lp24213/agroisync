import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Coins, Wallet, BarChart3,
  RefreshCw, Star, Zap, Shield, Globe, Activity
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const CryptoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Coins },
    { id: 'portfolio', label: 'Portfólio', icon: Wallet },
    { id: 'market', label: 'Mercado', icon: BarChart3 },
    { id: 'watchlist', label: 'Favoritos', icon: Star },
    { id: 'activity', label: 'Atividade', icon: Activity }
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Carregar dados em paralelo
      const [marketDataResult, portfolioResult, transactionsResult] = await Promise.all([
        cryptoService.getCryptoPrices(['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']),
        cryptoService.getUserPortfolio(),
        cryptoService.getTransactionHistory()
      ]);

      setMarketData(marketDataResult.prices || {});
      setPortfolio(portfolioResult.portfolio || {});
      setRecentTransactions(transactionsResult.transactions || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPriceChangeColor = (change) => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPriceChangeIcon = (change) => {
    if (!change) return null;
    return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Valor Total</p>
              <p className="text-2xl font-bold">
                {portfolio.totalValue ? formatCurrency(portfolio.totalValue) : 'R$ 0,00'}
              </p>
            </div>
            <Coins className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">24h %</p>
              <p className="text-2xl font-bold">
                {portfolio.totalChange24h ? formatPercentage(portfolio.totalChange24h) : '0.00%'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Ativos</p>
              <p className="text-2xl font-bold">
                {portfolio.assets ? portfolio.assets.length : 0}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Transações</p>
              <p className="text-2xl font-bold">
                {recentTransactions.length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Top Criptomoedas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Criptomoedas
          </h3>
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(marketData).map(([cryptoId, data]) => (
            <motion.div
              key={cryptoId}
              whileHover={{ backgroundColor: '#f8fafc' }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getCryptoIcon(cryptoId)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {cryptoId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data.brl ? formatCurrency(data.brl) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${getPriceChangeColor(data.change24h)}`}>
                  {getPriceChangeIcon(data.change24h)}
                  <span className="font-medium">
                    {formatPercentage(data.change24h)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.usd ? `$${data.usd.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição do Portfólio
        </h3>
        
        {portfolio.assets && portfolio.assets.length > 0 ? (
          <div className="space-y-4">
            {portfolio.assets.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {asset.symbol}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {asset.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {asset.amount} {asset.symbol}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(asset.value)}
                  </p>
                  <div className={`flex items-center space-x-1 ${getPriceChangeColor(asset.change24h)}`}>
                    {getPriceChangeIcon(asset.change24h)}
                    <span className="text-sm">
                      {formatPercentage(asset.change24h)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {asset.allocation.toFixed(1)}% do portfólio
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum ativo no portfólio ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análise de Mercado
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Indicadores Técnicos
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">RSI (14)</span>
                <span className="font-medium">65.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">MACD</span>
                <span className="font-medium text-green-600">+0.0023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Média Móvel (50)</span>
                <span className="font-medium">$48,250</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Estatísticas
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Volume 24h</span>
                <span className="font-medium">$2.4B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cap. de Mercado</span>
                <span className="font-medium">$950B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dominância</span>
                <span className="font-medium">48.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWatchlist = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lista de Favoritos
          </h3>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <Star className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Adicione criptomoedas aos seus favoritos para acompanhar mais de perto
          </p>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Atividade Recente
        </h3>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((tx) => (
              <motion.div
                key={tx.id}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'BUY' ? 'bg-green-100 text-green-600' :
                    tx.type === 'SELL' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {tx.type === 'BUY' ? <TrendingUp className="w-4 h-4" /> :
                     tx.type === 'SELL' ? <TrendingDown className="w-4 h-4" /> :
                     <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {tx.type} {tx.symbol}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tx.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tx.amount} {tx.symbol}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tx.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma transação recente
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const getCryptoIcon = (cryptoId) => {
    const icons = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      binancecoin: '🟡',
      cardano: '₳',
      solana: '◎'
    };
    return icons[cryptoId] || cryptoId.toUpperCase().charAt(0);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'portfolio':
        return renderPortfolio();
      case 'market':
        return renderMarket();
      case 'watchlist':
        return renderWatchlist();
      case 'activity':
        return renderActivity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Criptomoedas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe seus investimentos e o mercado em tempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CryptoDashboard;
