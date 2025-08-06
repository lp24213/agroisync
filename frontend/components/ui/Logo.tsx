'use client';

import { motion } from "framer-motion";
import Image from "next/image";

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
        <Image 
          src="/assets/images/logo/agrotm-logo.svg" 
          alt="AGROTM Logo" 
          width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
          height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
          className="w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/images/logo-agrotm.svg";
          }}
        />
      </div>
      {!iconOnly && (
        <span className={`text-[#00F0FF] font-orbitron font-bold ${textSizes[size]} drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]`}>
          AGRO<span className="text-xs align-top">TM</span>
        </span>
      )}
    </motion.div>
  );
} 