'use client';

import React, { memo, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Card Component - Premium container with enhanced visual effects
 * 
 * @description A versatile card component with multiple variants, hover effects,
 * and smooth animations. Optimized for performance and accessibility.
 * 
 * @features
 * - Multiple visual variants (default, elevated, outlined, glass)
 * - Hover effects and animations
 * - Loading state with skeleton
 * - Interactive states (clickable, selectable)
 * - Gradient borders and backgrounds
 * - Full accessibility support
 * - TypeScript strict typing
 * - Performance optimized with React.memo
 */

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Size variant of the card */
  size?: CardSize;
  /** Card content */
  children: React.ReactNode;
  /** Whether the card is in loading state */
  loading?: boolean;
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Whether the card is selected */
  selected?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Whether to show border */
  bordered?: boolean;
  /** Whether to show shadow */
  shadow?: boolean;
  /** Custom background gradient */
  gradient?: string;
}

const Card = memo(forwardRef<HTMLDivElement, CardProps>(({ 
  variant = 'default',
  size = 'md',
  children,
  loading = false,
  clickable = false,
  selected = false,
  hover = true,
  header,
  footer,
  bordered = true,
  shadow = true,
  gradient,
  className,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = [
    'relative',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'ease-in-out',
  ];

  // Variant styles
  const variantStyles = {
    default: [
      'bg-agro-dark/80',
      'backdrop-blur-sm',
      bordered && 'border border-gray-700/50',
      shadow && 'shadow-lg',
    ],
    elevated: [
      'bg-agro-dark/90',
      'backdrop-blur-md',
      bordered && 'border border-gray-600/50',
      shadow && 'shadow-xl shadow-agro-blue/10',
    ],
    outlined: [
      'bg-transparent',
      'border-2 border-agro-blue/30',
      shadow && 'shadow-md',
    ],
    glass: [
      'bg-white/5',
      'backdrop-blur-xl',
      bordered && 'border border-white/10',
      shadow && 'shadow-2xl shadow-black/20',
    ],
    gradient: [
      'bg-gradient-to-br from-agro-blue/10 to-agro-green/10',
      'backdrop-blur-sm',
      bordered && 'border border-gradient-to-r from-agro-blue/30 to-agro-green/30',
      shadow && 'shadow-lg shadow-agro-blue/20',
    ],
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-lg',
    lg: 'p-6 rounded-xl',
    xl: 'p-8 rounded-2xl',
  };

  // Interactive styles
  const interactiveStyles = [
    clickable && [
      'cursor-pointer',
      hover && 'hover:scale-[1.02]',
      hover && 'hover:shadow-xl',
      hover && 'hover:shadow-agro-blue/20',
    ],
    selected && [
      'ring-2',
      'ring-agro-blue',
      'ring-opacity-50',
      'border-agro-blue/50',
    ],
  ];

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.4
      }
    },
    hover: {
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          'animate-pulse',
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        <div className="space-y-3">
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          <div className="h-20 bg-gray-700/50 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        interactiveStyles,
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover && clickable ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      {...props}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Scanlines Effect */}
        <div className="absolute inset-0 opacity-5 scanlines"></div>
        
        {/* Gradient Overlay */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-agro-blue/5 to-agro-green/5"></div>
        )}
        
        {/* Glow Effect on Hover */}
        {hover && clickable && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-agro-blue/10 to-agro-green/10 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {header && (
          <motion.div
            className="mb-4 pb-4 border-b border-gray-700/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {header}
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        {footer && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {footer}
          </motion.div>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 bg-agro-blue rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
}));

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = memo(forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  >
    {children}
  </div>
)));

CardHeader.displayName = 'CardHeader';

// Card Title Component
export const CardTitle = memo(forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  >
    {children}
  </h3>
)));

CardTitle.displayName = 'CardTitle';

// Card Description Component
export const CardDescription = memo(forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-400', className)}
    {...props}
  >
    {children}
  </p>
)));

CardDescription.displayName = 'CardDescription';

// Card Content Component
export const CardContent = memo(forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn('pt-0', className)}
    {...props}
  >
    {children}
  </div>
)));

CardContent.displayName = 'CardContent';

// Card Footer Component
export const CardFooter = memo(forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-0', className)}
    {...props}
  >
    {children}
  </div>
)));

CardFooter.displayName = 'CardFooter';

export { Card };
export default Card;