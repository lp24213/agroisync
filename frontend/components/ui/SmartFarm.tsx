'use client';

import { motion } from "framer-motion";

interface SmartFarmProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SmartFarm({ size = 'md', className = '' }: SmartFarmProps) {
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
        {/* Fundo escuro */}
        <rect x="0" y="0" width="160" height="120" fill="#0a0a0a" />
        
        {/* Linhas roxas no campo */}
        <line x1="10" y1="80" x2="150" y2="80" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
        <line x1="10" y1="90" x2="150" y2="90" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
        <line x1="10" y1="100" x2="150" y2="100" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
        <line x1="10" y1="110" x2="150" y2="110" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
        
        {/* Plantas no campo */}
        <path d="M20 75 L20 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M40 75 L40 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M60 75 L60 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M80 75 L80 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M100 75 L100 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M120 75 L120 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        <path d="M140 75 L140 85" stroke="#00ff88" strokeWidth="1" opacity="0.6" />
        
        {/* Celeiro */}
        <rect x="50" y="40" width="60" height="40" fill="none" stroke="#00ffff" strokeWidth="2" />
        <rect x="55" y="45" width="10" height="15" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="95" y="45" width="10" height="15" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M50 40 L80 25 L110 40" fill="none" stroke="#00ffff" strokeWidth="2" />
        
        {/* Silos */}
        <rect x="20" y="35" width="15" height="45" fill="none" stroke="#00ffff" strokeWidth="2" />
        <rect x="125" y="35" width="15" height="45" fill="none" stroke="#00ffff" strokeWidth="2" />
        
        {/* Drones */}
        {/* Drone 1 */}
        <rect x="15" y="15" width="8" height="4" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="17" cy="17" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        <circle cx="21" cy="17" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        
        {/* Drone 2 */}
        <rect x="70" y="10" width="8" height="4" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="72" cy="12" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        <circle cx="76" cy="12" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        
        {/* Drone 3 */}
        <rect x="125" y="15" width="8" height="4" fill="none" stroke="#00ffff" strokeWidth="1" />
        <circle cx="127" cy="17" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        <circle cx="131" cy="17" r="1" fill="#00ffff" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        
        {/* Linhas de conexão dos drones */}
        <path d="M23 17 Q40 10 70 12" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <path d="M70 12 Q100 15 125 17" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        
        {/* Painéis holográficos */}
        {/* Painel hexagonal */}
        <path d="M130 25 L135 20 L140 25 L140 30 L135 35 L130 30 Z" fill="none" stroke="#00ffff" strokeWidth="1" />
        
        {/* Gráfico de barras */}
        <rect x="15" y="95" width="30" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="18" y="110" width="3" height="3" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="23" y="108" width="3" height="5" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="28" y="105" width="3" height="8" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="33" y="103" width="3" height="10" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M18 110 L23 108 L28 105 L33 103" fill="none" stroke="#00ffff" strokeWidth="1" />
        
        {/* Ícone de planta */}
        <rect x="140" y="95" width="15" height="20" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M145 100 L147 98 L149 100 L147 102 Z" fill="none" stroke="#00ffff" strokeWidth="1" />
        <text x="147" y="110" textAnchor="middle" className="text-[2px] fill-cyan-400">
          Plant
        </text>
        
        {/* Ícone de planta com progresso */}
        <rect x="140" y="105" width="15" height="10" fill="none" stroke="#00ffff" strokeWidth="1" />
        <path d="M145 110 L147 108 L149 110 L147 112 Z" fill="none" stroke="#00ffff" strokeWidth="1" />
        <rect x="142" y="113" width="11" height="1" fill="none" stroke="#00ffff" strokeWidth="0.5" />
        <rect x="142" y="113" width="7" height="1" fill="#00ffff" opacity="0.6" />
        
        {/* Partículas de fundo */}
        <circle cx="10" cy="20" r="0.5" fill="#00ffff" opacity="0.4" />
        <circle cx="150" cy="10" r="0.5" fill="#00ffff" opacity="0.4" />
        <circle cx="5" cy="50" r="0.5" fill="#00ffff" opacity="0.4" />
        <circle cx="155" cy="60" r="0.5" fill="#00ffff" opacity="0.4" />
        <circle cx="20" cy="30" r="0.5" fill="#00ffff" opacity="0.4" />
        <circle cx="140" cy="40" r="0.5" fill="#00ffff" opacity="0.4" />
      </svg>
    </motion.div>
  );
} 