import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Product } from '../models/Product.js';
import { Freight } from '../models/Freight.js';
import { Payment } from '../models/Payment.js';
import { AuditLog } from '../models/AuditLog.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import jwt from "jsonwebtoken";
import { validateAdminAction } from "../middleware/adminValidation.js";

const router = express.Router();

// Apply rate limiting mais restritivo para admin
router.use(apiLimiter);
router.use(requireAdmin);

// Credenciais fixas do admin (em produção, usar process.env)
const ADMIN_EMAIL = "luispaulodeoliveira@agrotm.com.br";
const ADMIN_PASSWORD = "Th@ys15221008";

// ===== LOGIN ADMIN =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação das credenciais fixas
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Gerar JWT Admin exclusivo
      const token = jwt.sign(
        { 
          role: "admin", 
          email: ADMIN_EMAIL,
          isAdmin: true 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "12h" }
      );

      // Log do login bem-sucedido
      await AuditLog.logAction({
        userId: 'admin',
        userEmail: ADMIN_EMAIL,
        action: 'ADMIN_LOGIN_SUCCESS',
        resource: 'admin_panel',
        details: 'Admin login successful',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.json({ 
        success: true, 
        token,
        message: "Login admin realizado com sucesso"
      });
    }

    // Log da tentativa de login falhada
    await AuditLog.logAction({
      userId: 'unknown',
      userEmail: email,
      action: 'ADMIN_LOGIN_FAILED',
      resource: 'admin_panel',
      details: 'Invalid admin credentials attempt',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      isSuspicious: true,
      riskLevel: 'medium'
    });

    return res.status(401).json({ 
      success: false, 
      message: "Credenciais inválidas" 
    });

  } catch (error) {
    console.error("Erro no login admin:", error);
    
    await AuditLog.logAction({
      userId: 'system',
      userEmail: 'system',
      action: 'ADMIN_LOGIN_ERROR',
      resource: 'admin_panel',
      details: `Login error: ${error.message}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorCode: 'LOGIN_ERROR',
      errorMessage: error.message
    });

    return res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
});

// ===== DASHBOARD ADMIN =====
router.get("/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Log do acesso ao dashboard
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'ADMIN_DASHBOARD_ACCESS',
      resource: 'admin_dashboard',
      details: 'Admin dashboard accessed',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Estatísticas gerais da plataforma
    const stats = {
      totalUsers: await User.countDocuments(),
      totalProducts: await Product.countDocuments(),
      totalFreights: await Freight.countDocuments(),
      totalConversations: await Conversation.countDocuments(),
      totalMessages: await Message.countDocuments(),
      recentAuditLogs: await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('action userEmail createdAt ip')
    };

    res.json({ success: true, stats });

  } catch (error) {
    console.error("Erro ao acessar dashboard admin:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao carregar dashboard" 
    });
  }
});

// ===== CONVERSAS ADMIN =====
router.get("/conversations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const conversations = await Conversation.find(query)
      .populate('participants', 'email name')
      .populate('serviceId', 'title price')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Conversation.countDocuments(query);

    res.json({
      success: true,
      conversations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar conversas" 
    });
  }
});

router.get("/conversations/:id/messages", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId: id })
      .populate('senderId', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ conversationId: id });

    res.json({
      success: true,
      messages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar mensagens" 
    });
  }
});

// ===== USUÁRIOS ADMIN =====
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar usuários" 
    });
  }
});

router.put("/users/:id", authenticateToken, requireAdmin, validateAdminAction, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado" 
      });
    }

    switch (action) {
      case 'ban':
        user.status = 'banned';
        user.bannedAt = new Date();
        user.banReason = reason;
        break;
      case 'activate':
        user.status = 'active';
        user.bannedAt = undefined;
        user.banReason = undefined;
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: "Ação inválida" 
        });
    }

    await user.save();

    // Log da ação administrativa
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: `ADMIN_USER_${action.toUpperCase()}`,
      resource: 'user',
      resourceId: id,
      details: `User ${action}ed. Reason: ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ 
      success: true, 
      message: `Usuário ${action === 'ban' ? 'banido' : 'ativado'} com sucesso` 
    });

  } catch (error) {
    console.error("Erro ao modificar usuário:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao modificar usuário" 
    });
  }
});

// ===== PRODUTOS ADMIN =====
router.get("/products", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate('sellerId', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar produtos" 
    });
  }
});

// ===== FRETES ADMIN =====
router.get("/freights", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const freights = await Freight.find(query)
      .populate('ownerId', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Freight.countDocuments(query);

    res.json({
      success: true,
      freights,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar fretes:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar fretes" 
    });
  }
});

// ===== PAGAMENTOS ADMIN =====
router.get("/payments", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar pagamentos" 
    });
  }
});

// ===== LOGS DE AUDITORIA ADMIN =====
router.get("/auditlogs", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 100, action, userId, suspicious } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (suspicious === 'true') query.isSuspicious = true;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });

  } catch (error) {
    console.error("Erro ao buscar logs de auditoria:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao buscar logs de auditoria" 
    });
  }
});

// ===== EXPORTAÇÃO DE DADOS =====
router.post("/export", authenticateToken, requireAdmin, validateAdminAction, async (req, res) => {
  try {
    const { dataType, format, filters } = req.body;

    // Log da tentativa de exportação
    await AuditLog.logAction({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'ADMIN_DATA_EXPORT',
      resource: 'data_export',
      details: `Export attempt: ${dataType} in ${format}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // TODO: Implementar lógica de exportação real
    res.json({ 
      success: true, 
      message: "Exportação solicitada. Será processada em background." 
    });

  } catch (error) {
    console.error("Erro na exportação:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro na exportação" 
    });
  }
});

export default router;
