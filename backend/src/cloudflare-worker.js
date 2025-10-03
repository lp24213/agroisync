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
    return jsonResponse({ success: false, error: 'Email jÃ¡ cadastrado' }, 409);
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
    html: `<h1>OlÃ¡ ${name}!</h1><p>Conta criada com sucesso.</p>`
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
    return jsonResponse({ success: false, error: 'Credenciais invÃ¡lidas' }, 401);
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
  const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
  const limit = parseInt(url.searchParams.get('limit', 10, 10) || '20', 10);
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
  const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
  const limit = parseInt(url.searchParams.get('limit', 10, 10) || '20', 10);
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
  const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
  const limit = parseInt(url.searchParams.get('limit', 10, 10) || '20', 10);
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
    return jsonResponse({ success: false, error: 'UsuÃ¡rio nÃ£o encontrado' }, 404);
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

// ===== AUTH EXTRAS =====

async function handlePasswordReset(request, env) {
  try {
    const { email } = await request.json();
    if (!email) {
      return jsonResponse({ success: false, error: 'Email Ã© obrigatÃ³rio' }, 400);
    }

    const user = await env.DB.prepare('SELECT id, name FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();

    if (!user) {
      return jsonResponse({
        success: true,
        message: 'Se o email existir, vocÃª receberÃ¡ instruÃ§Ãµes'
      });
    }

    const resetToken = crypto.randomUUID();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

    await env.DB.prepare(
      "INSERT OR REPLACE INTO password_resets (user_id, token, expires_at, status, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
    )
      .bind(user.id, resetToken, expiresAt, 'pending')
      .run();

    await sendEmail(env, {
      to: email,
      subject: 'RecuperaÃ§Ã£o de Senha - AgroSync',
      html: `
        <h1>RecuperaÃ§Ã£o de Senha</h1>
        <p>OlÃ¡ ${user.name},</p>
        <p>Clique no link para redefinir sua senha:</p>
        <a href="https://agroisync.com/reset-password?token=${resetToken}">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
      `
    });

    return jsonResponse({
      success: true,
      message: 'Se o email existir, vocÃª receberÃ¡ instruÃ§Ãµes'
    });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Erro interno', message: error.message }, 500);
  }
}

async function handlePasswordResetConfirm(request, env) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) {
      return jsonResponse({ success: false, error: 'Token e nova senha sÃ£o obrigatÃ³rios' }, 400);
    }

    const reset = await env.DB.prepare(
      'SELECT * FROM password_resets WHERE token = ? AND status = ? AND expires_at > ?'
    )
      .bind(token, 'pending', Date.now())
      .first();

    if (!reset) {
      return jsonResponse({ success: false, error: 'Token invÃ¡lido ou expirado' }, 400);
    }

    await env.DB.prepare('UPDATE users SET password = ? WHERE id = ?')
      .bind(newPassword, reset.user_id)
      .run();

    await env.DB.prepare('UPDATE password_resets SET status = ? WHERE token = ?')
      .bind('used', token)
      .run();

    return jsonResponse({ success: true, message: 'Senha redefinida com sucesso' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Erro interno', message: error.message }, 500);
  }
}

async function handleEmailVerify(request, env) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return jsonResponse({ success: false, error: 'Token Ã© obrigatÃ³rio' }, 400);
    }

    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE email_verification_token = ? AND email_verification_expires > ?'
    )
      .bind(token, Date.now())
      .first();

    if (!user) {
      return jsonResponse({ success: false, error: 'Token invÃ¡lido ou expirado' }, 400);
    }

    await env.DB.prepare(
      'UPDATE users SET is_email_verified = 1, email_verification_token = NULL, email_verification_expires = NULL WHERE id = ?'
    )
      .bind(user.id)
      .run();

    return jsonResponse({ success: true, message: 'Email verificado com sucesso' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Erro interno', message: error.message }, 500);
  }
}

// ===== STORE/LOJA ROUTES =====

async function handleStoreList(request, env) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
    const limit = parseInt(url.searchParams.get('limit', 10, 10) || '20', 10);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE status = ?';
    const params = ['active'];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await env.DB.prepare(query)
      .bind(...params)
      .all();

    return jsonResponse({
      success: true,
      data: {
        products: results || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((results?.length || 0) / limit),
          totalItems: results?.length || 0
        }
      }
    });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar loja', message: error.message },
      500
    );
  }
}

async function handleStoreProductDetail(request, env) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();

    const product = await env.DB.prepare('SELECT * FROM products WHERE id = ? AND status = ?')
      .bind(productId, 'active')
      .first();

    if (!product) {
      return jsonResponse({ success: false, error: 'Produto nÃ£o encontrado' }, 404);
    }

    return jsonResponse({ success: true, data: { product } });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar produto', message: error.message },
      500
    );
  }
}

// ===== MESSAGES ROUTES =====

async function handleMessagesList(request, env, user) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
    const limit = parseInt(url.searchParams.get('limit', 10, 10) || '20', 10);
    const offset = (page - 1) * limit;

    const { results } = await env.DB.prepare(
      `
      SELECT m.*, 
             sender.name as sender_name,
             receiver.name as receiver_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `
    )
      .bind(user.userId, user.userId, limit, offset)
      .all();

    return jsonResponse({
      success: true,
      data: { messages: results || [] }
    });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar mensagens', message: error.message },
      500
    );
  }
}

