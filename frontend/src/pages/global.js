import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Package, Truck, DollarSign, BarChart3, 
  TrendingUp, TrendingDown, Globe, Activity, Shield,
  Clock, MapPin, Star, MessageSquare, ShoppingCart,
  Coins, Bot, Database, Server, Wifi, AlertTriangle,
  CheckCircle, Eye, Download, RefreshCw, Filter
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GlobalPage = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({});
  const [userActivity, setUserActivity] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [activeRegions, setActiveRegions] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);

  const timeRanges = [
    { id: '24h', label: '24 Horas', value: '24h' },
    { id: '7d', label: '7 Dias', value: '7d' },
    { id: '30d', label: '30 Dias', value: '30d' },
    { id: '90d', label: '90 Dias', value: '90d' },
    { id: '1y', label: '1 Ano', value: '1y' }
  ];

  useEffect(() => {
    document.title = 'Dashboard Global - AgroSync';
    loadGlobalData();
    startRealTimeUpdates();
  }, [timeRange]);

  const loadGlobalData = useCallback(async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Estatísticas globais
      setGlobalStats({
        totalUsers: 15420,
        activeUsers: 8923,
        totalProducts: 45623,
        totalFreights: 12345,
        totalTransactions: 89234,
        totalRevenue: 15420000,
        platformUptime: 99.97,
        averageResponseTime: 120,
        totalMessages: 234567,
        totalCryptoTransactions: 5678,
        totalNFTs: 1234,
        chatbotInteractions: 45678
      });

      // Atividade de usuários
      setUserActivity([
        { date: '2024-01-15', newUsers: 45, activeUsers: 8923, transactions: 234 },
        { date: '2024-01-14', newUsers: 38, activeUsers: 8845, transactions: 198 },
        { date: '2024-01-13', newUsers: 52, activeUsers: 8767, transactions: 267 },
        { date: '2024-01-12', newUsers: 41, activeUsers: 8698, transactions: 189 },
        { date: '2024-01-11', newUsers: 47, activeUsers: 8623, transactions: 245 },
        { date: '2024-01-10', newUsers: 39, activeUsers: 8541, transactions: 178 },
        { date: '2024-01-09', newUsers: 44, activeUsers: 8476, transactions: 223 }
      ]);

      // Métricas do sistema
      setSystemMetrics({
        cpuUsage: 23.4,
        memoryUsage: 67.8,
        diskUsage: 45.2,
        networkTraffic: 89.1,
        databaseConnections: 156,
        apiRequests: 2340000,
        errorRate: 0.12,
        securityAlerts: 3,
        backupStatus: 'success',
        lastMaintenance: '2024-01-10 02:00'
      });

      // Transações recentes
      setRecentTransactions([
        { id: 1, type: 'product', user: 'João Silva', amount: 1250.00, status: 'completed', time: '10:30' },
        { id: 2, type: 'freight', user: 'Maria Santos', amount: 850.00, status: 'pending', time: '10:25' },
        { id: 3, type: 'crypto', user: 'Pedro Costa', amount: 0.05, status: 'completed', time: '10:20' },
        { id: 4, type: 'product', user: 'Ana Oliveira', amount: 3200.00, status: 'processing', time: '10:15' },
        { id: 5, type: 'freight', user: 'Carlos Lima', amount: 1200.00, status: 'completed', time: '10:10' }
      ]);

      // Produtos mais populares
      setTopProducts([
        { id: 1, name: 'Soja Premium', category: 'Grãos', views: 15420, favorites: 2340, sales: 156 },
        { id: 2, name: 'Fertilizante NPK', category: 'Insumos', views: 12340, favorites: 1890, sales: 98 },
        { id: 3, name: 'Trator Massey Ferguson', category: 'Maquinários', views: 9870, favorites: 1450, sales: 23 },
        { id: 4, name: 'Sementes de Milho', category: 'Sementes', views: 8760, favorites: 1230, sales: 87 },
        { id: 5, name: 'Defensivo Agrícola', category: 'Defensivos', views: 7650, favorites: 980, sales: 45 }
      ]);

      // Regiões mais ativas
      setActiveRegions([
        { region: 'Mato Grosso', users: 3456, products: 12340, transactions: 23450, growth: 12.5 },
        { region: 'Paraná', users: 2987, products: 10980, transactions: 19870, growth: 8.9 },
        { region: 'Rio Grande do Sul', users: 2678, products: 9870, transactions: 17650, growth: 15.2 },
        { region: 'Goiás', users: 2345, products: 8760, transactions: 15430, growth: 11.8 },
        { region: 'Mato Grosso do Sul', users: 1987, products: 7650, transactions: 13450, growth: 9.6 }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados globais:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      // Atualizar métricas em tempo real
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.random() * 30 + 15,
        memoryUsage: Math.random() * 20 + 60,
        networkTraffic: Math.random() * 20 + 80,
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4" />;
      case 'freight': return <Truck className="w-4 h-4" />;
      case 'crypto': return <Coins className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-agro-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Global AgroSync</h1>
              <p className="text-gray-600 mt-2">Visão geral completa da plataforma e métricas de performance</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              
              <button
                onClick={loadGlobalData}
                className="flex items-center space-x-2 px-4 py-2 bg-agro-green text-white rounded-lg hover:bg-agro-green-dark transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estatísticas Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              icon: Users, 
              label: 'Usuários Ativos', 
              value: formatNumber(globalStats.activeUsers), 
              change: '+12.5%', 
              color: 'blue',
              bg: 'bg-blue-50',
              text: 'text-blue-600'
            },
            { 
              icon: Package, 
              label: 'Produtos', 
              value: formatNumber(globalStats.totalProducts), 
              change: '+8.9%', 
              color: 'green',
              bg: 'bg-green-50',
              text: 'text-green-600'
            },
            { 
              icon: DollarSign, 
              label: 'Receita Total', 
              value: formatCurrency(globalStats.totalRevenue), 
              change: '+15.2%', 
              color: 'emerald',
              bg: 'bg-emerald-50',
              text: 'text-emerald-600'
            },
            { 
              icon: Activity, 
              label: 'Uptime', 
              value: `${globalStats.platformUptime}%`, 
              change: '+0.03%', 
              color: 'purple',
              bg: 'bg-purple-50',
              text: 'text-purple-600'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className={`${stat.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-8 h-8 ${stat.text}`} />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Métricas do Sistema */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Server className="w-5 h-5 mr-2 text-blue-600" />
                Métricas do Sistema
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">CPU</span>
                    <span className="font-medium">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Memória</span>
                    <span className="font-medium">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Disco</span>
                    <span className="font-medium">{systemMetrics.diskUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Rede</span>
                    <span className="font-medium">{systemMetrics.networkTraffic.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.networkTraffic}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Conexões DB:</span>
                    <span className="font-medium ml-2">{systemMetrics.databaseConnections}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Taxa de Erro:</span>
                    <span className="font-medium ml-2">{systemMetrics.errorRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Alertas:</span>
                    <span className="font-medium ml-2">{systemMetrics.securityAlerts}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Backup:</span>
                    <span className={`font-medium ml-2 ${systemMetrics.backupStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {systemMetrics.backupStatus === 'success' ? 'OK' : 'Erro'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Transações Recentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Transações Recentes
              </h3>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.user}</p>
                        <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {transaction.type === 'crypto' ? `${transaction.amount} BTC` : formatCurrency(transaction.amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Concluído' : 
                         transaction.status === 'pending' ? 'Pendente' : 
                         transaction.status === 'processing' ? 'Processando' : 'Falhou'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {transaction.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Produtos Mais Populares */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Produtos Mais Populares
            </h3>
            
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-agro-green text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm">
                    <p className="text-gray-900">{formatNumber(product.views)} visualizações</p>
                    <p className="text-gray-600">{product.favorites} favoritos</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Regiões Mais Ativas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Regiões Mais Ativas
            </h3>
            
            <div className="space-y-3">
              {activeRegions.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-agro-green text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{region.region}</p>
                      <p className="text-sm text-gray-600">{formatNumber(region.users)} usuários</p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm">
                    <p className="text-gray-900">{formatNumber(region.products)} produtos</p>
                    <p className="text-green-600">+{region.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Atividade de Usuários */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Atividade de Usuários (Últimos 7 Dias)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Novos Usuários</h4>
              <div className="space-y-2">
                {userActivity.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    <span className="font-medium text-blue-600">{day.newUsers}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Usuários Ativos</h4>
              <div className="space-y-2">
                {userActivity.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    <span className="font-medium text-green-600">{formatNumber(day.activeUsers)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Transações</h4>
              <div className="space-y-2">
                {userActivity.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    <span className="font-medium text-purple-600">{day.transactions}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalPage;
