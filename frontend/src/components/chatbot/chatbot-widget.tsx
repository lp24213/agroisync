import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Mic, MicOff, Image, Paperclip, Bot, User } from 'lucide-react'
import { ChatMessage } from '@/types'

interface ChatbotWidgetProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatbotWidget({ isOpen, onToggle }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'bot',
      user: { id: 'bot', name: 'AgroSync Bot', email: '', role: 'admin', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
      content: 'Olá! Sou o assistente virtual AgroSync. Como posso ajudá-lo hoje?',
      type: 'text',
      sender: 'bot',
      timestamp: new Date(),
      read: true,
      metadata: {}
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !isRecording) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user',
      user: { id: 'user', name: 'Usuário', email: '', role: 'produtor', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
      content: inputValue || 'Mensagem de voz',
      type: isRecording ? 'voice' : 'text',
      sender: 'user',
      timestamp: new Date(),
      read: false,
      metadata: {}
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5).map(m => ({
            content: m.content,
            sender: m.sender
          }))
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'bot',
          user: { id: 'bot', name: 'AgroSync Bot', email: '', role: 'admin', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
          content: data.response,
          type: 'text',
          sender: 'bot',
          timestamp: new Date(),
          read: false,
          metadata: data.metadata || {}
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'bot',
        user: { id: 'bot', name: 'AgroSync Bot', email: '', role: 'admin', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        type: 'text',
        sender: 'bot',
        timestamp: new Date(),
        read: false,
        metadata: {}
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      startVoiceRecording()
    } else {
      setIsRecording(false)
      stopVoiceRecording()
    }
  }

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'pt-BR'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsRecording(false)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognition.start()
    } else {
      alert('Reconhecimento de voz não é suportado neste navegador')
      setIsRecording(false)
    }
  }

  const stopVoiceRecording = () => {
    setIsRecording(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const fileMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: 'user',
          user: { id: 'user', name: 'Usuário', email: '', role: 'produtor', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
          content: `Arquivo enviado: ${file.name}`,
          type: 'image',
          sender: 'user',
          timestamp: new Date(),
          read: false,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileData: e.target?.result
          }
        }
        setMessages(prev => [...prev, fileMessage])
        
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('message', 'Analise esta imagem')
          
          const response = await fetch('/api/chatbot/analyze-image', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            const botMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              userId: 'bot',
              user: { id: 'bot', name: 'AgroSync Bot', email: '', role: 'admin', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
              content: data.analysis,
              type: 'text',
              sender: 'bot',
              timestamp: new Date(),
              read: false,
              metadata: {}
            }
            setMessages(prev => [...prev, botMessage])
          }
        } catch (error) {
          console.error('Error analyzing image:', error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bot size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  AgroSync Assistant
                </span>
              </div>
              <button
                onClick={onToggle}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.type === 'image' && message.metadata?.fileData && (
                      <img
                        src={message.metadata.fileData as string}
                        alt="Uploaded file"
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Paperclip size={20} />
                </button>
                
                <button
                  onClick={handleVoiceRecord}
                  className={`p-2 ${
                    isRecording
                      ? 'text-red-500 hover:text-red-700'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputValue.trim() && !isRecording)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
