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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema ao documento
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (theme) => {
    setIsDark(theme === 'dark');
  };

  const value = {
    isDark,
    toggleTheme,
    setTheme,
    // Cores do tema claro (padrão)
    lightColors: {
      bgPrimary: 'bg-white',
      bgSecondary: 'bg-slate-50',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-600',
      textTertiary: 'text-slate-500',
      borderPrimary: 'border-slate-200',
      borderSecondary: 'border-slate-300',
      accentPrimary: 'bg-slate-600',
      accentSecondary: 'bg-slate-700',
      accentHover: 'hover:bg-slate-700',
      shadowCard: 'shadow-card',
      shadowElevated: 'shadow-elevated'
    },
    // Cores do tema escuro (opcional)
    darkColors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgCard: 'bg-slate-800',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      borderPrimary: 'border-slate-700',
      borderSecondary: 'border-slate-600',
      accentPrimary: 'bg-slate-600',
      accentSecondary: 'bg-slate-700',
      accentHover: 'hover:bg-slate-500',
      shadowCard: 'shadow-card-dark',
      shadowElevated: 'shadow-elevated-dark'
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
