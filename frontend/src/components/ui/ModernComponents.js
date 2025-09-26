import React from 'react';
import { motion } from 'framer-motion';

// Componente de Card Moderno
export const ModernCard = ({ children, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-8 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Componente de Input Moderno
export const ModernInput = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        className={`w-full px-4 py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 
          bg-gray-50/50 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-200 placeholder:text-gray-400
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}`}
        {...props}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-500"
      >
        {error}
      </motion.p>
    )}
  </div>
);

// Componente de Botão Moderno
export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      )}
      {children}
    </motion.button>
  );
};

// Componente de Badge Moderno
export const ModernBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Componente de Progress Bar Moderno
export const ModernProgress = ({ progress, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
    />
  </div>
);

// Componente de Step Indicator Moderno
export const ModernStepIndicator = ({ steps, currentStep, className = '' }) => (
  <div className={`flex items-center justify-between ${className}`}>
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
          ${index <= currentStep 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-500'
          }`}>
          {index + 1}
        </div>
        <span className={`ml-2 text-sm font-medium
          ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
        `}>
          {step}
        </span>
        {index < steps.length - 1 && (
          <div className={`w-12 h-0.5 mx-4
            ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
          `} />
        )}
      </div>
    ))}
  </div>
);

// Componente de Header Moderno
export const ModernHeader = ({ title, subtitle, className = '' }) => (
  <div className={`text-center space-y-2 ${className}`}>
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold text-gray-900"
    >
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-gray-600"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// Componente de Container Moderno
export const ModernContainer = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${className}`}>
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  </div>
);

// Componente de Grid Moderno
export const ModernGrid = ({ children, cols = 2, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  return (
    <div className={`grid ${gridCols[cols]} gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default {
  ModernCard,
  ModernInput,
  ModernButton,
  ModernBadge,
  ModernProgress,
  ModernStepIndicator,
  ModernHeader,
  ModernContainer,
  ModernGrid
};
