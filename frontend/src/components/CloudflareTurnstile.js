
import React, { useEffect, useRef, useState, useCallback } from 'react';

// Componente leve para o Cloudflare Turnstile.
// Melhoria: usa a variável de ambiente REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY como fallback
// e evita inserir múltiplas tags <script> idênticas no head.
const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetId, setWidgetId] = useState(null);

  const effectiveSiteKey = siteKey || process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY || '';

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
    // Modo desenvolvimento: bypass quando não houver chave configurada
    if (!effectiveSiteKey && process.env.NODE_ENV !== 'production') {
      setIsLoading(false);
      setIsLoaded(false);
      // usar callback memoizado
      handleVerify('dev-bypass');
      return;
    }
    // Se já existe o objeto global, estamos prontos
    if (window.turnstile) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    // Evitar duplicidade de script
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      // Pode já estar carregando; ligar no onload se ainda não carregado
      if (existing.getAttribute && existing.getAttribute('data-loaded') === 'true') {
        setIsLoaded(true);
        setIsLoading(false);
      } else {
        existing.addEventListener('load', () => {
          setIsLoaded(true);
          setIsLoading(false);
        });
        existing.addEventListener('error', () => {
          setIsLoading(false);
          // Usar bypass em caso de erro para não bloquear o usuário
          handleVerify('error-bypass');
          // Erro ao carregar Turnstile - usando bypass
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-loaded', 'false');
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      setIsLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      setIsLoading(false);
      // Usar bypass em caso de erro para não bloquear o usuário
      handleVerify('error-bypass');
      // Erro ao carregar Turnstile - usando bypass automático
    };
    document.head.appendChild(script);
  }, [effectiveSiteKey, handleVerify, handleError]);

  useEffect(() => {
    if (!isLoaded || !turnstileRef.current) return;
    if (!effectiveSiteKey) {
      // Silenciar em desenvolvimento, apenas avisar em produção
      if (process.env.NODE_ENV === 'production') {
        // Cloudflare Turnstile siteKey não configurado
      }
      setIsLoading(false);
      return;
    }

    if (!widgetId) {
      try {
        const id = window.turnstile.render(turnstileRef.current, {
          sitekey: effectiveSiteKey,
          theme,
          size: 'normal',
          callback: handleVerify,
          'error-callback': (error) => {
            // Bypass em caso de erro para não bloquear o usuário
            handleVerify('error-bypass');
            // Turnstile error - usando bypass
          },
          'expired-callback': handleExpire
        });
        setWidgetId(id);
      } catch (e) {
        // Erro ao renderizar Turnstile
        // Bypass em caso de erro para não bloquear o usuário
        handleVerify('error-bypass');
      }
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            // Erro ao remover widget Turnstile
          }
        }
        setWidgetId(null);
      }
    };
  }, [isLoaded, effectiveSiteKey, theme, handleVerify, handleError, handleExpire, widgetId]);

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
        className='cf-turnstile'
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
