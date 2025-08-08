'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/assets/images/logo/agrotm-logo-white.svg"
        alt="AGROTM Logo"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
      {showText && (
        <span className={`font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent ${textSizes[size]}`}>
          AGROTM
        </span>
      )}
    </div>
  );
};

export { Logo };
export default Logo; 