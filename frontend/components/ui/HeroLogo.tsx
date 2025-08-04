import React from 'react';
import { motion } from 'framer-motion';

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="mb-12"
    >
      <motion.div 
        className="w-32 h-32 mx-auto mb-8 relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Logo AGROTM - Estilizada "A" com elementos integrados */}
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative overflow-hidden">
          {/* Efeito de brilho animado */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ 
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut" 
            }}
          />
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Letra "A" estilizada */}
            <div className="relative">
              {/* "A" principal */}
              <div className="text-6xl font-bold text-white relative">
                A
                {/* Folha no lado esquerdo */}
                <motion.div 
                  className="absolute -top-2 -left-4 text-lg text-cyan-300"
                  animate={{ 
                    rotate: [0, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut" 
                  }}
                >
                  🍃
                </motion.div>
                {/* Hexágono no topo direito */}
                <motion.div 
                  className="absolute -top-2 -right-4 text-lg text-blue-300"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "linear" 
                  }}
                >
                  ⬡
                </motion.div>
                {/* Pontos de conexão na base */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <motion.div 
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut" 
                    }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: 1,
                      ease: "easeInOut" 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Texto AGROTM abaixo da logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          AGRO<span className="text-cyan-400">TM</span>
        </h2>
        <p className="text-lg text-gray-300">SOLANA</p>
      </motion.div>
    </motion.div>
  );
} 