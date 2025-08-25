import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false, requirePlan = false }) => {
  const { user, loading, isAdmin } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin e usuário não é admin, redirecionar para login
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Se requer plano ativo (implementar lógica quando necessário)
  if (requirePlan) {
    // Por enquanto, permitir acesso para usuários logados
    // Implementar verificação de plano quando necessário
  }

  // Usuário autenticado e autorizado
  return children;
};

export default ProtectedRoute;
