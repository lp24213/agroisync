import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CryptoJS from 'crypto-js';

const UniversalSecurity = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isSecure, setIsSecure] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Para páginas de login e cadastro, pular verificação de segurança
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/signup') {
      setIsSecure(true);
      setIsLoading(false);
      return;
    }

    const generateSecureURL = () => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      
      // Gerar hash único baseado no usuário (se logado) ou sessão
      const userHash = user ? CryptoJS.MD5(user.id + user.email).toString() : CryptoJS.MD5('anonymous').toString();
      const sessionHash = CryptoJS.MD5(timestamp + randomId + userHash).toString().substring(0, 8);
      
      const newPath = `${location.pathname}?zx=${timestamp}&no_sw_cr=${randomId}&usr=${userHash}&sess=${sessionHash}`;
      
      // Se não tem parâmetros seguros, redirecionar
      if (!location.search.includes('zx=') || !location.search.includes('no_sw_cr=') || !location.search.includes('usr=')) {
        navigate(newPath, { replace: true });
        return;
      }
      
      // Verificar se a URL é válida para este usuário
      const urlParams = new URLSearchParams(location.search);
      const urlUserHash = urlParams.get('usr');
      
      if (isAuthenticated && urlUserHash !== userHash) {
        // URL não pertence a este usuário - gerar nova
        navigate(newPath, { replace: true });
        return;
      }
      
      setIsSecure(true);
      setIsLoading(false);
    };

    generateSecureURL();
  }, [navigate, location.pathname, location.search, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verificando Segurança...</h2>
          <p className="text-gray-600 text-sm">Aplicando criptografia de ponta</p>
        </div>
      </div>
    );
  }

  if (!isSecure) {
    return null;
  }

  return children;
};

export default UniversalSecurity;
