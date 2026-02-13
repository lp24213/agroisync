import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  Filter,
  Plus,
  MessageSquare,
  Inbox,
  Send,
  Archive,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getApiUrl, getAuthToken } from '../config/constants';
import { useLocation } from 'react-router-dom';

const AdminEmailPanel = () => {
  const location = useLocation();
  const isEmailPath = location.pathname === '/email';
  
  // PROTEÇÃO CRÍTICA: AdminEmailPanel NÃO DEVE RENDERIZAR EM /email
  // Isso é para usuários, não admins!
  if (isEmailPath) {
    console.error('[ADMIN EMAIL PANEL] ERRO: Tentou carregar em /email - BLOQUEADO!');
    return null; // NÃO renderiza nada
  }
  
  // PRIMEIRO: Check se não é admin e está em /email
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  useEffect(() => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const adminEmail = 'luispaulodeoliveira@agrotm.com.br';
        const userEmail = payload.email?.toLowerCase() || '';
        const isAdminUser = 
          payload.isAdmin === true ||
          payload.role === 'admin' ||
          payload.role === 'super-admin' ||
          userEmail === adminEmail.toLowerCase();
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  }, []);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    email: '',
    password: ''
  });

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/admin/email/stats'), {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar estatísticas');
    }
  }, []);

  // Carregar todas as contas
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/admin/email/accounts'), {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar contas');
      }

      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast.error('Erro ao carregar contas de email');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar inbox de uma conta
  const loadInbox = async (accountId) => {
    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl(`/admin/email/inbox?accountId=${accountId}&limit=50`),
        { headers: getHeaders() }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar inbox');
      }

      const data = await response.json();
      if (data.success) {
        setInboxMessages(data.messages || []);
        setSelectedAccount(data.account);
      }
    } catch (error) {
      console.error('Erro ao carregar inbox:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova conta de email
  const createAccount = async () => {
    try {
      if (!newAccountData.email || !newAccountData.password) {
        toast.error('Preencha email e senha');
        return;
      }

      const response = await fetch(getApiUrl('/admin/email/accounts'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newAccountData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Conta de email criada com sucesso!');
        setShowAccountModal(false);
        setNewAccountData({
          email: '',
          password: ''
        });
        loadAccounts();
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta de email');
    }
  };

  // Ativar/Desativar conta
  const toggleAccountStatus = async (accountId, currentStatus) => {
    try {
      const response = await fetch(
        getApiUrl(`/admin/email/accounts/${accountId}/status`),
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ isActive: !currentStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao alterar status');
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`Conta ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`);
        loadAccounts();
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da conta');
    }
  };

  // Deletar conta
  const deleteAccount = async (accountId, email) => {
    if (!window.confirm(`Tem certeza que deseja deletar a conta ${email}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(
        getApiUrl(`/admin/email/accounts/${accountId}`),
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar conta');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Conta deletada com sucesso');
        loadAccounts();
        loadStats();
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(null);
          setInboxMessages([]);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast.error('Erro ao deletar conta');
    }
  };

  useEffect(() => {
    // NÃO carregar dados se estiver em /email (path para usuários)
    if (isEmailPath) {
      return;
    }
    
    const token = getAuthToken();
    if (!token) {
      return;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const adminEmail = 'luispaulodeoliveira@agrotm.com.br';
        const userEmail = payload.email?.toLowerCase() || '';
        const isAdminUser = 
          payload.isAdmin === true ||
          payload.role === 'admin' ||
          payload.role === 'super-admin' ||
          userEmail === adminEmail.toLowerCase();
        
        if (isAdminUser) {
          loadStats();
          loadAccounts();
        }
      }
    } catch (e) {
      // Token inválido, não carrega nada
    }
  }, [loadStats, loadAccounts, isEmailPath]);

  // Filtrar contas
  const filteredAccounts = accounts.filter(account =>
    account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizar Overview
  const renderOverview = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-gray-800 rounded-lg p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <Mail className='h-8 w-8 text-emerald-500' />
            <span className='text-3xl font-bold text-white'>{stats?.totalAccounts || 0}</span>
          </div>
          <p className='text-gray-400 text-sm'>Total de Contas</p>
        </div>

        <div className='bg-gray-800 rounded-lg p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <CheckCircle2 className='h-8 w-8 text-green-500' />
            <span className='text-3xl font-bold text-white'>{stats?.activeAccounts || 0}</span>
          </div>
          <p className='text-gray-400 text-sm'>Contas Ativas</p>
        </div>

        <div className='bg-gray-800 rounded-lg p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <span className='text-3xl font-bold text-white'>{stats?.inactiveAccounts || 0}</span>
          </div>
          <p className='text-gray-400 text-sm'>Contas Inativas</p>
        </div>

        <div className='bg-gray-800 rounded-lg p-6 border border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <MessageSquare className='h-8 w-8 text-blue-500' />
            <span className='text-3xl font-bold text-white'>{stats?.totalMessages || 0}</span>
          </div>
          <p className='text-gray-400 text-sm'>Total de Mensagens</p>
        </div>
      </div>

      {/* Top usuários com mais contas */}
      {stats?.accountsByUser && stats.accountsByUser.length > 0 && (
        <div className='bg-gray-800 rounded-lg p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-white mb-4'>Usuários com Mais Contas</h3>
          <div className='space-y-3'>
            {stats.accountsByUser.slice(0, 10).map((user) => (
              <div key={user.id} className='flex items-center justify-between p-3 bg-gray-700 rounded'>
                <div>
                  <p className='text-white font-medium'>{user.name}</p>
                  <p className='text-gray-400 text-sm'>{user.email}</p>
                </div>
                <span className='bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium'>
                  {user.account_count} conta{user.account_count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar lista de contas
  const renderAccounts = () => (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
          <input
            type='text'
            placeholder='Buscar por email, nome ou usuário...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
          />
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowAccountModal(true)}
            className='px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors font-semibold'
          >
            <Plus className='h-4 w-4' />
            Nova Conta
          </button>
          <button
            onClick={() => {
              loadAccounts();
              loadStats();
            }}
            className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors'
          >
            <RefreshCw className='h-4 w-4' />
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent'></div>
          <p className='text-gray-400 mt-4'>Carregando contas...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className='text-center py-12 bg-gray-800 rounded-lg border border-gray-700'>
          <Mail className='mx-auto h-12 w-12 text-gray-600 mb-4' />
          <p className='text-gray-400'>Nenhuma conta encontrada</p>
        </div>
      ) : (
        <div className='bg-gray-800 rounded-lg border border-gray-700 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-700'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase'>Email</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase'>Usuário</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase'>Status</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase'>Última Sincronização</th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase'>Ações</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-700'>
                {filteredAccounts.map((account) => {
                  const isActive = account.is_active === 1 || account.is_active === true || account.is_active === undefined || account.is_active === null;
                  return (
                  <tr key={account.id} className='hover:bg-gray-700/50 transition-colors'>
                    <td className='px-4 py-3 text-white'>{account.email}</td>
                    <td className='px-4 py-3'>
                      <div>
                        <p className='text-white text-sm'>{account.user_name}</p>
                        <p className='text-gray-400 text-xs'>{account.user_email}</p>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-gray-400 text-sm'>
                      {account.last_sync_at 
                        ? new Date(account.last_sync_at).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => toggleAccountStatus(account.id, isActive)}
                          className={`p-2 rounded transition-colors ${
                            isActive
                              ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                          }`}
                          title={isActive ? 'Desativar' : 'Ativar'}
                        >
                          {isActive ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                        </button>
                        <button
                          onClick={() => deleteAccount(account.id, account.email)}
                          className='p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors'
                          title='Deletar'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar inbox viewer
  const renderInbox = () => {
    if (!selectedAccount) {
      return (
        <div className='text-center py-12 bg-gray-800 rounded-lg border border-gray-700'>
          <Inbox className='mx-auto h-12 w-12 text-gray-600 mb-4' />
          <p className='text-gray-400'>Selecione uma conta para visualizar o inbox</p>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]'>
        {/* Lista de mensagens */}
        <div className='lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col'>
          <div className='p-4 bg-gray-700 border-b border-gray-600'>
            <h3 className='text-white font-semibold'>
              {selectedAccount.email} - {inboxMessages.length} mensagens
            </h3>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {inboxMessages.length === 0 ? (
              <div className='text-center py-12'>
                <Mail className='mx-auto h-12 w-12 text-gray-600 mb-4' />
                <p className='text-gray-400'>Nenhuma mensagem encontrada</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-700'>
                {inboxMessages.map((message) => (
                  <div
                    key={message.uid}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedMessage?.uid === message.uid ? 'bg-gray-700' : ''
                    } ${!message.isRead ? 'bg-blue-500/10' : ''}`}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <p className='text-white font-medium text-sm truncate flex-1'>
                        {message.from?.[0]?.name || message.from?.[0]?.address || 'Desconhecido'}
                      </p>
                      <span className='text-gray-400 text-xs ml-2'>
                        {new Date(message.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className='text-gray-300 text-sm truncate'>{message.subject}</p>
                    <p className='text-gray-400 text-xs mt-1 truncate'>
                      {message.from?.[0]?.address}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visualização da mensagem */}
        <div className='bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col'>
          {selectedMessage ? (
            <>
              <div className='p-4 bg-gray-700 border-b border-gray-600'>
                <h3 className='text-white font-semibold text-sm truncate'>{selectedMessage.subject}</h3>
              </div>
              <div className='flex-1 overflow-y-auto p-4'>
                <div className='mb-4 space-y-2'>
                  <div>
                    <p className='text-gray-400 text-xs'>De:</p>
                    <p className='text-white text-sm'>{selectedMessage.from?.[0]?.address}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-xs'>Para:</p>
                    <p className='text-white text-sm'>{selectedMessage.to?.[0]?.address || selectedAccount.email}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-xs'>Data:</p>
                    <p className='text-white text-sm'>{new Date(selectedMessage.date).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className='border-t border-gray-700 pt-4'>
                  <p className='text-gray-300 text-sm whitespace-pre-wrap'>
                    {selectedMessage.text || 'Conteúdo não disponível'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center'>
              <p className='text-gray-400 text-sm'>Selecione uma mensagem para visualizar</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // States para login de email
  const [emailLoginData, setEmailLoginData] = useState({ email: '', password: '' });
  const [emailLoading, setEmailLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!emailLoginData.email || !emailLoginData.password) {
      toast.error('Preencha email e senha');
      return;
    }
    try {
      setEmailLoading(true);
      const response = await fetch(getApiUrl('/email/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailLoginData.email,
          password: emailLoginData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error || 'Erro ao autenticar');
        return;
      }
      localStorage.setItem('agroisyncEmailSession', JSON.stringify(data.account));
      window.location.href = '/email/inbox';
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      toast.error('Erro ao autenticar');
    } finally {
      setEmailLoading(false);
    }
  };

  // Se está checando ou não é admin e é path /email, mostra login
  if (checkingAdmin) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Mail className='mx-auto mb-4 h-16 w-16 animate-pulse text-blue-600' />
          <p className='font-medium text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || isEmailPath) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Login do Email</h2>
            </div>
            <p className="text-gray-600 mb-6">Acesse sua caixa corporativa @agroisync.com</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={emailLoginData.email}
                  onChange={e => setEmailLoginData({ ...emailLoginData, email: e.target.value })}
                  placeholder="seuemail@agroisync.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  value={emailLoginData.password}
                  onChange={e => setEmailLoginData({ ...emailLoginData, password: e.target.value })}
                  placeholder="Sua senha"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
                />
              </div>
              <button
                onClick={handleEmailLogin}
                disabled={emailLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {emailLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
        {/* Modal de Criar Nova Conta */}
        {showAccountModal && (
          <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                  <Plus className='h-6 w-6 text-emerald-500' />
                  Criar Nova Conta de Email
                </h2>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Nome do Email *
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={newAccountData.email.replace('@agroisync.com', '')}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '');
                        setNewAccountData({ ...newAccountData, email: value ? `${value}@agroisync.com` : '' });
                      }}
                      placeholder='contato'
                      className='flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                    <span className='text-gray-400 font-medium'>@agroisync.com</span>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>Exemplos: contato, suporte, vendas, admin</p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Senha *
                  </label>
                  <input
                    type='password'
                    value={newAccountData.password}
                    onChange={(e) => setNewAccountData({ ...newAccountData, password: e.target.value })}
                    placeholder='Senha forte para o email'
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Mínimo 8 caracteres</p>
                </div>

                <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4'>
                  <p className='text-sm text-emerald-300'>
                    <strong>Email Corporativo Agroisync</strong><br/>
                    Você está criando um email @agroisync.com próprio do sistema.
                  </p>
                </div>

                <div className='flex justify-end gap-3 mt-6'>
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className='px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors'
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createAccount}
                    className='px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors'
                  >
                    Criar Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='container mx-auto px-4 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
                  <Mail className='h-8 w-8 text-emerald-500' />
                  Painel Administrativo - Email Corporativo
                </h1>
                <p className='text-gray-400'>Gerencie todas as contas de email corporativo do sistema</p>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-2 border-b border-gray-700'>
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                { id: 'accounts', label: 'Contas', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className='h-5 w-5' />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className='mt-6'>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'accounts' && renderAccounts()}
          </div>
        </div>
      </div>
  );
};

export default AdminEmailPanel;

