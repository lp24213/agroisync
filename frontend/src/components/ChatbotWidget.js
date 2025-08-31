import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Mic, MicOff, Send, Image, 
  Volume2, VolumeX, X, HelpCircle, FileText,
  Settings, Globe, RefreshCw, Paperclip
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
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {messages.map(renderMessage)}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex justify-start"
                        >
                          <div className="bg-slate-700/50 px-4 py-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-700/50">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua mensagem..."
                            rows={1}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-400"
                            style={{ minHeight: '40px', maxHeight: '120px' }}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                            title="Enviar imagem"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={handleVoiceInput}
                            className={`p-2 rounded transition-colors ${
                              isListening 
                                ? 'text-emerald-400 bg-emerald-400/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                            title="Reconhecimento de voz"
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Enviar mensagem"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 p-4"
                  >
                    <h3 className="font-semibold text-premium-dark-gray mb-4">Configurações</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-premium-gray mb-2">
                          Idioma
                        </label>
                        <select
                          value={currentLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="w-full px-3 py-2 border border-premium-platinum rounded-lg focus:ring-2 focus:ring-accent-emerald focus:border-accent-emerald"
                        >
                          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={handleClearHistory}
                        className="w-full px-4 py-2 bg-premium-gray text-white rounded-lg hover:bg-premium-dark-gray transition-premium flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Limpar Histórico</span>
                      </button>
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
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 p-4"
                  >
                    <h3 className="font-semibold text-premium-dark-gray mb-4">Categorias de Ajuda</h3>
                    
                    <div className="space-y-3">
                      {Object.entries(HELP_CATEGORIES).map(([key, category]) => (
                        <button
                          key={key}
                          onClick={() => handleHelpCategory(key)}
                          className="w-full p-3 text-left bg-premium-platinum hover:bg-premium-light-gray rounded-lg transition-premium flex items-center space-x-3"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-lg">{category.name}</span>
                        </button>
                      ))}
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
