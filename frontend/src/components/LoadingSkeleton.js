import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', lines = 3, className = '' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.3 },
    animate: { 
      opacity: [0.3, 0.7, 0.3],
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderCardSkeleton = () => (
    <motion.div 
      className={`card p-6 ${className}`}
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton-circle"></div>
        <div className="flex-1">
          <div className="skeleton-text w-3/4 mb-2"></div>
          <div className="skeleton-text w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="skeleton-text" style={{ width: `${80 - index * 10}%` }}></div>
        ))}
      </div>
    </motion.div>
  );

  const renderListSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div 
          key={index}
          className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg"
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.1 }}
        >
          <div className="skeleton-circle"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton-text w-2/3"></div>
            <div className="skeleton-text w-1/2"></div>
          </div>
          <div className="skeleton-text w-16 h-8"></div>
        </motion.div>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className={`${className}`}>
      <motion.div 
        className="bg-black/30 rounded-lg p-4 mb-4"
        variants={skeletonVariants}
        initial="initial"
        animate="animate"
      >
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-text h-6"></div>
          ))}
        </div>
      </motion.div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div 
            key={index}
            className="grid grid-cols-4 gap-4 p-3 bg-black/20 rounded"
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.05 }}
          >
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton-text h-4"></div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSpinner = () => (
    <motion.div 
      className={`flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
    </motion.div>
  );

  const renderPulse = () => (
    <motion.div 
      className={`flex items-center justify-center space-x-2 ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-emerald-500 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: index * 0.2 
          }}
        />
      ))}
    </motion.div>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'spinner':
      return renderSpinner();
    case 'pulse':
      return renderPulse();
    default:
      return renderCardSkeleton();
  }
};

export default LoadingSkeleton;
