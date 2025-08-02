'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { TargetEvent } from '../../types/web3';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  charLimit?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    fullWidth = false,
    variant = 'default',
    charLimit,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    // Safe type checking for events
    const isTargetEvent = (e: any): e is TargetEvent => {
      return e && typeof e === 'object' && 'target' in e && e.target;
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isTargetEvent(e)) {
        const newValue = e.target.value;
        setCharCount(newValue.length);
      }
      onChange?.(e);
    };

    // Initialize character count
    useEffect(() => {
      const initialValue = value || defaultValue;
      if (typeof initialValue === 'string') {
        setCharCount(initialValue.length);
      }
    }, [value, defaultValue]);

    const baseClasses = [
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
      'ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50 resize-vertical',
      'transition-all duration-200',
      fullWidth && 'w-full',
      error && 'border-red-500 focus-visible:ring-red-500',
      isFocused && 'ring-2 ring-blue-500/20',
      charCount > 0 && 'border-blue-500/50'
    ];

    const variantClasses = {
      default: 'bg-white border-gray-300',
      filled: 'bg-gray-50 border-gray-300',
      outlined: 'bg-transparent border-2 border-gray-300'
    };

    const isOverLimit = charLimit && charCount > charLimit;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            className={cn(
              baseClasses,
              variantClasses[variant],
              isOverLimit && 'border-red-500',
              className
            )}
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {charLimit && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              <span className={isOverLimit ? 'text-red-500' : ''}>
                {charCount}/{charLimit}
              </span>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="text-sm">
            {error && (
              <p className="text-red-500">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };