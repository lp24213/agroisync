'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Badge Component - Premium UI component for displaying status indicators and labels
 * 
 * @description A versatile, animated badge component with multiple variants, sizes,
 * and interactive states. Optimized for performance and accessibility.
 * 
 * @features
 * - Multiple semantic variants with cyberpunk styling
 * - Three size options (sm, md, lg)
 * - Smooth hover animations
 * - Optional pulse animation for active states
 * - Full accessibility support
 * - TypeScript strict typing
 * - Performance optimized with React.memo
 */

type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary'
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'outline';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  /** Content to display inside the badge */
  children: React.ReactNode;
  /** Visual variant that determines styling */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Additional CSS classes */
  className?: string;
  /** Whether the badge should pulse (for active/live states) */
  pulse?: boolean;
  /** Whether the badge is interactive (clickable) */
  interactive?: boolean;
  /** Click handler for interactive badges */
  onClick?: () => void;
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const Badge = memo<BadgeProps>(({ 
  children, 
  variant = 'default', 
  size = 'md',
  className,
  pulse = false,
  interactive = false,
  onClick,
  icon,
  'aria-label': ariaLabel,
  ...props
}) => {
  // Enhanced variant styles with cyberpunk theme
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-agro-dark/60 text-agro-light border-agro-light/20',
    primary: 'bg-agro-primary/20 text-agro-primary border-agro-primary/30 shadow-agro-primary/10',
    secondary: 'bg-agro-secondary/20 text-agro-secondary border-agro-secondary/30 shadow-agro-secondary/10',
    success: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/10',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/10',
    error: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/10',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/10',
    outline: 'bg-transparent text-agro-light border-agro-light/40 hover:bg-agro-light/5',
  };

  const sizes: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const Component = interactive ? motion.button : motion.span;

  return (
    <Component
      onClick={interactive ? onClick : undefined}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full border',
        'transition-all duration-200 ease-in-out',
        'backdrop-blur-sm',
        variants[variant],
        sizes[size],
        interactive && [
          'cursor-pointer',
          'hover:scale-105 hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-current focus:ring-offset-agro-dark',
          'active:scale-95'
        ],
        pulse && 'animate-pulse',
        className
      )}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </Component>
  );
});

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };