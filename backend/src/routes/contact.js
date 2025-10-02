import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import PartnershipMessage from '../models/PartnershipMessage.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import { sanitizeInput } from '../utils/sanitizer.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// ===== MIDDLEWARE DE VALIDAÇÃO =====

// Validação para mensagens de contato
const validateContactMessage = (req, res, next) => {
  const { name, email, subject, message, phone, company, category } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Nome, email, assunto e mensagem são obrigatórios'
    });
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  // Validar tamanhos
  if (name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Nome deve ter entre 2 e 100 caracteres'
    });
  }

  if (subject.trim().length < 5 || subject.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Assunto deve ter entre 5 e 200 caracteres'
    });
  }

  if (message.trim().length < 10 || message.trim().length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Mensagem deve ter entre 10 e 2000 caracteres'
    });
  }

  // Validar categoria
  const validCategories = ['general', 'support', 'business', 'technical', 'other'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Categoria inválida'
    });
  }

  next();
};

// Validação para mensagens de parceria
const validatePartnershipMessage = (req, res, next) => {
  const {
    company,
    contactPerson,
    email,
    partnershipType,
    description,
    phone,
    website,
    budget,
    timeline
  } = req.body;

  if (!company || !contactPerson || !email || !partnershipType || !description) {
    return res.status(400).json({
      success: false,
      message: 'Empresa, pessoa de contato, email, tipo de parceria e descrição são obrigatórios'
    });
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  // Validar tamanhos
  if (company.trim().length < 2 || company.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Nome da empresa deve ter entre 2 e 100 caracteres'
    });
  }

  if (contactPerson.trim().length < 2 || contactPerson.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Nome da pessoa de contato deve ter entre 2 e 100 caracteres'
    });
  }

  if (description.trim().length < 20 || description.trim().length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Descrição deve ter entre 20 e 2000 caracteres'
    });
  }

  // Validar tipo de parceria
  const validPartnershipTypes = [
    'technology',
    'distribution',
    'marketing',
    'research',
    'investment',
    'other'
  ];
  if (!validPartnershipTypes.includes(partnershipType)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de parceria inválido'
    });
  }

  // Validar orçamento se fornecido
  if (budget) {
    const validBudgets = [
      'under_10k',
      '10k_50k',
      '50k_100k',
      '100k_500k',
      'over_500k',
      'negotiable'
    ];
    if (!validBudgets.includes(budget)) {
      return res.status(400).json({
        success: false,
        message: 'Orçamento inválido'
      });
    }
  }

  // Validar timeline se fornecido
  if (timeline) {
    const validTimelines = ['immediate', '1_3_months', '3_6_months', '6_12_months', 'over_1_year'];
    if (!validTimelines.includes(timeline)) {
      return res.status(400).json({
        success: false,
        message: 'Timeline inválido'
      });
    }
  }

  next();
};

// ===== ROTAS PÚBLICAS =====

