import { json } from '../utils/respond.js';

/**
 * Middleware para verificar se usuário é administrador
 * Verifica no token JWT se isAdmin = true ou role = 'admin'
 * Deve ser usado APÓS verifyToken
 */
export function requireAdmin(request, env) {
  try {
    // verifyToken já adicionou request.userId, request.isAdmin e request.user
    const isAdmin = request.isAdmin === true || 
                    request.user?.role === 'admin' || 
                    request.user?.role === 'super-admin' ||
                    request.user?.email?.toLowerCase() === 'luispaulodeoliveira@agrotm.com.br';

    if (!isAdmin) {
      return json({ 
        success: false,
        error: 'Acesso negado. Permissão de administrador necessária.' 
      }, { status: 403 });
    }

    return null; // Continua para o próximo handler
  } catch (error) {
    console.error('Erro ao verificar permissões de admin:', error);
    return json({ 
      success: false,
      error: 'Erro ao verificar permissões' 
    }, { status: 500 });
  }
}

