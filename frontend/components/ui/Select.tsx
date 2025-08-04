'use client';

import React, { memo, forwardRef, useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Select Component - Premium custom select with enhanced UX and accessibility
 * 
 * @description A fully accessible, animated select component with search functionality,
 * custom styling, and smooth transitions. Optimized for performance and UX.
 * 
 * @features
 * - Custom dropdown with smooth animations
 * - Search/filter functionality
 * - Multiple selection support
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Full accessibility support with ARIA attributes
 * - Loading state with skeleton
 * - Group support for options
 * - TypeScript strict typing
 * - Performance optimized with React.memo and forwardRef
 */

interface SelectOption {
  /** Unique value for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional icon for the option */
  icon?: React.ReactNode;
  /** Optional description */
  description?: string;
}

interface SelectGroup {
  /** Group label */
  label: string;
  /** Options in this group */
  options: SelectOption[];
}

type SelectSize = 'sm' | 'md' | 'lg';
type SelectVariant = 'default' | 'filled' | 'outlined';

interface SelectProps {
  /** Label text for the select */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below select */
  helperText?: string;
  /** Options to display (can be grouped) */
  options?: SelectOption[];
  /** Grouped options */
  groups?: SelectGroup[];
  /** Placeholder text */
  placeholder?: string;
  /** Selected value(s) */
  value?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Whether multiple selection is allowed */
  multiple?: boolean;
  /** Whether the select is searchable */
  searchable?: boolean;
  /** Size variant */
  size?: SelectSize;
  /** Visual variant */
  variant?: SelectVariant;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is required */
  required?: boolean;
  /** Whether the select is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Success state */
  success?: boolean;
  /** Success message */
  successMessage?: string;
  /** Custom search function */
  onSearch?: (query: string) => void;
  /** Maximum height for dropdown */
  maxHeight?: number;
}

const Select = memo(forwardRef<HTMLDivElement, SelectProps>(({ 
  label, 
  error, 
  helperText, 
  options = [],
  groups = [],
  placeholder = 'Select an option...',
  value,
  onChange,
  multiple = false,
  searchable = false,
  size = 'md',
  variant = 'default',
  disabled = false,
  required = false,
  loading = false,
  className,
  success = false,
  successMessage,
  onSearch,
  maxHeight = 300,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;
  const successId = `${selectId}-success`;

  // Combine options from both props
  const allOptions = [...options, ...groups.flatMap(group => group.options)];
  
  // Filter options based on search query
  const filteredOptions = searchQuery
    ? allOptions.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allOptions;

  // Size configurations
  const sizes: Record<SelectSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-13 px-5 text-lg',
  };

  // Variant configurations
  const variants: Record<SelectVariant, string> = {
    default: 'bg-agro-dark/50 border-agro-light/20',
    filled: 'bg-agro-light/5 border-transparent',
    outlined: 'bg-transparent border-agro-light/30',
  };

  // Get selected option(s) for display
  const selectedOptions = multiple
    ? allOptions.filter(option => Array.isArray(value) && value.includes(option.value))
    : allOptions.find(option => option.value === value);

  const displayValue = multiple
    ? Array.isArray(selectedOptions) && selectedOptions.length > 0
      ? selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} selected`
      : placeholder
    : selectedOptions
      ? (selectedOptions as SelectOption).label
      : placeholder;

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFocusedIndex(-1);
    onSearch?.(query);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  return (
    <div className="w-full space-y-2" ref={ref} {...props}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-agro-light/90"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative" ref={selectRef}>
        {/* Select Trigger */}
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          className={cn(
            'w-full flex items-center justify-between border rounded-lg text-agro-light',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-agro-dark',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'backdrop-blur-sm',
            sizes[size],
            variants[variant],
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
            isOpen && 'ring-2 ring-agro-primary/20 border-agro-primary',
            className
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error}
          aria-describedby={cn(
            error && errorId,
            success && successId,
            helperText && helperId
          )}
        >
          <span className={cn(
            'truncate text-left',
            !selectedOptions && 'text-agro-light/50'
          )}>
            {loading ? 'Loading...' : displayValue}
          </span>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            <svg className="w-4 h-4 text-agro-light/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                'absolute z-50 w-full mt-1 bg-agro-dark/95 backdrop-blur-md',
                'border border-agro-light/20 rounded-lg shadow-xl',
                'overflow-hidden'
              )}
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-3 border-b border-agro-light/10">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 bg-agro-light/5 border border-agro-light/20',
                      'rounded-md text-agro-light placeholder-agro-light/50',
                      'focus:outline-none focus:ring-1 focus:ring-agro-primary',
                      'text-sm'
                    )}
                  />
                </div>
              )}

              {/* Options List */}
              <div 
                ref={optionsRef}
                className="max-h-60 overflow-y-auto"
                role="listbox"
                aria-multiselectable={multiple}
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-agro-light/50 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple
                      ? Array.isArray(value) && value.includes(option.value)
                      : value === option.value;
                    const isFocused = index === focusedIndex;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-4 py-3 text-left flex items-center gap-3',
                          'transition-colors duration-150',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          isFocused && 'bg-agro-primary/10',
                          isSelected && 'bg-agro-primary/20 text-agro-primary',
                          !isSelected && !isFocused && 'hover:bg-agro-light/5',
                          'focus:outline-none focus:bg-agro-primary/10'
                        )}
                        role="option"
                        aria-selected={isSelected}
                        whileHover={{ backgroundColor: 'rgba(var(--agro-primary), 0.1)' }}
                      >
                        {/* Option Icon */}
                        {option.icon && (
                          <span className="flex-shrink-0 text-agro-light/70">
                            {option.icon}
                          </span>
                        )}

                        {/* Option Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-agro-light">
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-xs text-agro-light/60 mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <svg className="w-4 h-4 text-agro-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

Select.displayName = 'Select';

export { Select };
export type { SelectProps, SelectOption, SelectGroup, SelectSize, SelectVariant };