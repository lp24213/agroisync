import React from 'react';

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = 'w-full', height = 'h-6', rounded = 'rounded-xl', className = '' }) => (
  <div
    className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse ${width} ${height} ${rounded} ${className} relative overflow-hidden`}
    aria-busy="true"
    aria-label="Carregando..."
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-shimmer" />
  </div>
);

export default Skeleton;

// Tailwind extra (em globals.css ou tailwind.config.js):
// .animate-shimmer { animation: shimmer 1.3s infinite linear; }
// @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
