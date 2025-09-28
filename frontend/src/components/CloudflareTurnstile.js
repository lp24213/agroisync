import React, { useEffect, useRef, useState } from 'react';

const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetId, setWidgetId] = useState(null);

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

    // Configurar callbacks globais
    window.onTurnstileSuccess = onVerify;
    window.onTurnstileError = onError;
    window.onTurnstileExpire = onExpire;

    return () => {
      // Cleanup
      delete window.onTurnstileSuccess;
      delete window.onTurnstileError;
      delete window.onTurnstileExpire;
    };
  }, [onVerify, onError, onExpire]);

  useEffect(() => {
    if (isLoaded && window.turnstile && turnstileRef.current) {
      // Limpar widget anterior se existir
      if (widgetId) {
        window.turnstile.remove(widgetId);
      }
      
      // Renderizar o Turnstile
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey || '0x4AAAAAAB3pdjs4jRKvAtaA',
        theme: theme,
        size: 'compact',
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire
      });
      setWidgetId(id);
    }

    return () => {
      // Limpar widget quando componente for desmontado
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isLoaded, siteKey, theme, onVerify, onError, onExpire]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="text-sm text-gray-500">Carregando verificação...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
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