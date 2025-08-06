'use client';

import { motion } from "framer-motion";
import Image from "next/image";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotateY: 5 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full"
      >
        <Image
          src="/assets/dashboard.png"
          alt="AGROTM Interactive Dashboard"
          width={600}
          height={400}
          className="rounded-2xl shadow-neon hover:shadow-neon transition-all duration-500 w-full h-full object-cover"
          unoptimized={true}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('dashboard.png')) {
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }
          }}
        />
        
        {/* Fallback quando imagem não carrega */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-2xl flex flex-col justify-center items-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="font-orbitron text-2xl md:text-3xl text-[#00FF7F] mb-2 animate-fadeIn">
            Dashboard Interativo
          </h2>
          <p className="text-sm md:text-base text-[#cccccc] leading-relaxed text-center px-4">
            Analytics avançados e interface de monitoramento em tempo real
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
} 