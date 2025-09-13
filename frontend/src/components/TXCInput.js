import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TXCInput = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    if (onChange) onChange(e);
  };

  const inputClasses = `txc-input ${error ? 'txc-input-error' : ''} ${success ? 'txc-input-success' : ''} ${className}`;

  return (
    <div className="txc-input-group">
      {label && (
        <motion.label
          className={`txc-input-label ${isFocused || hasValue ? 'txc-input-label-focused' : ''}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isFocused || hasValue ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="txc-input-required">*</span>}
        </motion.label>
      )}
      
      <div className="txc-input-container">
        {icon && iconPosition === 'left' && (
          <span className="txc-input-icon txc-input-icon-left">{icon}</span>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="txc-input-icon txc-input-icon-right">{icon}</span>
        )}
      </div>
      
      {(error || success) && (
        <motion.div
          className={`txc-input-message ${error ? 'txc-input-error-message' : 'txc-input-success-message'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error || success}
        </motion.div>
      )}
    </div>
  );
};

export default TXCInput;
