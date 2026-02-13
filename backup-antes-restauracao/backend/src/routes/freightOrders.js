
import { Router } from '@agroisync/router';
import { authenticateToken } from '../middleware/auth.js';
import { generateId, now } from '../utils/d1-helper.js';

const router = new Router();

/**
 * @swagger
 * /api/freight-orders:
 *   post:
 *     summary: Criar novo pedido de frete
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - origin
 *               - destination
 *               - pickupDate
 *               - deliveryDateEstimate
 *               - items
 *               - pricing
 *             properties:
 *               sellerId:
 *                 type: string
 *               origin:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                   contact:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *               destination:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                   contact:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *               pickupDate:
 *                 type: string
 *                 format: date
 *               deliveryDateEstimate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     volume:
 *                       type: number
 *                     value:
 *                       type: number
 *                     category:
 *                       type: string
 *                       enum: [grain, livestock, equipment, fertilizer, other]
 *               pricing:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                   additionalFees:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         description:
 *                           type: string
 *                   currency:
 *                     type: string
 *                     default: BRL
 *     responses:
 *       201:
 *         description: Pedido de frete criado com sucesso
 *       400:
 *         description: Dados invÃ¡lidos
 */
// Criar novo pedido de frete (adaptado para Worker + D1)
router.post('/freight-orders', authenticateToken, async (request, env) => {
  try {
    const data = await request.json();
    // Validação básica manual
    if (!data.sellerId || !data.origin || !data.destination || !data.pickupDate || !data.deliveryDateEstimate || !data.items || !data.pricing || !data.pricing.basePrice) {
      return new Response(JSON.stringify({ success: false, message: 'Dados obrigatórios ausentes' }), { status: 400 });
    }
    const id = generateId('freightorder');
    const createdAt = now();
    // Exemplo de insert simplificado (ajuste os campos conforme o schema D1 real)
    await env.DB.prepare(`INSERT INTO freight_orders (id, buyer_id, seller_id, origin, destination, pickup_date, delivery_date_estimate, items, pricing, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', ?)`)
      .bind(
        id,
        request.user.id,
        data.sellerId,
        JSON.stringify(data.origin),
        JSON.stringify(data.destination),
        data.pickupDate,
        data.deliveryDateEstimate,
        JSON.stringify(data.items),
        JSON.stringify(data.pricing),
        createdAt
      ).run();
    // Notificação por e-mail pode ser adaptada para Resend aqui se desejado
    return new Response(JSON.stringify({
      success: true,
      message: 'Pedido de frete criado com sucesso',
      data: { id }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

/**
 * @swagger
 * /api/freight-orders/{id}/tracking:
 *   post:
 *     summary: Atualizar rastreamento do frete
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - location
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, picked_up, in_transit, delayed, delivered, exception]
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *               description:
 *                 type: string
 *               metadata:
 *                 type: object
 *                 properties:
 *                   driver:
 *                     type: string
 *                   vehicle:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   documents:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Rastreamento atualizado com sucesso
 *       404:
 *         description: Pedido de frete nÃ£o encontrado
 */
router.post(
  '/:id/tracking',
  auth,
  [
    body('status')
      .isIn(['accepted', 'picked_up', 'in_transit', 'delayed', 'delivered', 'exception'])
      .withMessage('Status invÃ¡lido'),
    body('location').isObject().withMessage('LocalizaÃ§Ã£o Ã© obrigatÃ³ria')
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

      const { id } = req.params;
      const { status, location, description, metadata } = req.body;
      const userId = req.user.id;

      const freightOrder = await FreightOrder.findById(id);
      if (!freightOrder) {
        return res.status(404).json({
          success: false,
          message: 'Pedido de frete nÃ£o encontrado'
        });
      }

      // Verificar se o usuÃ¡rio tem permissÃ£o para atualizar
      if (
        freightOrder.carrierId?.toString() !== userId &&
        freightOrder.buyerId?.toString() !== userId &&
        freightOrder.sellerId?.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Sem permissÃ£o para atualizar este pedido'
        });
      }

      // Adicionar evento de rastreamento
      await freightOrder.addTrackingEvent(status, location, description, metadata);

      // Enviar notificaÃ§Ãµes para partes envolvidas
      const parties = [freightOrder.buyerId, freightOrder.sellerId];
      if (freightOrder.carrierId) {
        parties.push(freightOrder.carrierId);
      }

      for (const partyId of parties) {
        if (partyId && partyId.toString() !== userId) {
          const party = await User.findById(partyId);
          if (party) {
            await emailService.sendTrackingUpdateNotification({
              to: party.email,
              name: party.name,
              orderNumber: freightOrder.orderNumber,
              status,
              location,
              description
            });
          }
        }
      }

      logger.info(`Rastreamento atualizado para pedido ${freightOrder.orderNumber}: ${status}`);

      res.status(200).json({
        success: true,
        message: 'Rastreamento atualizado com sucesso',
        data: {
          freightOrder: {
            id: freightOrder._id,
            orderNumber: freightOrder.orderNumber,
            status: freightOrder.status,
            trackingEvents: freightOrder.trackingEvents
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao atualizar rastreamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/freight-orders/{id}/ai-closure:
 *   post:
 *     summary: Iniciar fechamento assistido por IA
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fechamento assistido por IA iniciado
 *       404:
 *         description: Pedido de frete nÃ£o encontrado
 */
router.post('/:id/ai-closure', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const freightOrder = await FreightOrder.findById(id);
    if (!freightOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pedido de frete nÃ£o encontrado'
      });
    }

    // Verificar se o usuÃ¡rio tem permissÃ£o
    if (
      freightOrder.buyerId?.toString() !== userId &&
      freightOrder.sellerId?.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para fechar este pedido'
      });
    }

    // Verificar se o pedido estÃ¡ entregue
    if (freightOrder.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Pedido deve estar entregue para iniciar fechamento'
      });
    }

    // Gerar anÃ¡lise de IA (obtÃ©m instÃ¢ncia de forma segura via factory)
    const aiService = getOpenAIService();
    const aiAnalysis = aiService
      ? await aiService.generateFreightClosureSummary(freightOrder)
      : {
          summary: 'Pedido de frete concluÃ­do com sucesso.',
          suggestedMessage: 'Obrigado pela confianÃ§a em nossos serviÃ§os!',
          invoiceDraft: 'Fatura serÃ¡ gerada automaticamente.'
        };

    // Atualizar pedido com anÃ¡lise de IA
    freightOrder.aiClosure = {
      ...aiAnalysis,
      isCompleted: false
    };
    await freightOrder.save();

    logger.info(`Fechamento assistido por IA iniciado para pedido ${freightOrder.orderNumber}`);

    res.status(200).json({
      success: true,
      message: 'Fechamento assistido por IA iniciado',
      data: {
        freightOrder: {
          id: freightOrder._id,
          orderNumber: freightOrder.orderNumber,
          aiClosure: freightOrder.aiClosure
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao iniciar fechamento assistido por IA:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/freight-orders/{id}/complete-closure:
 *   post:
 *     summary: Completar fechamento do pedido
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmClosure:
 *                 type: boolean
 *               customMessage:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fechamento completado com sucesso
 *       404:
 *         description: Pedido de frete nÃ£o encontrado
 */
router.post(
  '/:id/complete-closure',
  auth,
  [
    body('confirmClosure').isBoolean().withMessage('ConfirmaÃ§Ã£o de fechamento Ã© obrigatÃ³ria'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('AvaliaÃ§Ã£o deve ser entre 1 e 5')
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

      const { id } = req.params;
      const { confirmClosure, customMessage, rating, comment } = req.body;
      const userId = req.user.id;

      const freightOrder = await FreightOrder.findById(id);
      if (!freightOrder) {
        return res.status(404).json({
          success: false,
          message: 'Pedido de frete nÃ£o encontrado'
        });
      }

      // Verificar se o usuÃ¡rio tem permissÃ£o
      if (
        freightOrder.buyerId?.toString() !== userId &&
        freightOrder.sellerId?.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Sem permissÃ£o para fechar este pedido'
        });
      }

      if (!confirmClosure) {
        return res.status(400).json({
          success: false,
          message: 'Fechamento nÃ£o confirmado'
        });
      }

      // Completar fechamento
      const finalMessage = customMessage || freightOrder.aiClosure.suggestedMessage;
      await freightOrder.completeAIClosure(
        freightOrder.aiClosure.summary,
        freightOrder.aiClosure.performanceMetrics,
        finalMessage,
        freightOrder.aiClosure.invoiceDraft
      );

      // Adicionar avaliaÃ§Ã£o se fornecida
      if (rating && comment) {
        const userType = freightOrder.buyerId?.toString() === userId ? 'buyer' : 'seller';
        await freightOrder.rateUser(userType, rating, comment, userId);
      }

      logger.info(`Pedido de frete ${freightOrder.orderNumber} fechado com sucesso`);

      res.status(200).json({
        success: true,
        message: 'Fechamento completado com sucesso',
        data: {
          freightOrder: {
            id: freightOrder._id,
            orderNumber: freightOrder.orderNumber,
            status: freightOrder.status,
            aiClosure: freightOrder.aiClosure,
            rating: freightOrder.rating
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao completar fechamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/freight-orders:
 *   get:
 *     summary: Listar pedidos de frete do usuÃ¡rio
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, picked_up, in_transit, delivered, closed, cancelled]
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [buyer, seller, carrier]
 *     responses:
 *       200:
 *         description: Lista de pedidos de frete
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, role } = req.query;

    let query = {};

    if (role === 'buyer') {
      query.buyerId = userId;
    } else if (role === 'seller') {
      query.sellerId = userId;
    } else if (role === 'carrier') {
      query.carrierId = userId;
    } else {
      // Buscar todos os pedidos onde o usuÃ¡rio estÃ¡ envolvido
      query = {
        $or: [{ buyerId: userId }, { sellerId: userId }, { carrierId: userId }]
      };
    }

    if (status) {
      query.status = status;
    }

    const freightOrders = await FreightOrder.find(query)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('carrierId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        freightOrders: freightOrders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          origin: order.origin,
          destination: order.destination,
          pickupDate: order.pickupDate,
          deliveryDateEstimate: order.deliveryDateEstimate,
          deliveryDateActual: order.deliveryDateActual,
          items: order.items,
          pricing: order.pricing,
          buyer: order.buyerId,
          seller: order.sellerId,
          carrier: order.carrierId,
          trackingEvents: order.trackingEvents,
          aiClosure: order.aiClosure,
          rating: order.rating,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }))
      }
    });
  } catch (error) {
    logger.error('Erro ao listar pedidos de frete:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/freight-orders/{id}:
 *   get:
 *     summary: Obter detalhes de um pedido de frete
 *     tags: [FreightOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do pedido de frete
 *       404:
 *         description: Pedido de frete nÃ£o encontrado
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const freightOrder = await FreightOrder.findById(id)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .populate('carrierId', 'name email phone');

    if (!freightOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pedido de frete nÃ£o encontrado'
      });
    }

    // Verificar se o usuÃ¡rio tem permissÃ£o para ver
    if (
      freightOrder.buyerId?._id.toString() !== userId &&
      freightOrder.sellerId?._id.toString() !== userId &&
      freightOrder.carrierId?._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para visualizar este pedido'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        freightOrder: {
          id: freightOrder._id,
          orderNumber: freightOrder.orderNumber,
          status: freightOrder.status,
          origin: freightOrder.origin,
          destination: freightOrder.destination,
          pickupDate: freightOrder.pickupDate,
          deliveryDateEstimate: freightOrder.deliveryDateEstimate,
          deliveryDateActual: freightOrder.deliveryDateActual,
          items: freightOrder.items,
          pricing: freightOrder.pricing,
          vehicle: freightOrder.vehicle,
          documents: freightOrder.documents,
          trackingEvents: freightOrder.trackingEvents,
          aiClosure: freightOrder.aiClosure,
          rating: freightOrder.rating,
          notifications: freightOrder.notifications,
          buyer: freightOrder.buyerId,
          seller: freightOrder.sellerId,
          carrier: freightOrder.carrierId,
          createdAt: freightOrder.createdAt,
          updatedAt: freightOrder.updatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao obter pedido de frete:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
