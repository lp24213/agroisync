import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Pin, 
  Volume2, 
  VolumeX, 
  Archive, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
  Loader2
} from 'lucide-react'

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'pinned', 'archived'

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    setLoading(true)
    try {
      // Simular carregamento de conversas
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockChats = [
        {
          id: '1',
          name: 'João Silva',
          lastMessage: 'Obrigado pela entrega!',
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
          unreadCount: 2,
          isOnline: true,
          avatar: null,
          isPinned: true,
          isArchived: false,
          type: 'individual'
        },
        {
          id: '2',
          name: 'Maria Santos',
          lastMessage: 'Quando será a próxima entrega?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
          unreadCount: 0,
          isOnline: false,
          avatar: null,
          isPinned: false,
          isArchived: false,
          type: 'individual'
        },
        {
          id: '3',
          name: 'Grupo de Produtores',
          lastMessage: 'Reunião amanhã às 14h',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
          unreadCount: 5,
          isOnline: false,
          avatar: null,
          isPinned: true,
          isArchived: false,
          type: 'group'
        },
        {
          id: '4',
          name: 'Pedro Oliveira',
          lastMessage: 'Produto entregue com sucesso',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
          unreadCount: 0,
          isOnline: true,
          avatar: null,
          isPinned: false,
          isArchived: false,
          type: 'individual'
        }
      ]
      
      setChats(mockChats)
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (chat) => {
    if (chat.type === 'group') {
      return <MessageCircle className="w-4 h-4 text-gray-400" />
    }
    
    if (chat.isOnline) {
      return <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    }
    
    return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
  }

  const getMessageStatusIcon = (chat) => {
    if (chat.unreadCount > 0) {
      return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    }
    
    return <CheckCircle2 className="w-4 h-4 text-gray-400" />
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    
    if (diff < 1000 * 60) {
      return 'Agora'
    } else if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}m`
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h`
    } else {
      return timestamp.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
    }
  }

  const filteredChats = chats.filter(chat => {
    const matchesSearch = searchTerm === '' || 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'pinned' && chat.isPinned) ||
      (filter === 'archived' && chat.isArchived)
    
    return matchesSearch && matchesFilter
  })

  const sortedChats = filteredChats.sort((a, b) => {
    // Pinned chats first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // Then by timestamp
    return b.timestamp - a.timestamp
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-agro-emerald" />
          Conversas
        </h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar conversas..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 mb-4">
        {[
          { id: 'all', name: 'Todas' },
          { id: 'unread', name: 'Não Lidas' },
          { id: 'pinned', name: 'Fixadas' },
          { id: 'archived', name: 'Arquivadas' }
        ].map((filterOption) => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === filterOption.id
                ? 'bg-agro-emerald text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filterOption.name}
          </button>
        ))}
      </div>

      {/* Lista de conversas */}
      <div className="space-y-2">
        {sortedChats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedChatId === chat.id
                ? 'bg-agro-emerald/10 border border-agro-emerald'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {chat.name.charAt(0)}
                    </span>
                  )}
                </div>
                {getStatusIcon(chat)}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {chat.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {chat.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(chat.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getMessageStatusIcon(chat)}
                    {chat.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedChats.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma conversa encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Não há conversas para exibir'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatList