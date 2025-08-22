'use client'

import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  animation?: 'fadeIn' | 'slideInFromLeft' | 'slideInFromRight' | 'slideInFromTop' | 'slideInFromBottom' | 'scaleIn'
  delay?: number
  duration?: number
}

export function AnimatedDiv({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 500,
  className,
  style,
  ...props 
}: AnimatedDivProps) {
  const animationClasses = {
    fadeIn: 'animate-fade-in',
    slideInFromLeft: 'animate-slide-in-left',
    slideInFromRight: 'animate-slide-in-right',
    slideInFromTop: 'animate-slide-in-top',
    slideInFromBottom: 'animate-slide-in-bottom',
    scaleIn: 'animate-scale-in'
  }

  return (
    <div
      className={clsx(animationClasses[animation], className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
