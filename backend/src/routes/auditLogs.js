import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import auditService from '../services/auditService.js';
import { captureSessionInfo, captureRequestMetadata } from '../middleware/sessionCapture.js';

const router = express.Router();

// Middleware para capturar informações de sessão
router.use(captureSessionInfo);
router.use(captureRequestMetadata);

/**
 * @route GET /api/audit-logs
 * @desc Obter logs de auditoria do usuário
 * @access Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const logs = await auditService.getUserAuditLogs(req.user.id, parseInt(limit, 10));

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: logs.length
      }
    });
  } catch (error) {
    console.error('Erro ao obter logs de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/audit-logs/pii-access
 * @desc Obter logs de acesso a dados PII
 * @access Private (Admin)
 */
router.get('/pii-access', adminAuth, async (req, res) => {
  try {
    const { userId, limit = 100 } = req.query;

    const logs = await auditService.getPIIAccessLogs(userId || null, parseInt(limit, 10));

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Erro ao obter logs de acesso PII:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/audit-logs/stats
 * @desc Obter estatísticas de auditoria
 * @access Private (Admin)
 */
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Data de início e fim são obrigatórias'
      });
    }

    const stats = await auditService.getAuditStats(new Date(startDate), new Date(endDate));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/audit-logs/expiring
 * @desc Obter logs próximos do vencimento
 * @access Private (Admin)
 */
router.get('/expiring', adminAuth, async (req, res) => {
  try {
    const logs = await auditService.getExpiringLogs();

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Erro ao obter logs próximos do vencimento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route POST /api/audit-logs/export
 * @desc Exportar logs de auditoria
 * @access Private (Admin)
 */
router.post('/export', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, userId, action, resource, containsPII } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Data de início e fim são obrigatórias'
      });
    }

    const logs = await auditService.exportAuditLogs({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId,
      action,
      resource,
      containsPII
    });

    res.json({
      success: true,
      data: logs,
      exportedAt: new Date(),
      totalRecords: logs.length
    });
  } catch (error) {
    console.error('Erro ao exportar logs de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route DELETE /api/audit-logs/cleanup
 * @desc Limpar logs expirados
 * @access Private (Admin)
 */
router.delete('/cleanup', adminAuth, async (req, res) => {
  try {
    const deletedCount = await auditService.cleanExpiredLogs();

    res.json({
      success: true,
      message: `${deletedCount} logs expirados foram removidos`,
      deletedCount
    });
  } catch (error) {
    console.error('Erro ao limpar logs expirados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/audit-logs/:id/verify
 * @desc Verificar integridade de um log específico
 * @access Private (Admin)
 */
router.get('/:id/verify', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isValid = await auditService.verifyLogIntegrity(id);

    res.json({
      success: true,
      data: {
        logId: id,
        isValid
      }
    });
  } catch (error) {
    console.error('Erro ao verificar integridade do log:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/audit-logs/:id
 * @desc Obter detalhes de um log específico
 * @access Private (Admin)
 */
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Importar modelo AuditLog
    const AuditLog = (await import('../models/AuditLog.js')).default;
    const log = await AuditLog.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log não encontrado'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Erro ao obter log específico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
