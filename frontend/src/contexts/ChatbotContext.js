import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

const ChatbotContext = createContext();

export const useChatbot = () => useContext(ChatbotContext);

export const ChatbotProvider = ({ children }) => {
  const { currentLanguage } = useLanguage();
  
  // Estados principais
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState(currentLanguage || 'pt');
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const fileInputRef = useRef(null);

  const getWelcomeMessage = useCallback(() => {
    const messages = {
      'pt': 'Olá! Sou o assistente IA do AgroSync. Como posso ajudar você hoje?',
      'en': 'Hello! I\'m the AgroSync AI assistant. How can I help you today?',
      'es': '¡Hola! Soy el asistente IA de AgroSync. ¿Cómo puedo ayudarte hoy?',
      'zh': '你好！我是AgroSync的AI助手。今天我能为您做些什么？'
    };
    return messages[language] || messages['pt'];
  }, [language]);

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
  }, [language, getWelcomeMessage]);

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
    </ChatbotContext.Provider>
  );
};
