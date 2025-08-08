'use client';

import React, { useState, useEffect } from 'react';
import TopCryptos from './TopCryptos';
import TopCryptosMobile from './TopCryptosMobile';

interface TopCryptosWrapperProps {
  limit?: number;
  className?: string;
  forceMobile?: boolean;
  forceDesktop?: boolean;
}

export default function TopCryptosWrapper({ 
  limit = 20, 
  className = '',
  forceMobile = false,
  forceDesktop = false
}: TopCryptosWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar no carregamento inicial
    checkIsMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Forçar versão específica se solicitado
  if (forceMobile) {
    return <TopCryptosMobile limit={limit} className={className} />;
  }

  if (forceDesktop) {
    return <TopCryptos limit={limit} className={className} />;
  }

  // Escolher automaticamente baseado no tamanho da tela
  if (isMobile) {
    return <TopCryptosMobile limit={Math.min(limit, 10)} className={className} />;
  }

  return <TopCryptos limit={limit} className={className} />;
}
