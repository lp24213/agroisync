'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Image, Volume2, VolumeX } from 'lucide-react';

// Importar tipos da Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
}

type Language = 'pt' | 'en' | 'es' | 'zh';

interface ChatbotData {
  [key: string]: {
    [key: string]: {
      questions: string[];
      answers: string[];
    };
  };
}

// Base de dados multilíngue do chatbot
const chatbotData: ChatbotData = {
  pt: {
    agronegocio: {
      questions: [
        "o que é agronegócio",
        "como funciona o agronegócio",
        "tecnologia no agronegócio",
        "agricultura moderna",
        "agricultura sustentável",
        "agricultura de precisão",
        "agricultura 4.0",
        "agricultura digital",
        "agricultura inteligente",
        "agricultura tecnológica"
      ],
      answers: [
        "O agronegócio é o conjunto de atividades econômicas relacionadas à produção, processamento e comercialização de produtos agrícolas, pecuários e florestais.",
        "O agronegócio funciona através de uma cadeia produtiva que vai desde a produção primária até o consumidor final, incluindo insumos, produção, processamento e distribuição.",
        "A tecnologia no agronegócio inclui automação, IoT, drones, sensores, análise de dados e inteligência artificial para otimizar a produção.",
        "A agricultura moderna utiliza tecnologias avançadas como GPS, sensores, automação e análise de dados para maximizar a eficiência produtiva.",
        "A agricultura sustentável busca equilibrar produção com preservação ambiental, utilizando práticas que conservam recursos naturais.",
        "A agricultura de precisão utiliza tecnologias para aplicar insumos de forma otimizada, reduzindo custos e impactos ambientais.",
        "A agricultura 4.0 integra tecnologias digitais como IoT, big data, IA e automação para criar sistemas agrícolas inteligentes.",
        "A agricultura digital utiliza tecnologias da informação para otimizar processos produtivos e tomada de decisões.",
        "A agricultura inteligente combina tecnologias avançadas com práticas sustentáveis para maximizar produtividade e eficiência.",
        "A agricultura tecnológica incorpora inovações como automação, sensores e análise de dados para modernizar a produção."
      ]
    },
    plataforma: {
      questions: [
        "o que é a plataforma agrotm",
        "como funciona a plataforma",
        "quais são os recursos da plataforma",
        "como usar a plataforma",
        "benefícios da plataforma",
        "vantagens da plataforma",
        "funcionalidades da plataforma",
        "recursos da plataforma",
        "como acessar a plataforma",
        "como se cadastrar na plataforma"
      ],
      answers: [
        "A AGROTM é uma plataforma inovadora que conecta agricultores e investidores através da tecnologia mais avançada para revolucionar o agronegócio.",
        "A plataforma funciona como um hub tecnológico que integra gestão agrícola, investimentos e automação em uma única solução digital.",
        "Os recursos incluem dashboard interativo, monitoramento em tempo real, analytics avançados, automação inteligente e gestão completa de fazendas.",
        "Para usar a plataforma, basta se cadastrar, configurar seu perfil e começar a utilizar as ferramentas de gestão e monitoramento disponíveis.",
        "Os benefícios incluem aumento de produtividade, redução de custos, otimização de recursos, acesso a dados em tempo real e automação de processos.",
        "As vantagens são interface intuitiva, tecnologia de ponta, suporte 24h, segurança avançada e integração completa de dados.",
        "As funcionalidades incluem gestão de fazendas, monitoramento de culturas, análise de dados, automação de irrigação e controle de estoque.",
        "Os recursos incluem mapas interativos, relatórios detalhados, alertas inteligentes, integração com equipamentos e análise preditiva.",
        "Para acessar a plataforma, visite nosso site e clique em 'Entrar na Plataforma' ou use o botão de login no cabeçalho.",
        "Para se cadastrar, clique em 'Começar' no site, preencha seus dados e siga as instruções de verificação."
      ]
    },
    staking: {
      questions: [
        "o que é staking",
        "como funciona o staking",
        "staking sustentável",
        "benefícios do staking",
        "como fazer staking",
        "staking de tokens",
        "recompensas do staking",
        "staking agrícola",
        "staking na plataforma",
        "riscos do staking"
      ],
      answers: [
        "Staking é o processo de manter tokens bloqueados para apoiar a rede e receber recompensas em troca.",
        "O staking funciona bloqueando seus tokens por um período determinado, gerando rendimentos através de recompensas da plataforma.",
        "O staking sustentável apoia projetos agrícolas responsáveis, gerando rendimentos enquanto promove práticas sustentáveis.",
        "Os benefícios incluem rendimentos passivos, apoio a projetos sustentáveis, participação na governança e diversificação de investimentos.",
        "Para fazer staking, acesse a seção de staking na plataforma, escolha o período e quantidade, e confirme a operação.",
        "O staking de tokens permite ganhar recompensas mantendo seus ativos bloqueados na plataforma.",
        "As recompensas do staking são distribuídas periodicamente e variam conforme o período e quantidade de tokens bloqueados.",
        "O staking agrícola conecta investidores diretamente com projetos agrícolas sustentáveis e inovadores.",
        "O staking na plataforma AGROTM oferece rendimentos atrativos e apoio a projetos agrícolas de qualidade.",
        "Os riscos incluem volatilidade de preços, períodos de bloqueio e dependência do desempenho dos projetos apoiados."
      ]
    },
    nfts: {
      questions: [
        "o que são nfts agrícolas",
        "como funcionam os nfts",
        "nfts de propriedades rurais",
        "como criar nfts",
        "benefícios dos nfts",
        "nfts na agricultura",
        "tokenização de propriedades",
        "nfts únicos",
        "mercado de nfts",
        "valor dos nfts"
      ],
      answers: [
        "NFTs agrícolas são tokens únicos que representam propriedades rurais, culturas ou ativos agrícolas específicos.",
        "Os NFTs funcionam como certificados digitais únicos que representam ativos reais no mundo agrícola.",
        "Os NFTs de propriedades rurais permitem tokenizar terras, culturas e equipamentos agrícolas para facilitar investimentos.",
        "Para criar NFTs, acesse a seção de criação, forneça informações da propriedade e confirme a tokenização.",
        "Os benefícios incluem liquidez, transparência, facilidade de investimento e democratização do acesso ao agronegócio.",
        "Os NFTs na agricultura revolucionam o acesso ao investimento agrícola, tornando-o mais acessível e transparente.",
        "A tokenização de propriedades converte ativos físicos em tokens digitais negociáveis na plataforma.",
        "Cada NFT é único e representa um ativo específico, garantindo autenticidade e rastreabilidade.",
        "O mercado de NFTs agrícolas permite negociar ativos rurais de forma segura e transparente.",
        "O valor dos NFTs é determinado pela qualidade do ativo representado, localização e potencial produtivo."
      ]
    }
  },
  en: {
    agribusiness: {
      questions: [
        "what is agribusiness",
        "how does agribusiness work",
        "technology in agribusiness",
        "modern agriculture",
        "sustainable agriculture",
        "precision agriculture",
        "agriculture 4.0",
        "digital agriculture",
        "smart agriculture",
        "technological agriculture"
      ],
      answers: [
        "Agribusiness is the set of economic activities related to the production, processing and commercialization of agricultural, livestock and forestry products.",
        "Agribusiness works through a production chain that goes from primary production to the final consumer, including inputs, production, processing and distribution.",
        "Technology in agribusiness includes automation, IoT, drones, sensors, data analysis and artificial intelligence to optimize production.",
        "Modern agriculture uses advanced technologies such as GPS, sensors, automation and data analysis to maximize productive efficiency.",
        "Sustainable agriculture seeks to balance production with environmental preservation, using practices that conserve natural resources.",
        "Precision agriculture uses technologies to apply inputs optimally, reducing costs and environmental impacts.",
        "Agriculture 4.0 integrates digital technologies such as IoT, big data, AI and automation to create intelligent agricultural systems.",
        "Digital agriculture uses information technologies to optimize production processes and decision making.",
        "Smart agriculture combines advanced technologies with sustainable practices to maximize productivity and efficiency.",
        "Technological agriculture incorporates innovations such as automation, sensors and data analysis to modernize production."
      ]
    },
    platform: {
      questions: [
        "what is the agrotm platform",
        "how does the platform work",
        "what are the platform features",
        "how to use the platform",
        "platform benefits",
        "platform advantages",
        "platform functionalities",
        "platform resources",
        "how to access the platform",
        "how to register on the platform"
      ],
      answers: [
        "AGROTM is an innovative platform that connects farmers and investors through the most advanced technology to revolutionize agribusiness.",
        "The platform works as a technological hub that integrates agricultural management, investments and automation in a single digital solution.",
        "Features include interactive dashboard, real-time monitoring, advanced analytics, smart automation and complete farm management.",
        "To use the platform, simply register, configure your profile and start using the available management and monitoring tools.",
        "Benefits include increased productivity, cost reduction, resource optimization, real-time data access and process automation.",
        "Advantages include intuitive interface, cutting-edge technology, 24h support, advanced security and complete data integration.",
        "Features include farm management, crop monitoring, data analysis, irrigation automation and inventory control.",
        "Resources include interactive maps, detailed reports, smart alerts, equipment integration and predictive analysis.",
        "To access the platform, visit our website and click 'Enter Platform' or use the login button in the header.",
        "To register, click 'Get Started' on the website, fill in your data and follow the verification instructions."
      ]
    }
  },
  es: {
    agronegocio: {
      questions: [
        "qué es el agronegocio",
        "cómo funciona el agronegocio",
        "tecnología en el agronegocio",
        "agricultura moderna",
        "agricultura sostenible",
        "agricultura de precisión",
        "agricultura 4.0",
        "agricultura digital",
        "agricultura inteligente",
        "agricultura tecnológica"
      ],
      answers: [
        "El agronegocio es el conjunto de actividades económicas relacionadas con la producción, procesamiento y comercialización de productos agrícolas, pecuarios y forestales.",
        "El agronegocio funciona a través de una cadena productiva que va desde la producción primaria hasta el consumidor final, incluyendo insumos, producción, procesamiento y distribución.",
        "La tecnología en el agronegocio incluye automatización, IoT, drones, sensores, análisis de datos e inteligencia artificial para optimizar la producción.",
        "La agricultura moderna utiliza tecnologías avanzadas como GPS, sensores, automatización y análisis de datos para maximizar la eficiencia productiva.",
        "La agricultura sostenible busca equilibrar la producción con la preservación ambiental, utilizando prácticas que conservan los recursos naturales.",
        "La agricultura de precisión utiliza tecnologías para aplicar insumos de forma optimizada, reduciendo costos e impactos ambientales.",
        "La agricultura 4.0 integra tecnologías digitales como IoT, big data, IA y automatización para crear sistemas agrícolas inteligentes.",
        "La agricultura digital utiliza tecnologías de la información para optimizar procesos productivos y toma de decisiones.",
        "La agricultura inteligente combina tecnologías avanzadas con prácticas sostenibles para maximizar productividad y eficiencia.",
        "La agricultura tecnológica incorpora innovaciones como automatización, sensores y análisis de datos para modernizar la producción."
      ]
    }
  },
  zh: {
    nongye: {
      questions: [
        "什么是农业综合企业",
        "农业综合企业如何运作",
        "农业综合企业中的技术",
        "现代农业",
        "可持续农业",
        "精准农业",
        "农业4.0",
        "数字农业",
        "智能农业",
        "技术农业"
      ],
      answers: [
        "农业综合企业是与农产品、畜牧产品和林产品生产、加工和商业化相关的经济活动集合。",
        "农业综合企业通过从初级生产到最终消费者的生产链运作，包括投入、生产、加工和分销。",
        "农业综合企业中的技术包括自动化、物联网、无人机、传感器、数据分析和人工智能以优化生产。",
        "现代农业使用GPS、传感器、自动化和数据分析等先进技术来最大化生产效率。",
        "可持续农业寻求平衡生产与环境保护，使用保护自然资源的做法。",
        "精准农业使用技术来优化应用投入，降低成本和环境影响。",
        "农业4.0集成物联网、大数据、人工智能和自动化等数字技术来创建智能农业系统。",
        "数字农业使用信息技术来优化生产过程和决策制定。",
        "智能农业结合先进技术与可持续做法来最大化生产力和效率。",
        "技术农业融入自动化、传感器和数据分析等创新来现代化生产。"
      ]
    }
  }
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Detectar idioma do navegador
  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang.startsWith('en')) setLang('en');
    else if (browserLang.startsWith('es')) setLang('es');
    else if (browserLang.startsWith('zh')) setLang('zh');
    else setLang('pt');
  }, []);

  // Inicializar Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'zh-CN';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }

      // Speech Synthesis
      synthesisRef.current = window.speechSynthesis;
    }
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: getLocalizedText('welcome', lang),
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, lang]);

  const getLocalizedText = (key: string, language: Language): string => {
    const texts: Record<string, Record<string, string>> = {
      welcome: {
        pt: "Olá! Sou o assistente virtual da AGROTM. Como posso te ajudar?",
        en: "Hello! I'm AGROTM's virtual assistant. How can I help you?",
        es: "¡Hola! Soy el asistente virtual de AGROTM. ¿En qué puedo ayudarte?",
        zh: "你好！我是AGROTM的虚拟助手。请问有什么可以帮您？"
      },
      notFound: {
        pt: "Desculpe, não entendi. Pode reformular?",
        en: "Sorry, I didn't understand. Could you rephrase?",
        es: "Lo siento, no entendí. ¿Podrías reformular?",
        zh: "对不起，我不明白。您可以换个说法吗？"
      },
      placeholder: {
        pt: "Digite sua pergunta...",
        en: "Type your question...",
        es: "Escribe tu pregunta...",
        zh: "请输入您的问题..."
      },
      imageAnalysis: {
        pt: "Analisando imagem...",
        en: "Analyzing image...",
        es: "Analizando imagen...",
        zh: "分析图片..."
      }
    };

    return texts[key]?.[language] || texts[key]?.['pt'] || "Erro";
  };

  const findBestMatch = (userInput: string): string => {
    const data = chatbotData[lang] || chatbotData.pt;
    
    let bestMatch = '';
    let highestScore = 0;

    Object.keys(data).forEach(category => {
      data[category].questions.forEach((question, index) => {
        const score = calculateSimilarity(userInput.toLowerCase(), question.toLowerCase());
        if (score > highestScore && score > 0.3) {
          highestScore = score;
          bestMatch = data[category].answers[index];
        }
      });
    });

    return bestMatch || getLocalizedText('notFound', lang);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;

    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++;
        }
      });
    });

    return matches / Math.max(words1.length, words2.length);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular digitação
    setTimeout(() => {
      const botResponse = findBestMatch(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Falar a resposta se habilitado
      if (isVoiceEnabled && synthesisRef.current) {
        speakText(botResponse);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current && isVoiceEnabled) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'zh-CN';
      utterance.onend = () => setIsSpeaking(false);
      synthesisRef.current.speak(utterance);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const userMessage: Message = {
          id: Date.now().toString(),
          text: 'Imagem enviada',
          isUser: true,
          timestamp: new Date(),
          type: 'image',
          imageUrl
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simular análise da imagem
        setTimeout(() => {
          const imageAnalysis = getLocalizedText('imageAnalysis', lang) || 'Analisando imagem...';
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: imageAnalysis,
            isUser: false,
            timestamp: new Date(),
            type: 'text'
          };

          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const quickQuestions = {
    pt: [
    "Como funciona a plataforma?",
    "Quais são os planos?",
    "Preciso de suporte técnico",
    "Como entrar em contato?"
    ],
    en: [
      "How does the platform work?",
      "What are the plans?",
      "I need technical support",
      "How to contact?"
    ],
    es: [
      "¿Cómo funciona la plataforma?",
      "¿Cuáles son los planes?",
      "Necesito soporte técnico",
      "¿Cómo contactar?"
    ],
    zh: [
      "平台如何运作？",
      "有哪些计划？",
      "我需要技术支持",
      "如何联系？"
    ]
  };

  return (
    <>
      {/* Botão do Chatbot */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-black border border-blue-600 rounded-2xl shadow-2xl shadow-blue-600/20 backdrop-blur-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-600 bg-blue-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AGROTM Assistant</h3>
                  <p className="text-blue-200 text-sm">Online 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              <button
                onClick={() => setIsOpen(false)}
                  className="text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' 
                      : 'bg-gray-800 border border-blue-600 text-white'
                  }`}>
                    {message.type === 'image' && message.imageUrl && (
                      <img 
                        src={message.imageUrl} 
                        alt="Uploaded" 
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
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
                  <div className="bg-gray-800 border border-blue-600 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-blue-200 text-sm">Perguntas rápidas:</p>
                  {quickQuestions[lang]?.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="w-full text-left p-2 bg-gray-800 border border-blue-600 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-blue-600">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getLocalizedText('placeholder', lang)}
                  className="flex-1 bg-gray-800 border border-blue-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
