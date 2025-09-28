import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const generateCryptoHash = useCallback(async () => {
    const pageData = {
      path: location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('sessionId') || Math.random().toString(36).substring(2, 15),
      random: Math.random().toString(36).substring(2, 15),
      clickCount: Date.now() + Math.random()
    };

    let cryptoHash;
    
    try {
      // Tentar usar Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(pageData));
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      cryptoHash = hashHex.substring(0, 32);
    } catch (error) {
      // Fallback: gerar hash local simples
      cryptoHash = Math.random().toString(36).substring(2, 34).toLowerCase();
    }
    
    return cryptoHash;
  }, [location.pathname]);

  const updateCryptoURL = useCallback(async () => {
    try {
      // Verificar se já tem hash na URL
      const pathParts = location.pathname.split('/');
      const hasHash = pathParts.length > 1 && pathParts[pathParts.length - 1].length === 32;
      
      // Rotas que NÃO devem ter criptografia (rotas estáticas e especiais)
      const excludeCrypto = [
        '/payment/success', '/payment/cancel', '/unauthorized'
      ];
      
      const shouldExclude = excludeCrypto.some(route => location.pathname.startsWith(route));
      
      // Se deve excluir da criptografia, não fazer nada
      if (shouldExclude) {
        return;
      }
      
      // Aplicar criptografia em TODAS as outras rotas
      if (!hasHash) {
        const cryptoHash = await generateCryptoHash();
        const newPath = `${location.pathname}/${cryptoHash}`;
        // Usar replace: true para evitar loops de redirecionamento
        navigate(newPath, { replace: true });
      }
      
    } catch (error) {
      console.error('Erro ao gerar URL criptografada:', error);
    }
  }, [location.pathname, navigate, generateCryptoHash]);

  useEffect(() => {
    updateCryptoURL();
  }, [updateCryptoURL]);

  // Interceptar mudanças de rota para aplicar criptografia
  useEffect(() => {
    const handleRouteChange = () => {
      // Rotas que NÃO devem ter criptografia
      const excludeCrypto = [
        '/payment/success', '/payment/cancel', '/unauthorized'
      ];
      
      const shouldExclude = excludeCrypto.some(route => location.pathname.startsWith(route));
      
      // Aplicar criptografia em todas as rotas exceto as excluídas
      if (!shouldExclude) {
        // Usar setTimeout para evitar loops infinitos
        setTimeout(() => {
          updateCryptoURL();
        }, 50);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [location.pathname, updateCryptoURL]);

  return children;
};

export default DynamicCryptoURL;
