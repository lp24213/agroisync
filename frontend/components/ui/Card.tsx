'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { CardProps } from '../../types/web3';

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;