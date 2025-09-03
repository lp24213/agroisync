import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-16"
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

export default Layout;
