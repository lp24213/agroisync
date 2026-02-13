import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Conteúdo principal */}
      <div className='relative z-10'>
        {/* Conteúdo principal */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='relative z-10'
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
