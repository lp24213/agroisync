import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus, TrendingUp, DollarSign, Bell, LogOut, Eye, Edit, BarChart3, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logger from '../../services/logger';

const SellerPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados mockados
      setProducts([
        {
          id: 1,
          name: 'Soja Premium',
          price: 150.0,
          stock: 1000,
          status: 'active',
          image: '/images/soja.jpg',
          category: 'Grãos',
          description: 'Soja de alta qualidade para exportação'
        },
        {
          id: 2,
          name: 'Milho Híbrido',
          price: 85.0,
          stock: 500,
          status: 'active',
          image: '/images/milho.jpg',
          category: 'Grãos',
          description: 'Milho híbrido para alimentação animal'
        }
      ]);

      setOrders([
        {
          id: 1,
          customer: 'Fazenda São João',
          product: 'Soja Premium',
          quantity: 100,
          total: 15000.0,
          status: 'pending',
          date: '2024-01-15'
        },
        {
          id: 2,
          customer: 'Cooperativa Rural',
          product: 'Milho Híbrido',
          quantity: 200,
          total: 17000.0,
          status: 'completed',
          date: '2024-01-14'
        }
      ]);

      setAnalytics({
        totalSales: 32000.0,
        totalOrders: 2,
        totalProducts: 2,
        monthlyGrowth: 15.5
      });

      setNotifications([
        {
          id: 1,
          title: 'Novo pedido recebido',
          message: 'Fazenda São João fez um pedido de Soja Premium',
          type: 'order',
          read: false,
          date: '2024-01-15T10:30:00Z'
        }
      ]);
    } catch (error) {
      logger.error('Erro ao carregar dados do vendedor', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <header className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>Painel do Vendedor</h1>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Bell className='h-6 w-6 text-gray-400' />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-700'>{user?.name}</span>
                <button onClick={handleLogout} className='p-2 text-gray-400 hover:text-gray-600'>
                  <LogOut className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-lg bg-white p-6 shadow'
          >
            <div className='flex items-center'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <DollarSign className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Vendas Totais</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  R$ {analytics.totalSales?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='rounded-lg bg-white p-6 shadow'
          >
            <div className='flex items-center'>
              <div className='rounded-lg bg-green-100 p-2'>
                <ShoppingCart className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pedidos</p>
                <p className='text-2xl font-semibold text-gray-900'>{analytics.totalOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='rounded-lg bg-white p-6 shadow'
          >
            <div className='flex items-center'>
              <div className='rounded-lg bg-purple-100 p-2'>
                <Package className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Produtos</p>
                <p className='text-2xl font-semibold text-gray-900'>{analytics.totalProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='rounded-lg bg-white p-6 shadow'
          >
            <div className='flex items-center'>
              <div className='rounded-lg bg-orange-100 p-2'>
                <TrendingUp className='h-6 w-6 text-orange-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Crescimento</p>
                <p className='text-2xl font-semibold text-gray-900'>+{analytics.monthlyGrowth}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className='rounded-lg bg-white shadow'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8 px-6'>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className='p-6'>
            <AnimatePresence mode='wait'>
              {activeTab === 'products' && (
                <motion.div
                  key='products'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                >
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-medium text-gray-900'>Meus Produtos</h3>
                    <button className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                      <Plus className='h-4 w-4' />
                      <span>Adicionar Produto</span>
                    </button>
                  </div>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {products.map(product => (
                      <div key={product.id} className='rounded-lg bg-gray-50 p-4'>
                        <div className='mb-2 flex items-start justify-between'>
                          <h4 className='font-medium text-gray-900'>{product.name}</h4>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className='mb-2 text-sm text-gray-600'>{product.description}</p>
                        <p className='mb-2 text-lg font-semibold text-gray-900'>
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className='mb-4 text-sm text-gray-500'>Estoque: {product.stock} unidades</p>
                        <div className='flex space-x-2'>
                          <button className='flex flex-1 items-center justify-center space-x-1 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700'>
                            <Eye className='h-4 w-4' />
                            <span>Ver</span>
                          </button>
                          <button className='flex flex-1 items-center justify-center space-x-1 rounded bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700'>
                            <Edit className='h-4 w-4' />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key='orders'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                >
                  <h3 className='text-lg font-medium text-gray-900'>Pedidos</h3>

                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Cliente
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Produto
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Quantidade
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Total
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Status
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                              {order.customer}
                            </td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{order.product}</td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{order.quantity}</td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                              R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className='whitespace-nowrap px-6 py-4'>
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order.status === 'completed' ? 'Concluído' : 'Pendente'}
                              </span>
                            </td>
                            <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                              {new Date(order.date).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key='analytics'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                >
                  <h3 className='text-lg font-medium text-gray-900'>Analytics</h3>
                  <div className='py-12 text-center'>
                    <BarChart3 className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                    <p className='text-gray-500'>Gráficos e análises detalhadas em breve</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key='notifications'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                >
                  <h3 className='text-lg font-medium text-gray-900'>Notificações</h3>

                  <div className='space-y-3'>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`rounded-lg border p-4 ${
                          notification.read ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className='flex items-start justify-between'>
                          <div>
                            <h4 className='font-medium text-gray-900'>{notification.title}</h4>
                            <p className='mt-1 text-sm text-gray-600'>{notification.message}</p>
                            <p className='mt-2 text-xs text-gray-500'>
                              {new Date(notification.date).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          {!notification.read && <div className='h-2 w-2 rounded-full bg-blue-600'></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
