import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, removeAuthToken } from '../config/constants.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const validateToken = () => {
      try {
        // Usar helper centralizado que verifica ambos os nomes
        const token = getAuthToken();
        if (!token) {
          setIsValidToken(false);
          setTokenLoading(false);
          return;
        }

        // Decodificar apenas para checar expiração (sem assumir validade criptográfica)
        const parts = token.split('.');
        if (parts.length !== 3) {
          removeAuthToken();
          setIsValidToken(false);
        } else {
          try {
            const payload = JSON.parse(atob(parts[1]));
            if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) {
              removeAuthToken();
              setIsValidToken(false);
            } else {
              setIsValidToken(true);
            }
          } catch {
            removeAuthToken();
            setIsValidToken(false);
          }
        }
      } catch (error) {
        // Erro ao validar, remover token
        removeAuthToken();
        setIsValidToken(false);
      } finally {
        setTokenLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading || tokenLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600'>
            <svg className='h-8 w-8 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </div>
          <p className='font-medium text-gray-600'>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isValidToken) {
    // Redirecionar para login com parâmetros de query
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}&t=${timestamp}&id=${randomId}`;

    return <Navigate to={loginUrl} replace />;
  }

  return children;
}
