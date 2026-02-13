import { Router } from '@agroisync/router';
import { authenticateToken } from '../middleware/auth.js';
import { generateId, now } from '../utils/d1-helper.js';

const router = new Router();

// Middleware para verificar se o usuÃ¡rio tem acesso Ã  mensageria
const checkMessagingAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verificar se o usuÃ¡rio tem plano ativo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    // Verificar se tem plano ativo ou pagamento recente
    const hasActivePlan =
      user.subscriptions &&
      ((user.subscriptions.store && user.subscriptions.store.status === 'active') ||
        (user.subscriptions.agroconecta && user.subscriptions.agroconecta.status === 'active'));

    // Verificar pagamentos recentes (Ãºltimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPayment = await Payment.findOne({
      userId,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (!hasActivePlan && !recentPayment) {
      return res.status(403).json({
        success: false,
        message: 'ðŸ”’ Para acessar esta mensageria, finalize o pagamento de sua assinatura.',
        requiresPayment: true,
        plans: {
          store: 'R$25/mÃªs - Mensageria de Produtos',
          agroconecta: 'R$50/mÃªs - Mensageria de Fretes'
        }
      });
    }

    req.userHasAccess = true;
    return next();
  } catch {
    // Erro ao verificar acesso Ã  mensageria
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// ===== ROTAS DE MENSAGERIA =====


// Enviar mensagem (adaptado para Worker + D1)
router.post('/messages', authenticateToken, async (request, env) => {
  try {
    const data = await request.json();
    const { destinatarioId, tipo, servicoId, conteudo } = data;
    const remetenteId = request.user.id;
    if (!destinatarioId || !tipo || !servicoId || !conteudo) {
      return new Response(JSON.stringify({ success: false, message: 'Todos os campos são obrigatórios' }), { status: 400 });
    }
    if (!['product', 'freight'].includes(tipo)) {
      return new Response(JSON.stringify({ success: false, message: "Tipo deve ser 'product' ou 'freight'" }), { status: 400 });
    }
    if (conteudo.trim().length === 0 || conteudo.length > 2000) {
      return new Response(JSON.stringify({ success: false, message: 'Conteúdo deve ter entre 1 e 2000 caracteres' }), { status: 400 });
    }
    // Verificar se destinatário existe
    const destinatario = await env.DB.prepare('SELECT id, email FROM users WHERE id = ?').bind(destinatarioId).first();
    if (!destinatario) {
      return new Response(JSON.stringify({ success: false, message: 'Destinatário não encontrado' }), { status: 404 });
    }
    // Verificar se serviço existe (produto ou frete)
    let servico;
    if (tipo === 'product') {
      servico = await env.DB.prepare('SELECT id, user_id, title, price FROM products WHERE id = ?').bind(servicoId).first();
      if (!servico || servico.user_id !== destinatarioId) {
        return new Response(JSON.stringify({ success: false, message: 'Sem permissão para enviar mensagem para este produto' }), { status: 403 });
      }
    } else {
      servico = await env.DB.prepare('SELECT id, provider_id, origin_city, destination_city, freight_value FROM freights WHERE id = ?').bind(servicoId).first();
      if (!servico || servico.provider_id !== destinatarioId) {
        return new Response(JSON.stringify({ success: false, message: 'Sem permissão para enviar mensagem para este frete' }), { status: 403 });
      }
    }
    // Criar metadados
    const metadata = tipo === 'product'
      ? { productTitle: servico.title, productPrice: servico.price }
      : { freightOrigin: servico.origin_city, freightDestination: servico.destination_city, freightPrice: servico.freight_value };
    // Salvar mensagem
    const id = generateId('msg');
    const createdAt = now();
    await env.DB.prepare('INSERT INTO messages (id, remetente, destinatario, conteudo, tipo, servico_id, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, remetenteId, destinatarioId, conteudo.trim(), tipo, servicoId, JSON.stringify(metadata), createdAt).run();
    return new Response(JSON.stringify({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: { id, remetente: remetenteId, destinatario: destinatarioId, conteudo, tipo, servicoId, metadata, createdAt }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
});

// GET /api/messages - Listar mensagens do usuÃ¡rio

// Listar mensagens do usuário autenticado (Worker + D1)
router.get('/messages', authenticateToken, async (request, env) => {
  try {
    const url = new URL(request.url);
    const userId = request.user.id;
    const tipo = url.searchParams.get('tipo');
    const servicoId = url.searchParams.get('servicoId');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    let where = '(remetente = ? OR destinatario = ?)';
    let params = [userId, userId];
    if (tipo) {
      where += ' AND tipo = ?';
      params.push(tipo);
    }
    if (servicoId) {
      where += ' AND servico_id = ?';
      params.push(servicoId);
    }

    // Buscar mensagens
    const sql = `SELECT * FROM messages WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const messages = (await env.DB.prepare(sql).bind(...params, limit, offset).all()).results;
    // Contar total
    const countSql = `SELECT COUNT(*) as total FROM messages WHERE ${where}`;
    const total = (await env.DB.prepare(countSql).bind(...params).first()).total;

    return new Response(JSON.stringify({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro interno do servidor',
      details: error.message
    }), { status: 500 });
  }
});

// GET /api/messages/conversations - Listar conversas do usuÃ¡rio

// Listar conversas do usuário autenticado (Worker + D1)
router.get('/messages/conversations', authenticateToken, async (request, env) => {
  try {
    const url = new URL(request.url);
    const userId = request.user.id;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    // Buscar todas as mensagens do usuário
    const allMessages = (await env.DB.prepare(`
      SELECT * FROM messages WHERE remetente = ? OR destinatario = ?
    `).bind(userId, userId).all()).results;

    // Agrupar conversas por outro usuário, tipo e serviço
    const convMap = new Map();
    for (const msg of allMessages) {
      const otherUser = msg.remetente === userId ? msg.destinatario : msg.remetente;
      const key = `${otherUser}|${msg.tipo}|${msg.servico_id}`;
      if (!convMap.has(key)) {
        convMap.set(key, {
          otherUser,
          tipo: msg.tipo,
          servico_id: msg.servico_id,
          lastMessage: msg,
          messageCount: 1,
          unreadCount: (msg.destinatario === userId && ['sent', 'delivered'].includes(msg.status)) ? 1 : 0
        });
      } else {
        const conv = convMap.get(key);
        // Atualiza último se necessário
        if (msg.created_at > conv.lastMessage.created_at) conv.lastMessage = msg;
        conv.messageCount++;
        if (msg.destinatario === userId && ['sent', 'delivered'].includes(msg.status)) conv.unreadCount++;
      }
    }
    // Ordenar por data da última mensagem
    const conversations = Array.from(convMap.values()).sort((a, b) => b.lastMessage.created_at.localeCompare(a.lastMessage.created_at));
    // Paginar
    const paged = conversations.slice(offset, offset + limit);
    // Total
    const total = conversations.length;

    return new Response(JSON.stringify({
      success: true,
      data: {
        conversations: paged,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro interno do servidor',
      details: error.message
    }), { status: 500 });
  }
});

// GET /api/messages/conversation/:otherUserId/:tipo/:servicoId - Obter conversa especÃ­fica
router.get(
  '/conversation/:otherUserId/:tipo/:servicoId',
  authenticateToken,
  checkMessagingAccess,
  async (req, res) => {
    try {
      const { otherUserId, tipo, servicoId } = req.params;
      const userId = req.user.id;
      const { page = 1, limit = 100 } = req.query;
      const skip = (page - 1) * limit;

      // Verificar se o outro usuÃ¡rio existe
      const otherUser = await User.findById(otherUserId);
      if (!otherUser) {
        return res.status(404).json({
          success: false,
          message: 'UsuÃ¡rio nÃ£o encontrado'
        });
      }

      // Buscar mensagens da conversa
      const messages = await Message.findConversation(userId, otherUserId, tipo, servicoId)
        .populate('remetente', 'name email')
        .populate('destinatario', 'name email')
        .skip(skip)
        .limit(parseInt(limit, 10, 10));

      // Contar total
      const total = await Message.countDocuments({
        $or: [
          { remetente: userId, destinatario: otherUserId },
          { remetente: otherUserId, destinatario: userId }
        ],
        tipo,
        servico_id: servicoId,
        deletedAt: { $exists: false }
      });

      // Marcar mensagens como lidas
      await Message.updateMany(
        {
          destinatario: userId,
          remetente: otherUserId,
          tipo,
          servico_id: servicoId,
          status: { $in: ['sent', 'delivered'] }
        },
        { status: 'read' }
      );

      res.json({
        success: true,
        data: {
          messages,
          otherUser: {
            id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email
          },
          pagination: {
            page: parseInt(page, 10, 10),
            limit: parseInt(limit, 10, 10),
            total,
            pages: Math.ceil(total / parseInt(limit, 10, 10))
          }
        }
      });
    } catch (error) {
      // Erro ao buscar conversa

      await AuditLog.logAction({
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'CONVERSATION_FETCH_ERROR',
        resource: 'message',
        details: `Error fetching conversation: ${error.message}`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        errorCode: 'FETCH_ERROR',
        errorMessage: error.message
      });

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// PUT /api/messages/:messageId/read - Marcar mensagem como lida
router.put('/:messageId/read', authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio Ã© o destinatÃ¡rio
    if (message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para marcar esta mensagem como lida'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch {
    // Erro ao marcar mensagem como lida
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/messages/:messageId - Deletar mensagem (soft delete)
router.delete('/:messageId', authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio Ã© o remetente ou destinatÃ¡rio
    if (message.remetente.toString() !== userId && message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para deletar esta mensagem'
      });
    }

    await message.softDelete(userId);

    // Log da aÃ§Ã£o
    await AuditLog.logAction({
      userId,
      userEmail: req.user.email,
      action: 'MESSAGE_DELETED',
      resource: 'message',
      resourceId: messageId,
      details: 'Message soft deleted by user',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    });
  } catch {
    // Erro ao deletar mensagem
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/messages/:messageId/report - Reportar mensagem
router.post('/:messageId/report', authenticateToken, checkMessagingAccess, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Motivo deve ter pelo menos 10 caracteres'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem nÃ£o encontrada'
      });
    }

    // Verificar se o usuÃ¡rio Ã© o destinatÃ¡rio
    if (message.destinatario.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissÃ£o para reportar esta mensagem'
      });
    }

    await message.report(reason.trim());

    // Log da aÃ§Ã£o
    await AuditLog.logAction({
      userId,
      userEmail: req.user.email,
      action: 'MESSAGE_REPORTED',
      resource: 'message',
      resourceId: messageId,
      details: `Message reported: ${reason}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Mensagem reportada com sucesso'
    });
  } catch {
    // Erro ao reportar mensagem
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/stats - EstatÃ­sticas das mensagens do usuÃ¡rio

// Estatísticas das mensagens do usuário (Worker + D1)
router.get('/messages/stats', authenticateToken, async (request, env) => {
  try {
    const userId = request.user.id;
    // Total de mensagens
    const total = (await env.DB.prepare('SELECT COUNT(*) as total FROM messages WHERE remetente = ? OR destinatario = ?').bind(userId, userId).first()).total;
    // Não lidas
    const unread = (await env.DB.prepare("SELECT COUNT(*) as unread FROM messages WHERE destinatario = ? AND status IN ('sent','delivered')").bind(userId).first()).unread;
    // Lidas
    const read = (await env.DB.prepare("SELECT COUNT(*) as read FROM messages WHERE destinatario = ? AND status = 'read'").bind(userId).first()).read;
    return new Response(JSON.stringify({
      success: true,
      data: { total, unread, read }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro interno do servidor',
      details: error.message
    }), { status: 500 });
  }
});

export default router;
