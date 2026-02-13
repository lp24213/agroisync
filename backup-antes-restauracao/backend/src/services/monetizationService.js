// 💰 SERVIÇO DE MONETIZAÇÃO - AGROISYNC
// Sistema completo de anúncios, patrocínios, taxas e comissões

const crypto = require('crypto');

class MonetizationService {
  constructor(db) {
    this.db = db;
  }

  // ================================================================
  // 1. SISTEMA DE ANÚNCIOS/BANNERS
  // ================================================================

  /**
   * Criar novo anúncio
   */
  async createAdvertisement(data) {
    const adId = `ad_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    const sql = `
      INSERT INTO advertisements (
        id, title, description, image_url, link_url,
        ad_type, placement, advertiser_id, advertiser_name, advertiser_email,
        start_date, end_date, price, priority, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.prepare(sql).bind(
      adId,
      data.title,
      data.description || '',
      data.image_url || '',
      data.link_url || '',
      data.ad_type || 'banner',
      data.placement,
      data.advertiser_id,
      data.advertiser_name,
      data.advertiser_email,
      data.start_date,
      data.end_date,
      data.price,
      data.priority || 0,
      data.status || 'pending'
    ).run();
    
    return { success: true, adId, message: 'Anúncio criado com sucesso!' };
  }

  /**
   * Listar anúncios ativos
   */
  async getActiveAdvertisements(placement = null) {
    const now = new Date().toISOString();
    
    let sql = `
      SELECT * FROM advertisements 
      WHERE status = 'active' 
        AND start_date <= ? 
        AND end_date >= ?
    `;
    
    if (placement) {
      sql += ` AND placement = ?`;
    }
    
    sql += ` ORDER BY priority DESC, created_at DESC LIMIT 50`;
    
    const params = placement ? [now, now, placement] : [now, now];
    const result = await this.db.prepare(sql).bind(...params).all();
    
    return result.results || [];
  }

  /**
   * Registrar impressão de anúncio
   */
  async trackImpression(adId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Atualizar contador total
    await this.db.prepare('UPDATE advertisements SET impressions = impressions + 1 WHERE id = ?')
      .bind(adId).run();
    
    // Atualizar métrica diária
    const metricId = `metric_${adId}_${today}`;
    await this.db.prepare(`
      INSERT INTO ad_metrics_daily (id, ad_id, date, impressions, clicks, ctr)
      VALUES (?, ?, ?, 1, 0, 0.0)
      ON CONFLICT(ad_id, date) DO UPDATE SET impressions = impressions + 1
    `).bind(metricId, adId, today).run();
    
    return { success: true };
  }

  /**
   * Registrar clique em anúncio
   */
  async trackClick(adId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Atualizar contador total
    await this.db.prepare('UPDATE advertisements SET clicks = clicks + 1 WHERE id = ?')
      .bind(adId).run();
    
    // Atualizar métrica diária e calcular CTR
    const metricId = `metric_${adId}_${today}`;
    await this.db.prepare(`
      INSERT INTO ad_metrics_daily (id, ad_id, date, impressions, clicks, ctr)
      VALUES (?, ?, ?, 0, 1, 0.0)
      ON CONFLICT(ad_id, date) DO UPDATE SET 
        clicks = clicks + 1,
        ctr = CAST(clicks AS REAL) / CAST(impressions AS REAL) * 100
    `).bind(metricId, adId, today).run();
    
    // Atualizar CTR total do anúncio
    await this.db.prepare(`
      UPDATE advertisements 
      SET ctr = CAST(clicks AS REAL) / CAST(impressions AS REAL) * 100 
      WHERE id = ?
    `).bind(adId).run();
    
    return { success: true };
  }

  // ================================================================
  // 2. SISTEMA DE PATROCÍNIOS
  // ================================================================

  /**
   * Patrocinar item (produto ou frete)
   */
  async sponsorItem(data) {
    const sponsorId = `sponsor_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    const sql = `
      INSERT INTO sponsored_items (
        id, item_id, item_type, user_id, sponsorship_type,
        start_date, end_date, price, payment_status, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.prepare(sql).bind(
      sponsorId,
      data.item_id,
      data.item_type,
      data.user_id,
      data.sponsorship_type || 'featured',
      data.start_date,
      data.end_date,
      data.price,
      data.payment_status || 'pending',
      'active'
    ).run();
    
    // Atualizar flag no item original
    const tableName = data.item_type === 'product' ? 'products' : 'freights';
    await this.db.prepare(`
      UPDATE ${tableName} 
      SET is_sponsored = 1, is_featured = 1, featured_until = ? 
      WHERE id = ?
    `).bind(data.end_date, data.item_id).run();
    
    return { success: true, sponsorId, message: 'Item patrocinado com sucesso!' };
  }

  /**
   * Obter itens patrocinados ativos
   */
  async getSponsoredItems(itemType = null) {
    const now = new Date().toISOString();
    
    let sql = `
      SELECT si.*, 
        CASE 
          WHEN si.item_type = 'product' THEN (SELECT title FROM products WHERE id = si.item_id)
          WHEN si.item_type = 'freight' THEN (SELECT title FROM freights WHERE id = si.item_id)
        END as item_title
      FROM sponsored_items si
      WHERE si.status = 'active'
        AND si.payment_status = 'paid'
        AND si.start_date <= ?
        AND si.end_date >= ?
    `;
    
    if (itemType) {
      sql += ` AND si.item_type = ?`;
    }
    
    sql += ` ORDER BY si.created_at DESC LIMIT 100`;
    
    const params = itemType ? [now, now, itemType] : [now, now];
    const result = await this.db.prepare(sql).bind(...params).all();
    
    return result.results || [];
  }

  // ================================================================
  // 3. SISTEMA DE TAXAS E COMISSÕES
  // ================================================================

  /**
   * Calcular comissão de uma transação
   */
  async calculateCommission(amount, itemType) {
    // Buscar taxa configurada
    const settingKey = `commission_rate_${itemType}`;
    const result = await this.db.prepare('SELECT value FROM monetization_settings WHERE key = ?')
      .bind(settingKey).first();
    
    const rate = result ? parseFloat(result.value) : 0.5; // Default 0.5%
    const commissionAmount = (amount * rate) / 100;
    const netAmount = amount - commissionAmount;
    
    return {
      rate,
      commissionAmount: parseFloat(commissionAmount.toFixed(2)),
      netAmount: parseFloat(netAmount.toFixed(2))
    };
  }

  /**
   * Registrar transação com comissão
   */
  async createTransaction(data) {
    const transactionId = `tx_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    // Calcular comissão
    const commission = await this.calculateCommission(data.amount, data.item_type || 'default');
    
    const sql = `
      INSERT INTO transactions (
        id, transaction_type, user_id, item_id, item_type,
        amount, currency, commission_rate, commission_amount, net_amount,
        payment_method, payment_status, payment_gateway, payment_gateway_id,
        description, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.prepare(sql).bind(
      transactionId,
      data.transaction_type || 'commission',
      data.user_id,
      data.item_id || null,
      data.item_type || null,
      data.amount,
      data.currency || 'BRL',
      commission.rate,
      commission.commissionAmount,
      commission.netAmount,
      data.payment_method || 'pix',
      data.payment_status || 'pending',
      data.payment_gateway || 'asaas',
      data.payment_gateway_id || null,
      data.description || '',
      data.metadata ? JSON.stringify(data.metadata) : '{}'
    ).run();
    
    return { 
      success: true, 
      transactionId, 
      commission,
      message: 'Transação registrada com sucesso!' 
    };
  }

  /**
   * Atualizar status de pagamento
   */
  async updatePaymentStatus(transactionId, status, paymentGatewayId = null) {
    const updates = [status, transactionId];
    let sql = 'UPDATE transactions SET payment_status = ?, updated_at = datetime("now")';
    
    if (paymentGatewayId) {
      sql += ', payment_gateway_id = ?';
      updates.splice(1, 0, paymentGatewayId);
    }
    
    if (status === 'paid') {
      sql += ', paid_at = datetime("now")';
    } else if (status === 'refunded') {
      sql += ', refunded_at = datetime("now")';
    }
    
    sql += ' WHERE id = ?';
    
    await this.db.prepare(sql).bind(...updates).run();
    
    return { success: true, message: `Status atualizado para ${status}` };
  }

  // ================================================================
  // 4. MÉTRICAS E RELATÓRIOS
  // ================================================================

  /**
   * Obter métricas de anúncios
   */
  async getAdMetrics(adId = null, startDate = null, endDate = null) {
    let sql = 'SELECT * FROM ad_metrics_daily WHERE 1=1';
    const params = [];
    
    if (adId) {
      sql += ' AND ad_id = ?';
      params.push(adId);
    }
    
    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }
    
    sql += ' ORDER BY date DESC LIMIT 100';
    
    const result = await this.db.prepare(sql).bind(...params).all();
    return result.results || [];
  }

  /**
   * Obter resumo de receitas
   */
  async getRevenueSummary(startDate = null, endDate = null) {
    let sql = 'SELECT * FROM revenue_summary WHERE 1=1';
    const params = [];
    
    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }
    
    sql += ' ORDER BY date DESC LIMIT 365';
    
    const result = await this.db.prepare(sql).bind(...params).all();
    return result.results || [];
  }

  /**
   * Consolidar receita do dia
   */
  async consolidateDailyRevenue(date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Buscar todas as transações pagas do dia
    const transactions = await this.db.prepare(`
      SELECT 
        transaction_type,
        SUM(amount) as total_amount,
        SUM(commission_amount) as total_commission,
        COUNT(*) as count
      FROM transactions
      WHERE DATE(created_at) = ?
        AND payment_status = 'paid'
      GROUP BY transaction_type
    `).bind(targetDate).all();
    
    const summary = {
      subscription_revenue: 0,
      advertisement_revenue: 0,
      commission_revenue: 0,
      sponsorship_revenue: 0,
      total_revenue: 0,
      total_transactions: 0,
      total_users_paid: 0
    };
    
    (transactions.results || []).forEach(t => {
      const amount = t.total_amount || 0;
      summary[`${t.transaction_type}_revenue`] = amount;
      summary.total_revenue += amount;
      summary.total_transactions += t.count || 0;
    });
    
    // Contar usuários únicos que pagaram
    const usersCount = await this.db.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM transactions
      WHERE DATE(created_at) = ? AND payment_status = 'paid'
    `).bind(targetDate).first();
    
    summary.total_users_paid = usersCount?.count || 0;
    
    // Inserir ou atualizar no resumo
    const summaryId = `revenue_${targetDate}`;
    await this.db.prepare(`
      INSERT INTO revenue_summary (
        id, date, subscription_revenue, advertisement_revenue,
        commission_revenue, sponsorship_revenue, total_revenue,
        total_transactions, total_users_paid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        subscription_revenue = excluded.subscription_revenue,
        advertisement_revenue = excluded.advertisement_revenue,
        commission_revenue = excluded.commission_revenue,
        sponsorship_revenue = excluded.sponsorship_revenue,
        total_revenue = excluded.total_revenue,
        total_transactions = excluded.total_transactions,
        total_users_paid = excluded.total_users_paid,
        updated_at = datetime('now')
    `).bind(
      summaryId,
      targetDate,
      summary.subscription_revenue,
      summary.advertisement_revenue,
      summary.commission_revenue,
      summary.sponsorship_revenue,
      summary.total_revenue,
      summary.total_transactions,
      summary.total_users_paid
    ).run();
    
    return { success: true, summary };
  }

  /**
   * Obter configurações de monetização
   */
  async getSettings() {
    const result = await this.db.prepare('SELECT * FROM monetization_settings').all();
    const settings = {};
    
    (result.results || []).forEach(row => {
      settings[row.key] = row.value;
    });
    
    return settings;
  }

  /**
   * Atualizar configuração
   */
  async updateSetting(key, value, updatedBy = 'system') {
    await this.db.prepare(`
      UPDATE monetization_settings 
      SET value = ?, updated_at = datetime('now'), updated_by = ?
      WHERE key = ?
    `).bind(value, updatedBy, key).run();
    
    return { success: true, message: 'Configuração atualizada!' };
  }

  // ================================================================
  // 5. DASHBOARD DE MÉTRICAS
  // ================================================================

  /**
   * Obter dashboard completo de monetização
   */
  async getMonetizationDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Receita total
    const revenueResult = await this.db.prepare(`
      SELECT 
        SUM(total_revenue) as total_revenue,
        SUM(subscription_revenue) as subscription_revenue,
        SUM(advertisement_revenue) as advertisement_revenue,
        SUM(commission_revenue) as commission_revenue,
        SUM(sponsorship_revenue) as sponsorship_revenue
      FROM revenue_summary
      WHERE date >= ?
    `).bind(last30Days).first();
    
    // Anúncios ativos
    const adsResult = await this.db.prepare(`
      SELECT COUNT(*) as count
      FROM advertisements
      WHERE status = 'active' AND start_date <= ? AND end_date >= ?
    `).bind(today, today).first();
    
    // Itens patrocinados ativos
    const sponsoredResult = await this.db.prepare(`
      SELECT COUNT(*) as count
      FROM sponsored_items
      WHERE status = 'active' AND payment_status = 'paid' 
        AND start_date <= ? AND end_date >= ?
    `).bind(today, today).first();
    
    // Transações pendentes
    const pendingResult = await this.db.prepare(`
      SELECT COUNT(*) as count, SUM(amount) as total
      FROM transactions
      WHERE payment_status = 'pending'
    `).first();
    
    // Top anúncios (melhor CTR)
    const topAds = await this.db.prepare(`
      SELECT id, title, placement, impressions, clicks, ctr
      FROM advertisements
      WHERE status = 'active'
      ORDER BY ctr DESC
      LIMIT 5
    `).all();
    
    return {
      revenue: {
        total: revenueResult?.total_revenue || 0,
        subscription: revenueResult?.subscription_revenue || 0,
        advertisement: revenueResult?.advertisement_revenue || 0,
        commission: revenueResult?.commission_revenue || 0,
        sponsorship: revenueResult?.sponsorship_revenue || 0
      },
      active_ads: adsResult?.count || 0,
      sponsored_items: sponsoredResult?.count || 0,
      pending_transactions: {
        count: pendingResult?.count || 0,
        amount: pendingResult?.total || 0
      },
      top_ads: topAds.results || []
    };
  }

  /**
   * Obter métricas de usuário específico
   */
  async getUserMonetizationMetrics(userId) {
    // Transações do usuário
    const transactions = await this.db.prepare(`
      SELECT 
        transaction_type,
        COUNT(*) as count,
        SUM(amount) as total,
        SUM(commission_amount) as total_commission
      FROM transactions
      WHERE user_id = ? AND payment_status = 'paid'
      GROUP BY transaction_type
    `).bind(userId).all();
    
    // Itens patrocinados do usuário
    const sponsored = await this.db.prepare(`
      SELECT * FROM sponsored_items
      WHERE user_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(userId).all();
    
    // Total gasto
    const totalSpent = await this.db.prepare(`
      SELECT SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND payment_status = 'paid'
    `).bind(userId).first();
    
    return {
      transactions: transactions.results || [],
      sponsored_items: sponsored.results || [],
      total_spent: totalSpent?.total || 0
    };
  }
}

module.exports = MonetizationService;

