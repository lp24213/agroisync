import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeName = 'neon' | 'gold' | 'agro' | 'cyberpunk' | 'light';

interface ThemeContextProps {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  nextTheme: () => void;
}

const themes: ThemeName[] = ['neon', 'gold', 'agro', 'cyberpunk', 'light'];

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'neon',
  setTheme: () => {},
  nextTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('neon');

  useEffect(() => {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(theme);
  }, [theme]);

  function nextTheme() {
    setTheme((prev) => {
      const idx = themes.indexOf(prev);
      return themes[(idx + 1) % themes.length];
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, nextTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}