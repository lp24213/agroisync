import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';
import { 
  MessageCircle, 
  Send, 
  User, 
  AlertTriangle, 
  Shield, 
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Truck,
  DollarSign,
  MapPin,
  AlertCircle
} from 'lucide-react';

const MessagesFreights = () => {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasActivePlan, setHasActivePlan] = useState(false);

  // Verificar se o usuário tem plano ativo para fretes
  useEffect(() => {
    const checkPlanAccess = async () => {
      if (isAdmin) {
        setHasActivePlan(true);
        return;
      }

      try {
        // Verificar se tem plano ativo
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const agroconectaPlan = userData.subscriptions?.agroconecta;
          
          if (agroconectaPlan && agroconectaPlan.status === 'active') {
            const now = new Date();
            const planExpiry = new Date(agroconectaPlan.expiresAt);
            
            if (planExpiry > now) {
              setHasActivePlan(true);
              return;
            }
          }
        }
        
        setHasActivePlan(false);
      } catch (error) {
        console.error('Erro ao verificar plano:', error);
        setHasActivePlan(false);
      }
    };

    checkPlanAccess();
  }, [isAdmin]);

  // Carregar conversas
  useEffect(() => {
    if (!hasActivePlan) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await messagingService.getConversations('freight');
        
        if (response.ok) {
          setConversations(response.data.conversations);
        } else {
          setError(response.message || 'Erro ao carregar conversas');
        }
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
        setError('Erro ao carregar conversas');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [hasActivePlan]);

  // Carregar mensagens de uma conversa
  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await messagingService.getMessages(conversationId);
      
      if (response.ok) {
        setMessages(response.data.messages);
        setSelectedConversation(conversations.find(c => c._id === conversationId));
      } else {
        setError(response.message || 'Erro ao carregar mensagens');
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setError('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensagem
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);
      const response = await messagingService.sendMessage(
        selectedConversation._id,
        newMessage.trim()
      );
      
      if (response.ok) {
        setNewMessage('');
        // Recarregar mensagens
        await loadMessages(selectedConversation._id);
        // Atualizar conversa na lista
        setConversations(prev => prev.map(c => 
          c._id === selectedConversation._id 
            ? { ...c, lastMessage: response.data.message }
            : c
        ));
      } else {
        setError(response.message || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar conversas
  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Se não tem plano ativo, mostrar tela de bloqueio
  if (!hasActivePlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔒 Acesso Bloqueado
          </h2>
          
          <p className="text-gray-600 mb-6">
            Para acessar a mensageria de fretes, você precisa ter um plano ativo do AgroConecta.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Plano AgroConecta - R$50/mês</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gestão completa de fretes</li>
              <li>• Mensageria privada com transportadores</li>
              <li>• Rastreamento em tempo real</li>
              <li>• Suporte premium 24/7</li>
              <li>• Dashboard avançado</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <a
              href="/planos"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Ver Planos e Preços
            </a>
            
            <a
              href="/agroconecta"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Truck className="w-5 h-5 mr-2" />
              Ir para o AgroConecta
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mensageria de Fretes</h1>
                <p className="text-sm text-gray-500">Gerencie suas conversas de transporte</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso de Segurança */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                ⚠️ Aviso de Segurança Importante
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                <strong>NUNCA faça pagamentos sem confirmar a veracidade do serviço de transporte.</strong> 
                A Agroisync não se responsabiliza por pagamentos ou negociações externas. 
                Todas as transações são de responsabilidade do contratante e transportador.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
                <p className="text-sm text-gray-500">
                  {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Carregando...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => loadMessages(conversation._id)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.title || 'Conversa sem título'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversation.participants
                              .filter(p => p._id !== user?.userId)
                              .map(p => p.name || p.email)
                              .join(', ')}
                          </p>
                          {conversation.serviceId && (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {conversation.serviceId.origin} → {conversation.serviceId.destination}
                              </p>
                            </div>
                          )}
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.lastMessageAt).toLocaleDateString('pt-BR')}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm border">
                {/* Header da Conversa */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.title || 'Conversa sem título'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.participants
                          .filter(p => p._id !== user?.userId)
                          .map(p => p.name || p.email)
                          .join(', ')}
                      </p>
                      {selectedConversation.serviceId && (
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            <strong>Rota:</strong> {selectedConversation.serviceId.origin} → {selectedConversation.serviceId.destination}
                          </p>
                          {selectedConversation.serviceId.price && (
                            <p className="text-sm text-gray-600">
                              <strong>Valor:</strong> R$ {selectedConversation.serviceId.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Criada em {new Date(selectedConversation.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedConversation.messageCount} mensagem{selectedConversation.messageCount !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">
                      <Truck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma mensagem ainda</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderId._id === user?.userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId._id === user?.userId
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.senderId.name || message.senderId.email}
                            </span>
                            <span className="text-xs opacity-75">
                              {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t">
                  <form onSubmit={sendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-500">
                  Escolha uma conversa da lista para começar a trocar mensagens sobre fretes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Erro</h3>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesFreights;
