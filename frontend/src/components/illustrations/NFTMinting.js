import React from 'react';

const NFTMinting = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox='0 0 400 300' className={className}>
      {/* Background */}
      <rect width='400' height='300' fill='#0a0a0a' rx='20' ry='20' />

      {/* Glowing Frame */}
      <rect
        x='20'
        y='20'
        width='360'
        height='260'
        fill='none'
        stroke='#00d4ff'
        strokeWidth='3'
        rx='15'
        ry='15'
        filter='url(#glow)'
      />

      {/* Title */}
      <text x='200' y='60' textAnchor='middle' fill='#00d4ff' fontSize='24' fontWeight='bold' filter='url(#textGlow)'>
        NFT MINTING
      </text>

      {/* Growth Graph */}
      <g transform='translate(280, 200)'>
        <circle cx='0' cy='0' r='4' fill='#00d4ff' />
        <circle cx='20' cy='-15' r='4' fill='#00d4ff' />
        <circle cx='40' cy='-30' r='4' fill='#00d4ff' />
        <line x1='0' y1='0' x2='40' y2='-30' stroke='#00d4ff' strokeWidth='2' filter='url(#lineGlow)' />
      </g>

      {/* Horizontal Indicators */}
      <g transform='translate(30, 100)'>
        <line x1='0' y1='0' x2='30' y2='0' stroke='#00d4ff' strokeWidth='2' />
        <line x1='0' y1='15' x2='25' y2='15' stroke='#00d4ff' strokeWidth='2' />
        <line x1='0' y1='30' x2='35' y2='30' stroke='#00d4ff' strokeWidth='2' />
        <line x1='0' y1='45' x2='20' y2='45' stroke='#00d4ff' strokeWidth='2' />
      </g>

      {/* Circuit Lines */}
      <path d='M 50 150 Q 100 120 150 150 T 250 150' fill='none' stroke='#00d4ff' strokeWidth='1' opacity='0.6' />
      <path d='M 50 180 Q 100 150 150 180 T 250 180' fill='none' stroke='#00d4ff' strokeWidth='1' opacity='0.4' />

      {/* Digital Particles */}
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={50 + Math.random() * 300}
          cy={80 + Math.random() * 140}
          r={1 + Math.random() * 2}
          fill='#00d4ff'
          opacity={0.3 + Math.random() * 0.7}
        />
      ))}

      {/* Growing Plant */}
      <g transform='translate(200, 180)'>
        {/* Seed/Base */}
        <ellipse cx='0' cy='0' rx='8' ry='4' fill='#00d4ff' filter='url(#glow)' />

        {/* Stem */}
        <line x1='0' y1='0' x2='0' y2='-40' stroke='#00d4ff' strokeWidth='3' filter='url(#lineGlow)' />

        {/* Leaves */}
        <ellipse
          cx='-15'
          cy='-20'
          rx='8'
          ry='4'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(-30)'
          filter='url(#glow)'
        />
        <ellipse
          cx='15'
          cy='-20'
          rx='8'
          ry='4'
          fill='none'
          stroke='#00d4ff'
          strokeWidth='2'
          transform='rotate(30)'
          filter='url(#glow)'
        />

        {/* NFT Coin Bloom */}
        <circle cx='0' cy='-50' r='20' fill='none' stroke='#00d4ff' strokeWidth='3' filter='url(#glow)' />
        <text x='0' y='-45' textAnchor='middle' fill='#00d4ff' fontSize='16' fontWeight='bold' filter='url(#textGlow)'>
          NFT
        </text>
      </g>

      {/* Filters */}
      <defs>
        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='3' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>

        <filter id='textGlow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='2' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>

        <filter id='lineGlow' x='-50%' y='-50%' width='200%' height='200%'>
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

export default NFTMinting;
