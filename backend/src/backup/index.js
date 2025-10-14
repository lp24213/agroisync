import { Router } from 'itty-router';
import { Resend } from 'resend';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { verifyTurnstileToken } from './utils/turnstile';
import { withDb } from './utils/database';

const router = Router();

// Middleware global
router.all('*', corsMiddleware);
router.all('*', rateLimitMiddleware);

// Rotas públicas
router.get('/api/health', async (request, env) => {
  try {
    // Teste DB
    const dbTest = await env.DB.prepare('SELECT 1 as test').first();
    
    // Teste Resend
    const resend = new Resend(env.RESEND_API_KEY);
    const emailTest = await resend.emails.get('test').catch(err => 
      err.statusCode === 404 ? { success: true } : { error: err.message }
    );

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbTest ? 'connected' : 'error',
        email: emailTest.error ? 'error' : 'connected',
        turnstile: env.CF_TURNSTILE_SECRET_KEY ? 'configured' : 'error'
      }
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 });
  }
});

// Auth routes
router.post('/api/auth/register', withDb(async (request, env, db) => {
  const { email, password, name } = await request.json();
  const { turnstileToken } = request.headers;

  // Verificar Turnstile
  const turnstileValid = await verifyTurnstileToken(turnstileToken, env.CF_TURNSTILE_SECRET_KEY);
  if (!turnstileValid) {
    return Response.json({ error: 'Verificação de segurança falhou' }, { status: 400 });
  }

  // Verificar email existente
  const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (existingUser) {
    return Response.json({ error: 'Email já cadastrado' }, { status: 409 });
  }

  // Criar usuário
  const result = await db.prepare(`
    INSERT INTO users (email, password_hash, name, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).bind(email, await hashPassword(password), name).run();

  if (!result.success) {
    throw new Error('Falha ao criar usuário');
  }

  // Enviar email de boas-vindas
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Bem-vindo ao AgroSync!',
    html: `
      <h1>Bem-vindo ao AgroSync, ${name}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
    `
  });

  return Response.json({ 
    message: 'Usuário criado com sucesso',
    userId: result.lastRowId
  }, { status: 201 });
}));

router.post('/api/auth/login', withDb(async (request, env, db) => {
  const { email, password } = await request.json();
  const { turnstileToken } = request.headers;

  // Verificar Turnstile
  const turnstileValid = await verifyTurnstileToken(turnstileToken, env.CF_TURNSTILE_SECRET_KEY);
  if (!turnstileValid) {
    return Response.json({ error: 'Verificação de segurança falhou' }, { status: 400 });
  }

  // Buscar usuário
  const user = await db.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (!user || !await verifyPassword(password, user.password_hash)) {
    return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  // Gerar token
  const token = generateToken(user.id, env.JWT_SECRET);

  // Atualizar último login
  await db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?')
    .bind(user.id)
    .run();

  return Response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}));

router.post('/api/auth/recover', withDb(async (request, env, db) => {
  const { email } = await request.json();
  const { turnstileToken } = request.headers;

  // Verificar Turnstile
  const turnstileValid = await verifyTurnstileToken(turnstileToken, env.CF_TURNSTILE_SECRET_KEY);
  if (!turnstileValid) {
    return Response.json({ error: 'Verificação de segurança falhou' }, { status: 400 });
  }

  // Buscar usuário
  const user = await db.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (!user) {
    // Por segurança, não revelamos se o email existe
    return Response.json({ 
      message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação' 
    });
  }

  // Gerar código de recuperação
  const code = generateRecoveryCode();
  
  // Salvar código
  await db.prepare(`
    INSERT INTO recovery_codes (user_id, code, expires_at)
    VALUES (?, ?, datetime('now', '+1 hour'))
  `).bind(user.id, code).run();

  // Enviar email
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Recuperação de Senha - AgroSync',
    html: `
      <h1>Recuperação de Senha</h1>
      <p>Olá ${user.name},</p>
      <p>Seu código de recuperação é: <strong>${code}</strong></p>
      <p>Este código expira em 1 hora.</p>
    `
  });

  return Response.json({ 
    message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação' 
  });
}));

// Rotas protegidas
router.all('/api/*', authMiddleware);

// Handler de erros global
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  fetch: (...args) => router.handle(...args).catch(errorHandler)
};