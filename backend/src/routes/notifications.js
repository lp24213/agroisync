import express from 'express';
import auth from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// Aplicar autenticação em todas as rotas
router.use(auth);

// ===== ROTAS DE NOTIFICAÇÕES =====

// GET /api/notifications - Listar notificações do usuário
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      read,
      archived = false,
      type,
      category
    } = req.query;

    const result = await notificationService.getUserNotifications(
      req.user.userId,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        read: read === 'true' ? true : read === 'false' ? false : null,
        archived: archived === 'true',
        type,
        category
      }
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/unread - Contar notificações não lidas
router.get('/unread/count', async (req, res) => {
  try {
    const result = await notificationService.getUserNotifications(
      req.user.userId,
      { read: false, archived: false, limit: 1 }
    );

    if (result.success) {
      res.json({
        success: true,
        count: result.data.pagination.total
      });
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao contar notificações não lidas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/:id - Obter notificação específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Buscar notificação específica do usuário
    const result = await notificationService.getUserNotifications(userId, {
      limit: 1000 // Buscar todas para encontrar a específica
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const notification = result.data.notifications.find(n => n._id.toString() === id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Erro ao buscar notificação:', error);
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
    const userId = req.user.userId;

    const result = await notificationService.markAsRead(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao marcar como lida:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/notifications/:id/archive - Arquivar notificação
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await notificationService.archiveNotification(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao arquivar notificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/notifications/read-all - Marcar todas como lidas
router.patch('/read-all', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar todas as notificações não lidas
    const result = await notificationService.getUserNotifications(userId, {
      read: false,
      archived: false,
      limit: 1000
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Marcar todas como lidas
    const notifications = result.data.notifications;
    const updatePromises = notifications.map(notification => 
      notification.markAsRead()
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `${notifications.length} notificações marcadas como lidas`,
      count: notifications.length
    });

  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/notifications/:id - Deletar notificação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Buscar notificação
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
        message: 'Notificação não encontrada'
      });
    }

    // Deletar notificação
    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notificação deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/notifications/clear-read - Limpar notificações lidas
router.delete('/clear-read', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar todas as notificações lidas
    const result = await notificationService.getUserNotifications(userId, {
      read: true,
      archived: false,
      limit: 1000
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Deletar todas as lidas
    const notifications = result.data.notifications;
    const deletePromises = notifications.map(notification => 
      notification.deleteOne()
    );

    await Promise.all(deletePromises);

    res.json({
      success: true,
      message: `${notifications.length} notificações lidas removidas`,
      count: notifications.length
    });

  } catch (error) {
    console.error('Erro ao limpar notificações lidas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/stats - Estatísticas das notificações
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await notificationService.getNotificationStats(userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS ADMIN (APENAS PARA ADMINISTRADORES) =====

// Middleware para verificar se é admin
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// GET /api/notifications/admin/all - Listar todas as notificações (admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      type,
      category,
      status
    } = req.query;

    // Construir query
    const query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) {
      if (status === 'read') query.read = true;
      else if (status === 'unread') query.read = false;
      else if (status === 'archived') query.archived = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar notificações
    const notifications = await notificationService.getUserNotifications(null, {
      limit: 1000
    });

    if (!notifications.success) {
      return res.status(400).json(notifications);
    }

    const total = notifications.data.pagination.total;

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar todas as notificações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/notifications/admin/send - Enviar notificação manual (admin)
router.post('/admin/send', adminAuth, async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      body,
      channels,
      priority,
      category,
      data,
      metadata
    } = req.body;

    if (!userId || !type || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'userId, type, title e body são obrigatórios'
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
    console.error('Erro ao enviar notificação manual:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/notifications/admin/stats - Estatísticas gerais (admin)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const result = await notificationService.getNotificationStats();

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error);
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
    console.error('Erro ao fazer limpeza manual:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
