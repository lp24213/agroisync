import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CryptoRouteHandler = ({ children }) => {
  const { cryptoHash } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateCryptoRoute = () => {
      try {
        // Verificar se o hash é válido - formato mais flexível
        if (!cryptoHash || !/^[a-z0-9_-]+$/i.test(cryptoHash)) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Verificar se o usuário está autenticado para rotas protegidas
        const protectedRoutes = ['/dashboard', '/user-dashboard', '/messaging', '/admin', '/useradmin', '/crypto-routes'];
        const isProtectedRoute = protectedRoutes.some(route =>
          location.pathname.includes(route)
        );

        if (isProtectedRoute && !user) {
          // Redirecionar para login se não estiver autenticado
          navigate('/login', { replace: true });
          return;
        }

        // Hash válido - aceitar qualquer formato alfanumérico
        setIsValid(true);
        setIsValidating(false);
      } catch (error) {
        console.error('Erro na validação da rota criptografada:', error);
        setIsValid(false);
        setIsValidating(false);
      }
    };

    validateCryptoRoute();
  }, [cryptoHash, location.pathname, user, navigate]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Rota Inválida</h1>
          <p className="text-gray-600 mb-4">A URL criptografada não é válida.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default CryptoRouteHandler;
