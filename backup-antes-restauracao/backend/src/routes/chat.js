import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import FreightOrder from '../models/FreightOrder.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import getOpenAIService from '../services/openaiService.js';
import cloudflareService from '../services/cloudflareService.js';

const router = express.Router();
const openaiService = getOpenAIService();

// ConfiguraÃ§Ã£o do multer para upload de arquivos
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
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo nÃ£o permitido'), false);
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
 *         description: Dados invÃ¡lidos
 */
router.post(
  '/send',
  auth,
  upload.array('attachments', 5),
  [
    body('message').notEmpty().withMessage('Mensagem Ã© obrigatÃ³ria'),
    body('conversationId').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
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
            message: 'Conversa nÃ£o encontrada'
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
            attachment.altText = 'Imagem enviada pelo usuÃ¡rio';
          }
        }

        processedAttachments.push(attachment);
      }

      // Adicionar mensagem do usuÃ¡rio
      await chat.addMessage('user', message, {
        attachments: processedAttachments,
        status: 'delivered'
      });

      // Verificar se Ã© comando especial (logÃ­stica)
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

      logger.info(`Mensagem enviada na conversa ${chat.conversationId} por usuÃ¡rio ${userId}`);

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
 *     summary: Obter histÃ³rico da conversa
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
 *         description: HistÃ³rico da conversa
 *       404:
 *         description: Conversa nÃ£o encontrada
 */
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findByConversationId(conversationId);

    if (!chat || (chat.userId && chat.userId.toString() !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Conversa nÃ£o encontrada'
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
 *     summary: Listar conversas do usuÃ¡rio
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
        caption
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
 *     summary: Processar Ã¡udio de voz
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
 *         description: Ãudio processado com sucesso
 */
router.post('/voice', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo de Ã¡udio enviado'
      });
    }

    // Transcrever Ã¡udio usando OpenAI Whisper
    const transcription = await openaiService.transcribeAudio(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        transcription,
        audioUrl: `/uploads/chats/${req.user.id}/${req.file.filename}`
      }
    });
  } catch (error) {
    logger.error('Erro ao processar Ã¡udio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// FunÃ§Ã£o auxiliar para lidar com comandos de logÃ­stica
async function handleLogisticsCommand(message, userId, chat) {
  const lowerMessage = message.toLowerCase();

  // Verificar se Ã© comando de criaÃ§Ã£o de frete
  if (lowerMessage.includes('criar frete') || lowerMessage.includes('criar pedido de frete')) {
    try {
      // Extrair informaÃ§Ãµes do comando usando IA
      const freightInfo = await openaiService.extractFreightInfo(message);

      if (freightInfo) {
        // Criar pedido de frete
        const freightOrder = new FreightOrder({
          buyerId: userId,
          sellerId: freightInfo.sellerId || userId, // Por enquanto, mesmo usuÃ¡rio
          origin: freightInfo.origin,
          destination: freightInfo.destination,
          pickupDate: freightInfo.pickupDate,
          deliveryDateEstimate: freightInfo.deliveryDateEstimate,
          items: freightInfo.items,
          pricing: freightInfo.pricing
        });

        await freightOrder.save();

        return `âœ… Pedido de frete criado com sucesso!\n\nðŸ“‹ **Detalhes do Pedido:**\n- NÃºmero: ${freightOrder.orderNumber}\n- Origem: ${freightOrder.origin.city}, ${freightOrder.origin.state}\n- Destino: ${freightOrder.destination.city}, ${freightOrder.destination.state}\n- Data de coleta: ${freightOrder.pickupDate.toLocaleDateString('pt-BR')}\n- PreÃ§o total: R$ ${freightOrder.pricing.totalPrice.toFixed(2)}\n\nðŸš› O pedido estÃ¡ aguardando aceitaÃ§Ã£o de transportadores.`;
      }
    } catch (error) {
      logger.error('Erro ao criar pedido de frete:', error);
      return 'âŒ Erro ao criar pedido de frete. Tente novamente ou use o formulÃ¡rio da plataforma.';
    }
  }

  // Verificar se Ã© comando de rastreamento
  if (lowerMessage.includes('rastrear') || lowerMessage.includes('status do frete')) {
    try {
      // Extrair nÃºmero do pedido da mensagem
      const orderNumber = message.match(/FR-\d+-\w+/)?.[0];

      if (orderNumber) {
        const freightOrder = await FreightOrder.findOne({ orderNumber });

        if (freightOrder) {
          const lastEvent = freightOrder.trackingEvents[freightOrder.trackingEvents.length - 1];
          return `ðŸ“¦ **Status do Frete ${orderNumber}:**\n\nðŸš› Status atual: ${freightOrder.status}\nðŸ“ Ãšltima localizaÃ§Ã£o: ${lastEvent?.location?.city || 'NÃ£o informada'}\nðŸ“… Ãšltima atualizaÃ§Ã£o: ${lastEvent?.timestamp?.toLocaleString('pt-BR') || 'NÃ£o disponÃ­vel'}\n\nðŸ’¡ Para mais detalhes, acesse a pÃ¡gina do pedido na plataforma.`;
        } else {
          return 'âŒ Pedido de frete nÃ£o encontrado. Verifique o nÃºmero do pedido.';
        }
      }
    } catch (error) {
      logger.error('Erro ao rastrear frete:', error);
      return 'âŒ Erro ao consultar status do frete. Tente novamente.';
    }
  }

  return null; // NÃ£o Ã© comando especial
}

export default router;
