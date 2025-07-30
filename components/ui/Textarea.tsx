'use client';

import React, { memo, forwardRef, useState, useRef, useEffect, useId, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Textarea Component - Premium multi-line text input with enhanced UX
 * 
 * @description A fully accessible, animated textarea component with auto-resize,
 * character counting, and validation states. Optimized for performance and UX.
 * 
 * @features
 * - Auto-resize functionality
 * - Character counter with limits
 * - Multiple size variants
 * - Validation states with smooth transitions
 * - Loading state
 * - Full accessibility support with ARIA attributes
 * - TypeScript strict typing
 * - Performance optimized with React.memo and forwardRef
 */

type TextareaSize = 'sm' | 'md' | 'lg';
type TextareaVariant = 'default' | 'filled' | 'outlined';
type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both' | 'auto';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Label text for the textarea */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below textarea */
  helperText?: string;
  /** Size variant of the textarea */
  size?: TextareaSize;
  /** Visual variant of the textarea */
  variant?: TextareaVariant;
  /** Resize behavior */
  resize?: ResizeMode;
  /** Whether to show character counter */
  showCounter?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows (for auto-resize) */
  maxRows?: number;
  /** Whether the textarea is in loading state */
  loading?: boolean;
  /** Success state */
  success?: boolean;
  /** Success message */
  successMessage?: string;
  /** Whether to auto-focus on mount */
  autoFocus?: boolean;
}

const Textarea = memo(forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  label, 
  error, 
  helperText, 
  size = 'md',
  variant = 'default',
  resize = 'vertical',
  showCounter = false,
  maxLength,
  minRows = 3,
  maxRows = 10,
  loading = false,
  success = false,
  successMessage,
  className, 
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  autoFocus = false,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();
  const finalId = id || textareaId;
  const errorId = `${finalId}-error`;
  const helperId = `${finalId}-helper`;
  const successId = `${finalId}-success`;
  const counterId = `${finalId}-counter`;

  // Size configurations
  const sizes: Record<TextareaSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  // Variant configurations
  const variants: Record<TextareaVariant, string> = {
    default: 'bg-agro-dark/50 border-agro-light/20',
    filled: 'bg-agro-light/5 border-transparent',
    outlined: 'bg-transparent border-agro-light/30',
  };

  // Resize configurations
  const resizeClasses: Record<ResizeMode, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
    auto: 'resize-none', // Auto-resize handles this programmatically
  };

  // Auto-resize functionality
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || resize !== 'auto') return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height based on content
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
  }, [resize, minRows, maxRows]);

  // Handle value changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange?.(e);
    
    // Auto-resize after content change
    if (resize === 'auto') {
      setTimeout(autoResize, 0);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Initialize character count and auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const initialValue = value || textarea.value || '';
      setCharCount(initialValue.length);
      
      if (resize === 'auto') {
        autoResize();
      }
    }
  }, [value, autoResize, resize]);

  // Auto-focus functionality
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Combine refs
  const combinedRef = useCallback((node: HTMLTextAreaElement) => {
    textareaRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // Character limit validation
  const isOverLimit = maxLength ? charCount > maxLength : false;
  const isNearLimit = maxLength ? charCount > maxLength * 0.8 : false;

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium text-agro-light/90"
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={combinedRef}
          id={finalId}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={resize === 'auto' ? minRows : undefined}
          className={cn(
            'w-full border rounded-lg text-agro-light placeholder-agro-light/40',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-agro-dark',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'backdrop-blur-sm',
            sizes[size],
            variants[variant],
            resizeClasses[resize],
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
            isOverLimit && 'border-red-500/50 focus:ring-red-500/20',
            className
          )}
          aria-invalid={error || isOverLimit ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            success && successId,
            helperText && helperId,
            showCounter && counterId
          )}
          {...props}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-agro-dark/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-agro-primary/30 border-t-agro-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Character Counter */}
      {showCounter && maxLength && (
        <div className="flex justify-end">
          <span 
            id={counterId}
            className={cn(
              'text-xs font-medium',
              isOverLimit && 'text-red-400',
              isNearLimit && !isOverLimit && 'text-yellow-400',
              !isNearLimit && 'text-agro-light/60'
            )}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Messages */}
      <AnimatePresence mode="wait">
        {(error || isOverLimit) && (
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
            {error || (isOverLimit && `Character limit exceeded by ${charCount - (maxLength || 0)}`)}
          </motion.p>
        )}
        {success && successMessage && !error && !isOverLimit && (
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
        {helperText && !error && !success && !isOverLimit && (
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

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps, TextareaSize, TextareaVariant, ResizeMode };