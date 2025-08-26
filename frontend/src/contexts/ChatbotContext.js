import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, X, Send, Mic, MicOff, Image, 
  Volume2, VolumeX, Download, Bot, User, Loader
} from 'lucide-react';

const ChatbotContext = createContext();

export const useChatbot = () => useContext(ChatbotContext);

export const ChatbotProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('pt');
  const [isMuted, setIsMuted] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // CAMADA 3: Sistema de Chatbot Aprimorado
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // CAMADA 3: Perguntas sugeridas inteligentes
  const defaultSuggestions = [
    "Como funciona a bolsa de valores agrícola?",
    "Quais são as principais criptomoedas?",
    "Como faço para me cadastrar?",
    "Quais são os planos disponíveis?",
    "Como funciona o sistema de fretes?",
    "Preciso de ajuda com pagamentos"
  ];

  // CAMADA 3: Respostas inteligentes baseadas no contexto
  const getIntelligentResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (lowerMessage.includes('bolsa') || lowerMessage.includes('valores') || lowerMessage.includes('ações')) {
      return {
        text: "A bolsa de valores agrícola do Agroisync oferece cotações em tempo real de commodities como soja, milho, boi gordo e café. Você pode acompanhar as variações de preços e volumes de negociação através do nosso painel interativo na página inicial.",
        type: 'info',
        relatedLinks: ['/home', '/sobre']
      };
    }
    
    if (lowerMessage.includes('cripto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
      return {
        text: "Nossa plataforma oferece dados em tempo real das principais criptomoedas através da API CoinGecko. Você pode acompanhar preços, volumes e variações percentuais, além de integrar com carteiras Metamask para transações seguras.",
        type: 'info',
        relatedLinks: ['/cripto']
      };
    }
    
    if (lowerMessage.includes('cadastrar') || lowerMessage.includes('registrar') || lowerMessage.includes('conta')) {
      return {
        text: "Para se cadastrar no Agroisync, clique em 'Cadastrar' no menu superior. O processo é simples e rápido: você precisará fornecer seu email, criar uma senha e confirmar seu cadastro. Após a confirmação, terá acesso a todas as funcionalidades da plataforma.",
        type: 'help',
        relatedLinks: ['/cadastro']
      };
    }
    
    if (lowerMessage.includes('planos') || lowerMessage.includes('preços') || lowerMessage.includes('assinatura')) {
      return {
        text: "Oferecemos diferentes planos para atender suas necessidades: Plano Básico (gratuito), Plano Pro e Plano Enterprise. Cada plano inclui funcionalidades específicas como acesso a dados em tempo real, suporte prioritário e recursos avançados. Confira todos os detalhes na página de planos.",
        type: 'info',
        relatedLinks: ['/planos']
      };
    }
    
    if (lowerMessage.includes('fretes') || lowerMessage.includes('transporte') || lowerMessage.includes('logística')) {
      return {
        text: "O sistema de fretes do Agroisync conecta produtores e transportadores. Você pode cadastrar cargas, buscar transportadores disponíveis e gerenciar todo o processo de logística de forma integrada e transparente.",
        type: 'info',
        relatedLinks: ['/agroconecta']
      };
    }
    
    if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar') || lowerMessage.includes('cartão')) {
      return {
        text: "Aceitamos diversos métodos de pagamento: cartões de crédito/débito, PIX e boleto bancário. Todos os pagamentos são processados de forma segura através de gateways certificados. Em caso de problemas, nosso suporte está disponível 24/7.",
        type: 'help',
        relatedLinks: ['/suporte', '/ajuda']
      };
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte') || lowerMessage.includes('problema')) {
      return {
        text: "Estamos aqui para ajudar! Você pode entrar em contato conosco através do email contato@agroisync.com, telefone (66) 99236-2830, ou criar um ticket de suporte diretamente na plataforma. Nossa equipe responde em até 2 horas.",
        type: 'support',
        relatedLinks: ['/contato', '/ajuda']
      };
    }
    
    // Resposta padrão para mensagens não reconhecidas
    return {
      text: "Obrigado pela sua mensagem! Sou o assistente virtual do Agroisync e posso ajudar com informações sobre nossa plataforma, incluindo bolsa de valores, criptomoedas, cadastro, planos e muito mais. Como posso te ajudar hoje?",
      type: 'general',
      relatedLinks: ['/sobre', '/home']
    };
  };

  // CAMADA 3: Processar mensagem do usuário
  const processUserMessage = async (message) => {
    try {
      setIsTyping(true);
      
      // Adicionar mensagem do usuário ao histórico
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Obter resposta inteligente
      const response = getIntelligentResponse(message);
      
      // Adicionar resposta ao histórico
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
        relatedLinks: response.relatedLinks
      };
      
      setChatHistory(prev => [...prev, botMessage]);
      
      // Atualizar perguntas sugeridas baseadas no contexto
      updateSuggestedQuestions(response.type);
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      // Mensagem de erro amigável
      const errorMessage = {
        id: Date.now() + 1,
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato com nosso suporte.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // CAMADA 3: Atualizar perguntas sugeridas baseadas no contexto
  const updateSuggestedQuestions = (contextType) => {
    let newSuggestions = [];
    
    switch (contextType) {
      case 'info':
        newSuggestions = [
          "Quer saber mais sobre criptomoedas?",
          "Como funciona o sistema de fretes?",
          "Quais são os benefícios dos planos?"
        ];
        break;
      case 'help':
        newSuggestions = [
          "Precisa de ajuda com cadastro?",
          "Como funciona o sistema de pagamentos?",
          "Quer falar com nosso suporte?"
        ];
        break;
      case 'support':
        newSuggestions = [
          "Como criar um ticket de suporte?",
          "Quais são os canais de atendimento?",
          "Precisa de ajuda urgente?"
        ];
        break;
      default:
        newSuggestions = defaultSuggestions;
    }
    
    setSuggestedQuestions(newSuggestions);
  };

  // Inicializar mensagem de boas-vindas
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      language: language
    };
    setMessages([welcomeMessage]);
  }, [language]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(language);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
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
  }, [language]);

  const getLanguageCode = (lang) => {
    const codes = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN'
    };
    return codes[lang] || 'pt-BR';
  };

  const getWelcomeMessage = () => {
    const messages = {
      'pt': 'Olá! Sou o assistente IA do AgroSync. Como posso ajudar você hoje?',
      'en': 'Hello! I\'m the AgroSync AI assistant. How can I help you today?',
      'es': '¡Hola! Soy el asistente IA de AgroSync. ¿Cómo puedo ayudarte hoy?',
      'zh': '你好！我是AgroSync的AI助手。今天我能为您做些什么？'
    };
    return messages[language] || messages['pt'];
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simular resposta da IA (substituir por API real)
      const botResponse = await generateAIResponse(inputText);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        language: language
      };

      setMessages(prev => [...prev, botMessage]);

      // Falar resposta se não estiver mutado
      if (!isMuted && synthesisRef.current) {
        speakText(botResponse);
      }
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date(),
        language: language
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput) => {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const input = userInput.toLowerCase();
    
    // Respostas baseadas em palavras-chave (substituir por API real)
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

  const toggleVoiceInput = () => {
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
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
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

    // Simular análise da imagem (substituir por API real)
    const reader = new FileReader();
    reader.onload = async () => {
      const imageMessage = {
        id: Date.now(),
        type: 'user',
        content: 'Imagem enviada para análise',
        image: reader.result,
        timestamp: new Date(),
        language: language
      };

      setMessages(prev => [...prev, imageMessage]);
      setIsLoading(true);

      try {
        // Simular análise da IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysisResponse = await analyzeImage(file);
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: analysisResponse,
          timestamp: new Date(),
          language: language
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Erro ao analisar imagem:', error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (file) => {
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
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // Atualizar mensagem de boas-vindas
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      language: newLanguage
    };
    setMessages([welcomeMessage]);
  };

  const clearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      language: language
    };
    setMessages([welcomeMessage]);
  };

  const value = {
    isOpen,
    messages,
    inputText,
    isLoading,
    isListening,
    isSpeaking,
    language,
    isMuted,
    toggleChatbot,
    setInputText,
    handleSendMessage,
    toggleVoiceInput,
    toggleMute,
    handleImageUpload,
    changeLanguage,
    clearChat,
    fileInputRef
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      
      {/* Botão flutuante do chatbot */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-600 text-white rounded-full shadow-elevated hover:bg-slate-700 transition-colors duration-200 z-50 flex items-center justify-center"
        title="Assistente IA"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      {/* Interface do chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-elevated border border-slate-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Assistente IA</h3>
                  <p className="text-xs text-slate-600">AgroSync</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Seletor de idioma */}
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                >
                  <option value="pt">🇧🇷 PT</option>
                  <option value="en">🇺🇸 EN</option>
                  <option value="es">🇪🇸 ES</option>
                  <option value="zh">🇨🇳 ZH</option>
                </select>
                
                {/* Botão de mute */}
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={clearChat}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  title="Limpar conversa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-slate-600' : 'bg-slate-100'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3 text-white" />
                        ) : (
                          <Bot className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg px-3 py-2 ${
                        message.type === 'user' 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {message.image && (
                          <div className="mb-2">
                            <img 
                              src={message.image} 
                              alt="Imagem enviada" 
                              className="w-full max-w-xs rounded-lg"
                            />
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-2">
                    <Loader className="w-4 h-4 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">Digitando...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                  disabled={isLoading}
                />
                
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
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  title="Enviar imagem"
                  disabled={isLoading}
                >
                  <Image className="w-4 h-4" />
                </button>
                
                {/* Reconhecimento de voz */}
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={isListening ? 'Parar gravação' : 'Gravar áudio'}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                
                {/* Enviar mensagem */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatbotContext.Provider>
  );
};
