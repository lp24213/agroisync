import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User } from 'lucide-react';

const RouteGuard = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { isAuthenticated, checkIsAdmin, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-slate-600">Verificando permissões...</p>
        </motion.div>
      </div>
    );
  }

  // Verificar se requer autenticação
  if (requireAuth && !isAuthenticated()) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Verificar se requer admin
  if (requireAdmin && !checkIsAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center py-12 px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Acesso Negado
          </h2>
          
          <p className="text-slate-600 mb-6">
            Você não tem permissão para acessar esta área. 
            Esta página é restrita apenas para administradores.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              Voltar
            </button>
            
            <button
              onClick={() => window.location.href = '/admin-login'}
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
            >
              Acessar como Admin
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Verificar se usuário comum está tentando acessar área admin
  if (location.pathname.startsWith('/admin') && !checkIsAdmin()) {
    return (
      <Navigate 
        to="/admin-login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Verificar se admin está tentando acessar área de usuário comum
  if (checkIsAdmin() && !location.pathname.startsWith('/admin') && requireAuth) {
    return (
      <Navigate 
        to="/admin-panel" 
        replace 
      />
    );
  }

  // Renderizar conteúdo se todas as verificações passarem
  return children;
};

export default RouteGuard;
