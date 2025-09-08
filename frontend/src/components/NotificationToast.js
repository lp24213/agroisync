import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, AlertTriangle, DollarSign, MessageSquare } from 'lucide-react'

const NotificationToast = ({ notification, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Auto-hide após 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300); // Aguardar animação de saída
    }, 5000)

    // Barra de progresso
    const progressTimer = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 2))
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [onClose])

  const getNotificationIcon = type => {
    switch (type) {
      case 'NEW_TRANSACTION':
        return <DollarSign className='h-5 w-5 text-blue-600' />
      case 'NEW_MESSAGE':
        return <MessageSquare className='h-5 w-5 text-green-600' />
      case 'STATUS_CHANGED':
        return <AlertTriangle className='h-5 w-5 text-yellow-600' />
      case 'PAYMENT_RECEIVED':
        return <DollarSign className='h-5 w-5 text-emerald-600' />
      case 'SYSTEM_ALERT':
        return <AlertTriangle className='h-5 w-5 text-red-600' />
      default:
        return <Bell className='h-5 w-5 text-gray-600' />
    }
  }

  const getNotificationColor = type => {
    switch (type) {
      case 'NEW_TRANSACTION':
        return 'border-l-blue-500 bg-blue-50'
      case 'NEW_MESSAGE':
        return 'border-l-green-500 bg-green-50'
      case 'STATUS_CHANGED':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'PAYMENT_RECEIVED':
        return 'border-l-emerald-500 bg-emerald-50'
      case 'SYSTEM_ALERT':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const handleAction = () => {
    if (onAction) {
      onAction(notification)
    }
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          className={`fixed right-4 top-4 w-full max-w-sm rounded-lg border-l-4 bg-white shadow-lg ${getNotificationColor(notification.type)} z-50 overflow-hidden`}
        >
          {/* Barra de Progresso */}
          <div className='h-1 bg-gray-200'>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              className='h-full bg-emerald-500'
            />
          </div>

          {/* Conteúdo da Notificação */}
          <div className='p-4'>
            <div className='flex items-start space-x-3'>
              <div className='mt-1 flex-shrink-0'>{getNotificationIcon(notification.type)}</div>

              <div className='min-w-0 flex-1'>
                <h4 className='mb-1 text-sm font-medium text-gray-900'>{notification.title}</h4>
                <p className='mb-2 text-sm text-gray-600'>{notification.message}</p>

                {/* Botões de Ação */}
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={handleAction}
                    className='rounded-md bg-emerald-600 px-3 py-1 text-xs text-white transition-colors hover:bg-emerald-700'
                  >
                    Ver Detalhes
                  </button>

                  <button
                    onClick={handleClose}
                    className='rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300'
                  >
                    Fechar
                  </button>
                </div>
              </div>

              <button
                onClick={handleClose}
                className='flex-shrink-0 p-1 text-gray-400 transition-colors hover:text-gray-600'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationToast
