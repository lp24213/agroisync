'use client';

import { motion } from "framer-motion";

interface InteractiveDashboardProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InteractiveDashboard({ size = 'md', className = '' }: InteractiveDashboardProps) {
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
        <text x="80" y="20" textAnchor="middle" className="text-[6px] fill-cyan-400 font-bold">
          INTERACTIVE DASHBOARD
        </text>
        
        {/* Gráfico de linha (painel esquerdo) */}
        <rect x="15" y="30" width="40" height="25" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path
          d="M20 50 L25 45 L30 48 L35 42 L40 45 L45 40 L50 43"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        />
        
        {/* Linhas de grade do gráfico */}
        <line x1="20" y1="45" x2="50" y2="45" stroke="#00ffff" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="50" x2="50" y2="50" stroke="#00ffff" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="55" x2="50" y2="55" stroke="#00ffff" strokeWidth="0.5" opacity="0.3" />
        
        {/* Lista de texto (painel central) */}
        <rect x="65" y="30" width="35" height="25" fill="none" stroke="#00ffff" strokeWidth="1" />
        <line x1="70" y1="40" x2="95" y2="40" stroke="#00ffff" strokeWidth="1" />
        <line x1="70" y1="45" x2="90" y2="45" stroke="#00ffff" strokeWidth="1" />
        <line x1="70" y1="50" x2="92" y2="50" stroke="#00ffff" strokeWidth="1" />
        
        {/* Grid/Calendário (painel direito) */}
        <rect x="110" y="30" width="35" height="25" fill="none" stroke="#00ffff" strokeWidth="1" />
        {/* Grade 3x3 */}
        <rect x="115" y="35" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="125" y="35" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="135" y="35" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="115" y="45" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="125" y="45" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="135" y="45" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="115" y="55" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="125" y="55" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="135" y="55" width="8" height="8" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        
        {/* Ícone CMF */}
        <path
          d="M25 70 L35 70 L35 80 L25 80 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1"
        />
        <text x="30" y="77" textAnchor="middle" className="text-[4px] fill-cyan-400 font-bold">
          CMF
        </text>
        
        {/* Ícones da parte inferior */}
        {/* DeFi */}
        <rect x="15" y="90" width="20" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="20" cy="95" r="2" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="25" cy="95" r="2" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="30" cy="95" r="2" fill="none" stroke="#00ffff" strokeWidth="1" />
        <text x="25" y="105" textAnchor="middle" className="text-[3px] fill-cyan-400 font-bold">
          DeFi
        </text>
        
        {/* Planta */}
        <rect x="40" y="90" width="20" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M45 100 L50 95 L55 100 L50 105 Z" fill="none" stroke="#00ffff" strokeWidth="1" />
        <text x="50" y="115" textAnchor="middle" className="text-[3px] fill-cyan-400 font-bold">
          Plant
        </text>
        
        {/* Gráfico de crescimento */}
        <rect x="65" y="90" width="20" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="68" y="105" width="2" height="5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="72" y="102" width="2" height="8" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="76" y="100" width="2" height="10" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M68 105 L72 102 L76 100" fill="none" stroke="#00ffff" strokeWidth="1" />
        <text x="75" y="115" textAnchor="middle" className="text-[3px] fill-cyan-400 font-bold">
          Growth
        </text>
        
        {/* Ícone geométrico */}
        <rect x="90" y="90" width="20" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M95 95 L100 100 L95 105 L90 100 Z" fill="none" stroke="#00ffff" strokeWidth="1" />
        <text x="100" y="115" textAnchor="middle" className="text-[3px] fill-cyan-400 font-bold">
          Asset
        </text>
        
        {/* Ícone circular/folha */}
        <rect x="115" y="90" width="20" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="125" cy="100" r="5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M125 95 L125 105 M120 100 L130 100" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <text x="125" y="115" textAnchor="middle" className="text-[3px] fill-cyan-400 font-bold">
          Global
        </text>
      </svg>
    </motion.div>
  );
} 