import React, { useState, useRef, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual do AgroSync. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
      return 'Olá! Como posso ajudá-lo com sua operação agrícola hoje?'
    }
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('cotação')) {
      return 'Posso ajudá-lo com informações sobre preços de produtos agrícolas e criptomoedas. Que tipo de informação você precisa?'
    }
    
    if (lowerMessage.includes('investimento') || lowerMessage.includes('gestão')) {
      return 'Nossa plataforma oferece ferramentas completas para gestão de investimentos agrícolas. Posso mostrar como começar?'
    }
    
    if (lowerMessage.includes('propriedade') || lowerMessage.includes('cadastro')) {
      return 'Para cadastrar suas propriedades, acesse o menu "Propriedades" no dashboard. Posso guiá-lo pelo processo?'
    }
    
    if (lowerMessage.includes('soja') || lowerMessage.includes('milho') || lowerMessage.includes('algodão')) {
      return 'Posso fornecer informações atualizadas sobre preços e tendências desses produtos agrícolas. Que informação específica você precisa?'
    }
    
    if (lowerMessage.includes('cripto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
      return 'Acompanhamos os preços das principais criptomoedas em tempo real. Posso mostrar as últimas atualizações do mercado?'
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte')) {
      return 'Estou aqui para ajudar! Posso auxiliar com dúvidas sobre a plataforma, preços, gestão de propriedades e muito mais. O que você gostaria de saber?'
    }
    
    if (lowerMessage.includes('segurança') || lowerMessage.includes('proteção')) {
      return 'Nossa plataforma utiliza as mais avançadas tecnologias de segurança e criptografia para proteger seus dados e operações.'
    }
    
    return 'Entendo sua pergunta. Posso ajudá-lo com informações sobre agricultura, preços de produtos, gestão de propriedades ou criptomoedas. Pode reformular sua pergunta?'
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-slate-300 text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 enhanced-shadow"
        aria-label="Abrir chatbot"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col enhanced-shadow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-slate-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">🌱</span>
              </div>
              <div>
                <h3 className="font-semibold">AgroSync Assistant</h3>
                <p className="text-xs text-blue-100">Online • Pronto para ajudar</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
