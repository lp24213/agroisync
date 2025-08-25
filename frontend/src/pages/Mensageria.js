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
  Search
} from 'lucide-react';

const Mensageria = () => {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Verificar se o usuário tem plano ativo - VALIDAÇÃO CRÍTICA
  const hasActivePlan = () => {
    if (isAdmin) return true;
    
    // Verificar se tem plano ativo no MongoDB
    if (!user || !user.subscription) return false;
    
    // Verificar se o plano está ativo e não expirou
    const now = new Date();
    const planExpiry = new Date(user.subscription.expiresAt);
    
    return user.subscription.status === 'active' && planExpiry > now;
  };

  // Avisos de segurança obrigatórios
  const securityWarnings = [
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: "⚠️ AVISO DE SEGURANÇA OBRIGATÓRIO",
      message: "Nunca faça pagamentos sem confirmar a veracidade do produto. A Agroisync não se responsabiliza por pagamentos entre usuários."
    },
    {
      icon: <Lock className="w-5 h-5 text-orange-500" />,
      title: "🔒 Cláusula de Integridade",
      message: "Não nos responsabilizamos por pagamentos ou negociações externas. Todas as transações são de responsabilidade do comprador e vendedor."
    }
  ];

  useEffect(() => {
    if (hasActivePlan()) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      setError('Erro ao carregar conversas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const data = await messagingService.getConversation(conversationId);
      setMessages(data.messages || []);
      setSelectedConversation(data.conversation);
    } catch (error) {
      setError('Erro ao carregar mensagens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);
      const messageData = {
        content: newMessage,
        conversationId: selectedConversation._id
      };

      await messagingService.sendMessage(selectedConversation._id, messageData);
      
      // Recarregar mensagens
      await loadMessages(selectedConversation._id);
      setNewMessage('');
    } catch (error) {
      setError('Erro ao enviar mensagem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasActivePlan()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Mensageria Bloqueada
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Para acessar a mensageria privada, você precisa ter um plano ativo.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                📋 Planos Disponíveis:
              </h3>
              <ul className="text-yellow-700 text-left space-y-2">
                <li>• <strong>Loja:</strong> R$25/mês (até 3 anúncios) + Mensageria</li>
                <li>• <strong>AgroConecta Básico:</strong> R$50/mês + Mensageria</li>
                <li>• <strong>AgroConecta Pro:</strong> R$149/mês (até 30 fretes) + Mensageria</li>
              </ul>
            </div>

            <div className="space-x-4">
              <a 
                href="/planos" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver Planos
              </a>
              <a 
                href="/loja" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para Loja
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
                Mensageria Privada
              </h1>
              <p className="text-gray-600 mt-2">
                Sistema seguro de comunicação entre compradores, vendedores e transportadoras
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Plano Ativo
              </div>
              <div className="text-sm text-gray-500">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Avisos de Segurança */}
        <div className="mb-6 space-y-4">
          {securityWarnings.map((warning, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {warning.icon}
                <div>
                  <h3 className="font-semibold text-red-800 text-lg">
                    {warning.title}
                  </h3>
                  <p className="text-red-700 mt-1">
                    {warning.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Carregando...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => loadMessages(conversation._id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?._id === conversation._id
                          ? 'bg-green-100 border border-green-300'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {conversation.participantName || 'Usuário'}
                            </h4>
                            <p className="text-sm text-gray-600 truncate max-w-32">
                              {conversation.lastMessage || 'Nenhuma mensagem'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(conversation.lastMessageTime).toLocaleDateString()}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                              {conversation.unreadCount}
                            </div>
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
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header da Conversa */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {selectedConversation.participantName || 'Usuário'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.module === 'store' ? 'Loja' : 'AgroConecta'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedConversation.status === 'active' ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Ativo
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {selectedConversation.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de Nova Mensagem */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Selecione uma conversa para começar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mensageria;
