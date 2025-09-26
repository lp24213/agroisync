import React, { useEffect, useRef, useState } from 'react';

const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carregar o script do Turnstile se não estiver carregado
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        setTimeout(() => renderTurnstile(), 100);
      };
      script.onerror = () => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erro ao carregar Cloudflare Turnstile');
        }
        onError && onError('Erro ao carregar verificação');
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      setTimeout(() => renderTurnstile(), 100);
    }

    return () => {
      // Limpar widget quando componente for desmontado
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [onError]);

  const renderTurnstile = () => {
    if (!window.turnstile || !turnstileRef.current || !isLoaded) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Turnstile não está pronto:', { 
          turnstile: !!window.turnstile, 
          ref: !!turnstileRef.current, 
          loaded: isLoaded 
        });
      }
      return;
    }

    // Remover widget anterior se existir
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    try {
      // Renderizar novo widget
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey || process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAA2rOqUOZqKxZqKx',
        callback: (token) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Turnstile verificado:', token);
          }
          onVerify && onVerify(token);
        },
        'error-callback': (error) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Turnstile error:', error);
          }
          onError && onError(error);
        },
        'expired-callback': () => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Turnstile expirado');
          }
          onExpire && onExpire();
        },
        theme: theme,
        size: 'normal',
        language: 'pt-BR',
        'response-field': false,
        'response-field-name': 'cf-turnstile-response'
      });
      if (process.env.NODE_ENV !== 'production') {
        console.log('Turnstile renderizado com sucesso');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao renderizar Turnstile:', error);
      }
      onError && onError(error);
    }
  };

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return (
    <div style={{ 
      margin: '1rem 0',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div 
        ref={turnstileRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          transform: 'scale(0.9)',
          transformOrigin: 'center'
        }}
      />
      {!isLoaded && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '65px',
          background: '#f3f4f6',
          borderRadius: '8px',
          color: '#6b7280',
          fontSize: '0.9rem',
          width: '100%',
          maxWidth: '100%',
          padding: '0 1rem'
        }}>
          Carregando verificação...
        </div>
      )}
    </div>
  );
};

export default CloudflareTurnstile;
