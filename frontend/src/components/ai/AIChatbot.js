import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  Loader2, 
  Brain, 
  Lightbulb, 
  Settings, 
  X, 
  Sparkles,
  Zap,
  MessageCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('general');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar mensagens
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('ai.welcome', '👋 Olá! Sou o assistente IA da AGROISYNC. Como posso ajudá-lo hoje?'),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [t]);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    setIsTyping(true);

    try {
      // Simular resposta da IA com efeito de digitação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      setIsTyping(false);
    }
  }, [inputMessage]);

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Respostas inteligentes baseadas em contexto
    if (lowerMessage.includes('preço') || lowerMessage.includes('cotação')) {
      return `📊 Para informações de preços e cotações, posso ajudar você a:
• Consultar cotações de grãos em tempo real
• Analisar tendências de mercado
• Calcular custos de produção
• Comparar preços entre regiões

Que tipo de informação de preço você precisa?`;
    }
    
    if (lowerMessage.includes('clima') || lowerMessage.includes('tempo')) {
      return `🌤️ Sobre o clima, posso fornecer:
• Previsão meteorológica para sua região
• Alertas de chuva e seca
• Dados históricos climáticos
• Recomendações para plantio

Sua localização foi detectada automaticamente. Precisa de informações específicas sobre o clima?`;
    }
    
    if (lowerMessage.includes('grão') || lowerMessage.includes('soja') || lowerMessage.includes('milho')) {
      return `🌾 Informações sobre grãos disponíveis:
• Cotações atualizadas por região
• Análise de mercado
• Dicas de plantio e colheita
• Cálculos de produtividade

Qual grão você gostaria de saber mais?`;
    }
    
    if (lowerMessage.includes('calcular') || lowerMessage.includes('cálculo')) {
      return `🧮 Posso ajudar com cálculos agrícolas:
• Custo por hectare
• Produtividade estimada
• ROI de investimentos
• Conversões de unidades
• Análise de rentabilidade

Que tipo de cálculo você precisa fazer?`;
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return `🤖 Sou seu assistente IA especializado em agronegócio! Posso ajudar com:

📊 **Mercado e Preços**
• Cotações de grãos
• Análise de tendências
• Comparação de preços

🌤️ **Clima e Tempo**
• Previsão meteorológica
• Alertas climáticos
• Dados históricos

🧮 **Cálculos Agrícolas**
• Custos de produção
• Produtividade
• ROI de investimentos

🔍 **Busca Inteligente**
• Informações sobre culturas
• Técnicas de plantio
• Soluções para problemas

Como posso ajudá-lo hoje?`;
    }
    
    if (lowerMessage.includes('acessibilidade') || lowerMessage.includes('deficiência')) {
      return `♿ Recursos de acessibilidade disponíveis:
• Alto contraste
• Texto ampliado
• Navegação por teclado
• Leitores de tela
• Modo daltônico
• Redução de movimento

Posso ativar qualquer recurso de acessibilidade para você. Qual você precisa?`;
    }
    
    // Resposta padrão inteligente
    return `🤖 Entendi sua pergunta: "${message}"

Como assistente IA especializado em agronegócio, posso ajudá-lo com:
• 📊 Cotações e preços de grãos
• 🌤️ Informações climáticas
• 🧮 Cálculos agrícolas
• 🔍 Busca de informações
• ♿ Recursos de acessibilidade

Como posso ajudá-lo melhor?`;
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-6 right-6 w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
        }}
      >
        {/* Header Clean Agronegócio */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200 text-gray-900 rounded-t-2xl"
          style={{
            background: 'linear-gradient(135deg, #38a169, #48bb78)',
            boxShadow: '0 4px 20px rgba(56, 161, 105, 0.3)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">AGROISYNC AI</h3>
              <p className="text-xs text-white/80">Assistente Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Panel Futurista */}
        {showSettings && !isMinimized && (
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <h4 className="font-medium text-white mb-3">Configurações</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Modo da IA
                </label>
                <select
                  value={aiMode}
                  onChange={(e) => setAiMode(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white"
                >
                  <option value="general">Geral</option>
                  <option value="agriculture">Agricultura</option>
                  <option value="commerce">Comércio</option>
                  <option value="support">Suporte</option>
                </select>
              </div>
              <button
                onClick={clearChat}
                className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Limpar Conversa
              </button>
            </div>
          </div>
        )}

        {/* Messages Futuristas */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                      : 'bg-gray-800 text-white border border-gray-700'
                  }`}
                  style={{
                    boxShadow: message.type === 'user' 
                      ? '0 4px 20px rgba(0, 255, 136, 0.3)'
                      : '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                    <span className="text-sm">Pensando...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Digitando...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Futurista */}
        {!isMinimized && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ai.placeholder', 'Digite sua mensagem...')}
                  className="w-full p-3 pr-12 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                  rows={2}
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>Pressione Enter para enviar</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-green-400">
                  <Brain className="w-3 h-3" />
                  IA Ativa
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <Lightbulb className="w-3 h-3" />
                  Dicas
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatbot;
