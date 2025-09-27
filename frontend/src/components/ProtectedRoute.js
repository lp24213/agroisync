import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const validateToken = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsValidToken(false);
          setTokenLoading(false);
          return;
        }

        // Verificar se o token é válido (decodificar base64 sem verificar assinatura)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!payload || payload.exp < Date.now() / 1000) {
            localStorage.removeItem('authToken');
            setIsValidToken(false);
          } else {
            setIsValidToken(true);
          }
        } catch (decodeError) {
          localStorage.removeItem('authToken');
          setIsValidToken(false);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsValidToken(false);
      } finally {
        setTokenLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading || tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
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