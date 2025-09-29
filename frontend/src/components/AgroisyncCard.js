import React from 'react';
import { motion } from 'framer-motion';

const TXCCard = ({ children, variant = 'default', hover = true, className = '', onClick, ...props }) => {
  const baseClasses = 'txc-card';
  const variantClasses = {
    default: 'txc-card',
    glass: 'txc-card-glass',
    gradient: 'txc-card-gradient'
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const CardComponent = onClick ? motion.div : motion.div;

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default TXCCard;
