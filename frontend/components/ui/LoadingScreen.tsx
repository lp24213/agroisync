'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-premium-black z-[9999] flex flex-col items-center justify-center"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
            <div className="absolute inset-0 scanlines opacity-10"></div>
            
            {/* Animated Circles */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-premium-neon-blue/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-premium-neon-green/10 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mb-12"
          >
            <Logo size="xl" showText={false} />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 mb-8"
          >
            <h2 className="text-2xl font-orbitron font-bold text-premium-neon-blue text-center animate-pulse-neon">
              CARREGANDO PLATAFORMA
            </h2>
            <p className="text-premium-light/60 text-center mt-2">
              Inicializando sistemas...
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10 w-80 max-w-md"
          >
            <div className="w-full bg-premium-dark/50 rounded-full h-3 border border-premium-neon-blue/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-premium-neon-blue to-premium-neon-green rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-premium-neon-blue text-sm font-orbitron">
                {Math.round(progress)}%
              </span>
              <span className="text-premium-light/60 text-sm">
                {progress < 25 && 'Inicializando...'}
                {progress >= 25 && progress < 50 && 'Carregando módulos...'}
                {progress >= 50 && progress < 75 && 'Conectando blockchain...'}
                {progress >= 75 && progress < 100 && 'Finalizando...'}
                {progress >= 100 && 'Pronto!'}
              </span>
            </div>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative z-10 mt-8"
          >
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-premium-neon-blue rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Matrix Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-premium-neon-green/20 text-xs font-mono"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                  animate={{
                    y: ['-100%', '100%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {Math.random().toString(36).substring(2, 4)}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
