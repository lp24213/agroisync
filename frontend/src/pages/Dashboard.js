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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-agro-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg"
          >
            Carregando dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-16">
      <StockMarketTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.name || 'Usuário'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => logout()}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </motion.button>
            </div>
          </div>
          <h1 className="title-premium text-4xl font-bold mb-4">
            Dashboard AgroSync
          </h1>
          <p className="text-lg text-gray-600">
            Bem-vindo de volta, {user?.name || 'Usuário'}! Acompanhe suas atividades e resultados
          </p>
        </motion.div>

        {/* Estatísticas Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {[
            { icon: Package, label: 'Produtos', value: stats.products, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
            { icon: Truck, label: 'Fretes', value: stats.freights, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
            { icon: MessageSquare, label: 'Mensagens', value: stats.messages, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' },
            { icon: DollarSign, label: 'Vendas', value: stats.sales, color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-600' },
            { icon: BarChart3, label: 'Receita', value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className={`${stat.bg} rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <Icon className={`w-8 h-8 ${stat.text} mx-auto mb-3`} />
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navegação por Abas */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
                { id: 'products', name: 'Produtos', icon: Package },
                { id: 'freights', name: 'Fretes', icon: Truck },
                { id: 'messages', name: 'Mensagens', icon: MessageSquare },
                { id: 'settings', name: 'Configurações', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-agro-green text-agro-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </motion.button>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Resumo de Atividades */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="card-premium p-6"
                >
                  <h3 className="title-premium text-xl font-semibold mb-4">Resumo de Atividades</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-blue-50 rounded-lg"
                    >
                      <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{stats.products}</p>
                      <p className="text-sm text-blue-600">Produtos Ativos</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-green-50 rounded-lg"
                    >
                      <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{stats.freights}</p>
                      <p className="text-sm text-green-600">Fretes Ativos</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-purple-50 rounded-lg"
                    >
                      <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{stats.messages}</p>
                      <p className="text-sm text-purple-600">Mensagens</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Gráfico de Receita */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-premium p-6"
                >
                  <h3 className="title-premium text-xl font-semibold mb-4">Receita dos Últimos 6 Meses</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de Receita (Integração futura com Chart.js)</p>
                  </div>
                </motion.div>
              </motion.div>
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