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
  // TEMA DARK OBRIGATÓRIO POR PADRÃO
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // Se o usuário já escolheu light, respeitar a escolha
      setIsDark(savedTheme === 'dark');
    } else {
      // PADRÃO: SEMPRE DARK (tema obrigatório)
      setIsDark(true);
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
    // Cores do tema escuro OBRIGATÓRIO - Paleta Agronegócio
    darkColors: {
      bgPrimary: 'bg-black',
      bgSecondary: 'bg-gray-900',
      bgCard: 'bg-gray-800',
      bgCardHover: 'hover:bg-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-200',
      textTertiary: 'text-gray-400',
      borderPrimary: 'border-gray-700',
      borderSecondary: 'border-gray-600',
      accentPrimary: 'bg-emerald-500',
      accentSecondary: 'bg-sky-500',
      accentHover: 'hover:bg-emerald-600',
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
