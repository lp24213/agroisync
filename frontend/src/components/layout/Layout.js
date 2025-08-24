import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';
import StarfieldBackground from '../StarfieldBackground';

const Layout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado de estrelas (apenas no tema escuro) */}
      {isDark && <StarfieldBackground />}
      
      {/* Gradiente sutil sobre o fundo */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDark 
          ? 'bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary' 
          : 'bg-gradient-to-br from-light-bg-primary via-light-bg-secondary to-light-bg-primary'
      }`} />
      
      {/* Conteúdo principal */}
      <div className="relative z-10">


        {/* Header fixo */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-40"
        >
          <Navbar />
        </motion.header>

        {/* Conteúdo principal */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10"
        >
          <Footer />
        </motion.footer>

        {/* Chatbot IA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-20"
        >
          <Chatbot />
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
