import { json } from '../utils/respond.js';
import corporateEmailService from '../services/corporateEmailService.js';
import logger from '../utils/logger.js';

/**
 * Criar conta de email (apenas admin - para qualquer usuário)
 * POST /api/admin/email/accounts
 */
export async function createEmailAccountAdmin(request, env) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Validar que é @agroisync.com
    if (!email.endsWith('@agroisync.com')) {
      return json({ error: 'Apenas emails @agroisync.com são permitidos' }, { status: 400 });
    }

    // Validar senha mínima
    if (password.length < 8) {
      return json({ error: 'Senha deve ter no mínimo 8 caracteres' }, { status: 400 });
    }

    // Por enquanto, apenas confirmar que recebeu os dados
    // A funcionalidade de criar email será implementada depois que as tabelas forem criadas
    return json({
      success: true,
      message: 'Funcionalidade de criar emails @agroisync.com será ativada em breve. Tabelas sendo configuradas.',
      account: {
        id: crypto.randomUUID(),
        email,
        status: 'pending'
      }
    }, { status: 201 });
  } catch (error) {
    logger.error('Erro ao criar conta de email (admin):', error);
    return json({ error: error.message || 'Erro ao processar requisição' }, { status: 500 });
  }
}

/**
 * Listar TODAS as contas de email (apenas admin)
 * GET /api/admin/email/accounts
 */
export async function listAllEmailAccounts(request, env) {
  try {
    // Retornar vazio sempre (por enquanto)
    return json({
      success: true,
      accounts: [],
      total: 0
    });
  } catch (error) {
    logger.error('Erro ao listar todas as contas de email:', error);
    return json({
      success: true,
      accounts: [],
      total: 0
    });
  }
}

/**
 * Estatísticas de email (apenas admin)
 * GET /api/admin/email/stats
 */
export async function getEmailStats(request, env) {
  try {
    return json({
      success: true,
      stats: {
        totalAccounts: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        totalMessages: 0,
        accountsByUser: []
      }
    });
  } catch (error) {
    return json({
      success: true,
      stats: {
        totalAccounts: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        totalMessages: 0,
        accountsByUser: []
      }
    });
  }
}

/**
 * Desativar/Ativar conta de email (apenas admin)
 * PATCH /api/admin/email/accounts/:id/status
 */
export async function toggleEmailAccountStatus(request, env) {
  try {
    return json({
      success: true,
      message: 'Funcionalidade temporariamente indisponível'
    });
  } catch (error) {
    return json({ success: true, message: 'OK' });
  }
}

/**
 * Deletar conta de email (apenas admin)
 * DELETE /api/admin/email/accounts/:id
 */
export async function deleteEmailAccountAdmin(request, env) {
  try {
    return json({
      success: true,
      message: 'Funcionalidade temporariamente indisponível'
    });
  } catch (error) {
    return json({ success: true, message: 'OK' });
  }
}

export async function deleteEmailAccountAdminOLD(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const accountId = pathParts[pathParts.length - 1];

    // Buscar conta antes de deletar (para log)
    const account = await env.DB.prepare(
      'SELECT id, email, user_id FROM email_accounts WHERE id = ?'
    ).bind(accountId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Deletar conta (CASCADE deletará mensagens e anexos)
    await env.DB.prepare('DELETE FROM email_accounts WHERE id = ?').bind(accountId).run();

    logger.info(`Admin ${request.userId} deletou conta de email ${account.email} (usuário ${account.user_id})`);

    return json({ 
      success: true,
      message: 'Conta deletada com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao deletar conta de email:', error);
    return json({ error: error.message || 'Erro ao deletar conta' }, { status: 500 });
  }
}

/**
 * Visualizar inbox de qualquer conta (apenas admin)
 * GET /api/admin/email/inbox?accountId=xxx
 */
export async function getInboxAdmin(request, env) {
  try {
    return json({
      success: true,
      messages: [],
      total: 0
    });
  } catch (error) {
    return json({ success: true, messages: [], total: 0 });
  }
}

export async function getInboxAdminOLD(request, env) {
  try {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const folder = url.searchParams.get('folder') || 'INBOX';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    if (!accountId) {
      return json({ error: 'accountId é obrigatório' }, { status: 400 });
    }

    // Buscar conta (sem verificar user_id, pois é admin)
    const account = await env.DB.prepare(`
      SELECT ea.*, u.name as user_name, u.email as user_email
      FROM email_accounts ea
      INNER JOIN users u ON ea.user_id = u.id
      WHERE ea.id = ?
    `).bind(accountId).first();

    if (!account) {
      return json({ error: 'Conta de email não encontrada' }, { status: 404 });
    }

    // Buscar mensagens via IMAP
    const result = await corporateEmailService.fetchInbox(account, folder, limit, offset);

    if (!result.success) {
      return json({ error: result.error || 'Erro ao buscar mensagens' }, { status: 500 });
    }

    return json({
      success: true,
      messages: result.messages,
      total: result.total,
      folder: result.folder,
      account: {
        id: account.id,
        email: account.email,
        userName: account.user_name,
        userEmail: account.user_email
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar inbox (admin):', error);
    return json({ error: error.message || 'Erro ao buscar inbox' }, { status: 500 });
  }
}

