"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0, 
  hover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`
        glass-effect rounded-xl p-6 
        border border-neon-blue/20 
        shadow-card hover:shadow-neon
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
