import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const LoadingFallback = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Logo Spinner */}
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-4 shadow-lg"
          >
            <Loader className="h-12 w-12 text-white" />
          </motion.div>
        </div>

        {/* Texto */}
        <h2 className="mb-2 text-2xl font-bold text-gray-800">{message}</h2>
        
        {/* Barra de Progresso */}
        <div className="mx-auto w-64 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-2 bg-gradient-to-r from-green-400 to-green-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* Texto Secundário */}
        <p className="mt-4 text-sm text-gray-600">
          Aguarde um momento...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingFallback;
