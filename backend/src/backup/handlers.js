// @ts-check

import { jsonResponse } from './middlewares.js';
import { hashPassword, verifyPassword, generateJWT, generateRecoveryCode } from './utils/auth.js';
import { validateTurnstile } from './utils/turnstile.js';
import { getEmailClient, sendWelcomeEmail, sendRecoveryEmail } from './utils/email.js';

/**
 * Handler de verificação de saúde da API
 */
export async function handleHealth(request, env) {
  return jsonResponse({ status: 'healthy', version: env.API_VERSION });
}

/**
 * Handler de login
 */
export async function handleLogin(request, env) {
  try {
    // Validar token do Turnstile
    const turnstileResponse = await validateTurnstile(request, env);
    if (turnstileResponse) return turnstileResponse;

    const { email, password } = await request.json();

    // Consultar usuário no banco
    const db = env.DB;
    const user = await db.prepare(
      'SELECT id, email, password_hash, name FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // Verificar senha
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // Gerar token JWT
    const token = await generateJWT({ 
      userId: user.id,
      email: user.email
    }, env.JWT_SECRET);

    return jsonResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({ error: 'Login failed' }, 500);
  }
}

/**
 * Handler de registro
 */
export async function handleRegister(request, env) {
  try {
    // Validar token do Turnstile
    const turnstileResponse = await validateTurnstile(request, env);
    if (turnstileResponse) return turnstileResponse;

    const { email, password, name } = await request.json();

    // Verificar se e-mail já existe
    const db = env.DB;
    const existingUser = await db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return jsonResponse({ error: 'Email already registered' }, 400);
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Inserir usuário
    const result = await db.prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).bind(email, passwordHash, name).run();

    if (!result.success) {
      throw new Error('Failed to create user');
    }

    // Enviar e-mail de boas-vindas
    const emailClient = getEmailClient(env);
    await sendWelcomeEmail(emailClient, email, name);

    return jsonResponse({
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return jsonResponse({ error: 'Registration failed' }, 500);
  }
}

/**
 * Handler de recuperação de senha
 */
export async function handleRecoverPassword(request, env) {
  try {
    // Validar token do Turnstile
    const turnstileResponse = await validateTurnstile(request, env);
    if (turnstileResponse) return turnstileResponse;

    const { email } = await request.json();

    // Verificar se usuário existe
    const db = env.DB;
    const user = await db.prepare(
      'SELECT id, name FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      // Por segurança, não informamos se o e-mail existe ou não
      return jsonResponse({
        message: 'If your email is registered, you will receive recovery instructions'
      });
    }

    // Gerar código de recuperação
    const recoveryCode = generateRecoveryCode();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Salvar código no banco
    await db.prepare(
      'INSERT INTO recovery_codes (user_id, code, expires_at) VALUES (?, ?, ?)'
    ).bind(user.id, recoveryCode, expiresAt.toISOString()).run();

    // Enviar e-mail de recuperação
    const emailClient = getEmailClient(env);
    await sendRecoveryEmail(emailClient, email, user.name, recoveryCode);

    return jsonResponse({
      message: 'Recovery instructions sent to your email'
    });
  } catch (error) {
    console.error('Password recovery error:', error);
    return jsonResponse({ error: 'Password recovery failed' }, 500);
  }
}

// Outros handlers seguem o mesmo padrão...