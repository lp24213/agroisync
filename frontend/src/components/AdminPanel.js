import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  XCircle,
  BarChart3,
  Settings,
  Activity,
  Shield,
  Eye,
  Bot,
  Truck,
  Download,
  Trash2,
  Search,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [freightOrders, setFreightOrders] = useState([]);
  const [chatStats, setChatStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'freights', label: 'Fretes', icon: Truck },
    { id: 'chat', label: 'Chat IA', icon: Bot },
    { id: 'audit', label: 'Auditoria', icon: Shield },
    { id: 'system', label: 'Sistema', icon: Settings }
  ];

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      try {
        // Carregar estatísticas gerais
        const [statsRes, usersRes, auditRes, freightsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/users'),
          axios.get('/api/audit-logs/stats', {
            params: {
              startDate: dateRange.start,
              endDate: dateRange.end
            }
          }),
          axios.get('/api/freight-orders')
        ]);

        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setAuditLogs(auditRes.data.data);
        setFreightOrders(freightsRes.data.data);

        // Estatísticas do chat
        setChatStats({
          totalConversations: 1247,
          activeConversations: 892,
          messagesToday: 3456,
          avgResponseTime: 2.5,
          aiAccuracy: 94.2
        });
      } catch (error) {
        console.error('Erro ao carregar dados administrativos:', error);
        toast.error('Erro ao carregar dados administrativos');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [dateRange.start, dateRange.end]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Carregar estatísticas gerais
      const [statsRes, usersRes, auditRes, freightsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/audit-logs'),
        axios.get('/api/freight-orders')
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setAuditLogs(auditRes.data.data);
      setFreightOrders(freightsRes.data.data);

      // Estatísticas do chat
      setChatStats({
        totalConversations: 1247,
        activeConversations: 892,
        messagesToday: 3456,
        avgResponseTime: 2.5,
        aiAccuracy: 94.2
      });
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
      toast.error('Erro ao carregar dados administrativos');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAuditLogs = async () => {
    try {
      const response = await axios.post('/api/audit-logs/export', {
        startDate: dateRange.start,
        endDate: dateRange.end
      });

      // Criar e baixar arquivo
      const blob = new Blob([JSON.stringify(response.data.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${dateRange.start}-${dateRange.end}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Logs de auditoria exportados com sucesso');
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      toast.error('Erro ao exportar logs de auditoria');
    }
  };

  const handleCleanupAuditLogs = async () => {
    if (!window.confirm('Tem certeza que deseja limpar logs expirados?')) {
      return;
    }

    try {
      const response = await axios.delete('/api/audit-logs/cleanup');
      toast.success(response.data.message);
      loadAdminData();
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
      toast.error('Erro ao limpar logs expirados');
    }
  };

  const renderOverview = () => (
    <div className='space-y-6'>
      {/* Estatísticas Principais */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total de Usuários</p>
              <p className='text-3xl font-bold text-gray-900'>{stats.totalUsers || 0}</p>
            </div>
            <div className='rounded-full bg-blue-100 p-3'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
          </div>
          <div className='mt-4 flex items-center'>
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
            <span className='text-sm text-green-600'>+12% este mês</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Fretes Ativos</p>
              <p className='text-3xl font-bold text-gray-900'>{freightOrders.length}</p>
            </div>
            <div className='rounded-full bg-green-100 p-3'>
              <Truck className='h-6 w-6 text-green-600' />
            </div>
          </div>
          <div className='mt-4 flex items-center'>
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
            <span className='text-sm text-green-600'>+8% esta semana</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Conversas IA</p>
              <p className='text-3xl font-bold text-gray-900'>{chatStats.totalConversations || 0}</p>
            </div>
            <div className='rounded-full bg-purple-100 p-3'>
              <Bot className='h-6 w-6 text-purple-600' />
            </div>
          </div>
          <div className='mt-4 flex items-center'>
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
            <span className='text-sm text-green-600'>+15% hoje</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Logs de Auditoria</p>
              <p className='text-3xl font-bold text-gray-900'>{auditLogs.length || 0}</p>
            </div>
            <div className='rounded-full bg-orange-100 p-3'>
              <Shield className='h-6 w-6 text-orange-600' />
            </div>
          </div>
          <div className='mt-4 flex items-center'>
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
            <span className='text-sm text-green-600'>+5% hoje</span>
          </div>
        </motion.div>
      </div>

      {/* Gráficos e Métricas */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Atividade Recente</h3>
          <div className='space-y-3'>
            {auditLogs.slice(0, 5).map((log, index) => (
              <div key={index} className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                <div className='flex items-center'>
                  <div className='mr-3 rounded-full bg-blue-100 p-2'>
                    <Activity className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{log.action}</p>
                    <p className='text-xs text-gray-500'>{log.resource}</p>
                  </div>
                </div>
                <span className='text-xs text-gray-500'>{new Date(log.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='rounded-xl border border-gray-100 bg-white p-6 shadow-lg'
        >
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Status do Sistema</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Uptime</span>
              <span className='text-sm font-medium text-green-600'>99.9%</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Latência Média</span>
              <span className='text-sm font-medium text-blue-600'>45ms</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>CPU</span>
              <span className='text-sm font-medium text-yellow-600'>23%</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Memória</span>
              <span className='text-sm font-medium text-green-600'>67%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Gerenciamento de Usuários</h2>
        <div className='flex space-x-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder='Buscar usuários...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Usuário
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Tipo</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Última Atividade
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {users
                .filter(
                  user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                  <tr key={user._id} className='hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                          <span className='text-sm font-medium text-gray-600'>{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                          <div className='text-sm text-gray-500'>ID: {user._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>{user.email}</td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span className='inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                        {user.businessType || 'N/A'}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                      {user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                      <button className='mr-3 text-blue-600 hover:text-blue-900'>
                        <Eye className='h-4 w-4' />
                      </button>
                      <button className='text-red-600 hover:text-red-900'>
                        <XCircle className='h-4 w-4' />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Logs de Auditoria</h2>
        <div className='flex space-x-3'>
          <input
            type='date'
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className='rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />
          <input
            type='date'
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className='rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleExportAuditLogs}
            className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            <Download className='h-4 w-4' />
            <span>Exportar</span>
          </button>
          <button
            onClick={handleCleanupAuditLogs}
            className='flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700'
          >
            <Trash2 className='h-4 w-4' />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Ação</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Recurso
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Sensibilidade
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>PII</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Data</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>IP</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {auditLogs.map(log => (
                <tr key={log._id} className='hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span className='text-sm font-medium text-gray-900'>{log.action}</span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>{log.resource}</td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        log.sensitivityLevel === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : log.sensitivityLevel === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : log.sensitivityLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {log.sensitivityLevel}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        log.containsPII ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.containsPII ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{log.sessionInfo?.ip || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'audit':
        return renderAudit();
      default:
        return (
          <div className='py-12 text-center'>
            <AlertCircle className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='text-gray-500'>Conteúdo em desenvolvimento</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Painel Administrativo</h1>
              <p className='mt-1 text-gray-600'>Gerencie usuários, fretes e sistema</p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2 text-sm text-gray-500'>
                <Shield className='h-4 w-4' />
                <span>Acesso Administrativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <nav className='flex space-x-8'>
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
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
