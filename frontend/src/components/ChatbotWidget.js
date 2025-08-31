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
  RefreshCw
} from 'lucide-react';
import chatbotService, { 
  SUPPORTED_LANGUAGES, 
  HELP_CATEGORIES 
} from '../services/chatbotService';

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
      // Inicializar serviços de voz
      await chatbotService.initializeVoiceServices();
      
      // Definir idioma
      chatbotService.setLanguage(currentLanguage);
      
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
      const response = await chatbotService.processTextMessage(inputMessage.trim());
      setMessages(prev => [...prev, response]);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isListening) {
        await chatbotService.stopVoiceInput();
        setIsListening(false);
      } else {
        const result = await chatbotService.processVoiceInput();
        if (result.success) {
          setIsListening(true);
        }
      }
    } catch (error) {
      console.error('Erro ao processar voz:', error);
    }
  };

  const handleAudioRecording = async () => {
    try {
      if (isRecording) {
        await chatbotService.stopAudioRecording();
        setIsRecording(false);
      } else {
        const result = await chatbotService.startAudioRecording();
        if (result.success) {
          setIsRecording(true);
        }
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
      
      // Processar imagem
      const response = await chatbotService.processImageUpload(file);
      setMessages(prev => [...prev, response]);
      
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
    } finally {
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
      const response = await chatbotService.getHelpByCategory(category);
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
    chatbotService.setLanguage(language);
    setShowSettings(false);
  };

  const handleClearHistory = () => {
    chatbotService.clearConversationHistory();
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
        <div className={`max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-700/50 text-slate-200 border border-slate-600/30'
        }`}>
          <div className="text-sm">
            {message.content}
          </div>
          
          {message.suggestions && (
            <div className="mt-2 space-y-1">
              {message.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left text-xs px-2 py-1 rounded transition-colors bg-slate-600/30 hover:bg-slate-600/50 text-slate-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className={`text-xs mt-1 ${
            isUser ? 'text-emerald-100' : 'text-slate-400'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </motion.div>
    );
  };

  // Remover a condição que impede o chatbot de aparecer
  // if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-[9999]`}>
      {/* Widget Principal */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center border border-slate-600/30 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          >
            <MessageCircle className="w-6 h-6" />
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
            className="w-80 h-96 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col"
            style={{ zIndex: 9999 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 text-white rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">Assistente IA</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {messages.map(renderMessage)}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex justify-start"
                        >
                          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-4 py-3 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs text-slate-400">Processando...</span>
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
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110"
                            title="Enviar imagem"
                          >
                            <Image className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={handleVoiceInput}
                            className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                              isListening 
                                ? 'text-emerald-400 bg-emerald-400/20 border border-emerald-400/30' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                            title="Reconhecimento de voz"
                          >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          </button>
                          
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 shadow-lg shadow-emerald-500/25"
                            title="Enviar mensagem"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Status do AI */}
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span>AI Ativo</span>
                          <Brain className="w-3 h-3" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Satellite className="w-3 h-3" />
                          <span>Conectado</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Configurações Futuristas */}
                {showSettings && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 p-4"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-emerald-400" />
                      <span>Configurações Avançadas</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Modelo de IA</label>
                        <select 
                          value={aiLevel} 
                          onChange={(e) => setAiLevel(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white backdrop-blur-xl"
                        >
                          <option value="gpt-3.5">GPT-3.5 (Básico)</option>
                          <option value="gpt-4">GPT-4 (Avançado)</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo (Premium)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-slate-300">Efeito Holográfico</span>
                        </div>
                        <button
                          onClick={() => setIsHolographic(!isHolographic)}
                          className={`w-12 h-6 rounded-full transition-all duration-300 ${
                            isHolographic ? 'bg-emerald-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                            isHolographic ? 'translate-x-6' : 'translate-x-1'
                          }`}></div>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-slate-300">Modo Quantum</span>
                        </div>
                        <button
                          onClick={() => setIsQuantum(!isQuantum)}
                          className={`w-12 h-6 rounded-full transition-all duration-300 ${
                            isQuantum ? 'bg-blue-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                            isQuantum ? 'translate-x-6' : 'translate-x-1'
                          }`}></div>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => setMessages([messages[0]])}
                        className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        Limpar Histórico
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Ajuda Futurista */}
                {showHelp && (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 p-4"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                      <HelpCircle className="w-5 h-5 text-emerald-400" />
                      <span>Centro de Ajuda</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleSuggestionClick('Como cadastrar um produto?')}
                          className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30"
                        >
                          <div className="text-center">
                            <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <span className="text-xs text-slate-300">Cadastro</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleSuggestionClick('Como funciona o frete?')}
                          className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30"
                        >
                          <div className="text-center">
                            <Rocket className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <span className="text-xs text-slate-300">Fretes</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleSuggestionClick('Como ver cotações?')}
                          className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30"
                        >
                          <div className="text-center">
                            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <span className="text-xs text-slate-300">Cotações</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleSuggestionClick('Como fazer pagamento?')}
                          className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30"
                        >
                          <div className="text-center">
                            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <span className="text-xs text-slate-300">Pagamentos</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ChatbotWidget;
