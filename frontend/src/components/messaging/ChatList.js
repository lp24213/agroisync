import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Search, MessageSquare, CheckCheck, Check, AlertCircle, Pin, MoreVertical } from 'lucide-react';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'pinned'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      // Simular carregamento de conversas
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados mockados
      const mockChats = [
        {
          id: 'chat-1',
          otherUser: {
            id: 'user-1',
            name: 'João Silva',
            email: 'joao@example.com',
            avatar: null
          },
          lastMessage: {
            content: 'Obrigado pela negociação!',
            timestamp: new Date(Date.now() - 300000),
            senderId: 'user-1',
            status: 'read'
          },
          unreadCount: 0,
          isPinned: false,
          context: 'order',
          contextId: 'ORD-001',
          isOnline: true
        },
        {
          id: 'chat-2',
          otherUser: {
            id: 'user-2',
            name: 'Maria Santos',
            email: 'maria@example.com',
            avatar: null
          },
          lastMessage: {
            content: 'Qual o prazo de entrega?',
            timestamp: new Date(Date.now() - 1800000),
            senderId: 'user-2',
            status: 'delivered'
          },
          unreadCount: 2,
          isPinned: true,
          context: 'freight',
          contextId: 'FREIGHT-001',
          isOnline: false
        },
        {
          id: 'chat-3',
          otherUser: {
            id: 'user-3',
            name: 'Pedro Oliveira',
            email: 'pedro@example.com',
            avatar: null
          },
          lastMessage: {
            content: 'Preciso de mais informações sobre o produto.',
            timestamp: new Date(Date.now() - 3600000),
            senderId: 'user-3',
            status: 'read'
          },
          unreadCount: 0,
          isPinned: false,
          context: 'general',
          contextId: null,
          isOnline: true
        }
      ];

      setChats(mockChats);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' || (filter === 'unread' && chat.unreadCount > 0) || (filter === 'pinned' && chat.isPinned);

    return matchesSearch && matchesFilter;
  });

  const sortedChats = filteredChats.sort((a, b) => {
    // Pinned chats first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then by last message timestamp
    return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
  });

  const formatTime = timestamp => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) {
      // 7 days
      return messageTime.toLocaleDateString('pt-BR', {
        weekday: 'short'
      });
    } else {
      return messageTime.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const getMessageStatusIcon = status => {
    switch (status) {
      case 'delivered':
        return <Check className='h-3 w-3 text-slate-400' />;
      case 'read':
        return <CheckCheck className='h-3 w-3 text-blue-500' />;
      case 'error':
        return <AlertCircle className='h-3 w-3 text-red-500' />;
      default:
        return null;
    }
  };

  const getContextBadge = context => {
    switch (context) {
      case 'order':
        return {
          label: t('chat.order', 'Pedido'),
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'freight':
        return {
          label: t('chat.freight', 'Frete'),
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      default:
        return {
          label: t('chat.general', 'Geral'),
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
        };
    }
  };

  const renderChatItem = chat => {
    const isSelected = selectedChatId === chat.id;
    const isLastMessageFromOther = chat.lastMessage.senderId !== user.id;
    const contextBadge = getContextBadge(chat.context);

    return (
      <motion.div
        key={chat.id}
        className={`cursor-pointer border-b border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 ${
          isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
        }`}
        onClick={() => onSelectChat(chat)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex items-center gap-3'>
          {/* Avatar */}
          <div className='relative'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500'>
              <span className='font-semibold text-white'>{chat.otherUser.name?.charAt(0) || 'U'}</span>
            </div>
            {chat.isOnline && (
              <div className='absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-slate-800'></div>
            )}
          </div>

          {/* Content */}
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3
                  className={`truncate font-semibold ${
                    chat.unreadCount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {chat.otherUser.name}
                </h3>
                {chat.isPinned && <Pin className='h-4 w-4 text-slate-400' />}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-slate-500 dark:text-slate-400'>
                  {formatTime(chat.lastMessage.timestamp)}
                </span>
                {!isLastMessageFromOther && getMessageStatusIcon(chat.lastMessage.status)}
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex min-w-0 flex-1 items-center gap-2'>
                <p
                  className={`truncate text-sm ${
                    chat.unreadCount > 0
                      ? 'font-medium text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {chat.lastMessage.content}
                </p>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${contextBadge.color}`}>
                  {contextBadge.label}
                </span>
              </div>

              {chat.unreadCount > 0 && (
                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white'>
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600'></div>
          <p className='text-slate-600 dark:text-slate-400'>{t('chat.loadingChats', 'Carregando conversas...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col bg-white dark:bg-slate-800'>
      {/* Header */}
      <div className='border-b border-slate-200 p-4 dark:border-slate-700'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200'>{t('chat.messages', 'Mensagens')}</h2>
          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <MoreVertical className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>
        </div>

        {/* Search */}
        <div className='relative mb-4'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
          <input
            type='text'
            placeholder={t('chat.search', 'Buscar conversas...')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
          />
        </div>

        {/* Filters */}
        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.all', 'Todas')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.unread', 'Não lidas')}
          </button>
          <button
            onClick={() => setFilter('pinned')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'pinned'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.pinned', 'Fixadas')}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto'>
        <AnimatePresence>
          {sortedChats.length > 0 ? (
            sortedChats.map(renderChatItem)
          ) : (
            <div className='flex flex-1 items-center justify-center p-8'>
              <div className='text-center'>
                <MessageSquare className='mx-auto mb-4 h-16 w-16 text-slate-400' />
                <h3 className='mb-2 text-lg font-semibold text-slate-600 dark:text-slate-400'>
                  {t('chat.noConversations', 'Nenhuma conversa')}
                </h3>
                <p className='text-slate-500 dark:text-slate-500'>
                  {t('chat.noConversationsDesc', 'Suas conversas aparecerão aqui')}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;
