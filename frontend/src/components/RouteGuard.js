import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RouteGuard = ({ children, requireAdmin = false, requireAuth = true }) => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Verificar se o usuário está autenticado
        if (requireAuth && !user) {
          // Usuário não autenticado, redirecionar para login
          navigate('/login', { 
            replace: true, 
            state: { from: location.pathname } 
          });
          return;
        }

        // Se requer admin, verificar se o usuário é admin
        if (requireAdmin && !isAdmin) {
          // Usuário não é admin, redirecionar para dashboard
          navigate('/dashboard', { replace: true });
          return;
        }

        // Se não requer admin mas usuário é admin, redirecionar para admin
        if (!requireAdmin && isAdmin && location.pathname === '/dashboard') {
          navigate('/admin', { replace: true });
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        navigate('/login', { replace: true });
      }
    };

    if (!loading) {
      checkAccess();
    }
  }, [user, isAdmin, loading, requireAdmin, requireAuth, navigate, location]);

  // Mostrar loading enquanto verifica
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se chegou até aqui, usuário tem acesso
  return children;
};

export default RouteGuard;
