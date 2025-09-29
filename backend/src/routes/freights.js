import express from 'express';
import Freight from '../models/Freight.js';
import User from '../models/User.js';
import { validateFreight } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, requireActivePlan } from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// GET /api/freights - Get all freights with pagination and filters
router.get('/', async (req, res) => {
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
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Build query
    const query = { status: 'active' };

    if (originCity) {
      query['origin.city'] = { $regex: originCity, $options: 'i' };
    }
    if (originState) {
      query['origin.state'] = { $regex: originState, $options: 'i' };
    }
    if (destCity) {
      query['destination.city'] = { $regex: destCity, $options: 'i' };
    }
    if (destState) {
      query['destination.state'] = { $regex: destState, $options: 'i' };
    }
    if (cargoType) {
      query.cargoType = cargoType;
    }
    if (minWeight || maxWeight) {
      query.weight = {};
      if (minWeight) {
        query.weight.min = { $gte: parseFloat(minWeight) };
      }
      if (maxWeight) {
        query.weight.max = { $lte: parseFloat(maxWeight) };
      }
    }
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const freights = await Freight.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('providerId', 'name company.name phone')
      .lean();

    // Get total count for pagination
    const total = await Freight.countDocuments(query);

    res.json({
      success: true,
      data: {
        freights,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching freights:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
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
      parseInt(limit, 10)
    );

    res.json({
      success: true,
      data: { freights }
    });
  } catch (error) {
    console.error('Error searching freights by route:', error);
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

    const freights = await Freight.findByCargoType(cargoType, parseInt(limit, 10));

    res.json({
      success: true,
      data: { freights }
    });
  } catch (error) {
    console.error('Error fetching freights by cargo type:', error);
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

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const freights = await Freight.findAvailable(filters, parseInt(limit, 10), skip);

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
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching available freights:', error);
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
        message: 'Frete não encontrado'
      });
    }

    if (freight.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Frete não disponível'
      });
    }

    // Increment view count (async, don't wait)
    Freight.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    res.json({
      success: true,
      data: { freight }
    });
  } catch (error) {
    console.error('Error fetching freight:', error);
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
        message: 'Usuário não encontrado'
      });
    }

    if (!user.hasActivePlan('freight')) {
      return res.status(403).json({
        success: false,
        message: 'Plano de frete não ativo. Ative um plano para criar fretes.'
      });
    }

    if (!user.canCreateFreight()) {
      return res.status(403).json({
        success: false,
        message: 'Limite de fretes atingido. Faça upgrade do seu plano.'
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
    console.error('Error creating freight:', error);

    if (error.message.includes('Plano de frete não ativo')) {
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
        message: 'Frete não encontrado'
      });
    }

    // Check if user owns the freight
    if (freight.providerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode editar seus próprios fretes.'
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
    console.error('Error updating freight:', error);
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
        message: 'Frete não encontrado'
      });
    }

    // Check if user owns the freight
    if (freight.providerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode excluir seus próprios fretes.'
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
    console.error('Error deleting freight:', error);
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
        message: 'Frete não encontrado'
      });
    }

    if (freight.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Frete não disponível'
      });
    }

    // Check if user is not contacting themselves
    if (freight.providerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode enviar consulta para si mesmo'
      });
    }

    // Add inquiry to freight
    await freight.addInquiry(userId, message);

    res.json({
      success: true,
      message: 'Consulta enviada com sucesso para o prestador de frete'
    });
  } catch (error) {
    console.error('Error sending inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/freights/:id/inquiry/:inquiryId/respond - Respond to inquiry
router.put('/:id/inquiry/:inquiryId/respond', authenticateToken, async (req, res) => {
  try {
    const { id, inquiryId } = req.params;
    const { status } = req.body;

    if (!['responded', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const freight = await Freight.findById(id);
    if (!freight) {
      return res.status(404).json({
        success: false,
        message: 'Frete não encontrado'
      });
    }

    // Check if user owns the freight
    if (freight.providerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode responder consultas dos seus fretes.'
      });
    }

    // Respond to inquiry
    await freight.respondToInquiry(inquiryId, status);

    res.json({
      success: true,
      message: 'Resposta enviada com sucesso'
    });
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/provider/my-freights - Get provider's own freights
router.get('/provider/my-freights', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = { providerId: userId };
    if (status) {
      query.status = status;
    }

    const freights = await Freight.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await Freight.countDocuments(query);

    res.json({
      success: true,
      data: {
        freights,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching provider freights:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/cargo-types - Get all cargo types
router.get('/cargo/types', async (req, res) => {
  try {
    const cargoTypes = await Freight.distinct('cargoType');

    res.json({
      success: true,
      data: { cargoTypes }
    });
  } catch (error) {
    console.error('Error fetching cargo types:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/freights/vehicle-types - Get all vehicle types
router.get('/vehicle/types', async (req, res) => {
  try {
    const vehicleTypes = await Freight.distinct('vehicleType');

    res.json({
      success: true,
      data: { vehicleTypes }
    });
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
