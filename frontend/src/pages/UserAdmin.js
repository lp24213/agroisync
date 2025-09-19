import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare, XCircle, BarChart3, Package, DollarSign, Settings, AlertTriangle, Activity, CheckCircle, Clock, Shield, Eye, Bot, Truck, Globe, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserAdmin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDevCredentials, setShowDevCredentials] = useState(true);
  const [freightOrders, setFreightOrders] = useState([]);
  const [chatStats, setChatStats] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificar autorização (simulação)
    const checkAuthorization = () => {
      // Em produção, isso seria verificado via Cloudflare Access ou JWT
      const secretHeader = new URLSearchParams(window.location.search).get('secret');
      const isDev = process.env.NODE_ENV === 'development';
      
      if (secretHeader === 'agroisync-admin-2024' || isDev) {
        setIsAuthorized(true);
        loadAdminData();
      } else {
        toast.error('Acesso não autorizado');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      }
    };

    checkAuthorization();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalProducts: 3456,
        activeProducts: 2890,
        totalTransactions: 15678,
        totalRevenue: 2450000,
        pendingEscrow: 125000,
        totalMessages: 8945,
        systemHealth: 98.5,
        uptime: '99.9%'
      });

      setRecentActivity([
        {
          id: 'act-1',
          type: 'user_registration',
          user: 'João Silva',
          timestamp: new Date(Date.now() - 300000),
          status: 'success'
        },
        {
          id: 'act-2',
          type: 'product_created',
          user: 'Maria Santos',
          product: 'Soja Premium',
          timestamp: new Date(Date.now() - 600000),
          status: 'success'
        },
        {
          id: 'act-3',
          type: 'payment_processed',
          user: 'Pedro Oliveira',
          amount: 15000,
          timestamp: new Date(Date.now() - 900000),
          status: 'success'
        },
        {
          id: 'act-4',
          type: 'system_alert',
          message: 'High CPU usage detected',
          timestamp: new Date(Date.now() - 1200000),
          status: 'warning'
        }
      ]);

      setUsers([
        {
          id: 'user-1',
          name: 'João Silva',
          email: 'joao@example.com',
          role: 'buyer',
          status: 'active',
          lastLogin: new Date(Date.now() - 3600000),
          totalOrders: 12,
          totalSpent: 45000
        },
        {
          id: 'user-2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          role: 'seller',
          status: 'active',
          lastLogin: new Date(Date.now() - 7200000),
          totalProducts: 8,
          totalRevenue: 125000
        },
        {
          id: 'user-admin',
          name: 'Admin Dev',
          email: process.env.REACT_APP_ADMIN_EMAIL || 'luispaulodeoliveira@agrotm.com.br',
          role: 'admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 1800000),
          totalOrders: 0,
          totalSpent: 0
        }
      ]);

      setFreightOrders([
        {
          id: 'FR-001',
          orderNumber: 'FR-001',
          status: 'in_transit',
          buyer: 'João Silva',
          carrier: 'Transportadora ABC',
          origin: 'São Paulo, SP',
          destination: 'Mato Grosso, MT',
          value: 2500,
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          id: 'FR-002',
          orderNumber: 'FR-002',
          status: 'delivered',
          buyer: 'Maria Santos',
          carrier: 'Logística XYZ',
          origin: 'Paraná, PR',
          destination: 'Goiás, GO',
          value: 1800,
          createdAt: new Date(Date.now() - 172800000)
        }
      ]);

      setChatStats({
        totalConversations: 156,
        activeConversations: 23,
        messagesToday: 89,
        aiResponses: 67,
        avgResponseTime: '2.3s'
      });

    } catch (error) {
      console.error('Erro ao carregar dados admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: t('admin.overview', 'Visão Geral'), icon: BarChart3 },
    { id: 'users', label: t('admin.users', 'Usuários'), icon: Users },
    { id: 'freights', label: t('admin.freights', 'Fretes'), icon: Truck },
    { id: 'chat', label: t('admin.chat', 'Chat IA'), icon: Bot },
    { id: 'products', label: t('admin.products', 'Produtos'), icon: Package },
    { id: 'transactions', label: t('admin.transactions', 'Transações'), icon: DollarSign },
    { id: 'messages', label: t('admin.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'system', label: t('admin.system', 'Sistema'), icon: Settings }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'product_created':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'payment_processed':
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
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('admin.totalUsers', 'Total de Usuários')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalUsers?.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('admin.totalProducts', 'Total de Produtos')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalProducts?.toLocaleString()}
              </p>
            </div>
            <Package className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('admin.totalRevenue', 'Receita Total')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('admin.systemHealth', 'Saúde do Sistema')}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.systemHealth}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('admin.recentActivity', 'Atividade Recente')}
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {t(`admin.activity.${activity.type}`, activity.type)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(activity.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              {getStatusIcon(activity.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {t('admin.users', 'Usuários')}
        </h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            {t('admin.export', 'Exportar')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('admin.user', 'Usuário')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('admin.role', 'Função')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('admin.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('admin.lastLogin', 'Último Login')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('admin.actions', 'Ações')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {user.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {t(`userRole.${user.role}`, user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {t(`userStatus.${user.status}`, user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(user.lastLogin).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                      {t('admin.view', 'Ver')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {t('admin.chat', 'Estatísticas do Chat IA')}
        </h3>
        <button 
          onClick={() => setShowDevCredentials(!showDevCredentials)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showDevCredentials ? 'Ocultar' : 'Mostrar'} Credenciais Dev
        </button>
      </div>

      {showDevCredentials && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🔧 Credenciais de Desenvolvimento
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Email:</strong> {process.env.REACT_APP_ADMIN_EMAIL || 'luispaulodeoliveira@agrotm.com.br'}
            </div>
            <div>
              <strong>Senha:</strong> {process.env.REACT_APP_ADMIN_PASSWORD || 'Th@ys15221008'}
            </div>
            <div className="text-yellow-700 dark:text-yellow-300 text-xs mt-2">
              ⚠️ Estas credenciais são apenas para desenvolvimento. Em produção, use variáveis de ambiente.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Conversas Totais</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {chatStats.totalConversations}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Conversas Ativas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {chatStats.activeConversations}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Mensagens Hoje</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {chatStats.messagesToday}
              </p>
            </div>
            <Bot className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tempo Resposta</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {chatStats.avgResponseTime}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Funcionalidades do Chat IA
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Bot className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Respostas com IA OpenAI</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Entrada de voz (Web Speech API)</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Saída de voz (TTS)</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Upload de imagens</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'chat':
        return renderChat();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('admin.system', 'Sistema')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('admin.systemDescription', 'Configurações do sistema em desenvolvimento')}
            </p>
          </div>
        );
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Acesso Negado
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('admin.loading', 'Carregando painel admin...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                🔒 {t('admin.title', 'Painel Admin Secreto')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('admin.subtitle', 'Acesso restrito ao sistema AGROISYNC')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('admin.secureAccess', 'Acesso Seguro')}
                </span>
              </div>
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

export default UserAdmin;
