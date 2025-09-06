import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPlan = false }) => {
  const { user, isAuthenticated, hasActivePlan, checkIsAdmin } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se precisar de plano ativo e não tiver
  if (requiredPlan && !hasActivePlan()) {
    return <Navigate to="/plans" state={{ from: location }} replace />;
  }

  // Se precisar de role específico
  if (requiredRole) {
    // Verificar se é admin
    if (requiredRole === 'admin' && !checkIsAdmin()) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Verificar outros roles (buyer, seller, driver)
    if (user && user.role && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;