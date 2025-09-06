import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, Plus, TrendingUp, DollarSign, 
  MessageSquare, Bell, Settings, LogOut,
  Eye, Edit, Trash, BarChart3,
  Users, ShoppingCart, Calendar, MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SellerPanel = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      setProducts([
        {
          id: 'PROD-001',
          name: 'Soja Premium',
          price: 1200,
          stock: 500,
          status: 'active',
          views: 1250,
          orders: 45,
          rating: 4.8,
          image: '/images/soja.jpg'
        },
        {
          id: 'PROD-002',
          name: 'Milho Orgânico',
          price: 850,
          stock: 300,
          status: 'active',
          views: 890,
          orders: 23,
          rating: 4.6,
          image: '/images/milho.jpg'
        }
      ]);

      setOrders([
        {
          id: 'ORD-001',
          product: 'Soja Premium',
          buyer: 'João Silva',
          amount: 15000,
          status: 'pending',
          date: '2024-01-15',
          quantity: 12.5
        },
        {
          id: 'ORD-002',
          product: 'Milho Orgânico',
          buyer: 'Maria Santos',
          amount: 8500,
          status: 'confirmed',
          date: '2024-01-14',
          quantity: 10
        }
      ]);

      setAnalytics({
        totalRevenue: 125000,
        totalOrders: 68,
        totalProducts: 12,
        conversionRate: 3.6,
        monthlyGrowth: 15.2
      });

      setNotifications([
        {
          id: 'NOT-001',
          type: 'new_order',
          message: 'Novo pedido recebido: ORD-001',
          date: '2024-01-15T10:30:00Z',
          read: false
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'products', label: t('sellerPanel.products', 'Produtos'), icon: Package },
    { id: 'orders', label: t('sellerPanel.orders', 'Pedidos'), icon: ShoppingCart },
    { id: 'analytics', label: t('sellerPanel.analytics', 'Analytics'), icon: BarChart3 },
    { id: 'messages', label: t('sellerPanel.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'notifications', label: t('sellerPanel.notifications', 'Notificações'), icon: Bell },
    { id: 'settings', label: t('sellerPanel.settings', 'Configurações'), icon: Settings }
  ];

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {t('sellerPanel.myProducts', 'Meus Produtos')}
        </h3>
        <Link
          to="/cadastro-produto"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('sellerPanel.addProduct', 'Adicionar Produto')}
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(product.price)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {product.stock} {t('sellerPanel.units', 'unidades')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {product.views} {t('sellerPanel.views', 'visualizações')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {t(`productStatus.${product.status}`, product.status)}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {product.orders} {t('sellerPanel.orders', 'pedidos')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-red-600 transition-colors">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('sellerPanel.receivedOrders', 'Pedidos Recebidos')}
      </h3>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.product}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {t(`orderStatus.${order.status}`, order.status)}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                  {t('sellerPanel.buyer', 'Comprador')}: {order.buyer}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(order.amount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {order.quantity} {t('sellerPanel.tons', 'toneladas')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/messages?order=${order.id}`}
                  className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                  title={t('sellerPanel.contactBuyer', 'Contatar Comprador')}
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <button
                  className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                >
                  {t('sellerPanel.confirm', 'Confirmar')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('sellerPanel.analytics', 'Analytics')}
      </h3>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('sellerPanel.totalRevenue', 'Receita Total')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(analytics.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('sellerPanel.totalOrders', 'Total de Pedidos')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.totalOrders}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('sellerPanel.totalProducts', 'Produtos Ativos')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.totalProducts}
              </p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('sellerPanel.conversionRate', 'Taxa de Conversão')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.conversionRate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gráfico de crescimento */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('sellerPanel.monthlyGrowth', 'Crescimento Mensal')}
        </h4>
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <p className="text-3xl font-bold text-emerald-600">
            +{analytics.monthlyGrowth}%
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {t('sellerPanel.growthDescription', 'Crescimento em relação ao mês anterior')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'analytics':
        return renderAnalytics();
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('sellerPanel.noMessages', 'Nenhuma mensagem')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('sellerPanel.noMessagesDesc', 'Suas conversas com compradores aparecerão aqui')}
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {t('sellerPanel.notifications', 'Notificações')}
            </h3>
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-slate-800 dark:text-slate-200">{notification.message}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {new Date(notification.date).toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {t('sellerPanel.settings', 'Configurações')}
            </h3>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('sellerPanel.accountSettings', 'Configurações da Conta')}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('sellerPanel.email', 'Email')}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('sellerPanel.name', 'Nome')}
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('sellerPanel.logout', 'Sair')}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('sellerPanel.loading', 'Carregando painel...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('sellerPanel.title', 'Painel do Vendedor')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('sellerPanel.welcome', 'Bem-vindo')}, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/store"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                {t('sellerPanel.goToStore', 'Ver Loja')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
