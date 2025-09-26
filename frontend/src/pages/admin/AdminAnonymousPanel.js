import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare, XCircle, BarChart3, Package, DollarSign, Settings, AlertTriangle, Activity, CheckCircle, Clock, Shield, Eye, Bot, Truck, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminAnonymousPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDevCredentials, setShowDevCredentials] = useState(false);
  const [freightOrders, setFreightOrders] = useState([]);
  const [chatStats, setChatStats] = useState({});
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Buscar dados REAIS do backend através das rotas protegidas
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Token de autenticação não encontrado');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Buscar dados do dashboard
      const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, { headers });
      
      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data.stats);
        setRecentActivity(dashboardResponse.data.data.recentRegistrations || []);
      }

      // Buscar usuários
      const usersResponse = await axios.get(`${API_BASE_URL}/admin/users?limit=50`, { headers });
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data.users || []);
      }

      // Buscar produtos
      const productsResponse = await axios.get(`${API_BASE_URL}/admin/products?limit=50`, { headers });
      if (productsResponse.data.success) {
        setProducts(productsResponse.data.data.products || []);
      }

      // Buscar pagamentos
      const paymentsResponse = await axios.get(`${API_BASE_URL}/admin/payments?limit=50`, { headers });
      if (paymentsResponse.data.success) {
        setPayments(paymentsResponse.data.data.payments || []);
      }

      // Buscar cadastros
      const registrationsResponse = await axios.get(`${API_BASE_URL}/admin/registrations?limit=50`, { headers });
      if (registrationsResponse.data.success) {
        setRegistrations(registrationsResponse.data.data.registrations || []);
      }

      // Buscar atividade recente
      const activityResponse = await axios.get(`${API_BASE_URL}/admin/activity?limit=20`, { headers });
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data.activities || []);
      }

      // Estatísticas de chat (simuladas por enquanto)
      setChatStats({
        totalConversations: 156,
        activeConversations: 23,
        messagesToday: 89,
        aiResponses: 67,
        avgResponseTime: '2.3s'
      });

      toast.success('Dados administrativos carregados com sucesso!');

    } catch (error) {
      console.error('Erro ao carregar dados admin:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        // Redirecionar para login
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error('Acesso negado. Você não tem permissão de administrador.');
      } else {
        toast.error('Erro ao carregar dados administrativos');
      }
      
      // Fallback para dados vazios
      setUsers([]);
      setProducts([]);
      setPayments([]);
      setRegistrations([]);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalProducts: 0,
        activeProducts: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        pendingEscrow: 0,
        totalMessages: 0,
        systemHealth: 0,
        uptime: '0%'
      });
      setRecentActivity([]);
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

  const renderFreights = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {t('admin.freights', 'Pedidos de Frete')}
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
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {freightOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {order.buyer} → {order.carrier}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {order.status === 'delivered' ? 'Entregue' : 
                       order.status === 'in_transit' ? 'Em Trânsito' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {order.origin} → {order.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    R$ {order.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                      <Eye className="w-4 h-4" />
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
      case 'freights':
        return renderFreights();
      case 'chat':
        return renderChat();
      case 'products':
        return (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('admin.products', 'Produtos')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('admin.productsDescription', 'Gerenciamento de produtos em desenvolvimento')}
            </p>
          </div>
        );
      case 'transactions':
        return (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('admin.transactions', 'Transações')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('admin.transactionsDescription', 'Gerenciamento de transações em desenvolvimento')}
            </p>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {t('admin.messages', 'Mensagens')}
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {t('admin.messagesDescription', 'Gerenciamento de mensagens em desenvolvimento')}
            </p>
          </div>
        );
      case 'system':
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
      default:
        return null;
    }
  };

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
                {t('admin.title', 'Painel Admin Anônimo')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('admin.subtitle', 'Visão completa do sistema AGROISYNC')}
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

export default AdminAnonymousPanel;
