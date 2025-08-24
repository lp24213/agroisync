import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const PagePreloader = ({ isLoading = true }) => {
  const { isDark } = useTheme();

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isDark 
          ? 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)'
          : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)'
      }}
    >
      <div className="text-center">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className={`w-24 h-24 mx-auto rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-cyan-400 to-purple-500' 
              : 'bg-gradient-to-br from-green-600 to-blue-600'
          } flex items-center justify-center shadow-2xl`}>
            <span className="text-3xl font-bold text-white">A</span>
          </div>
        </motion.div>

        {/* Texto de carregamento */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          AgroSync
        </motion.h2>

        {/* Spinner animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-16 h-16 mx-auto"
        >
          <div className={`w-16 h-16 border-4 rounded-full ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`} />
          <motion.div
            className={`absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-t-transparent ${
              isDark ? 'border-cyan-400' : 'border-green-500'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Texto de status */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`mt-6 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Carregando...
        </motion.p>

        {/* Pontos animados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center space-x-1 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${
                isDark ? 'bg-cyan-400' : 'bg-green-500'
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PagePreloader;
