'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '', children }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-premium-neon-blue/20 via-premium-neon-purple/20 to-premium-neon-green/20"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(0, 240, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 50%, rgba(0, 255, 127, 0.2) 100%)',
            'linear-gradient(45deg, rgba(0, 255, 127, 0.2) 0%, rgba(0, 240, 255, 0.2) 50%, rgba(138, 43, 226, 0.2) 100%)',
            'linear-gradient(45deg, rgba(138, 43, 226, 0.2) 0%, rgba(0, 255, 127, 0.2) 50%, rgba(0, 240, 255, 0.2) 100%)',
            'linear-gradient(45deg, rgba(0, 240, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 50%, rgba(0, 255, 127, 0.2) 100%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Efeito de brilho */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};
