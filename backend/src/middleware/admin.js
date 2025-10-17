
// Middleware para verificar se o usuário é admin (Worker + D1)
export async function requireAdmin(request, env) {
  try {
    const userId = request.user?.id || request.userId;
    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: 'Usuário não autenticado' }), { status: 401 });
    }
    // Buscar usuário no banco
    const user = await env.DB.prepare('SELECT id, email, name, is_admin, admin_permissions FROM users WHERE id = ?').bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Usuário não encontrado' }), { status: 401 });
    }
    if (!user.is_admin) {
      return new Response(JSON.stringify({ success: false, message: 'Acesso negado. Apenas administradores podem acessar esta área.' }), { status: 403 });
    }
    // Adiciona info de admin ao request
    request.admin = {
      id: user.id,
      email: user.email,
      name: user.name,
      permissions: user.admin_permissions ? JSON.parse(user.admin_permissions) : []
    };
    return null; // continua para o próximo handler
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Erro interno do servidor', details: error.message }), { status: 500 });
  }
}


// Middleware para verificar permissões específicas de admin (Worker + D1)
export function requireAdminPermission(permission) {
  return (request) => {
    if (!request.admin) {
      return new Response(JSON.stringify({ success: false, message: 'Usuário não autenticado como admin' }), { status: 401 });
    }
    const perms = request.admin.permissions || [];
    if (!perms.includes(permission) && !perms.includes('*')) {
      return new Response(JSON.stringify({ success: false, message: `Permissão '${permission}' necessária para esta ação` }), { status: 403 });
    }
    return null; // continua para o próximo handler
  };
}


// Middleware para log de auditoria automático (Worker + D1)
export function auditLog(action, resource) {
  return async (request, env, resourceId = null, details = null) => {
    try {
      await env.DB.prepare('INSERT INTO audit_logs (user_id, user_email, action, resource, resource_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(
          request.user?.id || request.userId,
          request.user?.email || '',
          action,
          resource,
          resourceId,
          details || `Admin action: ${action} on ${resource}`,
          new Date().toISOString()
        ).run();
      return null;
    } catch (error) {
      // Apenas loga erro, não bloqueia fluxo
      return null;
    }
  };
}
