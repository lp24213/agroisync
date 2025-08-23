import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSentiment, setUserSentiment] = useState('neutral');
  const [chatbotPersonality, setChatbotPersonality] = useState('agro-expert');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Personalidades do chatbot
  const personalities = {
    'agro-expert': {
      name: 'Dr. AgroBot',
      avatar: '🌾',
      description: 'Especialista em agronegócio',
      style: 'Profissional e técnico',
      color: 'from-green-500 to-blue-500'
    },
    'friendly': {
      name: 'AgroAmigo',
      avatar: '🤝',
      description: 'Amigável e acolhedor',
      style: 'Casual e simpático',
      color: 'from-yellow-500 to-orange-500'
    },
    'analyst': {
      name: 'DataAgro',
      avatar: '📊',
      description: 'Analista de dados',
      style: 'Analítico e preciso',
      color: 'from-purple-500 to-pink-500'
    },
    'crypto': {
      name: 'CryptoAgro',
      avatar: '₿',
      description: 'Especialista em DeFi',
      style: 'Inovador e tecnológico',
      color: 'from-cyan-500 to-blue-500'
    }
  };

  // Mensagem inicial
  useEffect(() => {
    const initialMessage = {
      id: 1,
      text: `Olá! Sou ${personalities[chatbotPersonality].name} ${personalities[chatbotPersonality].avatar}\n\nComo posso ajudar você hoje? Posso:\n• 📈 Analisar cotações de grãos\n• 🏪 Ajudar no marketplace\n• 💰 Explicar DeFi e criptomoedas\n• 📍 Fornecer dados de geolocalização\n• 🔍 Buscar informações do IBGE\n• 💳 Ajudar com pagamentos\n\nEscolha uma opção ou me diga o que precisa!`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    };
    setMessages([initialMessage]);
  }, [chatbotPersonality]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Configurar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Análise de sentimento básica
  const analyzeSentiment = (text) => {
    const positiveWords = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'incrível', 'gosto', 'adoro', 'feliz', 'satisfeito'];
    const negativeWords = ['ruim', 'péssimo', 'terrível', 'horrível', 'odeio', 'triste', 'insatisfeito', 'problema', 'erro'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Simular resposta do GPT
  const generateGPTResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const sentiment = analyzeSentiment(userMessage);
    setUserSentiment(sentiment);
    
    // Respostas baseadas no contexto e personalidade
    let response = '';
    const personality = personalities[chatbotPersonality];
    
    if (userMessage.toLowerCase().includes('cotação') || userMessage.toLowerCase().includes('preço')) {
      response = `📊 **Análise de Cotações**\n\n${personality.avatar} ${personality.name} aqui!\n\n**Soja:** R$ 165,00/sc (📈 +2.3%)\n**Milho:** R$ 78,00/sc (📉 -1.1%)\n**Trigo:** R$ 210,00/sc (📈 +0.8%)\n\n💡 **Dica:** Os preços estão sendo atualizados em tempo real via API Agrolink. Quer que eu analise tendências específicas?`;
    } else if (userMessage.toLowerCase().includes('marketplace') || userMessage.toLowerCase().includes('loja')) {
      response = `🏪 **Marketplace AgroSync**\n\n${personality.avatar} ${personality.name} te ajuda!\n\n**Produtos em Destaque:**\n• Soja Premium - Sinop/MT\n• Milho Amarelo - Lucas do Rio Verde\n• Café Arábica - Franca/SP\n\n🔍 **Busca:** Use filtros por categoria, localização ou preço. Quer que eu ajude a encontrar algo específico?`;
    } else if (userMessage.toLowerCase().includes('cripto') || userMessage.toLowerCase().includes('defi')) {
      response = `₿ **DeFi & Criptomoedas**\n\n${personality.avatar} ${personality.name} no comando!\n\n**Tokens AgroSync:**\n• AGRO: R$ 0.45 (📈 +15.2%)\n• FARM: R$ 2.18 (📉 -3.1%)\n• SOIL: R$ 1.23 (📈 +8.7%)\n\n🚀 **Staking:** APY médio de 12.5%\n💧 **Liquidez:** $2.4M em pools\n\nQuer conectar sua carteira ou saber mais sobre staking?`;
    } else if (userMessage.toLowerCase().includes('ibge') || userMessage.toLowerCase().includes('dados')) {
      response = `📊 **Dados IBGE & Receita Federal**\n\n${personality.avatar} ${personality.name} com dados oficiais!\n\n**Produção Agrícola 2024:**\n• Soja: 149.4M ton (📈 +2.1%)\n• Milho: 112.9M ton (📈 +1.8%)\n• Trigo: 9.8M ton (📉 -0.5%)\n\n🏛️ **Receita Federal:**\n• Declarações: 98.7% processadas\n• Restituições: R$ 45.2B liberados\n\nPrecisa de dados específicos de alguma região?`;
    } else if (userMessage.toLowerCase().includes('geolocalização') || userMessage.toLowerCase().includes('localização')) {
      response = `📍 **Geolocalização Inteligente**\n\n${personality.avatar} ${personality.name} detectou sua localização!\n\n**Sua Região:** São Paulo, SP\n**Preços Locais:**\n• Soja: R$ 168,00/sc\n• Milho: R$ 81,00/sc\n• Frete: R$ 45,00/ton\n\n🌍 **Mercados Próximos:**\n• CEAGESP (15km)\n• Mercado Municipal (8km)\n• Terminal de Grãos (22km)\n\nQuer que eu ajuste os preços para sua região?`;
    } else if (userMessage.toLowerCase().includes('pagamento') || userMessage.toLowerCase().includes('stripe')) {
      response = `💳 **Sistema de Pagamentos**\n\n${personality.avatar} ${personality.name} te explica!\n\n**Métodos Aceitos:**\n• 💳 Cartões: Visa, Mastercard, Elo\n• 📱 PIX: Transferência imediata\n• 🏦 Boleto: Pagamento bancário\n• ₿ Cripto: Bitcoin, Ethereum\n\n🔒 **Segurança:**\n• Criptografia SSL/TLS\n• PCI DSS Compliant\n• Stripe + MetaMask integrados\n\nPrecisa de ajuda com algum pagamento específico?`;
    } else if (userMessage.toLowerCase().includes('ajuda') || userMessage.toLowerCase().includes('help')) {
      response = `🆘 **Central de Ajuda**\n\n${personality.avatar} ${personality.name} ao seu dispor!\n\n**Comandos Disponíveis:**\n• "Cotação" - Preços em tempo real\n• "Marketplace" - Produtos disponíveis\n• "Cripto" - DeFi e tokens\n• "IBGE" - Dados oficiais\n• "Localização" - Geolocalização\n• "Pagamento" - Métodos de pagamento\n\n🎯 **Dica:** Você também pode usar comandos de voz! Clique no microfone.`;
    } else {
      // Resposta genérica inteligente
      const responses = [
        `🤔 **Interessante pergunta!**\n\n${personality.avatar} ${personality.name} está analisando...\n\nBaseado no que você disse sobre "${userMessage}", posso te ajudar com:\n• 📊 Análise de dados\n• 💡 Insights do mercado\n• 🔍 Busca de informações\n\nPode reformular ou escolher um tópico específico?`,
        `🧠 **Processando sua solicitação...**\n\n${personality.avatar} ${personality.name} está pensando...\n\n**Sua mensagem:** "${userMessage}"\n\n**Minhas especialidades:**\n• Agronegócio e commodities\n• DeFi e criptomoedas\n• Dados e análises\n• Geolocalização\n\nComo posso ser mais específico?`,
        `💭 **Entendi sua pergunta!**\n\n${personality.avatar} ${personality.name} aqui para ajudar!\n\n**Contexto:** "${userMessage}"\n\n**Posso te auxiliar com:**\n• 📈 Cotações e preços\n• 🏪 Marketplace e produtos\n• ₿ Criptomoedas e DeFi\n• 📊 Dados oficiais\n\nQual área te interessa mais?`
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Adicionar emojis baseados no sentimento
    if (sentiment === 'positive') {
      response += '\n\n😊 Fico feliz que esteja satisfeito!';
    } else if (sentiment === 'negative') {
      response += '\n\n😔 Entendo sua preocupação. Vamos resolver isso juntos!';
    }
    
    return response;
  };

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      const botResponse = await generateGPTResponse(text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Desculpe, tive um problema técnico. Pode tentar novamente?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não está disponível neste navegador');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const changePersonality = (newPersonality) => {
    setChatbotPersonality(newPersonality);
    setShowPersonalitySelector(false);
    
    // Mensagem de mudança de personalidade
    const personalityMessage = {
      id: Date.now(),
      text: `🔄 **Personalidade Alterada!**\n\nAgora sou ${personalities[newPersonality].name} ${personalities[newPersonality].avatar}\n\n**Estilo:** ${personalities[newPersonality].style}\n**Especialidade:** ${personalities[newPersonality].description}\n\nComo posso te ajudar agora?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'personality-change'
    };
    
    setMessages(prev => [...prev, personalityMessage]);
  };

  const clearChat = () => {
    setMessages([]);
    setUserSentiment('neutral');
  };

  // Botão flutuante quando fechado
  if (!isOpen && !isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 group"
        >
          <span className="text-3xl group-hover:animate-bounce">🤖</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">AI</span>
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute right-0 bottom-16 bg-neutral-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Chatbot IA AgroSync
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
        </div>
      </motion.div>
    );
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110"
        >
          <span className="text-2xl">🤖</span>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${personalities[chatbotPersonality].color} p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{personalities[chatbotPersonality].avatar}</span>
                <div>
                  <h3 className="font-bold text-lg">{personalities[chatbotPersonality].name}</h3>
                  <p className="text-sm opacity-90">{personalities[chatbotPersonality].description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Mudar Personalidade"
                >
                  🔄
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Minimizar"
                >
                  ➖
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Personality Selector */}
          <AnimatePresence>
            {showPersonalitySelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neutral-800 border-b border-neutral-700 p-3"
              >
                <p className="text-white text-sm mb-2">Escolha uma personalidade:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(personalities).map(([key, personality]) => (
                    <button
                      key={key}
                      onClick={() => changePersonality(key)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        chatbotPersonality === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      <span className="text-lg mr-2">{personality.avatar}</span>
                      {personality.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-white border border-neutral-700'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm">{message.text}</div>
                  <div className={`text-xs opacity-70 mt-1 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-neutral-800 text-white p-3 rounded-2xl border border-neutral-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm opacity-70">Digitando...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-700 bg-neutral-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleVoiceRecognition}
                className={`p-2 rounded-lg transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
                title={isListening ? 'Parar Gravação' : 'Gravar Áudio'}
              >
                {isListening ? '🔴' : '🎤'}
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="w-full p-3 bg-neutral-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="1"
                  disabled={isProcessing}
                />
              </div>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isProcessing}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Enviar Mensagem"
              >
                {isProcessing ? '⏳' : '📤'}
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                  title="Limpar Chat"
                >
                  🗑️ Limpar
                </button>
                <button
                  onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                  title="Mudar Personalidade"
                >
                  🔄 Personalidade
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  userSentiment === 'positive' ? 'bg-green-500' :
                  userSentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-xs text-neutral-400">
                  {userSentiment === 'positive' ? '😊 Positivo' :
                   userSentiment === 'negative' ? '😔 Negativo' : '😐 Neutro'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
