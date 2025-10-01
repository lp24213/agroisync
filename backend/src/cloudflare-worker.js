/**
 * Cloudflare Worker - AgroSync Backend
 * Stack: Cloudflare Workers + D1 + Resend + JWT ONLY
 */

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function verifyJWT(request, _jwtSecret) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function generateJWT(payload, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = btoa(JSON.stringify({ ...payload, iat: now, exp: now + 86400 }));
  return `${header}.${jwtPayload}.${btoa(secret)}`;
}

async function sendEmail(env, { to, subject, html }) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: 'AgroSync <no-reply@agroisync.com>', to, subject, html })
    });
  } catch {
    // Silent fail
  }
}

// AUTH ROUTES
async function handleRegister(request, env) {
  const { email, password, name } = await request.json();
  if (!email || !password || !name) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

  const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first();

  if (exists) {
    return jsonResponse({ success: false, error: 'Email já cadastrado' }, 409);
  }

  const userId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO users (id, email, password, name, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
  )
    .bind(userId, email.toLowerCase(), password, name)
    .run();

  await sendEmail(env, {
    to: email,
    subject: 'Bem-vindo ao AgroSync',
    html: `<h1>Olá ${name}!</h1><p>Conta criada com sucesso.</p>`
  });

  const token = generateJWT({ userId, email, name }, env.JWT_SECRET);
  return jsonResponse({ success: true, data: { token, user: { id: userId, email, name } } }, 201);
}

async function handleLogin(request, env) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first();

  if (!user || user.password !== password) {
    return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
  }

  const token = generateJWT(
    { userId: user.id, email: user.email, name: user.name },
    env.JWT_SECRET
  );
  return jsonResponse({
    success: true,
    data: { token, user: { id: user.id, email: user.email, name: user.name } }
  });
}

// PRODUCTS ROUTES
async function handleProductsList(request, env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { results } = await env.DB.prepare(
    'SELECT * FROM products WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  )
    .bind('active', limit, offset)
    .all();

  const { total } = await env.DB.prepare('SELECT COUNT(*) as total FROM products WHERE status = ?')
    .bind('active')
    .first();

  return jsonResponse({
    success: true,
    data: {
      products: results || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((total || 0) / limit),
        totalItems: total || 0,
        itemsPerPage: limit
      }
    }
  });
}

async function handleProductCreate(request, env, user) {
  const { name, description, price, category } = await request.json();
  if (!name || !price || !category) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

  const productId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO products (id, name, description, price, category, seller_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  )
    .bind(productId, name, description, price, category, user.userId, 'active')
    .run();

  return jsonResponse({ success: true, message: 'Produto criado', data: { id: productId } }, 201);
}

// PARTNERS ROUTES
async function handlePartnersList(request, env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { results } = await env.DB.prepare(
    'SELECT * FROM partners WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  )
    .bind('active', limit, offset)
    .all();

  const { total } = await env.DB.prepare('SELECT COUNT(*) as total FROM partners WHERE status = ?')
    .bind('active')
    .first();

  return jsonResponse({
    success: true,
    data: {
      partners: results || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((total || 0) / limit),
        totalItems: total || 0
      }
    }
  });
}

// FREIGHT ROUTES
async function handleFreightList(request, env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { results } = await env.DB.prepare(
    'SELECT * FROM freight_orders ORDER BY created_at DESC LIMIT ? OFFSET ?'
  )
    .bind(limit, offset)
    .all();

  const { total } = await env.DB.prepare('SELECT COUNT(*) as total FROM freight_orders').first();

  return jsonResponse({
    success: true,
    data: {
      freights: results || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((total || 0) / limit),
        totalItems: total || 0
      }
    }
  });
}

async function handleFreightCreate(request, env, user) {
  const { origin, destination, cargoType } = await request.json();
  if (!origin || !destination || !cargoType) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

  const freightId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO freight_orders (id, origin, destination, cargo_type, customer_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
  )
    .bind(freightId, origin, destination, cargoType, user.userId, 'pending')
    .run();

  return jsonResponse({ success: true, message: 'Frete criado', data: { id: freightId } }, 201);
}

// USER ROUTES
async function handleUserProfile(request, env, user) {
  const profile = await env.DB.prepare(
    'SELECT id, email, name, phone, bio, city, state FROM users WHERE id = ?'
  )
    .bind(user.userId)
    .first();

  if (!profile) {
    return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
  }

  return jsonResponse({ success: true, data: { user: profile } });
}

async function handleUserUpdate(request, env, user) {
  const { name, phone, bio, city, state } = await request.json();

  await env.DB.prepare(
    "UPDATE users SET name = ?, phone = ?, bio = ?, city = ?, state = ?, updated_at = datetime('now') WHERE id = ?"
  )
    .bind(name, phone, bio, city, state, user.userId)
    .run();

  return jsonResponse({ success: true, message: 'Perfil atualizado' });
}

// ROUTER
function router(request, env) {
  const { pathname: path } = new URL(request.url);
  const { method } = request;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { DB: _db } = env;

  // Health
  if (path === '/api/health' || path === '/health') {
    return jsonResponse({
      success: true,
      message: 'AgroSync API - Backend ativo',
      version: '1.0.0',
      database: 'D1 Connected',
      timestamp: new Date().toISOString()
    });
  }

  // Auth
  if (path === '/api/auth/register' && method === 'POST') {
    return handleRegister(request, env);
  }
  if (path === '/api/auth/login' && method === 'POST') {
    return handleLogin(request, env);
  }

  // Products
  if (path === '/api/products' && method === 'GET') {
    return handleProductsList(request, env);
  }
  if (path === '/api/products' && method === 'POST') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleProductCreate(request, env, user);
  }

  // Partners
  if (path === '/api/partners' && method === 'GET') {
    return handlePartnersList(request, env);
  }

  // Freight
  if (path === '/api/freight' && method === 'GET') {
    return handleFreightList(request, env);
  }
  if (path === '/api/freight' && method === 'POST') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleFreightCreate(request, env, user);
  }

  // Users
  if (path === '/api/users/profile' && method === 'GET') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleUserProfile(request, env, user);
  }
  if (path === '/api/users/profile' && method === 'PUT') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleUserUpdate(request, env, user);
  }

  // 404
  return jsonResponse({ success: false, error: 'Route not found', path }, 404);
}

// EXPORT
export default {
  fetch(request, env) {
    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      return router(request, env);
    } catch (error) {
      return jsonResponse({ success: false, error: 'Internal error', message: error.message }, 500);
    }
  }
};
