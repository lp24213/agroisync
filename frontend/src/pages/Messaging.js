import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import messagingService from '../services/messagingService';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, User, CheckCheck } from 'lucide-react';

const Messaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const data = await messagingService.getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
        loadMessages(data[0].id);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao carregar conversas:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [activeConversation]);

  useEffect(() => {
    if (user) {
      loadConversations();
      messagingService.connectWebSocket(user.id);
    }
    return () => {
      messagingService.disconnectWebSocket();
    };
  }, [user, loadConversations]);

  // ...existing code... (loadConversations is memoized above)

  const loadMessages = async conversationId => {
    try {
      const data = await messagingService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao carregar mensagens:', error);
      }
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
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao enviar mensagem:', error);
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(
    conv =>
      conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
          <p className='text-gray-600'>Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
          <div className='flex h-[600px]'>
            {/* Sidebar - Lista de Conversas */}
            <div className='flex w-1/3 flex-col border-r border-gray-200'>
              {/* Header */}
              <div className='border-b border-gray-200 p-4'>
                <h1 className='mb-4 text-xl font-semibold text-gray-900'>Mensagens</h1>

                {/* Search */}
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                  <input
                    type='text'
                    placeholder='Buscar conversas...'
                    className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Lista de Conversas */}
              <div className='flex-1 overflow-y-auto'>
                {filteredConversations.length === 0 ? (
                  <div className='p-4 text-center text-gray-500'>
                    <MessageCircle className='mx-auto mb-2 h-12 w-12 text-gray-300' />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  filteredConversations.map(conversation => (
                    <motion.div
                      key={conversation.id}
                      className={`cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
                        activeConversation?.id === conversation.id ? 'border-l-4 border-l-green-500 bg-green-50' : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation);
                        loadMessages(conversation.id);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                          <User className='h-5 w-5 text-green-600' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between'>
                            <h3 className='truncate font-semibold text-gray-900'>{conversation.participantName}</h3>
                            <span className='text-xs text-gray-500'>
                              {conversation.lastMessage?.timestamp
                                ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''}
                            </span>
                          </div>
                          <p className='truncate text-sm text-gray-600'>
                            {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white'>
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
            <div className='flex flex-1 flex-col'>
              {activeConversation ? (
                <>
                  {/* Header do Chat */}
                  <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                        <User className='h-5 w-5 text-green-600' />
                      </div>
                      <div>
                        <h2 className='font-semibold text-gray-900'>{activeConversation.participantName}</h2>
                        <p className='text-sm text-gray-500'>Online</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                        <Phone className='h-5 w-5' />
                      </button>
                      <button className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                        <Video className='h-5 w-5' />
                      </button>
                      <button className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                        <MoreVertical className='h-5 w-5' />
                      </button>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className='flex-1 overflow-y-auto bg-gray-50 p-4'>
                    <div className='space-y-4'>
                      {messages.map(message => (
                        <motion.div
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div
                            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                              message.senderId === user.id
                                ? 'bg-green-500 text-white'
                                : 'border border-gray-200 bg-white text-gray-900'
                            }`}
                          >
                            <p className='text-sm'>{message.content}</p>
                            <div
                              className={`mt-1 flex items-center gap-1 ${
                                message.senderId === user.id ? 'text-green-100' : 'text-gray-500'
                              }`}
                            >
                              <span className='text-xs'>
                                {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {message.senderId === user.id && <CheckCheck className='h-3 w-3' />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Input de Mensagem */}
                  <div className='border-t border-gray-200 p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative flex-1'>
                        <textarea
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder='Digite sua mensagem...'
                          className='w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                          rows='1'
                          style={{ minHeight: '40px', maxHeight: '120px' }}
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className='rounded-lg bg-green-500 p-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {sending ? (
                          <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                        ) : (
                          <Send className='h-5 w-5' />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className='flex flex-1 items-center justify-center'>
                  <div className='text-center'>
                    <MessageCircle className='mx-auto mb-4 h-16 w-16 text-gray-300' />
                    <h3 className='mb-2 text-lg font-semibold text-gray-900'>Selecione uma conversa</h3>
                    <p className='text-gray-500'>Escolha uma conversa para começar a trocar mensagens</p>
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
