import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading] = useState(false);

  // Carregar tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('agroisync-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('agroisync-theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  }, []);

  const setTheme = useCallback((theme) => {
    const isDark = theme === 'dark';
    setIsDarkMode(isDark);
    localStorage.setItem('agroisync-theme', theme);
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const theme = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    setTheme,
    isLoading
  }), [isDarkMode, toggleTheme, setTheme, isLoading]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
