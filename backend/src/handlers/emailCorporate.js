import { json } from '../utils/respond.js';
import { nanoid } from 'nanoid';
import corporateEmailService from '../services/corporateEmailService.js';
import emailEncryption from '../services/emailEncryption.js';
import emailWebhookService from '../services/emailWebhookService.js';
import logger from '../utils/logger.js';

// Helper para disparar webhook
async function triggerWebhook(env, event, data) {
  try {
    await emailWebhookService.triggerWebhook(env, event, data);
  } catch (error) {
    logger.warn('Erro ao disparar webhook (não crítico):', error);
    // Não falhar a operação principal por causa do webhook
  }
}

/**
 * Criar conta de email
 * POST /api/email/accounts
 */
export async function createEmailAccount(request, env) {
  try {
    const { email, password, name } = await request.json();
    const userId = request.userId;

    if (!email || !password) {
      return json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Email inválido' }, { status: 400 });
    }

    // Verificar se já existe conta com este email para este usuário
    const existing = await env.DB.prepare(
      'SELECT id FROM email_accounts WHERE user_id = ? AND email = ?'
    ).bind(userId, email).first();

    if (existing) {
      return json({ error: 'Conta de email já cadastrada' }, { status: 400 });
    }

    // Criptografar senha
    const encryptedPassword = emailEncryption.encrypt(password);

    // Criar conta
    const accountId = nanoid();
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO email_accounts (
        id, user_id, email, encrypted_password, imap_host, imap_port,
        smtp_host, smtp_port, secure, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      accountId,
      userId,
      email,
      encryptedPassword,
      'imap.hostinger.com',
      993,
      'smtp.hostinger.com',
      465,
      1,
      1,
      now,
      now
    ).run();

    logger.info(`Conta de email criada: ${email} para usuário ${userId}`);

    return json({
      success: true,
      account: {
        id: accountId,
        email,
        imapHost: 'imap.hostinger.com',
        imapPort: 993,
        smtpHost: 'smtp.hostinger.com',
        smtpPort: 465,
        secure: true,
        isActive: true,
        createdAt: now
      }
    });
  } catch (error) {
    logger.error('Erro ao criar conta de email:', error);
    return json({ error: error.message || 'Erro ao criar conta de email' }, { status: 500 });
  }
}

/**
 * Listar contas de email do usuário
 * GET /api/email/accounts
 */
