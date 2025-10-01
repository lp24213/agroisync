/**
 * Cloudflare Worker Principal - AgroSync Backend
 * Este worker gerencia todas as rotas da API e conecta ao banco D1
 */

/**
 * Configuração CORS
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

/**
 * Resposta OPTIONS para CORS preflight
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

/**
 * Resposta JSON com CORS
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Middleware de autenticação JWT
 */
function verifyJWT(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    // Decodificar o JWT (base64)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    // Verificar expiração
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Router principal
 */
function router(request, env) {
  const { pathname: path } = new URL(request.url);
  const { method } = request;

  // Conectar ao banco D1
  const { DB: db } = env;

  // Health check
  if (path === '/api/health' || path === '/health') {
    return jsonResponse({
      success: true,
      message: 'AgroSync API - Backend ativo',
      version: '1.0.0',
      database: 'D1 Connected',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV || 'production'
    });
  }

  // Rotas de autenticação (públicas)
  if (path.startsWith('/api/auth/') || path.startsWith('/api/v1/auth/')) {
    return handleAuthRoutes(request, db, path, method);
  }

  // Rotas de usuários
  if (path.startsWith('/api/users/') || path.startsWith('/api/v1/users/')) {
    const user = verifyJWT(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleUserRoutes(request, db, path, method, user);
  }

  // Rotas de produtos
  if (path.startsWith('/api/products/') || path.startsWith('/api/v1/products/')) {
    return handleProductRoutes(request, db, path, method);
  }

  // Rotas de frete
  if (path.startsWith('/api/freight/') || path.startsWith('/api/v1/freight/')) {
    return handleFreightRoutes(request, db, path, method);
  }

  // Rotas de parceiros
  if (path.startsWith('/api/partners/') || path.startsWith('/api/v1/partners/')) {
    return handlePartnerRoutes(request, db, path, method);
  }

  // Rotas de mensagens
  if (path.startsWith('/api/messages/') || path.startsWith('/api/v1/messages/')) {
    const user = verifyJWT(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleMessageRoutes(request, db, path, method, user);
  }

  // Rotas de pagamentos
  if (path.startsWith('/api/payments/') || path.startsWith('/api/v1/payments/')) {
    return handlePaymentRoutes(request, db, path, method);
  }

  // Rotas de notícias
  if (path.startsWith('/api/news/') || path.startsWith('/api/v1/news/')) {
    return handleNewsRoutes(request, db, path, method);
  }

  // Rotas de admin
  if (path.startsWith('/api/admin/') || path.startsWith('/api/v1/admin/')) {
    const user = verifyJWT(request);
    if (!user || user.role !== 'admin') {
      return jsonResponse({ success: false, error: 'Forbidden' }, 403);
    }
    return handleAdminRoutes(request, db, path, method, user);
  }

  // 404 para rotas não encontradas
  return jsonResponse(
    {
      success: false,
      error: 'Route not found',
      path
    },
    404
  );
}

/**
 * Handler de rotas de autenticação
 */
async function handleAuthRoutes(request, db, path, method) {
  // Login
  if (path.includes('/login') && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return jsonResponse(
          {
            success: false,
            error: 'Email e senha são obrigatórios'
          },
          400
        );
      }

      // Buscar usuário no D1
      const user = await db
        .prepare('SELECT * FROM users WHERE email = ? LIMIT 1')
        .bind(email.toLowerCase())
        .first();

      if (!user) {
        return jsonResponse(
          {
            success: false,
            error: 'Credenciais inválidas'
          },
          401
        );
      }

      // TODO: Verificar senha com bcrypt
      // Por enquanto, apenas retornar sucesso para demonstração

      // Gerar token JWT simples (em produção, usar biblioteca JWT)
      // const payload = {
      //   userId: user.id,
      //   email: user.email,
      //   role: user.role,
      //   exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24h
      // };

      const token = 'mock.jwt.token'; // Em produção, gerar JWT real

      return jsonResponse({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch {
      return jsonResponse(
        {
          success: false,
          error: 'Erro interno do servidor'
        },
        500
      );
    }
  }

  // Register
  if (path.includes('/register') && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password, name } = body;

      if (!email || !password || !name) {
        return jsonResponse(
          {
            success: false,
            error: 'Email, senha e nome são obrigatórios'
          },
          400
        );
      }

      // Verificar se usuário já existe
      const existingUser = await db
        .prepare('SELECT id FROM users WHERE email = ? LIMIT 1')
        .bind(email.toLowerCase())
        .first();

      if (existingUser) {
        return jsonResponse(
          {
            success: false,
            error: 'Email já cadastrado'
          },
          409
        );
      }

      // Inserir novo usuário
      // TODO: Hash da senha com bcrypt
      const userId = crypto.randomUUID();
      await db
        .prepare('INSERT INTO users (id, email, password, name, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(userId, email.toLowerCase(), password, name, new Date().toISOString())
        .run();

      return jsonResponse(
        {
          success: true,
          message: 'Usuário criado com sucesso',
          data: { userId, email, name }
        },
        201
      );
    } catch {
      return jsonResponse(
        {
          success: false,
          error: 'Erro interno do servidor'
        },
        500
      );
    }
  }

  return jsonResponse(
    {
      success: false,
      error: 'Route not found'
    },
    404
  );
}

/**
 * Handler de rotas de usuários
 */
async function handleUserRoutes(request, db, path, method, user) {
  // GET /users/profile
  if (path.includes('/profile') && method === 'GET') {
    try {
      const userProfile = await db
        .prepare(
          'SELECT id, email, name, phone, avatar, bio, city, state, country, business_type, created_at FROM users WHERE id = ? LIMIT 1'
        )
        .bind(user.userId)
        .first();

      if (!userProfile) {
        return jsonResponse(
          {
            success: false,
            error: 'Usuário não encontrado'
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        data: { user: userProfile }
      });
    } catch {
      return jsonResponse(
        {
          success: false,
          error: 'Erro interno do servidor'
        },
        500
      );
    }
  }

  return jsonResponse(
    {
      success: false,
      error: 'Route not found'
    },
    404
  );
}

/**
 * Handlers para outras rotas (placeholder)
 */
function handleProductRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Products route', path });
}

function handleFreightRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Freight route', path });
}

function handlePartnerRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Partners route', path });
}

function handleMessageRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Messages route', path });
}

function handlePaymentRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Payments route', path });
}

function handleNewsRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'News route', path });
}

function handleAdminRoutes(_request, _db, path) {
  return jsonResponse({ success: true, message: 'Admin route', path });
}

/**
 * Export do worker
 */
export default {
  fetch(request, env) {
    try {
      // Handle OPTIONS
      if (request.method === 'OPTIONS') {
        return handleOptions();
      }

      // Process request
      return router(request, env);
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: 'Internal server error',
          message: error.message
        },
        500
      );
    }
  }
};
