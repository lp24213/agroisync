import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Plus,
  Send,
  Inbox,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Paperclip,
  Download,
  X,
  Settings,
  AlertCircle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getApiUrl, getAuthToken } from '../config/constants';
import ProtectedRoute from '../components/ProtectedRoute';

const UserEmailDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [showComposer, setShowComposer] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [composerData, setComposerData] = useState({
    to: '',
    subject: '',
    html: '',
    attachments: []
  });
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: '',
    name: ''
  });

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Carregar contas do usuário
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/email/accounts'), {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar contas');
      }

      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts || []);
        if (data.accounts && data.accounts.length > 0 && !selectedAccount) {
          setSelectedAccount(data.accounts[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast.error('Erro ao carregar contas de email');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Carregar inbox
  const loadInbox = useCallback(async (accountId) => {
    if (!accountId) return;

    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl(`/email/inbox?accountId=${accountId}&limit=50`),
        { headers: getHeaders() }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar inbox');
      }

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar inbox:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar conta
  const createAccount = async () => {
    if (!newAccount.email || !newAccount.password) {
      toast.error('Email e senha são obrigatórios');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/email/accounts'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newAccount)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar conta');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Conta criada com sucesso!');
        setShowAccountModal(false);
        setNewAccount({ email: '', password: '', name: '' });
        loadAccounts();
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error(error.message || 'Erro ao criar conta');
    }
  };

  // Deletar conta
  const deleteAccount = async (accountId, email) => {
    if (!window.confirm(`Tem certeza que deseja deletar a conta ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/email/accounts/${accountId}`), {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar conta');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Conta deletada com sucesso');
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(null);
          setMessages([]);
        }
        loadAccounts();
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast.error('Erro ao deletar conta');
    }
  };

  // Enviar email
  const sendEmail = async () => {
    if (!selectedAccount) {
      toast.error('Selecione uma conta primeiro');
      return;
    }

    if (!composerData.to || !composerData.subject) {
      toast.error('Destinatário e assunto são obrigatórios');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('accountId', selectedAccount.id);
      formData.append('to', composerData.to);
      formData.append('subject', composerData.subject);
      formData.append('html', composerData.html);
      
      // Adicionar anexos se houver
      composerData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      const response = await fetch(getApiUrl('/email/send'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao enviar email');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Email enviado com sucesso!');
        setShowComposer(false);
        setComposerData({ to: '', subject: '', html: '', attachments: [] });
        // Recarregar inbox após enviar
        if (selectedAccount) {
          loadInbox(selectedAccount.id);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error(error.message || 'Erro ao enviar email');
    }
  };

  // Adicionar anexo
  const handleAddAttachment = (e) => {
    const files = Array.from(e.target.files);
    setComposerData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
    toast.success(`${files.length} anexo(s) adicionado(s)`);
  };

  // Remover anexo
  const removeAttachment = (index) => {
    setComposerData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Buscar mensagem completa
  const fetchMessage = async (uid) => {
    if (!selectedAccount) return;

    try {
      const response = await fetch(
        getApiUrl(`/email/message?accountId=${selectedAccount.id}&uid=${uid}`),
        { headers: getHeaders() }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar mensagem');
      }

      const data = await response.json();
      if (data.success) {
        setSelectedMessage(data.message);
        
        // Marcar como lida
        await fetch(getApiUrl('/email/read'), {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            accountId: selectedAccount.id,
            uid: uid
          })
        });

        // Recarregar inbox
        loadInbox(selectedAccount.id);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error);
      toast.error('Erro ao buscar mensagem');
    }
  };

  // Deletar mensagem
  const deleteMessage = async (uid) => {
    if (!selectedAccount) return;

    if (!window.confirm('Tem certeza que deseja deletar esta mensagem?')) {
      return;
    }

    try {
      const response = await fetch(
        getApiUrl(`/email/message/${uid}?accountId=${selectedAccount.id}`),
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar mensagem');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Mensagem deletada');
        setSelectedMessage(null);
        loadInbox(selectedAccount.id);
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      toast.error('Erro ao deletar mensagem');
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (selectedAccount && activeTab === 'inbox') {
      loadInbox(selectedAccount.id);
    }
  }, [selectedAccount, activeTab, loadInbox]);

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
                  <Mail className='h-8 w-8 text-emerald-500' />
                  Email Corporativo
                </h1>
                <p className='text-gray-400'>Gerencie suas contas de email corporativo</p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowAccountModal(true)}
                  className='px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors'
                >
                  <Plus className='h-5 w-5' />
                  Nova Conta
                </button>
                {selectedAccount && (
                  <button
                    onClick={() => setShowComposer(true)}
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors'
                  >
                    <Send className='h-5 w-5' />
                    Novo Email
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-2 border-b border-gray-700'>
              {[
                { id: 'accounts', label: 'Minhas Contas', icon: Settings },
                { id: 'inbox', label: 'Inbox', icon: Inbox }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
            {activeTab === 'accounts' && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {loading ? (
                  <div className='col-span-full text-center py-12'>
                    <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent'></div>
                    <p className='text-gray-400 mt-4'>Carregando contas...</p>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className='col-span-full text-center py-12 bg-gray-800 rounded-lg border border-gray-700'>
                    <Mail className='mx-auto h-12 w-12 text-gray-600 mb-4' />
                    <p className='text-gray-400 mb-4'>Nenhuma conta cadastrada</p>
                    <button
                      onClick={() => setShowAccountModal(true)}
                      className='px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg'
                    >
                      Adicionar Primeira Conta
                    </button>
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`bg-gray-800 rounded-lg p-6 border-2 transition-all cursor-pointer ${
                        selectedAccount?.id === account.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedAccount(account);
                        setActiveTab('inbox');
                      }}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <h3 className='text-white font-semibold mb-1'>{account.email}</h3>
                          <p className='text-gray-400 text-sm'>
                            {account.name || 'Sem nome'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.is_active === 1
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {account.is_active === 1 ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-sm text-gray-400'>
                        <span>
                          {account.last_sync_at
                            ? `Sincronizado: ${new Date(account.last_sync_at).toLocaleDateString('pt-BR')}`
                            : 'Nunca sincronizado'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAccount(account.id, account.email);
                          }}
                          className='p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'inbox' && (
              <div>
                {!selectedAccount ? (
                  <div className='text-center py-12 bg-gray-800 rounded-lg border border-gray-700'>
                    <Inbox className='mx-auto h-12 w-12 text-gray-600 mb-4' />
                    <p className='text-gray-400'>Selecione uma conta para visualizar o inbox</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]'>
                    {/* Lista de mensagens */}
                    <div className='lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col'>
                      <div className='p-4 bg-gray-700 border-b border-gray-600 flex items-center justify-between'>
                        <h3 className='text-white font-semibold'>
                          {selectedAccount.email} - {messages.length} mensagens
                        </h3>
                        <button
                          onClick={() => loadInbox(selectedAccount.id)}
                          className='p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors'
                        >
                          <RefreshCw className='h-4 w-4' />
                        </button>
                      </div>
                      <div className='flex-1 overflow-y-auto'>
                        {loading ? (
                          <div className='text-center py-12'>
                            <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent'></div>
                            <p className='text-gray-400 mt-4'>Carregando mensagens...</p>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className='text-center py-12'>
                            <Mail className='mx-auto h-12 w-12 text-gray-600 mb-4' />
                            <p className='text-gray-400'>Nenhuma mensagem encontrada</p>
                          </div>
                        ) : (
                          <div className='divide-y divide-gray-700'>
                            {messages.map((message) => (
                              <div
                                key={message.uid}
                                onClick={() => fetchMessage(message.uid)}
                                className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                                  selectedMessage?.uid === message.uid ? 'bg-gray-700' : ''
                                } ${!message.isRead ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''}`}
                              >
                                <div className='flex items-start justify-between mb-2'>
                                  <p className='text-white font-medium text-sm truncate flex-1'>
                                    {message.from?.[0]?.name || message.from?.[0]?.address || 'Desconhecido'}
                                  </p>
                                  <span className='text-gray-400 text-xs ml-2'>
                                    {new Date(message.date).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <p className='text-gray-300 text-sm truncate font-semibold'>{message.subject}</p>
                                <p className='text-gray-400 text-xs mt-1 truncate'>
                                  {message.from?.[0]?.address}
                                </p>
                                {message.hasAttachments && (
                                  <div className='mt-2 flex items-center gap-1 text-blue-400 text-xs'>
                                    <Paperclip className='h-3 w-3' />
                                    <span>Anexos</span>
                                  </div>
                                )}
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
                          <div className='p-4 bg-gray-700 border-b border-gray-600 flex items-center justify-between'>
                            <h3 className='text-white font-semibold text-sm truncate flex-1'>
                              {selectedMessage.subject}
                            </h3>
                            <button
                              onClick={() => deleteMessage(selectedMessage.uid)}
                              className='p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors ml-2'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
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
                              {selectedMessage.html ? (
                                <div
                                  className='text-gray-300 text-sm prose prose-invert max-w-none'
                                  dangerouslySetInnerHTML={{ __html: selectedMessage.html }}
                                />
                              ) : (
                                <p className='text-gray-300 text-sm whitespace-pre-wrap'>
                                  {selectedMessage.text || 'Conteúdo não disponível'}
                                </p>
                              )}
                            </div>
                            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                              <div className='mt-4 pt-4 border-t border-gray-700'>
                                <p className='text-gray-400 text-xs mb-2'>Anexos:</p>
                                <div className='space-y-2'>
                                  {selectedMessage.attachments.map((att, idx) => (
                                    <div
                                      key={idx}
                                      className='flex items-center justify-between p-2 bg-gray-700 rounded'
                                    >
                                      <div className='flex items-center gap-2'>
                                        <File className='h-4 w-4 text-blue-400' />
                                        <span className='text-white text-sm'>{att.filename}</span>
                                        <span className='text-gray-400 text-xs'>({(att.size / 1024).toFixed(2)} KB)</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          // TODO: Implementar download
                                          toast.info('Download de anexo em desenvolvimento');
                                        }}
                                        className='p-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded'
                                      >
                                        <Download className='h-4 w-4' />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className='flex-1 flex items-center justify-center'>
                          <p className='text-gray-400 text-sm'>Selecione uma mensagem para visualizar</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal: Nova Conta */}
        {showAccountModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700'>
              <h2 className='text-xl font-bold text-white mb-4'>Nova Conta de Email</h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Email *</label>
                  <input
                    type='email'
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='seu-email@dominio.com'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Senha *</label>
                  <input
                    type='password'
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='••••••••'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Nome (opcional)</label>
                  <input
                    type='text'
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='Nome da conta'
                  />
                </div>
              </div>
              <div className='flex gap-2 mt-6'>
                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    setNewAccount({ email: '', password: '', name: '' });
                  }}
                  className='flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={createAccount}
                  className='flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors'
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Composer */}
        {showComposer && selectedAccount && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-800 rounded-lg p-6 max-w-3xl w-full border border-gray-700 max-h-[90vh] flex flex-col'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-white'>Novo Email</h2>
                <button
                  onClick={() => {
                    setShowComposer(false);
                    setComposerData({ to: '', subject: '', html: '', attachments: [] });
                  }}
                  className='p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
              <div className='flex-1 overflow-y-auto space-y-4'>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>De:</label>
                  <input
                    type='text'
                    value={selectedAccount.email}
                    disabled
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Para: *</label>
                  <input
                    type='text'
                    value={composerData.to}
                    onChange={(e) => setComposerData({ ...composerData, to: e.target.value })}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='destinatario@email.com'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Assunto: *</label>
                  <input
                    type='text'
                    value={composerData.subject}
                    onChange={(e) => setComposerData({ ...composerData, subject: e.target.value })}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='Assunto do email'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Mensagem:</label>
                  <textarea
                    value={composerData.html}
                    onChange={(e) => setComposerData({ ...composerData, html: e.target.value })}
                    rows={10}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    placeholder='Digite sua mensagem aqui...'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm mb-2'>Anexos:</label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {composerData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg'
                      >
                        <Paperclip className='h-4 w-4 text-blue-400' />
                        <span className='text-white text-sm'>{file.name}</span>
                        <span className='text-gray-400 text-xs'>({(file.size / 1024).toFixed(2)} KB)</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className='p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type='file'
                    id='file-input'
                    multiple
                    onChange={handleAddAttachment}
                    className='hidden'
                  />
                  <label
                    htmlFor='file-input'
                    className='inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors'
                  >
                    <Paperclip className='h-4 w-4' />
                    Adicionar Anexo
                  </label>
                </div>
              </div>
              <div className='flex gap-2 mt-6 pt-4 border-t border-gray-700'>
                <button
                  onClick={() => {
                    setShowComposer(false);
                    setComposerData({ to: '', subject: '', html: '', attachments: [] });
                  }}
                  className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={sendEmail}
                  className='flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <Send className='h-4 w-4' />
                  Enviar Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default UserEmailDashboard;

