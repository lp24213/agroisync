import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import notificationService from '../services/notificationService';
import NotificationCenter from './NotificationCenter';
import NotificationToast from './NotificationToast';

const NotificationManager = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const notificationRef = useRef(null);

  useEffect(() => {
    if (userId && !isInitialized) {
      initializeNotifications();
    }
  }, [userId, isInitialized]);

  const initializeNotifications = async () => {
    try {
      // Inicializar serviço de notificações
      await notificationService.initialize(userId);
      
      // Carregar notificações existentes
      const userNotifications = await notificationService.getUserNotifications(userId);
      setNotifications(userNotifications);
      setUnreadCount(notificationService.getUnreadCount(userId));
      
      // Registrar handler para notificações em tempo real
      notificationService.registerInAppHandler('notificationManager', handleNewNotification);
      
      // Gerar dados mock se não houver notificações
      if (userNotifications.length === 0) {
        const mockData = notificationService.generateMockData();
        setNotifications(mockData);
        setUnreadCount(mockData.filter(n => n.status !== 'READ').length);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  };

  const handleNewNotification = (notification) => {
    // Adicionar à lista de notificações
    setNotifications(prev => [notification, ...prev]);
    
    // Incrementar contador de não lidas
    if (notification.status !== 'READ') {
      setUnreadCount(prev => prev + 1);
    }
    
    // Mostrar toast se as preferências permitirem
    if (shouldShowToast(notification)) {
      showToastNotification(notification);
    }
  };

  const shouldShowToast = (notification) => {
    // Verificar preferências do usuário
    const preferences = notificationService.userPreferences;
    if (!preferences) return true;
    
    // Verificar se notificações no app estão habilitadas
    if (!preferences.inApp) return false;
    
    // Verificar horário silencioso
    if (preferences.quietHours?.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = preferences.quietHours.start.split(':').map(Number);
      const endTime = preferences.quietHours.end.split(':').map(Number);
      const startMinutes = startTime[0] * 60 + startTime[1];
      const endMinutes = endTime[0] * 60 + endTime[1];
      
      if (startMinutes <= endMinutes) {
        // Mesmo dia (ex: 22:00 - 08:00)
        if (currentTime >= startMinutes || currentTime <= endMinutes) {
          return false;
        }
      } else {
        // Diferentes dias (ex: 22:00 - 08:00)
        if (currentTime >= startMinutes || currentTime <= endMinutes) {
          return false;
        }
      }
    }
    
    return true;
  };

  const showToastNotification = (notification) => {
    const toastId = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toastNotification = {
      ...notification,
      id: toastId
    };
    
    setToastNotifications(prev => [...prev, toastNotification]);
    
    // Auto-remover após 6 segundos (incluindo animação)
    setTimeout(() => {
      removeToastNotification(toastId);
    }, 6000);
  };

  const removeToastNotification = (toastId) => {
    setToastNotifications(prev => prev.filter(t => t.id !== toastId));
  };

  const handleToastAction = (notification) => {
    // Abrir centro de notificações
    setShowNotificationCenter(true);
    
    // Marcar como lida se necessário
    if (notification.status !== 'READ') {
      handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'READ', readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleNotificationCenterClose = () => {
    setShowNotificationCenter(false);
  };

  const handleNotificationUpdate = (updatedNotifications, newUnreadCount) => {
    setNotifications(updatedNotifications);
    setUnreadCount(newUnreadCount);
  };

  // Efeito para limpar notificações antigas
  useEffect(() => {
    const interval = setInterval(() => {
      // Remover notificações toast antigas
      setToastNotifications(prev => 
        prev.filter(toast => {
          const createdAt = new Date(toast.createdAt);
          const now = new Date();
          const diffInMinutes = (now - createdAt) / (1000 * 60);
          return diffInMinutes < 10; // Manter por 10 minutos
        })
      );
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      {/* Botão de Notificações */}
      <div className="relative" ref={notificationRef}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotificationCenter(true)}
          className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
          title="Notificações"
        >
          <Bell className="w-6 h-6" />
          
          {/* Badge de notificações não lidas */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Centro de Notificações */}
      <NotificationCenter
        userId={userId}
        isOpen={showNotificationCenter}
        onClose={handleNotificationCenterClose}
        onUpdate={handleNotificationUpdate}
      />

      {/* Notificações Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toastNotifications.map((toast, index) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, y: index * 80 }}
              animate={{ opacity: 1, x: 0, y: index * 80 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NotificationToast
                notification={toast}
                onClose={() => removeToastNotification(toast.id)}
                onAction={handleToastAction}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationManager;
