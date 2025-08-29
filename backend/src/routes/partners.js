import express from 'express';
import Partner from '../models/Partner.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import { sanitizeInput } from '../utils/sanitizer.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE VALIDAÇÃO =====

// Validação para criação/atualização de parceiros
const validatePartnerData = (req, res, next) => {
  const { name, description, category, industry, contact } = req.body;
  
  if (!name || !description || !category) {
    return res.status(400).json({
      success: false,
      message: 'Nome, descrição e categoria são obrigatórios'
    });
  }

  // Validar tamanhos
  if (name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Nome deve ter entre 2 e 100 caracteres'
    });
  }

  if (description.trim().length < 10 || description.trim().length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Descrição deve ter entre 10 e 2000 caracteres'
    });
  }

  // Validar categoria
  const validCategories = ['technology', 'agriculture', 'finance', 'logistics', 'marketing', 'research', 'other'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Categoria inválida'
    });
  }

  // Validar email se fornecido
  if (contact && contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }
  }

  next();
};

// ===== ROTAS PÚBLICAS =====

// GET /api/partners - Listar todos os parceiros
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, featured, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    
    // Filtrar por categoria
    if (category) query.category = category;
    
    // Filtrar por status
    if (status) query.status = status;
    
    // Filtrar por destaque
    if (featured === 'true') query.isFeatured = true;
    
    // Busca por texto
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const partners = await Partner.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Partner.countDocuments(query);

    res.json({
      success: true,
      data: {
        partners,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partners/featured - Obter parceiros em destaque
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const partners = await Partner.find({
      isFeatured: true,
      status: 'active'
    })
      .sort({ partnershipLevel: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: { partners }
    });
  } catch (error) {
    console.error('Error fetching featured partners:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partners/categories - Obter categorias disponíveis
router.get('/categories', async (req, res) => {
  try {
    const categories = await Partner.distinct('category');
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching partner categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/partners/:id - Obter parceiro específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    // Verificar se o parceiro está ativo
    if (partner.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    res.json({
      success: true,
      data: { partner }
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN (PROTEGIDAS) =====

// POST /api/partners - Criar novo parceiro (admin only)
router.post('/', authenticateToken, requireAdmin, validatePartnerData, async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      logo,
      category,
      industry,
      founded,
      employees,
      location,
      contact,
      services,
      certifications,
      partnershipLevel,
      notes
    } = req.body;

    // Sanitizar inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      description: sanitizeInput(description),
      website: website ? sanitizeInput(website) : undefined,
      logo: logo ? sanitizeInput(logo) : undefined,
      category: sanitizeInput(category),
      industry: industry ? sanitizeInput(industry) : undefined,
      founded: founded ? parseInt(founded) : undefined,
      employees: employees || undefined,
      location: location ? {
        country: sanitizeInput(location.country || 'Brasil'),
        state: location.state ? sanitizeInput(location.state) : undefined,
        city: location.city ? sanitizeInput(location.city) : undefined
      } : undefined,
      contact: contact ? {
        email: contact.email ? sanitizeInput(contact.email).toLowerCase() : undefined,
        phone: contact.phone ? sanitizeInput(contact.phone) : undefined,
        contactPerson: contact.contactPerson ? sanitizeInput(contact.contactPerson) : undefined
      } : undefined,
      services: services ? services.map(service => sanitizeInput(service)) : [],
      certifications: certifications || [],
      partnershipLevel: partnershipLevel || 'bronze',
      notes: notes ? sanitizeInput(notes) : undefined,
      createdBy: req.user.userId
    };

    // Criar parceiro
    const partner = new Partner(sanitizedData);
    await partner.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'Admin created partner', req, req.user.userId, {
      partnerId: partner._id,
      partnerName: partner.name
    });

    res.status(201).json({
      success: true,
      message: 'Parceiro criado com sucesso',
      data: { partner }
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    
    await createSecurityLog('system_error', 'high', `Error creating partner: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/partners/:id - Atualizar parceiro (admin only)
router.put('/:id', authenticateToken, requireAdmin, validatePartnerData, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    // Sanitizar e atualizar campos
    if (updateData.name) partner.name = sanitizeInput(updateData.name);
    if (updateData.description) partner.description = sanitizeInput(updateData.description);
    if (updateData.website !== undefined) partner.website = updateData.website ? sanitizeInput(updateData.website) : undefined;
    if (updateData.logo !== undefined) partner.logo = updateData.logo ? sanitizeInput(updateData.logo) : undefined;
    if (updateData.category) partner.category = sanitizeInput(updateData.category);
    if (updateData.industry !== undefined) partner.industry = updateData.industry ? sanitizeInput(updateData.industry) : undefined;
    if (updateData.founded !== undefined) partner.founded = updateData.founded ? parseInt(updateData.founded) : undefined;
    if (updateData.employees !== undefined) partner.employees = updateData.employees;
    if (updateData.location) {
      partner.location = {
        country: sanitizeInput(updateData.location.country || 'Brasil'),
        state: updateData.location.state ? sanitizeInput(updateData.location.state) : undefined,
        city: updateData.location.city ? sanitizeInput(updateData.location.city) : undefined
      };
    }
    if (updateData.contact) {
      partner.contact = {
        email: updateData.contact.email ? sanitizeInput(updateData.contact.email).toLowerCase() : undefined,
        phone: updateData.contact.phone ? sanitizeInput(updateData.contact.phone) : undefined,
        contactPerson: updateData.contact.contactPerson ? sanitizeInput(updateData.contact.contactPerson) : undefined
      };
    }
    if (updateData.services) partner.services = updateData.services.map(service => sanitizeInput(service));
    if (updateData.certifications) partner.certifications = updateData.certifications;
    if (updateData.partnershipLevel) partner.partnershipLevel = updateData.partnershipLevel;
    if (updateData.status) partner.status = updateData.status;
    if (updateData.notes !== undefined) partner.notes = updateData.notes ? sanitizeInput(updateData.notes) : undefined;

    await partner.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'Admin updated partner', req, req.user.userId, {
      partnerId: partner._id,
      partnerName: partner.name
    });

    res.json({
      success: true,
      message: 'Parceiro atualizado com sucesso',
      data: { partner }
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    
    await createSecurityLog('system_error', 'high', `Error updating partner: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/partners/:id - Excluir parceiro (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    // Soft delete - marcar como inativo
    partner.status = 'inactive';
    await partner.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'Admin deactivated partner', req, req.user.userId, {
      partnerId: partner._id,
      partnerName: partner.name
    });

    res.json({
      success: true,
      message: 'Parceiro desativado com sucesso'
    });
  } catch (error) {
    console.error('Error deactivating partner:', error);
    
    await createSecurityLog('system_error', 'high', `Error deactivating partner: ${error.message}`, req, req.user?.userId);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/partners/:id/feature - Alternar destaque do parceiro (admin only)
router.put('/:id/feature', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    partner.isFeatured = !partner.isFeatured;
    await partner.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'low', `Admin toggled partner featured status`, req, req.user.userId, {
      partnerId: partner._id,
      partnerName: partner.name,
      isFeatured: partner.isFeatured
    });

    res.json({
      success: true,
      message: `Parceiro ${partner.isFeatured ? 'destacado' : 'removido dos destaques'} com sucesso`,
      data: { isFeatured: partner.isFeatured }
    });
  } catch (error) {
    console.error('Error toggling partner featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/partners/:id/level - Atualizar nível de parceria (admin only)
router.put('/:id/level', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { partnershipLevel } = req.body;

    if (!partnershipLevel) {
      return res.status(400).json({
        success: false,
        message: 'Nível de parceria é obrigatório'
      });
    }

    const validLevels = ['bronze', 'silver', 'gold', 'platinum'];
    if (!validLevels.includes(partnershipLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Nível de parceria inválido'
      });
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Parceiro não encontrado'
      });
    }

    partner.partnershipLevel = partnershipLevel;
    await partner.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'medium', 'Admin updated partner level', req, req.user.userId, {
      partnerId: partner._id,
      partnerName: partner.name,
      newLevel: partnershipLevel
    });

    res.json({
      success: true,
      message: 'Nível de parceria atualizado com sucesso',
      data: { partnershipLevel: partner.partnershipLevel }
    });
  } catch (error) {
    console.error('Error updating partner level:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE ESTATÍSTICAS =====

// GET /api/partners/admin/stats - Estatísticas dos parceiros (admin only)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [statusStats, categoryStats, levelStats] = await Promise.all([
      Partner.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Partner.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]),
      Partner.aggregate([
        {
          $group: {
            _id: '$partnershipLevel',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const totalPartners = await Partner.countDocuments();
    const activePartners = await Partner.countDocuments({ status: 'active' });
    const featuredPartners = await Partner.countDocuments({ isFeatured: true, status: 'active' });

    res.json({
      success: true,
      data: {
        total: totalPartners,
        active: activePartners,
        featured: featuredPartners,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byCategory: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byLevel: levelStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching partner stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
