import React, { useState, useEffect, useCallback } from 'react';
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
  const [products, setProducts] = useState([]);
  const [freights, setFreights] = useState([]);
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
  const loadStats = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(getApiUrl('/admin/dashboard'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        setStats(response.data.data.stats);
      } else {
        console.warn('⚠️ Unexpected stats response format:', response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
      console.error('❌ Error loading stats:', error.response?.data || error.message);
    }
  }, []);

  // Carregar usuários
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(getApiUrl(`/admin/users?search=${searchTerm}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('👥 Admin users response:', response.data);
      
      // Backend returns { success: true, data: { users, pagination } }
      if (response.data.success && response.data.data) {
        console.log('👥 Users array:', response.data.data.users);
        setUsers(response.data.data.users || []);
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        setUsers([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error('❌ Error loading users:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Carregar bloqueios
  const loadBlocks = useCallback(async () => {
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
  }, []);

  // Carregar produtos
  const loadProducts = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(getApiUrl('/admin/products'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        setProducts(response.data.data.products || []);
      } else {
        console.warn('⚠️ Unexpected products response format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error('❌ Error loading products:', error.response?.data || error.message);
    }
  }, []);

  // Carregar fretes
  const loadFreights = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(getApiUrl('/admin/freights'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        setFreights(response.data.data.freights || []);
      } else {
        console.warn('⚠️ Unexpected freights response format:', response.data);
        setFreights([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar fretes');
      console.error('❌ Error loading freights:', error.response?.data || error.message);
    }
  }, []);

  // Deletar produto
  const deleteProduct = async (productId) => {
    if (!window.confirm('Deletar este produto?')) return;
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/products/${productId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produto deletado');
      loadProducts();
      loadStats();
    } catch (error) {
      toast.error('Erro ao deletar produto');
    }
  };

  // Deletar frete
  const deleteFreight = async (freightId) => {
    if (!window.confirm('Deletar este frete?')) return;
    try {
      const token = getToken();
      await axios.delete(getApiUrl(`/admin/freights/${freightId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Frete deletado');
      loadFreights();
      loadStats();
    } catch (error) {
      toast.error('Erro ao deletar frete');
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
    loadProducts();
    loadFreights();
  }, [loadStats, loadUsers, loadBlocks, loadProducts, loadFreights]);

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => loadUsers(), 500);
      return () => clearTimeout(timer);
    } else {
      loadUsers();
    }
  }, [searchTerm, loadUsers]);

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
        <div className='flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto'>
          {[
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'products', label: 'Produtos', icon: Activity },
            { id: 'freights', label: 'Fretes', icon: Activity },
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

        {/* STATS TAB COMPLETO */}
        {activeTab === 'stats' && stats && (
          <div className='space-y-6'>
            {/* Cards principais */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600'>
                <p className='text-gray-500 text-sm font-semibold'>Total Usuários</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalUsers}</p>
                <p className='text-xs text-green-600 mt-1'>↑ {stats.growthPercentage}% esta semana</p>
                <p className='text-xs text-gray-400'>Pagos: {stats.paidUsers} ({stats.paidPercentage}%)</p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600'>
                <p className='text-gray-500 text-sm font-semibold'>Receita Total</p>
                <p className='text-3xl font-bold text-gray-900'>R$ {(stats.totalRevenue || 0).toFixed(2)}</p>
                <p className='text-xs text-blue-600 mt-1'>Hoje: {stats.paymentsToday} pagamentos</p>
                <p className='text-xs text-gray-400'>Este mês: {stats.paymentsThisMonth}</p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600'>
                <p className='text-gray-500 text-sm font-semibold'>Produtos</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalProducts}</p>
                <p className='text-xs text-purple-600 mt-1'>Hoje: {stats.productsToday}</p>
                <p className='text-xs text-gray-400'>Fretes: {stats.totalFreights}</p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600'>
                <p className='text-gray-500 text-sm font-semibold'>Atividade</p>
                <p className='text-3xl font-bold text-gray-900'>{stats.activeConversations}</p>
                <p className='text-xs text-red-600 mt-1'>Conversas ativas</p>
                <p className='text-xs text-gray-400'>Bloqueios: {stats.totalBlocks}</p>
              </div>
            </div>

            {/* Gráficos detalhados */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-xl shadow-lg p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Novos Usuários</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Hoje</span>
                    <span className='font-bold text-green-600'>{stats.usersToday}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Esta semana</span>
                    <span className='font-bold text-blue-600'>{stats.usersThisWeek}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Este mês</span>
                    <span className='font-bold text-purple-600'>{stats.usersThisMonth}</span>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Publicações Hoje</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Produtos</span>
                    <span className='font-bold text-green-600'>{stats.productsToday}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Fretes</span>
                    <span className='font-bold text-blue-600'>{stats.freightsToday}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Total Publicações</span>
                    <span className='font-bold text-purple-600'>{stats.totalProducts + stats.totalFreights}</span>
                  </div>
                </div>
              </div>
            </div>
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

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Todos os Produtos ({products.length})</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Produto</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Usuário</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Preço</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-900'>{product.name || product.title}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{product.user_email}</td>
                      <td className='px-4 py-3 text-sm text-gray-900'>R$ {product.price || 0}</td>
                      <td className='px-4 py-3'>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className='text-center py-12'>
                  <p className='text-gray-600'>Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FREIGHTS TAB */}
        {activeTab === 'freights' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Todos os Fretes ({freights.length})</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Origem</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Destino</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Usuário</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {freights.map((freight) => (
                    <tr key={freight.id} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-900'>{freight.origin || '-'}</td>
                      <td className='px-4 py-3 text-sm text-gray-900'>{freight.destination || '-'}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{freight.user_email}</td>
                      <td className='px-4 py-3'>
                        <button
                          onClick={() => deleteFreight(freight.id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {freights.length === 0 && (
                <div className='text-center py-12'>
                  <p className='text-gray-600'>Nenhum frete encontrado</p>
                </div>
              )}
            </div>
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
