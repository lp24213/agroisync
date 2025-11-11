import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'large', message = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <div className='splash flex min-h-screen items-center justify-center bg-white'>
      <div className='space-y-6 text-center'>
        {/* Logo animado do Agroisync */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center'
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [1, 1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className={`${sizeClasses[size]} splash-root flex items-center justify-center`}
          >
            <img 
              src="/agroisync-main-logo.png" 
              alt="Agroisync Logo" 
              className="logo w-full h-full object-contain"
              onError={(e) => {
                // Fallback para logo SVG se PNG não carregar
                e.target.src = '/agroisync-logo.svg';
                e.target.onerror = () => {
                  e.target.style.display = 'none';
                };
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
