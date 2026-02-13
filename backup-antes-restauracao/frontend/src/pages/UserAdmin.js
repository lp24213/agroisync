
import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const UserAdmin = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
    // Checagem simples de admin (ajuste conforme sua lógica de roles)
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
          <p className='text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Lock className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Acesso Negado</h1>
          <p className='text-gray-600'>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default UserAdmin;
