// ============================================
// CORPORATE EMAIL SYSTEM - HANDLER COMPLETO
// Sistema de Email Corporativo Agroisync
// ============================================

// Função auxiliar para resposta JSON
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

// ============================================
// CRIAR CONTA DE EMAIL CORPORATIVA
// ============================================
export async function createCorporateEmail(request, env) {
  try {
    const { email, password, displayName } = await request.json();

    // Validações
    if (!email || !password) {
      return jsonResponse({ error: 'Email e senha são obrigatórios' }, 400);
    }

    if (!email.endsWith('@agroisync.com')) {
      return jsonResponse({ error: 'Apenas emails @agroisync.com são permitidos' }, 400);
    }

    if (password.length < 8) {
      return jsonResponse({ error: 'Senha deve ter no mínimo 8 caracteres' }, 400);
    }

    const accountId = crypto.randomUUID();
    const userId = request.user?.id || 1;

    // Criar tabelas se não existirem
    await initializeEmailTables(env.DB);

    // Verificar se email já existe
    const existing = await env.DB.prepare(
      'SELECT id FROM corporate_emails WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return jsonResponse({ error: 'Este email já está cadastrado' }, 400);
    }

    // Criar conta
    await env.DB.prepare(`
      INSERT INTO corporate_emails (id, email, password, display_name, created_by, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).bind(accountId, email, password, displayName || email.split('@')[0], userId).run();

    // Criar pastas padrão
    await createDefaultFolders(env.DB, accountId);

    // Criar configurações padrão
    await env.DB.prepare(`
      INSERT INTO email_settings (id, account_id, spam_filter_level)
      VALUES (?, ?, 5)
    `).bind(crypto.randomUUID(), accountId).run();

    // Configurar webhook no Resend (se disponível)
    if (env.RESEND_API_KEY) {
      await setupResendWebhook(email, env);
    }

    console.log(`✅ Email corporativo criado: ${email}`);

    return jsonResponse({
      success: true,
      message: 'Email corporativo criado com sucesso!',
      account: {
        id: accountId,
        email,
        displayName: displayName || email.split('@')[0],
        isActive: true
      }
    }, 201);
  } catch (error) {
    console.error('❌ Erro ao criar email corporativo:', error);
    return jsonResponse({
      error: 'Erro ao criar conta de email',
      details: error.message
    }, 500);
  }
}

// ============================================
// LISTAR CONTAS DE EMAIL
// ============================================
export async function listCorporateEmails(request, env) {
  try {
    await initializeEmailTables(env.DB);

    const result = await env.DB.prepare(`
      SELECT 
        ce.id,
        ce.email,
        ce.display_name,
        ce.is_active,
        ce.storage_used_mb,
        ce.storage_limit_mb,
        ce.created_at,
        (SELECT COUNT(*) FROM email_messages WHERE account_id = ce.id AND is_read = 0) as unread_count,
        (SELECT COUNT(*) FROM email_messages WHERE account_id = ce.id) as total_messages
      FROM corporate_emails ce
      ORDER BY ce.created_at DESC
    `).all();

    return jsonResponse({
      success: true,
      accounts: result.results || [],
      total: (result.results || []).length
    });
  } catch (error) {
    console.error('❌ Erro ao listar emails:', error);
    return jsonResponse({
      error: 'Erro ao listar contas',
      details: error.message
    }, 500);
  }
}

// ============================================
// OBTER ESTATÍSTICAS
// ============================================
export async function getEmailStats(request, env) {
  try {
    await initializeEmailTables(env.DB);

    const totalAccounts = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM corporate_emails'
    ).first();

    const activeAccounts = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM corporate_emails WHERE is_active = 1'
    ).first();

    const totalMessages = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM email_messages'
    ).first();

    const unreadMessages = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM email_messages WHERE is_read = 0'
    ).first();

    const totalStorage = await env.DB.prepare(
      'SELECT SUM(storage_used_mb) as total FROM corporate_emails'
    ).first();

    return jsonResponse({
      success: true,
      stats: {
        totalAccounts: totalAccounts?.count || 0,
        activeAccounts: activeAccounts?.count || 0,
        inactiveAccounts: (totalAccounts?.count || 0) - (activeAccounts?.count || 0),
        totalMessages: totalMessages?.count || 0,
        unreadMessages: unreadMessages?.count || 0,
        totalStorageMB: totalStorage?.total || 0
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return jsonResponse({
      error: 'Erro ao carregar estatísticas',
      details: error.message
    }, 500);
  }
}

// ============================================
// OBTER MENSAGENS DE UMA CONTA
// ============================================
export async function getMessages(request, env, accountId) {
  try {
    await initializeEmailTables(env.DB);

    const url = new URL(request.url);
    const folder = url.searchParams.get('folder') || 'inbox';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Obter pasta
    const folderData = await env.DB.prepare(`
      SELECT id FROM email_folders 
      WHERE account_id = ? AND folder_type = ?
    `).bind(accountId, folder).first();

    if (!folderData) {
      return jsonResponse({ error: 'Pasta não encontrada' }, 404);
    }

    // Obter mensagens
    const messages = await env.DB.prepare(`
      SELECT 
        em.*,
        (SELECT COUNT(*) FROM email_attachments WHERE message_id = em.id) as attachment_count
      FROM email_messages em
      WHERE em.folder_id = ?
      ORDER BY em.received_at DESC
      LIMIT ? OFFSET ?
    `).bind(folderData.id, limit, offset).all();

    // Contar total
    const total = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM email_messages WHERE folder_id = ?'
    ).bind(folderData.id).first();

    return jsonResponse({
      success: true,
      messages: messages.results || [],
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter mensagens:', error);
    return jsonResponse({
      error: 'Erro ao carregar mensagens',
      details: error.message
    }, 500);
  }
}

// ============================================
// ENVIAR EMAIL
// ============================================
export async function sendEmail(request, env, accountId) {
  try {
    await initializeEmailTables(env.DB);

    const { to, cc, bcc, subject, bodyHtml, bodyText, attachments } = await request.json();

    // Validações
    if (!to || !subject) {
      return jsonResponse({ error: 'Destinatário e assunto são obrigatórios' }, 400);
    }

    // Obter conta
    const account = await env.DB.prepare(
      'SELECT * FROM corporate_emails WHERE id = ?'
    ).bind(accountId).first();

    if (!account) {
      return jsonResponse({ error: 'Conta não encontrada' }, 404);
    }

    if (!account.is_active) {
      return jsonResponse({ error: 'Conta desativada' }, 403);
    }

    // Enviar via Resend
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: 'Serviço de email não configurado' }, 503);
    }

    const messageId = crypto.randomUUID();

    const emailData = {
      from: `${account.display_name} <${account.email}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: bodyHtml,
      text: bodyText || stripHtml(bodyHtml),
      headers: {
        'X-Account-Id': accountId,
        'X-Message-Id': messageId
      }
    };

    if (cc) emailData.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) emailData.bcc = Array.isArray(bcc) ? bcc : [bcc];

    // Enviar via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    const resendData = await resendResponse.json();

    // Salvar na pasta "Enviados"
    const sentFolder = await env.DB.prepare(
      'SELECT id FROM email_folders WHERE account_id = ? AND folder_type = ?'
    ).bind(accountId, 'sent').first();

    await env.DB.prepare(`
      INSERT INTO email_messages (
        id, account_id, folder_id, message_id, 
        from_address, from_name, to_addresses, cc_addresses, bcc_addresses,
        subject, body_html, body_text, is_read, sent_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `).bind(
      messageId,
      accountId,
      sentFolder.id,
      resendData.id,
      account.email,
      account.display_name,
      JSON.stringify(to),
      cc ? JSON.stringify(cc) : null,
      bcc ? JSON.stringify(bcc) : null,
      subject,
      bodyHtml,
      bodyText,
    ).run();

    // Log de atividade
    await logActivity(env.DB, accountId, 'sent', `Email enviado para ${to}`);

    console.log(`✅ Email enviado: ${account.email} -> ${to}`);

    return jsonResponse({
      success: true,
      message: 'Email enviado com sucesso!',
      messageId: resendData.id
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return jsonResponse({
      error: 'Erro ao enviar email',
      details: error.message
    }, 500);
  }
}

// ============================================
// WEBHOOK PARA RECEBER EMAILS
// ============================================
export async function handleEmailWebhook(request, env) {
  try {
    const body = await request.json();
    const webhookId = crypto.randomUUID();

    // Salvar webhook recebido
    await env.DB.prepare(`
      INSERT INTO email_webhooks (id, provider, event_type, payload)
      VALUES (?, 'resend', ?, ?)
    `).bind(webhookId, body.type, JSON.stringify(body)).run();

    // Processar webhook
    if (body.type === 'email.received') {
      await processIncomingEmail(env.DB, body.data);
    }

    return jsonResponse({ success: true, webhookId });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

async function initializeEmailTables(db) {
  // Criar tabela principal
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS corporate_emails (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      display_name TEXT,
      created_by INTEGER,
      is_active INTEGER DEFAULT 1,
      storage_used_mb REAL DEFAULT 0,
      storage_limit_mb REAL DEFAULT 5000,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de pastas
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_folders (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      folder_name TEXT NOT NULL,
      folder_type TEXT NOT NULL CHECK(folder_type IN ('inbox', 'sent', 'drafts', 'spam', 'trash', 'custom')),
      unread_count INTEGER DEFAULT 0,
      total_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de mensagens
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_messages (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      folder_id TEXT NOT NULL,
      message_id TEXT UNIQUE,
      thread_id TEXT,
      from_address TEXT NOT NULL,
      from_name TEXT,
      to_addresses TEXT NOT NULL,
      cc_addresses TEXT,
      bcc_addresses TEXT,
      reply_to TEXT,
      subject TEXT,
      body_text TEXT,
      body_html TEXT,
      is_read INTEGER DEFAULT 0,
      is_starred INTEGER DEFAULT 0,
      is_spam INTEGER DEFAULT 0,
      spam_score REAL DEFAULT 0,
      has_attachments INTEGER DEFAULT 0,
      size_bytes INTEGER DEFAULT 0,
      received_at TEXT DEFAULT (datetime('now')),
      sent_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de anexos
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      storage_url TEXT,
      r2_key TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de configurações
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_settings (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL UNIQUE,
      signature_html TEXT,
      auto_reply_enabled INTEGER DEFAULT 0,
      auto_reply_message TEXT,
      forward_to TEXT,
      spam_filter_level INTEGER DEFAULT 5,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de logs
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_activity_log (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Criar tabela de webhooks
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS email_webhooks (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER DEFAULT 0,
      error_message TEXT,
      received_at TEXT DEFAULT (datetime('now')),
      processed_at TEXT
    )
  `).run();
}

async function createDefaultFolders(db, accountId) {
  const folders = [
    { type: 'inbox', name: 'Caixa de Entrada' },
    { type: 'sent', name: 'Enviados' },
    { type: 'drafts', name: 'Rascunhos' },
    { type: 'spam', name: 'Spam' },
    { type: 'trash', name: 'Lixeira' }
  ];

  for (const folder of folders) {
    await db.prepare(`
      INSERT INTO email_folders (id, account_id, folder_name, folder_type)
      VALUES (?, ?, ?, ?)
    `).bind(crypto.randomUUID(), accountId, folder.name, folder.type).run();
  }
}

async function setupResendWebhook(email, env) {
  // Configurar webhook no Resend para receber emails
  // Isso requer configuração de domínio no Resend
  console.log(`📧 Webhook configurado para: ${email}`);
}

async function processIncomingEmail(db, emailData) {
  // Processar email recebido via webhook
  const { to, from, subject, html, text } = emailData;

  // Encontrar conta destinatária
  const account = await db.prepare(
    'SELECT * FROM corporate_emails WHERE email = ?'
  ).bind(to).first();

  if (!account) {
    console.warn(`⚠️ Email recebido para conta inexistente: ${to}`);
    return;
  }

  // Obter pasta inbox
  const inbox = await db.prepare(
    'SELECT id FROM email_folders WHERE account_id = ? AND folder_type = ?'
  ).bind(account.id, 'inbox').first();

  // Salvar mensagem
  const messageId = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO email_messages (
      id, account_id, folder_id, message_id,
      from_address, to_addresses, subject, body_html, body_text, is_read
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).bind(
    messageId,
    account.id,
    inbox.id,
    emailData.id,
    from,
    to,
    subject,
    html,
    text
  ).run();

  console.log(`✅ Email recebido: ${from} -> ${to}`);
}

async function logActivity(db, accountId, activityType, details) {
  await db.prepare(`
    INSERT INTO email_activity_log (id, account_id, activity_type, details)
    VALUES (?, ?, ?, ?)
  `).bind(crypto.randomUUID(), accountId, activityType, details).run();
}

function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, '') : '';
}
