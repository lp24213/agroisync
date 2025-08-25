import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Database, 
  Shield, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  CreditCard,
  UserPlus,
  Calendar,
  Globe,
  Target
} from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data para usuários
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@agro.com',
      status: 'active',
      plan: 'Premium',
      lastLogin: '2024-01-15 14:30',
      role: 'user',
      region: 'São Paulo',
      products: 12,
      revenue: 15420.50
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@agro.com',
      status: 'active',
      plan: 'Basic',
      lastLogin: '2024-01-15 12:15',
      role: 'user',
      region: 'Rio de Janeiro',
      products: 8,
      revenue: 8900.00
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@agro.com',
      status: 'inactive',
      plan: 'Basic',
      lastLogin: '2024-01-10 09:45',
      role: 'user',
      region: 'Minas Gerais',
      products: 5,
      revenue: 3200.00
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@agro.com',
      status: 'active',
      plan: 'Premium',
      lastLogin: '2024-01-15 16:20',
      role: 'admin',
      region: 'Paraná',
      products: 15,
      revenue: 22000.00
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@agro.com',
      status: 'pending',
      plan: 'Basic',
      lastLogin: '2024-01-14 11:30',
      role: 'user',
      region: 'Goiás',
      products: 3,
      revenue: 1500.00
    }
  ]);

  // Mock data para estatísticas
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 1189,
    premiumUsers: 456,
    newUsersToday: 23,
    totalRevenue: 125000,
    systemHealth: 99.8,
    totalProducts: 5678,
    totalOrders: 8923,
    avgOrderValue: 89.50
  });

  // Mock data para gráficos
  const [chartData, setChartData] = useState({
    usersByRegion: [
      { region: 'São Paulo', users: 456, revenue: 45000 },
      { region: 'Rio de Janeiro', users: 234, revenue: 28000 },
      { region: 'Minas Gerais', users: 189, revenue: 22000 },
      { region: 'Paraná', users: 156, revenue: 18000 },
      { region: 'Goiás', users: 98, revenue: 12000 }
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 125000 },
      { month: 'Fev', revenue: 138000 },
      { month: 'Mar', revenue: 142000 },
      { month: 'Abr', revenue: 156000 },
      { month: 'Mai', revenue: 168000 },
      { month: 'Jun', revenue: 175000 }
    ]
  });

  useEffect(() => {
    // Verificar se o usuário é admin
    if (!isAdmin) {
      navigate('/login');
      return;
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Premium': return 'text-blue-400 bg-blue-400/10';
      case 'Basic': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total de Usuários</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-400">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Usuários Premium</p>
              <p className="text-2xl font-bold text-blue-400">{stats.premiumUsers.toLocaleString()}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-green-400">R$ {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Receita Mensal</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.revenueByMonth.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t"
                  style={{ height: `${(item.revenue / 200000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Region */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Usuários por Região</h3>
          <div className="space-y-3">
            {chartData.usersByRegion.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.region}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                      style={{ width: `${(item.users / 500) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-white">{item.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-center transition-colors">
            <UserPlus className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Adicionar Usuário</span>
          </button>
          <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-center transition-colors">
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Gerenciar Produtos</span>
          </button>
          <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-center transition-colors">
            <Truck className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Gestão de Fretes</span>
          </button>
          <button className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-center transition-colors">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Users Table Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gerenciamento de Usuários</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Adicionar Usuário</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="pending">Pendentes</option>
              </select>
              
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.region}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Ativo' : 
                       user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.plan)}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.products}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                    R$ {user.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Mostrando 1-5 de {filteredUsers.length} resultados
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors">
                Anterior
              </button>
              <span className="px-3 py-1 bg-blue-600 rounded text-sm text-white">1</span>
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Métricas de Vendas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total de Pedidos</span>
              <span className="text-white font-medium">{stats.totalOrders.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Valor Médio</span>
              <span className="text-white font-medium">R$ {stats.avgOrderValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de Produtos</span>
              <span className="text-white font-medium">{stats.totalProducts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Crescimento</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400">+15.3%</span>
              <span className="text-gray-400 text-sm">usuários este mês</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400">+8.7%</span>
              <span className="text-gray-400 text-sm">receita este mês</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400">+12.1%</span>
              <span className="text-gray-400 text-sm">produtos este mês</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Distribuição</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Premium</span>
              <span className="text-white font-medium">{((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Basic</span>
              <span className="text-white font-medium">{(((stats.totalUsers - stats.premiumUsers) / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ativos</span>
              <span className="text-white font-medium">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Distribuição Regional</h3>
          <div className="space-y-4">
            {chartData.usersByRegion.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-purple-500' : 
                    index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-300">{item.region}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white">{item.users}</span>
                  <span className="text-xs text-gray-400">({((item.users / stats.totalUsers) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Tendência de Receita</h3>
          <div className="h-48 flex items-end justify-between space-x-1">
            {chartData.revenueByMonth.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
                  style={{ height: `${(item.revenue / 200000) * 150}px` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Configurações do Sistema</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Plataforma</label>
            <input
              type="text"
              defaultValue="AGROSYNC"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email de Contato</label>
            <input
              type="email"
              defaultValue="admin@agrosync.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Região Padrão</label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Brasil</option>
              <option>América Latina</option>
              <option>Global</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Salvar Configurações
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
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Painel Central - ADMIN</h1>
                <p className="text-sm text-gray-400">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="transition-all duration-200">
          {renderContent()}
        </div>

        {/* System Health */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Status do Sistema</h3>
              <p className="text-sm text-gray-400">Monitoramento em tempo real</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{stats.systemHealth}%</div>
              <div className="text-sm text-gray-400">Saúde do Sistema</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.systemHealth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
