import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Search, 
  Filter, 
  Eye, 
  Reply, 
  Archive, 
  Trash2, 
  Star, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

const ContactManager = ({ userId }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'replied', 'archived'
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadContactData()
  }, [userId])

  const loadContactData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/contact/messages?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (messageId, reply) => {
    try {
      const response = await fetch(`/api/contact/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reply })
      })

      const data = await response.json()

      if (data.success) {
        loadContactData()
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Erro ao responder mensagem:', error)
    }
  }

  const handleArchive = async (messageId) => {
    try {
      const response = await fetch(`/api/contact/messages/${messageId}/archive`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        loadContactData()
      }
    } catch (error) {
      console.error('Erro ao arquivar mensagem:', error)
    }
  }

  const handleDelete = async (messageId) => {
    try {
      const response = await fetch(`/api/contact/messages/${messageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        loadContactData()
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />
      default:
        return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'text-blue-600 dark:text-blue-400'
      case 'replied':
        return 'text-green-600 dark:text-green-400'
      case 'archived':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      case 'high':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'normal':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
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
          <Mail className="w-5 h-5 mr-2 text-agro-emerald" />
          Gerenciador de Contato
        </h2>
        <button
          onClick={loadContactData}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total || 0}
              </p>
            </div>
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Não Lidas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unread || 0}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Respondidas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.replied || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Arquivadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.archived || 0}
              </p>
            </div>
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar mensagens..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">Todas</option>
          <option value="unread">Não Lidas</option>
          <option value="replied">Respondidas</option>
          <option value="archived">Arquivadas</option>
        </select>
      </div>

      {/* Lista de mensagens */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(message.status)}
                    <span className={`text-sm font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {message.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {message.message.length > 100 
                    ? `${message.message.substring(0, 100)}...` 
                    : message.message
                  }
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{message.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{message.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReply(message.id, 'Resposta automática')
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleArchive(message.id)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(message.id)
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma mensagem encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Não há mensagens para exibir'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ContactManager