import express from 'express';
import { body, validationResult } from 'express-validator';
import Client from '../models/Client.js';
import User from '../models/User.js';
import { authenticateToken, adminAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { getClientIP } from '../utils/ipUtils.js';
import { createSecurityLog } from '../utils/securityLogger.js';
import { logSecurityEvent } from '../services/auditService.js';
import {
  validateReceitaFederal,
  validateAddressIBGE,
  validateRequiredDocuments
} from '../middleware/documentValidation.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware de validaÃ§Ã£o para criaÃ§Ã£o/atualizaÃ§Ã£o de cliente
const validateClientData = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email invÃ¡lido'),
  body('cpfCnpj').trim().isLength({ min: 11, max: 18 }).withMessage('CPF/CNPJ invÃ¡lido'),
  body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Telefone invÃ¡lido'),
  body('address.street').trim().isLength({ min: 5, max: 200 }).withMessage('EndereÃ§o invÃ¡lido'),
  body('address.city').trim().isLength({ min: 2, max: 100 }).withMessage('Cidade invÃ¡lida'),
  body('address.state').trim().isLength({ min: 2, max: 2 }).withMessage('Estado invÃ¡lido'),
  body('address.zipCode').trim().isLength({ min: 8, max: 9 }).withMessage('CEP invÃ¡lido'),
  body('documents').isArray({ min: 1 }).withMessage('Pelo menos um documento Ã© obrigatÃ³rio')
];

// GET /api/clients - Listar clientes (admin vÃª todos, usuÃ¡rio vÃª apenas os seus)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = {};

    // Se nÃ£o for admin, sÃ³ mostra os clientes do usuÃ¡rio
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
    logger.error('Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/clients/:id - Obter cliente especÃ­fico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('userId', 'name email');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente nÃ£o encontrado'
      });
    }

    // Verificar se usuÃ¡rio tem permissÃ£o para ver este cliente
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
    logger.error('Erro ao obter cliente:', error);
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
      // Verificar erros de validaÃ§Ã£o
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      // Verificar se CPF/CNPJ jÃ¡ existe
      const existingClient = await Client.findOne({ cpfCnpj: req.body.cpfCnpj });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'CPF/CNPJ jÃ¡ cadastrado'
        });
      }

      // Verificar se email jÃ¡ existe
      const existingEmail = await Client.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email jÃ¡ cadastrado'
        });
      }

      // Criar cliente
      const clientData = {
        ...req.body,
        userId: req.user._id
      };

      const client = new Client(clientData);
      await client.save();

      // Log de seguranÃ§a
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
      logger.error('Erro ao criar cliente:', error);
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
      // Verificar erros de validaÃ§Ã£o
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente nÃ£o encontrado'
        });
      }

      // Verificar se usuÃ¡rio tem permissÃ£o para editar este cliente
      if (!req.user.isAdmin && client.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se CPF/CNPJ jÃ¡ existe em outro cliente
      if (req.body.cpfCnpj && req.body.cpfCnpj !== client.cpfCnpj) {
        const existingClient = await Client.findOne({ cpfCnpj: req.body.cpfCnpj });
        if (existingClient) {
          return res.status(400).json({
            success: false,
            message: 'CPF/CNPJ jÃ¡ cadastrado'
          });
        }
      }

      // Verificar se email jÃ¡ existe em outro cliente
      if (req.body.email && req.body.email !== client.email) {
        const existingEmail = await Client.findOne({ email: req.body.email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email jÃ¡ cadastrado'
          });
        }
      }

      // Atualizar cliente
      const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      // Log de seguranÃ§a
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
      logger.error('Erro ao atualizar cliente:', error);
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
        message: 'Cliente nÃ£o encontrado'
      });
    }

    // Verificar se usuÃ¡rio tem permissÃ£o para deletar este cliente
    if (!req.user.isAdmin && client.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    // Log de seguranÃ§a
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
    logger.error('Erro ao deletar cliente:', error);
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
        message: 'Cliente nÃ£o encontrado'
      });
    }

    client.isDocumentValidated = true;
    await client.save();

    // Log de seguranÃ§a
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
    logger.error('Erro ao validar documentos:', error);
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
        message: 'Status de pagamento invÃ¡lido'
      });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente nÃ£o encontrado'
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

    // Log de seguranÃ§a
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
    logger.error('Erro ao verificar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/clients/stats/overview - EstatÃ­sticas gerais (admin)
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
    logger.error('Erro ao obter estatÃ­sticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
