import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Bot, Loader2, Brain, Lightbulb, Settings, X } from 'lucide-react';

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Speech synthesis and image upload functionality available for future use
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('general');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Inicializar mensagens
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('ai.welcome', 'Olá! Sou o assistente IA da Agroisync. Como posso ajudá-lo hoje?'),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [t]);

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Configurar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = useCallback(async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage]);

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('cotação')) {
      return 'Posso ajudá-lo com informações sobre preços de commodities agrícolas. Que produto específico você gostaria de consultar?';
    }
    
    if (lowerMessage.includes('clima') || lowerMessage.includes('tempo')) {
      return 'Para informações climáticas, recomendo verificar nossa seção de previsão do tempo. Posso ajudá-lo com outras informações sobre agricultura?';
    }
    
    if (lowerMessage.includes('fertilizante') || lowerMessage.includes('adubo')) {
      return 'Temos uma ampla variedade de fertilizantes em nossa loja. Posso ajudá-lo a encontrar o produto ideal para sua cultura.';
    }
    
    if (lowerMessage.includes('semente')) {
      return 'Oferecemos sementes de alta qualidade para diversas culturas. Qual tipo de semente você está procurando?';
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return 'Estou aqui para ajudá-lo! Posso fornecer informações sobre produtos, preços, clima, e muito mais. O que você gostaria de saber?';
    }
    
    return 'Obrigado pela sua pergunta! Nossa equipe está trabalhando para fornecer respostas mais específicas. Enquanto isso, posso ajudá-lo com informações gerais sobre agricultura e nossos produtos.';
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assistente IA</h3>
            <p className="text-sm text-gray-600">Agroisync</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Configurações</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modo da IA
              </label>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="general">Geral</option>
                <option value="agriculture">Agricultura</option>
                <option value="commerce">Comércio</option>
                <option value="support">Suporte</option>
              </select>
            </div>
            <button
              onClick={clearChat}
              className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Limpar Conversa
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">Digitando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai.placeholder', 'Digite sua mensagem...')}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              rows={2}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                isListening
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Pressione Enter para enviar</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              IA Ativa
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Dicas
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;
