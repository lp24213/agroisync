import logger from '../utils/logger.js';

/**
 * Serviço de Webhooks para eventos de email
 */
class EmailWebhookService {
  constructor() {
    this.webhookUrl = process.env.EMAIL_WEBHOOK_URL || null;
    this.webhookSecret = process.env.EMAIL_WEBHOOK_SECRET || null;
  }

  /**
   * Disparar webhook para evento de email
   * @param {Object} env - Environment (banco de dados)
   * @param {string} event - Tipo de evento (email.sent, email.received, email.deleted, etc)
   * @param {Object} data - Dados do evento
   */
  async triggerWebhook(env, event, data) {
    if (!this.webhookUrl) {
      logger.debug('Webhook URL não configurada, ignorando evento:', event);
      return { success: false, reason: 'webhook_not_configured' };
    }

    try {
      // Salvar evento no banco para histórico
      await this.saveWebhookEvent(env, event, data);

      // Disparar webhook HTTP
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data
      };

      // Assinar payload se houver secret
      if (this.webhookSecret) {
        payload.signature = this.generateSignature(JSON.stringify(payload));
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Agroisync-EmailWebhook/1.0',
          ...(this.webhookSecret && { 'X-Webhook-Secret': this.webhookSecret })
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
      });

      if (!response.ok) {
        throw new Error(`Webhook retornou status ${response.status}`);
      }

      logger.info(`Webhook disparado com sucesso: ${event}`, { accountId: data.accountId });
      return { success: true, status: response.status };
    } catch (error) {
      logger.error(`Erro ao disparar webhook ${event}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Salvar evento de webhook no banco para histórico
   * @private
   */
  async saveWebhookEvent(env, event, data) {
    try {
      if (!env.DB) {
        return; // Banco não disponível
      }

      const eventId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      await env.DB.prepare(`
        INSERT INTO email_webhook_events (
          id, event_type, payload, status, created_at
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        eventId,
        event,
        JSON.stringify(data),
        'pending',
        now
      ).run();

      logger.debug(`Evento de webhook salvo: ${event}`);
    } catch (error) {
      logger.warn('Erro ao salvar evento de webhook no banco:', error);
      // Não falhar se não conseguir salvar
    }
  }

  /**
   * Gerar assinatura HMAC para webhook
   * @private
   */
  generateSignature(payload) {
    // Implementação simplificada - em produção usar crypto nativo
    const encoder = new TextEncoder();
    const data = encoder.encode(payload + this.webhookSecret);
    // Em produção, usar crypto.subtle para HMAC-SHA256
    return btoa(String.fromCharCode(...new Uint8Array(data)));
  }

  /**
   * Listar eventos de webhook (para admin)
   */
  async listWebhookEvents(env, limit = 50, offset = 0) {
    try {
      if (!env.DB) {
        return { success: false, error: 'Database not available' };
      }

      const events = await env.DB.prepare(`
        SELECT id, event_type, payload, status, created_at
        FROM email_webhook_events
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();

      return {
        success: true,
        events: events.results || [],
        total: events.results?.length || 0
      };
    } catch (error) {
      logger.error('Erro ao listar eventos de webhook:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailWebhookService();

