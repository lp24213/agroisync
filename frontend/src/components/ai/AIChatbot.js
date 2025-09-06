import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image, 
  X, 
  Bot, 
  User, 
  Loader2,
  Volume2,
  VolumeX,
  Settings,
  Brain,
  TrendingUp,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useTheme } from '../../contexts/ThemeContext';

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('general'); // 'general', 'pricing', 'recommendations'
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

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
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
  }, []);

  // Enviar mensagem
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
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          message: message,
          mode: aiMode,
          image: selectedImage,
          conversationHistory: messages.slice(-10) // Últimas 10 mensagens
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        mode: aiMode,
        suggestions: data.suggestions || [],
        data: data.data || null
      };

      setMessages(prev => [...prev, aiMessage]);

      // Falar resposta se habilitado
      if (data.speak && synthesisRef.current) {
        speakText(data.response);
      }

      analytics.trackEvent('ai_chat_message', {
        mode: aiMode,
        has_image: !!selectedImage,
        response_length: data.response.length
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: t('ai.error', 'Desculpe, ocorreu um erro. Tente novamente.'),
        timestamp: new Date(),
        mode: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, selectedImage, aiMode, messages, analytics, t]);

  // Iniciar/parar reconhecimento de voz
  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert(t('ai.voiceNotSupported', 'Reconhecimento de voz não é suportado neste navegador'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, t]);

  // Falar texto
  const speakText = useCallback((text) => {
    if (!synthesisRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, []);

  // Parar fala
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Upload de imagem
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Sugestões rápidas
  const quickSuggestions = [
    { text: t('ai.suggestions.pricing', 'Previsão de preços'), mode: 'pricing' },
    { text: t('ai.suggestions.recommendations', 'Recomendações'), mode: 'recommendations' },
    { text: t('ai.suggestions.weather', 'Previsão do tempo'), mode: 'general' },
    { text: t('ai.suggestions.market', 'Análise de mercado'), mode: 'general' }
  ];

  const handleQuickSuggestion = useCallback((suggestion) => {
    setAiMode(suggestion.mode);
    handleSendMessage(suggestion.text);
  }, [handleSendMessage]);

  // Limpar conversa
  const clearConversation = useCallback(() => {
    setMessages([]);
    analytics.trackEvent('ai_chat_cleared');
  }, [analytics]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t('ai.assistant', 'Assistente IA')}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t('ai.mode', 'Modo')}: {t(`ai.modes.${aiMode}`, aiMode)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Configurações */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ai.mode', 'Modo')}
                </label>
                <select
                  value={aiMode}
                  onChange={(e) => setAiMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="general">{t('ai.modes.general', 'Geral')}</option>
                  <option value="pricing">{t('ai.modes.pricing', 'Previsão de Preços')}</option>
                  <option value="recommendations">{t('ai.modes.recommendations', 'Recomendações')}</option>
                </select>
              </div>
              <button
                onClick={clearConversation}
                className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
              >
                {t('ai.clearConversation', 'Limpar conversa')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : message.mode === 'pricing' 
                    ? 'bg-green-600' 
                    : message.mode === 'recommendations' 
                      ? 'bg-purple-600' 
                      : 'bg-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Uploaded" 
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="block w-full text-left px-2 py-1 text-xs bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-500"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                {message.data && (
                  <div className="mt-2 p-2 bg-white dark:bg-gray-600 rounded text-xs">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(message.data, null, 2)}</pre>
                  </div>
                )}
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
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('ai.thinking', 'Pensando...')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões rápidas */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {t('ai.quickSuggestions', 'Sugestões rápidas')}:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {selectedImage && (
          <div className="mb-3 relative">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('ai.placeholder', 'Digite sua mensagem...')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </label>
            
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 rounded-lg"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;
