'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Clock, Sparkles, Mic, MicOff, Image as ImageIcon, Globe, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  isVoice?: boolean;
}

interface ChatbotData {
  [key: string]: string;
}

interface QuickSuggestion {
  id: string;
  text: string;
  category: string;
}

type Language = 'pt' | 'en' | 'es' | 'zh';

const languages = {
  pt: { name: 'Português', flag: '🇧🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
};

export function ChatbotAGROTM() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotData, setChatbotData] = useState<ChatbotData>({});
  const [quickSuggestions, setQuickSuggestions] = useState<QuickSuggestion[]>([]);
  const [language, setLanguage] = useState<Language>('pt');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Inicializar mensagem de boas-vindas
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: getWelcomeMessage(language),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  // Carregar dados do chatbot
  useEffect(() => {
    fetch('/data/chatbotData.json')
      .then((res) => res.json())
      .then((data) => {
        setChatbotData(data);
        generateQuickSuggestions(data);
      })
      .catch((error) => console.error('Erro ao carregar dados do chatbot:', error));
  }, []);

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(language);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
    }

    synthesisRef.current = window.speechSynthesis;
  }, [language]);

  // Função para obter mensagem de boas-vindas baseada no idioma
  const getWelcomeMessage = (lang: Language): string => {
    const messages = {
      pt: 'Olá, sou a Agrotm seu assistente virtual',
      en: 'Hello, I am Agrotm your virtual assistant',
      es: 'Hola, soy Agrotm tu asistente virtual',
      zh: '你好，我是Agrotm你的虚拟助手',
    };
    return messages[lang];
  };

  // Função para obter código de idioma
  const getLanguageCode = (lang: Language): string => {
    const codes = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      zh: 'zh-CN',
    };
    return codes[lang];
  };

  // Gerar sugestões rápidas
  const generateQuickSuggestions = (data: ChatbotData) => {
    const suggestions: QuickSuggestion[] = [
      { id: '1', text: getSuggestionText('staking', language), category: 'investimentos' },
      { id: '2', text: getSuggestionText('account', language), category: 'conta' },
      { id: '3', text: getSuggestionText('support', language), category: 'suporte' },
      { id: '4', text: getSuggestionText('dashboard', language), category: 'dashboard' },
      { id: '5', text: getSuggestionText('buy', language), category: 'investimentos' },
      { id: '6', text: getSuggestionText('nft', language), category: 'nft' },
      { id: '7', text: getSuggestionText('wallet', language), category: 'tecnologia' },
      { id: '8', text: getSuggestionText('plans', language), category: 'planos' },
    ];
    setQuickSuggestions(suggestions);
  };

  // Obter texto da sugestão baseado no idioma
  const getSuggestionText = (key: string, lang: Language): string => {
    const suggestions = {
      staking: {
        pt: 'Como funciona o staking?',
        en: 'How does staking work?',
        es: '¿Cómo funciona el staking?',
        zh: '质押是如何工作的？',
      },
      account: {
        pt: 'Quero criar minha conta',
        en: 'I want to create my account',
        es: 'Quiero crear mi cuenta',
        zh: '我想创建我的账户',
      },
      support: {
        pt: 'Preciso de suporte técnico',
        en: 'I need technical support',
        es: 'Necesito soporte técnico',
        zh: '我需要技术支持',
      },
      dashboard: {
        pt: 'Quero ver o dashboard',
        en: 'I want to see the dashboard',
        es: 'Quiero ver el dashboard',
        zh: '我想查看仪表板',
      },
      buy: {
        pt: 'Como comprar AGROTM?',
        en: 'How to buy AGROTM?',
        es: '¿Cómo comprar AGROTM?',
        zh: '如何购买AGROTM？',
      },
      nft: {
        pt: 'Quero saber sobre NFTs',
        en: 'I want to know about NFTs',
        es: 'Quiero saber sobre NFTs',
        zh: '我想了解NFT',
      },
      wallet: {
        pt: 'Preciso de ajuda com carteira',
        en: 'I need help with wallet',
        es: 'Necesito ayuda con billetera',
        zh: '我需要钱包帮助',
      },
      plans: {
        pt: 'Quero ver os planos',
        en: 'I want to see the plans',
        es: 'Quiero ver los planes',
        zh: '我想查看计划',
      },
    };
    return suggestions[key as keyof typeof suggestions]?.[lang] || suggestions[key as keyof typeof suggestions]?.pt || '';
  };

  // Scroll automático para mensagens mais recentes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para encontrar resposta aproximada
  const findBestMatch = (userInput: string): string | null => {
    const input = userInput.toLowerCase().trim();
    
    // Busca exata
    if (chatbotData[input]) {
      return chatbotData[input];
    }

    // Busca aproximada
    const words = input.split(' ');
    let bestMatch = '';
    let bestScore = 0;

    Object.keys(chatbotData).forEach((key) => {
      const keyWords = key.toLowerCase().split(' ');
      let score = 0;

      words.forEach((word) => {
        if (keyWords.some((keyWord) => keyWord.includes(word) || word.includes(keyWord))) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    return bestScore >= words.length * 0.5 ? chatbotData[bestMatch] : null;
  };

  // Função para processar imagem
  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  };

  // Função para reconhecimento de imagem (simulado)
  const analyzeImage = async (imageData: string): Promise<string> => {
    // Simulação de análise de imagem
    await new Promise(resolve => setTimeout(resolve, 2000));
    const responses = {
      pt: 'Analisei a imagem enviada. Parece ser um documento ou imagem relacionada ao agronegócio. Posso ajudar você com mais informações sobre nossos serviços agrícolas.',
      en: 'I analyzed the uploaded image. It appears to be a document or image related to agribusiness. I can help you with more information about our agricultural services.',
      es: 'Analicé la imagen enviada. Parece ser un documento o imagen relacionada con el agronegocio. Puedo ayudarte con más información sobre nuestros servicios agrícolas.',
      zh: '我分析了上传的图片。这似乎是与农业相关的文档或图片。我可以帮助您了解更多关于我们农业服务的信息。',
    };
    return responses[language];
  };

  // Função para falar texto
  const speakText = useCallback((text: string) => {
    if (synthesisRef.current && isVoiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesisRef.current.speak(utterance);
    }
  }, [isVoiceEnabled, language]);

  // Função para parar de falar
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular delay de resposta
    setTimeout(() => {
      const response = findBestMatch(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || getErrorMessage(language),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      
      // Falar resposta se voz estiver habilitada
      if (isVoiceEnabled && response) {
        speakText(response);
      }
    }, 1000);
  };

  // Obter mensagem de erro baseada no idioma
  const getErrorMessage = (lang: Language): string => {
    const errors = {
      pt: 'Desculpe, não entendi sua pergunta. Pode reformular ou entrar em contato conosco pelo WhatsApp: +55 (66) 99236-2830',
      en: 'Sorry, I didn\'t understand your question. Can you rephrase it or contact us via WhatsApp: +55 (66) 99236-2830?',
      es: 'Lo siento, no entendí tu pregunta. ¿Puedes reformularla o contactarnos por WhatsApp: +55 (66) 99236-2830?',
      zh: '抱歉，我没有理解您的问题。您能重新表述或通过WhatsApp联系我们：+55 (66) 99236-2830？',
    };
    return errors[lang];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isVoiceEnabled) {
      stopSpeaking();
      setIsVoiceEnabled(false);
    } else {
      setIsVoiceEnabled(true);
    }
  };

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(getErrorMessage(language));
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(getErrorMessage(language));
      return;
    }

    try {
      const imageData = await processImage(file);
      const userMessage: Message = {
        id: Date.now().toString(),
        text: '📷 Imagem enviada',
        isUser: true,
        timestamp: new Date(),
        image: imageData,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Analisar imagem
      const analysis = await analyzeImage(imageData);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysis,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);

      if (isVoiceEnabled) {
        speakText(analysis);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert(getErrorMessage(language));
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(newLanguage);
    }
    
    // Atualizar mensagem de boas-vindas
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: getWelcomeMessage(newLanguage),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(getLanguageCode(language), { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5566992362830', '_blank');
  };

  const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
    handleSendMessage(suggestion.text);
  };

  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black p-4 rounded-full shadow-neon-green hover:shadow-neon-green transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-end justify-end p-4 ${isFullscreen ? 'p-0' : ''}`}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className={`relative ${isFullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-md h-[500px]'} bg-[#000000] border border-[#00FF7F]/20 rounded-2xl shadow-neon-green overflow-hidden`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00FF7F]/10 to-[#00cc66]/10 border-b border-[#00FF7F]/20 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-[#00FF7F]">AGROTM Assistant</h3>
                    <p className="text-xs text-[#cccccc]">Online • Respostas Automáticas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Language Selector */}
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="bg-[#000000] border border-[#00FF7F]/20 rounded-lg px-2 py-1 text-[#00FF7F] text-xs font-orbitron focus:outline-none focus:border-[#00FF7F]"
                    >
                      {Object.entries(languages).map(([code, { name, flag }]) => (
                        <option key={code} value={code}>
                          {flag} {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Voice Toggle */}
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isVoiceEnabled 
                        ? 'bg-[#00FF7F]/20 text-[#00FF7F]' 
                        : 'bg-[#000000] text-[#cccccc] hover:text-[#00FF7F]'
                    }`}
                  >
                    {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#cccccc] hover:text-[#00FF7F] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 h-80">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black'
                          : 'bg-[#00FF7F]/10 text-[#cccccc] border border-[#00FF7F]/20'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <Image
                            src={message.image}
                            alt="Uploaded image"
                            width={200}
                            height={150}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-end mt-1">
                        <Clock className="w-3 h-3 text-[#cccccc] mr-1" />
                        <span className="text-xs text-[#cccccc]">
                          {formatTime(message.timestamp)}
                        </span>
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
                    <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border-t border-[#00FF7F]/20"
                >
                  <p className="text-xs text-[#00FF7F] font-orbitron mb-3">💡 Sugestões rápidas:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickSuggestions.slice(0, 4).map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] p-2 rounded-lg hover:bg-[#00FF7F]/20 transition-colors text-xs font-orbitron"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-[#00FF7F]/20">
                <div className="flex space-x-2">
                  {/* Image Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] p-2 rounded-xl hover:bg-[#00FF7F]/20 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  
                  {/* Voice Input */}
                  <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className={`p-2 rounded-xl transition-colors ${
                      isListening 
                        ? 'bg-[#00FF7F] text-black animate-pulse' 
                        : 'bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] hover:bg-[#00FF7F]/20'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getPlaceholderText(language)}
                    className="flex-1 bg-[#000000] border border-[#00FF7F]/20 rounded-xl px-4 py-2 text-[#cccccc] placeholder-[#cccccc]/50 focus:outline-none focus:border-[#00FF7F] transition-colors font-orbitron"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black p-2 rounded-xl hover:shadow-neon-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* WhatsApp Button */}
                <button
                  onClick={openWhatsApp}
                  className="w-full mt-2 bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] py-2 rounded-xl hover:bg-[#00FF7F]/20 transition-colors text-sm font-orbitron"
                >
                  💬 Falar com atendente humano
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Função auxiliar para obter placeholder baseado no idioma
function getPlaceholderText(language: Language): string {
  const placeholders = {
    pt: 'Digite sua mensagem...',
    en: 'Type your message...',
    es: 'Escribe tu mensaje...',
    zh: '输入您的消息...',
  };
  return placeholders[language];
} 