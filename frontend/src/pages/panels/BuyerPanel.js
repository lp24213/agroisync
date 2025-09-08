import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, MessageSquare, Bell, LogOut, Heart, Settings, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BuyerPanel = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadBuyerData();
  }, []);

  const loadBuyerData = async () => {
    setLoading(true);
    try {
Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
Dados mockados
      setOrders([
        {
          id: 'ORD-001',
          product: 'Soja Premium',
          seller: 'Fazenda São José',
          amount: 15000,
          status: 'pending',
          date: '2024-01-15',
          delivery: '2024-01-20'
        },
        {
          id: 'ORD-002',
          product: 'Milho Orgânico',
          seller: 'Agro Verde Ltda',
          amount: 8500,
          status: 'delivered',
          date: '2024-01-10',
          delivery: '2024-01-12'
        }
      ]);

      setFavorites([
        {
          id: 'FAV-001',
          product: 'Trigo Premium',
          seller: 'Cereal Brasil',
          price: 1200,
          rating: 4.8
        }
      ]);

      setNotifications([
        {
          id: 'NOT-001',
          type: 'order_update',
          message: 'Seu pedido ORD-001 foi confirmado',
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
    { id: 'orders', label: t('buyerPanel.orders', 'Pedidos'), icon: ShoppingCart },
    { id: 'favorites', label: t('buyerPanel.favorites', 'Favoritos'), icon: Heart },
    { id: 'messages', label: t('buyerPanel.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'notifications', label: t('buyerPanel.notifications', 'Notificações'), icon: Bell },
    { id: 'settings', label: t('buyerPanel.settings', 'Configurações'), icon: Settings }
  ];

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {t('buyerPanel.myOrders', 'Meus Pedidos')}
        </h3>
        <Link
          to="/store"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('buyerPanel.newOrder', 'Novo Pedido')}
        </Link>
      </div>

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
                  {t('buyerPanel.seller', 'Vendedor')}: {order.seller}
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
                    <Calendar className="w-4 h-4" />
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/messages?order=${order.id}`}
                  className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                  title={t('buyerPanel.contactSeller', 'Contatar Vendedor')}
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <button
                  className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                  title={t('buyerPanel.viewDetails', 'Ver Detalhes')}
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('buyerPanel.favoriteProducts', 'Produtos Favoritos')}
      </h3>
      
      <div className="grid gap-4">
        {favorites.map((favorite) => (
          <motion.div
            key={favorite.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {favorite.product}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                  {t('buyerPanel.seller', 'Vendedor')}: {favorite.seller}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(favorite.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {favorite.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  {t('buyerPanel.buyNow', 'Comprar Agora')}
                </button>
                <button className="p-2 text-red-500 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrders();
      case 'favorites':
        return renderFavorites();
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('buyerPanel.noMessages', 'Nenhuma mensagem')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('buyerPanel.noMessagesDesc', 'Suas conversas com vendedores aparecerão aqui')}
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {t('buyerPanel.notifications', 'Notificações')}
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
              {t('buyerPanel.settings', 'Configurações')}
            </h3>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('buyerPanel.accountSettings', 'Configurações da Conta')}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('buyerPanel.email', 'Email')}
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
                    {t('buyerPanel.name', 'Nome')}
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
                  {t('buyerPanel.logout', 'Sair')}
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
            {t('buyerPanel.loading', 'Carregando painel...')}
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
                {t('buyerPanel.title', 'Painel do Comprador')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('buyerPanel.welcome', 'Bem-vindo')}, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/store"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {t('buyerPanel.goToStore', 'Ir para Loja')}
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

export default BuyerPanel;
