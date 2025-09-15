import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

const TXCDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      title: 'Vendas Totais', 
      value: 'R$ 125.430', 
      change: '+12.5%', 
      icon: <DollarSign size={24} />,
      color: 'var(--txc-green-accent)'
    },
    { 
      title: 'Produtos Vendidos', 
      value: '1.247', 
      change: '+8.2%', 
      icon: <Package size={24} />,
      color: 'var(--txc-green-accent)'
    },
    { 
      title: 'Clientes Ativos', 
      value: '89', 
      change: '+15.3%', 
      icon: <Users size={24} />,
      color: 'var(--txc-green-accent)'
    },
    { 
      title: 'Entregas', 
      value: '156', 
      change: '+5.7%', 
      icon: <Truck size={24} />,
      color: 'var(--txc-green-accent)'
    },
  ];

  const recentOrders = [
    {
      id: '#001',
      customer: 'João Silva',
      product: 'Soja Premium',
      quantity: '50 ton',
      price: 'R$ 45.000',
      status: 'Entregue',
      date: '2024-01-15',
      statusColor: 'var(--txc-green-accent)'
    },
    {
      id: '#002',
      customer: 'Maria Santos',
      product: 'Milho',
      quantity: '30 ton',
      price: 'R$ 28.500',
      status: 'Em Trânsito',
      date: '2024-01-14',
      statusColor: '#FFA500'
    },
    {
      id: '#003',
      customer: 'Pedro Costa',
      product: 'Café Arábica',
      quantity: '20 ton',
      price: 'R$ 35.000',
      status: 'Processando',
      date: '2024-01-13',
      statusColor: '#007BFF'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Pedidos', icon: <Package size={20} /> },
    { id: 'products', label: 'Produtos', icon: <TrendingUp size={20} /> },
    { id: 'customers', label: 'Clientes', icon: <Users size={20} /> },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div>
      {/* Header Section */}
      <section className="txc-section" style={{ 
        background: 'var(--txc-light-beige)', 
        paddingTop: 'var(--txc-space-2xl)',
        paddingBottom: 'var(--txc-space-xl)'
      }}>
        <div className="txc-container">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--txc-space-xl)'
              }}
            >
              <div>
                <h1 className="txc-section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--txc-space-sm)' }}>
                  Dashboard
                </h1>
                <p className="txc-section-subtitle" style={{ fontSize: '1.125rem' }}>
                  Gerencie seu agronegócio de forma inteligente
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--txc-space-md)', alignItems: 'center' }}>
                <motion.button
                  className="txc-btn txc-btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}
                >
                  <Bell size={20} />
                  Notificações
                </motion.button>
                
                <motion.button
                  className="txc-btn txc-btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}
                >
                  <Plus size={20} />
                  Novo Pedido
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 'var(--txc-space-lg)' 
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="txc-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{ 
                    position: 'relative',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    background: 'var(--txc-white)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.color,
                    borderRadius: 'var(--txc-radius-xl) var(--txc-radius-xl) 0 0'
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--txc-space-md)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--txc-gradient-accent)',
                      borderRadius: 'var(--txc-radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--txc-dark-green)',
                      boxShadow: 'var(--txc-shadow-md)'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: stat.color,
                      background: 'rgba(57, 255, 20, 0.1)',
                      padding: 'var(--txc-space-xs) var(--txc-space-sm)',
                      borderRadius: 'var(--txc-radius-md)'
                    }}>
                      {stat.change}
                    </div>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: 'var(--txc-text-dark)',
                    marginBottom: 'var(--txc-space-sm)',
                    fontFamily: 'var(--txc-font-secondary)'
                  }}>
                    {stat.value}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--txc-text-light)', 
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    {stat.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Tab Navigation */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-sm)', 
              marginBottom: 'var(--txc-space-2xl)',
              borderBottom: '1px solid #E5E5E5',
              paddingBottom: 'var(--txc-space-md)'
            }}>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--txc-space-sm)',
                    padding: 'var(--txc-space-md) var(--txc-space-lg)',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--txc-green-accent)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--txc-dark-green)' : 'var(--txc-text-dark)',
                    borderRadius: 'var(--txc-radius-lg)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all var(--txc-transition-normal)'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr', 
                  gap: 'var(--txc-space-xl)' 
                }}>
                  {/* Recent Orders */}
                  <div className="txc-card">
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 'var(--txc-space-xl)'
                    }}>
                      <h3 className="txc-card-title">Pedidos Recentes</h3>
                      <Link 
                        to="/orders" 
                        style={{ 
                          color: 'var(--txc-green-accent)', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Ver todos
                      </Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--txc-space-md)' }}>
                      {recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--txc-space-lg)',
                            background: 'var(--txc-light-beige)',
                            borderRadius: 'var(--txc-radius-lg)',
                            border: '1px solid rgba(57, 255, 20, 0.1)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--txc-text-dark)', marginBottom: 'var(--txc-space-xs)' }}>
                              {order.id} - {order.customer}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--txc-text-light)' }}>
                              {order.product} • {order.quantity}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '600', color: 'var(--txc-text-dark)', marginBottom: 'var(--txc-space-xs)' }}>
                              {order.price}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: order.statusColor,
                              fontWeight: '500'
                            }}>
                              {order.status}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="txc-card">
                    <h3 className="txc-card-title" style={{ marginBottom: 'var(--txc-space-xl)' }}>
                      Ações Rápidas
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--txc-space-md)' }}>
                      {[
                        { icon: <Plus size={20} />, label: 'Novo Produto', link: '/products/new' },
                        { icon: <Users size={20} />, label: 'Adicionar Cliente', link: '/customers/new' },
                        { icon: <Truck size={20} />, label: 'Agendar Entrega', link: '/deliveries/new' },
                        { icon: <BarChart3 size={20} />, label: 'Ver Relatórios', link: '/reports' },
                      ].map((action, index) => (
                        <motion.div
                          key={action.label}
                          whileHover={{ x: 8 }}
                          whileTap={{ x: 0 }}
                        >
                          <Link
                            to={action.link}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--txc-space-md)',
                              padding: 'var(--txc-space-md)',
                              background: 'var(--txc-light-beige)',
                              borderRadius: 'var(--txc-radius-lg)',
                              textDecoration: 'none',
                              color: 'var(--txc-text-dark)',
                              transition: 'all var(--txc-transition-normal)',
                              border: '1px solid rgba(57, 255, 20, 0.1)'
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'var(--txc-gradient-accent)',
                              borderRadius: 'var(--txc-radius-lg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--txc-dark-green)',
                              flexShrink: 0
                            }}>
                              {action.icon}
                            </div>
                            <span style={{ fontWeight: '500' }}>{action.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="txc-card"
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--txc-space-xl)'
                }}>
                  <h3 className="txc-card-title">Todos os Pedidos</h3>
                  <div style={{ display: 'flex', gap: 'var(--txc-space-md)' }}>
                    <motion.button
                      className="txc-btn txc-btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}
                    >
                      <Filter size={20} />
                      Filtrar
                    </motion.button>
                    <motion.button
                      className="txc-btn txc-btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}
                    >
                      <Download size={20} />
                      Exportar
                    </motion.button>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 'var(--txc-space-3xl)' }}>
                  <BarChart3 size={64} style={{ color: 'var(--txc-text-light)', marginBottom: 'var(--txc-space-lg)' }} />
                  <h3 style={{ color: 'var(--txc-text-dark)', marginBottom: 'var(--txc-space-md)' }}>
                    Gestão de Pedidos
                  </h3>
                  <p style={{ color: 'var(--txc-text-light)' }}>
                    Aqui você pode gerenciar todos os seus pedidos de forma centralizada
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="txc-card"
              >
                <div style={{ textAlign: 'center', padding: 'var(--txc-space-3xl)' }}>
                  <Package size={64} style={{ color: 'var(--txc-text-light)', marginBottom: 'var(--txc-space-lg)' }} />
                  <h3 style={{ color: 'var(--txc-text-dark)', marginBottom: 'var(--txc-space-md)' }}>
                    Catálogo de Produtos
                  </h3>
                  <p style={{ color: 'var(--txc-text-light)' }}>
                    Gerencie seu catálogo de produtos e commodities
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="txc-card"
              >
                <div style={{ textAlign: 'center', padding: 'var(--txc-space-3xl)' }}>
                  <Users size={64} style={{ color: 'var(--txc-text-light)', marginBottom: 'var(--txc-space-lg)' }} />
                  <h3 style={{ color: 'var(--txc-text-dark)', marginBottom: 'var(--txc-space-md)' }}>
                    Base de Clientes
                  </h3>
                  <p style={{ color: 'var(--txc-text-light)' }}>
                    Gerencie sua base de clientes e relacionamentos
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TXCDashboard;
