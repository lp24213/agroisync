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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
                  <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
            <div className={`px-4 py-3 rounded-lg ${
              isUser 
                ? 'bg-accent-emerald text-white' 
                : 'bg-white text-premium-dark-gray border border-premium-platinum'
          }`}>
            {message.type === 'image' && (
              <div className="mb-2">
                <img 
                  src={message.content} 
                  alt={message.fileName || 'Imagem'} 
                  className="max-w-full rounded"
                />
                {message.fileName && (
                  <p className="text-xs mt-1 opacity-75">{message.fileName}</p>
                )}
              </div>
            )}
            
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-premium ${
                      isUser 
                        ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                        : 'bg-premium-platinum hover:bg-premium-light-gray'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className={`text-xs text-premium-gray mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`fixed ${position} z-[9999] m-4`}>
      {/* Widget Principal */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-accent-emerald text-white rounded-full shadow-premium hover:bg-accent-emerald/80 transition-premium flex items-center justify-center"
            style={{ zIndex: 9999 }}
          >
            <MessageCircle className="w-8 h-8" />
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
            className="w-80 h-96 bg-white rounded-2xl shadow-premium border border-premium-platinum flex flex-col"
            style={{ zIndex: 9999 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-premium-platinum bg-gradient-premium text-white rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">Assistente AgroSync</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-premium"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-premium"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-premium"
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
                          <div className="bg-premium-platinum px-4 py-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-premium-gray rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-premium-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-premium-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-premium-platinum">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua mensagem..."
                            rows={1}
                            className="w-full px-3 py-2 border border-premium-platinum rounded-lg resize-none focus:ring-2 focus:ring-accent-emerald focus:border-accent-emerald"
                            style={{ minHeight: '40px', maxHeight: '120px' }}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded transition-premium"
                            title="Enviar imagem"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={handleAudioRecording}
                            className={`p-2 rounded transition-colors ${
                              isRecording 
                                ? 'text-red-600 bg-red-100' 
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                            title="Gravar áudio"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={handleVoiceInput}
                            className={`p-2 rounded transition-premium ${
                              isListening 
                                ? 'text-accent-blue bg-accent-blue/20' 
                                : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
                            }`}
                            title="Reconhecimento de voz"
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="p-2 bg-accent-emerald text-white rounded hover:bg-accent-emerald/80 disabled:opacity-50 disabled:cursor-not-allowed transition-premium"
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
