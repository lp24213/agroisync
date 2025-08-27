import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, Truck, MessageSquare, Settings, User, 
  Plus, Eye, Edit, Trash, DollarSign, 
  BarChart3, Bell, CreditCard, Shield, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
          from: 'João Silva',
          subject: 'Interesse na Soja Premium',
          preview: 'Olá! Gostaria de saber mais sobre...',
          unread: true,
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: 2,
          from: 'Maria Santos',
          subject: 'Consulta sobre frete',
          preview: 'Preciso de transporte para...',
          unread: false,
          timestamp: new Date(Date.now() - 7200000)
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'product',
          message: 'Seu produto "Soja Premium" recebeu uma nova visualização',
          timestamp: new Date(Date.now() - 1800000),
          read: false
        },
        {
          id: 2,
          type: 'freight',
          message: 'Novo candidato para seu frete São Paulo → Mato Grosso',
          timestamp: new Date(Date.now() - 3600000),
          read: false
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'products', name: 'Meus Produtos', icon: Package },
    { id: 'freights', name: 'Meus Fretes', icon: Truck },
    { id: 'messages', name: 'Mensagens', icon: MessageSquare },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header do Dashboard */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-agro-green to-agro-yellow rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Painel de Controle
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bem-vindo, {user?.name || 'Usuário'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegação por Abas */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-agro-green text-agro-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Conteúdo das Abas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Visão Geral */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.products}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Truck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Fretes Ativos</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.freights}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Mensagens</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.messages}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Receita Total</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.revenue)}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Ações Rápidas */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/cadastro-produto"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Cadastrar Produto</p>
                        <p className="text-sm text-gray-600">Adicione um novo produto</p>
                      </div>
                    </Link>

                    <Link
                      to="/agroconecta"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <Truck className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Anunciar Frete</p>
                        <p className="text-sm text-gray-600">Cadastre um novo frete</p>
                      </div>
                    </Link>

                    <Link
                      to="/mensageria"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Ver Mensagens</p>
                        <p className="text-sm text-gray-600">Acesse sua caixa de entrada</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Atividade Recente */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Atividade Recente</h3>
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-400' : 'bg-agro-green'}`}></div>
                        <p className="text-sm text-gray-700 flex-1">{notification.message}</p>
                        <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Meus Produtos */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="title-premium text-2xl font-bold">Meus Produtos</h2>
                  <Link
                    to="/cadastro-produto"
                    className="btn-accent-green flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Produto</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="card-premium overflow-hidden"
                    >
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                            {product.status === 'active' ? 'Ativo' : 'Pendente'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <p className="text-lg font-bold text-agro-green mb-3">{formatCurrency(product.price)}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>👁️ {product.views} visualizações</span>
                          <span>❤️ {product.favorites} favoritos</span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                            <Eye className="w-4 h-4 mr-1 inline" />
                            Ver
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                            <Edit className="w-4 h-4 mr-1 inline" />
                            Editar
                          </button>
                          <button className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Meus Fretes */}
            {activeTab === 'freights' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="title-premium text-2xl font-bold">Meus Fretes</h2>
                  <Link
                    to="/agroconecta"
                    className="btn-accent-green flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Frete</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {freights.map((freight) => (
                    <motion.div
                      key={freight.id}
                      whileHover={{ scale: 1.01 }}
                      className="card-premium p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {freight.origin} → {freight.destination}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">Carga: {freight.cargo}</p>
                          <p className="text-lg font-bold text-agro-green">{formatCurrency(freight.price)}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(freight.status)}`}>
                          {freight.status === 'active' ? 'Ativo' : 'Concluído'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>👁️ {freight.views} visualizações</span>
                        <span>📝 {freight.applications} candidatos</span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                          <Eye className="w-4 h-4 mr-1 inline" />
                          Ver Detalhes
                        </button>
                        <button className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-agro-green hover:text-agro-green transition-colors">
                          <Edit className="w-4 h-4 mr-1 inline" />
                          Editar
                        </button>
                        <button className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
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
                <div className="flex justify-between items-center">
                  <h2 className="title-premium text-2xl font-bold">Mensagens</h2>
                  <Link
                    to="/mensageria"
                    className="btn-accent-green flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ver Todas</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      whileHover={{ scale: 1.01 }}
                      className={`card-premium p-4 cursor-pointer transition-colors ${
                        message.unread ? 'border-l-4 border-agro-green bg-green-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{message.from}</h3>
                            {message.unread && (
                              <span className="w-2 h-2 bg-agro-green rounded-full"></span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800 mb-1">{message.subject}</p>
                          <p className="text-sm text-gray-600">{message.preview}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
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