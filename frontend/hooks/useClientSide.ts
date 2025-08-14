import { useState, useEffect } from 'react';

/**
 * Hook para garantir que o componente só renderize no lado do cliente
 * Previne erros de React hooks durante o build do Next.js
 */
export function useClientSide() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
