'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'relative overflow-hidden font-orbitron font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-premium-neon-blue/50';
  
  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-premium-neon-green to-premium-neon-blue text-premium-black shadow-neon-green hover:shadow-neon-blue',
    secondary: 'bg-gradient-to-r from-premium-neon-blue to-premium-neon-purple text-premium-black shadow-neon-blue hover:shadow-neon-purple',
    outline: 'bg-transparent border-2 border-premium-neon-blue text-premium-neon-blue hover:bg-premium-neon-blue hover:text-premium-black shadow-neon-blue',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Efeito de brilho */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Conteúdo */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Efeito de borda */}
      <motion.div
        className="absolute inset-0 border border-premium-neon-blue/30 rounded-lg"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};
