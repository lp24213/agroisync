import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  Loader2,
  Bot,
  User
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import useStore from '../store/useStore';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState('text');
  const messagesEndRef = useRef(null);
  
  const { t } = useLanguage();
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    addChatMessage(userMessage);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateBotResponse(message),
        timestamp: new Date()
      };
      
      addChatMessage(botMessage);
      setIsTyping(false);
    }, 1500);
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

  const toggleVoiceMode = () => {
    if (mode === 'voice') {
      setIsListening(false);
      setMode('text');
    } else {
      setMode('voice');
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setMessage('Como funciona a intermediação?');
      }, 3000);
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
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 shadow-lg' 
            : 'bg-gray-700 shadow-lg hover:bg-gray-600'
        }`}
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
              <MessageCircle className="w-6 h-6 text-white" />
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
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-sm">{t('chatbot.title')}</h3>
                  <p className="text-green-600 text-xs">{t('chatbot.status')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMode('text')}
                  className={`p-1 rounded ${mode === 'text' ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleVoiceMode}
                  className={`p-1 rounded ${mode === 'voice' ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMode('image')}
                  className={`p-1 rounded ${mode === 'image' ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatHistory.length === 0 && (
                <div className="text-center">
                  <Bot className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-4">
                    {t('chatbot.welcome')}
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(suggestion)}
                        className="block w-full text-left p-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
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
                        : 'bg-gray-500'
                    }`}>
                      {msg.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
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
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                        <span className="text-sm text-gray-600">{t('chatbot.thinking')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  disabled={mode !== 'text'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="p-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
