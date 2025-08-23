import React from 'react';

const StakingFarming = ({ className = "w-full h-full" }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
    >
      {/* Background */}
      <rect width="400" height="300" fill="#0a0a0a" rx="20" ry="20" />
      
      {/* Title */}
      <text
        x="200"
        y="40"
        textAnchor="middle"
        fill="#00d4ff"
        fontSize="20"
        fontWeight="bold"
        filter="url(#textGlow)"
      >
        STAKING / FARMING
      </text>
      
      {/* Placeholder Text Lines */}
      <g transform="translate(50, 60)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="15" x2="250" y2="15" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
      </g>
      
      {/* Top Right Icon - Stacked Coins + Checkmark */}
      <g transform="translate(320, 30)">
        <rect
          x="0"
          y="0"
          width="60"
          height="60"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          rx="8"
          filter="url(#glow)"
        />
        {/* Stacked Coins */}
        <circle cx="30" cy="20" r="8" fill="none" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="30" cy="30" r="8" fill="none" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="30" cy="40" r="8" fill="none" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="30" cy="50" r="8" fill="none" stroke="#00d4ff" strokeWidth="2" />
        {/* Checkmark */}
        <circle cx="45" cy="15" r="6" fill="none" stroke="#00d4ff" strokeWidth="2" />
        <path
          d="M 42 15 L 44 17 L 48 13"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Main Plants */}
      {/* Left Plant */}
      <g transform="translate(100, 200)">
        {/* Roots */}
        <path
          d="M 0 0 Q -10 10 -15 20 T -20 30"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q 10 10 15 20 T 20 30"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q -5 15 -8 25 T -10 35"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q 5 15 8 25 T 10 35"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Stem */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-30"
          stroke="#00d4ff"
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Leaves */}
        <ellipse
          cx="-8"
          cy="-15"
          rx="6"
          ry="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(-30)"
          filter="url(#glow)"
        />
        <ellipse
          cx="8"
          cy="-15"
          rx="6"
          ry="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(30)"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-25"
          rx="5"
          ry="2.5"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
      </g>
      
      {/* Center Plant (Largest) */}
      <g transform="translate(200, 200)">
        {/* Roots */}
        <path
          d="M 0 0 Q -15 15 -25 30 T -35 45"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q 15 15 25 30 T 35 45"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q -8 20 -12 35 T -15 50"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q 8 20 12 35 T 15 50"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Stem */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-45"
          stroke="#00d4ff"
          strokeWidth="4"
          filter="url(#glow)"
        />
        
        {/* Leaves */}
        <ellipse
          cx="-12"
          cy="-20"
          rx="8"
          ry="4"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(-25)"
          filter="url(#glow)"
        />
        <ellipse
          cx="12"
          cy="-20"
          rx="8"
          ry="4"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(25)"
          filter="url(#glow)"
        />
        <ellipse
          cx="-8"
          cy="-35"
          rx="6"
          ry="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(-20)"
          filter="url(#glow)"
        />
        <ellipse
          cx="8"
          cy="-35"
          rx="6"
          ry="3"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          transform="rotate(20)"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-40"
          rx="7"
          ry="3.5"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
      </g>
      
      {/* Right Plant (Smallest) */}
      <g transform="translate(300, 200)">
        {/* Roots */}
        <path
          d="M 0 0 Q -8 8 -12 15 T -15 22"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <path
          d="M 0 0 Q 8 8 12 15 T 15 22"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        
        {/* Stem */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-20"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Leaves */}
        <ellipse
          cx="-5"
          cy="-10"
          rx="4"
          ry="2"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          transform="rotate(-25)"
          filter="url(#glow)"
        />
        <ellipse
          cx="5"
          cy="-10"
          rx="4"
          ry="2"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          transform="rotate(25)"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-18"
          rx="3"
          ry="1.5"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
      </g>
      
      {/* Circuit Board Ground */}
      <g transform="translate(0, 240)">
        {/* Main Circuit Lines */}
        <path
          d="M 0 0 L 400 0"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.8"
          filter="url(#glow)"
        />
        
        {/* Vertical Circuit Lines */}
        <line x1="50" y1="0" x2="50" y2="-20" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="100" y1="0" x2="100" y2="-15" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="150" y1="0" x2="150" y2="-25" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="200" y1="0" x2="200" y2="-30" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="250" y1="0" x2="250" y2="-20" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="300" y1="0" x2="300" y2="-15" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="350" y1="0" x2="350" y2="-25" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        
        {/* Horizontal Circuit Lines */}
        <line x1="0" y1="-10" x2="400" y2="-10" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="-20" x2="400" y2="-20" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="-30" x2="400" y2="-30" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        
        {/* Circuit Nodes */}
        <circle cx="50" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="100" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="150" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="200" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="250" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="300" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="350" cy="-10" r="2" fill="#00d4ff" opacity="0.8" />
      </g>
      
      {/* Background Circuit Pattern */}
      <g opacity="0.3">
        <path
          d="M 20 80 Q 60 60 100 80 T 180 80"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
        />
        <path
          d="M 220 80 Q 260 60 300 80 T 380 80"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
        />
        <path
          d="M 20 120 Q 60 100 100 120 T 180 120"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
        />
        <path
          d="M 220 120 Q 260 100 300 120 T 380 120"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
        />
      </g>
      
      {/* Distant Data Towers */}
      <g transform="translate(0, 100)" opacity="0.4">
        <line x1="30" y1="0" x2="30" y2="-40" stroke="#00d4ff" strokeWidth="1" />
        <line x1="28" y1="-40" x2="32" y2="-40" stroke="#00d4ff" strokeWidth="1" />
        <line x1="27" y1="-38" x2="33" y2="-38" stroke="#00d4ff" strokeWidth="1" />
        
        <line x1="370" y1="0" x2="370" y2="-40" stroke="#00d4ff" strokeWidth="1" />
        <line x1="368" y1="-40" x2="372" y2="-40" stroke="#00d4ff" strokeWidth="1" />
        <line x1="367" y1="-38" x2="373" y2="-38" stroke="#00d4ff" strokeWidth="1" />
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

export default StakingFarming;
