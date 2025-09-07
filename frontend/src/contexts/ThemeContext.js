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
  const [isDark, setIsDark] = useState(false); // Tema claro por padrão
  const [accentColor, setAccentColor] = useState('neon-blue');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('agrosync-theme');
    const savedAccent = localStorage.getItem('agrosync-accent');
    const savedAnimations = localStorage.getItem('agrosync-animations');

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
    if (savedAnimations) {
      setAnimationsEnabled(savedAnimations === 'true');
    }
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Aplicar cor de destaque
    root.style.setProperty('--accent-color', `var(--${accentColor})`);
    
    // Aplicar animações
    if (animationsEnabled) {
      root.classList.add('animations-enabled');
    } else {
      root.classList.remove('animations-enabled');
    }
  }, [isDark, accentColor, animationsEnabled]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('agrosync-theme', newTheme ? 'dark' : 'light');
  };

  const setAccent = (color) => {
    setAccentColor(color);
    localStorage.setItem('agrosync-accent', color);
  };

  const toggleAnimations = () => {
    const newAnimations = !animationsEnabled;
    setAnimationsEnabled(newAnimations);
    localStorage.setItem('agrosync-animations', newAnimations.toString());
  };

  const getAccentClasses = () => {
    const accentMap = {
      'neon-blue': {
        primary: 'from-neon-blue to-cyan-500',
        secondary: 'bg-neon-blue',
        text: 'text-neon-blue',
        border: 'border-neon-blue',
        shadow: 'shadow-neon'
      },
      'neon-green': {
        primary: 'from-neon-green to-emerald-500',
        secondary: 'bg-neon-green',
        text: 'text-neon-green',
        border: 'border-neon-green',
        shadow: 'shadow-neon-green'
      },
      'neon-purple': {
        primary: 'from-neon-purple to-violet-500',
        secondary: 'bg-neon-purple',
        text: 'text-neon-purple',
        border: 'border-neon-purple',
        shadow: 'shadow-neon-purple'
      },
      'neon-gold': {
        primary: 'from-neon-gold to-yellow-500',
        secondary: 'bg-neon-gold',
        text: 'text-neon-gold',
        border: 'border-neon-gold',
        shadow: 'shadow-neon-gold'
      },
      'neon-pink': {
        primary: 'from-neon-pink to-rose-500',
        secondary: 'bg-neon-pink',
        text: 'text-neon-pink',
        border: 'border-neon-pink',
        shadow: 'shadow-neon-pink'
      }
    };

    return accentMap[accentColor] || accentMap['neon-blue'];
  };

  const value = {
    isDark,
    accentColor,
    animationsEnabled,
    toggleTheme,
    setAccent,
    toggleAnimations,
    getAccentClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};