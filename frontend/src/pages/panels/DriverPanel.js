import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, MessageSquare, Bell, LogOut, XCircle, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DriverPanel = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('freights');
  const [loading, setLoading] = useState(false);
  const [availableFreights, setAvailableFreights] = useState([]);
  const [myFreights, setMyFreights] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
Dados mockados
      setAvailableFreights([
        {
          id: 'FREIGHT-001',
          origin: 'São Paulo, SP',
          destination: 'Rio de Janeiro, RJ',
          distance: 430,
          weight: 25,
          price: 3500,
          pickupDate: '2024-01-20',
          deliveryDate: '2024-01-22',
          cargo: 'Soja',
          status: 'available'
        },
        {
          id: 'FREIGHT-002',
          origin: 'Campinas, SP',
          destination: 'Belo Horizonte, MG',
          distance: 580,
          weight: 30,
          price: 4200,
          pickupDate: '2024-01-21',
          deliveryDate: '2024-01-23',
          cargo: 'Milho',
          status: 'available'
        }
      ]);

      setMyFreights([
        {
          id: 'MY-FREIGHT-001',
          origin: 'Ribeirão Preto, SP',
          destination: 'Santos, SP',
          distance: 320,
          weight: 20,
          price: 2800,
          pickupDate: '2024-01-18',
          deliveryDate: '2024-01-19',
          cargo: 'Café',
          status: 'in_transit',
          progress: 75
        }
      ]);

      setEarnings({
        totalEarnings: 45000,
        thisMonth: 8500,
        completedFreights: 12,
        averageRating: 4.7
      });

      setNotifications([
        {
          id: 'NOT-001',
          type: 'new_freight',
          message: 'Novo frete disponível: São Paulo → Rio de Janeiro',
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

  const handleAcceptFreight = (freightId) => {
Lógica para aceitar frete
    console.log('Aceitar frete:', freightId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'freights', label: t('driverPanel.availableFreights', 'Fretes Disponíveis'), icon: Truck },
    { id: 'myFreights', label: t('driverPanel.myFreights', 'Meus Fretes'), icon: Package },
    { id: 'earnings', label: t('driverPanel.earnings', 'Ganhos'), icon: DollarSign },
    { id: 'messages', label: t('driverPanel.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'notifications', label: t('driverPanel.notifications', 'Notificações'), icon: Bell },
    { id: 'settings', label: t('driverPanel.settings', 'Configurações'), icon: Settings }
  ];

  const renderAvailableFreights = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.availableFreights', 'Fretes Disponíveis')}
      </h3>

      <div className="grid gap-4">
        {availableFreights.map((freight) => (
          <motion.div
            key={freight.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {freight.cargo}
                  </h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t('freightStatus.available', 'Disponível')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">{freight.origin}</p>
                      <p className="text-xs">{t('driverPanel.origin', 'Origem')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Navigation className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">{freight.destination}</p>
                      <p className="text-xs">{t('driverPanel.destination', 'Destino')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {freight.distance} km
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {freight.weight} ton
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(freight.pickupDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(freight.price)}
                </div>
                <button
                  onClick={() => handleAcceptFreight(freight.id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {t('driverPanel.accept', 'Aceitar')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMyFreights = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.myFreights', 'Meus Fretes')}
      </h3>
      
      <div className="grid gap-4">
        {myFreights.map((freight) => (
          <motion.div
            key={freight.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {freight.cargo}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    freight.status === 'in_transit' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {t(`freightStatus.${freight.status}`, freight.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">{freight.origin}</p>
                      <p className="text-xs">{t('driverPanel.origin', 'Origem')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Navigation className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">{freight.destination}</p>
                      <p className="text-xs">{t('driverPanel.destination', 'Destino')}</p>
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                {freight.status === 'in_transit' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                      <span>{t('driverPanel.progress', 'Progresso')}</span>
                      <span>{freight.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${freight.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {freight.distance} km
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {freight.weight} ton
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(freight.pickupDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(freight.price)}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors">
                    {t('driverPanel.updateStatus', 'Atualizar')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.earnings', 'Ganhos')}
      </h3>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('driverPanel.totalEarnings', 'Ganhos Totais')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(earnings.totalEarnings)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('driverPanel.thisMonth', 'Este Mês')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(earnings.thisMonth)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('driverPanel.completedFreights', 'Fretes Concluídos')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {earnings.completedFreights}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('driverPanel.averageRating', 'Avaliação Média')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {earnings.averageRating}
              </p>
            </div>
            <Users className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Gráfico de ganhos */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('driverPanel.earningsChart', 'Gráfico de Ganhos')}
        </h4>
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            {t('driverPanel.chartDescription', 'Gráfico de ganhos dos últimos 6 meses')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'freights':
        return renderAvailableFreights();
      case 'myFreights':
        return renderMyFreights();
      case 'earnings':
        return renderEarnings();
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('driverPanel.noMessages', 'Nenhuma mensagem')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('driverPanel.noMessagesDesc', 'Suas conversas com clientes aparecerão aqui')}
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {t('driverPanel.notifications', 'Notificações')}
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
              {t('driverPanel.settings', 'Configurações')}
            </h3>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('driverPanel.accountSettings', 'Configurações da Conta')}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('driverPanel.email', 'Email')}
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
                    {t('driverPanel.name', 'Nome')}
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
                  {t('driverPanel.logout', 'Sair')}
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
            {t('driverPanel.loading', 'Carregando painel...')}
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
                {t('driverPanel.title', 'Painel do Motorista')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('driverPanel.welcome', 'Bem-vindo')}, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/freight"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                {t('driverPanel.goToFreight', 'Ver Fretes')}
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

export default DriverPanel;
