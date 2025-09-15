import React from 'react';
import { motion } from 'framer-motion';

const TXCButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'txc-btn';
  const variantClasses = {
    primary: 'txc-btn-primary',
    secondary: 'txc-btn-secondary',
    accent: 'txc-btn-accent',
    ghost: 'txc-btn-ghost',
  };
  const sizeClasses = {
    sm: 'txc-btn-sm',
    md: 'txc-btn-md',
    lg: 'txc-btn-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="txc-btn-loading"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          ⟳
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="txc-btn-icon">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="txc-btn-icon">{icon}</span>
      )}
    </motion.button>
  );
};

export default TXCButton;
