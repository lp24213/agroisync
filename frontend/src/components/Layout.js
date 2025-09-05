import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import StockMarketTicker from './StockMarketTicker';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* StockMarketTicker SEMPRE ATIVO EM TODAS AS PÁGINAS */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <StockMarketTicker />
      </div>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-24"
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
