'use client';

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="flex items-center justify-center mb-8"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
        <span className="text-white font-bold text-4xl">A</span>
      </div>
    </motion.div>
  );
} 