import express from 'express';
import { body, validationResult } from 'express-validator';
import Client from '../models/Client.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { getClientIP } from '../utils/ipUtils.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import {
  validateReceitaFederal,
  validateAddressIBGE,
  validateRequiredDocuments
} from '../middleware/documentValidation.js';

const router = express.Router();

// Middleware de validação para criação/atualização de cliente
const validateClientData = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('cpfCnpj').trim().isLength({ min: 11, max: 18 }).withMessage('CPF/CNPJ inválido'),
  body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Telefone inválido'),
  body('address.street').trim().isLength({ min: 5, max: 200 }).withMessage('Endereço inválido'),
  body('address.city').trim().isLength({ min: 2, max: 100 }).withMessage('Cidade inválida'),
  body('address.state').trim().isLength({ min: 2, max: 2 }).withMessage('Estado inválido'),
  body('address.zipCode').trim().isLength({ min: 8, max: 9 }).withMessage('CEP inválido'),
  body('documents').isArray({ min: 1 }).withMessage('Pelo menos um documento é obrigatório')
];

// GET /api/clients - Listar clientes (admin vê todos, usuário vê apenas os seus)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = {};

    // Se não for admin, só mostra os clientes do usuário
    if (!req.user.isAdmin) {
      query.userId = req.user._id;
    }

    const clients = await Client.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/clients/:id - Obter cliente específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('userId', 'name email');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Verificar se usuário tem permissão para ver este cliente
    if (!req.user.isAdmin && client.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/clients - Criar novo cliente
router.post(
  '/',
  authenticateToken,
  validateClientData,
  validateReceitaFederal,
  validateAddressIBGE,
  validateRequiredDocuments,
  async (req, res) => {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      // Verificar se CPF/CNPJ já existe
      const existingClient = await Client.findOne({ cpfCnpj: req.body.cpfCnpj });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'CPF/CNPJ já cadastrado'
        });
      }

      // Verificar se email já existe
      const existingEmail = await Client.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      // Criar cliente
      const clientData = {
        ...req.body,
        userId: req.user._id
      };

      const client = new Client(clientData);
      await client.save();

      // Log de segurança
      await logSecurityEvent(
        'client_created',
        req.user._id,
        getClientIP(req),
        req.headers['user-agent'],
        { clientId: client._id }
      );

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: client
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// PUT /api/clients/:id - Atualizar cliente
router.put(
  '/:id',
  authenticateToken,
  validateClientData,
  validateReceitaFederal,
  validateAddressIBGE,
  validateRequiredDocuments,
  async (req, res) => {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Verificar se usuário tem permissão para editar este cliente
      if (!req.user.isAdmin && client.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se CPF/CNPJ já existe em outro cliente
      if (req.body.cpfCnpj && req.body.cpfCnpj !== client.cpfCnpj) {
        const existingClient = await Client.findOne({ cpfCnpj: req.body.cpfCnpj });
        if (existingClient) {
          return res.status(400).json({
            success: false,
            message: 'CPF/CNPJ já cadastrado'
          });
        }
      }

      // Verificar se email já existe em outro cliente
      if (req.body.email && req.body.email !== client.email) {
        const existingEmail = await Client.findOne({ email: req.body.email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email já cadastrado'
          });
        }
      }

      // Atualizar cliente
      const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      // Log de segurança
      await logSecurityEvent(
        'client_updated',
        req.user._id,
        getClientIP(req),
        req.headers['user-agent'],
        { clientId: client._id }
      );

      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: updatedClient
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// DELETE /api/clients/:id - Deletar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Verificar se usuário tem permissão para deletar este cliente
    if (!req.user.isAdmin && client.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    // Log de segurança
    await logSecurityEvent(
      'client_deleted',
      req.user._id,
      getClientIP(req),
      req.headers['user-agent'],
      { clientId: client._id }
    );

    res.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/clients/:id/validate-documents - Validar documentos (admin)
router.patch('/:id/validate-documents', adminAuth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    client.isDocumentValidated = true;
    await client.save();

    // Log de segurança
    await logSecurityEvent(
      'client_documents_validated',
      req.user._id,
      getClientIP(req),
      req.headers['user-agent'],
      { clientId: client._id }
    );

    res.json({
      success: true,
      message: 'Documentos validados com sucesso',
      data: client
    });
  } catch (error) {
    console.error('Erro ao validar documentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/clients/:id/verify-payment - Verificar pagamento (admin)
router.patch('/:id/verify-payment', adminAuth, async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    if (
      !paymentStatus ||
      !['pending', 'approved', 'rejected', 'cancelled'].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Status de pagamento inválido'
      });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    client.paymentStatus = paymentStatus;
    if (transactionId) {
      client.transactionId = transactionId;
    }

    if (paymentStatus === 'approved') {
      client.isPaymentVerified = true;
    }

    await client.save();

    // Log de segurança
    await logSecurityEvent(
      'client_payment_verified',
      req.user._id,
      getClientIP(req),
      req.headers['user-agent'],
      { clientId: client._id, paymentStatus, transactionId }
    );

    res.json({
      success: true,
      message: 'Pagamento verificado com sucesso',
      data: client
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/clients/stats/overview - Estatísticas gerais (admin)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const stats = await Client.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          validated: { $sum: { $cond: ['$isDocumentValidated', 1, 0] } },
          paymentVerified: { $sum: { $cond: ['$isPaymentVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    const paymentStats = await Client.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Client.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, validated: 0, paymentVerified: 0, active: 0 },
        paymentStatus: paymentStats,
        monthlyGrowth: monthlyStats
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
