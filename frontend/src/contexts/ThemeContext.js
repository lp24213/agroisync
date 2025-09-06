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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('agroisync-theme');
    if (savedTheme) {
      // Se o usuário já escolheu light, respeitar a escolha
      setIsDark(savedTheme === 'dark');
    } else {
      // PADRÃO: SEMPRE DARK (tema obrigatório)
      setIsDark(true);
      localStorage.setItem('agroisync-theme', 'dark');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Aplicar tema ao documento
    const html = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      body.style.backgroundColor = '#000000';
      body.style.color = '#FFFFFF';
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      body.style.backgroundColor = '#FFFFFF';
      body.style.color = '#111111';
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('agroisync-theme', isDark ? 'dark' : 'light');
  }, [isDark, isInitialized]);

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
    // Cores do tema escuro OBRIGATÓRIO - Paleta Agronegócio Neon
    darkColors: {
      bgPrimary: 'bg-black',
      bgSecondary: 'bg-slate-900',
      bgCard: 'bg-slate-800/90',
      bgCardHover: 'hover:bg-slate-700/90',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      textTertiary: 'text-slate-400',
      borderPrimary: 'border-slate-700',
      borderSecondary: 'border-slate-600',
      // Paleta Agronegócio: neon azul, verde, dourado, roxo
      accentPrimary: 'bg-emerald-500',      // Verde neon
      accentSecondary: 'bg-blue-500',       // Azul neon
      accentTertiary: 'bg-amber-500',       // Dourado
      accentQuaternary: 'bg-purple-500',    // Roxo
      accentHover: 'hover:bg-emerald-600',
      shadowCard: 'shadow-card-dark',
      shadowElevated: 'shadow-elevated-dark',
      // Cores neon específicas
      neonGreen: 'text-emerald-400',
      neonBlue: 'text-blue-400',
      neonGold: 'text-amber-400',
      neonPurple: 'text-purple-400',
      // Gradientes neon
      gradientPrimary: 'bg-gradient-to-r from-emerald-500 to-blue-500',
      gradientSecondary: 'bg-gradient-to-r from-amber-500 to-purple-500',
      gradientText: 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'
    },
    // Cores CSS customizadas para agronegócio
    agroColors: {
      neonGreen: '#00ffbf',
      neonBlue: '#00aaff', 
      gold: '#ffd966',
      purple: '#8b5cf6',
      darkBg: '#000000',
      lightText: '#FFFFFF'
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
