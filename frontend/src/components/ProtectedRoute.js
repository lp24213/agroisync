import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requirePlan = false, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota requer admin e o usuário não é admin
  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-6">
              Esta área é restrita apenas para administradores autorizados.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Voltar
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Ir para o Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se a rota requer plano ativo e o usuário não tem plano
  if (requirePlan && !user.isAdmin) {
    // Verificar se o usuário tem plano ativo
    const hasActivePlan = user.activePlan || user.subscriptionStatus === 'active';
    
    if (!hasActivePlan) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Funcionalidade Bloqueada</h2>
              <p className="text-gray-600 mb-6">
                Esta funcionalidade requer um plano ativo. Ative um plano para continuar.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/planos'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Ver Planos
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Se todas as verificações passaram, renderizar o conteúdo
  return children;
};

export default ProtectedRoute;
