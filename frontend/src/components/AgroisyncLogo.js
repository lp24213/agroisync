import React from 'react';

const AgroisyncLogo = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Logo SVG com folha de trigo dourada */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Folha de trigo dourada */}
        <path 
          d="M16 2C16 2 8 6 8 12C8 16 12 18 16 20C20 18 24 16 24 12C24 6 16 2 16 2Z" 
          fill="#FFD700" 
          stroke="#B8860B" 
          strokeWidth="0.5"
        />
        {/* Caule */}
        <path 
          d="M16 20L16 30" 
          stroke="#8B4513" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {/* Grãos */}
        <circle cx="12" cy="8" r="1.5" fill="#FFD700" />
        <circle cx="20" cy="8" r="1.5" fill="#FFD700" />
        <circle cx="14" cy="6" r="1.5" fill="#FFD700" />
        <circle cx="18" cy="6" r="1.5" fill="#FFD700" />
        <circle cx="16" cy="4" r="1.5" fill="#FFD700" />
        {/* Texto AGROISYNC */}
        <text 
          x="16" 
          y="26" 
          textAnchor="middle" 
          fontSize="6" 
          fill="#2D3748" 
          fontFamily="Inter, sans-serif" 
          fontWeight="700"
        >
          AGROISYNC
        </text>
      </svg>
      
      {/* Texto do logo */}
      <span className="text-lg font-bold text-gray-900 tracking-tight">
        AGROISYNC
      </span>
    </div>
  );
};

export default AgroisyncLogo;
