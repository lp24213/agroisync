'use client';

import { motion } from "framer-motion";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export function Logo({ size = 'md', iconOnly = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2"
    >
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Letra A estilizada com folha */}
          <path
            d="M20 80 L50 20 L80 80 L70 80 L65 70 L35 70 L30 80 Z M40 60 L60 60 L50 35 Z"
            fill="none"
            stroke="#00ffff"
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
          />
          
          {/* Folha integrada */}
          <path
            d="M45 45 Q50 40 55 45 Q50 50 45 45"
            fill="none"
            stroke="#00ffff"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          />
          
          {/* Linhas de circuito na base */}
          <path
            d="M25 85 L35 85 M45 85 L55 85 M65 85 L75 85"
            stroke="#00ffff"
            strokeWidth="1"
            className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
          />
          
          {/* Nós circulares */}
          <circle cx="30" cy="85" r="1.5" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
          <circle cx="70" cy="85" r="1.5" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
          
          {/* Hexágono no canto superior direito */}
          <path
            d="M75 25 L80 30 L80 35 L75 40 L70 35 L70 30 Z"
            fill="none"
            stroke="#00ffff"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          />
        </svg>
      </div>
      {!iconOnly && (
        <span className={`text-cyan-400 font-bold font-display ${textSizes[size]} drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]`}>
          AGRO<span className="text-xs align-top">TM</span>
        </span>
      )}
    </motion.div>
  );
} 