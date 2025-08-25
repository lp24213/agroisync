import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requirePlan = false }) => {
  const { user, loading } = useAuth();
  const [planStatus, setPlanStatus] = useState(null);
  const [checkingPlan, setCheckingPlan] = useState(false);

  useEffect(() => {
    if (requirePlan && user && !checkingPlan) {
      checkPlanStatus();
    }
  }, [user, requirePlan, checkingPlan]);

  const checkPlanStatus = async () => {
    setCheckingPlan(true);
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const hasActivePlan = userData.subscriptions?.store?.active || 
                            userData.subscriptions?.agroconecta?.active;
        setPlanStatus(hasActivePlan);
      } else {
        setPlanStatus(false);
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
      setPlanStatus(false);
    } finally {
      setCheckingPlan(false);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin mas usuário não é admin
  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Se requer plano ativo mas ainda está verificando
  if (requirePlan && checkingPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando plano...</p>
        </div>
      </div>
    );
  }

  // Se requer plano ativo mas usuário não tem
  if (requirePlan && planStatus === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Funcionalidade Bloqueada
          </h2>
          <p className="text-gray-600 mb-6">
            Para acessar esta funcionalidade, você precisa ter um plano ativo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/planos'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📋 Ver Planos Disponíveis
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se chegou até aqui, usuário tem acesso
  return children;
};

export default ProtectedRoute;
