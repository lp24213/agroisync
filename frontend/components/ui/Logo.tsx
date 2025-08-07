'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

export function Logo({ size = 'md', iconOnly = false }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm' },
    md: { icon: 'w-8 h-8', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <motion.div
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative"
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 240, 255, 0.5)",
            "0 0 40px rgba(0, 240, 255, 0.8)",
            "0 0 20px rgba(0, 240, 255, 0.5)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`${sizes[size].icon} bg-gradient-to-br from-premium-neon-blue via-premium-neon-cyan to-premium-neon-green rounded-xl flex items-center justify-center shadow-neon-blue relative overflow-hidden`}>
          <span className="text-premium-black font-orbitron font-bold text-lg z-10">A</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-premium-neon-green rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {!iconOnly && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={`text-premium-neon-blue font-orbitron font-bold ${textSizes[size]} drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] bg-gradient-to-r from-premium-neon-blue to-premium-neon-cyan bg-clip-text text-transparent`}>
            AGROTM
          </span>
          <span className="text-premium-neon-green text-xs font-medium tracking-wider drop-shadow-[0_0_8px_rgba(0,255,127,0.6)]">
            DIGITAL AGRICULTURE
          </span>
        </motion.div>
      )}
    </motion.div>
  );
} 