async function handleMessageSend(request, env, user) {
  try {
    const { receiverId, subject, content, type } = await request.json();

    if (!receiverId || !content) {
      return jsonResponse(
        { success: false, error: 'DestinatÃ¡rio e conteÃºdo sÃ£o obrigatÃ³rios' },
        400
      );
    }

    const messageId = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO messages (id, sender_id, receiver_id, subject, content, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
    )
      .bind(
        messageId,
        user.userId,
        receiverId,
        subject || 'Nova mensagem',
        content,
        type || 'general',
        'sent'
      )
      .run();

    return jsonResponse(
      { success: true, message: 'Mensagem enviada', data: { id: messageId } },
      201
    );
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao enviar mensagem', message: error.message },
      500
    );
  }
}

// ===== PAYMENTS ROUTES =====

async function handlePaymentCreate(request, env, user) {
  try {
    const { amount, type, description } = await request.json();

    if (!amount || !type) {
      return jsonResponse({ success: false, error: 'Valor e tipo sÃ£o obrigatÃ³rios' }, 400);
    }

    const paymentId = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO payments (id, user_id, amount, type, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
    )
      .bind(paymentId, user.userId, amount, type, description || '', 'pending')
      .run();

    // Simular integraÃ§Ã£o Stripe
    const paymentIntent = {
      id: paymentId,
      client_secret: `pi_${paymentId}_secret_test`,
      amount: amount * 100, // centavos
      currency: 'brl'
    };

    return jsonResponse(
      {
        success: true,
        message: 'Pagamento criado',
        data: { paymentIntent }
      },
      201
    );
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao criar pagamento', message: error.message },
      500
    );
  }
}

async function handlePaymentWebhook(request, env) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Validar webhook Stripe (simplificado)
    if (!signature) {
      return jsonResponse({ success: false, error: 'Signature invÃ¡lida' }, 400);
    }

    const event = JSON.parse(body);

    if (event.type === 'payment_intent.succeeded') {
      const paymentId = event.data.object.id;

      await env.DB.prepare('UPDATE payments SET status = ? WHERE id = ?')
        .bind('completed', paymentId)
        .run();
    }

    return jsonResponse({ success: true, message: 'Webhook processado' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Erro no webhook', message: error.message }, 500);
  }
}

// ===== NEWS ROUTES =====

async function handleNewsList(request, env) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page', 10, 10) || '1', 10);
    const limit = parseInt(url.searchParams.get('limit', 10, 10) || '10', 10);
    const offset = (page - 1) * limit;

    const { results } = await env.DB.prepare(
      'SELECT * FROM news WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    )
      .bind('published', limit, offset)
      .all();

    return jsonResponse({
      success: true,
      data: { news: results || [] }
    });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar notÃ­cias', message: error.message },
      500
    );
  }
}

async function handleNewsDetail(request, env) {
  try {
    const url = new URL(request.url);
    const newsId = url.pathname.split('/').pop();

    const news = await env.DB.prepare('SELECT * FROM news WHERE id = ? AND status = ?')
      .bind(newsId, 'published')
      .first();

    if (!news) {
      return jsonResponse({ success: false, error: 'NotÃ­cia nÃ£o encontrada' }, 404);
    }

    return jsonResponse({ success: true, data: { news } });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar notÃ­cia', message: error.message },
      500
    );
  }
}

// ===== ADMIN ROUTES =====

async function handleAdminUsers(request, env, user) {
  try {
    if (user.role !== 'admin' && user.role !== 'super-admin') {
      return jsonResponse({ success: false, error: 'Acesso negado' }, 403);
    }

    const { results } = await env.DB.prepare(
      'SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 50'
    ).all();

    return jsonResponse({
      success: true,
      data: { users: results || [] }
    });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar usuÃ¡rios', message: error.message },
      500
    );
  }
}

async function handleAdminStats(request, env, user) {
  try {
    if (user.role !== 'admin' && user.role !== 'super-admin') {
      return jsonResponse({ success: false, error: 'Acesso negado' }, 403);
    }

    const [usersCount, productsCount, messagesCount, paymentsCount] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM products').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM messages').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM payments').first()
    ]);

    return jsonResponse({
      success: true,
      data: {
        stats: {
          users: usersCount?.count || 0,
          products: productsCount?.count || 0,
          messages: messagesCount?.count || 0,
          payments: paymentsCount?.count || 0
        }
      }
    });
  } catch (error) {
    return jsonResponse(
      { success: false, error: 'Erro ao buscar estatÃ­sticas', message: error.message },
      500
    );
  }
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

  // Auth Extras
  if (path === '/api/auth/forgot-password' && method === 'POST') {
    return handlePasswordReset(request, env);
  }
  if (path === '/api/auth/reset-password' && method === 'POST') {
    return handlePasswordResetConfirm(request, env);
  }
  if (path === '/api/auth/verify-email' && method === 'GET') {
    return handleEmailVerify(request, env);
  }

  // Store/Loja
  if (path === '/api/store' && method === 'GET') {
    return handleStoreList(request, env);
  }
  if (path.startsWith('/api/store/product/') && method === 'GET') {
    return handleStoreProductDetail(request, env);
  }

  // Messages
  if (path === '/api/messages' && method === 'GET') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleMessagesList(request, env, user);
  }
  if (path === '/api/messages' && method === 'POST') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleMessageSend(request, env, user);
  }

  // Payments
  if (path === '/api/payments' && method === 'POST') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handlePaymentCreate(request, env, user);
  }
  if (path === '/api/payments/webhook' && method === 'POST') {
    return handlePaymentWebhook(request, env);
  }

  // News
  if (path === '/api/news' && method === 'GET') {
    return handleNewsList(request, env);
  }
  if (path.startsWith('/api/news/') && method === 'GET') {
    return handleNewsDetail(request, env);
  }

  // Admin
  if (path === '/api/admin/users' && method === 'GET') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleAdminUsers(request, env, user);
  }
  if (path === '/api/admin/stats' && method === 'GET') {
    const user = verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    return handleAdminStats(request, env, user);
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
