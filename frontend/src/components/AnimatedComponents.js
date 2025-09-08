import React from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'

// Componente de botão com micro-interações
export const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)

  const springScale = useSpring(scale, { stiffness: 300, damping: 20 })
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 20 })

  const handleMouseDown = () => {
    scale.set(0.95)
  }

  const handleMouseUp = () => {
    scale.set(1)
  }

  const handleHover = () => {
    scale.set(1.05)
  }

  const handleLeave = () => {
    scale.set(1)
    rotate.set(0)
  }

  const baseClasses =
    'relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black hover:from-emerald-400 hover:to-emerald-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black',
    ghost: 'bg-transparent text-emerald-500 hover:bg-emerald-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ scale: springScale, rotate: springRotate }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='h-5 w-5 rounded-full border-2 border-current border-t-transparent'
        />
      ) : (
        children
      )}

      {/* Ripple effect */}
      <motion.div
        className='absolute inset-0 rounded-xl bg-white/20'
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

// Componente de card com hover effects
export const AnimatedCard = ({ children, className = '', hoverEffect = 'lift', delay = 0, ...props }) => {
  const hoverEffects = {
    lift: {
      whileHover: { y: -8, scale: 1.02 },
      whileTap: { scale: 0.98 }
    },
    glow: {
      whileHover: {
        boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)',
        scale: 1.05
      }
    },
    rotate: {
      whileHover: { rotate: 2, scale: 1.05 }
    }
  }

  return (
    <motion.div
      className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      whileHover={hoverEffects[hoverEffect]?.whileHover}
      whileTap={hoverEffects[hoverEffect]?.whileTap}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Componente de texto com animação de digitação
export const TypewriterText = ({ text, speed = 50, className = '', delay = 0 }) => {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex(0)
      setDisplayText('')
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <span className={className}>
      {displayText}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className='ml-1'>
        |
      </motion.span>
    </span>
  )
}

// Componente de progress bar animada
export const AnimatedProgress = ({ value, max = 100, className = '', color = 'emerald', showLabel = true }) => {
  const percentage = (value / max) * 100

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className='mb-2 flex justify-between text-sm text-white/60'>
          <span>Progresso</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className='h-2 w-full overflow-hidden rounded-full bg-black/30'>
        <motion.div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Componente de contador animado
export const AnimatedCounter = ({ value, duration = 2, className = '', prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const startValue = 0
    const endValue = value
    const startTime = Date.now()

    const updateValue = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      const currentValue = Math.floor(startValue + (endValue - startValue) * progress)
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    updateValue()
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

// Componente de toggle animado
export const AnimatedToggle = ({ checked, onChange, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  }

  const knobSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      className={`relative inline-flex items-center rounded-full transition-colors duration-300 ${sizeClasses[size]} ${className} ${
        checked ? 'bg-emerald-500' : 'bg-gray-600'
      }`}
      onClick={onChange}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`rounded-full bg-white shadow-lg ${knobSize[size]}`}
        animate={{ x: checked ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ x: checked ? '100%' : '0%' }}
      />
    </motion.button>
  )
}

// Componente de tooltip animado
export const AnimatedTooltip = ({ children, content, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 rounded-lg bg-black/90 px-3 py-2 text-sm text-white shadow-lg ${positionClasses[position]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            <div
              className={`absolute h-2 w-2 rotate-45 transform bg-black/90 ${
                position === 'top'
                  ? 'left-1/2 top-full -mt-1 -translate-x-1/2'
                  : position === 'bottom'
                    ? 'bottom-full left-1/2 -mb-1 -translate-x-1/2'
                    : position === 'left'
                      ? 'left-full top-1/2 -ml-1 -translate-y-1/2'
                      : 'right-full top-1/2 -mr-1 -translate-y-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente de menu dropdown animado
export const AnimatedDropdown = ({ trigger, children, isOpen, onToggle, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div onClick={onToggle}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-white/10 bg-black/90 shadow-xl backdrop-blur-sm'
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente de modal animado
export const AnimatedModal = ({ isOpen, onClose, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-sm ${className}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente de notificação animada
export const AnimatedNotification = ({ message, type = 'info', isVisible, onClose, duration = 5000 }) => {
  const typeClasses = {
    info: 'bg-blue-500/90 border-blue-400',
    success: 'bg-emerald-500/90 border-emerald-400',
    warning: 'bg-amber-500/90 border-amber-400',
    error: 'bg-red-500/90 border-red-400'
  }

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed right-4 top-4 z-50 rounded-lg border p-4 backdrop-blur-sm ${typeClasses[type]} text-white shadow-xl`}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className='flex items-center space-x-3'>
            <span>{message}</span>
            <button onClick={onClose} className='ml-2 text-white/80 transition-colors hover:text-white'>
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default {
  AnimatedButton,
  AnimatedCard,
  TypewriterText,
  AnimatedProgress,
  AnimatedCounter,
  AnimatedToggle,
  AnimatedTooltip,
  AnimatedDropdown,
  AnimatedModal,
  AnimatedNotification
}
