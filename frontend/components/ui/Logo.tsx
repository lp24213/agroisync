'use client';

import { motion } from "framer-motion";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-12 h-12 text-2xl',
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
      <div className={`${sizeClasses[size]} bg-green-500 rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold">A</span>
      </div>
      <span className={`text-white font-bold font-display ${textSizes[size]}`}>AGROTM</span>
    </motion.div>
  );
} 