export async function listEmailAccounts(request, env) {
  try {
    const userId = request.userId;

    const accounts = await env.DB.prepare(`
      SELECT id, email, imap_host, imap_port, smtp_host, smtp_port, 
             secure, is_active, last_sync_at, created_at, updated_at
      FROM email_accounts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all();

    return json({
      success: true,
      accounts: accounts.results || []
    });
  } catch (error) {
    logger.error('Erro ao listar contas de email:', error);
    return json({ error: error.message || 'Erro ao listar contas' }, { status: 500 });
  }
}

/**
 * Buscar inbox de uma conta
 * GET /api/email/inbox?accountId=xxx&folder=INBOX&limit=50&offset=0
 */
export async function getInbox(request, env) {
  try {
    const userId = request.userId;
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const folder = url.searchParams.get('folder') || 'INBOX';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    if (!accountId) {
      return json({ error: 'accountId é obrigatório' }, { status: 400 });
    }

    // Buscar conta e verificar permissão
    const account = await env.DB.prepare(`
      SELECT * FROM email_accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Tentar buscar do cache primeiro (se disponível)
    let result = null;
    try {
      const cached = await corporateEmailService.fetchCachedMessages(env.DB, accountId, folder, limit, offset);
      if (cached.success && cached.messages.length > 0) {
        result = cached;
        logger.debug(`Mensagens carregadas do cache para conta ${accountId}`);
      }
    } catch (cacheError) {
      logger.debug('Cache não disponível, buscando via IMAP:', cacheError);
    }

    // Se não encontrou no cache, buscar via IMAP
    if (!result || !result.fromCache) {
      result = await corporateEmailService.fetchInbox(account, folder, limit, offset, env);
    }

    if (!result.success) {
      return json({ error: result.error || 'Erro ao buscar mensagens' }, { status: 500 });
    }

    // Atualizar last_sync_at
    await env.DB.prepare(`
      UPDATE email_accounts SET last_sync_at = ?, updated_at = ? WHERE id = ?
    `).bind(new Date().toISOString(), new Date().toISOString(), accountId).run();

    return json({
      success: true,
      messages: result.messages,
      total: result.total,
      folder: result.folder
    });
  } catch (error) {
    logger.error('Erro ao buscar inbox:', error);
    return json({ error: error.message || 'Erro ao buscar inbox' }, { status: 500 });
  }
}

/**
 * Buscar mensagem completa
 * GET /api/email/message/:messageId?accountId=xxx&uid=123&folder=INBOX
 */
export async function getMessage(request, env) {
  try {
    const userId = request.userId;
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const uid = parseInt(url.searchParams.get('uid'), 10);
    const folder = url.searchParams.get('folder') || 'INBOX';

    if (!accountId || !uid) {
      return json({ error: 'accountId e uid são obrigatórios' }, { status: 400 });
    }

    // Buscar conta e verificar permissão
    const account = await env.DB.prepare(`
      SELECT * FROM email_accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Buscar mensagem via IMAP (com cache para anexos)
    const result = await corporateEmailService.fetchMessage(account, uid, folder, env);

    if (!result.success) {
      return json({ error: result.error || 'Erro ao buscar mensagem' }, { status: 500 });
    }

    // Disparar webhook de mensagem visualizada
    await triggerWebhook(env, 'email.viewed', {
      accountId,
      userId,
      uid,
      folder,
      messageId: result.message.messageId
    });

    return json({
      success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Erro ao buscar mensagem:', error);
    return json({ error: error.message || 'Erro ao buscar mensagem' }, { status: 500 });
  }
}

/**
 * Enviar email
 * POST /api/email/send
 * Aceita JSON ou FormData (com anexos)
 */
export async function sendEmail(request, env) {
  try {
    const userId = request.userId;
    const contentType = request.headers.get('content-type') || '';

    let accountId, to, subject, html, text, attachments = [];

    // Verificar se é FormData (com anexos)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      accountId = formData.get('accountId');
      to = formData.get('to');
      subject = formData.get('subject');
      html = formData.get('html') || '';
      text = formData.get('text') || null;

      // Processar anexos do FormData
      const attachmentFiles = formData.getAll('attachments');
      attachments = [];
      
      for (const file of attachmentFiles) {
        if (file && typeof file.arrayBuffer === 'function') {
          // File/Blob do browser
          const buffer = Buffer.from(await file.arrayBuffer());
          attachments.push({
            filename: file.name || 'anexo',
            content: buffer,
            contentType: file.type || 'application/octet-stream',
            size: file.size || buffer.length
          });
        } else if (file && file.stream) {
          // Stream
          attachments.push({
            filename: file.name || 'anexo',
            content: file.stream(),
            contentType: file.type || 'application/octet-stream',
            size: file.size || 0
          });
        }
      }
    } else {
      // JSON normal
      const body = await request.json();
      accountId = body.accountId;
      to = body.to;
      subject = body.subject;
      html = body.html || '';
      text = body.text || null;
      attachments = body.attachments || [];
    }

    if (!accountId || !to || !subject) {
      return json({ error: 'accountId, to e subject são obrigatórios' }, { status: 400 });
    }

    // Buscar conta e verificar permissão
    const account = await env.DB.prepare(`
      SELECT * FROM email_accounts WHERE id = ? AND user_id = ? AND is_active = 1
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada ou inativa' }, { status: 404 });
    }

    // Enviar email via SMTP
    const result = await corporateEmailService.sendEmail(
      accountId,
      account,
      to,
      subject,
      html,
      text,
      attachments
    );

    if (!result.success) {
      return json({ error: result.error || 'Erro ao enviar email' }, { status: 500 });
    }

    logger.info(`Email enviado de ${account.email} para ${to}${attachments.length > 0 ? ` (${attachments.length} anexos)` : ''}`);

    // Disparar webhook de email enviado
    try {
      await triggerWebhook(env, 'email.sent', {
        accountId,
        userId,
        to,
        subject,
        messageId: result.messageId,
        hasAttachments: attachments.length > 0
      });
    } catch (webhookError) {
      logger.warn('Erro ao disparar webhook:', webhookError);
      // Não falhar o envio por causa do webhook
    }

    return json({
      success: true,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      attachmentsCount: attachments.length
    });
  } catch (error) {
    logger.error('Erro ao enviar email:', error);
    return json({ error: error.message || 'Erro ao enviar email' }, { status: 500 });
  }
}

/**
 * Marcar mensagem como lida
 * POST /api/email/read
 */
export async function markAsRead(request, env) {
  try {
    const userId = request.userId;
    const { accountId, uid, folder } = await request.json();

    if (!accountId || uid === undefined) {
      return json({ error: 'accountId e uid são obrigatórios' }, { status: 400 });
    }

    // Buscar conta e verificar permissão
    const account = await env.DB.prepare(`
      SELECT * FROM email_accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Marcar como lida via IMAP
    const success = await corporateEmailService.markAsRead(account, uid, folder || 'INBOX');

    if (!success) {
      return json({ error: 'Erro ao marcar mensagem como lida' }, { status: 500 });
    }

    // Atualizar cache
    try {
      const messageId = `local-${uid}`;
      await env.DB.prepare(`
        UPDATE email_messages 
        SET is_read = 1, updated_at = ?
        WHERE email_account_id = ? AND uid = ? AND folder = ?
      `).bind(new Date().toISOString(), accountId, uid, folder || 'INBOX').run();
    } catch (cacheError) {
      logger.warn('Erro ao atualizar cache (não crítico):', cacheError);
    }

    // Disparar webhook
    await triggerWebhook(env, 'email.read', {
      accountId,
      userId,
      uid,
      folder: folder || 'INBOX'
    });

    return json({ success: true });
  } catch (error) {
    logger.error('Erro ao marcar mensagem como lida:', error);
    return json({ error: error.message || 'Erro ao marcar como lida' }, { status: 500 });
  }
}

/**
 * Deletar mensagem
 * DELETE /api/email/message/:uid?accountId=xxx&folder=INBOX
 */
export async function deleteMessage(request, env) {
  try {
    const userId = request.userId;
    const url = new URL(request.url);
    
    // Extrair UID do path ou query string
    const pathParts = url.pathname.split('/');
    const uidFromPath = pathParts[pathParts.length - 1];
    const uid = parseInt(uidFromPath !== 'message' ? uidFromPath : url.searchParams.get('uid'), 10);
    const accountId = url.searchParams.get('accountId');
    const folder = url.searchParams.get('folder') || 'INBOX';

    if (!accountId || uid === undefined) {
      return json({ error: 'accountId e uid são obrigatórios' }, { status: 400 });
    }

    // Buscar conta e verificar permissão
    const account = await env.DB.prepare(`
      SELECT * FROM email_accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Deletar mensagem via IMAP
    const success = await corporateEmailService.deleteMessage(account, uid, folder);

    if (!success) {
      return json({ error: 'Erro ao deletar mensagem' }, { status: 500 });
    }

    // Atualizar cache
    try {
      await env.DB.prepare(`
        UPDATE email_messages 
        SET is_deleted = 1, updated_at = ?
        WHERE email_account_id = ? AND uid = ? AND folder = ?
      `).bind(new Date().toISOString(), accountId, uid, folder).run();
    } catch (cacheError) {
      logger.warn('Erro ao atualizar cache (não crítico):', cacheError);
    }

    // Disparar webhook
    await triggerWebhook(env, 'email.deleted', {
      accountId,
      userId,
      uid,
      folder
    });

    return json({ success: true });
  } catch (error) {
    logger.error('Erro ao deletar mensagem:', error);
    return json({ error: error.message || 'Erro ao deletar mensagem' }, { status: 500 });
  }
}

/**
 * Remover conta de email
 * DELETE /api/email/accounts/:id
 */
export async function deleteEmailAccount(request, env) {
  try {
    const userId = request.userId;
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const accountId = pathParts[pathParts.length - 1];

    if (!accountId) {
      return json({ error: 'ID da conta é obrigatório' }, { status: 400 });
    }

    // Verificar permissão
    const account = await env.DB.prepare(`
      SELECT id FROM email_accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Deletar conta (CASCADE deletará mensagens e anexos)
    await env.DB.prepare('DELETE FROM email_accounts WHERE id = ?').bind(accountId).run();

    logger.info(`Conta de email deletada: ${accountId} pelo usuário ${userId}`);

    return json({ success: true });
  } catch (error) {
    logger.error('Erro ao deletar conta de email:', error);
    return json({ error: error.message || 'Erro ao deletar conta' }, { status: 500 });
  }
}

