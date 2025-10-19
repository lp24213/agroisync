import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Settings, Activity, Shield, Search, Edit, Trash2, Ban, X, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getApiUrl } from '../config/constants';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Buscar token do admin
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(getApiUrl('/admin/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
      console.error(error);
    }
  };

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(getApiUrl(`/admin/users?search=${searchTerm}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar bloqueios
  const loadBlocks = async () => {
    try {
      const token = getToken();
      const response = await axios.get(getApiUrl('/admin/blocks'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlocks(response.data.blocks || []);
    } catch (error) {
      toast.error('Erro ao carregar bloqueios');
      console.error(error);
    }
  };

  // Deletar usuário
  const deleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/users/${userId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuário deletado com sucesso');
      loadUsers();
      loadStats();
    } catch (error) {
      toast.error('Erro ao deletar usuário');
      console.error(error);
    }
  };

  // Bloquear identificador
  const blockIdentifier = async (type, value, reason) => {
    try {
      const token = getToken();
      await axios.post(getApiUrl('/admin/block'), {
        type,
        value,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${type.toUpperCase()} bloqueado com sucesso`);
      loadBlocks();
      setShowBlockModal(false);
    } catch (error) {
      toast.error('Erro ao bloquear');
      console.error(error);
    }
  };

  // Desbloquear
  const unblock = async (blockId) => {
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/blocks/${blockId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bloqueio removido');
      loadBlocks();
    } catch (error) {
      toast.error('Erro ao remover bloqueio');
      console.error(error);
    }
  };

  useEffect(() => {
    loadStats();
    loadUsers();
    loadBlocks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => loadUsers(), 500);
      return () => clearTimeout(timer);
    } else {
      loadUsers();
    }
  }, [searchTerm]);

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-7xl mx-auto'
      >
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>🛡️ Painel Administrativo</h1>
          <div className='flex gap-2'>
            <button
              onClick={() => setShowBlockModal(true)}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2'
            >
              <Ban className='h-4 w-4' />
              Bloquear Identificador
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex gap-2 mb-6 border-b border-gray-200'>
          {[
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'blocks', label: 'Bloqueios', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className='h-4 w-4' />
              {tab.label}
            </button>
          ))}
        </div>

        {/* STATS TAB */}
        {activeTab === 'stats' && stats && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-semibold'>Total de Usuários</p>
                  <p className='text-3xl font-bold text-gray-900'>{stats.totalUsers}</p>
                  <p className='text-xs text-gray-400 mt-1'>Pagos: {stats.paidUsers}</p>
                </div>
                <Users className='h-12 w-12 text-green-600' />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-semibold'>Produtos Cadastrados</p>
                  <p className='text-3xl font-bold text-gray-900'>{stats.totalProducts}</p>
                  <p className='text-xs text-gray-400 mt-1'>Hoje: {stats.usersToday}</p>
                </div>
                <Activity className='h-12 w-12 text-blue-600' />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-semibold'>Fretes / Bloqueios</p>
                  <p className='text-3xl font-bold text-gray-900'>{stats.totalFreights}</p>
                  <p className='text-xs text-gray-400 mt-1'>Bloqueios: {stats.totalBlocks}</p>
                </div>
                <Shield className='h-12 w-12 text-red-600' />
              </div>
            </motion.div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            {/* Busca */}
            <div className='mb-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Buscar por email, nome, CPF, CNPJ...'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Tabela de usuários */}
            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200 bg-gray-50'>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Email</th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Nome</th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Empresa</th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Plano</th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Status</th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className='border-b border-gray-100 hover:bg-gray-50'>
                        <td className='px-4 py-3 text-sm text-gray-900'>{user.email}</td>
                        <td className='px-4 py-3 text-sm text-gray-900'>{user.name || '-'}</td>
                        <td className='px-4 py-3 text-sm text-gray-900'>{user.company || '-'}</td>
                        <td className='px-4 py-3 text-sm'>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.plan === 'inicial' || !user.plan ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                          }`}>
                            {user.plan || 'Inicial'}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          {user.plan_active ? (
                            <Check className='h-5 w-5 text-green-600' />
                          ) : (
                            <X className='h-5 w-5 text-red-600' />
                          )}
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              className='text-blue-600 hover:text-blue-800'
                              title='Editar'
                            >
                              <Edit className='h-4 w-4' />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className='text-red-600 hover:text-red-800'
                              title='Deletar'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className='text-center py-12'>
                    <AlertCircle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600'>Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BLOCKS TAB */}
        {activeTab === 'blocks' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Identificadores Bloqueados</h3>
            <div className='space-y-2'>
              {blocks.map((block) => (
                <div key={block.id} className='flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <div>
                    <p className='font-semibold text-red-900'>{block.type.toUpperCase()}: {block.value}</p>
                    <p className='text-sm text-red-700'>Motivo: {block.reason}</p>
                    <p className='text-xs text-red-600'>Bloqueado em: {new Date(block.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <button
                    onClick={() => unblock(block.id)}
                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold'
                  >
                    Desbloquear
                  </button>
                </div>
              ))}
              {blocks.length === 0 && (
                <div className='text-center py-12'>
                  <Shield className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600'>Nenhum bloqueio ativo</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* MODAL DE BLOQUEIO */}
      {showBlockModal && (
        <BlockModal
          onClose={() => setShowBlockModal(false)}
          onBlock={blockIdentifier}
        />
      )}
    </div>
  );

  async function deleteUser(userId) {
    if (!window.confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/users/${userId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuário deletado com sucesso');
      loadUsers();
      loadStats();
    } catch (error) {
      toast.error('Erro ao deletar usuário');
      console.error(error);
    }
  }

  async function unblock(blockId) {
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/blocks/${blockId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bloqueio removido');
      loadBlocks();
    } catch (error) {
      toast.error('Erro ao remover bloqueio');
      console.error(error);
    }
  }
};

// Modal de Bloqueio
function BlockModal({ onClose, onBlock }) {
  const [type, setType] = useState('cpf');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) {
      toast.error('Preencha o valor a ser bloqueado');
      return;
    }
    onBlock(type, value, reason);
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white rounded-xl p-6 max-w-md w-full mx-4'
      >
        <h3 className='text-xl font-bold text-gray-900 mb-4'>Bloquear Identificador</h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2'
            >
              <option value='cpf'>CPF</option>
              <option value='cnpj'>CNPJ</option>
              <option value='ie'>IE (Inscrição Estadual)</option>
              <option value='email'>Email</option>
            </select>
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Valor</label>
            <input
              type='text'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Digite o ${type.toUpperCase()} a ser bloqueado`}
              className='w-full border border-gray-300 rounded-lg px-4 py-2'
            />
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Motivo (opcional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Ex: Fraude, spam, etc'
              rows='3'
              className='w-full border border-gray-300 rounded-lg px-4 py-2'
            />
          </div>
          
          <div className='flex gap-3'>
            <button
              type='submit'
              className='flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold'
            >
              Bloquear
            </button>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold'
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminPanel;
