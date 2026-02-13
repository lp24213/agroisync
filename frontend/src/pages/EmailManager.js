import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Send, Inbox, FileText, Trash2, AlertTriangle, Plus, Search, Paperclip, Star, Reply, Forward, MoreVertical, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../config/constants';

const EmailManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSession, setEmailSession] = useState(() => {
    try {
      const raw = localStorage.getItem('agroisyncEmailSession');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Composição de email
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });

  const folders = [
    { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox, color: 'text-blue-500' },
    { id: 'sent', name: 'Enviados', icon: Send, color: 'text-green-500' },
    { id: 'drafts', name: 'Rascunhos', icon: FileText, color: 'text-yellow-500' },
    { id: 'spam', name: 'Spam', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'trash', name: 'Lixeira', icon: Trash2, color: 'text-gray-500' }
  ];

  useEffect(() => {
    if (emailSession?.id) {
      setAccounts([emailSession]);
      setSelectedAccount(emailSession.id);
    }
  }, [emailSession]);

  useEffect(() => {
    if (selectedAccount) {
      loadMessages(selectedAccount, selectedFolder);
    }
  }, [selectedAccount, selectedFolder]);

  const handleEmailLogout = () => {
    localStorage.removeItem('agroisyncEmailSession');
    setEmailSession(null);
    setAccounts([]);
    setSelectedAccount(null);
    setMessages([]);
    setSelectedMessage(null);
  };

  const loadMessages = async (accountId, folder) => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/email/${accountId}/messages?folder=${folder}`));
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!composeData.to || !composeData.subject) {
      alert('Preencha destinatário e assunto');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/email/${selectedAccount}/send`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: composeData.to.split(',').map(e => e.trim()),
          cc: composeData.cc ? composeData.cc.split(',').map(e => e.trim()) : undefined,
          bcc: composeData.bcc ? composeData.bcc.split(',').map(e => e.trim()) : undefined,
          subject: composeData.subject,
          bodyHtml: `<p>${composeData.body.replace(/\n/g, '<br>')}</p>`,
          bodyText: composeData.body
        })
      });

      if (response.ok) {
        alert('Email enviado com sucesso!');
        setIsComposing(false);
        setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
        loadMessages(selectedAccount, 'sent');
      } else {
        const error = await response.json();
        alert('Erro ao enviar: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Tem certeza que deseja excluir este email?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/email/${selectedAccount}/messages/${messageId}`), {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Email excluído com sucesso!');
        loadMessages(selectedAccount, selectedFolder);
        setSelectedMessage(null);
      } else {
        const error = await response.json();
        alert('Erro ao excluir: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao excluir email:', error);
      alert('Erro ao excluir email');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now - date) / 36e5;

    if (diffHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('pt-BR');
  };

  const currentAccount = accounts.find(a => a.id === selectedAccount);
  const currentFolder = folders.find(f => f.id === selectedFolder);

  const filteredMessages = messages.filter(msg => 
    !searchQuery || 
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.from_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!emailSession) {
    return <Navigate to="/email" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Email Corporativo
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gerencie seus emails @agroisync.com
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsComposing(true)}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Novo Email</span>
                <span className="sm:hidden">Novo</span>
              </button>
              <button
                onClick={handleEmailLogout}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar - Contas e Pastas */}
          <div className="lg:col-span-3 space-y-4">
            {/* Seletor de Conta */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Contas</h3>
              <div className="space-y-2">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedAccount === account.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="text-sm">{account.email}</div>
                    {account.unread_count > 0 && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        {account.unread_count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pastas */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Pastas</h3>
              <div className="space-y-1">
                {folders.map(folder => {
                  const Icon = folder.icon;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                        selectedFolder === folder.id
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${folder.color}`} />
                      <span>{folder.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="lg:col-span-9">
            {isComposing ? (
              /* Composição de Email */
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Novo Email</h2>
                  <button
                    onClick={() => setIsComposing(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Para:
                    </label>
                    <input
                      type="text"
                      value={composeData.to}
                      onChange={e => setComposeData({ ...composeData, to: e.target.value })}
                      placeholder="destinatario@exemplo.com"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CC:
                      </label>
                      <input
                        type="text"
                        value={composeData.cc}
                        onChange={e => setComposeData({ ...composeData, cc: e.target.value })}
                        placeholder="Opcional"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CCO:
                      </label>
                      <input
                        type="text"
                        value={composeData.bcc}
                        onChange={e => setComposeData({ ...composeData, bcc: e.target.value })}
                        placeholder="Opcional"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assunto:
                    </label>
                    <input
                      type="text"
                      value={composeData.subject}
                      onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                      placeholder="Assunto do email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensagem:
                    </label>
                    <textarea
                      value={composeData.body}
                      onChange={e => setComposeData({ ...composeData, body: e.target.value })}
                      placeholder="Escreva sua mensagem..."
                      rows={12}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                      <Paperclip className="w-5 h-5" />
                      Anexar Arquivo
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsComposing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={sendEmail}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {loading ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedMessage ? (
              /* Visualização de Mensagem */
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    ← Voltar
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Reply className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Forward className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Star className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir email"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 hover:text-red-700" />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedMessage.subject || '(Sem assunto)'}
                </h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {selectedMessage.from_name || selectedMessage.from_address}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedMessage.from_address}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Para: {selectedMessage.to_addresses}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedMessage.received_at)}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  {selectedMessage.body_html ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedMessage.body_html }} />
                  ) : (
                    <div className="whitespace-pre-wrap">{selectedMessage.body_text}</div>
                  )}
                </div>
              </div>
            ) : (
              /* Lista de Mensagens */
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {currentFolder && (
                      <>
                        <currentFolder.icon className={`w-6 h-6 ${currentFolder.color}`} />
                        <h2 className="text-xl font-bold text-gray-800">
                          {currentFolder.name}
                        </h2>
                      </>
                    )}
                    <span className="text-sm text-gray-500">
                      {filteredMessages.length} mensagens
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => loadMessages(selectedAccount, selectedFolder)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="divide-y">
                  {loading ? (
                    <div className="text-center py-12 text-gray-500">
                      Carregando mensagens...
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Nenhuma mensagem encontrada
                    </div>
                  ) : (
                    filteredMessages.map(message => (
                      <button
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                          !message.is_read ? 'bg-blue-50 hover:bg-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <div className={`font-semibold truncate ${
                                !message.is_read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {message.from_name || message.from_address}
                              </div>
                              {message.has_attachments === 1 && (
                                <Paperclip className="w-4 h-4 text-gray-400" />
                              )}
                              {message.is_starred === 1 && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className={`text-sm truncate ${
                              !message.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'
                            }`}>
                              {message.subject || '(Sem assunto)'}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {message.body_text?.substring(0, 100)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(message.received_at)}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailManager;
