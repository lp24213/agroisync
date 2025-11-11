import React from 'react';
import { motion } from 'framer-motion';

const LoadingFallback = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center space-y-6">
        {/* Logo do Agroisync */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
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
            className="w-48 h-48 flex items-center justify-center"
          >
            <img 
              src="/agroisync-main-logo.png" 
              alt="Agroisync Logo" 
              className="w-full h-full object-contain"
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

export default LoadingFallback;
