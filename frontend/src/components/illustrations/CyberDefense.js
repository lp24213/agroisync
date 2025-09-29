import React from 'react';

const CyberDefense = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox='0 0 400 300' className={className}>
      {/* Background */}
      <rect width='400' height='300' fill='#0a0a0a' rx='20' ry='20' />

      {/* Title */}
      <text x='50' y='40' fill='#00d4ff' fontSize='20' fontWeight='bold' filter='url(#textGlow)'>
        CYBER DEFENSE
      </text>

      {/* Placeholder Text Lines */}
      <g transform='translate(50, 60)'>
        <line x1='0' y1='0' x2='300' y2='0' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='0' y1='15' x2='250' y2='15' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
      </g>

      {/* Main Shield */}
      <g transform='translate(200, 180)'>
        {/* Shield Outline */}
        <path
          d='M 0 -80 L 40 -60 L 40 40 L 0 60 L -40 40 L -40 -60 Z'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='3'
          filter='url(#glow)'
        />

        {/* Shield Inner Glow */}
        <path
          d='M 0 -80 L 40 -60 L 40 40 L 0 60 L -40 40 L -40 -60 Z'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='1'
          opacity='0.3'
          filter='url(#innerGlow)'
        />

        {/* Shield Handle */}
        <rect
          x='-8'
          y='40'
          width='16'
          height='20'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
      </g>

      {/* Plant Inside Shield */}
      <g transform='translate(200, 180)'>
        {/* Cultivated Ground */}
        <path
          d='M -30 20 Q -20 15 -10 20 T 10 20 T 30 20'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          opacity='0.6'
          filter='url(#glow)'
        />
        <path
          d='M -30 25 Q -20 20 -10 25 T 10 25 T 30 25'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          opacity='0.6'
          filter='url(#glow)'
        />

        {/* Plant Stem */}
        <line x1='0' y1='20' x2='0' y2='-20' stroke='#00d4ff' strokeWidth='3' filter='url(#glow)' />

        {/* Plant Leaves */}
        <ellipse
          cx='-8'
          cy='-5'
          rx='6'
          ry='3'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(-30)'
          filter='url(#glow)'
        />
        <ellipse
          cx='8'
          cy='-5'
          rx='6'
          ry='3'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(30)'
          filter='url(#glow)'
        />
        <ellipse
          cx='-6'
          cy='-15'
          rx='5'
          ry='2.5'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(-25)'
          filter='url(#glow)'
        />
        <ellipse
          cx='6'
          cy='-15'
          rx='5'
          ry='2.5'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(25)'
          filter='url(#glow)'
        />
        <ellipse cx='0' cy='-25' rx='4' ry='2' fill='none' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
      </g>

      {/* Top Right Icons */}
      <g transform='translate(320, 50)'>
        {/* Brain Icon */}
        <rect
          x='0'
          y='0'
          width='60'
          height='60'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Brain Outline */}
        <path
          d='M 15 20 Q 20 15 25 20 Q 30 15 35 20 Q 40 25 35 30 Q 30 35 25 30 Q 20 35 15 30 Q 10 25 15 20'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          filter='url(#glow)'
        />
        <path d='M 20 25 Q 25 20 30 25' fill='none' stroke='#00d4ff' strokeWidth='1' filter='url(#glow)' />
        <path d='M 20 30 Q 25 25 30 30' fill='none' stroke='#00d4ff' strokeWidth='1' filter='url(#glow)' />
      </g>

      <g transform='translate(320, 130)'>
        {/* Cube Icon */}
        <rect
          x='0'
          y='0'
          width='60'
          height='60'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* 3D Cube */}
        <path d='M 20 40 L 40 30 L 40 50 L 20 60 Z' fill='none' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
        <path d='M 20 40 L 40 30 L 40 10 L 20 20 Z' fill='none' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
        <path d='M 20 20 L 20 40' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
        <path d='M 40 10 L 40 50' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
        <path d='M 20 20 L 40 10' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
        <path d='M 20 40 L 40 30' stroke='#00d4ff' strokeWidth='2' filter='url(#glow)' />
      </g>

      {/* Circuit Board Background */}
      <g opacity='0.4'>
        {/* Main Circuit Lines */}
        <path d='M 50 100 Q 100 80 150 100 T 250 100' fill='none' stroke='#00d4ff' strokeWidth='1' />
        <path d='M 50 120 Q 100 100 150 120 T 250 120' fill='none' stroke='#00d4ff' strokeWidth='1' />
        <path d='M 50 140 Q 100 120 150 140 T 250 140' fill='none' stroke='#00d4ff' strokeWidth='1' />

        {/* Vertical Connections */}
        <line x1='100' y1='80' x2='100' y2='140' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='150' y1='80' x2='150' y2='140' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />

        {/* Circuit Nodes */}
        <circle cx='100' cy='100' r='2' fill='#00d4ff' opacity='0.8' />
        <circle cx='100' cy='120' r='2' fill='#00d4ff' opacity='0.8' />
        <circle cx='100' cy='140' r='2' fill='#00d4ff' opacity='0.8' />
        <circle cx='150' cy='100' r='2' fill='#00d4ff' opacity='0.8' />
        <circle cx='150' cy='120' r='2' fill='#00d4ff' opacity='0.8' />
        <circle cx='150' cy='140' r='2' fill='#00d4ff' opacity='0.8' />
      </g>

      {/* Digital Network Pattern */}
      <g opacity='0.3'>
        {/* Hexagonal Pattern */}
        <path d='M 50 80 L 60 75 L 70 80 L 70 90 L 60 95 L 50 90 Z' fill='none' stroke='#00d4ff' strokeWidth='1' />
        <path d='M 70 80 L 80 75 L 90 80 L 90 90 L 80 95 L 70 90 Z' fill='none' stroke='#00d4ff' strokeWidth='1' />
        <path d='M 90 80 L 100 75 L 110 80 L 110 90 L 100 95 L 90 90 Z' fill='none' stroke='#00d4ff' strokeWidth='1' />

        {/* Connecting Lines */}
        <line x1='60' y1='85' x2='80' y2='85' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='80' y1='85' x2='100' y2='85' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
      </g>

      {/* Data Flow Lines */}
      <g opacity='0.5'>
        <path
          d='M 50 200 Q 100 180 150 200 T 250 200'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='1'
          strokeDasharray='5,5'
        />
        <path
          d='M 50 220 Q 100 200 150 220 T 250 220'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='1'
          strokeDasharray='5,5'
        />
      </g>

      {/* Filters */}
      <defs>
        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='2' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>

        <filter id='innerGlow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='1' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>

        <filter id='textGlow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='1' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default CyberDefense;
