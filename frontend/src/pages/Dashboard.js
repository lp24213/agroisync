import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';

import { 
  MessageCircle, Package, Truck, User, 
  Plus, Eye, Edit, Trash,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { userProfile } = usePayment();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mock para desenvolvimento
      setMessages([
        {
          id: 1,
          from: 'joao@email.com',
          subject: 'Interesse no produto Soja Premium',
          content: 'Gostaria de mais informações sobre o produto...',
          date: '2024-01-15',
          read: false,
          type: 'received'
        },
        {
          id: 2,
          to: 'maria@email.com',
          subject: 'Consulta sobre frete',
          content: 'Preciso de frete para São Paulo...',
          date: '2024-01-14',
          read: true,
          type: 'sent'
        }
      ]);

      if (userProfile?.userType === 'loja' && userProfile?.userCategory === 'anunciante') {
        setProducts([
          {
            id: 1,
            name: 'Soja Premium',
            description: 'Soja de alta qualidade para exportação',
            price: 180.00,
            stock: 1000,
            status: 'active'
          }
        ]);
      }

      if (userProfile?.userType === 'agroconecta' && userProfile?.userCategory === 'freteiro') {
        setFreights([
          {
            id: 1,
            origin: 'São Paulo',
            destination: 'Rio de Janeiro',
            value: 2500.00,
            vehicle: 'Scania R500',
            status: 'available'
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  // Funções para uso futuro - comentadas para evitar warnings do ESLint
  // const canSendMessage = () => {
  //   if (paymentStatus.planType === 'comprador') {
  //     return paymentStatus.freeProductsRemaining > 0;
  //   }
  //   return paymentStatus.isActive;
  // };

  // const consumeFreeProduct = async () => {
  //   try {
  //     const result = await getFreeProductInfo();
  //     if (result.success && result.freeProductsRemaining > 0) {
  //       return { success: true };
  //     }
  //     return { success: false, message: 'Produtos gratuitos esgotados' };
  //   } catch (error) {
  //     return { success: false, message: 'Erro ao verificar produtos gratuitos' };
  //   }
  // };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className="card-premium p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Mensagens</p>
            <p className="text-2xl font-bold text-slate-900">{messages.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className="card-premium p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Produtos</p>
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className="card-premium p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-agro-gold to-tech-blue rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Fretes</p>
            <p className="text-2xl font-bold text-slate-900">{freights.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className="card-premium p-6"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-agro-brown to-agro-gold rounded-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Avaliações</p>
            <p className="text-2xl font-bold text-slate-900">4.8</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Mensagens</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Nova Mensagem
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    message.type === 'received' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {message.type === 'received' ? 'Recebida' : 'Enviada'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{message.date}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {message.type === 'received' ? `De: ${message.from}` : `Para: ${message.to}`}
                </h4>
                <p className="text-sm font-medium text-gray-900 mb-2">{message.subject}</p>
                <p className="text-sm text-gray-600">{message.content}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Novo Produto
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">Estoque: {product.stock}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFreights = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Fretes</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Novo Frete
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {freights.map((freight) => (
          <div key={freight.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {freight.origin} → {freight.destination}
                </h4>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-green-600">R$ {freight.value.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">Veículo: {freight.vehicle}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    freight.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {freight.status === 'available' ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo de volta, {user.name}! Gerencie suas atividades e acompanhe suas métricas.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'messages', label: 'Mensagens', icon: MessageCircle },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'freights', label: 'Fretes', icon: Truck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'freights' && renderFreights()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;