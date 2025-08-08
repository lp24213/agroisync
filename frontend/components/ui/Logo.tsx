'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/assets/images/logo/agrotm-logo-white.svg"
        alt="AGROTM Logo"
        width={size === 'sm' ? 40 : size === 'md' ? 64 : 80}
        height={size === 'sm' ? 40 : size === 'md' ? 64 : 80}
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