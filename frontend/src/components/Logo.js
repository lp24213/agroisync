import React from 'react'
import { motion } from 'framer-motion'

const Logo = ({ className = '', size = 'default' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-10 w-10',
    large: 'h-12 w-12'
  }

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon - Trator estilizado */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http:www.w3.org/2000/svg"
        >
          {/* Corpo do trator */}
          <rect
            x="20"
            y="35"
            width="45"
            height="25"
            rx="4"
            fill="currentColor"
            className="text-primary"
          />
 
          {/* Cabine */}
          <rect
            x="50"
            y="25"
            width="20"
            height="20"
            rx="3"
            fill="currentColor"
            className="text-primary"
          />
 
          {/* Roda traseira */}
          <circle
            cx="30"
            cy="70"
            r="12"
            fill="currentColor"
            className="text-secondary"
          />
 
          {/* Roda dianteira */}
          <circle
            cx="65"
            cy="70"
            r="10"
            fill="currentColor"
            className="text-secondary"
          />
 
          {/* Detalhes da roda traseira */}
          <circle
            cx="30"
            cy="70"
            r="8"
            fill="currentColor"
            className="text-primary"
          />
 
          {/* Detalhes da roda dianteira */}
          <circle
            cx="65"
            cy="70"
            r="6"
            fill="currentColor"
            className="text-primary"
          />
 
          {/* Linha do solo */}
          <line
            x1="10"
            y1="82"
            x2="90"
            y2="82"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          />
 
          {/* Plantas/vegetação */}
          <path
            d="M15 82 L15 75 M25 82 L25 78 M35 82 L35 76 M45 82 L45 79 M55 82 L55 77 M75 82 L75 78 M85 82 L85 75"
            stroke="currentColor"
            strokeWidth="2"
            className="text-success"
          />
        </svg>
      </div>
 
      {/* Texto da marca */}
      <div className="flex flex-col">
        <motion.span
          className="text-xl font-bold text-primary leading-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          AgroSync
        </motion.span>
        <motion.span
          className="text-xs text-muted leading-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Agronegócio Digital
        </motion.span>
      </div>
    </motion.div>
  )
}

export default Logo

