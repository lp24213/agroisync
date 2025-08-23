import React from 'react';

const SmartFarming = ({ className = "w-full h-full" }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
    >
      {/* Background */}
      <rect width="400" height="300" fill="#0a0a0a" rx="20" ry="20" />
      
      {/* Starry Sky */}
      {[...Array(50)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 400}
          cy={Math.random() * 100}
          r={0.5 + Math.random() * 1}
          fill="#00d4ff"
          opacity={0.3 + Math.random() * 0.7}
        />
      ))}
      
      {/* Field */}
      <rect x="0" y="150" width="400" height="150" fill="#0a1a0a" />
      
      {/* Crop Rows */}
      {[...Array(8)].map((_, i) => (
        <g key={i}>
          <line
            x1="0"
            y1={160 + i * 15}
            x2="400"
            y2={160 + i * 15}
            stroke="#00d4ff"
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Individual Plants */}
          {[...Array(20)].map((_, j) => (
            <circle
              key={j}
              cx={20 + j * 20}
              cy={160 + i * 15}
              r="1"
              fill="#00d4ff"
              opacity="0.8"
            />
          ))}
        </g>
      ))}
      
      {/* Neon Lines Between Rows */}
      {[...Array(7)].map((_, i) => (
        <line
          key={i}
          x1="0"
          y1={167.5 + i * 15}
          x2="400"
          y2={167.5 + i * 15}
          stroke="#ff00ff"
          strokeWidth="2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
      ))}
      
      {/* Traditional Barn */}
      <g transform="translate(150, 200)">
        {/* Barn Structure */}
        <rect
          x="0"
          y="0"
          width="100"
          height="60"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Barn Roof */}
        <path
          d="M 0 0 L 50 -20 L 100 0"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Barn Door */}
        <rect
          x="35"
          y="20"
          width="30"
          height="40"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Barn Windows */}
        <rect
          x="10"
          y="15"
          width="15"
          height="15"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
        <rect
          x="75"
          y="15"
          width="15"
          height="15"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          filter="url(#glow)"
        />
      </g>
      
      {/* Silos */}
      <g transform="translate(80, 180)">
        <ellipse
          cx="0"
          cy="0"
          rx="15"
          ry="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-20"
          rx="12"
          ry="6"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-40"
          rx="10"
          ry="5"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
      </g>
      
      <g transform="translate(320, 180)">
        <ellipse
          cx="0"
          cy="0"
          rx="15"
          ry="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-20"
          rx="12"
          ry="6"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
        <ellipse
          cx="0"
          cy="-40"
          rx="10"
          ry="5"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#glow)"
        />
      </g>
      
      {/* Drones */}
      {/* Upper Left Drone */}
      <g transform="translate(80, 80)">
        {/* Drone Body */}
        <rect
          x="0"
          y="0"
          width="20"
          height="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Propellers */}
        <line x1="-8" y1="4" x2="8" y2="4" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="10" y1="2" x2="10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="-10" y1="2" x2="-10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        {/* Glowing Underside */}
        <ellipse
          cx="10"
          cy="4"
          rx="8"
          ry="3"
          fill="#00d4ff"
          opacity="0.3"
          filter="url(#glow)"
        />
      </g>
      
      {/* Upper Right Drone */}
      <g transform="translate(300, 80)">
        {/* Drone Body */}
        <rect
          x="0"
          y="0"
          width="20"
          height="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Propellers */}
        <line x1="-8" y1="4" x2="8" y2="4" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="10" y1="2" x2="10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="-10" y1="2" x2="-10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        {/* Glowing Underside */}
        <ellipse
          cx="10"
          cy="4"
          rx="8"
          ry="3"
          fill="#00d4ff"
          opacity="0.3"
          filter="url(#glow)"
        />
      </g>
      
      {/* Center Drone */}
      <g transform="translate(190, 60)">
        {/* Drone Body */}
        <rect
          x="0"
          y="0"
          width="20"
          height="8"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {/* Propellers */}
        <line x1="-8" y1="4" x2="8" y2="4" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="10" y1="2" x2="10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="-10" y1="2" x2="-10" y2="6" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
        {/* Glowing Underside */}
        <ellipse
          cx="10"
          cy="4"
          rx="8"
          ry="3"
          fill="#00d4ff"
          opacity="0.3"
          filter="url(#glow)"
        />
      </g>
      
      {/* Data Flow Lines */}
      <g opacity="0.6">
        <path
          d="M 50 120 Q 100 100 150 120 T 250 120"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <path
          d="M 50 140 Q 100 120 150 140 T 250 140"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
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
        
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default SmartFarming;
