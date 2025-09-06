import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Chatbot = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { t, currentLanguage } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [chatbotPersonality, setChatbotPersonality] = useState('agro-expert');
  const [userSentiment, setUserSentiment] = useState('neutral');
  const [chatbotLanguage, setChatbotLanguage] = useState(currentLanguage || 'pt');
  const [isMuted, setIsMuted] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const fileInputRef = useRef(null);

  // Personalidades do chatbot com cores premium
  const personalities = {
    'agro-expert': {
      name: 'Agro Expert',
      avatar: '🌾',
      description: 'Especialista em agronegócio',
      color: 'from-agro-green to-agro-yellow'
    },
    'marketplace': {
      name: 'Marketplace',
      avatar: '🛒',
      description: 'Especialista em vendas',
      color: 'from-web3-neon-blue to-web3-neon-cyan'
    },
    'freight': {
      name: 'Freight Master',
      avatar: '🚛',
      description: 'Especialista em logística',
      color: 'from-web3-neon-green to-web3-neon-emerald'
    },
    'crypto': {
      name: 'Crypto Guru',
      avatar: '₿',
      description: 'Especialista em criptomoedas',
      color: 'from-web3-neon-purple to-web3-neon-teal'
    }
  };

  // Mensagem de boas-vindas multilíngue
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [chatbotPersonality, currentLanguage]);

  const getWelcomeMessage = () => {
    const messages = {
      'pt': `Olá! Sou ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\nComo posso ajudar você hoje? Posso:\n• Analisar cotações de grãos\n• Ajudar no marketplace\n• Explicar DeFi e criptomoedas\n• Fornecer dados de geolocalização\n• Buscar informações de fretes\n• Analisar imagens de produtos\n\nUse 🎤 para falar, 📷 para enviar imagens ou digite sua pergunta!`,
      'en': `Hello! I'm ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\nHow can I help you today? I can:\n• Analyze grain quotes\n• Help with marketplace\n• Explain DeFi and cryptocurrencies\n• Provide geolocation data\n• Search freight information\n• Analyze product images\n\nUse 🎤 to speak, 📷 to send images or type your question!`,
      'es': `¡Hola! Soy ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n¿Cómo puedo ayudarte hoy? Puedo:\n• Analizar cotizaciones de granos\n• Ayudar en el marketplace\n• Explicar DeFi y criptomonedas\n• Proporcionar datos de geolocalización\n• Buscar información de fletes\n• Analizar imágenes de productos\n\n¡Usa 🎤 para hablar, 📷 para enviar imágenes o escribe tu pregunta!`,
      'zh': `你好！我是${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n今天我能为您做些什么？我可以：\n• 分析谷物报价\n• 帮助市场交易\n• 解释DeFi和加密货币\n• 提供地理定位数据\n• 搜索货运信息\n• 分析产品图像\n\n使用🎤说话，📷发送图像或输入您的问题！`
    };
    return messages[currentLanguage] || messages['pt'];
  };

  // Verificar acesso ao chatbot baseado no plano do usuário
  const checkChatbotAccess = () => {
    if (!isAuthenticated) {
      return true; // Usuários não logados podem usar o chatbot básico
    }

    // Verificar plano do usuário (implementar lógica real)
    const userPlan = user?.plan || 'basic';
    
    switch (userPlan) {
      case 'premium':
        return true; // Acesso completo
      case 'pro':
        return true; // Acesso completo
      case 'basic':
        return true; // Acesso básico
      default:
        return true; // Acesso básico por padrão
    }
  };

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(currentLanguage);

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

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Inicializar síntese de voz
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage]);

  const getLanguageCode = (lang) => {
    const codes = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN'
    };
    return codes[lang] || 'pt-BR';
  };

  const toggleChatbot = () => {
    // Verificar acesso antes de abrir o chatbot
    if (!isOpen && !checkChatbotAccess()) {
      alert('Para usar o chatbot avançado, faça upgrade do seu plano.');
      return;
    }
    setIsOpen(!isOpen);
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
    
    // Atualizar mensagem de boas-vindas
    const welcomeMessage = {
      id: Date.now(),
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsProcessing(true);

    try {
      // Simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar resposta inteligente
      const response = generateIntelligentResponse(message);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Falar resposta se não estiver mutado
      if (!isMuted && synthesisRef.current) {
        speakText(response);
      }
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  };

  const generateIntelligentResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (input.includes('soja') || input.includes('soybean')) {
      return 'A soja é uma das principais culturas do agronegócio brasileiro. Em 2024, a safra estimada é de 160 milhões de toneladas. Posso ajudar com informações sobre preços, mercado ou técnicas de cultivo.';
    }
    
    if (input.includes('milho') || input.includes('corn')) {
      return 'O milho é fundamental para a produção de ração animal e etanol. Os preços estão em alta devido à forte demanda interna. Precisa de informações específicas sobre o mercado?';
    }
    
    if (input.includes('frete') || input.includes('transport')) {
      return 'O AgroSync oferece o AgroConecta para conectar produtores com transportadores. Você pode anunciar fretes ou encontrar transportes disponíveis. Gostaria de saber mais sobre como usar?';
    }
    
    if (input.includes('pagamento') || input.includes('payment')) {
      return 'Aceitamos pagamentos via cartão (Stripe) e criptomoedas (Metamask). Após o pagamento, você terá acesso completo aos dados privados da plataforma.';
    }
    
    if (input.includes('clima') || input.includes('weather')) {
      return 'Na página inicial você encontra informações do clima em tempo real baseadas na sua localização. Os dados são atualizados constantemente via OpenWeather API.';
    }
    
    if (input.includes('bolsa') || input.includes('stock')) {
      return 'A bolsa agrícola na página inicial mostra cotações em tempo real de produtos como soja, milho, boi gordo e café. Os dados são atualizados a cada 30 segundos.';
    }
    
    if (input.includes('ajuda') || input.includes('help')) {
      return 'Posso ajudar com informações sobre produtos agrícolas, mercado, fretes, pagamentos, clima e muito mais. Basta perguntar!';
    }

    // Resposta padrão
    return 'Interessante! No AgroSync, você pode encontrar informações sobre produtos agrícolas, conectar-se com transportadores, acompanhar o mercado e muito mais. Como posso ajudar especificamente?';
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!synthesisRef.current || isMuted) return;

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(currentLanguage);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter menos de 5MB.');
      return;
    }

    // Simular análise da imagem
    const reader = new FileReader();
    reader.onload = async () => {
      const imageMessage = {
        id: Date.now(),
        text: '📷 Imagem enviada para análise',
        sender: 'user',
        timestamp: new Date(),
        image: reader.result
      };

      setMessages(prev => [...prev, imageMessage]);
      setIsProcessing(true);

      try {
        // Simular análise da IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysisResponse = analyzeImage(file);
        
        const botMessage = {
          id: Date.now() + 1,
          text: analysisResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Erro ao analisar imagem:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = (file) => {
    // Simular análise de imagem (substituir por API real)
    const responses = [
      'Esta imagem mostra uma plantação saudável. Posso identificar sinais de boa irrigação e nutrição do solo.',
      'Vejo que é uma imagem de equipamento agrícola. Parece estar em bom estado de conservação.',
      'Esta imagem mostra um produto agrícola de boa qualidade. Recomendo verificar a classificação e embalagem.',
      'Identifico uma área de pastagem bem manejada. A cobertura vegetal está adequada para o gado.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    // i18n.changeLanguage(newLanguage);
    
    // Atualizar mensagem de boas-vindas
    const welcomeMessage = {
      id: Date.now(),
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage();
    }
  };

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
                  {/* Seletor de idioma */}
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-600 border-gray-300'
                    }`}
                  >
                    <option value="pt">🇧🇷</option>
                    <option value="en">🇺🇸</option>
                    <option value="es">🇪🇸</option>
                    <option value="zh">🇨🇳</option>
                  </select>
                  
                  <button
                    onClick={togglePersonalitySelector}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-green-600'
                    }`}
                    title={t('ui.button.changePersonality')}
                  >
                    🔄
                  </button>
                  <button
                    onClick={toggleMinimize}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-green-600'
                    }`}
                    title={isMinimized ? t('ui.button.expand') : t('ui.button.minimize')}
                  >
                    {isMinimized ? '⬆️' : '⬇️'}
                  </button>
                  <button
                    onClick={toggleChatbot}
                    className={`p-1 rounded text-xs transition-colors ${
                      isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                    }`}
                    title={t('ui.button.close')}
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
                        {message.image && (
                          <div className="mb-2">
                            <img 
                              src={message.image} 
                              alt={t('ui.label.imageSent')} 
                              className="w-full max-w-xs rounded-lg"
                            />
                          </div>
                        )}
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
                    {/* Upload de imagem */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title={t('ui.button.sendImage')}
                    >
                      📷
                    </button>

                    {/* Reconhecimento de voz */}
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
                      title={t('ui.button.sendMessage')}
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
                      {isSpeaking && <span>🔊 Falando...</span>}
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
