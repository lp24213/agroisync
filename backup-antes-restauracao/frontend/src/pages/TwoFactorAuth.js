import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const TwoFactorAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
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
  return (
    <div className='from-dark-primary via-dark-secondary to-dark-tertiary min-h-screen bg-gradient-to-br p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Autenticação de Dois Fatores</h1>
        <p className='text-lg leading-relaxed text-gray-400'>
          Digite o código de verificação enviado para seu dispositivo.
        </p>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
