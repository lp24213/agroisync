import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import messagingService from '../services/messagingService';

const MessagesFreights = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasActivePlan, setHasActivePlan] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    checkActivePlan();
  }, [user, navigate]);

  useEffect(() => {
    if (hasActivePlan) {
      loadConversations();
    }
  }, [hasActivePlan]);

  const checkActivePlan = async () => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setHasActivePlan(userData.subscriptions?.agroconecta?.active || false);
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const result = await messagingService.getConversations('freight');
      if (result.ok) {
        setConversations(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao carregar conversas');
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const result = await messagingService.getMessages(conversationId);
      if (result.ok) {
        setMessages(result.data);
      }
    } catch (error) {
      setError('Erro ao carregar mensagens');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const result = await messagingService.sendMessage({
        destinatarioId: selectedConversation.otherUser._id,
        tipo: 'freight',
        servicoId: selectedConversation.servico_id,
        conteudo: newMessage
      });

      if (result.ok) {
        setNewMessage('');
        loadMessages(selectedConversation._id);
        loadConversations(); // Atualizar lista de conversas
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao enviar mensagem');
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation._id);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verificando acesso...</div>
      </div>
    );
  }

  if (!hasActivePlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Bloqueado
          </h2>
          <p className="text-gray-600 mb-6">
            Para acessar esta mensageria, finalize o pagamento de sua assinatura AgroConecta.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/planos')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📋 Ver Planos Disponíveis
            </button>
            <button
              onClick={() => navigate('/agroconecta')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              🚚 Acessar AgroConecta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🚚 Mensageria de Fretes
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-lg">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Aviso de Segurança:</strong> Esta mensageria é privada e segura. 
              Todas as conversas são criptografadas e monitoradas para garantir a segurança dos usuários.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Conversas</h3>
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Nenhuma conversa encontrada
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                          {conversation.otherUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.otherUser.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.title}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-400 truncate">
                              {conversation.lastMessage.conteudo}
                            </p>
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
            <div className="bg-white rounded-lg shadow border h-96 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header da Conversa */}
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">
                      Conversa com {selectedConversation.otherUser.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.title}
                    </p>
                    {/* Detalhes do frete */}
                    {selectedConversation.freightDetails && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-900">Origem:</span>
                            <p className="text-blue-700">{selectedConversation.freightDetails.origin}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900">Destino:</span>
                            <p className="text-blue-700">{selectedConversation.freightDetails.destination}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900">Preço:</span>
                            <p className="text-blue-700">R$ {selectedConversation.freightDetails.price}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900">Tipo:</span>
                            <p className="text-blue-700">{selectedConversation.freightDetails.type}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Nenhuma mensagem ainda. Inicie a conversa!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.remetente === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.remetente === user.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.conteudo}</p>
                            <p className={`text-xs mt-1 ${
                              message.remetente === user.id ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input de Mensagem */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🚚</div>
                    <p>Selecione uma conversa para começar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesFreights;
