import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users, ShoppingCart, Truck, CreditCard, 
  BarChart3, Settings, LogOut, Eye, Edit, Trash2,
  Plus, Search, Filter, Download, RefreshCw,
  UserPlus, DollarSign, TrendingUp, AlertCircle
} from 'lucide-react';

const Admin = () => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Estados para dados
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [freights, setFreights] = useState([]);

  useEffect(() => {
    // Verificar se usuário é admin ou se admin está autenticado
    if ((!user || !user.isAdmin) && !isAdminAuthenticated) {
      // Não redirecionar automaticamente, mostrar tela de login
      return;
    }

    document.title = 'Painel Administrativo - Agroisync';
    loadDashboardData();
  }, [user, navigate, isAdminAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      setUsers([
        { id: 1, name: 'João Silva', email: 'joao@email.com', plan: 'AGROCONNECT+', status: 'active', createdAt: '2024-01-15' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', plan: 'Gratuito', status: 'active', createdAt: '2024-01-10' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', plan: 'AGROCONNECT+', status: 'pending', createdAt: '2024-01-20' }
      ]);

      setPayments([
        { id: 1, userId: 1, amount: 99.90, plan: 'AGROCONNECT+', status: 'completed', date: '2024-01-15' },
        { id: 2, userId: 3, amount: 99.90, plan: 'AGROCONNECT+', status: 'pending', date: '2024-01-20' }
      ]);

      setProducts([
        { id: 1, name: 'Sementes de Soja', category: 'Insumos', price: 45.90, status: 'active', userId: 1 },
        { id: 2, name: 'Fertilizante NPK', category: 'Insumos', price: 89.90, status: 'active', userId: 1 }
      ]);

      setFreights([
        { id: 1, origin: 'São Paulo', destination: 'Mato Grosso', weight: '25 ton', status: 'available', userId: 2 },
        { id: 2, origin: 'Paraná', destination: 'Goiás', weight: '30 ton', status: 'in_transit', userId: 2 }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.email === 'contato@agrotm.com.br' && adminCredentials.password === 'Th@ys15221008') {
      setIsAdminAuthenticated(true);
      setAdminLoginError('');
      // Simular usuário admin
      const adminUser = {
        id: 'admin',
        name: 'Administrador',
        email: 'contato@agrotm.com.br',
        isAdmin: true
      };
      // Atualizar contexto de autenticação
      // Nota: Em produção, isso seria feito via contexto
    } else {
      setAdminLoginError('Credenciais inválidas');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'available':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'inactive':
      case 'cancelled':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'in_transit':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const tabs = [
    { id: 'dashboard', name: t('dashboard'), icon: BarChart3 },
    { id: 'users', name: t('users'), icon: Users },
    { id: 'payments', name: t('payments'), icon: CreditCard },
    { id: 'products', name: t('products'), icon: ShoppingCart },
    { id: 'freights', name: t('freights'), icon: Truck },
    { id: 'settings', name: t('settings'), icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t('totalUsers'), value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { title: t('totalPayments'), value: payments.length, icon: CreditCard, color: 'from-green-500 to-emerald-500' },
          { title: t('activeProducts'), value: products.length, icon: ShoppingCart, color: 'from-purple-500 to-pink-500' },
          { title: t('availableFreights'), value: freights.filter(f => f.status === 'available').length, icon: Truck, color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl shadow-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-70">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos e análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } border border-gray-200 dark:border-gray-700`}
        >
          <h3 className="text-lg font-semibold mb-4">{t('usersByPlan')}</h3>
          <div className="space-y-3">
            {[
              { plan: t('freePlan'), count: users.filter(u => u.plan === 'Gratuito').length, color: 'bg-gray-400' },
              { plan: t('agroconnectPlus'), count: users.filter(u => u.plan === 'AGROCONNECT+').length, color: 'bg-green-500' }
            ].map((item) => (
              <div key={item.plan} className="flex items-center justify-between">
                <span className="text-sm">{item.plan}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / users.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } border border-gray-200 dark:border-gray-700`}
        >
          <h3 className="text-lg font-semibold mb-4">{t('paymentStatus')}</h3>
          <div className="space-y-3">
            {[
              { status: t('completed'), count: payments.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
              { status: t('pending'), count: payments.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm">{item.status}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('manageUsers')}</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          {t('newUser')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-3 px-4">{t('name')}</th>
              <th className="text-left py-3 px-4">{t('email')}</th>
              <th className="text-left py-3 px-4">{t('plan')}</th>
              <th className="text-left py-3 px-4">{t('status')}</th>
              <th className="text-left py-3 px-4">{t('date')}</th>
              <th className="text-left py-3 px-4">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.plan}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">{user.createdAt}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-500 hover:text-green-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('paymentHistory')}</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Download className="w-4 h-4 inline mr-2" />
          {t('export')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-3 px-4">{t('id')}</th>
              <th className="text-left py-3 px-4">{t('user')}</th>
              <th className="text-left py-3 px-4">{t('value')}</th>
              <th className="text-left py-3 px-4">{t('plan')}</th>
              <th className="text-left py-3 px-4">{t('status')}</th>
              <th className="text-left py-3 px-4">{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className="py-3 px-4">#{payment.id}</td>
                <td className="py-3 px-4">{users.find(u => u.id === payment.userId)?.name || 'N/A'}</td>
                <td className="py-3 px-4">R$ {payment.amount}</td>
                <td className="py-3 px-4">{payment.plan}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('registeredProducts')}</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          {t('newProduct')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl shadow-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
            <p className="text-sm opacity-70 mb-2">{t('category')}: {product.category}</p>
            <p className="text-lg font-bold text-green-500 mb-4">R$ {product.price}</p>
            <div className="flex gap-2">
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                <Eye className="w-4 h-4 inline mr-1" />
                {t('view')}
              </button>
              <button className="text-green-500 hover:text-green-600 text-sm">
                <Edit className="w-4 h-4 inline mr-1" />
                {t('edit')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderFreights = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('agroConnectFreights')}</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          {t('newFreight')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {freights.map((freight) => (
          <motion.div
            key={freight.id}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl shadow-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{t('freight')} #{freight.id}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(freight.status)}`}>
                {freight.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>{t('origin')}:</strong> {freight.origin}</p>
              <p><strong>{t('destination')}:</strong> {freight.destination}</p>
              <p><strong>{t('weight')}:</strong> {freight.weight}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                <Eye className="w-4 h-4 inline mr-1" />
                {t('details')}
              </button>
              <button className="text-green-500 hover:text-green-600 text-sm">
                <Edit className="w-4 h-4 inline mr-1" />
                {t('edit')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('systemSettings')}</h2>
      
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4">{t('generalSettings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('platformName')}</label>
            <input
              type="text"
              defaultValue="Agroisync"
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('contactEmail')}</label>
            <input
              type="email"
              defaultValue="admin@agroisync.com"
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            {t('saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'payments':
        return renderPayments();
      case 'products':
        return renderProducts();
      case 'freights':
        return renderFreights();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{t('loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado como admin, mostrar tela de login
  if (!isAdminAuthenticated && (!user || !user.isAdmin)) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 mt-2">Acesso exclusivo para administradores</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contato@agrotm.com.br"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Senha de administrador"
                  required
                />
              </div>

              {adminLoginError && (
                <div className="text-red-500 text-sm text-center">
                  {adminLoginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Acessar Painel
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                Voltar ao site
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-70">Admin: {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? (isDark
                      ? 'bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-400/25'
                      : 'bg-green-500 text-white shadow-lg shadow-green-500/25')
                  : (isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300')
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
