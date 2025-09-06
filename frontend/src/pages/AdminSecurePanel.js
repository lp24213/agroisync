import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, MessageSquare, Users, Package, Truck, 
  CreditCard, Search, Shield, LogOut, DollarSign,
  Mail, Activity, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import StockMarketTicker from '../components/StockMarketTicker';
import EscrowManager from '../components/payments/EscrowManager';
import ContactManager from '../components/contact/ContactManager';
import MessagingCenter from '../components/messaging/MessagingCenter';

const AdminSecurePanel = () => {
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logoutAdmin } = useAuth();

  const loadDashboardData = useCallback(async () => {
    try {
      // Simular dados reais do dashboard (em produção viriam da API)
      const mockData = {
        metrics: {
          totalUsers: 1247,
          activeUsers: 892,
          totalRevenue: 2450000,
          pendingPayments: 23,
          totalProducts: 3456,
          totalFreights: 1234,
          totalTransactions: 5678,
          totalMessages: 8945,
          pendingEscrow: 125000,
          systemHealth: 98.5,
          uptime: '99.9%'
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            description: t('activity.userRegistration', 'Novo usuário cadastrado: João Silva'),
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            user: 'joao.silva@email.com',
            status: 'success'
          },
          {
            id: 2,
            type: 'product_created',
            description: t('activity.productCreated', 'Produto criado: Soja Premium'),
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            user: 'maria.santos@email.com',
            status: 'success'
          },
          {
            id: 3,
            type: 'payment_received',
            description: t('activity.paymentReceived', 'Pagamento recebido: R$ 99,90'),
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            user: 'pedro.oliveira@email.com',
            status: 'success'
          },
          {
            id: 4,
            type: 'system_alert',
            description: t('activity.systemAlert', 'Alerta do sistema: Alto uso de CPU'),
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            status: 'warning'
          }
        ],
        systemStatus: 'operational',
        lastUpdate: new Date().toISOString()
      };

      setDashboardData(mockData);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(t('error.loadingData', 'Erro ao carregar dados do dashboard'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate, loadDashboardData]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'product_created':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'system_alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-agro-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xl">{t('loading', 'Carregando painel administrativo...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StockMarketTicker />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('title', 'Painel Administrativo AGROISYNC')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-agro-emerald" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('secureAccess', 'Acesso Seguro')}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                {t('admin', 'Admin')}: {user?.email || 'Administrador'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout', 'Sair')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: BarChart3 },
              { id: 'users', label: t('users', 'Usuários'), icon: Users },
              { id: 'products', label: t('products', 'Produtos'), icon: Package },
              { id: 'freights', label: t('freights', 'Fretes'), icon: Truck },
              { id: 'payments', label: t('payments', 'Pagamentos'), icon: CreditCard },
              { id: 'escrow', label: t('escrow', 'Escrow'), icon: DollarSign },
              { id: 'messages', label: t('messages', 'Mensagens'), icon: MessageSquare },
              { id: 'contacts', label: t('contacts', 'Contatos'), icon: Mail },
              { id: 'audit', label: t('audit', 'Auditoria'), icon: Search }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-agro-emerald text-agro-emerald'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalUsers', 'Total de Usuários')}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.metrics.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalProducts', 'Total de Produtos')}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.metrics.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Truck className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalFreights', 'Total de Fretes')}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData.metrics.totalFreights}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalRevenue', 'Receita Total')}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(dashboardData.metrics.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('recentActivity', 'Atividade Recente')}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getActivityIcon(activity.type)}
                        <span className="text-gray-900 dark:text-white">{activity.description}</span>
                        {activity.user && <span className="text-gray-600 dark:text-gray-400">{activity.user}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Escrow Manager Tab */}
        {activeTab === 'escrow' && <EscrowManager />}

        {/* Contact Manager Tab */}
        {activeTab === 'contacts' && <ContactManager />}

        {/* Messaging Center Tab */}
        {activeTab === 'messages' && <MessagingCenter />}

        {/* Other Tabs - Placeholder */}
        {!['dashboard', 'escrow', 'contacts', 'messages'].includes(activeTab) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {t('featureInDevelopment', 'Funcionalidade em Desenvolvimento')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('featureDescription', 'A aba "{{tab}}" está sendo implementada e estará disponível em breve.', { tab: activeTab })}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSecurePanel;
