'use client';

import { motion } from "framer-motion";

interface NFTMintingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NFTMinting({ size = 'md', className = '' }: NFTMintingProps) {
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
          NFT MINTING
        </text>
        
        {/* Semente/base */}
        <ellipse
          cx="60"
          cy="85"
          rx="8"
          ry="5"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Caule */}
        <path
          d="M60 80 L60 60"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Folhas */}
        <path
          d="M60 65 L50 60 L60 55"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        <path
          d="M60 65 L70 60 L60 55"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Moeda NFT */}
        <circle
          cx="60"
          cy="45"
          r="12"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
        />
        
        {/* Texto NFT na moeda */}
        <text x="60" y="48" textAnchor="middle" className="text-[4px] fill-cyan-400 font-bold">
          NFT
        </text>
        
        {/* Linhas de circuito de fundo */}
        <path
          d="M20 30 L40 30 M60 30 L80 30 M100 30 L120 30"
          stroke="#00ffff"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <path
          d="M20 40 L40 40 M60 40 L80 40 M100 40 L120 40"
          stroke="#00ffff"
          strokeWidth="0.5"
          opacity="0.3"
        />
        
        {/* Gráfico de progresso (canto inferior direito) */}
        <rect x="85" y="85" width="25" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="90" cy="95" r="1.5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="95" cy="93" r="1.5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="100" cy="95" r="1.5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path
          d="M90 95 L95 93 L100 95"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
          className="drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
        />
        
        {/* Indicadores de dados (lado esquerdo) */}
        <line x1="15" y1="70" x2="25" y2="70" stroke="#00ffff" strokeWidth="1" />
        <line x1="15" y1="75" x2="30" y2="75" stroke="#00ffff" strokeWidth="1" />
        <line x1="15" y1="80" x2="20" y2="80" stroke="#00ffff" strokeWidth="1" />
        
        {/* Partículas */}
        <circle cx="25" cy="25" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="95" cy="20" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="20" cy="90" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="100" cy="70" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="15" cy="50" r="0.5" fill="#00ffff" opacity="0.6" />
        <circle cx="105" cy="50" r="0.5" fill="#00ffff" opacity="0.6" />
      </svg>
    </motion.div>
  );
} 