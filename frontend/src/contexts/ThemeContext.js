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
  const [theme, setTheme] = useState('light'); // Alterado para 'light' como padrão
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar tema salvo ou usar padrão claro
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Aplicar tema ao documento
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeExplicit = (newTheme) => {
    setTheme(newTheme);
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
