'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

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

type SpinnerVariant = 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit';
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  /** Visual variant of the spinner */
  variant?: SpinnerVariant;
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Custom color */
  color?: string;
  /** Loading text */
  text?: string;
  /** Whether to show text */
  showText?: boolean;
  /** Custom className */
  className?: string;
  /** Whether to center the spinner */
  centered?: boolean;
  /** Custom ARIA label */
  'aria-label'?: string;
}

const LoadingSpinner = memo<LoadingSpinnerProps>(({ 
  variant = 'spinner',
  size = 'md',
  color = 'agro-blue',
  text = 'Loading...',
  showText = false,
  className,
  centered = false,
  'aria-label': ariaLabel = 'Loading',
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { spinner: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
    sm: { spinner: 'w-5 h-5', text: 'text-sm', gap: 'gap-2' },
    md: { spinner: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    lg: { spinner: 'w-8 h-8', text: 'text-lg', gap: 'gap-3' },
    xl: { spinner: 'w-12 h-12', text: 'text-xl', gap: 'gap-4' },
  };

  const config = sizeConfig[size];

  // Color classes
  const colorClasses = {
    'agro-blue': 'text-agro-blue border-agro-blue',
    'agro-green': 'text-agro-green border-agro-green',
    'agro-purple': 'text-agro-purple border-agro-purple',
    white: 'text-white border-white',
    gray: 'text-gray-400 border-gray-400',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses['agro-blue'];

  // Animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const barsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  const barVariants = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut'
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={cn(
              config.spinner,
              'border-2 border-transparent border-t-current rounded-full',
              colorClass
            )}
            variants={spinnerVariants}
            animate="animate"
          />
        );

      case 'dots':
        return (
          <motion.div
            className={cn('flex', config.gap)}
            variants={dotsVariants}
            animate="animate"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full bg-current',
                  colorClass
                )}
                variants={dotVariants}
              />
            ))}
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn(
              config.spinner,
              'rounded-full bg-current',
              colorClass
            )}
            variants={pulseVariants}
            animate="animate"
          />
        );

      case 'bars':
        return (
          <motion.div
            className={cn('flex items-end', config.gap)}
            variants={barsVariants}
            animate="animate"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'w-1 h-4 bg-current rounded-sm',
                  colorClass
                )}
                variants={barVariants}
              />
            ))}
          </motion.div>
        );

      case 'orbit':
        return (
          <motion.div
            className={cn(config.spinner, 'relative')}
            variants={orbitVariants}
            animate="animate"
          >
            <div className={cn(
              'absolute inset-0 border-2 border-transparent border-t-current rounded-full',
              colorClass
            )} />
            <div className={cn(
              'absolute inset-1 border-2 border-transparent border-b-current rounded-full',
              colorClass
            )} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  const containerClasses = cn(
    'inline-flex items-center',
    config.gap,
    centered && 'justify-center w-full',
    className
  );

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-label={ariaLabel}
      {...props}
    >
      {renderSpinner()}
      
      {showText && text && (
        <motion.span
          className={cn(
            config.text,
            'text-gray-400 font-medium',
            colorClass
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.span>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Preset spinner components for common use cases
export const SmallSpinner = memo(() => (
  <LoadingSpinner size="sm" variant="spinner" />
));

export const MediumSpinner = memo(() => (
  <LoadingSpinner size="md" variant="spinner" />
));

export const LargeSpinner = memo(() => (
  <LoadingSpinner size="lg" variant="spinner" />
));

export const DotsSpinner = memo(() => (
  <LoadingSpinner variant="dots" />
));

export const PulseSpinner = memo(() => (
  <LoadingSpinner variant="pulse" />
));

export const BarsSpinner = memo(() => (
  <LoadingSpinner variant="bars" />
));

export const OrbitSpinner = memo(() => (
  <LoadingSpinner variant="orbit" />
));

// Full page loading component
export const FullPageLoader = memo<{ text?: string }>(({ text = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-agro-darker/80 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner size="xl" variant="orbit" color="agro-blue" />
      <motion.p
        className="text-lg text-gray-300 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </div>
  </div>
));

// Inline loading component
export const InlineLoader = memo<{ text?: string }>(({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="md" variant="spinner" showText text={text} />
  </div>
));

// Button loading component
export const ButtonLoader = memo(() => (
  <LoadingSpinner size="sm" variant="spinner" color="white" />
));

export { LoadingSpinner };
export default LoadingSpinner;