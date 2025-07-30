'use client';

import React, { memo, forwardRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, Check, AlertCircle } from 'lucide-react';

/**
 * Button Component - Enterprise-grade interactive button with enhanced UX
 * 
 * @description A fully accessible, animated button component with loading states,
 * icons, and multiple variants. Optimized for performance and user experience.
 * 
 * @features
 * - Multiple variants and sizes
 * - Loading state with spinner
 * - Icon support (start and end)
 * - Smooth animations and hover effects
 * - Full accessibility support with ARIA attributes
 * - TypeScript strict typing
 * - Performance optimized with React.memo and forwardRef
 * - Success and error states
 * - Ripple effect
 * - Keyboard navigation support
 */

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive' 
  | 'success'
  | 'warning'
  | 'info';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size variant of the button */
  size?: ButtonSize;
  /** Button content */
  children: React.ReactNode;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Whether the button shows success state */
  success?: boolean;
  /** Whether the button shows error state */
  error?: boolean;
  /** Icon to display at the start of the button */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the button */
  endIcon?: React.ReactNode;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Whether the button should have rounded corners */
  rounded?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Whether to show ripple effect on click */
  ripple?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Form association */
  form?: string;
  /** Name attribute */
  name?: string;
  /** Value attribute */
  value?: string;
  /** Auto focus */
  autoFocus?: boolean;
  /** Tab index */
  tabIndex?: number;
  /** On click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** On focus handler */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  /** On blur handler */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  /** On key down handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** On key up handler */
  onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** On mouse enter handler */
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** On mouse leave handler */
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  loading = false,
  success = false,
  error = false,
  startIcon,
  endIcon,
  fullWidth = false,
  rounded = false,
  loadingText,
  ripple = true,
  disabled = false,
  type = 'button',
  form,
  name,
  value,
  autoFocus,
  tabIndex,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onMouseEnter,
  onMouseLeave,
  ...props 
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Memoized base classes
  const baseClasses = useMemo(() => [
    'relative inline-flex items-center justify-center',
    'font-semibold transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'overflow-hidden select-none',
    'backdrop-blur-sm',
    'border border-transparent',
    fullWidth && 'w-full',
    rounded ? 'rounded-full' : 'rounded-lg'
  ], [fullWidth, rounded]);

  // Memoized variant configurations
  const variants = useMemo((): Record<ButtonVariant, string> => ({
    primary: [
      'bg-gradient-to-r from-blue-600 to-blue-700',
      'hover:from-blue-700 hover:to-blue-800',
      'text-white shadow-lg shadow-blue-600/25',
      'focus:ring-blue-500/50',
      'active:scale-95'
    ].join(' '),
    secondary: [
      'bg-gradient-to-r from-gray-600 to-gray-700',
      'hover:from-gray-700 hover:to-gray-800',
      'text-white shadow-lg shadow-gray-600/25',
      'focus:ring-gray-500/50',
      'active:scale-95'
    ].join(' '),
    outline: [
      'border-2 border-blue-600/50 bg-transparent',
      'hover:border-blue-600 hover:bg-blue-600/10',
      'text-blue-600',
      'focus:ring-blue-500/50',
      'active:bg-blue-600/20'
    ].join(' '),
    ghost: [
      'bg-transparent hover:bg-gray-100/10',
      'text-gray-700 hover:text-gray-900',
      'focus:ring-gray-500/30',
      'active:bg-gray-100/20'
    ].join(' '),
    destructive: [
      'bg-gradient-to-r from-red-600 to-red-700',
      'hover:from-red-700 hover:to-red-800',
      'text-white shadow-lg shadow-red-600/25',
      'focus:ring-red-500/50',
      'active:scale-95'
    ].join(' '),
    success: [
      'bg-gradient-to-r from-green-600 to-green-700',
      'hover:from-green-700 hover:to-green-800',
      'text-white shadow-lg shadow-green-600/25',
      'focus:ring-green-500/50',
      'active:scale-95'
    ].join(' '),
    warning: [
      'bg-gradient-to-r from-yellow-600 to-yellow-700',
      'hover:from-yellow-700 hover:to-yellow-800',
      'text-white shadow-lg shadow-yellow-600/25',
      'focus:ring-yellow-500/50',
      'active:scale-95'
    ].join(' '),
    info: [
      'bg-gradient-to-r from-cyan-600 to-cyan-700',
      'hover:from-cyan-700 hover:to-cyan-800',
      'text-white shadow-lg shadow-cyan-600/25',
      'focus:ring-cyan-500/50',
      'active:scale-95'
    ].join(' ')
  }), []);

  // Memoized size configurations
  const sizes = useMemo((): Record<ButtonSize, string> => ({
    xs: 'px-2 py-1 text-xs gap-1 min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-base gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-lg gap-2.5 min-h-[48px]',
    xl: 'px-8 py-4 text-xl gap-3 min-h-[56px]'
  }), []);

  // Handle click with ripple effect
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled || success || error) return;

    // Create ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    onClick?.(e);
  }, [loading, disabled, success, error, ripple, onClick]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
    onKeyDown?.(e);
  }, [handleClick, onKeyDown]);

  // Loading spinner component
  const LoadingSpinner = useMemo(() => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      aria-hidden="true"
    />
  ), []);

  // Success icon component
  const SuccessIcon = useMemo(() => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-4 h-4 text-white"
      aria-hidden="true"
    >
      <Check className="w-full h-full" />
    </motion.div>
  ), []);

  // Error icon component
  const ErrorIcon = useMemo(() => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-4 h-4 text-white"
      aria-hidden="true"
    >
      <AlertCircle className="w-full h-full" />
    </motion.div>
  ), []);

  // Determine current state
  const isDisabled = disabled || loading;
  const currentVariant = success ? 'success' : error ? 'destructive' : variant;

  return (
    <motion.button
      ref={ref}
      type={type}
      form={form}
      name={name}
      value={value}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      className={cn(baseClasses, variants[currentVariant], sizes[size], className)}
      disabled={isDisabled}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-describedby={loading ? 'loading-text' : undefined}
      {...props}
    >
      {/* Ripple Effects */}
      {ripple && (
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Button Content */}
      <div className="relative flex items-center justify-center gap-inherit">
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-inherit"
          >
            <LoadingSpinner />
            {loadingText && (
              <span id="loading-text" className="sr-only">
                {loadingText}
              </span>
            )}
          </motion.div>
        )}

        {/* Success State */}
        {success && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-inherit"
          >
            <SuccessIcon />
            <span>{children}</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-inherit"
          >
            <ErrorIcon />
            <span>{children}</span>
          </motion.div>
        )}

        {/* Normal State */}
        {!loading && !success && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-inherit"
          >
            {startIcon && (
              <motion.span
                className="flex-shrink-0"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {startIcon}
              </motion.span>
            )}
            
            <span className="flex-1">{children}</span>
            
            {endIcon && (
              <motion.span
                className="flex-shrink-0"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {endIcon}
              </motion.span>
            )}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}));

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };