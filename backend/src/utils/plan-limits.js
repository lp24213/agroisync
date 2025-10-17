// ============================================
// PLAN LIMITS HELPER
// Funções para verificar limites dos planos
// ============================================

/**
 * Verifica se o usuário atingiu o limite do plano
 * @param {Object} db - Instância do D1
 * @param {string} userId - ID do usuário
 * @param {string} type - 'freight' ou 'product'
 * @returns {Promise<{allowed: boolean, current: number, limit: number, plan: string}>}
 */
export async function checkUserLimit(db, userId, type) {
  try {
    // Buscar usuário e seu plano
    const user = await db.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first();
    
    if (!user) {
      return { allowed: false, current: 0, limit: 0, plan: null, error: 'Usuário não encontrado' };
    }

    // Buscar detalhes do plano
    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(user.plan).first();
    
    if (!plan) {
      return { allowed: false, current: 0, limit: 0, plan: user.plan, error: 'Plano não encontrado' };
    }

    // Determinar o limite
    const limit = type === 'freight' ? plan.freight_limit : plan.product_limit;
    
    // Se limite é -1, é ilimitado
    if (limit === -1) {
      return { allowed: true, current: 0, limit: -1, plan: user.plan };
    }

    // Verificar uso no mês atual
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    let usage = await db.prepare(
      'SELECT freights_used, products_used FROM user_usage WHERE user_id = ? AND month = ?'
    ).bind(userId, currentMonth).first();

    // Se não existe registro de uso este mês, criar
    if (!usage) {
      await db.prepare(
        'INSERT INTO user_usage (user_id, month, freights_used, products_used) VALUES (?, ?, 0, 0)'
      ).bind(userId, currentMonth).run();
      usage = { freights_used: 0, products_used: 0 };
    }

    const current = type === 'freight' ? usage.freights_used : usage.products_used;

    return {
      allowed: current < limit,
      current,
      limit,
      plan: user.plan,
      planName: plan.name
    };
  } catch (error) {
    console.error('Erro ao verificar limite:', error);
    return { allowed: false, current: 0, limit: 0, plan: null, error: error.message };
  }
}

/**
 * Incrementa o uso do usuário
 * @param {Object} db - Instância do D1
 * @param {string} userId - ID do usuário
 * @param {string} type - 'freight' ou 'product'
 */
export async function incrementUserUsage(db, userId, type) {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const field = type === 'freight' ? 'freights_used' : 'products_used';
    
    await db.prepare(
      `UPDATE user_usage SET ${field} = ${field} + 1 WHERE user_id = ? AND month = ?`
    ).bind(userId, currentMonth).run();
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retorna informações completas do plano do usuário
 * @param {Object} db - Instância do D1
 * @param {string} userId - ID do usuário
 */
export async function getUserPlanInfo(db, userId) {
  try {
    const user = await db.prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?').bind(userId).first();
    
    if (!user) {
      return null;
    }

    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(user.plan).first();
    
    if (!plan) {
      return null;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = await db.prepare(
      'SELECT freights_used, products_used FROM user_usage WHERE user_id = ? AND month = ?'
    ).bind(userId, currentMonth).first();

    return {
      plan: plan.slug,
      planName: plan.name,
      priceMonthly: plan.price_monthly,
      freightLimit: plan.freight_limit,
      productLimit: plan.product_limit,
      freightsUsed: usage?.freights_used || 0,
      productsUsed: usage?.products_used || 0,
      expiresAt: user.plan_expires_at,
      features: plan.features ? JSON.parse(plan.features) : []
    };
  } catch (error) {
    console.error('Erro ao buscar info do plano:', error);
    return null;
  }
}

