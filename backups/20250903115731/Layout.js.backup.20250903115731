import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import TickerB3 from './TickerB3';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

const Layout = ({ children, showTicker = true }) => {
  const { isEnabled } = useFeatureFlags();

  return (
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary">
      {/* Ticker B3 Global */}
      {showTicker && isEnabled('FEATURE_TICKER_B3') && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-agro-bg-secondary/90 border-b border-agro-border-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <TickerB3 />
          </div>
        </div>
      )}
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`${showTicker && isEnabled('FEATURE_TICKER_B3') ? 'pt-32' : 'pt-16'}`}
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