// POST /api/contact - Enviar mensagem de contato
router.post('/', validateContactMessage, async (req, res) => {
  try {
    const { name, email, subject, message, phone, company, category } = req.body;

    // Sanitizar inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      phone: phone ? sanitizeInput(phone) : undefined,
      company: company ? sanitizeInput(company) : undefined,
      category: category || 'general'
    };

    // Criar mensagem de contato
    const contactMessage = new ContactMessage(sanitizedData);
    await contactMessage.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'low', 'Contact message sent', req, null, {
      email: sanitizedData.email,
      category: sanitizedData.category
    });

    res.status(201).json({
      success: true,
      message: 'Mensagem de contato enviada com sucesso',
      data: {
        id: contactMessage._id,
        submittedAt: contactMessage.createdAt
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error sending contact message:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error sending contact message: ${error.message}`,
      req
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/contact/partnership - Enviar solicitação de parceria
router.post('/partnership', validatePartnershipMessage, async (req, res) => {
  try {
    const {
      company,
      contactPerson,
      email,
      partnershipType,
      description,
      phone,
      website,
      budget,
      timeline,
      goals
    } = req.body;

    // Sanitizar inputs
    const sanitizedData = {
      company: sanitizeInput(company),
      contactPerson: sanitizeInput(contactPerson),
      email: sanitizeInput(email).toLowerCase(),
      partnershipType: sanitizeInput(partnershipType),
      description: sanitizeInput(description),
      phone: phone ? sanitizeInput(phone) : undefined,
      website: website ? sanitizeInput(website) : undefined,
      budget: budget || 'negotiable',
      timeline: timeline || '3_6_months',
      goals: goals ? sanitizeInput(goals) : undefined
    };

    // Criar mensagem de parceria
    const partnershipMessage = new PartnershipMessage(sanitizedData);
    await partnershipMessage.save();

    // Log de segurança
    await createSecurityLog('data_modification', 'low', 'Partnership inquiry sent', req, null, {
      email: sanitizedData.email,
      company: sanitizedData.company,
      partnershipType: sanitizedData.partnershipType
    });

    res.status(201).json({
      success: true,
      message: 'Solicitação de parceria enviada com sucesso',
      data: {
        id: partnershipMessage._id,
        submittedAt: partnershipMessage.createdAt
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error sending partnership inquiry:', error);
    }
    await createSecurityLog(
      'system_error',
      'high',
      `Error sending partnership inquiry: ${error.message}`,
      req
    );

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN (PROTEGIDAS) =====

// GET /api/contact/admin/messages - Listar mensagens de contato (admin only)
router.get('/admin/messages', async (req, res) => {
  try {
    // Verificar se é admin (será feito pelo middleware de autenticação)
    const { page = 1, limit = 20, status, category, priority } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (priority) {
      query.priority = priority;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching contact messages:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/contact/admin/partnerships - Listar mensagens de parceria (admin only)
router.get('/admin/partnerships', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, partnershipType, budget } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = {};
    if (status) {
      query.status = status;
    }
    if (partnershipType) {
      query.partnershipType = partnershipType;
    }
    if (budget) {
      query.budget = budget;
    }

    const messages = await PartnershipMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await PartnershipMessage.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching partnership messages:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/contact/admin/messages/:id - Obter mensagem de contato específica
router.get('/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching contact message:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/contact/admin/partnerships/:id - Obter mensagem de parceria específica
router.get('/admin/partnerships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await PartnershipMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem de parceria não encontrada'
      });
    }

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching partnership message:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/contact/admin/messages/:id/status - Atualizar status da mensagem de contato
router.put('/admin/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, assignedTo } = req.body;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Atualizar campos
    if (status) {
      message.status = status;
    }
    if (adminNotes) {
      message.adminNotes = adminNotes;
    }
    if (assignedTo) {
      message.assignedTo = assignedTo;
    }

    // Atualizar timestamps específicos
    if (status === 'read' && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }

    if (status === 'replied' && !message.repliedAt) {
      message.repliedAt = new Date();
    }

    await message.save();

    res.json({
      success: true,
      message: 'Status da mensagem atualizado com sucesso',
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating contact message status:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/contact/admin/partnerships/:id/status - Atualizar status da mensagem de parceria
router.put('/admin/partnerships/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, assignedTo } = req.body;

    const message = await PartnershipMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem de parceria não encontrada'
      });
    }

    // Atualizar campos
    if (status) {
      message.status = status;
    }
    if (adminNotes) {
      message.adminNotes = adminNotes;
    }
    if (assignedTo) {
      message.assignedTo = assignedTo;
    }

    // Atualizar timestamps específicos
    if (status === 'read' && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }

    if (status === 'contacted' && !message.contactedAt) {
      message.contactedAt = new Date();
    }

    await message.save();

    res.json({
      success: true,
      message: 'Status da mensagem de parceria atualizado com sucesso',
      data: { message }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating partnership message status:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/contact/admin/messages/:id - Excluir mensagem de contato
router.delete('/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Mensagem excluída com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error deleting contact message:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/contact/admin/partnerships/:id - Excluir mensagem de parceria
router.delete('/admin/partnerships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await PartnershipMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem de parceria não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Mensagem de parceria excluída com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error deleting partnership message:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE ESTATÍSTICAS =====

// GET /api/contact/admin/stats - Estatísticas das mensagens (admin only)
router.get('/admin/stats', async (req, res) => {
  try {
    const [contactStats, partnershipStats] = await Promise.all([
      ContactMessage.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      PartnershipMessage.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const totalContact = await ContactMessage.countDocuments();
    const totalPartnership = await PartnershipMessage.countDocuments();
    const unreadContact = await ContactMessage.countDocuments({ isRead: false });
    const unreadPartnership = await PartnershipMessage.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: {
        contact: {
          total: totalContact,
          unread: unreadContact,
          byStatus: contactStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {})
        },
        partnership: {
          total: totalPartnership,
          unread: unreadPartnership,
          byStatus: partnershipStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {})
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching contact stats:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
