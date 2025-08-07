'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HeroLogo: React.FC = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-6xl font-bold text-white">
        AGROTM
      </div>
    </motion.div>
  );
};

export default HeroLogo; 