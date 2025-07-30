import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-agro-dark border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200',
      className
    )}>
      {children}
    </div>
  );
} 