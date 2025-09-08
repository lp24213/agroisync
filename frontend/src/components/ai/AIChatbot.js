import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Image, Bot, Loader2, Brain, Lightbulb, DollarSign, Settings, X } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useTheme } from '../../contexts/ThemeContext';

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('general');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Inicializar mensagens
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('ai.welcome', 'Olá! Sou o assistente IA do AgroSync. Como posso ajudá-lo hoje?'),
      timestamp: new Date(),
      mode: 'general'
    };

    setMessages([welcomeMessage]);

    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, t]);

  // Scroll para última mensagem
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
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = useCallback(async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      image: selectedImage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: t('ai.response', 'Esta é uma resposta simulada da IA. Em produção, aqui viria a resposta real da API.'),
        timestamp: new Date(),
        mode: aiMode
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, selectedImage, aiMode, t]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
        setShowImageUpload(false);
    }
  }, []);

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'pricing': return <DollarSign className="w-4 h-4" />;
      case 'recommendations': return <Lightbulb className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'pricing': return 'text-green-600';
      case 'recommendations': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
    >
      {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
              <h2 className="text-xl font-semibold text-gray-900">Assistente IA</h2>
              <p className="text-sm text-gray-600">AgroSync</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
              <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
              <X className="w-5 h-5" />
          </button>
        </div>
      </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Modo:</span>
              <div className="flex gap-2">
                {[
                  { id: 'general', label: 'Geral', icon: Brain },
                  { id: 'pricing', label: 'Preços', icon: DollarSign },
                  { id: 'recommendations', label: 'Recomendações', icon: Lightbulb }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setAiMode(mode.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                      aiMode === mode.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
            key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-medium">Assistente IA</span>
                    <div className={`flex items-center gap-1 ${getModeColor(message.mode)}`}>
                      {getModeIcon(message.mode)}
                      <span className="text-xs">{message.mode}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.image && (
                  <div className="mt-2">
                  <img 
                      src={URL.createObjectURL(message.image)}
                    alt="Uploaded" 
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                  
                  {message.type === 'ai' && (
                    <button
                      onClick={() => handleTextToSpeech(message.content)}
                      disabled={isSpeaking}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    >
                      {isSpeaking ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Mic className="w-3 h-3" />
                      )}
                    </button>
                  )}
                  </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Digitando...</span>
                </div>
              </div>
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          {selectedImage && (
            <div className="mb-4 flex items-center gap-2">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-sm text-gray-600">{selectedImage.name}</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
        </div>
      )}

          <div className="flex items-end gap-3">
          <div className="flex-1 relative">
              <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex gap-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
                  className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
                  <Image className="w-4 h-4" />
            </label>
            
            <button
                  onClick={handleVoiceInput}
                  className={`p-2 transition-colors ${
                isListening 
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
              </div>
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIChatbot;