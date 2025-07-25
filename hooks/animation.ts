// Hook para animações globais, microinterações e efeitos premium
import { useEffect } from 'react';

export function useAnimation(effect: () => void, deps: any[] = []) {
  useEffect(effect, deps);
}
