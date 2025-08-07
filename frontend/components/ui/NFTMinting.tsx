'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NFTMintingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NFTMinting({ size = 'md', className = '' }: NFTMintingProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00bfff]/20 to-[#000000] border-2 border-[#00bfff]/30 rounded-2xl flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="font-orbitron text-2xl md:text-3xl text-[#00bfff] mb-2 animate-fadeIn">
            NFT Minting
          </h2>
          <p className={`text-[#00bfff] ${textSizes[size]} font-medium`}>
            Tokenização
          </p>
        </div>
      </div>
    </motion.div>
  );
} 