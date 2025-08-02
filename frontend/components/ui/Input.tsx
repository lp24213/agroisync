'use client';

import React, { memo, forwardRef, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Input Component - Premium form input with enhanced UX and accessibility
 * 
 * @description A fully accessible, animated input component with validation states,
 * floating labels, and smooth transitions. Optimized for performance and UX.
 * 
 * @features
 * - Floating label animation
 * - Multiple size variants
 * - Validation states with smooth transitions
 * - Icon support (prefix and suffix)
 * - Loading state with spinner
 * - Full accessibility support with ARIA attributes
 * - TypeScript strict typing
 * - Performance optimized with React.memo and forwardRef
 */

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'outlined';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Size variant of the input */
  size?: InputSize;
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Icon to display at the start of input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of input */
  endIcon?: React.ReactNode;
  /** Whether the input is in loading state */
  loading?: boolean;
  /** Whether to use floating label */
  floatingLabel?: boolean;
  /** Success state */
  success?: boolean;
  /** Success message */
  successMessage?: string;
}

const Input = memo(forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  helperText, 
  size = 'md',
  variant = 'default',
  startIcon,
  endIcon,
  loading = false,
  floatingLabel = false,
  success = false,
  successMessage,
  className, 
  id,
  value,
  placeholder,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputId = useId();
  const finalId = id || inputId;
  const errorId = `${finalId}-error`;
  const helperId = `${finalId}-helper`;
  const successId = `${finalId}-success`;

  // Size configurations
  const sizes: Record<InputSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-13 px-5 text-lg',
  };

  // Variant configurations
  const variants: Record<InputVariant, string> = {
    default: 'bg-agro-dark/50 border-agro-light/20',
    filled: 'bg-agro-light/5 border-transparent',
    outlined: 'bg-transparent border-agro-light/30',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    props.onChange?.(e);
  };

  const isFloatingActive = floatingLabel && (isFocused || hasValue || placeholder);

  return (
    <div className="w-full space-y-2">
      {/* Static Label */}
      {label && !floatingLabel && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium text-agro-light/90"
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Floating Label */}
        {label && floatingLabel && (
          <motion.label
            htmlFor={finalId}
            className={cn(
              'absolute left-4 text-agro-light/70 pointer-events-none',
              'transition-all duration-200 ease-in-out origin-left',
              isFloatingActive
                ? 'top-2 text-xs scale-90 text-agro-primary'
                : 'top-1/2 -translate-y-1/2 text-base'
            )}
            animate={{
              y: isFloatingActive ? -8 : 0,
              scale: isFloatingActive ? 0.9 : 1,
              color: isFloatingActive ? 'rgb(var(--agro-primary))' : 'rgb(var(--agro-light) / 0.7)'
            }}
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </motion.label>
        )}

        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-agro-light/50">
            {startIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={finalId}
          value={value}
          placeholder={floatingLabel ? undefined : placeholder}
          className={cn(
            'w-full border rounded-lg text-agro-light placeholder-agro-light/40',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-agro-dark',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'backdrop-blur-sm',
            sizes[size],
            variants[variant],
            startIcon && 'pl-10',
            (endIcon || loading) && 'pr-10',
            floatingLabel && label && 'pt-6 pb-2',
            error && [
              'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              'bg-red-500/5'
            ],
            success && [
              'border-green-500/50 focus:border-green-500 focus:ring-green-500/20',
              'bg-green-500/5'
            ],
            !error && !success && [
              'focus:border-agro-primary focus:ring-agro-primary/20',
              'hover:border-agro-light/40'
            ],
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            success && successId,
            helperText && helperId
          )}
          {...props}
        />

        {/* End Icon / Loading Spinner */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-agro-primary/30 border-t-agro-primary rounded-full"
            />
          ) : endIcon ? (
            <span className="text-agro-light/50">{endIcon}</span>
          ) : null}
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-400 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
        {success && successMessage && (
          <motion.p
            key="success"
            id={successId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-green-400 flex items-center gap-1"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </motion.p>
        )}
        {helperText && !error && !success && (
          <motion.p
            key="helper"
            id={helperId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-agro-light/60"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}));

Input.displayName = 'Input';

export { Input };
export type { InputProps, InputSize, InputVariant };