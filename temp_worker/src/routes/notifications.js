import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import notificationService from '../services/notificationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// Aplicar autenticaÃ§Ã£o em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE NOTIFICAÃ‡Ã•ES =====

// GET /api/notifications - Listar notificaÃ§Ãµes do usuÃ¡rio
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, read, archived = false, type, category } = req.query;

    const result = await notificationService.getUserNotifications(req.user.userId, {
      page: parseInt(page, 10, 10),
      limit: parseInt(limit, 10, 10),
      read: read === 'true' ? true : read === 'false' ? false : null,
      archived: archived === 'true',
      type,
      category
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao buscar notificaÃ§Ãµes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/unread - Contar notificaÃ§Ãµes nÃ£o lidas
router.get('/unread/count', async (req, res) => {
  try {
    const result = await notificationService.getUserNotifications(req.user.userId, {
      read: false,
      archived: false,
      limit: 1
    });

    if (result.success) {
      res.json({
        success: true,
        count: result.data.pagination.total
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao contar notificaÃ§Ãµes nÃ£o lidas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/:id - Obter notificaÃ§Ã£o especÃ­fica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Buscar notificaÃ§Ã£o especÃ­fica do usuÃ¡rio
    const result = await notificationService.getUserNotifications(userId, {
      limit: 1000 // Buscar todas para encontrar a especÃ­fica
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const notification = result.data.notifications.find(n => n._id.toString() === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'NotificaÃ§Ã£o nÃ£o encontrada'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Erro ao buscar notificaÃ§Ã£o:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/notifications/:id/read - Marcar como lida
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const result = await notificationService.markAsRead(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao marcar como lida:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/notifications/:id/archive - Arquivar notificaÃ§Ã£o
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const result = await notificationService.archiveNotification(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao arquivar notificaÃ§Ã£o:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/notifications/read-all - Marcar todas como lidas
router.patch('/read-all', async (req, res) => {
  try {
    const { userId } = req.user;

    // Buscar todas as notificaÃ§Ãµes nÃ£o lidas
    const result = await notificationService.getUserNotifications(userId, {
      read: false,
      archived: false,
      limit: 1000
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Marcar todas como lidas
    const { notifications } = result.data;
    const updatePromises = notifications.map(notification => notification.markAsRead());

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `${notifications.length} notificaÃ§Ãµes marcadas como lidas`,
      count: notifications.length
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao marcar todas como lidas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/notifications/:id - Deletar notificaÃ§Ã£o
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Buscar notificaÃ§Ã£o
    const result = await notificationService.getUserNotifications(userId, {
      limit: 1000
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const notification = result.data.notifications.find(n => n._id.toString() === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'NotificaÃ§Ã£o nÃ£o encontrada'
      });
    }

    // Deletar notificaÃ§Ã£o
    await notification.deleteOne();

    res.json({
      success: true,
      message: 'NotificaÃ§Ã£o deletada com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao deletar notificaÃ§Ã£o:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/notifications/clear-read - Limpar notificaÃ§Ãµes lidas
router.delete('/clear-read', async (req, res) => {
  try {
    const { userId } = req.user;

    // Buscar todas as notificaÃ§Ãµes lidas
    const result = await notificationService.getUserNotifications(userId, {
      read: true,
      archived: false,
      limit: 1000
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Deletar todas as lidas
    const { notifications } = result.data;
    const deletePromises = notifications.map(notification => notification.deleteOne());

    await Promise.all(deletePromises);

    res.json({
      success: true,
      message: `${notifications.length} notificaÃ§Ãµes lidas removidas`,
      count: notifications.length
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao limpar notificaÃ§Ãµes lidas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/stats - EstatÃ­sticas das notificaÃ§Ãµes
router.get('/stats/overview', async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await notificationService.getNotificationStats(userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter estatÃ­sticas:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN (APENAS PARA ADMINISTRADORES) =====

// Middleware para verificar se Ã© admin
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// GET /api/notifications/admin/all - Listar todas as notificaÃ§Ãµes (admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, type, category, status } = req.query;

    // Construir query
    const query = {};
    if (userId) {
      query.userId = userId;
    }
    if (type) {
      query.type = type;
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      if (status === 'read') {
        query.read = true;
      } else if (status === 'unread') {
        query.read = false;
      } else if (status === 'archived') {
        query.archived = true;
      }
    }

    const skip = (parseInt(page, 10, 10) - 1) * parseInt(limit, 10, 10);

    // Buscar notificaÃ§Ãµes
    const notifications = await notificationService.getUserNotifications(null, {
      limit: 1000
    });

    if (!notifications.success) {
      return res.status(400).json(notifications);
    }

    const { total } = notifications.data.pagination;

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page, 10, 10),
          limit: parseInt(limit, 10, 10),
          total,
          pages: Math.ceil(total / parseInt(limit, 10, 10))
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao buscar todas as notificaÃ§Ãµes:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/notifications/admin/send - Enviar notificaÃ§Ã£o manual (admin)
router.post('/admin/send', adminAuth, async (req, res) => {
  try {
    const { userId, type, title, body, channels, priority, category, data, metadata } = req.body;

    if (!userId || !type || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'userId, type, title e body sÃ£o obrigatÃ³rios'
      });
    }

    const result = await notificationService.createAndSendNotification({
      userId,
      type,
      title,
      body,
      channels,
      priority,
      category,
      data,
      metadata
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao enviar notificaÃ§Ã£o manual:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/admin/stats - EstatÃ­sticas gerais (admin)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const result = await notificationService.getNotificationStats();

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter estatÃ­sticas gerais:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/notifications/admin/cleanup - Limpeza manual (admin)
router.post('/admin/cleanup', adminAuth, async (req, res) => {
  try {
    const result = await notificationService.cleanupExpiredNotifications();

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao fazer limpeza manual:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
