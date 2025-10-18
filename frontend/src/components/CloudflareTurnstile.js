
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetId, setWidgetId] = useState(null);

  // Chave do Turnstile
  const effectiveSiteKey =
    siteKey ||
    process.env.REACT_APP_TURNSTILE_SITE_KEY ||
    '0x4AAAAAAB3pdjs4jRKvAtaA';

  const handleVerify = useCallback((token) => {
    console.log('✅ Turnstile verificado:', token);
    if (onVerify) onVerify(token);
  }, [onVerify]);

  const handleError = useCallback((error) => {
    console.error('❌ Turnstile error:', error);
    if (onError) onError(error);
  }, [onError]);

  const handleExpire = useCallback(() => {
    console.log('⏰ Turnstile expirado');
    if (onExpire) onExpire();
  }, [onExpire]);

  // Carregar script do Turnstile
  useEffect(() => {
    if (window.turnstile) {
      console.log('Turnstile já existe no window');
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    const existing = document.querySelector(`script[src="${src}"]`);
    
    if (existing) {
      console.log('Script do Turnstile já existe');
      existing.addEventListener('load', () => {
        console.log('Script carregado');
        setIsLoaded(true);
        setIsLoading(false);
      });
      return;
    }

    console.log('Carregando script do Turnstile...');
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Script do Turnstile carregado!');
      setIsLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      console.error('❌ Erro ao carregar script do Turnstile');
      setIsLoading(false);
      handleError(new Error('Failed to load Turnstile script'));
    };
    document.head.appendChild(script);
  }, [handleError]);

  // Renderizar widget
  useEffect(() => {
    console.log('useEffect render - isLoaded:', isLoaded, 'hasRef:', !!turnstileRef.current, 'widgetId:', widgetId);
    
    if (!isLoaded) {
      console.log('Script ainda não carregado');
      return;
    }
    
    if (!turnstileRef.current) {
      console.log('Ref não disponível');
      return;
    }
    
    if (widgetId) {
      console.log('Widget já existe:', widgetId);
      return;
    }

    console.log('🎯 Renderizando widget Turnstile com chave:', effectiveSiteKey);
    console.log('🔍 Tipo de effectiveSiteKey:', typeof effectiveSiteKey);
    console.log('🔍 effectiveSiteKey é string?', typeof effectiveSiteKey === 'string');
    console.log('window.turnstile existe?', !!window.turnstile);
    
    try {
      // Garantir que sitekey seja string
      const sitekeyValue = typeof effectiveSiteKey === 'string' ? effectiveSiteKey : String(effectiveSiteKey);
      
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: sitekeyValue,
        theme,
        size: 'normal',
        // appearance: 'interaction-only', // REMOVIDO - pode estar escondendo
        callback: handleVerify,
        'error-callback': handleError,
        'expired-callback': handleExpire
      });
      console.log('✅ Widget renderizado! ID:', id);
      setWidgetId(id);
    } catch (e) {
      console.error('❌ Erro ao renderizar widget:', e);
      handleError(e);
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          console.error('Erro ao remover widget:', e);
        }
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
