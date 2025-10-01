import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CryptoRoute = ({ children }) => {
  const { path, cryptoHash } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Verificar se o hash é válido
    const isValidHash = /^\d+_[a-z0-9]+$/i.test(cryptoHash) && cryptoHash.length >= 15;
    
    if (!isValidHash) {
      // Se hash inválido, redirecionar para a rota limpa
      navigate(`/${path}`, { replace: true });
      return;
    }

    setIsValid(true);
  }, [cryptoHash, path, navigate]);

  if (!isValid) {
    return null; // Aguardar validação
  }

  return children;
};

export default CryptoRoute;
