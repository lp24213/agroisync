import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Clock, User, Search, Filter,
  Archive, Trash
} from 'lucide-react';
import messagingService from '../services/messagingService';

const ConversationList = ({ userId, onSelectConversation, selectedTransactionId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const userConversations = await messagingService.getUserConversations(userId);
      setConversations(userConversations);
      
      // Se não houver conversas, mostrar mensagem
      if (userConversations.length === 0) {
        console.log('Nenhuma conversa encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const handleArchiveConversation = async (transactionId) => {
    try {
      // Em produção, chamar API para arquivar
      console.log('Arquivando conversa:', transactionId);
      // Atualizar estado local
      setConversations(prev => 
        prev.map(conv => 
          conv.transactionId === transactionId 
            ? { ...conv, archived: true }
            : conv
        )
      );
    } catch (error) {
      console.error('Erro ao arquivar conversa:', error);
    }
  };

  const handleDeleteConversation = async (transactionId) => {
    try {
      // Em produção, chamar API para deletar
      console.log('Deletando conversa:', transactionId);
      // Atualizar estado local
      setConversations(prev => 
        prev.filter(conv => conv.transactionId !== transactionId)
      );
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && conversation.unreadCount > 0) ||
      (filter === 'archived' && conversation.archived);
    
    const matchesSearch = !searchTerm || 
      (conversation.lastMessage?.body || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getMessagePreview = (content, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversas</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Filtros"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Filtros */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'unread'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Não lidas
              </button>
              <button
                onClick={() => setFilter('archived')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'archived'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Arquivadas
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhuma conversa</p>
            <p className="text-sm">Suas conversas aparecerão aqui</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.transactionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    selectedTransactionId === conversation.transactionId
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              Transação #{conversation.transactionId}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            {getMessagePreview(conversation.lastMessage?.body || '')}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(conversation.lastMessage?.createdAt || conversation.lastMessage?.timestamp || '')}
                            </span>
                            <span className="text-emerald-600">
                              {conversation.lastMessage?.type || 'text'}
                            </span>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveConversation(conversation.transactionId);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Arquivar"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conversation.transactionId);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Deletar"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
