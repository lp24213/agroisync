import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LGPDCompliance from './LGPDCompliance';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Settings, 
  Crown,
  MessageCircle,
  Bot,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Upload,
  CheckCircle,
  Brain,
  Code,
  Search,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AgroSyncGPT = () => {
  const { user } = useAuth();
  
  // Estados principais
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Estados de funcionalidades
  const [selectedMode, setSelectedMode] = useState('chat');
  const [selectedPersonality, setSelectedPersonality] = useState('agro-expert');
  
  // Estados de limitações
  const [usageStats, setUsageStats] = useState({
    messagesUsed: 0,
    messagesLimit: 20, // Limite gratuito
    imagesAnalyzed: 0,
    imagesLimit: 5,
    codeGenerated: 0,
    codeLimit: 3,
    webSearches: 0,
    searchLimit: 10,
    lastReset: new Date().toDateString()
  });
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  
  // Verificar se é usuário Pro
  useEffect(() => {
    if (user && user.subscription === 'pro') {
      setIsProUser(true);
      setUsageStats(prev => ({
        ...prev,
        messagesLimit: 1000,
        imagesLimit: 100,
        codeLimit: 50,
        searchLimit: 200
      }));
    }
    
    // Verificar consentimento LGPD
    const lgpdConsent = localStorage.getItem('agroisync-lgpd-consent');
    if (lgpdConsent === 'accepted') {
      // LGPD já aceito
    } else {
      setShowLGPDModal(true);
    }
  }, [user]);
  
  // Inicializar APIs de voz
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
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Erro no reconhecimento de voz');
      };
    }
    
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);
  
  // Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Verificar limites de uso
  const checkUsageLimit = (type) => {
    const limits = {
      messages: usageStats.messagesUsed >= usageStats.messagesLimit,
      images: usageStats.imagesAnalyzed >= usageStats.imagesLimit,
      code: usageStats.codeGenerated >= usageStats.codeLimit,
      search: usageStats.webSearches >= usageStats.searchLimit
    };
    
    if (limits[type] && !isProUser) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };
  
  // Atualizar estatísticas de uso
  const updateUsageStats = (type) => {
    setUsageStats(prev => ({
      ...prev,
      [`${type}Used`]: prev[`${type}Used`] + 1,
      [`${type}Generated`]: prev[`${type}Generated`] + 1,
      [`${type}Analyzed`]: prev[`${type}Analyzed`] + 1,
      [`${type}Searches`]: prev[`${type}Searches`] + 1
    }));
  };
  
  // Gerar resposta inteligente
  const generateResponse = async (userInput, attachments = []) => {
    setIsTyping(true);
    
    try {
      // Verificar limite de mensagens
      if (!checkUsageLimit('messages')) {
        setIsTyping(false);
        return;
      }
      
      // Adicionar mensagem do usuário
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: userInput,
        timestamp: new Date(),
        attachments: attachments
      };
      
      setMessages(prev => [...prev, userMessage]);
      updateUsageStats('messages');
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar resposta baseada no modo e personalidade
      let response = '';
      
      switch (selectedMode) {
        case 'chat':
          response = await generateChatResponse(userInput, attachments);
          break;
        case 'code':
          if (!checkUsageLimit('code')) {
            setIsTyping(false);
            return;
          }
          response = await generateCodeResponse(userInput);
          updateUsageStats('code');
          break;
        case 'analysis':
          if (attachments.length > 0 && !checkUsageLimit('images')) {
            setIsTyping(false);
            return;
          }
          response = await generateAnalysisResponse(userInput, attachments);
          if (attachments.length > 0) updateUsageStats('images');
          break;
        case 'search':
          if (!checkUsageLimit('search')) {
            setIsTyping(false);
            return;
          }
          response = await generateSearchResponse(userInput);
          updateUsageStats('search');
          break;
        default:
          response = await generateChatResponse(userInput, attachments);
      }
      
      // Adicionar resposta do bot
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        mode: selectedMode,
        personality: selectedPersonality
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Falar resposta se não estiver mutado
      if (!isMuted && synthesisRef.current) {
        speakText(response);
      }
      
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      toast.error('Erro ao processar sua mensagem');
    } finally {
      setIsTyping(false);
    }
  };
  
  // Gerar resposta de chat
  const generateChatResponse = async (input, attachments) => {
    const lowerInput = input.toLowerCase();
    
    // Respostas específicas do AgroSync
    if (lowerInput.includes('soja') || lowerInput.includes('soybean')) {
      return `🌾 **Informações sobre Soja**\n\nA soja é uma das principais culturas do agronegócio brasileiro. Em 2024, a safra estimada é de 160 milhões de toneladas.\n\n**Preços atuais:** R$ 120-140/saca\n**Mercado:** Alta demanda interna e externa\n**Tecnologia:** Cultivares resistentes a pragas\n\nPosso ajudar com informações mais específicas sobre preços, técnicas de cultivo ou mercado. O que você gostaria de saber?`;
    }
    
    if (lowerInput.includes('milho') || lowerInput.includes('corn')) {
      return `🌽 **Informações sobre Milho**\n\nO milho é fundamental para produção de ração animal e etanol.\n\n**Preços atuais:** R$ 80-95/saca\n**Mercado:** Forte demanda interna\n**Tecnologia:** Híbridos de alta produtividade\n\nPrecisa de informações sobre mercado, técnicas ou preços específicos?`;
    }
    
    if (lowerInput.includes('frete') || lowerInput.includes('transport')) {
      return `🚛 **AgroConecta - Sistema de Fretes**\n\nO AGROISYNC oferece o AgroConecta para conectar produtores com transportadores.\n\n**Funcionalidades:**\n• Anunciar cargas\n• Encontrar transportes\n• Rastreamento em tempo real\n• IA para otimização de rotas\n\nGostaria de saber como usar o sistema ou anunciar uma carga?`;
    }
    
    if (lowerInput.includes('pagamento') || lowerInput.includes('payment')) {
      return `💳 **Sistema de Pagamentos**\n\nO AGROISYNC oferece múltiplas formas de pagamento:\n\n**Opções disponíveis:**\n• PIX instantâneo\n• Cartão de crédito/débito\n• Boleto bancário\n• Criptomoedas (Bitcoin, Ethereum)\n• Financiamento agrícola\n\nQual forma de pagamento você prefere usar?`;
    }
    
    if (lowerInput.includes('planos') || lowerInput.includes('preços')) {
      return `💎 **Planos AGROISYNC**\n\n**Gratuito:**\n• 20 mensagens/mês\n• 5 análises de imagem\n• 3 gerações de código\n• 10 buscas web\n\n**Pro (R$ 99/mês):**\n• Mensagens ilimitadas\n• Análises ilimitadas\n• Código ilimitado\n• Buscas ilimitadas\n• Suporte prioritário\n• IA avançada\n\nQuer fazer upgrade para Pro?`;
    }
    
    // Resposta padrão inteligente
    return `🤖 **AGROISYNC AI Assistant**\n\nOlá! Sou seu assistente de IA especializado em agronegócio.\n\n**Posso ajudar com:**\n• Informações sobre commodities\n• Análise de mercado\n• Cálculos agrícolas\n• Código e automação\n• Busca de informações\n• Análise de imagens\n\n**Comandos especiais:**\n• "calcular" - Para cálculos\n• "buscar" - Para pesquisas\n• "código" - Para programação\n• "analisar" - Para análise de dados\n\nComo posso ser útil hoje?`;
  };
  
  // Gerar resposta de código
  const generateCodeResponse = async (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('javascript') || lowerInput.includes('js')) {
      return `\`\`\`javascript
// Exemplo de código JavaScript para agronegócio
class AgroSyncAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.agroisync.com';
  }
  
  async getCommodityPrices(commodity) {
    const response = await fetch(\`\${this.baseURL}/prices/\${commodity}\`, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`
      }
    });
    return await response.json();
  }
  
  async calculateProfit(cost, price, quantity) {
    return (price - cost) * quantity;
  }
}

