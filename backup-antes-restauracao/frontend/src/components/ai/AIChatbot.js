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
  Minimize2,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AIService from '../../services/aiService';

const resolvePlanTier = planName => {
  if (!planName) return 'guest';
  const key = planName.toString().toLowerCase();
  if (key === 'guest') return 'guest';
  if (['free', 'gratuito'].includes(key)) return 'free';
  if (['basic', 'basico', 'pro', 'profissional'].includes(key)) return 'basic';
  if (['premium', 'empresarial', 'unlimited'].includes(key)) return 'premium';
  if (key === 'admin') return 'admin';
  return 'free';
};

const planLayerMessages = {
  guest: `🔓 **Acesso Básico (Visitante)**
• Você está usando a versão pública do Agroisync
• Explore os recursos e veja como a plataforma funciona
• Faça login ou cadastre-se para liberar ferramentas extras`,
  free: `👤 **Conta Logada (Gratuita)**
• Painel pessoal de produtos e fretes
• Notificações essenciais e chat limitado
• Confira os planos pagos para aumentar limites e recursos`,
  basic: `⭐ **Planos Básico / Pro**
• Marketplace com destaque e métricas detalhadas
• Monitoramento completo de fretes e alertas inteligentes
• Chatbot com recomendações avançadas e suporte prioritário`,
  premium: `🚀 **Planos Premium / Empresarial**
• Analytics avançado e previsões de mercado
• Integração com APIs parceiras e automações exclusivas
• Consultoria dedicada, relatórios executivos e IA ilimitada`,
  admin: `🛠️ **Administrador**
• Visão total da operação e dos usuários
• Gestão de planos, limites e monitoramento da IA
• Ferramentas de auditoria, suporte nível máximo e métricas completas`
};

