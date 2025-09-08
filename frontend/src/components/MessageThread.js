import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Paperclip,
  Image,
  File,
  MapPin,
  Smile,
  MoreVertical,
  Download,
  Eye,
  Trash,
  Reply,
  X,
  MessageSquare
} from 'lucide-react'
import messagingService, { MESSAGE_TYPES, MESSAGE_STATUS } from '../services/messagingService'

const MessageThread = ({ userId, transactionId, onBack }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [hasMessages, setHasMessages] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (transactionId) {
      loadMessages()
      subscribeToMessages()
    }

    return () => {
      // Limpar subscrição ao desmontar
      if (transactionId) {
        messagingService.unsubscribeFromTransaction(transactionId)
      }
    }
  }, [transactionId])

  useEffect(() => {
    scrollToBottom()
    setHasMessages(messages.length > 0)
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const transactionMessages = await messagingService.getTransactionMessages(transactionId)
      setMessages(transactionMessages)
      setHasMessages(transactionMessages.length > 0)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      setMessages([])
      setHasMessages(false)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    try {
      messagingService.subscribeToTransaction(transactionId, newMessage => {
        setMessages(prev => [...prev, newMessage])
        setHasMessages(true)
      })
    } catch (error) {
      console.error('Erro ao inscrever-se nas mensagens:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return

    setSending(true)
    try {
      let messageContent = newMessage.trim()
      let messageType = 'text'
      let attachments = null

      if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
          messageType = 'image'
          messageContent = 'Imagem enviada'
        } else {
          messageType = 'file'
          messageContent = `Arquivo: ${selectedFile.name}`
        }
        attachments = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          url: URL.createObjectURL(selectedFile)
        }
      }

      // Determinar destinatário (usuário oposto da transação)
      const otherUserId =
        messages.length > 0 ? (messages[0].from === userId ? messages[0].to : messages[0].from) : 'user_other'; // Fallback para primeira mensagem

      const sentMessage = await messagingService.sendMessage(
        transactionId,
        otherUserId,
        messageContent,
        messageType,
        attachments
      )

      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
      setSelectedFile(null)
      setReplyTo(null)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const handleFileSelect = event => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setShowAttachments(false)
    }
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleReply = message => {
    setReplyTo(message)
    const fromUser = message.from || message.fromUserId
    setNewMessage(`@${fromUser}: `)
  }

  const handleDeleteMessage = async messageId => {
    try {
      // Em produção, chamar API para deletar
      console.log('Deletando mensagem:', messageId)
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
    }
  }

  const formatTime = timestamp => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOwnMessage = message => message.from === userId || message.fromUserId === userId

  const getMessageStatus = message => {
    if (message.read) return 'read'
    if (message.delivered) return 'delivered'
    return 'sent'
  }

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600'></div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col rounded-lg border border-gray-200 bg-white'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <button onClick={onBack} className='p-2 text-gray-600 transition-colors hover:text-gray-800' title='Voltar'>
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Transação #{transactionId}</h3>
              <p className='text-sm text-gray-600'>
                {messages.length} mensagem{messages.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        {messages.length === 0 ? (
          <div className='flex h-64 flex-col items-center justify-center text-gray-500'>
            <MessageSquare className='mb-4 h-16 w-16 text-gray-300' />
            <p className='text-lg font-medium'>Nenhuma mensagem</p>
            <p className='text-sm'>Inicie a conversa enviando uma mensagem</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage(message) ? 'order-2' : 'order-1'}`}>
                  {/* Mensagem de resposta */}
                  {replyTo && message.id === replyTo.id && (
                    <div className='mb-2 rounded-lg bg-gray-100 p-2 text-xs text-gray-600'>
                      <p className='font-medium'>Respondendo a:</p>
                      <p className='truncate'>{replyTo.body || replyTo.content}</p>
                    </div>
                  )}

                  {/* Conteúdo da mensagem */}
                  <div
                    className={`rounded-lg p-3 ${
                      isOwnMessage(message) ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'image' && (
                      <div className='mb-2'>
                        <img
                          src={message.attachments?.url || '/placeholder-image.jpg'}
                          alt='Imagem'
                          className='h-auto max-w-full rounded-lg'
                        />
                      </div>
                    )}

                    {message.type === 'file' && (
                      <div className='mb-2 rounded-lg bg-white bg-opacity-20 p-2'>
                        <div className='flex items-center space-x-2'>
                          <File className='h-4 w-4' />
                          <span className='text-sm font-medium'>{message.attachments?.name}</span>
                          <button
                            onClick={() => window.open(message.attachments?.url, '_blank')}
                            className='rounded p-1 hover:bg-white hover:bg-opacity-20'
                            title='Download'
                          >
                            <Download className='h-4 w-4' />
                          </button>
                        </div>
                      </div>
                    )}

                    <p className='text-sm'>{message.body || message.content}</p>
                  </div>

                  {/* Status e tempo */}
                  <div
                    className={`mt-1 flex items-center space-x-2 ${
                      isOwnMessage(message) ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className='text-xs text-gray-500'>{formatTime(message.createdAt || message.timestamp)}</span>

                    {isOwnMessage(message) && (
                      <span
                        className={`text-xs ${MESSAGE_STATUS[getMessageStatus(message)].color} rounded-full px-2 py-1`}
                      >
                        {MESSAGE_STATUS[getMessageStatus(message)].name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 ${
                    isOwnMessage(message) ? 'order-1 ml-2' : 'order-2 mr-2'
                  }`}
                >
                  <span className='text-xs font-medium text-white'>
                    {(message.from || message.fromUserId || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className='border-t border-gray-200 p-4'>
        {/* Mensagem de resposta */}
        {replyTo && (
          <div className='mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <p className='text-xs font-medium text-emerald-600'>Respondendo a:</p>
                <p className='truncate text-sm text-emerald-800'>{replyTo.body || replyTo.content}</p>
              </div>
              <button onClick={() => setReplyTo(null)} className='text-emerald-600 hover:text-emerald-800'>
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}

        {/* Arquivo selecionado */}
        {selectedFile && (
          <div className='mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <File className='h-4 w-4 text-blue-600' />
                <span className='text-sm text-blue-800'>{selectedFile.name}</span>
              </div>
              <button onClick={() => setSelectedFile(null)} className='text-blue-600 hover:text-blue-800'>
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}

        <div className='flex items-end space-x-2'>
          {/* Botão de anexos */}
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className='p-2 text-gray-400 transition-colors hover:text-gray-600'
            title='Anexos'
          >
            <Paperclip className='h-5 w-5' />
          </button>

          {/* Menu de anexos */}
          {showAttachments && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='absolute bottom-20 left-4 z-10 rounded-lg border border-gray-200 bg-white p-2 shadow-lg'
            >
              <div className='space-y-2'>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='flex w-full items-center space-x-2 rounded-lg p-2 text-sm hover:bg-gray-50'
                >
                  <Image className='h-4 w-4 text-blue-600' />
                  <span>Imagem</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='flex w-full items-center space-x-2 rounded-lg p-2 text-sm hover:bg-gray-50'
                >
                  <File className='h-4 w-4 text-green-600' />
                  <span>Arquivo</span>
                </button>
                <button
                  onClick={() => setShowAttachments(false)}
                  className='flex w-full items-center space-x-2 rounded-lg p-2 text-sm hover:bg-gray-50'
                >
                  <MapPin className='h-4 w-4 text-red-600' />
                  <span>Localização</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Input de texto */}
          <div className='flex-1'>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Digite sua mensagem...'
              className='w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
              rows='1'
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          {/* Botão de envio */}
          <button
            onClick={handleSendMessage}
            disabled={sending || (!newMessage.trim() && !selectedFile)}
            className='rounded-lg bg-emerald-600 p-3 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
            title='Enviar mensagem'
          >
            <Send className='h-5 w-5' />
          </button>
        </div>

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileSelect}
          className='hidden'
          accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
        />
      </div>
    </div>
  )
}

export default MessageThread
