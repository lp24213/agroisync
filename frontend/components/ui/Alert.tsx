'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Alert Component - Premium UI component for displaying contextual feedback messages
 * 
 * @description A fully accessible, animated alert component with multiple variants
 * and smooth transitions. Optimized for performance with React.memo.
 * 
 * @features
 * - Multiple semantic variants (info, success, warning, error)
 * - Smooth entrance animations with Framer Motion
 * - Full accessibility support with ARIA attributes
 * - TypeScript strict typing
 * - Responsive design
 * - Performance optimized with React.memo
 */

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  /** Content to display inside the alert */
  children: React.ReactNode;
  /** Visual variant that determines styling and icon */
  variant?: AlertVariant;
  /** Optional title for the alert */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  /** Custom icon to override default variant icon */
  icon?: React.ReactNode;
  /** Animation duration in seconds */
  animationDuration?: number;
}

const Alert = memo<AlertProps>(({ 
  children, 
  variant = 'info',
  title,
  className,
  dismissible = false,
  onDismiss,
  icon,
  animationDuration = 0.3
}) => {
  // Variant styles with enhanced cyberpunk theme
  const variants: Record<AlertVariant, string> = {
    info: 'bg-agro-primary/10 border-agro-primary/20 text-agro-primary shadow-agro-primary/5',
    success: 'bg-[#00FF00]/10 border-[#00FF00]/20 text-[#00FF00] shadow-[#00FF00]/5',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-yellow-500/5',
    error: 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/5',
  };

  // ARIA roles for accessibility
  const ariaRoles: Record<AlertVariant, string> = {
    info: 'status',
    success: 'status',
    warning: 'alert',
    error: 'alert',
  };

  // Default icons with improved accessibility
  const defaultIcons: Record<AlertVariant, React.ReactNode> = {
    info: (
      <svg 
        className="w-5 h-5 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg 
        className="w-5 h-5 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg 
        className="w-5 h-5 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg 
        className="w-5 h-5 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  // Animation variants for Framer Motion
  const motionVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: animationDuration,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: animationDuration * 0.7,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={motionVariants}
      role={ariaRoles[variant]}
      aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
      className={cn(
        'relative p-4 border rounded-lg backdrop-blur-sm',
        'transition-all duration-300 ease-in-out',
        'hover:shadow-lg hover:scale-[1.02]',
        'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-agro-dark',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {icon || defaultIcons[variant]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-semibold mb-1 text-current">
              {title}
            </h3>
          )}
          <div className="text-sm opacity-90 leading-relaxed">
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md',
              'hover:bg-current/10 focus:bg-current/10',
              'focus:outline-none focus:ring-2 focus:ring-current/20',
              'transition-colors duration-200'
            )}
            aria-label="Dismiss alert"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
});

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps, AlertVariant };