function generateAIResponse(message, plan = 'guest') {
  const lowerMessage = message.toLowerCase();
  const planTier = resolvePlanTier(plan);
  const appendPlanInfo = text => `${text}\n\n${planLayerMessages[planTier]}`;

  // ========================================
  // 🤖 IA DE PRECIFICAÇÃO DINÂMICA
  // ========================================
  if (lowerMessage.includes('calcular frete') || lowerMessage.includes('quanto custa') || lowerMessage.includes('preço de frete') || lowerMessage.includes('cotação de frete')) {
    // Exemplo de cálculo inteligente
    const exampleFreight = {
      origin: 'São Paulo, SP',
      destination: 'Belo Horizonte, MG',
      cargoType: 'grains',
      weight: 8000,
      distance: 586,
      urgency: 'normal',
      season: 'harvest',
      vehicleType: 'truck',
      returnLoad: false,
      timeOfDay: 'day'
    };

    const pricing = AIService.calculateSmartFreightPrice(exampleFreight);

    return appendPlanInfo(`🤖 **IA de Precificação Dinâmica Ativada!**

📊 **Análise para: ${exampleFreight.origin} → ${exampleFreight.destination}**

💰 **Preço Sugerido**: R$ ${pricing.suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📉 **Faixa de Negociação**: R$ ${pricing.minPrice.toFixed(2)} - R$ ${pricing.maxPrice.toFixed(2)}

**🔍 Detalhamento:**
• Preço base: R$ ${pricing.breakdown.basePrice.toFixed(2)}
• Combustível: R$ ${pricing.breakdown.fuelCost.toFixed(2)}
• Pedágios: R$ ${pricing.breakdown.tolls.toFixed(2)}
• Lucro motorista: R$ ${pricing.breakdown.driverProfit.toFixed(2)}

**💡 Recomendações:**
${pricing.recommendations.bestTime}
${pricing.recommendations.returnLoad}
${pricing.recommendations.season}

**📈 Confiança**: ${(pricing.confidence * 100).toFixed(0)}% (baseado em ${pricing.breakdown.multipliers ? Object.keys(pricing.breakdown.multipliers).length : 0}+ variáveis)

Para calcular SEU frete específico, me informe:
• Origem e destino
• Tipo de carga
• Peso aproximado
• Urgência (normal/urgente)`);
  }

  // IA de Matching
  if (lowerMessage.includes('encontrar motorista') || lowerMessage.includes('matching') || lowerMessage.includes('melhor freteiro')) {
    return appendPlanInfo(`🎯 **IA de Matching Automático**

Nosso sistema inteligente encontra o motorista PERFEITO para sua carga em menos de 3 minutos!

**Como funciona:**
1️⃣ Você cadastra a carga
2️⃣ IA analisa 1000+ motoristas em tempo real
3️⃣ Considera:
   • 📍 Proximidade (até 50km = prioridade máxima)
   • ⭐ Avaliações (4.8+ estrelas primeiro)
   • 🚛 Tipo de veículo compatível
   • 💼 Experiência com sua carga
   • 🟢 Disponibilidade imediata
   • 🛡️ Certificações especiais

4️⃣ Notifica os TOP 10 motoristas
5️⃣ Primeiro a aceitar ganha o frete!

**Diferenciais:**
✓ Matching em **< 3 minutos** (vs 30min+ concorrentes)
✓ Taxa de aceitação de **94%**
✓ Algoritmo com **92% de precisão**

Quer cadastrar uma carga agora?`);
  }

  // IA de Otimização de Rotas
  if (lowerMessage.includes('melhor rota') || lowerMessage.includes('rota otimizada') || lowerMessage.includes('economia de combustível')) {
    const routeExample = AIService.optimizeRoute({
      origin: 'Campinas, SP',
      destination: 'Curitiba, PR'
    });

    return appendPlanInfo(`🗺️ **IA de Otimização de Rotas**

Exemplo: Campinas → Curitiba

**✅ Rota Recomendada:** ${routeExample.recommended}
• Distância: ${routeExample.distance}km
• Tempo estimado: ${routeExample.estimatedTime}
• Combustível: R$ ${routeExample.fuelCost.toFixed(2)}
• Pedágios: R$ ${routeExample.tolls.toFixed(2)}
• Condição: ${routeExample.roadConditions}

**💡 Sugestões IA:**
${routeExample.suggestions.join('\n')}

**⚠️ Avisos:**
${routeExample.warnings.join('\n')}

**🔀 Rota Alternativa:**
${routeExample.alternatives[0].route}
• ${routeExample.alternatives[0].pros.join(', ')}
• Economia: R$ ${(routeExample.tolls - routeExample.alternatives[0].tolls).toFixed(2)} em pedágios

Nosso sistema considera:
✓ Tráfego em tempo real
✓ Condições climáticas
✓ Obras e interdições
✓ Preço de combustível por região
✓ Pontos de descanso ideais

Informe sua rota para análise personalizada!`);
  }

  // IA de Análise de Mercado
  if (lowerMessage.includes('mercado') || lowerMessage.includes('tendência') || lowerMessage.includes('melhor época') || lowerMessage.includes('quando vender')) {
    const market = AIService.analyzeMarketTrends('soja', 'Sul');

    return appendPlanInfo(`📈 **IA de Análise de Mercado**

**Produto**: Soja  
**Região**: Sul

**💰 Preço Atual**
${market.currentPrice.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/${market.currentPrice.unit}
${market.currentPrice.trend === 'up' ? '📈' : '📉'} ${market.currentPrice.change} (24h)

**🔮 Previsão IA:**
• Próxima semana: ${market.forecast.nextWeek}
• Próximo mês: ${market.forecast.nextMonth}
• Confiança: ${market.forecast.confidence}

**📊 Fatores Considerados:**
${market.factors.join('\n')}

**🎯 Recomendação IA:**
${market.recommendation}

**🏆 Seu Posicionamento:**
Preço médio concorrentes: ${market.competitors.avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
Sua posição: ${market.competitors.yourPosition}

**📍 Melhores regiões para venda:**
${market.bestRegionsToSell.join(' • ')}

Quer análise para outro produto/região?`);
  }

  // Respostas sobre o site AgroSync
  if (lowerMessage.includes('site') || lowerMessage.includes('agroisync') || lowerMessage.includes('sobre')) {
    return appendPlanInfo(`🌾 **Sobre o AgroSync:**

O AgroSync é a plataforma mais completa para o agronegócio! Oferecemos:

**📦 Marketplace de Produtos**
• Compre e venda produtos agrícolas
• Categorias: grãos, insumos, maquinários, animais
• Pagamento seguro (PIX, cartão, cripto)

**🚛 Sistema de Fretes**
• Encontre transportadores confiáveis
• Acompanhamento em tempo real
• Orçamentos competitivos

**💎 Pagamentos Modernos**
• PIX instantâneo
• Cartão de crédito
• Criptomoedas (Bitcoin, USDT, etc)

**🤝 Parcerias e Networking**
• Conecte-se com outros produtores
• Chat privado integrado
• Busca de parceiros

Faça login ou cadastre-se para aproveitar todos os recursos!`);
  }

  if (lowerMessage.includes('frete') || lowerMessage.includes('transporte')) {
    return appendPlanInfo(`🚛 **Sistema de Fretes AgroSync:**

• **Publique sua necessidade** de transporte
• **Receba orçamentos** de transportadores verificados  
• **Acompanhe em tempo real** com GPS tracking
• **Avalie** transportadores após a entrega
• **Pagamento seguro** via plataforma

**Funcionalidades:**
✓ Cálculo automático de rotas
✓ Notificações de status
✓ Histórico completo de fretes
✓ Suporte 24/7

Acesse a aba "Fretes" para começar!`);
  }

  if (lowerMessage.includes('produto') || lowerMessage.includes('marketplace') || lowerMessage.includes('vender') || lowerMessage.includes('comprar')) {
    return appendPlanInfo(`📦 **Marketplace AgroSync:**

**Vender é fácil:**
1. Cadastre seu produto (fotos, descrição, preço)
2. Aguarde interessados
3. Negocie pelo chat integrado
4. Receba com segurança

**Comprar é seguro:**
1. Busque produtos por categoria/região
2. Compare preços e vendedores
3. Converse com o vendedor
4. Pagamento protegido pela plataforma

**Categorias disponíveis:**
🌾 Grãos e Cereais
🌱 Mudas e Sementes
🐄 Animais
🚜 Maquinários
🧪 Insumos

Comece agora no menu "Produtos"!`);
  }

  if (lowerMessage.includes('plano') || lowerMessage.includes('preço') || lowerMessage.includes('custo') || lowerMessage.includes('assinatura')) {
    return appendPlanInfo(`💎 **Planos AgroSync:**

**🆓 Plano Inicial (Grátis)**
• 5 produtos/mês
• 5 fretes/mês
• Chat básico
• Suporte por email

**⭐ Plano Básico - R$ 29,90/mês**
• 20 produtos/mês
• 20 fretes/mês
• Chat ilimitado
• Suporte prioritário
• Selo de verificação

**🏆 Plano Premium - R$ 59,90/mês**
• Produtos ilimitados
• Fretes ilimitados
• Destaque nos resultados
• Analytics avançado
• API access
• Suporte VIP

**🚀 Plano Empresarial - Sob consulta**
• Tudo do Premium +
• Múltiplos usuários
• Integração personalizada
• Account manager

Veja mais em "Planos"!`);
  }

  if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar') || lowerMessage.includes('pix') || lowerMessage.includes('cartão') || lowerMessage.includes('cripto')) {
    return appendPlanInfo(`💳 **Formas de Pagamento AgroSync:**

**PIX** 🔵
• Instantâneo
• Sem taxas extras
• QR Code gerado automaticamente

**Cartão de Crédito** 💳
• Parcelamento em até 12x
• Aceita todas as bandeiras
• Processamento seguro

**Criptomoedas** ₿
• Bitcoin (BTC)
• USDT (Tether)
• Ethereum (ETH)
• Menores taxas
• Transações globais

**Boleto Bancário** 🧾
• Prazo de 3 dias úteis
• Sem juros

Todas as transações são protegidas por criptografia de ponta!`);
  }

  // Respostas inteligentes baseadas em contexto
  if (lowerMessage.includes('preço') || lowerMessage.includes('cotação')) {
    return appendPlanInfo(`📊 Para informações de preços e cotações, posso ajudar você a:
• Consultar cotações de grãos em tempo real
• Analisar tendências de mercado
• Calcular custos de produção
• Comparar preços entre regiões

Que tipo de informação de preço você precisa?`);
  }

  if (lowerMessage.includes('clima') || lowerMessage.includes('tempo')) {
    return appendPlanInfo(`🌤️ Sobre o clima, posso fornecer:
• Previsão meteorológica para sua região
• Alertas de chuva e seca
• Dados históricos climáticos
• Recomendações para plantio

Sua localização foi detectada automaticamente. Precisa de informações específicas sobre o clima?`);
  }

  if (lowerMessage.includes('grão') || lowerMessage.includes('soja') || lowerMessage.includes('milho')) {
    return appendPlanInfo(`🌾 Informações sobre grãos disponíveis:
• Cotações atualizadas por região
• Análise de mercado
• Dicas de plantio e colheita
• Cálculos de produtividade

Qual grão você gostaria de saber mais?`);
  }

  if (lowerMessage.includes('calcular') || lowerMessage.includes('cálculo')) {
    return appendPlanInfo(`🧮 Posso ajudar com cálculos agrícolas:
• Custo por hectare
• Produtividade estimada
• ROI de investimentos
• Conversões de unidades
• Análise de rentabilidade

Que tipo de cálculo você precisa fazer?`);
  }

  if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
    return appendPlanInfo(`🤖 Sou seu assistente IA especializado em agronegócio! Posso ajudar com:

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

Como posso ajudá-lo hoje?`);
  }

  if (lowerMessage.includes('acessibilidade') || lowerMessage.includes('deficiência')) {
    return appendPlanInfo(`♿ Recursos de acessibilidade disponíveis:
• Alto contraste
• Texto ampliado
• Navegação por teclado
• Leitores de tela
• Modo daltônico
• Redução de movimento

Posso ativar qualquer recurso de acessibilidade para você. Qual você precisa?`);
  }

  // Resposta padrão inteligente
  return appendPlanInfo(`🤖 Entendi sua pergunta: "${message}"

Como assistente IA especializado em agronegócio, posso ajudá-lo com:
• 📊 Cotações e preços de grãos
• 🌤️ Informações climáticas
• 🧮 Cálculos agrícolas
• 🔍 Busca de informações
• ♿ Recursos de acessibilidade

Como posso ajudá-lo melhor?`);
}

