import React from 'react';

const InteractiveDashboard = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox='0 0 400 300' className={className}>
      {/* Background */}
      <rect width='400' height='300' fill='#0a0a0a' rx='20' ry='20' />

      {/* Grain Texture */}
      <filter id='noise'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' />
        <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0' />
      </filter>
      <rect width='400' height='300' filter='url(#noise)' opacity='0.1' />

      {/* Title */}
      <text x='200' y='40' textAnchor='middle' fill='#00d4ff' fontSize='20' fontWeight='bold' filter='url(#textGlow)'>
        INTERACTIVE DASHBOARD
      </text>

      {/* Menu Icon */}
      <g transform='translate(320, 25)'>
        <line x1='0' y1='0' x2='15' y2='0' stroke='#00d4ff' strokeWidth='2' />
        <line x1='0' y1='5' x2='15' y2='5' stroke='#00d4ff' strokeWidth='2' />
      </g>

      {/* Top Row Panels */}
      {/* Top-Left Panel - Line Graph */}
      <g transform='translate(50, 70)'>
        <rect
          x='0'
          y='0'
          width='120'
          height='80'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Graph Lines */}
        <path
          d='M 10 70 Q 30 50 50 60 T 90 40 T 110 20'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          filter='url(#lineGlow)'
        />
        {/* Data Points */}
        <circle cx='10' cy='70' r='2' fill='#00d4ff' />
        <circle cx='50' cy='60' r='2' fill='#00d4ff' />
        <circle cx='90' cy='40' r='2' fill='#00d4ff' />
        <circle cx='110' cy='20' r='2' fill='#00d4ff' />
      </g>

      {/* Top-Right Panel - Bar Chart */}
      <g transform='translate(230, 70)'>
        <rect
          x='0'
          y='0'
          width='120'
          height='80'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Horizontal Lines */}
        <line x1='10' y1='20' x2='110' y2='20' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='35' x2='110' y2='35' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='50' x2='110' y2='50' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='65' x2='110' y2='65' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        {/* Filled Lines */}
        <line x1='10' y1='20' x2='90' y2='20' stroke='#00d4ff' strokeWidth='3' />
        <line x1='10' y1='35' x2='70' y2='35' stroke='#00d4ff' strokeWidth='3' />
        <line x1='10' y1='50' x2='50' y2='50' stroke='#00d4ff' strokeWidth='3' />
        <line x1='10' y1='65' x2='30' y2='65' stroke='#00d4ff' strokeWidth='3' />
      </g>

      {/* Bottom Row Panels */}
      {/* Middle-Left Panel */}
      <g transform='translate(50, 170)'>
        <rect
          x='0'
          y='0'
          width='120'
          height='80'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Horizontal Lines */}
        <line x1='10' y1='20' x2='110' y2='20' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='35' x2='110' y2='35' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='50' x2='110' y2='50' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
        <line x1='10' y1='65' x2='110' y2='65' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
      </g>

      {/* Middle-Center Panel - CMF */}
      <g transform='translate(190, 170)'>
        <rect
          x='0'
          y='0'
          width='120'
          height='80'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Hexagon */}
        <path
          d='M 60 20 L 100 35 L 100 65 L 60 80 L 20 65 L 20 35 Z'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          filter='url(#glow)'
        />
        {/* Shield Icon */}
        <path
          d='M 60 25 L 70 30 L 70 40 L 60 45 L 50 40 L 50 30 Z'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='1'
          filter='url(#glow)'
        />
        {/* CMF Text */}
        <text x='60' y='65' textAnchor='middle' fill='#00d4ff' fontSize='16' fontWeight='bold' filter='url(#textGlow)'>
          CMF
        </text>
      </g>

      {/* Middle-Right Panel - Grid */}
      <g transform='translate(330, 170)'>
        <rect
          x='0'
          y='0'
          width='120'
          height='80'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          rx='8'
          filter='url(#glow)'
        />
        {/* Grid Squares */}
        {[...Array(6)].map((_, row) =>
          [...Array(8)].map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={10 + col * 12}
              y={10 + row * 10}
              width='10'
              height='8'
              fill={Math.random() > 0.5 ? '#00d4ff' : 'none'}
              stroke='#00d4ff'
              strokeWidth='1'
              opacity={Math.random() > 0.5 ? 0.8 : 0.3}
            />
          ))
        )}
      </g>

      {/* Bottom Icons */}
      {/* DeFi Icon */}
      <g transform='translate(50, 270)'>
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
        {/* Stacked Coins */}
        <circle cx='30' cy='25' r='8' fill='none' stroke='#00d4ff' strokeWidth='2' />
        <circle cx='30' cy='35' r='8' fill='none' stroke='#00d4ff' strokeWidth='2' />
        <text x='30' y='55' textAnchor='middle' fill='#00d4ff' fontSize='10' fontWeight='bold'>
          DeFi
        </text>
      </g>

      {/* Growth Icon */}
      <g transform='translate(130, 270)'>
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
        {/* Plant Sprout */}
        <line x1='30' y1='50' x2='30' y2='30' stroke='#00d4ff' strokeWidth='2' />
        <ellipse cx='25' cy='30' rx='3' ry='2' fill='none' stroke='#00d4ff' strokeWidth='2' />
        <ellipse cx='35' cy='30' rx='3' ry='2' fill='none' stroke='#00d4ff' strokeWidth='2' />
        <ellipse cx='30' cy='25' rx='2' ry='1.5' fill='none' stroke='#00d4ff' strokeWidth='2' />
      </g>

      {/* Chart Icon */}
      <g transform='translate(210, 270)'>
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
        {/* Bar Chart */}
        <rect x='15' y='45' width='8' height='15' fill='#00d4ff' opacity='0.8' />
        <rect x='26' y='40' width='8' height='20' fill='#00d4ff' opacity='0.8' />
        <rect x='37' y='35' width='8' height='25' fill='#00d4ff' opacity='0.8' />
        {/* Arrow */}
        <path d='M 30 20 L 35 15 L 30 10 L 25 15 Z' fill='#00d4ff' />
      </g>

      {/* Abstract Icon */}
      <g transform='translate(290, 270)'>
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
        {/* Abstract Shape */}
        <path
          d='M 20 20 L 40 20 L 35 35 L 25 40 L 15 35 Z'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          filter='url(#glow)'
        />
      </g>

      {/* Connecting Lines */}
      <path d='M 170 110 Q 200 110 230 110' fill='none' stroke='#00d4ff' strokeWidth='1' opacity='0.4' />
      <path d='M 170 210 Q 200 210 230 210' fill='none' stroke='#00d4ff' strokeWidth='1' opacity='0.4' />
      <path d='M 170 210 Q 200 210 330 210' fill='none' stroke='#00d4ff' strokeWidth='1' opacity='0.4' />

      {/* Filters */}
      <defs>
        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='2' result='coloredBlur' />
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

export default InteractiveDashboard;
