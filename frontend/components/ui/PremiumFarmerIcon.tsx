'use client';

import { motion } from "framer-motion";

interface PremiumFarmerIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PremiumFarmerIcon({ size = 'md', className = '' }: PremiumFarmerIconProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Chapéu de cowboy */}
        <path
          d="M20 30 Q50 15 80 30 L75 35 L25 35 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
        />
        
        {/* Óculos VR */}
        <rect
          x="30"
          y="40"
          width="40"
          height="8"
          rx="2"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Rosto */}
        <path
          d="M35 50 Q50 45 65 50 Q50 55 35 50"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Barba */}
        <path
          d="M40 52 Q50 58 60 52"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Corpo/Overalls */}
        <path
          d="M30 55 L70 55 L65 85 L35 85 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Alças dos overalls */}
        <path
          d="M35 55 L40 65 L60 65 L65 55"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Fivelas */}
        <rect x="38" y="63" width="4" height="2" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="58" y="63" width="4" height="2" fill="none" stroke="#00ffff" strokeWidth="1" />
        
        {/* Logo da planta no peito */}
        <path
          d="M45 60 L50 55 L55 60 L50 65 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Badge PREMIUM */}
        <path
          d="M70 25 L80 25 L80 35 L70 35 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Estrela */}
        <path
          d="M75 27 L76 29 L78 29 L76.5 30.5 L77 32.5 L75 31.5 L73 32.5 L73.5 30.5 L72 29 L74 29 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="0.5"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
        />
        
        {/* Texto PREMIUM */}
        <text x="75" y="34" textAnchor="middle" className="text-[2px] fill-cyan-400 font-bold">
          PREMIUM
        </text>
        
        {/* Partículas de fundo */}
        <circle cx="15" cy="20" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="85" cy="15" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="10" cy="80" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="90" cy="70" r="0.5" fill="#00ffff" opacity="0.6" />
      </svg>
    </motion.div>
  );
} 