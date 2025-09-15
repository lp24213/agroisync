import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Truck,
  BarChart3,
  Bell,
  Filter,
  Download,
  Plus
} from 'lucide-react';

const AgroisyncDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      title: 'Vendas Totais', 
      value: 'R$ 125.430', 
      change: '+12.5%', 
      icon: <DollarSign size={24} />,
      color: 'var(--agro-green-accent)'
    },
    { 
      title: 'Produtos Vendidos', 
      value: '1.247', 
      change: '+8.2%', 
      icon: <Package size={24} />,
      color: 'var(--agro-green-accent)'
    },
    { 
      title: 'Clientes Ativos', 
      value: '89', 
      change: '+15.3%', 
      icon: <Users size={24} />,
      color: 'var(--agro-green-accent)'
    },
    { 
      title: 'Entregas', 
      value: '156', 
      change: '+5.7%', 
      icon: <Truck size={24} />,
      color: 'var(--agro-green-accent)'
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
      statusColor: 'var(--agro-green-accent)'
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
      <section className="agro-section" style={{ 
        background: 'var(--agro-light-beige)', 
        paddingTop: 'var(--agro-space-2xl)',
        paddingBottom: 'var(--agro-space-xl)'
      }}>
        <div className="agro-container">
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
                marginBottom: 'var(--agro-space-xl)'
              }}
            >
              <div>
                <h1 className="agro-section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--agro-space-sm)' }}>
                  Dashboard
                </h1>
                <p className="agro-section-subtitle" style={{ fontSize: '1.125rem' }}>
                  Gerencie seu agronegócio de forma inteligente
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--agro-space-md)', alignItems: 'center' }}>
                <motion.button
                  className="agro-btn agro-btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-sm)' }}
                >
                  <Bell size={20} />
                  Notificações
                </motion.button>
                
                <motion.button
                  className="agro-btn agro-btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-sm)' }}
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
                gap: 'var(--agro-space-lg)' 
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="agro-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{ 
                    position: 'relative',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    background: 'var(--agro-white)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.color,
                    borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--agro-space-md)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--agro-gradient-accent)',
                      borderRadius: 'var(--agro-radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--agro-dark-green)',
                      boxShadow: 'var(--agro-shadow-md)'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: stat.color,
                      background: 'rgba(57, 255, 20, 0.1)',
                      padding: 'var(--agro-space-xs) var(--agro-space-sm)',
                      borderRadius: 'var(--agro-radius-md)'
                    }}>
                      {stat.change}
                    </div>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: 'var(--agro-text-dark)',
                    marginBottom: 'var(--agro-space-sm)',
                    fontFamily: 'var(--agro-font-secondary)'
                  }}>
                    {stat.value}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--agro-text-light)', 
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
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Tab Navigation */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--agro-space-sm)', 
              marginBottom: 'var(--agro-space-2xl)',
              borderBottom: '1px solid #E5E5E5',
              paddingBottom: 'var(--agro-space-md)'
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
                    gap: 'var(--agro-space-sm)',
                    padding: 'var(--agro-space-md) var(--agro-space-lg)',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--agro-green-accent)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--agro-dark-green)' : 'var(--agro-text-dark)',
                    borderRadius: 'var(--agro-radius-lg)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all var(--agro-transition-normal)'
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
                  gap: 'var(--agro-space-xl)' 
                }}>
                  {/* Recent Orders */}
                  <div className="agro-card">
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 'var(--agro-space-xl)'
                    }}>
                      <h3 className="agro-card-title">Pedidos Recentes</h3>
                      <Link 
                        to="/orders" 
                        style={{ 
                          color: 'var(--agro-green-accent)', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Ver todos
                      </Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--agro-space-md)' }}>
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
                            padding: 'var(--agro-space-lg)',
                            background: 'var(--agro-light-beige)',
                            borderRadius: 'var(--agro-radius-lg)',
                            border: '1px solid rgba(57, 255, 20, 0.1)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--agro-text-dark)', marginBottom: 'var(--agro-space-xs)' }}>
                              {order.id} - {order.customer}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--agro-text-light)' }}>
                              {order.product} • {order.quantity}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '600', color: 'var(--agro-text-dark)', marginBottom: 'var(--agro-space-xs)' }}>
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
                  <div className="agro-card">
                    <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-xl)' }}>
                      Ações Rápidas
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--agro-space-md)' }}>
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
                              gap: 'var(--agro-space-md)',
                              padding: 'var(--agro-space-md)',
                              background: 'var(--agro-light-beige)',
                              borderRadius: 'var(--agro-radius-lg)',
                              textDecoration: 'none',
                              color: 'var(--agro-text-dark)',
                              transition: 'all var(--agro-transition-normal)',
                              border: '1px solid rgba(57, 255, 20, 0.1)'
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'var(--agro-gradient-accent)',
                              borderRadius: 'var(--agro-radius-lg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--agro-dark-green)',
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
                className="agro-card"
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--agro-space-xl)'
                }}>
                  <h3 className="agro-card-title">Todos os Pedidos</h3>
                  <div style={{ display: 'flex', gap: 'var(--agro-space-md)' }}>
                    <motion.button
                      className="agro-btn agro-btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-sm)' }}
                    >
                      <Filter size={20} />
                      Filtrar
                    </motion.button>
                    <motion.button
                      className="agro-btn agro-btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-sm)' }}
                    >
                      <Download size={20} />
                      Exportar
                    </motion.button>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 'var(--agro-space-3xl)' }}>
                  <BarChart3 size={64} style={{ color: 'var(--agro-text-light)', marginBottom: 'var(--agro-space-lg)' }} />
                  <h3 style={{ color: 'var(--agro-text-dark)', marginBottom: 'var(--agro-space-md)' }}>
                    Gestão de Pedidos
                  </h3>
                  <p style={{ color: 'var(--agro-text-light)' }}>
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
                className="agro-card"
              >
                <div style={{ textAlign: 'center', padding: 'var(--agro-space-3xl)' }}>
                  <Package size={64} style={{ color: 'var(--agro-text-light)', marginBottom: 'var(--agro-space-lg)' }} />
                  <h3 style={{ color: 'var(--agro-text-dark)', marginBottom: 'var(--agro-space-md)' }}>
                    Catálogo de Produtos
                  </h3>
                  <p style={{ color: 'var(--agro-text-light)' }}>
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
                className="agro-card"
              >
                <div style={{ textAlign: 'center', padding: 'var(--agro-space-3xl)' }}>
                  <Users size={64} style={{ color: 'var(--agro-text-light)', marginBottom: 'var(--agro-space-lg)' }} />
                  <h3 style={{ color: 'var(--agro-text-dark)', marginBottom: 'var(--agro-space-md)' }}>
                    Base de Clientes
                  </h3>
                  <p style={{ color: 'var(--agro-text-light)' }}>
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

export default AgroisyncDashboard;
