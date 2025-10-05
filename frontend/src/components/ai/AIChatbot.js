import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Loader2,
  Brain,
  Lightbulb,
  Settings,
  X,
  Sparkles,
  Minimize2,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('general');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [, setDailyCount] = useState(0);
  const [plan] = useState('free'); // free | pro
  const [limits] = useState({ free: 20, pro: 200 });
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Whitelist de intents públicas (memoizada para não quebrar deps de hooks)
  const allowedPublicIntents = React.useMemo(
    () => [
      'preços',
      'cotação',
      'clima',
      'tempo',
      'ajuda',
      'contato',
      'planos',
      'frete',
      'produtos',
      'como funciona',
      'sobre',
      'cadastro',
      'login'
    ],
    []
  );

  // Inicializar mensagens
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('ai.welcome'),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [t]);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll para a última mensagem
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

      recognitionRef.current.onresult = event => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = useCallback(
    async (message = inputMessage) => {
      // Limites por plano
      const todayKey = `agroisync-ai-count-${new Date().toISOString().slice(0, 10)}`;
      const current = parseInt(localStorage.getItem(todayKey) || '0', 10);
      const planType = localStorage.getItem('agroisync-plan') || plan; // free | pro
      const maxAllowed = planType === 'pro' ? limits.pro : limits.free;
      if (current >= maxAllowed) {
        const limitMsg = {
          id: Date.now(),
          type: 'ai',
          content: '⚠️ Limite diário de mensagens atingido. Faça login/upgrade para aumentar seus limites.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, limitMsg]);
        return;
      }

      // Se houver imagem anexada, prioriza reconhecimento
      if (!message.trim() && uploadFile) {
        try {
          setIsLoading(true);
          setIsTyping(true);
          const form = new FormData();
          form.append('image', uploadFile);
          const api = (window.__ENV__ && window.__ENV__.REACT_APP_API_URL) || process.env.REACT_APP_API_URL || '/api';
          const res = await fetch(`${api}/ai/recognize`, { method: 'POST', body: form });
          const data = await res.json().catch(() => ({}));
          const text = data?.label
            ? `🖼️ Reconhecimento: ${data.label}`
            : '🖼️ Não consegui identificar o produto na imagem ainda.';
          setMessages(prev => [...prev, { id: Date.now(), type: 'ai', content: text, timestamp: new Date() }]);
        } catch (e) {
          setMessages(prev => [
            ...prev,
            { id: Date.now(), type: 'ai', content: 'Erro ao processar imagem.', timestamp: new Date() }
          ]);
        } finally {
          setIsLoading(false);
          setIsTyping(false);
          setUploadFile(null);
          setUploadPreview(null);
          localStorage.setItem(todayKey, String(current + 1));
          setDailyCount(current + 1);
        }
        return;
      }

      if (!message.trim()) return;

      // Whitelist (apenas público)
      if (planType === 'free') {
        const safe = allowedPublicIntents.some(kw => message.toLowerCase().includes(kw));
        if (!safe) {
          const guardMsg = {
            id: Date.now(),
            type: 'ai',
            content:
              '🔒 Para esse tipo de pergunta, faça login e assine um plano para ter acesso aos recursos avançados.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, guardMsg]);
          return;
        }
      }

      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);
      setIsTyping(true);

      try {
        // Simular resposta da IA com efeito de digitação
        await new Promise(resolve => setTimeout(resolve, 2000));

        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: generateAIResponse(message),
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erro ao enviar mensagem:', error);
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        localStorage.setItem(todayKey, String(current + 1));
        setDailyCount(current + 1);
      }
    },
    [inputMessage, allowedPublicIntents, limits, plan, uploadFile]
  );

  const generateAIResponse = message => {
    const lowerMessage = message.toLowerCase();

    // Respostas inteligentes baseadas em contexto
    if (lowerMessage.includes('preço') || lowerMessage.includes('cotação')) {
      return `📊 Para informações de preços e cotações, posso ajudar você a:
• Consultar cotações de grãos em tempo real
• Analisar tendências de mercado
• Calcular custos de produção
• Comparar preços entre regiões

Que tipo de informação de preço você precisa?`;
    }

    if (lowerMessage.includes('clima') || lowerMessage.includes('tempo')) {
      return `🌤️ Sobre o clima, posso fornecer:
• Previsão meteorológica para sua região
• Alertas de chuva e seca
• Dados históricos climáticos
• Recomendações para plantio

Sua localização foi detectada automaticamente. Precisa de informações específicas sobre o clima?`;
    }

    if (lowerMessage.includes('grão') || lowerMessage.includes('soja') || lowerMessage.includes('milho')) {
      return `🌾 Informações sobre grãos disponíveis:
• Cotações atualizadas por região
• Análise de mercado
• Dicas de plantio e colheita
• Cálculos de produtividade

Qual grão você gostaria de saber mais?`;
    }

    if (lowerMessage.includes('calcular') || lowerMessage.includes('cálculo')) {
      return `🧮 Posso ajudar com cálculos agrícolas:
• Custo por hectare
• Produtividade estimada
• ROI de investimentos
• Conversões de unidades
• Análise de rentabilidade

Que tipo de cálculo você precisa fazer?`;
    }

    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return `🤖 Sou seu assistente IA especializado em agronegócio! Posso ajudar com:

📊 **Mercado e Preços**
• Cotações de grãos
• Análise de tendências
• Comparação de preços

🌤️ **Clima e Tempo**
• Previsão meteorológica
• Alertas climáticos
• Dados históricos

🧮 **Cálculos Agrícolas**
• Custos de produção
• Produtividade
• ROI de investimentos

🔍 **Busca Inteligente**
• Informações sobre culturas
• Técnicas de plantio
• Soluções para problemas

Como posso ajudá-lo hoje?`;
    }

    if (lowerMessage.includes('acessibilidade') || lowerMessage.includes('deficiência')) {
      return `♿ Recursos de acessibilidade disponíveis:
• Alto contraste
• Texto ampliado
• Navegação por teclado
• Leitores de tela
• Modo daltônico
• Redução de movimento

Posso ativar qualquer recurso de acessibilidade para você. Qual você precisa?`;
    }

    // Resposta padrão inteligente
    return `🤖 Entendi sua pergunta: "${message}"

Como assistente IA especializado em agronegócio, posso ajudá-lo com:
• 📊 Cotações e preços de grãos
• 🌤️ Informações climáticas
• 🧮 Cálculos agrícolas
• 🔍 Busca de informações
• ♿ Recursos de acessibilidade

Como posso ajudá-lo melhor?`;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`chatbot-modal fixed bottom-4 right-4 w-80 md:w-96 ${isMinimized ? 'h-16' : 'h-[500px] md:h-[600px]'} z-40 flex flex-col rounded-2xl border border-black bg-black text-white shadow-2xl transition-all duration-300 md:z-50`}
        style={{
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)'
        }}
      >
        {/* Header Clean Agronegócio */}
        <div
          className='flex items-center justify-between rounded-t-2xl border-b border-black p-4'
          style={{
            background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        >
          <div className='flex items-center gap-3'>
            <div
              className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black'
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Sparkles className='h-6 w-6 text-white' />
            </div>
            <div>
              <h3 className='text-sm font-semibold text-white'>AGROISYNC AI</h3>
              <p className='text-xs text-white/60'>Assistente Inteligente</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className='rounded-lg p-2 text-white transition-colors hover:bg-white/10'
            >
              <Settings className='h-4 w-4' />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className='rounded-lg p-2 text-white transition-colors hover:bg-white/10'
            >
              {isMinimized ? <Maximize2 className='h-4 w-4' /> : <Minimize2 className='h-4 w-4' />}
            </button>
            <button onClick={onClose} className='rounded-lg p-2 text-white transition-colors hover:bg-white/10'>
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Settings Panel Futurista */}
        {showSettings && !isMinimized && (
          <div className='border-b border-gray-700 bg-gray-800 p-4'>
            <h4 className='mb-3 font-medium text-white'>Configurações</h4>
            <div className='space-y-3'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-300'>Modo da IA</label>
                <select
                  value={aiMode}
                  onChange={e => setAiMode(e.target.value)}
                  className='w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-sm text-white'
                >
                  <option value='general'>Geral</option>
                  <option value='agriculture'>Agricultura</option>
                  <option value='commerce'>Comércio</option>
                  <option value='support'>Suporte</option>
                </select>
              </div>
              <button
                onClick={clearChat}
                className='w-full rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/20 hover:text-red-300'
              >
                Limpar Conversa
              </button>
            </div>
          </div>
        )}

        {/* Messages Futuristas */}
        {!isMinimized && (
          <div className='chatbot-messages flex-1 space-y-4 overflow-y-auto p-4'>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                      : 'border border-gray-700 bg-gray-800 text-white'
                  }`}
                  style={{
                    boxShadow:
                      message.type === 'user' ? '0 4px 20px rgba(0, 255, 136, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <p className='text-sm'>{message.content}</p>
                  <p className='mt-1 text-xs opacity-70'>
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex justify-start'>
                <div className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white'>
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin text-green-400' />
                    <span className='text-sm'>Pensando...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex justify-start'>
                <div className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1'>
                      <div className='h-2 w-2 animate-bounce rounded-full bg-green-400'></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-green-400'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-green-400'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className='text-sm'>Digitando...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Futurista */}
        {!isMinimized && (
          <div className='chatbot-input border-t border-gray-700 p-4'>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ai.placeholder', 'Digite sua mensagem...')}
                  className='w-full resize-none rounded-lg border border-gray-600 bg-gray-800 p-3 pr-12 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500'
                  rows={2}
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 top-2 rounded-lg p-2 transition-colors ${
                    isListening ? 'text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
                </button>
              </div>
              {/* Upload de imagem */}
              <label className='cursor-pointer rounded-lg border border-gray-700 p-3 text-gray-300 hover:bg-gray-800'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={e => {
                    const f = e.target.files && e.target.files[0];
                    if (f) {
                      setUploadFile(f);
                      setUploadPreview(URL.createObjectURL(f));
                    }
                  }}
                />
                <ImageIcon className='h-4 w-4' />
              </label>
              <button
                onClick={() => handleSendMessage()}
                disabled={(!inputMessage.trim() && !uploadFile) || isLoading}
                className='transform rounded-lg bg-gradient-to-r from-green-500 to-blue-600 p-3 text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                style={{
                  boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
                }}
              >
                <Send className='h-4 w-4' />
              </button>
            </div>
            {uploadPreview && (
              <div className='mt-2 flex items-center gap-3 text-xs text-gray-400'>
                <img src={uploadPreview} alt='preview' className='h-10 w-10 rounded object-cover' />
                <span>1 arquivo anexado</span>
                <button
                  className='text-red-400 hover:underline'
                  onClick={() => {
                    setUploadFile(null);
                    setUploadPreview(null);
                  }}
                >
                  remover
                </button>
              </div>
            )}

            <div className='mt-2 flex items-center justify-between text-xs text-gray-400'>
              <span>Pressione Enter para enviar</span>
              <div className='flex items-center gap-4'>
                <span className='flex items-center gap-1 text-green-400'>
                  <Brain className='h-3 w-3' />
                  IA Ativa
                </span>
                <span className='flex items-center gap-1 text-blue-400'>
                  <Lightbulb className='h-3 w-3' />
                  Dicas
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatbot;
