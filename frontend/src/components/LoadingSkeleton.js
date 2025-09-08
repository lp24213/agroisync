import React from 'react'
import { motion } from 'framer-motion'

const LoadingSkeleton = ({ type = 'card', lines = 3, className = '' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const renderCardSkeleton = () => (
    <motion.div className={`card p-6 ${className}`} variants={skeletonVariants} initial='initial' animate='animate'>
      <div className='mb-4 flex items-center space-x-4'>
        <div className='skeleton-circle'></div>
        <div className='flex-1'>
          <div className='skeleton-text mb-2 w-3/4'></div>
          <div className='skeleton-text w-1/2'></div>
        </div>
      </div>
      <div className='space-y-3'>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className='skeleton-text' style={{ width: `${80 - index * 10}%` }}></div>
        ))}
      </div>
    </motion.div>
  )

  const renderListSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className='flex items-center space-x-4 rounded-lg bg-black/30 p-4'
          variants={skeletonVariants}
          initial='initial'
          animate='animate'
          transition={{ delay: index * 0.1 }}
        >
          <div className='skeleton-circle'></div>
          <div className='flex-1 space-y-2'>
            <div className='skeleton-text w-2/3'></div>
            <div className='skeleton-text w-1/2'></div>
          </div>
          <div className='skeleton-text h-8 w-16'></div>
        </motion.div>
      ))}
    </div>
  )

  const renderTableSkeleton = () => (
    <div className={`${className}`}>
      <motion.div
        className='mb-4 rounded-lg bg-black/30 p-4'
        variants={skeletonVariants}
        initial='initial'
        animate='animate'
      >
        <div className='grid grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='skeleton-text h-6'></div>
          ))}
        </div>
      </motion.div>
      <div className='space-y-2'>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className='grid grid-cols-4 gap-4 rounded bg-black/20 p-3'
            variants={skeletonVariants}
            initial='initial'
            animate='animate'
            transition={{ delay: index * 0.05 }}
          >
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className='skeleton-text h-4'></div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderSpinner = () => (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className='h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent'></div>
    </motion.div>
  )

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
          className='h-2 w-2 rounded-full bg-emerald-500'
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </motion.div>
  )

  switch (type) {
    case 'card':
      return renderCardSkeleton()
    case 'list':
      return renderListSkeleton()
    case 'table':
      return renderTableSkeleton()
    case 'spinner':
      return renderSpinner()
    case 'pulse':
      return renderPulse()
    default:
      return renderCardSkeleton()
  }
}

export default LoadingSkeleton
