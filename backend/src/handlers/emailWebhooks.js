import { json } from '../utils/respond.js';
import emailWebhookService from '../services/emailWebhookService.js';
import logger from '../utils/logger.js';

/**
 * Listar eventos de webhook (apenas admin)
 * GET /api/admin/email/webhooks
 */
export async function listWebhookEvents(request, env) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const result = await emailWebhookService.listWebhookEvents(env, limit, offset);

    if (!result.success) {
      return json({ error: result.error || 'Erro ao listar eventos' }, { status: 500 });
    }

    return json({
      success: true,
      events: result.events.map(evt => ({
        ...evt,
        payload: typeof evt.payload === 'string' ? JSON.parse(evt.payload) : evt.payload
      })),
      total: result.total
    });
  } catch (error) {
    logger.error('Erro ao listar eventos de webhook:', error);
    return json({ error: error.message || 'Erro ao listar eventos' }, { status: 500 });
  }
}

/**
 * Testar webhook (apenas admin)
 * POST /api/admin/email/webhooks/test
 */
export async function testWebhook(request, env) {
  try {
    const { event, data } = await request.json();

    if (!event) {
      return json({ error: 'event é obrigatório' }, { status: 400 });
    }

    const result = await emailWebhookService.triggerWebhook(env, event, data || {
      test: true,
      timestamp: new Date().toISOString()
    });

    return json({
      success: result.success,
      message: result.success 
        ? 'Webhook disparado com sucesso' 
        : `Erro ao disparar webhook: ${result.error || result.reason}`,
      details: result
    });
  } catch (error) {
    logger.error('Erro ao testar webhook:', error);
    return json({ error: error.message || 'Erro ao testar webhook' }, { status: 500 });
  }
}

