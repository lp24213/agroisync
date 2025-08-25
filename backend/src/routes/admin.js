import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Freight } from '../models/Freight.js';
import { Payment } from '../models/Payment.js';
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAdmin, validateAdminAction } from '../middleware/adminAuth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Credenciais fixas do admin
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';
const ADMIN_PASSWORD = 'Th@ys15221008';

// Login do admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      await AuditLog.logAction({
        userId: 'unknown',
        userEmail: email,
        action: 'ADMIN_LOGIN_FAILED',
        resource: '/api/admin/login',
        details: 'Invalid admin credentials',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        isSuspicious: true,
        riskLevel: 'HIGH'
      });
      
      return res.status(401).json({ 
        error: 'Credenciais inválidas.' 
      });
    }
    
    const adminToken = jwt.sign(
      { 
        email: ADMIN_EMAIL, 
        role: 'admin',
        timestamp: Date.now()
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    await AuditLog.logAction({
      userId: 'admin',
      userEmail: ADMIN_EMAIL,
      action: 'ADMIN_LOGIN_SUCCESS',
      resource: '/api/admin/login',
      details: 'Admin login successful',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      isSuspicious: false,
      riskLevel: 'LOW'
    });
    
    res.json({ 
      success: true, 
      adminToken,
      message: 'Login administrativo realizado com sucesso.' 
    });
  } catch (error) {
    console.error('Erro no login admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Dashboard admin (protegido)
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const stats = await AuditLog.getStats();
    
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalFreights = await Freight.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const recentAuditLogs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('action userEmail ip createdAt riskLevel');
    
    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalFreights,
        totalConversations,
        totalMessages,
        ...stats
      },
      recentAuditLogs
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar todas as conversas (protegido)
router.get('/conversations', requireAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'name email')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });
    
    res.json({ conversations });
  } catch (error) {
    console.error('Erro ao listar conversas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar todos os usuários (protegido)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('name email phone createdAt lastLogin ipAddress')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar todos os produtos (protegido)
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ products });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar todos os fretes (protegido)
router.get('/freights', requireAdmin, async (req, res) => {
  try {
    const freights = await Freight.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ freights });
  } catch (error) {
    console.error('Erro ao listar fretes:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar todos os pagamentos (protegido)
router.get('/payments', requireAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ payments });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Listar logs de auditoria (protegido)
router.get('/auditlogs', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, riskLevel, action } = req.query;
    
    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel;
    if (action) filter.action = action;
    
    const auditLogs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AuditLog.countDocuments(filter);
    
    res.json({ 
      auditLogs, 
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erro ao listar logs de auditoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Exportar dados (protegido)
router.post('/export', requireAdmin, validateAdminAction, async (req, res) => {
  try {
    const { action, reason } = req.adminAction;
    
    await AuditLog.logAction({
      userId: req.admin.email,
      userEmail: req.admin.email,
      action: 'ADMIN_EXPORT',
      resource: '/api/admin/export',
      details: `Export action: ${action}, Reason: ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      isSuspicious: false,
      riskLevel: 'LOW'
    });
    
    // Aqui você pode implementar a lógica de exportação
    res.json({ 
      message: 'Exportação solicitada com sucesso.',
      action,
      reason
    });
  } catch (error) {
    console.error('Erro na exportação:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;
