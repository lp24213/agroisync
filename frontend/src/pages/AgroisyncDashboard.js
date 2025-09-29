import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, UserCheck, Truck, Store, Crown, Shield, BarChart3, RefreshCw, Key, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CryptoRoutesStatus from '../components/CryptoRoutesStatus';
import CryptoHash from '../components/CryptoHash';

const AgroisyncDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCryptoRoutes, setShowCryptoRoutes] = useState(false);

  const fetchDashboardData = async () => {
    // Verificar se é super-admin
    if (!user || user.role !== 'super-admin') {
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const api = process.env.REACT_APP_API_URL || '/api';
      
      const [dashboardRes, usersRes, paymentsRes] = await Promise.all([
        fetch(`${api}/auth/admin/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${api}/auth/admin/users?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${api}/auth/admin/payments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (dashboardRes.ok) {
        const dashboard = await dashboardRes.json();
        setDashboardData(dashboard.data);
      }

      if (usersRes.ok) {
        const users = await usersRes.json();
        setUsersData(users.data);
      }

      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        setPaymentsData(payments.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Verificar se é super-admin
  if (!user || user.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Apenas super-admins podem acessar este painel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados do painel...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600 mt-1">Bem-vindo, {user.name}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'payments', label: 'Pagamentos', icon: DollarSign },
            { id: 'crypto', label: 'Rotas Criptografadas', icon: Lock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Visão Geral */}
          {activeTab === 'overview' && dashboardData && (
            <>
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeUsers}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Crown className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Usuários Pagantes</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.paidUsers}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Usuários Gratuitos</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.freeUsers}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Estatísticas por Tipo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Tipo de Negócio</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-gray-700">Transportadores</span>
                      </div>
                      <span className="font-semibold">{dashboardData.stats.transporters}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Store className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-gray-700">Produtores</span>
                      </div>
                      <span className="font-semibold">{dashboardData.stats.producers}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuários Recentes</h3>
                  <div className="space-y-2">
                    {dashboardData.recentUsers.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-gray-500 ml-2">({user.email})</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.businessType === 'transporter' ? 'bg-blue-100 text-blue-800' :
                          user.businessType === 'producer' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.businessType}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Usuários */}
          {activeTab === 'users' && usersData && (
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Todos os Usuários</h3>
                <p className="text-gray-600 mt-1">Total: {usersData.pagination.total} usuários</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersData.users.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.businessType === 'transporter' ? 'bg-blue-100 text-blue-800' :
                            user.businessType === 'producer' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.businessType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                            user.plan === 'pro' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Pagamentos */}
          {activeTab === 'payments' && paymentsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas por Plano</h3>
                <div className="space-y-3">
                  {paymentsData.planStats.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{plan._id}</span>
                      <div className="text-right">
                        <div className="font-semibold">{plan.count} usuários</div>
                        <div className="text-sm text-gray-500">{plan.active} ativos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Tipo de Negócio</h3>
                <div className="space-y-3">
                  {paymentsData.businessStats.map((business, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{business._id}</span>
                      <div className="text-right">
                        <div className="font-semibold">{business.count} usuários</div>
                        <div className="text-sm text-gray-500">{business.paid} pagantes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Rotas Criptografadas */}
          {activeTab === 'crypto' && (
            <motion.div variants={itemVariants}>
              <CryptoRoutesStatus />
            </motion.div>
          )}
        </motion.div>
        <div className="mt-8 flex justify-center">
          <CryptoHash pageName="dashboard" style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default AgroisyncDashboard;
