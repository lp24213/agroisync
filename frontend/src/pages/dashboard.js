import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, Truck, MessageSquare, Settings, 
  Plus, Eye, Edit, Trash, DollarSign, 
  BarChart3, Bell, CreditCard, Shield, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StockMarketTicker from '../components/StockMarketTicker';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    freights: 0,
    messages: 0,
    sales: 0,
    revenue: 0
  });

  // Estados para diferentes seções
  const [products, setProducts] = useState([]);
  const [freights, setFreights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados
      setStats({
        products: 12,
        freights: 8,
        messages: 24,
        sales: 156,
        revenue: 15420.50
      });

      setProducts([
        {
          id: 1,
          name: 'Soja Premium',
          category: 'Grãos',
          price: 180.50,
          status: 'active',
          views: 45,
          favorites: 12,
          image: '/api/placeholder/150/150'
        },
        {
          id: 2,
          name: 'Milho Especial',
          category: 'Grãos',
          price: 85.30,
          status: 'pending',
          views: 23,
          favorites: 8,
          image: '/api/placeholder/150/150'
        }
      ]);

      setFreights([
        {
          id: 1,
          origin: 'São Paulo, SP',
          destination: 'Mato Grosso, MT',
          cargo: 'Fertilizantes',
          price: 2500.00,
          status: 'active',
          views: 18,
          applications: 3
        },
        {
          id: 2,
          origin: 'Paraná, PR',
          destination: 'Goiás, GO',
          cargo: 'Sementes',
          price: 1800.00,
          status: 'completed',
          views: 32,
          applications: 5
        }
      ]);

      setMessages([
        {
          id: 1,
          sender: 'João Silva',
          subject: 'Interesse em Soja Premium',
          preview: 'Olá! Tenho interesse em comprar sua soja...',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          unread: true,
          type: 'product'
        },
        {
          id: 2,
          sender: 'Maria Santos',
          subject: 'Fretamento para Mato Grosso',
          preview: 'Preciso de frete para transportar fertilizantes...',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          unread: false,
          type: 'freight'
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'product',
          message: 'Seu produto "Soja Premium" recebeu uma nova visualização',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'freight',
          message: 'Nova aplicação recebida para seu frete São Paulo - Mato Grosso',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary pt-16">
              {/* Header */}
        <div className="bg-agro-bg-card shadow-xl border-b border-agro-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user?.name || 'Usuário'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <StockMarketTicker />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de Navegação */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm mb-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'freights', label: 'Fretes', icon: Truck },
            { id: 'messages', label: 'Mensagens', icon: MessageSquare },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-agro-green text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Tabs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Visão Geral */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: 'Produtos', value: stats.products, icon: Package, color: 'blue' },
                    { label: 'Fretes', value: stats.freights, icon: Truck, color: 'green' },
                    { label: 'Mensagens', value: stats.messages, icon: MessageSquare, color: 'purple' },
                    { label: 'Vendas', value: stats.sales, icon: DollarSign, color: 'yellow' },
                    { label: 'Receita', value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`, icon: BarChart3, color: 'emerald' }
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        whileHover={{ scale: 1.02 }}
                        className="card-premium p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                            <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Gráficos e Análises */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="title-premium text-lg font-semibold mb-4">Atividade Recente</h3>
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-agro-green rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                            <p className="text-xs text-gray-600">{message.subject}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium p-6">
                    <h3 className="title-premium text-lg font-semibold mb-4">Produtos em Destaque</h3>
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">R$ {product.price}</p>
                            <p className="text-xs text-gray-600">{product.views} visualizações</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Produtos */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="title-premium text-2xl font-bold">Meus Produtos</h2>
                  <Link
                    to="/cadastro-produto"
                    className="btn-accent-green flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Produto</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="card-premium p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="title-premium text-lg font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Preço:</span>
                          <span className="text-sm font-medium">R$ {product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Visualizações:</span>
                          <span className="text-sm font-medium">{product.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Favoritos:</span>
                          <span className="text-sm font-medium">{product.favorites}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>Ver</span>
                        </button>
                        <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button className="btn-danger flex items-center justify-center">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Fretes */}
            {activeTab === 'freights' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="title-premium text-2xl font-bold">Meus Fretes</h2>
                  <Link
                    to="/agroconecta"
                    className="btn-accent-green flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Frete</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freights.map((freight) => (
                    <motion.div
                      key={freight.id}
                      whileHover={{ scale: 1.02 }}
                      className="card-premium p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="title-premium text-lg font-semibold">{freight.cargo}</h3>
                          <p className="text-sm text-gray-600">{freight.origin} → {freight.destination}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          freight.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {freight.status === 'active' ? 'Ativo' : 'Concluído'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Preço:</span>
                          <span className="text-sm font-medium">R$ {freight.price.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Visualizações:</span>
                          <span className="text-sm font-medium">{freight.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Aplicações:</span>
                          <span className="text-sm font-medium">{freight.applications}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>Ver</span>
                        </button>
                        <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button className="btn-danger flex items-center justify-center">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagens */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Mensagens</h2>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      whileHover={{ scale: 1.01 }}
                      className={`card-premium p-4 ${
                        message.unread ? 'border-l-4 border-agro-green' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {message.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                            {message.type === 'freight' && <Truck className="w-4 h-4 text-green-600" />}
                            {message.unread && (
                              <span className="w-2 h-2 bg-agro-green rounded-full"></span>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900">{message.sender}</h3>
                          <p className="text-sm text-gray-600">{message.subject}</p>
                          <p className="text-sm text-gray-500 mt-1">{message.preview}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                          <div className="mt-2 space-x-2">
                            <button className="btn-secondary text-xs px-3 py-1">Responder</button>
                            <button className="btn-danger text-xs px-3 py-1">Excluir</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Notificações */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Notificações</h2>
                
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ scale: 1.01 }}
                      className={`card-premium p-4 ${
                        notification.read ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {notification.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                            {notification.type === 'freight' && <Truck className="w-4 h-4 text-green-600" />}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-agro-green rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-800">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Configurações */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Configurações</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="title-premium text-lg font-semibold mb-4">Perfil</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                        <input
                          type="text"
                          defaultValue={user?.name || ''}
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <input
                          type="email"
                          defaultValue={user?.email || ''}
                          className="input-premium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="tel"
                          defaultValue={user?.phone || ''}
                          className="input-premium"
                        />
                      </div>
                      <button className="btn-accent-green w-full">Salvar Alterações</button>
                    </div>
                  </div>

                  <div className="card-premium p-6">
                    <h3 className="title-premium text-lg font-semibold mb-4">Segurança</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                        <Shield className="w-4 h-4 mr-2 inline" />
                        Alterar Senha
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                        <Bell className="w-4 h-4 mr-2 inline" />
                        Configurar Notificações
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                        <CreditCard className="w-4 h-4 mr-2 inline" />
                        Métodos de Pagamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;