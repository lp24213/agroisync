/**
 * 🤖 ROTAS DE IA - AGROISYNC
 * 
 * Endpoints para chat com IA, análise de imagens, recomendações, etc.
 */

import express from 'express';
import { default as auth } from '../middleware/auth.js';
import CloudflareAIService from '../services/cloudflareAIService.js';
import AgriAIService from '../services/agriAIService.js';
import logger from '../utils/logger.js';

const router = express.Router();
const aiService = new AgriAIService(); // IA especializada em agricultura

/**
 * POST /api/ai/chat
 * Chat com a IA
 * 
 * Body:
 * {
 *   message: string,
 *   mode?: 'general' | 'agriculture' | 'commerce' | 'support',
 *   conversationId?: string
 * }
 */
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, mode = 'general', conversationId, session_id } = req.body;

    // Validação
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Mensagem é obrigatória'
      });
    }
    
    // session_id é opcional - se não enviar, gera um automaticamente
    const sessionId = session_id || conversationId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const userId = req.user?.userId || req.user?.id;
    const userPlan = req.user?.plan || 'free';
    const isAdmin = req.user?.role === 'admin' || req.user?.isAdmin;

    // 🔒 LIMITAÇÕES POR PLANO (CORRETO CONFORME SOLICITADO)
    const planLimits = {
      free: {
        maxMessagesPerDay: 20, // Logado sem plano: 20 mensagens
        features: ['basic_chat', 'freight_calc', 'product_price'],
        restricted: ['advanced_analytics', 'api_access', 'priority_support']
      },
      gratuito: {
        maxMessagesPerDay: 20, // Logado sem plano: 20 mensagens
        features: ['basic_chat', 'freight_calc', 'product_price'],
        restricted: ['advanced_analytics', 'api_access', 'priority_support']
      },
      basic: {
        maxMessagesPerDay: 50, // Básico: 50 mensagens
        features: ['basic_chat', 'freight_calc', 'product_price', 'notifications'],
        restricted: ['advanced_analytics', 'api_access']
      },
      basico: {
        maxMessagesPerDay: 50, // Básico: 50 mensagens
        features: ['basic_chat', 'freight_calc', 'product_price', 'notifications'],
        restricted: ['advanced_analytics', 'api_access']
      },
      pro: {
        maxMessagesPerDay: 150, // Pro: 150 mensagens
        features: ['all'],
        restricted: []
      },
      profissional: {
        maxMessagesPerDay: 150, // Pro: 150 mensagens
        features: ['all'],
        restricted: []
      },
      premium: {
        maxMessagesPerDay: -1, // Premium: ilimitado
        features: ['all'],
        restricted: []
      },
      empresarial: {
        maxMessagesPerDay: -1, // Empresarial: ilimitado
        features: ['all'],
        restricted: []
      },
      unlimited: {
        maxMessagesPerDay: -1, // Unlimited: ilimitado
        features: ['all'],
        restricted: []
      },
      admin: {
        maxMessagesPerDay: -1, // Admin: ilimitado
        features: ['all', 'admin_analytics', 'system_monitoring'],
        restricted: []
      }
    };

    const currentPlanLimits = isAdmin ? planLimits.admin : (planLimits[userPlan] || planLimits.free);

    // Verificar limite de mensagens por dia (FREE tem limite)
    if (currentPlanLimits.maxMessagesPerDay > 0 && !isAdmin) {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `ai_messages_${userId}_${today}`;
      
      // TODO: Verificar no KV/D1 quantas mensagens hoje
      // const messageCount = await env.KV.get(cacheKey) || 0;
      // if (messageCount >= currentPlanLimits.maxMessagesPerDay) {
      //   return res.status(429).json({
      //     success: false,
      //     message: `Limite de ${currentPlanLimits.maxMessagesPerDay} mensagens/dia atingido. Faça upgrade para continuar!`,
      //     upgrade: true
      //   });
      // }
    }

    // Detectar intenção
    const intent = aiService.detectIntent(message);
    
    // Tentar resposta inteligente primeiro (cálculos automáticos)
    const smartResponse = aiService.getSmartResponse(message, intent, userId);
    if (smartResponse) {
      // Resposta calculada automaticamente (cotação de frete, etc.)
      return res.json({
        success: true,
        message: smartResponse,
        intent: intent,
        source: 'smart_calculation',
        timestamp: new Date().toISOString()
      });
    }
    
    // Tentar resposta rápida para perguntas simples
    const quickResponse = aiService.getQuickResponse(intent);
    if (quickResponse && message.split(' ').length <= 5) {
      // Se a mensagem é curta e tem resposta rápida, usar ela
      return res.json({
        success: true,
        message: quickResponse,
        intent: intent,
        source: 'quick_response',
        timestamp: new Date().toISOString()
      });
    }

    // Buscar histórico da conversa (se tiver conversationId)
    let conversationHistory = [];
    if (conversationId) {
      // TODO: Buscar do banco de dados
      // const conversation = await Conversation.findById(conversationId);
      // conversationHistory = conversation?.messages || [];
    }

    // Adicionar mensagem atual
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Gerar resposta com IA (COM LIMITAÇÕES POR PLANO)
    const aiResponse = await aiService.generateResponse(
      req.env, 
      conversationHistory, 
      userId, 
      mode,
      userPlan,
      isAdmin
    );

    // Salvar mensagens no histórico (opcional)
    // TODO: Salvar no banco
    // if (conversationId) {
    //   await Conversation.addMessage(conversationId, { role: 'user', content: message });
    //   await Conversation.addMessage(conversationId, { role: 'assistant', content: aiResponse });
    // }

    // Analisar sentimento
    const sentiment = aiService.analyzeSentiment(message);

    // Log para analytics
    logger.info(`IA Chat - User: ${userId}, Mode: ${mode}, Intent: ${intent}, Sentiment: ${sentiment}`);

    res.json({
      success: true,
      message: aiResponse,
      intent: intent,
      sentiment: sentiment,
      mode: mode,
      source: 'cloudflare_ai',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Erro no chat IA:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar sua mensagem. Tente novamente.',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

/**
 * POST /api/ai/image-analysis
 * Análise de imagem com IA
 * 
 * Body:
 * {
 *   imageUrl: string,
 *   context?: string
 * }
 */
router.post('/image-analysis', auth, async (req, res) => {
  try {
    const { imageUrl, context } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL da imagem é obrigatória'
      });
    }

    const description = await aiService.generateImageCaption(req.env, imageUrl);

    res.json({
      success: true,
      description: description,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro na análise de imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao analisar imagem'
    });
  }
});

/**
 * GET /api/ai/suggestions
 * Sugestões personalizadas para o usuário
 */
router.get('/suggestions', auth, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    // Sugestões baseadas em atividade do usuário
    const suggestions = [
      {
        type: 'product',
        title: 'Produtos Recomendados',
        items: [
          '🌾 Soja Premium - São Paulo',
          '🌽 Milho Híbrido - Paraná',
          '☕ Café Arábica - Minas Gerais'
        ]
      },
      {
        type: 'freight',
        title: 'Fretes Disponíveis',
        items: [
          '🚛 SP → RJ - Grãos - R$ 2.500',
          '🚛 MG → ES - Café - R$ 1.800',
          '🚛 PR → SC - Milho - R$ 3.200'
        ]
      },
      {
        type: 'tip',
        title: 'Dica do Dia',
        message: '💡 Use nossa IA para calcular o preço justo dos seus produtos baseado no mercado!'
      }
    ];

    res.json({
      success: true,
      suggestions: suggestions,
      userId: userId
    });

  } catch (error) {
    logger.error('Erro ao gerar sugestões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar sugestões'
    });
  }
});

export default router;
