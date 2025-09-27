import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);

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
      setIsGenerating(true);
      
      // SEMPRE gerar novo hash a cada chamada
      const cryptoHash = await generateCryptoHash();
      
      // Construir nova URL com hash
      const newPath = `${location.pathname}/${cryptoHash}`;
      
      // Navegar para a nova URL com hash
      navigate(newPath, { replace: true });
      
      // Loading mínimo
      setTimeout(() => {
        setIsGenerating(false);
      }, 10);
    } catch (error) {
      console.error('Erro ao gerar URL criptografada:', error);
      setIsGenerating(false);
    }
  }, [location.pathname, navigate, generateCryptoHash]);

  useEffect(() => {
    updateCryptoURL();
  }, [updateCryptoURL]);

  // Interceptar cliques em links para regenerar URL
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target.closest('a');
      if (target && target.href && !target.href.includes('http') && !target.href.includes('mailto:')) {
        // Regenerar URL imediatamente
        updateCryptoURL();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [updateCryptoURL]);

  // Regenerar URL periodicamente (a cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      updateCryptoURL();
    }, 5000);

    return () => clearInterval(interval);
  }, [updateCryptoURL]);

  // Interceptar mudanças de rota
  useEffect(() => {
    const handleRouteChange = () => {
      updateCryptoURL();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [updateCryptoURL]);

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Criptografando URL...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default DynamicCryptoURL;
