import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ size = 'md', showText = true, className = '', href }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 group ${className}`}>
      <motion.div 
        className={`${sizeClasses[size]} relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg ${size === 'xl' ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Logo AGROTM com imagem PNG */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="/assets/images/logo/agrotm-logo-main.png" 
            alt="AGROTM Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
      
      {showText && (
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className={`font-bold text-white ${textSizes[size]} leading-none`}>
            AGRO
            <span className="text-cyan-400">TM</span>
          </span>
          {size === 'lg' || size === 'xl' && (
            <span className="text-xs text-gray-400 leading-none">SOLANA</span>
          )}
        </motion.div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
} 