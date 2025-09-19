const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/Chat');
const User = require('../models/User');
const FreightOrder = require('../models/FreightOrder');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');
const openaiService = require('../services/openaiService');
const cloudflareService = require('../services/cloudflareService');

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const uploadPath = path.join('uploads', 'chats', userId);
    
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Enviar mensagem para o chatbot
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               conversationId:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/send',
  auth,
  upload.array('attachments', 5),
  [
    body('message').notEmpty().withMessage('Mensagem é obrigatória'),
    body('conversationId').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { message, conversationId } = req.body;
      const userId = req.user.id;
      const attachments = req.files || [];

      // Buscar ou criar conversa
      let chat;
      if (conversationId) {
        chat = await Chat.findByConversationId(conversationId);
        if (!chat || (chat.userId && chat.userId.toString() !== userId)) {
          return res.status(404).json({
            success: false,
            message: 'Conversa não encontrada'
          });
        }
      } else {
        chat = await Chat.createConversation(userId, 'general');
      }

      // Processar anexos
      const processedAttachments = [];
      for (const file of attachments) {
        const attachment = {
          type: file.mimetype.startsWith('image/') ? 'image' : 'voice',
          url: `/uploads/chats/${userId}/${file.filename}`,
          filename: file.originalname,
          size: file.size,
          mimeType: file.mimetype
        };

        // Se for imagem, gerar caption com IA
        if (attachment.type === 'image') {
          try {
            const caption = await openaiService.generateImageCaption(file.path);
            attachment.caption = caption;
            attachment.altText = caption;
          } catch (error) {
            logger.error('Erro ao gerar caption da imagem:', error);
            attachment.caption = 'Imagem enviada';
            attachment.altText = 'Imagem enviada pelo usuário';
          }
        }

        processedAttachments.push(attachment);
      }

      // Adicionar mensagem do usuário
      await chat.addMessage('user', message, {
        attachments: processedAttachments,
        status: 'delivered'
      });

      // Verificar se é comando especial (logística)
      const isLogisticsCommand = await handleLogisticsCommand(message, userId, chat);
      
      let aiResponse = '';
      if (!isLogisticsCommand) {
        // Gerar resposta da IA
        aiResponse = await openaiService.generateResponse(chat.messages, userId);
      } else {
        aiResponse = isLogisticsCommand;
      }

      // Adicionar resposta da IA
      await chat.addMessage('assistant', aiResponse, {
        status: 'delivered'
      });

      logger.info(`Mensagem enviada na conversa ${chat.conversationId} por usuário ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: {
          conversationId: chat.conversationId,
          userMessage: {
            role: 'user',
            text: message,
            attachments: processedAttachments,
            timestamp: new Date()
          },
          aiResponse: {
            role: 'assistant',
            text: aiResponse,
            timestamp: new Date()
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/chat/{conversationId}:
 *   get:
 *     summary: Obter histórico da conversa
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico da conversa
 *       404:
 *         description: Conversa não encontrada
 */
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findByConversationId(conversationId);
    
    if (!chat || (chat.userId && chat.userId.toString() !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Conversa não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        conversationId: chat.conversationId,
        messages: chat.messages,
        settings: chat.settings,
        stats: chat.stats,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    logger.error('Erro ao obter conversa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Listar conversas do usuário
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Chat.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: {
        conversations: conversations.map(chat => ({
          conversationId: chat.conversationId,
          context: chat.context,
          lastMessage: chat.lastMessage,
          messageCount: chat.messageCount,
          lastActivityAt: chat.stats.lastActivityAt,
          createdAt: chat.createdAt
        }))
      }
    });
  } catch (error) {
    logger.error('Erro ao listar conversas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/chat/upload:
 *   post:
 *     summary: Upload de arquivo para chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo enviado com sucesso
 */
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const userId = req.user.id;
    const fileUrl = `/uploads/chats/${userId}/${req.file.filename}`;

    // Se for imagem, gerar caption
    let caption = null;
    if (req.file.mimetype.startsWith('image/')) {
      try {
        caption = await openaiService.generateImageCaption(req.file.path);
      } catch (error) {
        logger.error('Erro ao gerar caption:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        caption: caption
      }
    });
  } catch (error) {
    logger.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/chat/voice:
 *   post:
 *     summary: Processar áudio de voz
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Áudio processado com sucesso
 */
router.post('/voice', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo de áudio enviado'
      });
    }

    // Transcrever áudio usando OpenAI Whisper
    const transcription = await openaiService.transcribeAudio(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        transcription,
        audioUrl: `/uploads/chats/${req.user.id}/${req.file.filename}`
      }
    });
  } catch (error) {
    logger.error('Erro ao processar áudio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Função auxiliar para lidar com comandos de logística
async function handleLogisticsCommand(message, userId, chat) {
  const lowerMessage = message.toLowerCase();
  
  // Verificar se é comando de criação de frete
  if (lowerMessage.includes('criar frete') || lowerMessage.includes('criar pedido de frete')) {
    try {
      // Extrair informações do comando usando IA
      const freightInfo = await openaiService.extractFreightInfo(message);
      
      if (freightInfo) {
        // Criar pedido de frete
        const freightOrder = new FreightOrder({
          buyerId: userId,
          sellerId: freightInfo.sellerId || userId, // Por enquanto, mesmo usuário
          origin: freightInfo.origin,
          destination: freightInfo.destination,
          pickupDate: freightInfo.pickupDate,
          deliveryDateEstimate: freightInfo.deliveryDateEstimate,
          items: freightInfo.items,
          pricing: freightInfo.pricing
        });

        await freightOrder.save();

        return `✅ Pedido de frete criado com sucesso!\n\n📋 **Detalhes do Pedido:**\n- Número: ${freightOrder.orderNumber}\n- Origem: ${freightOrder.origin.city}, ${freightOrder.origin.state}\n- Destino: ${freightOrder.destination.city}, ${freightOrder.destination.state}\n- Data de coleta: ${freightOrder.pickupDate.toLocaleDateString('pt-BR')}\n- Preço total: R$ ${freightOrder.pricing.totalPrice.toFixed(2)}\n\n🚛 O pedido está aguardando aceitação de transportadores.`;
      }
    } catch (error) {
      logger.error('Erro ao criar pedido de frete:', error);
      return '❌ Erro ao criar pedido de frete. Tente novamente ou use o formulário da plataforma.';
    }
  }

  // Verificar se é comando de rastreamento
  if (lowerMessage.includes('rastrear') || lowerMessage.includes('status do frete')) {
    try {
      // Extrair número do pedido da mensagem
      const orderNumber = message.match(/FR-\d+-\w+/)?.[0];
      
      if (orderNumber) {
        const freightOrder = await FreightOrder.findOne({ orderNumber });
        
        if (freightOrder) {
          const lastEvent = freightOrder.trackingEvents[freightOrder.trackingEvents.length - 1];
          return `📦 **Status do Frete ${orderNumber}:**\n\n🚛 Status atual: ${freightOrder.status}\n📍 Última localização: ${lastEvent?.location?.city || 'Não informada'}\n📅 Última atualização: ${lastEvent?.timestamp?.toLocaleString('pt-BR') || 'Não disponível'}\n\n💡 Para mais detalhes, acesse a página do pedido na plataforma.`;
        } else {
          return '❌ Pedido de frete não encontrado. Verifique o número do pedido.';
        }
      }
    } catch (error) {
      logger.error('Erro ao rastrear frete:', error);
      return '❌ Erro ao consultar status do frete. Tente novamente.';
    }
  }

  return null; // Não é comando especial
}

module.exports = router;
