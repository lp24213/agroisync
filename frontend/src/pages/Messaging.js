import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import messagingService from '../services/messagingService';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Filter,
  Archive,
  Star,
  Trash2,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

const Messaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
      messagingService.connectWebSocket(user.id);
    }
    return () => {
      messagingService.disconnectWebSocket();
    };
  }, [user]);

  const loadConversations = async () => {
    try {
      const data = await messagingService.getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
        loadMessages(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messagingService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const message = {
        conversationId: activeConversation.id,
        content: newMessage,
        type: 'text',
        timestamp: new Date().toISOString()
      };

      await messagingService.sendMessage(message);
      setNewMessage('');
      
      // Atualizar mensagens localmente
      setMessages(prev => [...prev, { ...message, id: Date.now(), senderId: user.id }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar - Lista de Conversas */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">Mensagens</h1>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Lista de Conversas */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        activeConversation?.id === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation);
                        loadMessages(conversation.id);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.participantName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage?.timestamp ? 
                                new Date(conversation.lastMessage.timestamp).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                }) : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Principal */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Header do Chat */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{activeConversation.participantName}</h2>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user.id 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${
                              message.senderId === user.id ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              <span className="text-xs">
                                {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {message.senderId === user.id && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Input de Mensagem */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite sua mensagem..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          rows="1"
                          style={{ minHeight: '40px', maxHeight: '120px' }}
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500">Escolha uma conversa para começar a trocar mensagens</p>
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

export default Messaging;
