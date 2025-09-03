import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  Settings, 
  HelpCircle,
  Sparkles,
  Zap,
  Brain,
  Globe,
  Shield,
  Star,
  Crown,
  Bot,
  Cpu,
  Network,
  Satellite,
  Rocket,
  ChevronRight,
  ChevronDown,
  Volume2,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const ChatbotWidget = ({ isOpen = false, onToggle, position = 'bottom-right' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [aiLevel, setAiLevel] = useState('gpt-4'); // gpt-3.5, gpt-4, gpt-4-turbo
  const [isHolographic, setIsHolographic] = useState(true);
  const [isQuantum, setIsQuantum] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeChatbot();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatbot = async () => {
    try {
      // Carregar mensagem de boas-vindas
      const welcomeMessage = {
        id: 'welcome',
        type: 'text',
        content: 'Olá! Sou o assistente virtual do AgroSync. Como posso ajudá-lo hoje?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        suggestions: [
          'Ajuda com cadastro',
          'Como funciona a intermediação?',
          'Status de transações',
          'Buscar fretes'
        ]
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Erro ao inicializar chatbot:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    try {
      setIsTyping(true);
      
      // Adicionar mensagem do usuário
      const userMessage = {
        id: `user_${Date.now()}`,
        type: 'text',
        content: inputMessage.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Processar mensagem
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: 'bot',
          content: `Entendi sua pergunta sobre "${inputMessage}". Como assistente ${aiLevel === 'gpt-4' ? 'GPT-4 avançado' : 'GPT-3.5'}, posso ajudar com informações detalhadas sobre produtos, fretes, cotações e muito mais.`,
          timestamp: new Date(),
          suggestions: [
            'Mostrar produtos similares',
            'Explicar processo de frete',
            'Ver cotações em tempo real',
            'Ajuda com cadastro'
          ]
        };
        setMessages(prev => [...prev, response]);
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isListening) {
        setIsListening(false);
      } else {
        setIsListening(true);
        // Simular processamento de voz
        setTimeout(() => {
          setIsListening(false);
          setInputMessage('Exemplo de comando de voz processado');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao processar voz:', error);
    }
  };

  const handleAudioRecording = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
      } else {
        setIsRecording(true);
        // Simular gravação
        setTimeout(() => {
          setIsRecording(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao gravar áudio:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsTyping(true);
      
      // Adicionar mensagem do usuário com imagem
      const userMessage = {
        id: `img_${Date.now()}`,
        type: 'image',
        content: URL.createObjectURL(file),
        sender: 'user',
        timestamp: new Date().toISOString(),
        fileName: file.name
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simular processamento de imagem
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: 'bot',
          content: 'Imagem processada com sucesso! Posso ajudar com análise de produtos agrícolas.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    try {
      setInputMessage(suggestion);
      await handleSendMessage();
    } catch (error) {
      console.error('Erro ao processar sugestão:', error);
    }
  };

  const handleHelpCategory = async (category) => {
    try {
      setIsTyping(true);
      const response = {
        id: Date.now() + 1,
        sender: 'bot',
        content: `Aqui está a ajuda para ${category}. Como posso auxiliar mais?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setShowHelp(false);
    } catch (error) {
      console.error('Erro ao buscar ajuda:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setShowSettings(false);
  };

  const handleClearHistory = () => {
    setMessages([]);
    initializeChatbot();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[85%] rounded-2xl p-4 ${
          isUser 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
            : 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-slate-200 border border-slate-700/50 backdrop-blur-xl shadow-lg'
        }`}>
          <div className="text-sm leading-relaxed">
            {message.content}
          </div>
          
          {message.suggestions && (
            <div className="mt-3 space-y-2">
              {message.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left text-xs px-3 py-2 rounded-xl transition-all duration-300 bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className={`text-xs mt-2 ${
            isUser ? 'text-emerald-100' : 'text-slate-400'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[9999]`}>
      {/* Widget Principal */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setIsExpanded(true)}
            className="group w-16 h-16 bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center border border-slate-700/50 backdrop-blur-xl relative overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <MessageCircle className="w-7 h-7" />
            </div>
            
            {/* Indicador de status */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`w-96 h-[500px] bg-gradient-to-br from-slate-900/95 via-black/95 to-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden ${isMinimized ? 'h-20' : ''}`}
            style={{ zIndex: 9999 }}
          >
            {/* Header Premium */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-white rounded-t-3xl relative overflow-hidden">
              {/* Efeito de fundo */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
              
              <div className="relative z-10 flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm">Assistente IA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-slate-400">{aiLevel.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="relative z-10 flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                >
                  {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            {!isMinimized && (
              <div className="flex-1 flex">
                {/* Chat */}
                <AnimatePresence mode="wait">
                  {!showSettings && !showHelp && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Mensagens */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map(renderMessage)}
                        
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex justify-start"
                          >
                            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-4 py-3 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
                              <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">Processando...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Futurista */}
                      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                        <div className="flex items-end space-x-3">
                          <div className="flex-1">
                            <textarea
                              ref={inputRef}
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Digite sua mensagem..."
                              rows={1}
                              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-2xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-400 backdrop-blur-xl transition-all duration-300"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleVoiceInput}
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                isListening 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white'
                              }`}
                            >
                              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={handleAudioRecording}
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                isRecording 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white'
                              }`}
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="p-3 bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white rounded-xl transition-all duration-300"
                            >
                              <Image className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={handleSendMessage}
                              disabled={!inputMessage.trim() || isTyping}
                              className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Configurações */}
                  {showSettings && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex-1 p-4 overflow-y-auto"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Configurações</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Idioma</label>
                            <select
                              value={currentLanguage}
                              onChange={(e) => handleLanguageChange(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white"
                            >
                              <option value="pt">Português</option>
                              <option value="en">English</option>
                              <option value="es">Español</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Nível de IA</label>
                            <select
                              value={aiLevel}
                              onChange={(e) => setAiLevel(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white"
                            >
                              <option value="gpt-3.5">GPT-3.5 (Rápido)</option>
                              <option value="gpt-4">GPT-4 (Preciso)</option>
                              <option value="gpt-4-turbo">GPT-4 Turbo (Avançado)</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">Modo Holográfico</span>
                            <button
                              onClick={() => setIsHolographic(!isHolographic)}
                              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                isHolographic ? 'bg-emerald-500' : 'bg-slate-600'
                              }`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                                isHolographic ? 'translate-x-6' : 'translate-x-1'
                              }`}></div>
                            </button>
                          </div>
                          
                          <button
                            onClick={handleClearHistory}
                            className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                          >
                            Limpar Histórico
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Ajuda */}
                  {showHelp && (
                    <motion.div
                      key="help"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex-1 p-4 overflow-y-auto"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Ajuda</h3>
                        
                        <div className="space-y-3">
                          {[
                            'Cadastro e Login',
                            'Produtos e Fretes',
                            'Pagamentos',
                            'Cotações',
                            'Suporte Técnico'
                          ].map((category) => (
                            <button
                              key={category}
                              onClick={() => handleHelpCategory(category)}
                              className="w-full text-left px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all duration-300"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
