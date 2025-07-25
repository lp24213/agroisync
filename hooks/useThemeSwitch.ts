// Hook para troca de tema instantânea (dark, neon, glass, etc)
import { useState } from 'react';

export function useThemeSwitch(themes: string[], initial: string = 'dark') {
  const [theme, setTheme] = useState(initial);
  const switchTheme = (next: string) => {
    if (themes.includes(next)) setTheme(next);
  };
  return { theme, switchTheme };
}