const AIChatbot = ({ isOpen, onClose, initialMessage = null }) => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Pegar usuário autenticado
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
  
  // Limites conforme plano do usuário
  const getLimitsAndPlan = useCallback(() => {
    // Sem login: 5 perguntas públicas
    if (!user) {
      return { plan: 'guest', limit: 5 };
    }
    
    // Logado sem plano pago: 20 perguntas (razoável)
    const userPlan = user?.plan || user?.planType || 'free';
    if (userPlan === 'free' || !userPlan) {
      return { plan: 'free', limit: 20 };
    }
    
    // Com plano pago: conforme plano
    const planLimits = {
      basic: 50,
      pro: 150,
      premium: 500,
      unlimited: 999999
    };
    
    return { plan: userPlan, limit: planLimits[userPlan] || 20 };
  }, [user]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar mensagens
  useEffect(() => {
    const currentPlan = resolvePlanTier(user?.plan || user?.planType || (user ? 'free' : 'guest'));
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('chatbot.welcome', {
        defaultValue:
          '🌿 Olá! Sou a IA Agroisync. Pergunte sobre fretes, marketplace, clima, planos e novidades.'
      }),
      timestamp: new Date(),
      planLayer: currentPlan
    };
    setMessages([welcomeMessage]);
  }, [t, user]);

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
      // Pegar limites e plano do usuário
      const { plan: currentPlan, limit: maxAllowed } = getLimitsAndPlan();
      
      // Verificar limite diário
      const todayKey = `agroisync-ai-count-${new Date().toISOString().slice(0, 10)}`;
      const current = parseInt(localStorage.getItem(todayKey) || '0', 10);
      
      if (current >= maxAllowed) {
        const limitMsg = {
          id: Date.now(),
          type: 'ai',
          content: currentPlan === 'guest' 
            ? '⚠️ Limite de 5 perguntas atingido. Faça login para continuar!' 
            : currentPlan === 'free'
            ? '⚠️ Limite diário atingido. Assine um plano para aumentar seus limites.'
            : '⚠️ Limite diário do seu plano atingido. Faça upgrade para continuar!',
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

      const siteAnswer = generateAIResponse(message, currentPlan);
      const hasSiteAnswer = Boolean(siteAnswer);

      // Whitelist (apenas para usuários SEM LOGIN - guest)
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date()
      };

      if (hasSiteAnswer && currentPlan === 'guest') {
        const siteResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: siteAnswer,
          timestamp: new Date(),
          source: 'site-knowledge'
        };

        setMessages(prev => [...prev, userMessage, siteResponse]);
        setInputMessage('');
        setIsLoading(false);
        setIsTyping(false);
        localStorage.setItem(todayKey, String(current + 1));
        setDailyCount(current + 1);
        return;
      }

      setMessages(prev => {
        const next = [...prev, userMessage];
        if (hasSiteAnswer) {
          next.push({
            id: Date.now() + 1,
            type: 'ai',
            content: siteAnswer,
            timestamp: new Date(),
            source: 'site-knowledge'
          });
        }
        return next;
      });
      setInputMessage('');
      setIsLoading(true);
      setIsTyping(true);

      try {
        // Chamar API real de IA com session_id
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const apiUrl = (window.__ENV__ && window.__ENV__.REACT_APP_API_URL) || process.env.REACT_APP_API_URL || '/api';
        
        const response = await fetch(`${apiUrl}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            message: message,
            mode: aiMode,
            session_id: sessionId,
            conversationId: sessionId
          })
        });

        const data = await response.json();
        
        console.log('🤖 Resposta da API:', data);
        console.log('🤖 Status:', response.status);

        let aiContent;
        if (response.ok && data.response) {
          aiContent = data.response;
        } else if (response.ok && data.message) {
          aiContent = data.message;
        } else if (data.error) {
          // Mostrar erro real da API
          aiContent = `❌ Erro: ${data.error}\n\n${data.response || ''}`;
        } else {
          // Erro desconhecido
          aiContent = `❌ Erro ao processar resposta da IA. Status: ${response.status}\n\nResposta: ${JSON.stringify(data)}`;
        }

        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiContent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('❌ Erro ao chamar API de IA:', error);
        
        if (!hasSiteAnswer) {
          const fallback = generateAIResponse(message, currentPlan) || `❌ **Erro ao conectar com a IA**\n\nDetalhes técnicos: ${error.message}\n\nPor favor, tente novamente ou entre em contato com o suporte.`;
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
            content: fallback,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        localStorage.setItem(todayKey, String(current + 1));
        setDailyCount(current + 1);
      }
    },
    [inputMessage, getLimitsAndPlan, uploadFile, aiMode, sessionId]
  );

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
        className={`chatbot-modal fixed ${
          isMinimized
            ? 'bottom-24 right-4 w-16 h-16 sm:bottom-6 sm:right-6 sm:w-16 sm:h-16'
            : 'bottom-[112px] right-4 w-[88vw] max-w-[380px] sm:bottom-12 sm:right-10 sm:w-96 md:w-[420px] h-auto max-h-[65vh] sm:max-h-[520px] md:max-h-[560px]'
        } z-[9996] flex flex-col overflow-hidden rounded-2xl border border-green-500 text-white shadow-2xl transition-all duration-300`}
        style={{
          background: 'linear-gradient(160deg, rgba(34, 197, 94, 0.14), rgba(10, 10, 12, 0.94))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.28), 0 12px 32px rgba(0, 0, 0, 0.45)',
          height: isMinimized ? 64 : undefined,
          maxHeight: isMinimized ? 64 : undefined
        }}
      >
        {/* Header Futurista Verde */}
        <div
          className='flex items-center justify-between rounded-t-2xl border-b border-green-500/30 p-3 sm:p-4'
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.24), rgba(0, 0, 0, 0.35))',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.28)'
          }}
        >
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-green-300 bg-white/95 shadow-inner'>
              <img
                src='/logo-agroconecta-folhas.svg'
                alt='Ícone Agroisync'
                className='h-7 w-7 sm:h-8 sm:w-8 object-contain'
              />
            </div>
            <div>
              <h3 className='text-sm sm:text-base font-bold text-white flex items-center gap-1 sm:gap-2 tracking-wide'>
                Agroisync IA
                <span className='text-[10px] sm:text-xs bg-green-500/90 px-2 py-0.5 rounded-full font-semibold text-white'>
                  online
                </span>
              </h3>
              <p className='text-[11px] sm:text-xs text-green-200/90 font-medium'>
                Assistente inteligente para fretes, marketplace e clima
              </p>
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
            <button 
              onClick={onClose} 
              className='rounded-lg p-3 sm:p-2 text-white transition-all hover:bg-red-500/30 active:bg-red-500/50 hover:scale-110 active:scale-95 border-2 border-red-500 hover:border-red-400 bg-red-500/20'
              aria-label='Fechar chatbot'
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <X className='h-7 w-7 sm:h-5 sm:w-5 text-red-400 font-bold' strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Settings Panel Futurista Verde */}
        {showSettings && !isMinimized && (
          <div className='border-b border-green-500/20 bg-gradient-to-r from-green-900/20 to-black/50 p-4'>
            <h4 className='mb-3 font-semibold text-green-300 flex items-center gap-2'>
              <Brain className='h-4 w-4' />
              Configurações da IA
            </h4>
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
                className='w-full rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-900/30 hover:text-red-300 border border-red-500/30 hover:border-red-400'
              >
                🗑️ Limpar Conversa
              </button>
            </div>
          </div>
        )}

        {/* Messages Futuristas */}
        {!isMinimized && (
          <div className='chatbot-messages flex-1 space-y-3 overflow-y-auto p-2 sm:p-4'>
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
                  placeholder={t('chatbot.placeholder', {
                    defaultValue: 'Digite sua pergunta ou use o microfone...'
                  })}
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
                className='transform rounded-lg bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-3 text-white transition-all duration-300 hover:scale-110 hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 hover:rotate-12'
                style={{
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 4px 20px rgba(0, 255, 136, 0.4)'
                }}
              >
                <Send className='h-5 w-5' />
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
