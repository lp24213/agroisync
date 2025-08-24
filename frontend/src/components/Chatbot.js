import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Chatbot = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSentiment, setUserSentiment] = useState('neutral');
  const [chatbotPersonality, setChatbotPersonality] = useState('agro-expert');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Personalidades do chatbot
  const personalities = {
    'agro-expert': {
      name: 'Dr. AgroBot',
      avatar: '🌾',
      description: 'Especialista em agronegócio',
      style: 'Profissional e técnico',
      color: isDark ? 'from-cyan-400 to-purple-500' : 'from-green-600 to-blue-600'
    },
    'friendly': {
      name: 'AgroAmigo',
      avatar: '🤝',
      description: 'Amigável e acolhedor',
      style: 'Casual e simpático',
      color: isDark ? 'from-purple-500 to-pink-500' : 'from-blue-600 to-green-600'
    },
    'analyst': {
      name: 'DataAgro',
      avatar: '📊',
      description: 'Analista de dados',
      style: 'Analítico e preciso',
      color: isDark ? 'from-pink-500 to-cyan-400' : 'from-green-600 to-blue-600'
    },
    'crypto': {
      name: 'CryptoAgro',
      avatar: '₿',
      description: 'Especialista em DeFi',
      style: 'Inovador e tecnológico',
      color: isDark ? 'from-cyan-400 to-pink-500' : 'from-green-600 to-blue-600'
    }
  };

  // Mensagem inicial
  useEffect(() => {
    const initialMessage = {
      id: 1,
      text: `Olá! Sou ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\nComo posso ajudar você hoje? Posso:\n• 📈 Analisar cotações de grãos\n• 🏪 Ajudar no marketplace\n• 💰 Explicar DeFi e criptomoedas\n• 📍 Fornecer dados de geolocalização\n• 🔍 Buscar informações do IBGE\n• 💳 Ajudar com pagamentos\n\nEscolha uma opção ou me diga o que precisa!`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    };
    setMessages([initialMessage]);
  }, [chatbotPersonality]);

  // Estado inicial minimizado em dispositivos móveis
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setIsMinimized(isMobile);
  }, []);

  // Scroll para última mensagem
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
        setInputValue(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const togglePersonalitySelector = () => {
    setShowPersonalitySelector(!showPersonalitySelector);
  };

  const handlePersonalityChange = (personality) => {
    setChatbotPersonality(personality);
    setShowPersonalitySelector(false);
    
    // Limpar mensagens e enviar nova mensagem de boas-vindas
    const newMessage = {
      id: Date.now(),
      text: `Olá! Agora sou ${personalities[personality].name} ${personalities[personality].avatar}\n\nComo posso ajudar você hoje?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'personality-change'
    };
    setMessages([newMessage]);
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsProcessing(true);

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setIsProcessing(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cotação') || input.includes('preço') || input.includes('grãos')) {
      return '📈 Aqui estão as cotações atuais dos principais grãos:\n\n🌾 Soja: R$ 180,50 (+1.8%)\n🌽 Milho: R$ 85,30 (-0.3%)\n☕ Café: R$ 1.250,00 (+2.5%)\n\nQuer que eu analise alguma tendência específica?';
    }
    
    if (input.includes('marketplace') || input.includes('loja') || input.includes('comprar')) {
      return '🏪 Nossa loja oferece:\n\n• Grãos certificados\n• Preços competitivos\n• Entrega segura\n• Pagamento flexível\n\nPosso te ajudar a encontrar o produto ideal!';
    }
    
    if (input.includes('cripto') || input.includes('defi') || input.includes('blockchain')) {
      return '₿ DeFi no agronegócio:\n\n• Staking de grãos\n• NFTs de propriedades\n• Smart contracts para contratos\n• Pagamentos em criptomoedas\n\nQuer saber mais sobre algum aspecto?';
    }
    
    if (input.includes('ibge') || input.includes('dados') || input.includes('estatísticas')) {
      return '📊 Dados do IBGE disponíveis:\n\n• Produção agrícola\n• Área plantada\n• Produtividade por região\n• Preços médios\n\nQue tipo de informação você precisa?';
    }
    
    if (input.includes('pagamento') || input.includes('pagar') || input.includes('cartão')) {
      return '💳 Formas de pagamento:\n\n• Cartão de crédito/débito\n• PIX\n• Boleto bancário\n• Criptomoedas\n• Transferência bancária\n\nQual prefere?';
    }
    
    return '🤔 Interessante! Posso te ajudar com:\n\n📈 Cotações e análises\n🏪 Marketplace de grãos\n₿ DeFi e criptomoedas\n📊 Dados do IBGE\n💳 Pagamentos\n\nMe diga mais sobre o que você precisa!';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-cyan-400 to-purple-500 text-white'
            : 'bg-gradient-to-br from-green-600 to-blue-600 text-white'
        }`}
        title="Abrir chatbot"
      >
        <span className="text-2xl">🤖</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-80 h-96"
        >
          {/* Container principal do chat */}
          <div className={`w-full h-full rounded-2xl shadow-2xl backdrop-blur-md border overflow-hidden ${
            isDark
              ? 'bg-gray-900/95 border-gray-700'
              : 'bg-white/95 border-gray-200'
          }`}>
            {/* Header do chat */}
            <div className={`p-3 border-b ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${personalities[chatbotPersonality].color} flex items-center justify-center text-white text-sm font-bold`}>
                    {personalities[chatbotPersonality].avatar}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {personalities[chatbotPersonality].name}
                    </h3>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {personalities[chatbotPersonality].description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={togglePersonalitySelector}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-green-600'
                    }`}
                    title="Mudar personalidade"
                  >
                    🔄
                  </button>
                  <button
                    onClick={toggleMinimize}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-green-600'
                    }`}
                    title={isMinimized ? "Expandir" : "Minimizar"}
                  >
                    {isMinimized ? '⬆️' : '⬇️'}
                  </button>
                  <button
                    onClick={toggleChatbot}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                    }`}
                    title="Fechar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Seletor de personalidade */}
            {showPersonalitySelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 border-b ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                }`}
              >
                <p className={`text-xs mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Escolha uma personalidade:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(personalities).map(([key, personality]) => (
                    <button
                      key={key}
                      onClick={() => handlePersonalityChange(key)}
                      className={`p-2 rounded text-xs transition-all ${
                        chatbotPersonality === key
                          ? (isDark
                              ? 'bg-cyan-400/20 border border-cyan-400 text-cyan-400'
                              : 'bg-green-500/20 border border-green-500 text-green-600')
                          : (isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                      }`}
                    >
                      <div className="text-lg mb-1">{personality.avatar}</div>
                      <div className="font-medium">{personality.name}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Área de mensagens */}
            {!isMinimized && (
              <>
                <div className="flex-1 h-64 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs p-2 rounded-lg ${
                        message.sender === 'user'
                          ? (isDark
                              ? 'bg-cyan-400 text-white'
                              : 'bg-green-500 text-white')
                          : (isDark
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-900')
                      }`}>
                        <div className="text-sm whitespace-pre-line">{message.text}</div>
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.sender === 'user' ? 'text-white' : (isDark ? 'text-gray-300' : 'text-gray-600')
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Indicador de digitação */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className={`max-w-xs p-2 rounded-lg ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDark ? 'bg-cyan-400' : 'bg-green-500'
                            }`} style={{ animationDelay: '0ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDark ? 'bg-cyan-400' : 'bg-green-500'
                            }`} style={{ animationDelay: '150ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDark ? 'bg-cyan-400' : 'bg-green-500'
                            }`} style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs ml-2">Digitando...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Área de input */}
                <div className={`p-3 border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleVoiceRecognition}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isListening
                          ? (isDark ? 'bg-cyan-400 text-white' : 'bg-green-500 text-white')
                          : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                      }`}
                      title={isListening ? 'Parar gravação' : 'Gravar áudio'}
                    >
                      {isListening ? '🔴' : '🎤'}
                    </button>

                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className={`flex-1 p-2 rounded-lg border transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                          : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                      }`}
                    />

                    <button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        inputValue.trim() && !isTyping
                          ? (isDark
                              ? 'bg-cyan-400 text-white hover:bg-purple-500'
                              : 'bg-green-500 text-white hover:bg-blue-600')
                          : (isDark
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed')
                      }`}
                      title="Enviar mensagem"
                    >
                      📤
                    </button>
                  </div>

                  {/* Indicadores de status */}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className={`flex items-center space-x-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {isListening && <span>🎤 Gravando...</span>}
                      {isProcessing && <span>⚙️ Processando...</span>}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Sentimento: {userSentiment === 'positive' ? '😊' : userSentiment === 'negative' ? '😔' : '😐'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
