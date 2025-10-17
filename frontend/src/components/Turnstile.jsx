import { useEffect, useCallback } from 'react';
import { config } from '../config';

/**
 * Componente do Turnstile
 * @param {object} props
 * @param {function} props.onVerify - callback chamado com o token quando verificado
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

    // Configurar callback global (com guarda para evitar erros em SSR)
    try {
      if (typeof window !== 'undefined') {
        window.onTurnstileVerify = handleVerify;
      }
    } catch (e) {
      // ambiente sem window - ignorar
    }

    // Adicionar script
    document.body.appendChild(script);

    // Limpar ao desmontar
    return () => {
      script.remove();
      try {
        if (typeof window !== 'undefined') delete window.onTurnstileVerify;
      } catch (e) {
        // ignore
      }
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

// Observação: adicionamos a propriedade global dinamicamente em runtime.
// Para evitar sintaxe TypeScript em arquivos .jsx removemos o bloco "declare global".
// A tipagem pode ser adicionada em um arquivo .d.ts se necessário.