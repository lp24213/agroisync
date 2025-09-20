import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  TrendingUp,
  Globe,
  Leaf,
  Truck,
  DollarSign,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AgroSyncGPT = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions] = useState([
    { id: 1, text: 'Cotações de soja', icon: TrendingUp, category: 'commodities' },
    { id: 2, text: 'Previsão do tempo', icon: Globe, category: 'weather' },
    { id: 3, text: 'Fretes disponíveis', icon: Truck, category: 'freight' },
    { id: 4, text: 'Análise de mercado', icon: BarChart3, category: 'market' },
    { id: 5, text: 'Dicas de plantio', icon: Leaf, category: 'farming' },
    { id: 6, text: 'Custos de produção', icon: DollarSign, category: 'costs' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        text: 'Olá! Sou o AgroSync GPT, seu assistente especializado em agronegócio. Posso ajudar com cotações, previsão do tempo, análise de mercado, dicas de plantio e muito mais!',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await simulateAIResponse(messageToSend);
      
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      toast.error('Erro ao processar mensagem');
    }
  };

  const simulateAIResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('soja') || lowerMessage.includes('cotação')) {
      return '📈 **Cotações da Soja (Última atualização)**\n\n• Soja em grão: R$ 180,50/saca\n• Soja em casca: R$ 175,20/saca\n• Tendência: ↗️ +2,3% (últimas 24h)\n\n📊 **Análise**: Mercado em alta devido à demanda internacional. Recomendo acompanhar as exportações chinesas.';
    }
    
    if (lowerMessage.includes('tempo') || lowerMessage.includes('clima')) {
      return '🌤️ **Previsão do Tempo - Região Centro-Oeste**\n\n**Hoje**: Parcialmente nublado, 28°C\n**Amanhã**: Possibilidade de chuva, 25°C\n**Próximos 7 dias**: Período chuvoso previsto\n\n⚠️ **Alerta**: Previsão de chuvas intensas entre quinta e sexta. Considere antecipar plantio.';
    }
    
    if (lowerMessage.includes('frete') || lowerMessage.includes('transporte')) {
      return '🚛 **Ofertas de Frete Disponíveis**\n\n• **Rota**: Cuiabá → São Paulo\n• **Valor**: R$ 2.800,00\n• **Capacidade**: 27 toneladas\n• **Prazo**: 3-4 dias\n\n• **Rota**: Campo Grande → Porto Alegre\n• **Valor**: R$ 3.200,00\n• **Capacidade**: 30 toneladas\n• **Prazo**: 5-6 dias\n\n💡 Quer ver mais opções? Use o AgroConecta!';
    }
    
    return `🤖 **AgroSync GPT**\n\nEntendi sua pergunta sobre "${userMessage}". Como assistente especializado em agronegócio, posso ajudar com:\n\n• 📈 Cotações de commodities\n• 🌤️ Previsão do tempo\n• 🚛 Ofertas de frete\n• 📊 Análise de mercado\n• 🌱 Dicas de plantio\n• 💰 Custos de produção\n\nUse os botões rápidos abaixo ou me faça uma pergunta específica!`;
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action.text);
  };

  if (!isOpen) {
    return (
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl z-50 transition-all duration-300 group"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot size={24} className="group-hover:animate-pulse" />
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          AI
        </motion.div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } transition-all duration-300`}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot size={24} className="animate-pulse" />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AgroSync GPT</h3>
              <p className="text-green-100 text-xs">Assistente IA Agrícola</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="p-3 border-b">
              <p className="text-xs text-gray-500 mb-2">Ações rápidas:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2 text-xs bg-gray-50 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IconComponent size={14} />
                      <span className="truncate">{action.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-xs mt-1 ${msg.type === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pergunte sobre agronegócio..."
                  className="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AgroSyncGPT;