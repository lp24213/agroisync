import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, MessageSquare, Users, Package, Truck, 
  CreditCard, Search, Shield, LogOut 
} from 'lucide-react';

const AdminSecurePanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Erro ao carregar dados do dashboard');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando painel administrativo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gradient-agro">
                Painel Administrativo AGROISYNC
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Admin: {user?.email || 'Administrador'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
                          { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
            { id: 'conversations', label: 'Conversas', icon: 'MessageSquare' },
            { id: 'users', label: 'Usuários', icon: 'Users' },
            { id: 'products', label: 'Produtos', icon: 'Package' },
            { id: 'freights', label: 'Fretes', icon: 'Truck' },
            { id: 'payments', label: 'Pagamentos', icon: 'CreditCard' },
            { id: 'audit', label: 'Auditoria', icon: 'Search' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-white">{dashboardData.stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total de Produtos</p>
                    <p className="text-2xl font-semibold text-white">{dashboardData.stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total de Fretes</p>
                    <p className="text-2xl font-semibold text-white">{dashboardData.stats.totalFreights}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total de Conversas</p>
                    <p className="text-2xl font-semibold text-white">{dashboardData.stats.totalConversations}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Logs de Auditoria Recentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentAuditLogs?.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.riskLevel === 'HIGH' ? 'bg-red-500 text-white' :
                          log.riskLevel === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {log.riskLevel}
                        </span>
                        <span className="text-gray-300">{log.action}</span>
                        <span className="text-gray-400">{log.userEmail}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs - Placeholder */}
        {activeTab !== 'dashboard' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-500 flex items-center justify-center">
               <Shield className="w-8 h-8 text-white" />
             </div>
              <h3 className="text-xl font-medium text-white mb-2">
                Funcionalidade em Desenvolvimento
              </h3>
              <p className="text-gray-400">
                A aba "{activeTab}" está sendo implementada e estará disponível em breve.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSecurePanel;
