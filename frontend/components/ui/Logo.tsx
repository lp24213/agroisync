'use client';

import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2"
    >
      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      <span className="text-white font-bold text-xl">AGROTM</span>
    </motion.div>
  );
} 