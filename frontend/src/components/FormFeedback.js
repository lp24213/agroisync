import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const FormFeedback = ({ 
  type = 'success', // 'success', 'error', 'warning', 'info'
  message = '',
  show = false,
  onClose = null,
  autoHide = true,
  duration = 5000
}) => {
  const { isDark } = useTheme();

  React.useEffect(() => {
    if (autoHide && show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);

  const getFeedbackStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
          border: isDark ? 'border-blue-500/30' : 'border-blue-200',
          text: isDark ? 'text-blue-400' : 'text-blue-800',
          icon: isDark ? 'text-blue-400' : 'text-blue-600',
          iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
        };
      case 'error':
        return {
          bg: isDark ? 'bg-red-500/20' : 'bg-red-50',
          border: isDark ? 'border-red-500/30' : 'border-red-200',
          text: isDark ? 'text-red-400' : 'text-red-800',
          icon: isDark ? 'text-red-400' : 'text-red-600',
          iconBg: isDark ? 'bg-red-500/20' : 'bg-red-100'
        };
      case 'warning':
        return {
          bg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-50',
          border: isDark ? 'border-yellow-500/30' : 'border-yellow-200',
          text: isDark ? 'text-yellow-400' : 'text-yellow-800',
          icon: isDark ? 'text-yellow-400' : 'text-yellow-600',
          iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
        };
      case 'info':
        return {
          bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
          border: isDark ? 'border-blue-500/30' : 'border-blue-200',
          text: isDark ? 'text-blue-400' : 'text-blue-800',
          icon: isDark ? 'text-blue-400' : 'text-blue-600',
          iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
        };
      default:
        return {
          bg: isDark ? 'bg-gray-500/20' : 'bg-gray-50',
          border: isDark ? 'border-gray-500/30' : 'border-gray-200',
          text: isDark ? 'text-gray-400' : 'text-gray-800',
          icon: isDark ? 'text-gray-400' : 'text-gray-600',
          iconBg: isDark ? 'bg-gray-500/20' : 'bg-gray-100'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getFeedbackStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} ${styles.border} border rounded-xl shadow-2xl backdrop-blur-xl`}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Ícone */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.icon}`}>
                {getIcon()}
              </div>

              {/* Mensagem */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${styles.text}`}>
                  {message}
                </p>
              </div>

              {/* Botão de fechar */}
              {onClose && (
                <button
                  onClick={onClose}
                  className={`flex-shrink-0 w-6 h-6 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.icon} hover:opacity-80 transition-opacity`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Barra de progresso para auto-hide */}
          {autoHide && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`h-1 ${styles.border} rounded-b-xl`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormFeedback;
