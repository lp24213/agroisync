import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, Filter, MoreVertical, Pin,
  Archive, Trash, Star, MessageSquare,
  Clock, Check, CheckCheck, AlertCircle
} from 'lucide-react';

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
    const matchesSearch = chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'pinned' && chat.isPinned);
    
    return matchesSearch && matchesFilter;
  });

  const sortedChats = filteredChats.sort((a, b) => {
    // Pinned chats first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by last message timestamp
    return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // 7 days
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

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getContextBadge = (context) => {
    switch (context) {
      case 'order':
        return { label: t('chat.order', 'Pedido'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'freight':
        return { label: t('chat.freight', 'Frete'), color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      default:
        return { label: t('chat.general', 'Geral'), color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' };
    }
  };

  const renderChatItem = (chat) => {
    const isSelected = selectedChatId === chat.id;
    const isLastMessageFromOther = chat.lastMessage.senderId !== user.id;
    const contextBadge = getContextBadge(chat.context);
    
    return (
      <motion.div
        key={chat.id}
        className={`p-4 cursor-pointer border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
          isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
        }`}
        onClick={() => onSelectChat(chat)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {chat.otherUser.name?.charAt(0) || 'U'}
              </span>
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold truncate ${
                  chat.unreadCount > 0 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {chat.otherUser.name}
                </h3>
                {chat.isPinned && (
                  <Pin className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTime(chat.lastMessage.timestamp)}
                </span>
                {!isLastMessageFromOther && getMessageStatusIcon(chat.lastMessage.status)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className={`text-sm truncate ${
                  chat.unreadCount > 0 
                    ? 'text-slate-900 dark:text-white font-medium' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {chat.lastMessage.content}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${contextBadge.color}`}>
                  {contextBadge.label}
                </span>
              </div>
              
              {chat.unreadCount > 0 && (
                <div className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('chat.loadingChats', 'Carregando conversas...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {t('chat.messages', 'Mensagens')}
          </h2>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('chat.search', 'Buscar conversas...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.all', 'Todas')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.unread', 'Não lidas')}
          </button>
          <button
            onClick={() => setFilter('pinned')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'pinned'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {t('chat.pinned', 'Fixadas')}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {sortedChats.length > 0 ? (
            sortedChats.map(renderChatItem)
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {t('chat.noConversations', 'Nenhuma conversa')}
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
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
