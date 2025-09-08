import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  X, 
  User, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
  Loader2
} from 'lucide-react'

const PrivateChat = ({
  recipient,
  onClose,
  context = 'general' // 'order', 'freight', 'general'
}) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (recipient) {
      loadMessages()
      checkOnlineStatus()
    }
  }, [recipient])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages/${recipient.id}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (err) {
      setError(t('chat.error', 'Erro ao carregar mensagens'))
    } finally {
      setLoading(false)
    }
  }

  const checkOnlineStatus = async () => {
    try {
      const response = await fetch(`/api/users/${recipient.id}/status`)
      const data = await response.json()

      if (data.success) {
        setIsOnline(data.isOnline)
      }
    } catch (err) {
      console.error('Erro ao verificar status online:', err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      senderId: user.id,
      recipientId: recipient.id,
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: recipient.id,
          text: newMessage,
          context
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, id: data.message.id, status: 'sent' }
              : msg
          )
        )
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'failed' }
              : msg
          )
        )
      }
    } catch (err) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      )
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-gray-400" />
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-gray-400" />
      case 'read':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              {recipient.avatar ? (
                <img
                  src={recipient.avatar}
                  alt={recipient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {recipient.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {recipient.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === user.id
                ? 'bg-agro-emerald text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center justify-between mt-1 text-xs ${
                message.senderId === user.id
                  ? 'text-white/70'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.senderId === user.id && (
                  <div className="flex items-center space-x-1">
                    {getMessageStatusIcon(message.status)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            />
            <button className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-agro-emerald text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivateChat