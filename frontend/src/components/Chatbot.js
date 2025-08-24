import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Chatbot = () => {
  const { isDark, isLight } = useTheme();
  const { t } = useTranslation();
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
      color: isDark ? 'from-cyan-400 to-purple-500' : 'from-green-600 to-blue-600'
    },
    'friendly': {
      name: 'AgroAmigo',
      avatar: '🤝',
      description: 'Amigável e acolhedor',
      style: 'Casual e simpático',
      color: isDark ? 'from-purple-500 to-pink-500' : 'from-blue-600 to-green-600'
    },
    'analyst': {
      name: 'DataAgro',
      avatar: '📊',
      description: 'Analista de dados',
      style: 'Analítico e preciso',
      color: isDark ? 'from-pink-500 to-cyan-400' : 'from-green-600 to-blue-600'
    },
    'crypto': {
      name: 'CryptoAgro',
      avatar: '₿',
      description: 'Especialista em DeFi',
      style: 'Inovador e tecnológico',
      color: isDark ? 'from-cyan-400 to-pink-500' : 'from-green-600 to-blue-600'
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

  // Estado inicial minimizado em dispositivos móveis
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setIsMinimized(isMobile);
  }, []);

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

  // Simular resposta do chatbot
  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Respostas baseadas na personalidade e mensagem
    let response = '';
    const sentiment = analyzeSentiment(userMessage);
    
    if (userMessage.toLowerCase().includes('cotação') || userMessage.toLowerCase().includes('preço')) {
      response = `📊 **Cotações Atuais:**\n\n🌾 **Soja:** R$ 180,50/saca\n🌽 **Milho:** R$ 95,20/saca\n☕ **Café:** R$ 1.250,00/saca\n\n💡 *Dados atualizados em tempo real via API Agrolink*\n\nPosso ajudar com análises mais detalhadas ou alertas de preço!`;
    } else if (userMessage.toLowerCase().includes('marketplace') || userMessage.toLowerCase().includes('loja')) {
      response = `🏪 **Marketplace AgroConecta:**\n\n✅ **Produtos disponíveis:** 1.247\n✅ **Vendedores ativos:** 89\n✅ **Categorias:** Grãos, Fertilizantes, Maquinário\n\n🔍 *Use os filtros por região e cultura para encontrar o que precisa!*\n\nPrecisa de ajuda para navegar?`;
    } else if (userMessage.toLowerCase().includes('cripto') || userMessage.toLowerCase().includes('defi')) {
      response = `₿ **DeFi Agrícola:**\n\n🚀 **Token AGRO:** $2.45 (+12.5%)\n🌾 **Yield Farming:** APY até 18.5%\n🔒 **Liquidez Total:** $4.2M\n\n💡 *Stake seus tokens e ganhe recompensas em grãos digitais!*\n\nQuer saber mais sobre staking ou yield farming?`;
    } else if (userMessage.toLowerCase().includes('ibge') || userMessage.toLowerCase().includes('dados')) {
      response = `📊 **Dados IBGE - Agronegócio:**\n\n🌱 **Produção 2024:** +8.2% vs 2023\n🏭 **Exportações:** $156.7B (+15.3%)\n👥 **Empregos:** 18.2M pessoas\n\n📈 *Setor em forte crescimento!*\n\nPrecisa de dados específicos de alguma região?`;
    } else if (userMessage.toLowerCase().includes('pagamento') || userMessage.toLowerCase().includes('pagar')) {
      response = `💳 **Formas de Pagamento:**\n\n✅ **Cartão:** Visa, Mastercard, Elo\n✅ **PIX:** Instantâneo\n✅ **Cripto:** Bitcoin, Ethereum, AGRO Token\n✅ **Boleto:** 3 dias úteis\n\n🔒 *Todas as transações são seguras e criptografadas!*\n\nQual método prefere?`;
    } else {
      // Resposta genérica baseada na personalidade
      const personality = personalities[chatbotPersonality];
      if (personality.style === 'Profissional e técnico') {
        response = `🔬 **Análise Técnica:**\n\nBaseado na sua consulta sobre "${userMessage}", posso oferecer:\n\n• 📊 Análise de dados quantitativos\n• 📈 Relatórios de mercado\n• 🔍 Pesquisas especializadas\n• 💼 Consultoria técnica\n\nComo posso aprofundar em algum desses aspectos?`;
      } else if (personality.style === 'Casual e simpático') {
        response = `😊 **Oi de novo!**\n\nQue legal que você perguntou sobre "${userMessage}"! 🤔\n\nDeixa eu pensar... posso te ajudar com:\n\n• 💡 Dicas práticas\n• 🎯 Soluções simples\n• 🤝 Conectando com outros usuários\n• 🌟 Ideias criativas\n\nO que te interessa mais? 😄`;
      } else if (personality.style === 'Analítico e preciso') {
        response = `📊 **Análise Estruturada:**\n\n**Consulta:** "${userMessage}"\n**Categoria:** Informação geral\n**Complexidade:** Baixa-Média\n\n**Recomendações:**\n1. 📚 Documentação oficial\n2. 📈 Dashboards interativos\n3. 🔍 Busca avançada\n4. 📋 Relatórios customizados\n\nQual nível de detalhamento você precisa?`;
      } else {
        response = `🚀 **Inovação em Ação!**\n\nSua pergunta sobre "${userMessage}" é muito interessante! 🎯\n\nPosso te mostrar:\n\n• 🔮 Tecnologias emergentes\n• ⚡ Soluções disruptivas\n• 🌐 Integrações blockchain\n• 💎 NFTs agrícolas\n\nVamos explorar o futuro juntos? 🚀`;
      }
    }
    
    const botMessage = {
      id: Date.now(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      type: 'response',
      sentiment: sentiment
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  // Enviar mensagem
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'user',
      sentiment: analyzeSentiment(text)
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simular resposta do bot
    await simulateBotResponse(text);
  };

  // Enviar com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Alternar reconhecimento de voz
  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  // Formatar timestamp
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Botão flutuante do chatbot
  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:shadow-cyan-400/50'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-green-600/50'
          }`}
          title="Abrir Chatbot AgroConecta"
        >
          🤖
        </motion.button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-96 h-[600px]"
      >
        {/* Container principal do chat */}
        <div className={`w-full h-full rounded-2xl shadow-2xl backdrop-blur-md border overflow-hidden ${
          isDark
            ? 'bg-gray-900/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
        }`}>
          {/* Header do chat */}
          <div className={`p-4 border-b ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-gradient-to-r from-green-600 to-blue-600'
                }`}>
                  {personalities[chatbotPersonality].avatar}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {personalities[chatbotPersonality].name}
                  </h3>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {personalities[chatbotPersonality].description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Alterar personalidade"
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Minimizar"
                >
                  {isMinimized ? '📈' : '📉'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Seletor de personalidade */}
          {showPersonalitySelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 border-b ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <h4 className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Escolha a personalidade:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(personalities).map(([key, personality]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setChatbotPersonality(key);
                      setShowPersonalitySelector(false);
                    }}
                    className={`p-2 rounded-lg text-left transition-all duration-200 ${
                      chatbotPersonality === key
                        ? (isDark ? 'bg-cyan-400/20 border-cyan-400' : 'bg-green-500/20 border-green-500')
                        : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                    } border`}
                  >
                    <div className="text-lg">{personality.avatar}</div>
                    <div className={`text-xs font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {personality.name}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {personality.style}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Área de mensagens */}
          {!isMinimized && (
            <>
              <div className="flex-1 h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? (isDark 
                            ? 'bg-cyan-400 text-white' 
                            : 'bg-green-500 text-white')
                        : (isDark 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 text-gray-900')
                    }`}>
                      <div className="whitespace-pre-line text-sm">{message.text}</div>
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.sender === 'user' ? 'text-white' : (isDark ? 'text-gray-400' : 'text-gray-600')
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Indicador de digitação */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`max-w-xs p-3 rounded-2xl ${
                      isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-cyan-400' : 'bg-green-500'
                          }`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-cyan-400' : 'bg-green-500'
                          }`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-cyan-400' : 'bg-green-500'
                          }`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs ml-2">Digitando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Área de input */}
              <div className={`p-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVoiceRecognition}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isListening
                        ? (isDark ? 'bg-cyan-400 text-white' : 'bg-green-500 text-white')
                        : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                    }`}
                    title={isListening ? 'Parar gravação' : 'Gravar áudio'}
                  >
                    {isListening ? '🔴' : '🎤'}
                  </button>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className={`flex-1 p-2 rounded-lg border transition-colors duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                    }`}
                  />
                  
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      inputValue.trim() && !isTyping
                        ? (isDark 
                            ? 'bg-cyan-400 text-white hover:bg-purple-500' 
                            : 'bg-green-500 text-white hover:bg-blue-600')
                        : (isDark 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed')
                    }`}
                    title="Enviar mensagem"
                  >
                    📤
                  </button>
                </div>
                
                {/* Indicadores de status */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className={`flex items-center space-x-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isListening && <span>🎤 Gravando...</span>}
                    {isProcessing && <span>⚙️ Processando...</span>}
                  </div>
                  
                  <div className={`${
                    userSentiment === 'positive' ? '😊' : 
                    userSentiment === 'negative' ? '😔' : '😐'
                  }`}>
                    {userSentiment === 'positive' ? 'Positivo' : 
                     userSentiment === 'negative' ? 'Negativo' : 'Neutro'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
