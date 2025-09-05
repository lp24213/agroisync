import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import StockMarketTicker from './StockMarketTicker';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
      {/* StockMarketTicker SEMPRE ATIVO EM TODAS AS PÁGINAS */}
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <StockMarketTicker />
      </div>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-28"
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
