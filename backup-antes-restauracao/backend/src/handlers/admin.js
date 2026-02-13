// Handlers Admin para Cloudflare D1
import { json } from '../utils/respond.js';
import logger from '../utils/logger.js';

// Helper para verificar se usuário é admin
function checkAdmin(req) {
  // Verificar se é admin através do role no token JWT
  if (!req.user || (req.user.role !== 'admin' && !req.user.isAdmin)) {
    return json({ 
      success: false, 
      message: 'Acesso negado. Permissão de administrador necessária.' 
    }, { status: 403 });
  }
  return null;
}

// GET /api/admin/dashboard - Estatísticas gerais do sistema
export async function getDashboard(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const db = env.DB;
    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    // Queries paralelas para estatísticas
    const [
      totalUsersResult,
      activeUsersResult,
      totalProductsResult,
      activeProductsResult,
      totalPaymentsResult,
      totalRevenueResult,
      pendingPaymentsResult
    ] = await Promise.all([
      db.prepare('SELECT COUNT(*) as count FROM users').first(),
      db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').first(),
      db.prepare('SELECT COUNT(*) as count FROM products').first(),
      db.prepare('SELECT COUNT(*) as count FROM products WHERE status = ?').bind('active').first(),
      db.prepare('SELECT COUNT(*) as count FROM payments').first(),
      db.prepare('SELECT SUM(amount) as total FROM payments WHERE status = ?').bind('completed').first(),
      db.prepare('SELECT COUNT(*) as count FROM payments WHERE status = ?').bind('pending').first()
    ]);

    // Buscar registros recentes
    const recentRegistrations = await db.prepare(
      'SELECT id, name, email, business_type as businessType, created_at as createdAt FROM users ORDER BY created_at DESC LIMIT 10'
    ).all();

    const stats = {
      totalUsers: totalUsersResult?.count || 0,
      activeUsers: activeUsersResult?.count || 0,
      totalProducts: totalProductsResult?.count || 0,
      activeProducts: activeProductsResult?.count || 0,
      totalTransactions: totalPaymentsResult?.count || 0,
      totalRevenue: totalRevenueResult?.total || 0,
      pendingEscrow: pendingPaymentsResult?.count || 0,
      systemHealth: 98.5,
      uptime: '99.9%'
    };

    return json({
      success: true,
      data: { 
        stats, 
        recentRegistrations: recentRegistrations?.results || [] 
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas admin:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/users - Listar todos os usuários
export async function getUsers(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status');

    const skip = (page - 1) * limit;
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    let query = 'SELECT id, name, email, phone, business_type as businessType, is_active as isActive, role, created_at as createdAt, updated_at as updatedAt FROM users';
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }

    if (status) {
      conditions.push('is_active = ?');
      params.push(status === 'active' ? 1 : 0);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    // Buscar usuários
    const users = await db.prepare(query)
      .bind(...params, limit, skip)
      .all();

    // Contar total
    const totalResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = totalResult?.count || 0;

    return json({
      success: true,
      data: {
        users: users?.results || [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar usuários:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/products - Listar todos os produtos
export async function getProducts(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status');

    const skip = (page - 1) * limit;
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as count FROM products';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('title LIKE ?');
      params.push(`%${search}%`);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const products = await db.prepare(query)
      .bind(...params, limit, skip)
      .all();

    const totalResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = totalResult?.count || 0;

    return json({
      success: true,
      data: {
        products: products?.results || [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar produtos:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/payments - Listar todos os pagamentos
export async function getPayments(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const status = url.searchParams.get('status');
    const provider = url.searchParams.get('provider');

    const skip = (page - 1) * limit;
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    let query = 'SELECT * FROM payments';
    let countQuery = 'SELECT COUNT(*) as count FROM payments';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (provider) {
      conditions.push('provider = ?');
      params.push(provider);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    const payments = await db.prepare(query)
      .bind(...params, limit, skip)
      .all();

    const totalResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = totalResult?.count || 0;

    return json({
      success: true,
      data: {
        payments: payments?.results || [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar pagamentos:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/registrations - Listar todos os cadastros
export async function getRegistrations(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const search = url.searchParams.get('search') || '';
    const type = url.searchParams.get('type');

    const skip = (page - 1) * limit;
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }

    if (type) {
      conditions.push('business_type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    const registrations = await db.prepare(query)
      .bind(...params, limit, skip)
      .all();

    const totalResult = await db.prepare(countQuery)
      .bind(...params)
      .first();

    const total = totalResult?.count || 0;

    return json({
      success: true,
      data: {
        registrations: registrations?.results || [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar cadastros:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/activity - Atividade recente do sistema
export async function getActivity(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    // Tentar buscar de audit_logs, se não existir retornar vazio
    try {
      const activities = await db.prepare(
        'SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT ?'
      ).bind(limit).all();

      return json({
        success: true,
        data: { activities: activities?.results || [] }
      });
    } catch (err) {
      // Tabela não existe ainda, retornar vazio
      return json({
        success: true,
        data: { activities: [] }
      });
    }
  } catch (error) {
    logger.error('Erro ao buscar atividade:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/admin/users/:id/status - Ativar/desativar usuário
export async function updateUserStatus(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 2]; // /api/admin/users/:id/status

    const body = await req.json();
    const { isActive } = body;
    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    const result = await db.prepare(
      'UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?'
    ).bind(isActive ? 1 : 0, Date.now(), userId).run();

    if (result.meta.changes === 0) {
      return json({
        success: false,
        message: 'Usuário não encontrado'
      }, { status: 404 });
    }

    // Buscar usuário atualizado
    const user = await db.prepare(
      'SELECT id, name, email, is_active as isActive FROM users WHERE id = ?'
    ).bind(userId).first();

    return json({
      success: true,
      message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: { user }
    });
  } catch (error) {
    logger.error('Erro ao alterar status do usuário:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE /api/admin/products/:id - Deletar produto
export async function deleteProduct(req, env) {
  try {
    const adminCheck = checkAdmin(req);
    if (adminCheck) return adminCheck;

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const productId = pathParts[pathParts.length - 1]; // /api/admin/products/:id

    const db = env.DB;

    if (!db) {
      return json({
        success: false,
        message: 'Database not available'
      }, { status: 500 });
    }

    const result = await db.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(productId).run();

    if (result.meta.changes === 0) {
      return json({
        success: false,
        message: 'Produto não encontrado'
      }, { status: 404 });
    }

    return json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao deletar produto:', error);
    return json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    }, { status: 500 });
  }
}

