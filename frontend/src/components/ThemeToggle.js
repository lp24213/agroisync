import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        rotate: isDarkMode ? 180 : 0,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="theme-toggle-icon"
        initial={false}
        animate={{
          opacity: isDarkMode ? 0 : 1,
          scale: isDarkMode ? 0.8 : 1,
          transition: { duration: 0.2 }
        }}
      >
        <Sun size={20} />
      </motion.div>
      
      <motion.div
        className="theme-toggle-icon"
        initial={false}
        animate={{
          opacity: isDarkMode ? 1 : 0,
          scale: isDarkMode ? 1 : 0.8,
          transition: { duration: 0.2 }
        }}
        style={{ position: 'absolute' }}
      >
        <Moon size={20} />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
