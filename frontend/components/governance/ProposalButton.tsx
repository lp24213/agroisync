'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

interface ProposalButtonProps {
  onClick: () => void;
  className?: string;
}

export function ProposalButton({ onClick, className = '' }: ProposalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      className={`w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90 transition-all cyberpunk-button ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center">
        <PlusCircle className={`h-5 w-5 mr-2 ${isHovered ? 'animate-pulse' : ''}`} />
        Create Proposal
      </div>
    </motion.button>
  );
}