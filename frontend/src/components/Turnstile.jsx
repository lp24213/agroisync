// @ts-check
import { useEffect, useCallback } from 'react';
import { config } from '../config';

/**
 * Componente do Turnstile
 * @param {object} props 
 * @param {(token: string) => void} props.onVerify 
 */
export function Turnstile({ onVerify }) {
  // Callback de verificação
  const handleVerify = useCallback((token) => {
    onVerify(token);
  }, [onVerify]);

  // Carregar widget do Turnstile
  useEffect(() => {
    // Remover widget anterior se existir
    const oldScript = document.querySelector('script[src*="turnstile.js"]');
    if (oldScript) {
      oldScript.remove();
    }

    // Criar novo widget
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;

    // Configurar callback global
    window.onTurnstileVerify = handleVerify;

    // Adicionar script
    document.body.appendChild(script);

    // Limpar ao desmontar
    return () => {
      script.remove();
      delete window.onTurnstileVerify;
    };
  }, [handleVerify]);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={config.turnstile.siteKey}
      data-callback="onTurnstileVerify"
    />
  );
}

// Adicionar tipos ao window
declare global {
  interface Window {
    onTurnstileVerify: (token: string) => void;
  }
}