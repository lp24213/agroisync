import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, MessageSquare, Users, Package, Truck, 
  CreditCard, Search, Shield, LogOut, DollarSign
} from 'lucide-react';

const AdminSecurePanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout, logoutAdmin } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      // Simular dados reais do dashboard (em produção viriam da API)
      const mockData = {
        metrics: {
          totalUsers: 1247,
          activeUsers: 892,
          totalRevenue: 45678.90,
          pendingPayments: 23,
          totalProducts: 3456,
          totalFreights: 1234,
          totalTransactions: 5678
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            description: 'Novo usuário cadastrado: João Silva',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            user: 'joao.silva@email.com'
          },
          {
            id: 2,
            type: 'product_created',
            description: 'Produto criado: Soja Premium',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            user: 'maria.santos@email.com'
          },
          {
            id: 3,
            type: 'payment_received',
            description: 'Pagamento recebido: R$ 99,90',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            user: 'pedro.oliveira@email.com'
          }
        ],
        systemStatus: 'operational',
        lastUpdate: new Date().toISOString()
      };

      setDashboardData(mockData);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (loading) {
    return (
          <div className="min-h-screen bg-premium-platinum flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-premium rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <p className="text-premium-gray text-xl">Carregando painel administrativo...</p>
      </div>
    </div>
    );
  }

  if (error) {
    return (
          <div className="min-h-screen bg-premium-platinum flex items-center justify-center">
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
    <div className="min-h-screen bg-premium-platinum">
            {/* Header */}
              <header className="bg-white border-b border-premium-platinum shadow-premium-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold title-premium">
                Painel Administrativo AGROISYNC
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-premium-gray">
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
              <nav className="bg-premium-platinum border-b border-premium-platinum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'conversations', label: 'Conversas', icon: MessageSquare },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'freights', label: 'Fretes', icon: Truck },
              { id: 'payments', label: 'Pagamentos', icon: CreditCard },
              { id: 'audit', label: 'Auditoria', icon: Search }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-accent-emerald text-accent-emerald'
                      : 'border-transparent text-premium-gray hover:text-premium-dark-gray hover:border-premium-gray'
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
              <div className="card-premium p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-premium-gray">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-premium-dark-gray">{dashboardData.metrics.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-premium-gray">Total de Produtos</p>
                    <p className="text-2xl font-semibold text-premium-dark-gray">{dashboardData.metrics.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Truck className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-premium-gray">Total de Fretes</p>
                    <p className="text-2xl font-semibold text-premium-dark-gray">{dashboardData.metrics.totalFreights}</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-premium-gray">Receita Total</p>
                    <p className="text-2xl font-semibold text-premium-dark-gray">R$ {dashboardData.metrics.totalRevenue.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium">
              <div className="px-6 py-4 border-b border-premium-platinum">
                <h3 className="text-lg font-medium title-premium">Atividade Recente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-premium-platinum rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'payment_received' ? 'bg-green-100 text-green-800 border border-green-200' :
                          activity.type === 'user_registration' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {activity.type === 'payment_received' ? 'PAGAMENTO' :
                           activity.type === 'user_registration' ? 'USUÁRIO' : 'PRODUTO'}
                        </span>
                        <span className="text-premium-dark-gray">{activity.description}</span>
                        <span className="text-premium-gray">{activity.user}</span>
                      </div>
                      <div className="text-sm text-premium-gray">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
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
          <div className="card-premium p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-100 flex items-center justify-center">
               <Shield className="w-8 h-8 text-yellow-600" />
             </div>
              <h3 className="text-xl font-medium title-premium mb-2">
                Funcionalidade em Desenvolvimento
              </h3>
              <p className="text-premium-gray">
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
