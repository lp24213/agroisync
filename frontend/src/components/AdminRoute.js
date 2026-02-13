import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { getAuthToken } from '../config/constants';

/**
 * Componente para proteger rotas que requerem privilégios de administrador
 * Verifica se o usuário é admin através do token JWT
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        const token = getAuthToken();
        
        if (!token) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Decodificar token JWT
        const parts = token.split('.');
        if (parts.length !== 3) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const payload = JSON.parse(atob(parts[1]));
        
        // Verificar se é admin
        // Pode estar em isAdmin, role === 'admin', role === 'super-admin', ou email específico
        const adminEmail = 'luispaulodeoliveira@agrotm.com.br';
        const userEmail = payload.email?.toLowerCase() || '';
        
        const isAdminUser = 
          payload.isAdmin === true ||
          payload.role === 'admin' ||
          payload.role === 'super-admin' ||
          userEmail === adminEmail.toLowerCase();

        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Erro ao verificar permissões de admin:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600'>
            <Shield className='h-8 w-8 animate-spin text-white' />
          </div>
          <p className='font-medium text-gray-300'>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='text-center p-8 bg-gray-800 rounded-lg shadow-2xl border border-red-500/30'>
          <Lock className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h1 className='mb-2 text-2xl font-bold text-white'>Acesso Negado</h1>
          <p className='text-gray-400 mb-4'>Você não tem permissão para acessar esta página.</p>
          <p className='text-sm text-gray-500'>Apenas administradores podem acessar o painel de email corporativo.</p>
        </div>
      </div>
    );
  }

  return children;
}

