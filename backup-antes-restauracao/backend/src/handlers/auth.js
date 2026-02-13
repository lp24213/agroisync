import { json } from '../utils/respond.js';
import { createUser as d1CreateUser, findUserByEmail, findUserByCpf, findUserByCnpj } from '../utils/d1-helper.js';
import { hashPassword, verifyPassword, generateJWT } from '../utils/auth.js';

// Criar usuário
export async function createUser(request, env) {
  const { email, name, password, cpf = null, cnpj = null } = await request.json();

  try {
    // Checar duplicatas
    const existingByEmail = await findUserByEmail(env.DB, email);
    if (existingByEmail) {
      return json({ error: 'Email ja registrado' }, { status: 400 });
    }

    if (cpf) {
      const existingByCpf = await findUserByCpf(env.DB, cpf.replace(/\D/g, ''));
      if (existingByCpf) {
        return json({ error: 'CPF ja registrado' }, { status: 400 });
      }
    }

    if (cnpj) {
      const existingByCnpj = await findUserByCnpj(env.DB, cnpj.replace(/\D/g, ''));
      if (existingByCnpj) {
        return json({ error: 'CNPJ ja registrado' }, { status: 400 });
      }
    }

    const hashedPassword = await hashPassword(password);
    const user = await d1CreateUser(env.DB, {
      email,
      name,
      password: hashedPassword,
      cpf: cpf ? cpf.replace(/\D/g, '') : null,
      cnpj: cnpj ? cnpj.replace(/\D/g, '') : null
    });

    const token = await generateJWT(user.id);
    return json({ token });

  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

// Login
export async function loginUser(request, env) {
  const { email, password } = await request.json();

  try {
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (!user) {
      return json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return json({ error: 'Senha inválida' }, { status: 401 });
    }

    const token = await generateJWT(user.id);
    return json({ token });

  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

// Recuperar senha
export async function recoverPassword(request, env) {
  const { email } = await request.json();

  try {
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (!user) {
      return json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const code = Math.random().toString(36).substring(2, 8);
    const expires = Date.now() + (30 * 60 * 1000); // 30 minutos

    await env.DB.prepare('UPDATE users SET resetCode = ?, resetExpires = ? WHERE id = ?')
      .bind(code, expires, user.id)
      .run();

    // Enviar email com o código
    const emailResult = await env.RESEND.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Seu código de recuperação é: ${code}`
    });

    if (!emailResult.success) {
      return json({ error: 'Erro ao enviar email' }, { status: 500 });
    }

    return json({ message: 'Email de recuperação enviado' });

  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

// Resetar senha
export async function resetPassword(request, env) {
  const { email, code, newPassword } = await request.json();

  try {
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND resetCode = ? AND resetExpires > ?')
      .bind(email, code, Date.now())
      .first();

    if (!user) {
      return json({ error: 'Código inválido ou expirado' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await env.DB.prepare('UPDATE users SET password = ?, resetCode = NULL, resetExpires = NULL WHERE id = ?')
      .bind(hashedPassword, user.id)
      .run();

    return json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}