import React from 'react';
import { cn } from '../../lib/utils';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  const variantClasses = {
    default: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    destructive: 'bg-red-500/20 border-red-500/50 text-red-400',
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
  };

  return (
    <div className={cn(
      'p-4 border rounded-lg',
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default Alert;