'use client';

import { motion } from "framer-motion";

interface CyberDefenseProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CyberDefense({ size = 'md', className = '' }: CyberDefenseProps) {
  const sizeClasses = {
    sm: 'w-32 h-24',
    md: 'w-48 h-36',
    lg: 'w-64 h-48',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 160 120" className="w-full h-full">
        {/* Frame principal */}
        <rect
          x="5"
          y="5"
          width="150"
          height="110"
          rx="8"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
        />
        
        {/* Título */}
        <text x="20" y="20" className="text-[6px] fill-cyan-400 font-bold">
          CYBER DEFENSE
        </text>
        
        {/* Escudo central */}
        <path
          d="M30 40 L50 25 L70 40 L70 70 L50 85 L30 70 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
        />
        
        {/* Planta dentro do escudo */}
        <path
          d="M45 60 L50 50 L55 60 L50 70 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Raízes */}
        <path
          d="M50 70 L45 75 L50 80 L55 75"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Linhas de circuito na base */}
        <line x1="35" y1="80" x2="45" y2="80" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <line x1="55" y1="80" x2="65" y2="80" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        
        {/* Ícone do cérebro (superior direito) */}
        <path
          d="M100 30 Q110 25 120 30 Q125 35 120 40 Q110 45 100 40 Q95 35 100 30"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        <path
          d="M105 32 Q110 30 115 32 M105 38 Q110 40 115 38"
          fill="none"
          stroke="#00ffff"
          strokeWidth="0.5"
          opacity="0.7"
        />
        
        {/* Ícone do cubo (inferior direito) */}
        <path
          d="M100 60 L110 55 L120 60 L120 70 L110 75 L100 70 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        <path
          d="M105 65 L115 60 L115 70 L105 75"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          opacity="0.7"
        />
        
        {/* Linhas de conexão */}
        <path
          d="M70 55 Q85 50 100 35"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          opacity="0.4"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]"
        />
        <path
          d="M70 65 Q85 70 100 65"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          opacity="0.4"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]"
        />
        
        {/* Linhas de circuito de fundo */}
        <path
          d="M20 90 L40 90 M60 90 L80 90 M100 90 L120 90"
          stroke="#00ffff"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <path
          d="M20 100 L40 100 M60 100 L80 100 M100 100 L120 100"
          stroke="#00ffff"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  );
} 