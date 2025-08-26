import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // SEMPRE tema claro como padrão
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se estamos no browser antes de acessar localStorage e window
    if (typeof window !== 'undefined') {
      // SEMPRE usar tema claro como padrão, nunca escuro
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        // Se o usuário tinha salvo tema escuro, perguntar se quer manter
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(userPrefersDark ? 'dark' : 'light');
      } else {
        setTheme('light'); // Padrão sempre claro
      }
    } else {
      // No servidor, usar tema claro como padrão
      setTheme('light');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Verificar se estamos no browser antes de acessar document e localStorage
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Aplicar tema ao documento
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Aplicar classes do Tailwind baseadas no tema
      if (theme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeExplicit = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setThemeExplicit
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