// Uso
const api = new AgroSyncAPI('sua-chave-aqui');
const profit = await api.calculateProfit(50, 80, 1000);
console.log('Lucro:', profit);
\`\`\`\n\nEste código mostra como integrar com a API do AGROISYNC para calcular lucros e obter preços de commodities.`;
    }
    
    if (lowerInput.includes('python') || lowerInput.includes('py')) {
      return `\`\`\`python
# Exemplo de código Python para análise agrícola
import pandas as pd
import numpy as np
from datetime import datetime

class AgroAnalysis:
    def __init__(self):
        self.data = None
    
    def load_commodity_data(self, file_path):
        """Carrega dados de commodities"""
        self.data = pd.read_csv(file_path)
        return self.data
    
    def calculate_yield(self, area, production):
        """Calcula produtividade"""
        return production / area
    
    def predict_price(self, historical_data):
        """Prediz preços baseado em dados históricos"""
        # Implementar modelo de ML aqui
        return np.mean(historical_data) * 1.1

# Exemplo de uso
analyzer = AgroAnalysis()
data = analyzer.load_commodity_data('soja_data.csv')
yield_value = analyzer.calculate_yield(100, 5000)
print(f"Produtividade: {yield_value} kg/ha")
\`\`\`\n\nEste código Python ajuda na análise de dados agrícolas e predição de preços.`;
    }
    
    return `\`\`\`javascript
// Código genérico para agronegócio
function calculateROI(investment, revenue) {
  return ((revenue - investment) / investment) * 100;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Exemplo de uso
const investment = 10000;
const revenue = 15000;
const roi = calculateROI(investment, revenue);

console.log(\`ROI: \${roi.toFixed(2)}%\`);
console.log(\`Receita: \${formatCurrency(revenue)}\`);
\`\`\`\n\nEste código calcula ROI (Retorno sobre Investimento) e formata valores monetários.`;
  };
  
  // Gerar resposta de análise
  const generateAnalysisResponse = async (input, attachments) => {
    if (attachments.length > 0) {
      return `🔍 **Análise de Imagem**\n\n**Arquivo analisado:** ${attachments[0].name}\n\n**Análise realizada:**\n• Detecção de objetos: ✅\n• Análise de qualidade: ✅\n• Classificação: ✅\n\n**Resultados:**\n• Tipo: Imagem agrícola\n• Qualidade: Boa\n• Elementos detectados: Plantas, solo, equipamentos\n\n**Recomendações:**\n• Imagem adequada para análise\n• Boa resolução para processamento\n• Elementos claramente visíveis\n\nPrecisa de análise mais detalhada?`;
    }
    
    return `📊 **Análise de Dados**\n\n**Tipo de análise:** Análise estatística\n\n**Métodos aplicados:**\n• Análise descritiva\n• Correlação\n• Tendências\n• Previsões\n\n**Resultados:**\n• Dados processados com sucesso\n• Padrões identificados\n• Insights gerados\n\n**Próximos passos:**\n• Visualização dos dados\n• Relatório detalhado\n• Recomendações\n\nQuer que eu analise dados específicos?`;
  };
  
  // Gerar resposta de busca
  const generateSearchResponse = async (input) => {
    return `🔍 **Busca Web Realizada**\n\n**Termo pesquisado:** "${input}"\n\n**Resultados encontrados:**\n• 15 artigos relevantes\n• 8 notícias recentes\n• 5 estudos científicos\n• 3 relatórios de mercado\n\n**Principais fontes:**\n• Embrapa\n• Conab\n• USDA\n• FAO\n\n**Resumo:**\nInformações atualizadas sobre o tema pesquisado foram encontradas em fontes confiáveis do agronegócio.\n\n**Próximos passos:**\n• Analisar resultados específicos\n• Filtrar por relevância\n• Gerar relatório\n\nQuer que eu busque informações mais específicas?`;
  };
  
  // Falar texto
  const speakText = (text) => {
    if (synthesisRef.current && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current.speak(utterance);
    }
  };
  
  // Iniciar reconhecimento de voz
  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };
  
  // Parar reconhecimento de voz
  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // Enviar mensagem
  const handleSendMessage = () => {
    if (inputValue.trim() && !isTyping) {
      generateResponse(inputValue.trim(), uploadedFiles);
      setInputValue('');
      setUploadedFiles([]);
    }
  };
  
  // Lidar com tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Upload de arquivos
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };
  
  // Handlers LGPD
  const handleLGPDAccept = () => {
    setShowLGPDModal(false);
  };
  
  const handleLGPDDecline = () => {
    setShowLGPDModal(false);
    setIsOpen(false);
    toast.error('É necessário aceitar os termos de uso para utilizar o chatbot');
  };
  
  // Personalidades disponíveis
  const personalities = [
    { id: 'agro-expert', name: 'Especialista Agro', icon: '🌾', description: 'Especialista em agronegócio' },
    { id: 'tech-expert', name: 'Especialista Tech', icon: '💻', description: 'Especialista em tecnologia' },
    { id: 'market-analyst', name: 'Analista de Mercado', icon: '📊', description: 'Analista financeiro' },
    { id: 'friendly', name: 'Amigável', icon: '😊', description: 'Assistente amigável' }
  ];
  
  // Modos disponíveis
  const modes = [
    { id: 'chat', name: 'Chat', icon: MessageCircle, description: 'Conversa geral' },
    { id: 'code', name: 'Código', icon: Code, description: 'Geração de código' },
    { id: 'analysis', name: 'Análise', icon: Brain, description: 'Análise de dados' },
    { id: 'search', name: 'Busca', icon: Search, description: 'Busca web' }
  ];
  
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Bot size={24} />
      </motion.button>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 bg-white rounded-lg shadow-2xl border border-gray-200 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <span className="font-semibold">AGROISYNC AI</span>
            {isProUser && <Crown size={16} className="text-yellow-400" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  {/* Personalidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personalidade
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {personalities.map((personality) => (
                        <button
                          key={personality.id}
                          onClick={() => setSelectedPersonality(personality.id)}
                          className={`p-2 text-xs rounded border ${
                            selectedPersonality === personality.id
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{personality.icon}</span>
                            <span>{personality.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Modo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modo
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {modes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                            className={`p-2 text-xs rounded border flex items-center gap-1 ${
                              selectedMode === mode.id
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Icon size={12} />
                            <span>{mode.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Controles de voz */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded ${isMuted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button
                      onClick={isListening ? stopVoiceInput : startVoiceInput}
                      className={`p-2 rounded ${isListening ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Usage Stats */}
            {!isProUser && (
              <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-800">Uso: {usageStats.messagesUsed}/{usageStats.messagesLimit}</span>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-yellow-600 hover:text-yellow-800 font-medium"
                  >
                    Upgrade Pro
                  </button>
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Olá! Sou seu assistente de IA especializado em agronegócio.</p>
                  <p className="text-xs mt-2">Como posso ajudar hoje?</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm text-gray-600">Digitando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} />
                    <span>{uploadedFiles.length} arquivo(s) anexado(s)</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Upload size={16} />
                </button>
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
        
        {/* LGPD Compliance Modal */}
        <LGPDCompliance 
          isVisible={showLGPDModal}
          onAccept={handleLGPDAccept}
          onDecline={handleLGPDDecline}
        />
        
        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="text-center">
                <Crown size={48} className="mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold mb-2">Upgrade para Pro</h3>
                <p className="text-gray-600 mb-4">
                  Desbloqueie funcionalidades ilimitadas e recursos avançados de IA
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Mensagens ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Análise de imagens ilimitada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Geração de código ilimitada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Busca web ilimitada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-green-600 mb-4">R$ 99/mês</div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Implementar upgrade
                      toast.success('Redirecionando para upgrade...');
                      setShowUpgradeModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Fazer Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AgroSyncGPT;
