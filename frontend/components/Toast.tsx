import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const toastColors = {
  success: 'from-green-400 to-green-700',
  error: 'from-pink-500 to-red-700',
  info: 'from-blue-400 to-blue-800',
  warning: 'from-yellow-400 to-yellow-700',
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 bottom-8 right-8 px-5 py-3 rounded-xl shadow-lg bg-gradient-to-br ${toastColors[type]} text-white font-bold text-lg animate-fade-in-up backdrop-blur-md border border-white/10`}
      role="status"
      aria-live="polite"
      tabIndex={0}
    >
      <span className="drop-shadow-lg select-none">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition"
        aria-label="Fechar toast"
      >✕</button>
    </div>
  );
};

export default Toast;
