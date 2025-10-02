import React, { useEffect, useRef, useState, useCallback } from 'react';

const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetId, setWidgetId] = useState(null);

  // Memoizar callbacks para evitar re-renders desnecessários
  const handleVerify = useCallback((token) => {
    if (onVerify) onVerify(token);
  }, [onVerify]);

  const handleError = useCallback((error) => {
    if (onError) onError(error);
  }, [onError]);

  const handleExpire = useCallback(() => {
    if (onExpire) onExpire();
  }, [onExpire]);

  useEffect(() => {
    // Carregar o script do Turnstile se não estiver carregado
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Erro ao carregar Turnstile');
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.turnstile && turnstileRef.current && !widgetId) {
      // Renderizar o Turnstile apenas uma vez
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey || '0x4AAAAAAB3pdjs4jRKvAtaA',
        theme: theme,
        size: 'compact',
        callback: handleVerify,
        'error-callback': handleError,
        'expired-callback': handleExpire
      });
      setWidgetId(id);
    }

    return () => {
      // Limpar widget quando componente for desmontado
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {

            console.warn('Erro ao remover widget Turnstile:', e);

          }
        }
        setWidgetId(null);
      }
    };
  }, [isLoaded, siteKey, theme, handleVerify, handleError, handleExpire, widgetId]);

  if (isLoading) {
    return (
      <div className='flex h-16 items-center justify-center'>
        <div className='text-sm text-gray-500'>Carregando verificação...</div>
      </div>
    );
  }

  return (
    <div className='flex justify-center'>
      <div
        ref={turnstileRef}
        style={{
          minHeight: '65px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>
  );
};

export default CloudflareTurnstile;
