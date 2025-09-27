import React, { useEffect, useRef, useState } from 'react';

const CloudflareTurnstile = ({ onVerify, onError, onExpire, siteKey, theme = 'light' }) => {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState('INICIANDO...');
  const [forceRender, setForceRender] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const renderWidget = () => {
    setAttempts(prev => prev + 1);
    setDebugInfo(`RENDERIZANDO WIDGET (Tentativa ${attempts + 1})...`);
    console.log(`🎯 TENTANDO RENDERIZAR WIDGET TURNSTILE - Tentativa ${attempts + 1}`);

    if (!window.turnstile) {
      setDebugInfo('window.turnstile NÃO EXISTE');
      console.log('❌ window.turnstile não existe');
      return;
    }
    if (!turnstileRef.current) {
      setDebugInfo('turnstileRef.current NÃO EXISTE');
      console.log('❌ turnstileRef.current não existe');
      return;
    }

    // Remover widget anterior se existir
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        console.log('🧹 Widget Turnstile anterior removido.');
      } catch (e) {
        console.warn('⚠️ Erro ao remover widget anterior:', e);
      }
    }

    try {
      setDebugInfo('CRIANDO NOVO WIDGET...');
      console.log('🚀 CRIANDO NOVO WIDGET TURNSTILE com sitekey:', siteKey || '0x4AAAAAAB3pdjs4jRKvAtaA');
      
      // Limpar o container primeiro
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = '';
      }
      
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey || '0x4AAAAAAB3pdjs4jRKvAtaA',
        callback: (token) => {
          setDebugInfo('VERIFICADO!');
          console.log('✅ TURNSTILE VERIFICADO COM SUCESSO:', token);
          onVerify && onVerify(token);
        },
        'error-callback': (error) => {
          setDebugInfo('ERRO: ' + error);
          console.error('❌ TURNSTILE ERROR:', error);
          onError && onError(error);
        },
        'expired-callback': () => {
          setDebugInfo('EXPIRADO');
          console.log('⏰ TURNSTILE EXPIRADO');
          onExpire && onExpire();
        },
        theme: theme,
        size: 'normal',
        language: 'pt-BR',
      });
      setDebugInfo('WIDGET CRIADO!');
      console.log('🎉 TURNSTILE RENDERIZADO COM SUCESSO! Widget ID:', widgetIdRef.current);
    } catch (error) {
      setDebugInfo('ERRO AO RENDERIZAR: ' + error.message);
      console.error('💥 ERRO AO RENDERIZAR TURNSTILE:', error);
      onError && onError(error);
    }
  };

  useEffect(() => {
    setDebugInfo('COMPONENTE MONTADO');
    console.log('🔥 TURNSTILE COMPONENTE MONTADO');

    const loadTurnstileScript = () => {
      if (window.turnstile) {
        setDebugInfo('TURNSTILE JÁ CARREGADO');
        console.log('✅ Turnstile já está carregado globalmente');
        setIsLoaded(true);
        setTimeout(() => renderWidget(), 100);
        return;
      }

      const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (existingScript) {
        setDebugInfo('SCRIPT JÁ EXISTE, AGUARDANDO...');
        console.log('📜 Script Turnstile já existe, aguardando carregamento...');
        existingScript.onload = () => {
          setDebugInfo('SCRIPT EXISTENTE CARREGADO');
          console.log('✅ Script existente carregado');
          setIsLoaded(true);
          setTimeout(() => renderWidget(), 100);
        };
        return;
      }

      setDebugInfo('CARREGANDO SCRIPT...');
      console.log('🚀 Carregando script do Turnstile pela primeira vez...');
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setDebugInfo('SCRIPT CARREGADO');
        console.log('✅ Turnstile script carregado com sucesso');
        setIsLoaded(true);
        setTimeout(() => renderWidget(), 100);
      };
      script.onerror = () => {
        setDebugInfo('ERRO AO CARREGAR SCRIPT');
        console.error('❌ Erro ao carregar Cloudflare Turnstile script');
        onError && onError('Erro ao carregar verificação');
      };
      document.head.appendChild(script);
    };

    loadTurnstileScript();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        console.log('🧹 Limpando widget Turnstile ao desmontar');
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  // Forçar renderização em intervalos para garantir que apareça
  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo('FORÇANDO RENDERIZAÇÃO PERIÓDICA...');
      console.log('🔄 Forçando renderização periódica do Turnstile');
      setForceRender(prev => prev + 1);
      renderWidget();
    }, 1000); // Tenta renderizar a cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  // Forçar renderização múltipla
  useEffect(() => {
    const timeouts = [50, 100, 200, 500, 1000, 2000, 3000, 5000];
    timeouts.forEach(timeout => {
      setTimeout(() => {
        setDebugInfo(`FORÇANDO RENDERIZAÇÃO APÓS ${timeout}ms`);
        console.log(`🔄 Forçando renderização após ${timeout}ms`);
        setForceRender(prev => prev + 1);
        renderWidget();
      }, timeout);
    });
  }, []);

  // Forçar renderização quando o componente é visível
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setDebugInfo('COMPONENTE VISÍVEL - RENDERIZANDO');
          console.log('👁️ Componente Turnstile visível, renderizando...');
          renderWidget();
        }
      });
    });

    if (turnstileRef.current) {
      observer.observe(turnstileRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      margin: '1rem 0',
      width: '100%',
      maxWidth: '100%',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: '5px solid #00ff00',
      borderRadius: '20px',
      background: '#000000',
      padding: '20px',
      position: 'relative',
      zIndex: 99999
    }}>
      <div style={{
        color: '#00ff00',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        🔥 TURNSTILE DEBUG ULTRA AGRESSIVO 🔥
      </div>

      <div style={{
        color: '#ffffff',
        fontSize: '0.9rem',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        SiteKey: {siteKey || '0x4AAAAAAB3pdjs4jRKvAtaA'}
      </div>

      <div style={{
        color: '#ffffff',
        fontSize: '0.9rem',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Status: {isLoaded ? '✅ SCRIPT CARREGADO' : '❌ CARREGANDO SCRIPT'}
      </div>

      <div style={{
        color: '#ffff00',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
        background: '#000000',
        padding: '5px',
        borderRadius: '5px'
      }}>
        DEBUG: {debugInfo}
      </div>

      <div style={{
        color: '#ffffff',
        fontSize: '0.8rem',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Force Render: {forceRender} | Tentativas: {attempts}
      </div>

      <div
        ref={turnstileRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'visible',
          transform: 'scale(1)',
          transformOrigin: 'center',
          border: '4px solid #ff0000',
          borderRadius: '15px',
          background: '#ffff00',
          padding: '20px',
          boxShadow: '0 8px 16px rgba(255,0,0,0.5)',
          margin: '10px 0',
          position: 'relative',
          zIndex: 99999
        }}
      />

      {!isLoaded && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          background: '#ff0000',
          borderRadius: '15px',
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: '100%',
          padding: '0 1rem',
          border: '4px solid #cc0000',
          margin: '10px 0',
          position: 'relative',
          zIndex: 99999
        }}>
          🚨 CARREGANDO TURNSTILE - VERIFICAÇÃO DE SEGURANÇA 🚨
        </div>
      )}

      <div style={{
        color: '#00ff00',
        fontSize: '0.8rem',
        marginTop: '10px',
        textAlign: 'center'
      }}>
        Se não aparecer aqui, é problema do Cloudflare!
      </div>
    </div>
  );
};

export default CloudflareTurnstile;