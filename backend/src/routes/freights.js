import { Router } from '@agroisync/router';
import { authenticateToken, requireActivePlan } from '../middleware/auth.js';
import { validateFreight } from '../middleware/validation.js';
import { generateId, now } from '../utils/d1-helper.js';

const router = new Router();

// GET /api/freights - Get all freights with pagination and filters
// GET /freights - Listar fretes com filtros e paginação
router.get('/freights', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const sql = `SELECT id, title, origin_city, origin_state, dest_city, dest_state, price, weight, created_at
      FROM freights WHERE status = 'active' ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const freights = await req.env.DB.prepare(sql).bind(limit, offset).all();

    const countSql = `SELECT COUNT(*) as total FROM freights WHERE status = 'active'`;
    const countResult = await req.env.DB.prepare(countSql).first();
    const total = countResult?.total || 0;

    res.json({
      success: true,
      data: freights.results || freights,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching freights:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// GET /api/freights/route/:originCity/:originState/:destCity/:destState - Search by route
router.get('/route/:originCity/:originState/:destCity/:destState', async (req, res) => {
  try {
    const { originCity, originState, destCity, destState } = req.params;
    const { limit = 20 } = req.query;

    const freights = await Freight.findByRoute(
      originCity,
      originState,
      destCity,
      destState,
      parseInt(limit, 10, 10)
    );

    res.json({
      success: true,
      data: { freights }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error searching freights by route:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/cargo/:cargoType - Get freights by cargo type
router.get('/cargo/:cargoType', async (req, res) => {
  try {
    const { cargoType } = req.params;
    const { limit = 20 } = req.query;

    const freights = await Freight.findByCargoType(cargoType, parseInt(limit, 10, 10));

    res.json({
      success: true,
      data: { freights }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching freights by cargo type:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/available - Get available freights with advanced filters
router.get('/available', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      originCity,
      originState,
      destCity,
      destState,
      cargoType,
      minWeight,
      maxWeight,
      maxPrice,
      vehicleType
    } = req.query;

    const filters = {};
    if (originCity) {
      filters.originCity = originCity;
    }
    if (originState) {
      filters.originState = originState;
    }
    if (destCity) {
      filters.destCity = destCity;
    }
    if (destState) {
      filters.destState = destState;
    }
    if (cargoType) {
      filters.cargoType = cargoType;
    }
    if (minWeight) {
      filters.minWeight = parseFloat(minWeight);
    }
    if (maxWeight) {
      filters.maxWeight = parseFloat(maxWeight);
    }
    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice);
    }
    if (vehicleType) {
      filters.vehicleType = vehicleType;
    }

    const skip = (parseInt(page, 10, 10) - 1) * parseInt(limit, 10, 10);

    const freights = await Freight.findAvailable(filters, parseInt(limit, 10, 10), skip);

    // Get total count
    const totalQuery = { status: 'active' };
    if (originCity) {
      totalQuery['origin.city'] = { $regex: originCity, $options: 'i' };
    }
    if (originState) {
      totalQuery['origin.state'] = { $regex: originState, $options: 'i' };
    }
    if (destCity) {
      totalQuery['destination.city'] = { $regex: destCity, $options: 'i' };
    }
    if (destState) {
      totalQuery['destination.state'] = { $regex: destState, $options: 'i' };
    }
    if (cargoType) {
      totalQuery.cargoType = cargoType;
    }
    if (vehicleType) {
      totalQuery.vehicleType = vehicleType;
    }

    const total = await Freight.countDocuments(totalQuery);

    res.json({
      success: true,
      data: {
        freights,
        pagination: {
          currentPage: parseInt(page, 10, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching available freights:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/:id - Get freight by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const freight = await Freight.findById(id)
      .populate('providerId', 'name company.name phone')
      .lean();

    if (!freight) {
      return res.status(404).json({
        success: false,
        message: 'Frete nÃ£o encontrado'
      });
    }

    if (freight.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Frete nÃ£o disponÃ­vel'
      });
    }

    // Increment view count (async, don't wait)
    Freight.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    res.json({
      success: true,
      data: { freight }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error fetching freight:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/freights - Create new freight (requires authentication and active freight plan)
router.post('/', authenticateToken, requireActivePlan, validateFreight, async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if user has active freight plan
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    if (!user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano de frete nÃ£o ativo. Ative um plano para criar fretes.'
      });
    }

    if (!user.canCreateFreight()) {
      return res.status(403).json({
        success: false,
        message: 'Limite de fretes atingido. FaÃ§a upgrade do seu plano.'
      });
    }

    // Create freight
    const freightData = {
      ...req.body,
      providerId: userId
    };

    const freight = new Freight(freightData);
    await freight.save();

    res.status(201).json({
      success: true,
      message: 'Frete criado com sucesso',
      data: { freight }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error creating freight:', error);
    }
    if (error.message.includes('Plano de frete nÃ£o ativo')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('Limite de fretes atingido')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/freights/:id - Update freight
router.put('/:id', authenticateToken, validateFreight, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const freight = await Freight.findById(id);
    if (!freight) {
      return res.status(404).json({
        success: false,
        message: 'Frete nÃ£o encontrado'
      });
    }

    // Check if user owns the freight
    if (freight.providerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. VocÃª sÃ³ pode editar seus prÃ³prios fretes.'
      });
    }

    // Update freight
    Object.assign(freight, req.body);
    await freight.save();

    res.json({
      success: true,
      message: 'Frete atualizado com sucesso',
      data: { freight }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error updating freight:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/freights/:id - Delete freight
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const freight = await Freight.findById(id);
    if (!freight) {
      return res.status(404).json({
        success: false,
        message: 'Frete nÃ£o encontrado'
      });
    }

    // Check if user owns the freight
    if (freight.providerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. VocÃª sÃ³ pode excluir seus prÃ³prios fretes.'
      });
    }

    // Soft delete - mark as inactive
    freight.status = 'inactive';
    await freight.save();

    res.json({
      success: true,
      message: 'Frete removido com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error deleting freight:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/freights/:id/inquiry - Send inquiry about freight
router.post('/:id/inquiry', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { message } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem deve ter pelo menos 10 caracteres'
      });
    }

    const freight = await Freight.findById(id);
    if (!freight) {
      return res.status(404).json({
        success: false,
        message: 'Frete nÃ£o encontrado'
      });
    }

    if (freight.providerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Voc\u00ea n\u00e3o pode enviar uma consulta para seu pr\u00f3prio frete'
      });
    }

    // Create inquiry (simplified - you may want to persist this and notify the provider)
    const inquiry = {
      from: userId,
      to: freight.providerId,
      freightId: freight._id,
      message,
      createdAt: new Date()
    };

    // Optionally persist inquiry or send notification here
    logger.info('Freight inquiry created', inquiry);

    res.status(201).json({
      success: true,
      message: 'Consulta enviada com sucesso',
      data: inquiry
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error creating freight inquiry:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }

});

export default router;

