// 🔑 SERVIÇO DE API KEYS - SISTEMA DE MONETIZAÇÃO VIA APIS
// Sistema para VENDER acesso à API Agroisync para clientes externos

const crypto = require('crypto');

class APIKeyService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Gerar API Key única e segura
   */
  generateAPIKey(prefix = 'agroisync') {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}_${randomBytes}`;
  }

  /**
   * Criar nova API Key para cliente
   */
  async createAPIKey(data) {
    const apiKey = this.generateAPIKey();
    const keyId = `apikey_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    // Hash da API Key para segurança (nunca salvar plain text)
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const sql = `
      INSERT INTO api_keys (
        id, api_key_hash, api_key_prefix, user_id, customer_name, customer_email,
        plan_type, rate_limit_per_minute, rate_limit_per_day,
        allowed_endpoints, status, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const apiKeyPrefix = apiKey.substring(0, 20) + '...'; // Salvar só prefixo para identificação
    
    await this.db.prepare(sql).bind(
      keyId,
      hashedKey,
      apiKeyPrefix,
      data.user_id || null,
      data.customer_name,
      data.customer_email,
      data.plan_type || 'basic', // basic, pro, enterprise
      data.rate_limit_per_minute || 60,
      data.rate_limit_per_day || 10000,
      data.allowed_endpoints ? JSON.stringify(data.allowed_endpoints) : JSON.stringify(['all']),
      'active',
      data.expires_at || null,
      new Date().toISOString()
    ).run();
    
    // Registrar transação
    await this.createAPITransaction(data.user_id, data.plan_type, data.price || 0);
    
    return {
      success: true,
      apiKey, // RETORNA SOMENTE UMA VEZ! Cliente deve guardar
      keyId,
      message: '⚠️ ATENÇÃO: Guarde esta chave com segurança! Ela não será mostrada novamente.',
      plan: data.plan_type,
      limits: {
        per_minute: data.rate_limit_per_minute || 60,
        per_day: data.rate_limit_per_day || 10000
      }
    };
  }

  /**
   * Validar API Key
   */
  async validateAPIKey(apiKey) {
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const result = await this.db.prepare(`
      SELECT * FROM api_keys 
      WHERE api_key_hash = ? 
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `).bind(hashedKey).first();
    
    if (!result) {
      return { valid: false, error: 'API Key inválida ou expirada' };
    }
    
    // Verificar rate limit
    const rateLimitOk = await this.checkRateLimit(result.id);
    if (!rateLimitOk) {
      return { valid: false, error: 'Rate limit excedido' };
    }
    
    // Registrar uso
    await this.trackAPIUsage(result.id);
    
    return {
      valid: true,
      keyId: result.id,
      userId: result.user_id,
      planType: result.plan_type,
      allowedEndpoints: JSON.parse(result.allowed_endpoints || '["all"]')
    };
  }

  /**
   * Verificar rate limit
   */
  async checkRateLimit(keyId) {
    const now = new Date();
    const minuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();
    const today = now.toISOString().split('T')[0];
    
    // Buscar API Key
    const apiKey = await this.db.prepare('SELECT * FROM api_keys WHERE id = ?').bind(keyId).first();
    if (!apiKey) return false;
    
    // Contar requests no último minuto
    const minuteCount = await this.db.prepare(`
      SELECT COUNT(*) as count
      FROM api_usage_logs
      WHERE api_key_id = ? AND created_at >= ?
    `).bind(keyId, minuteAgo).first();
    
    if (minuteCount.count >= apiKey.rate_limit_per_minute) {
      return false;
    }
    
    // Contar requests hoje
    const dayCount = await this.db.prepare(`
      SELECT COUNT(*) as count
      FROM api_usage_logs
      WHERE api_key_id = ? AND DATE(created_at) = ?
    `).bind(keyId, today).first();
    
    if (dayCount.count >= apiKey.rate_limit_per_day) {
      return false;
    }
    
    return true;
  }

  /**
   * Registrar uso da API
   */
  async trackAPIUsage(keyId, endpoint = '', method = 'GET', ipAddress = '') {
    const logId = `log_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    await this.db.prepare(`
      INSERT INTO api_usage_logs (id, api_key_id, endpoint, method, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      logId,
      keyId,
      endpoint,
      method,
      ipAddress,
      new Date().toISOString()
    ).run();
    
    // Atualizar contador total
    await this.db.prepare(`
      UPDATE api_keys 
      SET total_requests = total_requests + 1,
          last_used_at = datetime('now')
      WHERE id = ?
    `).bind(keyId).run();
  }

  /**
   * Criar transação de venda de API
   */
  async createAPITransaction(userId, planType, price) {
    const transactionId = `tx_api_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    await this.db.prepare(`
      INSERT INTO transactions (
        id, transaction_type, user_id, amount, currency,
        payment_status, description, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      transactionId,
      'api_subscription',
      userId,
      price,
      'BRL',
      'pending',
      `Assinatura API - Plano ${planType.toUpperCase()}`,
      new Date().toISOString()
    ).run();
    
    return transactionId;
  }

  /**
   * Obter todas as API Keys de um usuário
   */
  async getUserAPIKeys(userId) {
    const result = await this.db.prepare(`
      SELECT id, api_key_prefix, customer_name, plan_type, status,
             rate_limit_per_minute, rate_limit_per_day, total_requests,
             created_at, last_used_at, expires_at
      FROM api_keys
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all();
    
    return result.results || [];
  }

  /**
   * Obter estatísticas de uso de API Key
   */
  async getAPIKeyStats(keyId, startDate = null, endDate = null) {
    let sql = 'SELECT COUNT(*) as total_requests FROM api_usage_logs WHERE api_key_id = ?';
    const params = [keyId];
    
    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(endDate);
    }
    
    const total = await this.db.prepare(sql).bind(...params).first();
    
    // Requests por dia (últimos 30 dias)
    const dailyStats = await this.db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as requests
      FROM api_usage_logs
      WHERE api_key_id = ? AND created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).bind(keyId).all();
    
    // Endpoints mais usados
    const topEndpoints = await this.db.prepare(`
      SELECT endpoint, COUNT(*) as count
      FROM api_usage_logs
      WHERE api_key_id = ?
      GROUP BY endpoint
      ORDER BY count DESC
      LIMIT 10
    `).bind(keyId).all();
    
    return {
      total_requests: total?.total_requests || 0,
      daily_stats: dailyStats.results || [],
      top_endpoints: topEndpoints.results || []
    };
  }

  /**
   * Revogar API Key
   */
  async revokeAPIKey(keyId, reason = 'User requested') {
    await this.db.prepare(`
      UPDATE api_keys
      SET status = 'revoked', revoked_at = datetime('now'), revoked_reason = ?
      WHERE id = ?
    `).bind(reason, keyId).run();
    
    return { success: true, message: 'API Key revogada com sucesso' };
  }

  /**
   * Obter dashboard de APIs do admin
   */
  async getAPIDashboard() {
    // Total de API Keys ativas
    const activeKeys = await this.db.prepare(`
      SELECT COUNT(*) as count FROM api_keys WHERE status = 'active'
    `).first();
    
    // Requests nos últimos 30 dias
    const totalRequests = await this.db.prepare(`
      SELECT COUNT(*) as count
      FROM api_usage_logs
      WHERE created_at >= datetime('now', '-30 days')
    `).first();
    
    // Receita de APIs
    const apiRevenue = await this.db.prepare(`
      SELECT SUM(amount) as total
      FROM transactions
      WHERE transaction_type = 'api_subscription' AND payment_status = 'paid'
    `).first();
    
    // Top clientes
    const topCustomers = await this.db.prepare(`
      SELECT ak.customer_name, ak.plan_type, COUNT(aul.id) as total_requests
      FROM api_keys ak
      LEFT JOIN api_usage_logs aul ON ak.id = aul.api_key_id
      WHERE ak.status = 'active'
      GROUP BY ak.id
      ORDER BY total_requests DESC
      LIMIT 10
    `).all();
    
    return {
      active_keys: activeKeys?.count || 0,
      total_requests: totalRequests?.count || 0,
      api_revenue: apiRevenue?.total || 0,
      top_customers: topCustomers.results || []
    };
  }
}

module.exports = APIKeyService;

