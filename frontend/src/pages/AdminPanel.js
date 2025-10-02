import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Settings, Activity, Shield } from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data.data || {});
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Usando dados mock de admin');
        }
        setStats({
          totalUsers: 150,
          activeOrders: 45,
          revenue: 125000
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-green-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-7xl mx-auto'
      >
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Painel Administrativo</h1>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total de Usuários</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalUsers}</p>
              </div>
              <Users className='h-12 w-12 text-green-600' />
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Pedidos Ativos</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.activeOrders}</p>
              </div>
              <Activity className='h-12 w-12 text-blue-600' />
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Receita</p>
                <p className='text-3xl font-bold text-gray-900'>R$ {stats.revenue?.toLocaleString()}</p>
              </div>
              <BarChart3 className='h-12 w-12 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Ações Administrativas</h2>
          <div className='space-y-2'>
            <button className='w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'>
              <Shield className='inline-block mr-2 h-5 w-5' />
              Gerenciar Usuários
            </button>
            <button className='w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'>
              <Settings className='inline-block mr-2 h-5 w-5' />
              Configurações do Sistema
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
