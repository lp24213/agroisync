'use client';

import { motion } from "framer-motion";

interface StakingFarmingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StakingFarming({ size = 'md', className = '' }: StakingFarmingProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Frame principal */}
        <rect
          x="5"
          y="5"
          width="110"
          height="110"
          rx="8"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
        />
        
        {/* Título */}
        <text x="60" y="20" textAnchor="middle" className="text-[6px] fill-cyan-400 font-bold">
          STAKING / FARMING
        </text>
        
        {/* Planta central */}
        <path
          d="M50 70 L60 50 L70 70 L60 80 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
        />
        
        {/* Planta esquerda */}
        <path
          d="M35 75 L40 60 L45 75 L40 80 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Planta direita */}
        <path
          d="M75 75 L80 60 L85 75 L80 80 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Raízes de circuito */}
        <path
          d="M40 80 L30 85 L40 90 M60 80 L50 85 L60 90 M80 80 L70 85 L80 90"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Linhas de circuito no solo */}
        <line x1="25" y1="95" x2="35" y2="95" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <line x1="45" y1="95" x2="55" y2="95" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <line x1="65" y1="95" x2="75" y2="95" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <line x1="85" y1="95" x2="95" y2="95" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        
        {/* Ícone de moedas com checkmark */}
        <rect x="80" y="25" width="25" height="25" rx="4" fill="none" stroke="#00ffff" strokeWidth="1.5" />
        
        {/* Pilha de moedas */}
        <circle cx="85" cy="35" r="3" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="90" cy="35" r="3" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="95" cy="35" r="3" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="100" cy="35" r="3" fill="none" stroke="#00ffff" strokeWidth="1" />
        
        {/* Checkmark */}
        <path
          d="M87 42 L90 45 L93 42"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
        />
        
        {/* Linhas de conexão */}
        <path
          d="M70 55 Q80 50 85 35"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          opacity="0.4"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]"
        />
        
        {/* Partículas de fundo */}
        <circle cx="20" cy="30" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="100" cy="20" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="15" cy="80" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="105" cy="70" r="0.5" fill="#00ffff" opacity="0.6" />
      </svg>
    </motion.div>
  );
} 