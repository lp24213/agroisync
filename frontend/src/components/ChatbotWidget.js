import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Loader2,
  Bot,
  User,
  Volume2,
  VolumeX,
  Upload,
  FileText
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import useStore from '../store/useStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../styles/modern-neutral-theme.css';
import '../styles/premium-futuristic.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState('text');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { chatbotOpen, toggleChatbot, chatHistory, addChatMessage } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    setIsOpen(chatbotOpen);
  }, [chatbotOpen]);

  // Inicializar Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Erro no reconhecimento de voz');
      };
    }

    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Carregar conversa existente
  useEffect(() => {
    if (isOpen && conversationId) {
      const loadConversation = async () => {
        try {
          const response = await axios.get(`/api/chat/${conversationId}`, {
            headers: {
              'Authorization': `Bearer ${user?.token}`
            }
          });
          
          if (response.data.success) {
            const messages = response.data.data.messages || [];
            messages.forEach(msg => addChatMessage(msg));
          }
        } catch (error) {
          console.error('Erro ao carregar conversa:', error);
        }
      };
      
      loadConversation();
    }
  }, [isOpen, conversationId, addChatMessage, user?.token]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments
    };

    addChatMessage(userMessage);
    setMessage('');
    setAttachments([]);
    setIsTyping(true);

    try {
      // Preparar dados para envio
      const formData = new FormData();
      formData.append('message', message);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      // Adicionar anexos
      attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await axios.post('/api/chat/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.data.success) {
        const { conversationId: newConversationId, aiResponse } = response.data.data;
        
        if (!conversationId) {
          setConversationId(newConversationId);
        }

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: aiResponse.text,
          timestamp: new Date(aiResponse.timestamp)
        };
        
        addChatMessage(botMessage);

        // Falar resposta se voz estiver habilitada
        if (voiceEnabled && synthesisRef.current) {
          speakText(aiResponse.text);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      
      // Fallback para resposta local
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateBotResponse(message),
        timestamp: new Date()
      };
      
      addChatMessage(botMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userMessage) => {
    const responses = {
      'intermediação': 'Nossa plataforma de intermediação conecta produtores e compradores através de IA. Você pode publicar produtos ou buscar ofertas que atendam suas necessidades.',
      'planos': 'Oferecemos planos desde gratuito até enterprise. O plano básico custa R$ 99/mês e permite publicações ilimitadas. Quer saber mais sobre algum plano específico?',
      'produto': 'Para publicar um produto, acesse sua dashboard e clique em "Novo Produto". Preencha as informações como tipo, quantidade, preço e localização.',
      'frete': 'No AgroConecta você pode publicar cargas ou se cadastrar como transportador. Nossa IA conecta automaticamente cargas com transportadores disponíveis na rota.',
      'ajuda': 'Estou aqui para ajudar! Posso esclarecer dúvidas sobre intermediação, planos, como publicar produtos, contratar fretes e muito mais. O que você gostaria de saber?'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return 'Obrigado pela sua pergunta! Posso ajudá-lo com informações sobre intermediação, planos, produtos, fretes e muito mais. Como posso ser útil?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Funções auxiliares
  const speakText = (text) => {
    if (synthesisRef.current && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('audio/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error('Alguns arquivos são inválidos. Apenas imagens e áudios até 10MB são permitidos.');
    }

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };


  const toggleVoiceMode = () => {
    if (mode === 'voice') {
      stopVoiceInput();
      setMode('text');
    } else {
      setMode('voice');
      startVoiceInput();
    }
  };

  const suggestions = [
    t('chatbot.suggestions.intermediation'),
    t('chatbot.suggestions.plans'),
    t('chatbot.suggestions.product'),
    t('chatbot.suggestions.freight')
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleChatbot()}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl hover:shadow-glow border border-white/20 backdrop-blur-xl"
        style={{ 
          background: 'var(--txc-accent)', 
          color: 'var(--txc-white)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="chatbot-widget fixed bottom-32 right-8 z-40 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col bg-gradient-to-b from-gray-900 to-black border border-white/20 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">AGROISYNC Assistant</h3>
                  <p className="text-gray-300 text-xs">Online</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMode('text')}
                  className={`p-1 rounded ${mode === 'text' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
                  title="Modo texto"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleVoiceMode}
                  className={`p-1 rounded ${mode === 'voice' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
                  title="Modo voz"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 rounded text-gray-400 hover:text-white"
                  title="Enviar arquivo"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1 rounded ${voiceEnabled ? 'text-white' : 'text-gray-400'}`}
                  title={voiceEnabled ? 'Desativar voz' : 'Ativar voz'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 !bg-black">
              {chatHistory.length === 0 && (
                <div className="text-center">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-sm mb-4 text-white">
                    Olá! Como posso ajudá-lo hoje?
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(suggestion)}
                        className="block w-full text-left p-2 text-xs rounded transition-colors text-white hover:text-white hover:bg-gray-800"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      msg.type === 'user' 
                        ? 'bg-gray-600' 
                        : 'bg-gray-700'
                    }`}>
                      {msg.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'user-message bg-gray-800 text-white'
                        : 'ai-message bg-black text-white border border-gray-600'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-600">
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
                        <span className="text-sm text-gray-300">{t('chatbot.thinking')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Anexos */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                      <FileText className="w-4 h-4 text-gray-300" />
                      <span className="text-xs text-gray-300 truncate max-w-32">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-600">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={mode === 'voice' ? "Modo voz ativo..." : "Digite sua mensagem..."}
                  className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-gray-800 text-white placeholder-gray-400"
                  disabled={mode === 'voice'}
                />
                
                {/* Input de arquivo oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Indicador de modo voz */}
              {mode === 'voice' && isListening && (
                <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-blue-400">
                  <div className="animate-pulse">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span>Ouvindo...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
