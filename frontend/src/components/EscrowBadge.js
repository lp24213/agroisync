import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Lock, DollarSign } from 'lucide-react';

const EscrowBadge = ({ 
  isEscrowEnabled = false, 
  escrowAmount = 0, 
  escrowStatus = 'pending',
  className = '',
  size = 'md' 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'released':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'disputed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Shield className="w-4 h-4" />;
      case 'released':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Lock className="w-4 h-4" />;
      case 'disputed':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Escrow Ativo';
      case 'released':
        return 'Liberado';
      case 'pending':
        return 'Pendente';
      case 'disputed':
        return 'Em Disputa';
      default:
        return 'Escrow';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  if (!isEscrowEnabled) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full border ${getStatusColor(escrowStatus)} ${sizeClasses[size]} ${className}`}
    >
      {getStatusIcon(escrowStatus)}
      <span className="font-medium">
        {getStatusText(escrowStatus)}
      </span>
      {escrowAmount > 0 && (
        <span className="text-xs opacity-75">
          R$ {escrowAmount.toFixed(2)}
        </span>
      )}
    </motion.div>
  );
};

export default EscrowBadge;