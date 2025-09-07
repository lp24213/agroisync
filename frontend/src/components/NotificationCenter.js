import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, Trash, Settings, 
  MessageSquare, AlertTriangle, DollarSign,
  Clock, Eye
} from 'lucide-react';
import notificationService, { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_STATUS,
  NOTIFICATION_CHANNELS 
} from '../services/notificationService';

const NotificationCenter = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({});
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  
  const notificationRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const userNotifications = await notificationService.getUserNotifications(userId);
      setNotifications(userNotifications);
      setUnreadCount(notificationService.getUnreadCount(userId));
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications();
      loadPreferences();
      setupNotificationHandler();
    }
  }, [isOpen, userId, loadNotifications]);

  useEffect(() => {
    // Fechar ao clicar fora
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const loadPreferences = async () => {
    try {
      const userPrefs = await notificationService.loadUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const setupNotificationHandler = () => {
    notificationService.registerInAppHandler('notificationCenter', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
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

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ 
          ...n, 
          status: 'READ', 
          readAt: new Date().toISOString() 
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Verificar se era uma notificação não lida
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && deletedNotification.status !== 'READ') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await notificationService.updatePreferences(newPreferences);
    } catch (error) {
      console.error('Erro ao atualizar preferência:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && notification.status !== 'READ') ||
      (filter === 'read' && notification.status === 'READ');
    
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getNotificationIcon = (type) => {
    const notificationType = NOTIFICATION_TYPES[type];
    if (!notificationType) return <Bell className="w-5 h-5" />;
    
    switch (type) {
      case 'NEW_TRANSACTION':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'STATUS_CHANGED':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'SYSTEM_ALERT':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'READ':
        return 'bg-gray-100 text-gray-600';
      case 'SENT':
        return 'bg-blue-100 text-blue-600';
      case 'DELIVERED':
        return 'bg-green-100 text-green-600';
      case 'FAILED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        ref={notificationRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Central de Notificações</h2>
                <p className="text-emerald-100 text-sm">
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Preferências"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Bell className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="unread">Não lidas</option>
                <option value="read">Lidas</option>
              </select>
              
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4 mr-2 inline" />
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex h-96">
          {/* Lista de Notificações */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhuma notificação</p>
                <p className="text-sm">Você está em dia com suas notificações!</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
                        notification.status === 'READ' ? 'border-gray-200' : 'border-emerald-200 bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(notification.createdAt)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(notification.status)}`}>
                                  {NOTIFICATION_STATUS[notification.status]}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {notification.status !== 'READ' && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Deletar"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Preferências (lado direito) */}
          {showPreferences && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-gray-200 p-6 bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Preferências</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Canais de Notificação</h4>
                  <div className="space-y-2">
                    {Object.entries(NOTIFICATION_CHANNELS).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences[key?.toLowerCase()] || false}
                          onChange={(e) => handlePreferenceChange(key.toLowerCase(), e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Frequência</h4>
                  <select
                    value={preferences.frequency || 'immediate'}
                    onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="immediate">Imediata</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">Diária</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Horário Silencioso</h4>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={preferences.quietHours?.enabled || false}
                      onChange={(e) => handlePreferenceChange('quietHours', { 
                        ...preferences.quietHours, 
                        enabled: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ativar</span>
                  </label>
                  
                  {preferences.quietHours?.enabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={preferences.quietHours?.start || '22:00'}
                        onChange={(e) => handlePreferenceChange('quietHours', { 
                          ...preferences.quietHours, 
                          start: e.target.value 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <input
                        type="time"
                        value={preferences.quietHours?.end || '08:00'}
                        onChange={(e) => handlePreferenceChange('quietHours', { 
                          ...preferences.quietHours, 
                          end: e.target.value 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationCenter;
