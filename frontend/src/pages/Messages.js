import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import messagingService from '../services/messagingService';
import { 
  MessageCircle, Send, Search, AlertTriangle, Info, 
  Lock, CreditCard, ShoppingCart, Truck, Building
} from 'lucide-react';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [messageStats, setMessageStats] = useState(null);

  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { 
    userProfile, 
    canSendMessage, 
    getFreeProductInfo, 
    consumeFreeProduct,
    getPlanInfo 
  } = usePayment();

  useEffect(() => {
    if (user) {
      loadConversations();
      loadMessageStats();
    }
  }, [activeTab, user, userProfile]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await messagingService.getConversations(
        activeTab === 'all' ? null : activeTab,
        userProfile?.userType,
        userProfile?.userCategory
      );
      
      if (result.ok) {
        setConversations(result.data);
      } else {
        // Se a API falhar, usar dados mock para desenvolvimento
        console.warn('API não disponível, usando dados mock:', result.message);
        const mockData = messagingService.getMockConversations(
          activeTab === 'all' ? null : activeTab,
          userProfile?.userType,
          userProfile?.userCategory
        );
        setConversations(mockData);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      // Em caso de erro, usar dados mock
      const mockData = messagingService.getMockConversations(
        activeTab === 'all' ? null : activeTab,
        userProfile?.userType,
        userProfile?.userCategory
      );
      setConversations(mockData);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setError('');
    try {
      const result = await messagingService.getMessages(
        conversationId,
        userProfile?.userType,
        userProfile?.userCategory
      );
      
      if (result.ok) {
        setMessages(result.data);
      } else {
        // Se a API falhar, usar dados mock
        console.warn('API não disponível, usando mensagens mock:', result.message);
        const mockMessages = messagingService.getMockMessages(
          conversationId,
          userProfile?.userType,
          userProfile?.userCategory
        );
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      // Em caso de erro, usar dados mock
      const mockMessages = messagingService.getMockMessages(
        conversationId,
        userProfile?.userType,
        userProfile?.userCategory
      );
      setMessages(mockMessages);
    }
  };

  const loadMessageStats = async () => {
    try {
      const result = await messagingService.getMessageStats(
        userProfile?.userType,
        userProfile?.userCategory
      );
      
      if (result.ok) {
        setMessageStats(result.data);
      } else {
        // Usar dados mock para desenvolvimento
        const mockStats = messagingService.getMockMessageStats(
          userProfile?.userType,
          userProfile?.userCategory
        );
        setMessageStats(mockStats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      const mockStats = messagingService.getMockMessageStats(
        userProfile?.userType,
        userProfile?.userCategory
      );
      setMessageStats(mockStats);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Verificar se pode enviar mensagem
    if (!canSendMessage()) {
      setError('Você não pode enviar mensagens no momento. Verifique seu plano.');
      return;
    }

    const messageData = {
      conversationId: selectedConversation._id,
      recipientId: selectedConversation.participants.find(p => p !== user.id),
      content: newMessage,
      userType: userProfile?.userType,
      userCategory: userProfile?.userCategory
    };

    try {
      const result = await messagingService.sendMessage(
        messageData,
        userProfile?.userType,
        userProfile?.userCategory
      );
      
      if (result.ok) {
        setMessages(prev => [...prev, result.data]);
        setNewMessage('');
        loadConversations(); // Atualizar lista de conversas
        
        // Se for comprador, mostrar mensagem sobre produto gratuito consumido
        if (userProfile?.userCategory === 'comprador') {
          const freeInfo = getFreeProductInfo();
          if (freeInfo && freeInfo.remaining > 0) {
            setError(`✅ Mensagem enviada! Produto gratuito consumido. Restam ${freeInfo.remaining - 1}/3 produtos.`);
            setTimeout(() => setError(''), 5000);
          }
        }
      } else {
        if (result.requiresPayment) {
          setError('Limite de produtos gratuitos atingido. Faça um pagamento para continuar enviando mensagens.');
        } else {
          setError(result.message || 'Erro ao enviar mensagem');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const handleCreateConversation = async (participantId, serviceType, serviceId) => {
    try {
      const result = await messagingService.createConversation(
        [user.id, participantId],
        serviceId,
        serviceType,
        null,
        userProfile?.userType,
        userProfile?.userCategory
      );
      
      if (result.ok) {
        setSelectedConversation(result.data);
        loadConversations();
      } else {
        setError('Erro ao criar conversa');
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      setError('Erro ao criar conversa');
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'all':
        return 'Todas';
      case 'products':
        return userProfile?.userType === 'loja' ? 'Produtos' : 'Anúncios';
      case 'freights':
        return userProfile?.userType === 'agroconecta' ? 'Fretes' : 'Transportes';
      default:
        return tab;
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'products':
        return <ShoppingCart className="w-4 h-4" />;
      case 'freights':
        return <Truck className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const renderFreeProductWarning = () => {
    if (userProfile?.userCategory !== 'comprador') return null;
    
    const freeInfo = getFreeProductInfo();
    if (!freeInfo) return null;

    if (freeInfo.remaining === 0) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Limite de Produtos Gratuitos Atingido</span>
          </div>
          <p className="text-red-300 text-sm mb-3">
            Você consumiu todos os 3 produtos gratuitos. Faça um pagamento para continuar enviando mensagens.
          </p>
          <button
            onClick={() => navigate('/planos')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Ver Planos de Pagamento
          </button>
        </div>
      );
    }

    if (freeInfo.consumed > 0) {
      return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-yellow-400 mb-2">
            <Info className="w-5 h-5" />
            <span className="font-semibold">Produtos Gratuitos</span>
          </div>
          <p className="text-yellow-300 text-sm">
            Você consumiu {freeInfo.consumed}/3 produtos gratuitos. 
            Restam <strong>{freeInfo.remaining}</strong> produtos para visualização completa.
          </p>
        </div>
      );
    }

    return null;
  };

  const renderUserTypeInfo = () => {
    if (!userProfile) return null;

    const planInfo = getPlanInfo();
    
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-blue-400 mb-2">
          <Building className="w-5 h-5" />
          <span className="font-semibold">Seu Perfil: {planInfo.name}</span>
        </div>
        <p className="text-blue-300 text-sm mb-2">{planInfo.description}</p>
        <div className="text-xs text-blue-200">
          <p><strong>Funcionalidades:</strong> {planInfo.features.join(', ')}</p>
          {planInfo.restrictions.length > 0 && (
            <p><strong>Restrições:</strong> {planInfo.restrictions.join(', ')}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-agro mb-2">
              Painel de Mensagens
            </h1>
            <p className="text-neutral-400">
              Sistema de comunicação personalizado para {userProfile?.userType === 'loja' ? 'Loja' : 'AgroConecta'}
            </p>
          </div>

          {/* Informações do usuário e avisos */}
          {renderUserTypeInfo()}
          {renderFreeProductWarning()}

          {/* Estatísticas */}
          {messageStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{messageStats.totalConversations}</div>
                <div className="text-sm text-neutral-400">Conversas</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{messageStats.unreadMessages}</div>
                <div className="text-sm text-neutral-400">Não Lidas</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{messageStats.totalMessages}</div>
                <div className="text-sm text-neutral-400">Total</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{messageStats.responseTime}</div>
                <div className="text-sm text-neutral-400">Tempo Médio</div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de Conversas */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Conversas</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar conversas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-4">
                  {['all', 'products', 'freights'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                                                 activeTab === tab
                           ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md'
                           : 'bg-neutral-700 text-neutral-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getTabIcon(tab)}
                        <span>{getTabLabel(tab)}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Lista de conversas */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {conversations
                    .filter(conv => 
                      conv.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((conversation) => (
                      <div
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?._id === conversation._id
                            ? 'bg-green-600/20 border border-green-500/30'
                            : 'bg-neutral-700 hover:bg-neutral-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{conversation.title}</h3>
                            <p className="text-xs text-neutral-400 truncate">
                              {conversation.lastMessage?.content}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {new Date(conversation.lastMessage?.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {conversations.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-800 rounded-2xl p-6 h-96">
                {selectedConversation ? (
                  <>
                    {/* Header da conversa */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-700">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedConversation.title}</h3>
                        <p className="text-sm text-neutral-400">
                          {conversations.length} conversas • {activeTab === 'all' ? 'Todas' : getTabLabel(activeTab)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {userProfile?.userCategory === 'comprador' && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1">
                            <span className="text-xs text-yellow-400">
                              {getFreeProductInfo()?.remaining || 0}/3 produtos
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mensagens */}
                    <div className="space-y-3 mb-4 h-64 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === user.id
                                ? 'bg-green-600 text-white'
                                : message.isSystemMessage
                                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                                : 'bg-neutral-700 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Formulário de mensagem */}
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          canSendMessage() 
                            ? "Digite sua mensagem..." 
                            : "Você não pode enviar mensagens no momento"
                        }
                        disabled={!canSendMessage()}
                        className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!canSendMessage() || !newMessage.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-16 text-neutral-400">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Selecione uma conversa</h3>
                    <p className="text-sm">
                      Escolha uma conversa da lista para começar a enviar mensagens
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mensagens de erro */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
