import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Mic, MicOff, Image, Loader2, Bot, User } from 'lucide-react'
// import { useLanguage } from '../contexts/LanguageContext'
import useStore from '../store/useStore'

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [mode, setMode] = useState('text')
  const messagesEndRef = useRef(null)

  // const { } = useLanguage()
  const { chatbotOpen, toggleChatbot, chatHistory, addChatMessage } = useStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    setIsOpen(chatbotOpen)
  }, [chatbotOpen])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    addChatMessage(userMessage)
    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateBotResponse(message),
        timestamp: new Date()
      }

      addChatMessage(botMessage)
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = userMessage => {
    const responses = {
      intermediação:
        'Nossa plataforma de intermediação conecta produtores e compradores através de IA. Você pode publicar produtos ou buscar ofertas que atendam suas necessidades.',
      planos:
        'Oferecemos planos desde gratuito até enterprise. O plano básico custa R$ 99/mês e permite publicações ilimitadas. Quer saber mais sobre algum plano específico?',
      produto:
        'Para publicar um produto, acesse sua dashboard e clique em "Novo Produto". Preencha as informações como tipo, quantidade, preço e localização.',
      frete:
        'No AgroConecta você pode publicar cargas ou se cadastrar como transportador. Nossa IA conecta automaticamente cargas com transportadores disponíveis na rota.',
      ajuda:
        'Estou aqui para ajudar! Posso esclarecer dúvidas sobre intermediação, planos, como publicar produtos, contratar fretes e muito mais. O que você gostaria de saber?'
    }

    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    return 'Obrigado pela sua pergunta! Posso ajudá-lo com informações sobre intermediação, planos, produtos, fretes e muito mais. Como posso ser útil?'
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceMode = () => {
    if (mode === 'voice') {
      setIsListening(false)
      setMode('text')
    } else {
      setMode('voice')
      setIsListening(true)
      setTimeout(() => {
        setIsListening(false)
        setMessage('Como funciona a intermediação?')
      }, 3000)
    }
  }

  const suggestions = [
    'Como funciona a intermediação?',
    'Quais são os planos disponíveis?',
    'Como publicar um produto?',
    'Como contratar um frete?'
  ]

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleChatbot()}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
          isOpen ? 'bg-neon-pink shadow-neon' : 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon'
        }`}
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div
              key='close'
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className='h-6 w-6 text-white' />
            </motion.div>
          ) : (
            <motion.div
              key='chat'
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className='h-6 w-6 text-white' />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className='card-futuristic fixed bottom-24 right-6 z-40 flex h-96 w-80 flex-col'
          >
            <div className='flex items-center justify-between border-b border-white/10 p-4'>
              <div className='flex items-center space-x-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-neon-blue to-neon-purple'>
                  <Bot className='h-4 w-4 text-white' />
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-white'>Assistente IA</h3>
                  <p className='text-xs text-neon-green'>Online</p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setMode('text')}
                  className={`rounded p-1 ${mode === 'text' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400'}`}
                >
                  <MessageCircle className='h-4 w-4' />
                </button>
                <button
                  onClick={toggleVoiceMode}
                  className={`rounded p-1 ${mode === 'voice' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400'}`}
                >
                  {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
                </button>
                <button
                  onClick={() => setMode('image')}
                  className={`rounded p-1 ${mode === 'image' ? 'bg-neon-purple/20 text-neon-purple' : 'text-gray-400'}`}
                >
                  <Image className='h-4 w-4' />
                </button>
              </div>
            </div>

            <div className='flex-1 space-y-4 overflow-y-auto p-4'>
              {chatHistory.length === 0 && (
                <div className='text-center'>
                  <Bot className='mx-auto mb-2 h-8 w-8 text-neon-blue' />
                  <p className='mb-4 text-sm text-gray-400'>
                    Olá! Sou o assistente IA do AgroSync. Como posso ajudá-lo hoje?
                  </p>
                  <div className='space-y-2'>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(suggestion)}
                        className='block w-full rounded p-2 text-left text-xs text-gray-300 transition-colors hover:bg-white/5 hover:text-neon-blue'
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[80%] items-start space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        msg.type === 'user' ? 'bg-neon-blue' : 'bg-gradient-to-r from-neon-blue to-neon-purple'
                      }`}
                    >
                      {msg.type === 'user' ? (
                        <User className='h-3 w-3 text-white' />
                      ) : (
                        <Bot className='h-3 w-3 text-white' />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.type === 'user' ? 'bg-neon-blue/20 text-white' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      <p className='text-sm'>{msg.content}</p>
                      <p className='mt-1 text-xs opacity-60'>{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex justify-start'
                >
                  <div className='flex items-start space-x-2'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-neon-blue to-neon-purple'>
                      <Bot className='h-3 w-3 text-white' />
                    </div>
                    <div className='rounded-lg bg-white/5 p-3'>
                      <div className='flex items-center space-x-1'>
                        <Loader2 className='h-4 w-4 animate-spin text-neon-blue' />
                        <span className='text-sm text-gray-400'>Pensando...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className='border-t border-white/10 p-4'>
              <div className='flex items-center space-x-2'>
                <input
                  type='text'
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Digite sua mensagem...'
                  className='input-futuristic flex-1 text-sm'
                  disabled={mode !== 'text'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className='rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple p-2 text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Send className='h-4 w-4' />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatbotWidget
