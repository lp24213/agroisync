'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
};

export function Logo({ size = 'md', iconOnly = false }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-[#00bfff] to-[#0080ff] rounded-lg flex items-center justify-center shadow-neon-blue">
          <span className="text-black font-bold text-sm">A</span>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00bfff] rounded-full animate-pulse"></div>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`text-[#00bfff] font-orbitron font-bold ${textSizes[size]} drop-shadow-[0_0_10px_rgba(0,191,255,0.7)]`}>
            AGROTM
          </span>
          <span className="text-[#00bfff] text-xs font-medium tracking-wider">
            DIGITAL AGRICULTURE
          </span>
        </div>
      )}
    </div>
  );
} 