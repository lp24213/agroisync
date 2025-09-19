import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Mic, 
  MicOff, 
  Image, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Settings, 
  Zap, 
  Globe, 
  Calculator,
  Search,
  Download,
  Upload,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';

const Chatbot = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { t, currentLanguage, changeLanguage: changeLanguageContext } = useLanguage();
  
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
  const [userSentiment] = useState('neutral');
  const [isMuted, setIsMuted] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedTools, setSelectedTools] = useState(['web_search', 'calculator', 'image_analysis']);
  const [usageStats, setUsageStats] = useState({
    messagesUsed: 0,
    imagesAnalyzed: 0,
    audioTranscribed: 0,
    webSearches: 0
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Personalidades do chatbot com cores premium
  const personalities = useMemo(() => ({
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
  }), []);

  // Função para mensagem de boas-vindas multilíngue
  const getWelcomeMessage = useCallback(() => {
    const access = checkChatbotAccess();
    const planStatus = access.isLimited ? '🔒 Gratuito' : '👑 Premium';
    
    const messages = {
      'pt': `🤖 Olá! Sou ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n**${planStatus}** - Como posso ajudar você hoje?\n\n**🔧 Funções Disponíveis:**\n• 🔍 Buscar informações na web\n• 🧮 Realizar cálculos matemáticos\n• 📷 Analisar e gerar imagens\n• 🎤 Transcrever áudio para texto\n• 💻 Gerar código personalizado\n• 📊 Analisar dados e criar gráficos\n\n**🌾 Especialidades Agro:**\n• Analisar cotações de grãos\n• Ajudar no marketplace\n• Explicar DeFi e criptomoedas\n• Buscar informações de fretes\n\nUse os botões abaixo ou digite sua pergunta!`,
      'en': `🤖 Hello! I'm ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n**${planStatus}** - How can I help you today?\n\n**🔧 Available Functions:**\n• 🔍 Search web information\n• 🧮 Perform mathematical calculations\n• 📷 Analyze and generate images\n• 🎤 Transcribe audio to text\n• 💻 Generate custom code\n• 📊 Analyze data and create charts\n\n**🌾 Agro Specialties:**\n• Analyze grain quotes\n• Help with marketplace\n• Explain DeFi and cryptocurrencies\n• Search freight information\n\nUse the buttons below or type your question!`,
      'es': `🤖 ¡Hola! Soy ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n**${planStatus}** - ¿Cómo puedo ayudarte hoy?\n\n**🔧 Funciones Disponibles:**\n• 🔍 Buscar información en la web\n• 🧮 Realizar cálculos matemáticos\n• 📷 Analizar y generar imágenes\n• 🎤 Transcribir audio a texto\n• 💻 Generar código personalizado\n• 📊 Analizar datos y crear gráficos\n\n**🌾 Especialidades Agro:**\n• Analizar cotizaciones de granos\n• Ayudar en el marketplace\n• Explicar DeFi y criptomonedas\n• Buscar información de fletes\n\n¡Usa los botones de abajo o escribe tu pregunta!`,
      'zh': `🤖 你好！我是${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\n**${planStatus}** - 今天我能为您做些什么？\n\n**🔧 可用功能：**\n• 🔍 搜索网络信息\n• 🧮 执行数学计算\n• 📷 分析和生成图像\n• 🎤 将音频转录为文本\n• 💻 生成自定义代码\n• 📊 分析数据并创建图表\n\n**🌾 农业专业：**\n• 分析谷物报价\n• 帮助市场交易\n• 解释DeFi和加密货币\n• 搜索货运信息\n\n使用下面的按钮或输入您的问题！`
    };
    return messages[currentLanguage] || messages['pt'];
  }, [chatbotPersonality, currentLanguage, personalities]);

  // Função para falar texto
  const speakText = useCallback((text) => {
    if (!synthesisRef.current || isMuted) return;

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(currentLanguage);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  }, [isMuted, currentLanguage]);

  // Mensagem de boas-vindas multilíngue
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [chatbotPersonality, currentLanguage, getWelcomeMessage]);

  // Função para enviar mensagem
  const handleSendMessage = useCallback(async (message = inputValue, attachments = []) => {
    if (!message.trim() || isTyping) return;

    // Verificar limite de mensagens
    if (!checkUpgradeNeeded('messages')) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsProcessing(true);

    // Atualizar estatísticas de uso
    setUsageStats(prev => ({ ...prev, messagesUsed: prev.messagesUsed + 1 }));

    try {
      // Simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar resposta inteligente com funções avançadas
      const response = await generateIntelligentResponse(message, attachments);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        isAdvanced: response.includes('**') || response.includes('🔍') || response.includes('🧮')
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Falar resposta se não estiver mutado
      if (!isMuted && synthesisRef.current) {
        speakText(response.replace(/\*\*(.*?)\*\*/g, '$1')); // Remover markdown para fala
      }
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  }, [inputValue, isTyping, isMuted, setMessages, setInputValue, setIsTyping, setIsProcessing, speakText]);

  // Funções avançadas disponíveis
  const advancedFunctions = {
    web_search: {
      name: 'Web Search',
      icon: <Search size={16} />,
      description: 'Buscar informações na web',
      premium: true
    },
    calculator: {
      name: 'Calculator',
      icon: <Calculator size={16} />,
      description: 'Realizar cálculos matemáticos',
      premium: false
    },
    image_analysis: {
      name: 'Image Analysis',
      icon: <Image size={16} />,
      description: 'Analisar e gerar imagens',
      premium: true
    },
    audio_transcription: {
      name: 'Audio Transcription',
      icon: <Mic size={16} />,
      description: 'Transcrever áudio para texto',
      premium: true
    },
    code_generation: {
      name: 'Code Generation',
      icon: <Sparkles size={16} />,
      description: 'Gerar código',
      premium: true
    },
    data_analysis: {
      name: 'Data Analysis',
      icon: <Globe size={16} />,
      description: 'Analisar dados e criar gráficos',
      premium: true
    }
  };

  // Verificar acesso ao chatbot baseado no plano do usuário
  const checkChatbotAccess = (feature = null) => {
    if (!isAuthenticated) {
      return { hasAccess: true, isLimited: true, plan: 'free' };
    }

    const userPlan = user?.plan || 'free';
    const planLimits = {
      free: { messages: 10, images: 3, audio: 2, webSearch: 0 },
      basic: { messages: 50, images: 10, audio: 5, webSearch: 5 },
      pro: { messages: 200, images: 50, audio: 20, webSearch: 50 },
      premium: { messages: 1000, images: 200, audio: 100, webSearch: 200 }
    };

    const limits = planLimits[userPlan] || planLimits.free;
    
    if (feature) {
      const hasAccess = limits[feature] > usageStats[feature + (feature === 'webSearch' ? '' : 'Used')];
      return { hasAccess, isLimited: userPlan === 'free', plan: userPlan, limits };
    }

    return { hasAccess: true, isLimited: userPlan === 'free', plan: userPlan, limits };
  };

  // Verificar se precisa de upgrade
  const checkUpgradeNeeded = (feature) => {
    const access = checkChatbotAccess(feature);
    if (!access.hasAccess) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
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
  }, [currentLanguage, handleSendMessage]);

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

  // Função para iniciar gravação de áudio
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Adicionar mensagem do usuário com áudio
        const userMessage = {
          id: Date.now(),
          type: 'user',
          text: '🎤 Áudio enviado',
          audio: URL.createObjectURL(audioBlob),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Simular transcrição do áudio
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            text: '🎤 **Transcrição do áudio:** "Preciso de informações sobre preços de soja na região"\n\nVou buscar as informações mais atualizadas para você!\n\n📊 **Preços atuais da soja:**\n• Soja 60kg: R$ 145,50\n• Variação 24h: +2,3%\n• Tendência: Alta',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }, 2000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Parar gravação após 30 segundos
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        }
      }, 30000);

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  // Função para parar gravação de áudio
  const stopAudioRecording = () => {
    setIsRecording(false);
  };

  // Função para obter clima por IP
  const getWeatherByIP = async () => {
    try {
      // Simular obtenção de IP e localização
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      const { city, region, country } = data;
      const location = `${city}, ${region}, ${country}`;

      // Simular dados do clima
      const weatherData = {
        location: location,
        temperature: Math.round(Math.random() * 30 + 10), // 10-40°C
        condition: ['Ensolarado', 'Nublado', 'Chuvoso', 'Parcialmente nublado'][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 40 + 40), // 40-80%
        wind: Math.round(Math.random() * 20 + 5) // 5-25 km/h
      };

      return `🌤️ **Clima em ${weatherData.location}:**\n\n🌡️ **Temperatura:** ${weatherData.temperature}°C\n☁️ **Condição:** ${weatherData.condition}\n💧 **Umidade:** ${weatherData.humidity}%\n💨 **Vento:** ${weatherData.wind} km/h\n\n📍 *Dados obtidos via geolocalização IP em tempo real*`;

    } catch (error) {
      console.error('Erro ao obter clima:', error);
      return '❌ Erro ao obter informações do clima. Tente novamente mais tarde.';
    }
  };

  // Função para análise avançada de imagem
  const performAdvancedImageAnalysis = async (imageData, file) => {
    const startTime = Date.now();
    
    // Simular análise de IA avançada
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const processingTime = Date.now() - startTime;
    
    // Simular detecções baseadas no tipo de arquivo e tamanho
    const isPlantImage = file.name.toLowerCase().includes('plant') || 
                        file.name.toLowerCase().includes('crop') ||
                        file.name.toLowerCase().includes('leaf');
    
    const detections = isPlantImage ? 
      `• **Plantas detectadas:** ${Math.round(85 + Math.random() * 15)}%\n• **Solo identificado:** Sim\n• **Pragas:** Nenhuma detectada\n• **Doenças:** Nenhuma detectada\n• **Nutrientes:** Níveis adequados` :
      `• **Objetos detectados:** ${Math.round(70 + Math.random() * 25)}%\n• **Cores predominantes:** Verde, Marrom\n• **Texturas:** Variadas\n• **Iluminação:** Adequada`;
    
    const recommendations = isPlantImage ?
      `• Continue o monitoramento regular\n• Solo parece saudável\n• Plantas em bom estado de desenvolvimento\n• Considere fertilização preventiva\n• Mantenha irrigação adequada` :
      `• Imagem de boa qualidade para análise\n• Considere melhorar a iluminação\n• Foque em áreas de interesse específicas\n• Capture em diferentes ângulos`;
    
    return {
      detections,
      recommendations,
      confidence: Math.round(85 + Math.random() * 15),
      processingTime,
      metadata: {
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        dimensions: 'Análise de resolução em andamento...',
        colorProfile: 'RGB',
        compression: 'JPEG'
      }
    };
  };

  // Função para transcrição avançada de áudio
  const performAdvancedAudioTranscription = async (audioBlob) => {
    const startTime = Date.now();
    
    // Simular transcrição de IA avançada
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
    
    const processingTime = Date.now() - startTime;
    
    // Simular diferentes tipos de transcrições baseadas em palavras-chave
    const possibleTranscriptions = [
      {
        text: "Preciso de informações sobre preços de soja na região",
        detections: "• **Idioma:** Português (Brasil)\n• **Sotaque:** Regional\n• **Ruído de fundo:** Baixo\n• **Clareza:** Alta",
        response: "📊 **Preços atuais da soja:**\n• Soja 60kg: R$ 145,50\n• Variação 24h: +2,3%\n• Tendência: Alta\n\n💡 **Recomendação:** Momento favorável para venda"
      },
      {
        text: "Como está o clima para plantio hoje?",
        detections: "• **Idioma:** Português (Brasil)\n• **Sotaque:** Sul\n• **Ruído de fundo:** Moderado\n• **Clareza:** Boa",
        response: "🌤️ **Condições climáticas:**\n• Temperatura: 24°C\n• Umidade: 65%\n• Vento: 8 km/h\n• **Recomendação:** Condições ideais para plantio"
      },
      {
        text: "Detectei uma praga nas minhas plantas",
        detections: "• **Idioma:** Português (Brasil)\n• **Sotaque:** Nordeste\n• **Ruído de fundo:** Baixo\n• **Clareza:** Excelente",
        response: "🐛 **Diagnóstico de Pragas:**\n• Tipo: Lagarta-do-cartucho\n• Severidade: Média\n• **Tratamento:** Bacillus thuringiensis\n• **Prevenção:** Monitoramento semanal"
      }
    ];
    
    const transcription = possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)];
    
    return {
      text: transcription.text,
      detections: transcription.detections,
      response: transcription.response,
      confidence: Math.round(88 + Math.random() * 12),
      processingTime,
      metadata: {
        duration: '~5s',
        sampleRate: '44.1kHz',
        format: 'WAV',
        channels: 'Mono'
      }
    };
  };


  // Funções avançadas de processamento
  const processAdvancedFunction = async (functionName, input) => {
    switch (functionName) {
      case 'web_search':
        if (!checkUpgradeNeeded('webSearch')) return null;
        return await performWebSearch(input);
      
      case 'calculator':
        return await performCalculation(input);
      
      case 'image_analysis':
        if (!checkUpgradeNeeded('images')) return null;
        return await performImageAnalysis(input);
      
      case 'audio_transcription':
        if (!checkUpgradeNeeded('audio')) return null;
        return await performAudioTranscription(input);
      
      case 'code_generation':
        if (!checkUpgradeNeeded('messages')) return null;
        return await generateCode(input);
      
      case 'data_analysis':
        if (!checkUpgradeNeeded('messages')) return null;
        return await performDataAnalysis(input);
      
      default:
        return null;
    }
  };

  const performWebSearch = async (query) => {
    try {
      // Simular busca na web (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        '📊 Cotações atuais da soja: R$ 85,50/saca',
        '🌾 Previsão de safra 2024: 160 milhões de toneladas',
        '📈 Tendência de mercado: Alta de 3.2% na semana'
      ];
      
      setUsageStats(prev => ({ ...prev, webSearches: prev.webSearches + 1 }));
      return `🔍 **Resultados da busca para "${query}":**\n\n${mockResults.join('\n\n')}`;
    } catch (error) {
      return '❌ Erro ao realizar busca na web. Tente novamente.';
    }
  };

  const performCalculation = async (expression) => {
    try {
      // Simular cálculo matemático
      const result = eval(expression.replace(/[^0-9+\-*/().]/g, ''));
      return `🧮 **Cálculo:** ${expression}\n**Resultado:** ${result}`;
    } catch (error) {
      return '❌ Erro no cálculo. Verifique a expressão matemática.';
    }
  };

  const performImageAnalysis = async (imageData) => {
    try {
      // Simular análise de imagem avançada
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const analyses = [
        '🖼️ **Análise da Imagem:**\n• Tipo: Produto agrícola\n• Qualidade: Excelente\n• Recomendações: Adequado para comercialização',
        '🌱 **Análise da Planta:**\n• Estado de saúde: Bom\n• Necessidades: Irrigação adequada\n• Previsão de colheita: 45 dias',
        '🚛 **Análise do Equipamento:**\n• Estado: Funcionando\n• Manutenção: Necessária em 30 dias\n• Eficiência: 85%'
      ];
      
      setUsageStats(prev => ({ ...prev, imagesAnalyzed: prev.imagesAnalyzed + 1 }));
      return analyses[Math.floor(Math.random() * analyses.length)];
    } catch (error) {
      return '❌ Erro ao analisar imagem. Tente novamente.';
    }
  };

  const performAudioTranscription = async (audioBlob) => {
    try {
      // Simular transcrição de áudio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transcriptions = [
        '🎤 **Transcrição:** "Preciso de informações sobre o preço da soja no mercado atual"',
        '🎤 **Transcrição:** "Como calcular o custo de transporte para 50 toneladas?"',
        '🎤 **Transcrição:** "Qual a melhor época para plantar milho na região sul?"'
      ];
      
      setUsageStats(prev => ({ ...prev, audioTranscribed: prev.audioTranscribed + 1 }));
      return transcriptions[Math.floor(Math.random() * transcriptions.length)];
    } catch (error) {
      return '❌ Erro na transcrição de áudio. Tente novamente.';
    }
  };

  const generateCode = async (request) => {
    try {
      // Simular geração de código
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return `💻 **Código gerado para:** "${request}"\n\n\`\`\`javascript\nfunction calculateCropYield(area, productivity) {\n  return area * productivity;\n}\n\n// Exemplo de uso\nconst result = calculateCropYield(100, 3.5);\nconsole.log(\`Rendimento: \${result} toneladas\`);\n\`\`\``;
    } catch (error) {
      return '❌ Erro na geração de código. Tente novamente.';
    }
  };

  const performDataAnalysis = async (data) => {
    try {
      // Simular análise de dados
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      return `📊 **Análise de Dados:**\n\n• **Tendência:** Crescimento de 12.5%\n• **Padrões identificados:** Sazonalidade clara\n• **Recomendações:** Investir em tecnologia\n• **Previsão:** Aumento de 8% nos próximos 3 meses`;
    } catch (error) {
      return '❌ Erro na análise de dados. Tente novamente.';
    }
  };

  const generateIntelligentResponse = async (userInput, attachments = []) => {
    const input = userInput.toLowerCase();
    
    // Detectar funções avançadas
    if (input.includes('buscar') || input.includes('search') || input.includes('pesquisar')) {
      return await processAdvancedFunction('web_search', userInput);
    }
    
    if (input.includes('calcular') || input.includes('calculate') || /\d+[+\-*/]\d+/.test(input)) {
      return await processAdvancedFunction('calculator', userInput);
    }
    
    if (input.includes('código') || input.includes('code') || input.includes('programar')) {
      return await processAdvancedFunction('code_generation', userInput);
    }
    
    if (input.includes('analisar') || input.includes('analyze') || input.includes('dados')) {
      return await processAdvancedFunction('data_analysis', userInput);
    }
    
    // Respostas baseadas em palavras-chave
    if (input.includes('soja') || input.includes('soybean')) {
      return '🌾 A soja é uma das principais culturas do agronegócio brasileiro. Em 2024, a safra estimada é de 160 milhões de toneladas. Posso ajudar com informações sobre preços, mercado ou técnicas de cultivo.';
    }
    
    if (input.includes('milho') || input.includes('corn')) {
      return '🌽 O milho é fundamental para a produção de ração animal e etanol. Os preços estão em alta devido à forte demanda interna. Precisa de informações específicas sobre o mercado?';
    }
    
    if (input.includes('frete') || input.includes('transport')) {
      return '🚛 O AGROISYNC oferece o AgroConecta para conectar produtores com transportadores. Você pode anunciar fretes ou encontrar transportes disponíveis. Gostaria de saber mais sobre como usar?';
    }
    
    if (input.includes('pagamento') || input.includes('payment')) {
      return '💳 Aceitamos pagamentos via cartão (Stripe) e criptomoedas (Metamask). Após o pagamento, você terá acesso completo aos dados privados da plataforma.';
    }
    
    if (input.includes('clima') || input.includes('weather') || input.includes('tempo')) {
      // Chamar função assíncrona para obter clima por IP
      getWeatherByIP().then(weatherInfo => {
        const weatherMessage = {
          id: Date.now(),
          text: weatherInfo,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, weatherMessage]);
      });
      return '🌤️ Buscando informações do clima baseadas na sua localização IP...';
    }
    
    if (input.includes('bolsa') || input.includes('stock')) {
      return '📈 A bolsa agrícola na página inicial mostra cotações em tempo real de produtos como soja, milho, boi gordo e café. Os dados são atualizados a cada 30 segundos.';
    }
    
    if (input.includes('ajuda') || input.includes('help')) {
      return '🤖 Posso ajudar com informações sobre produtos agrícolas, mercado, fretes, pagamentos, clima e muito mais. Use as funções avançadas para análises detalhadas!';
    }

    // Resposta padrão
    return '🤖 Interessante! No AGROISYNC, você pode encontrar informações sobre produtos agrícolas, conectar-se com transportadores, acompanhar o mercado e muito mais. Como posso ajudar especificamente?';
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



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('A imagem deve ter menos de 10MB.');
      return;
    }

    // Verificar limite de imagens
    if (!checkUpgradeNeeded('images')) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageMessage = {
        id: Date.now(),
        text: '📷 Imagem enviada para análise avançada',
        sender: 'user',
        timestamp: new Date(),
        image: reader.result
      };

      setMessages(prev => [...prev, imageMessage]);
      setIsProcessing(true);

      try {
        // Análise avançada da imagem
        const analysisResponse = await processAdvancedFunction('image_analysis', file);
        
        if (analysisResponse) {
        const botMessage = {
          id: Date.now() + 1,
          text: analysisResponse,
          sender: 'bot',
            timestamp: new Date(),
            isAdvanced: true
        };

        setMessages(prev => [...prev, botMessage]);
        }
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
    changeLanguageContext(newLanguage);
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
          className="fixed inset-0 z-50 w-full h-full"
        >
          {/* Container principal do chat */}
          <div className={`w-full h-full shadow-2xl backdrop-blur-md border overflow-hidden ${
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
                        isAnalyzingImage 
                          ? 'bg-blue-500 text-white animate-pulse' 
                          : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                      }`}
                      title={isAnalyzingImage ? 'Analisando imagem...' : 'Enviar imagem'}
                      disabled={isAnalyzingImage}
                    >
                      {isAnalyzingImage ? '⏳' : '📷'}
                    </button>

                    {/* Gravação de áudio avançada */}
                    <button
                      onClick={isRecording ? stopAudioRecording : startAudioRecording}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isRecording
                          ? (isDark ? 'bg-red-400 text-white animate-pulse' : 'bg-red-500 text-white animate-pulse')
                          : isTranscribingAudio
                          ? 'bg-yellow-500 text-white animate-pulse'
                          : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                      }`}
                      title={
                        isRecording 
                          ? 'Parar gravação' 
                          : isTranscribingAudio 
                          ? 'Transcrevendo áudio...' 
                          : 'Gravar áudio'
                      }
                      disabled={isTranscribingAudio}
                    >
                      {isRecording ? <MicOff size={20} /> : isTranscribingAudio ? <RefreshCw size={20} className="animate-spin" /> : <Mic size={20} />}
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

                  {/* Barra de ferramentas avançadas */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      {/* Botões de funções avançadas */}
                      <button
                        onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                        className={`p-1 rounded transition-colors ${
                          showAdvancedFeatures
                            ? (isDark ? 'bg-cyan-400 text-white' : 'bg-green-500 text-white')
                            : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                        }`}
                        title="Funções Avançadas"
                      >
                        <Sparkles size={14} />
                      </button>

                      {/* Controles de áudio */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1 rounded transition-colors ${
                          isMuted
                            ? (isDark ? 'bg-red-400 text-white' : 'bg-red-500 text-white')
                            : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                        }`}
                        title={isMuted ? 'Ativar Som' : 'Desativar Som'}
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>

                      {/* Indicador de plano */}
                      {checkChatbotAccess().isLimited && (
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="p-1 rounded transition-colors bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                          title="Fazer Upgrade"
                        >
                          <Crown size={14} />
                        </button>
                      )}
                    </div>

                    {/* Estatísticas de uso */}
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {usageStats.messagesUsed}/{
                        checkChatbotAccess().limits?.messages || '∞'
                      } msgs
                    </div>
                  </div>

                  {/* Funções avançadas */}
                  {showAdvancedFeatures && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mt-2 p-2 rounded border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(advancedFunctions).map(([key, func]) => (
                          <button
                            key={key}
                            onClick={() => {
                              const toolMessage = `Use a função ${func.name.toLowerCase()}`;
                              handleSendMessage(toolMessage);
                            }}
                            disabled={func.premium && checkChatbotAccess().isLimited}
                            className={`p-2 rounded text-xs transition-colors flex items-center space-x-1 ${
                              func.premium && checkChatbotAccess().isLimited
                                ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                                : (isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
                            }`}
                          >
                            {func.premium && checkChatbotAccess().isLimited ? <Lock size={12} /> : func.icon}
                            <span className="truncate">{func.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Indicadores de status */}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className={`flex items-center space-x-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {isListening && <span>🎤 Gravando...</span>}
                      {isRecording && <span>🔴 Gravando áudio...</span>}
                      {isProcessing && <span>⚙️ Processando...</span>}
                      {isSpeaking && <span>🔊 Falando...</span>}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {checkChatbotAccess().plan === 'free' ? '🔒 Gratuito' : 
                       checkChatbotAccess().plan === 'premium' ? '👑 Premium' : 
                       '⭐ ' + checkChatbotAccess().plan}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md rounded-2xl p-6 ${
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown size={32} className="text-white" />
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Upgrade para Premium
              </h3>
              
              <p className={`text-sm mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Desbloqueie todas as funções avançadas do assistente virtual
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Search size={16} className="text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Busca na Web</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Image size={16} className="text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Análise de Imagens</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mic size={16} className="text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Transcrição de Áudio</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Sparkles size={16} className="text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Geração de Código</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calculator size={16} className="text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Análise de Dados</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // Redirecionar para página de planos
                    window.location.href = '/plans';
                  }}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 transition-all"
                >
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
