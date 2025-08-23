import React from 'react';

const PremiumFarmer = ({ className = "w-full h-full" }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
    >
      {/* Background */}
      <rect width="400" height="300" fill="#0a0a0a" rx="20" ry="20" />
      
      {/* Speckled Background */}
      {[...Array(100)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 400}
          cy={Math.random() * 300}
          r={0.5 + Math.random() * 1}
          fill="#00d4ff"
          opacity={0.1 + Math.random() * 0.2}
        />
      ))}
      
      {/* Premium Badge */}
      <g transform="translate(280, 40)">
        <path
          d="M 0 0 L 15 -10 L 15 10 L 0 20 L -15 10 L -15 -10 Z"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="#00d4ff"
          fontSize="8"
          fontWeight="bold"
          filter="url(#textGlow)"
        >
          PREMIUM
        </text>
        <path
          d="M -5 -5 L 0 -10 L 5 -5 M -2 -7 L 0 -9 L 2 -7"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
      </g>
      
      {/* Farmer Figure */}
      <g transform="translate(200, 200)">
        {/* Cowboy Hat */}
        <ellipse
          cx="0"
          cy="-80"
          rx="25"
          ry="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-85"
          rx="20"
          ry="6"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Head */}
        <circle
          cx="0"
          cy="-70"
          r="15"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Futuristic Goggles */}
        <rect
          x="-12"
          y="-75"
          width="24"
          height="8"
          rx="4"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <rect
          x="-10"
          y="-73"
          width="20"
          height="4"
          rx="2"
          fill="#00d4ff"
          opacity="0.3"
        />
        
        {/* Mustache and Beard */}
        <path
          d="M -8 -65 Q -4 -68 0 -65 Q 4 -68 8 -65"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
        <path
          d="M -6 -63 Q -3 -66 0 -63 Q 3 -66 6 -63"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* Mouth */}
        <line
          x1="-3"
          y1="-60"
          x2="3"
          y2="-60"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* Collared Shirt */}
        <path
          d="M -15 -55 L 15 -55 L 15 -35 L -15 -35 Z"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M -15 -55 L -15 -35 M 15 -55 L 15 -35"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Overalls */}
        <path
          d="M -20 -35 L 20 -35 L 20 -15 L -20 -15 Z"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Overall Straps */}
        <path
          d="M -20 -35 L -15 -25 L -15 -15"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 20 -35 L 15 -25 L 15 -15"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Buckles */}
        <circle
          cx="-15"
          cy="-25"
          r="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <circle
          cx="15"
          cy="-25"
          r="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Plant Sprout Emblem */}
        <g transform="translate(0, -25)">
          {/* Stem */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-8"
            stroke="#00d4ff"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Leaves */}
          <ellipse
            cx="-4"
            cy="-4"
            rx="3"
            ry="2"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
            transform="rotate(-30)"
            filter="url(#glow)"
          />
          <ellipse
            cx="4"
            cy="-4"
            rx="3"
            ry="2"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
            transform="rotate(30)"
            filter="url(#glow)"
          />
          <ellipse
            cx="0"
            cy="-8"
            rx="2"
            ry="1.5"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
            filter="url(#glow)"
          />
        </g>
      </g>
      
      {/* Filters */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default PremiumFarmer;
