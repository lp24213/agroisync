import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const LoadingSpinner = ({ size = 'large', message = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <div className='from-dark-primary via-dark-secondary to-dark-tertiary flex min-h-screen items-center justify-center bg-gradient-to-br'>
      <div className='space-y-6 text-center'>
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center'
        >
          <div className='relative'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className={`${sizeClasses[size]} to-neon-purple flex items-center justify-center rounded-full bg-gradient-to-r from-neon-blue`}
            >
              <Zap className='h-6 w-6 text-white' />
            </motion.div>

            {/* Anel externo */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className='absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue'
            ></motion.div>
          </div>
        </motion.div>

        {/* Texto de carregamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='space-y-2'
        >
          <h2 className={`${textSizeClasses[size]} font-semibold text-white`}>AGROISYNC</h2>
          <p className='text-sm text-gray-400'>{message}</p>
        </motion.div>

        {/* Barra de progresso animada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='mx-auto w-64'
        >
          <div className='h-1 overflow-hidden rounded-full bg-gray-700'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className='to-neon-purple h-full rounded-full bg-gradient-to-r from-neon-blue'
            ></motion.div>
          </div>
        </motion.div>

        {/* Pontos de carregamento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className='flex justify-center space-x-1'
        >
          {[0, 1, 2].map(index => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className='h-2 w-2 rounded-full bg-neon-blue'
            ></motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
