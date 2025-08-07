'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo/agrotm-logo-main.png"
        alt="AGROTM Logo"
        width={48}
        height={48}
        className={sizeClasses[size]}
      />
      <span className="text-xl font-bold text-white">AGROTM</span>
    </div>
  );
};

export { Logo };
export default Logo; 