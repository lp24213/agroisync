import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Info } from 'lucide-react';
import escrowService from '../services/escrowService';

const EscrowBadge = ({ 
  showInfo = false, 
  className = '', 
  size = 'default',
  variant = 'info' 
}) => {
  const isEnabled = escrowService.isEscrowEnabled();

  const getBadgeContent = () => {
    if (isEnabled) {
      return {
        text: 'Intermediação Segura',
        icon: Shield,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        description: 'Pagamento seguro via AgroSync'
      };
    } else {
      return {
        text: 'Intermediação Segura (em breve)',
        icon: Clock,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Sistema de pagamento seguro em desenvolvimento'
      };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return getBadgeContent().color;
    }
  };

  const badgeContent = getBadgeContent();
  const Icon = badgeContent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center space-x-2 rounded-full border ${getSizeClasses()} ${getVariantClasses()} ${className}`}
    >
      <Icon className={`${size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      <span className="font-medium">{badgeContent.text}</span>
      
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
        >
          <Info className={`${size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} cursor-help text-current opacity-75`} />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {badgeContent.description}
            
            {/* Seta do tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EscrowBadge;
