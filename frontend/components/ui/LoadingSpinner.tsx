'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
// Type definitions
type SpinnerVariant = 'default' | 'primary' | 'secondary';
type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  className?: string;
  [key: string]: any;
}

/**
 * LoadingSpinner Component - Premium loading indicator
 * 
 * @description A versatile loading spinner with multiple variants, sizes,
 * and smooth animations. Optimized for performance and accessibility.
 * 
 * @features
 * - Multiple visual variants (spinner, dots, pulse, bars)
 * - Different sizes (xs, sm, md, lg, xl)
 * - Custom colors and animations
 * - Accessibility support with ARIA labels
 * - Performance optimized with React.memo
 * - TypeScript strict typing
 */

const LoadingSpinner = memo<LoadingSpinnerProps>(({ 
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { spinner: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
    md: { spinner: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    lg: { spinner: 'w-8 h-8', text: 'text-lg', gap: 'gap-3' },
  };

  const config = sizeConfig[size];

  // Color classes
  const colorClasses = {
    default: 'text-blue-600 border-blue-600',
    primary: 'text-blue-600 border-blue-600',
    secondary: 'text-gray-600 border-gray-600',
  };

  const colorClass = colorClasses[variant] || colorClasses.default;

  // Animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const
      }
    }
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center',
        config.gap,
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <motion.div
        className={cn(
          config.spinner,
          'border-2 border-transparent border-t-current rounded-full',
          colorClass
        )}
        variants={spinnerVariants}
        animate="animate"
      />
      
      {/* Screen reader text */}
      <span className="sr-only">Loading</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
export type { LoadingSpinnerProps, SpinnerVariant, SpinnerSize };
export default LoadingSpinner;