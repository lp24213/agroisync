import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { PartnershipMessage } from '../models/PartnershipMessage.js';
import { Partner } from '../models/Partner.js';

const router = Router();

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
};

// GET /api/admin/dashboard - Dashboard do admin
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getAdminStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dashboard do admin'
    });
  }
});

// GET /api/admin/users - Listar todos os usuários
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
});

// GET /api/admin/users/:id - Obter usuário específico
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário'
    });
  }
});

// PUT /api/admin/users/:id - Atualizar usuário
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remover campos sensíveis
    delete updateData.passwordHash;
    delete updateData.email; // Email não pode ser alterado
    
    const user = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário'
    });
  }
});

// DELETE /api/admin/users/:id - Deletar usuário
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar usuário'
    });
  }
});

// GET /api/admin/messages/contact - Mensagens de contato
router.get('/messages/contact', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens de contato'
    });
  }
});

// GET /api/admin/messages/partnerships - Mensagens de parcerias
router.get('/messages/partnerships', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await PartnershipMessage.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching partnership messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens de parcerias'
    });
  }
});

// GET /api/admin/messages/private - Mensagens privadas
router.get('/messages/private', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens privadas'
    });
  }
});

// POST /api/admin/partners - Criar novo parceiro
router.post('/partners', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, website, logo, category } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Nome e descrição são obrigatórios'
      });
    }
    
    const partner = new Partner({
      name,
      description,
      website,
      logo,
      category,
      createdBy: req.user.id
    });
    
    await partner.save();
    
    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar parceiro'
    });
  }
});

// Função para obter estatísticas do admin
const getAdminStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalConversations = await Conversation.countDocuments();
    const totalContactMessages = await ContactMessage.countDocuments();
    const totalPartnershipMessages = await PartnershipMessage.countDocuments();
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      messages: {
        conversations: totalConversations,
        contact: totalContactMessages,
        partnerships: totalPartnershipMessages
      }
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return {};
  }
};

export default router;
