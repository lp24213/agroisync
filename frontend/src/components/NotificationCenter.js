import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Trash, Settings, MessageSquare, AlertTriangle, DollarSign, Clock, Eye } from 'lucide-react'
import notificationService, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_CHANNELS
} from '../services/notificationService'

const NotificationCenter = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [preferences, setPreferences] = useState({})
  const [showPreferences, setShowPreferences] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('')

  const notificationRef = useRef(null)

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const userNotifications = await notificationService.getUserNotifications(userId)
      setNotifications(userNotifications)
      setUnreadCount(notificationService.getUnreadCount(userId))
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications()
      loadPreferences()
      setupNotificationHandler()
    }
  }, [isOpen, userId, loadNotifications])

  useEffect(() => {
    // Fechar ao clicar fora
    const handleClickOutside = event => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const loadPreferences = async () => {
    try {
      const userPrefs = await notificationService.loadUserPreferences()
      setPreferences(userPrefs)
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    }
  }

  const setupNotificationHandler = () => {
    notificationService.registerInAppHandler('notificationCenter', notification => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })
  }

  const handleMarkAsRead = async notificationId => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, status: 'READ', readAt: new Date().toISOString() } : n))
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          status: 'READ',
          readAt: new Date().toISOString()
        }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const handleDeleteNotification = async notificationId => {
    try {
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      // Verificar se era uma notificação não lida
      const deletedNotification = notifications.find(n => n.id === notificationId)
      if (deletedNotification && deletedNotification.status !== 'READ') {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const handlePreferenceChange = async (key, value) => {
    try {
      const newPreferences = { ...preferences, [key]: value }
      setPreferences(newPreferences)
      await notificationService.updatePreferences(newPreferences)
    } catch (error) {
      console.error('Erro ao atualizar preferência:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && notification.status !== 'READ') ||
      (filter === 'read' && notification.status === 'READ')

    const matchesSearch =
      !searchTerm ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getNotificationIcon = type => {
    const notificationType = NOTIFICATION_TYPES[type]
    if (!notificationType) return <Bell className='h-5 w-5' />

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

  const getStatusColor = status => {
    switch (status) {
      case 'READ':
        return 'bg-gray-100 text-gray-600'
      case 'SENT':
        return 'bg-blue-100 text-blue-600'
      case 'DELIVERED':
        return 'bg-green-100 text-green-600'
      case 'FAILED':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-yellow-100 text-yellow-600'
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} min atrás`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
    >
      <motion.div
        ref={notificationRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className='max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl'
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Bell className='h-6 w-6' />
              <div>
                <h2 className='text-xl font-bold'>Central de Notificações</h2>
                <p className='text-sm text-emerald-100'>
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className='rounded-lg p-2 transition-colors hover:bg-white hover:bg-opacity-20'
                title='Preferências'
              >
                <Settings className='h-5 w-5' />
              </button>
              <button
                onClick={onClose}
                className='rounded-lg p-2 transition-colors hover:bg-white hover:bg-opacity-20'
                title='Fechar'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className='border-b border-gray-200 p-6'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='flex-1'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Buscar notificações...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                />
                <Bell className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
            </div>

            <div className='flex space-x-2'>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className='rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
              >
                <option value='all'>Todas</option>
                <option value='unread'>Não lidas</option>
                <option value='read'>Lidas</option>
              </select>

              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className='rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Check className='mr-2 inline h-4 w-4' />
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className='flex h-96'>
          {/* Lista de Notificações */}
          <div className='flex-1 overflow-y-auto'>
            {loading ? (
              <div className='flex h-full items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600'></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center text-gray-500'>
                <Bell className='mb-4 h-16 w-16 text-gray-300' />
                <p className='text-lg font-medium'>Nenhuma notificação</p>
                <p className='text-sm'>Você está em dia com suas notificações!</p>
              </div>
            ) : (
              <div className='space-y-3 p-4'>
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`rounded-lg border bg-white p-4 transition-all duration-200 hover:shadow-md ${
                        notification.status === 'READ' ? 'border-gray-200' : 'border-emerald-200 bg-emerald-50'
                      }`}
                    >
                      <div className='flex items-start space-x-3'>
                        <div className='mt-1 flex-shrink-0'>{getNotificationIcon(notification.type)}</div>

                        <div className='min-w-0 flex-1'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h4 className='mb-1 font-medium text-gray-900'>{notification.title}</h4>
                              <p className='mb-2 text-sm text-gray-600'>{notification.message}</p>
                              <div className='flex items-center space-x-4 text-xs text-gray-500'>
                                <span className='flex items-center'>
                                  <Clock className='mr-1 h-3 w-3' />
                                  {formatDate(notification.createdAt)}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-1 text-xs ${getStatusColor(notification.status)}`}
                                >
                                  {NOTIFICATION_STATUS[notification.status]}
                                </span>
                              </div>
                            </div>

                            <div className='ml-4 flex items-center space-x-2'>
                              {notification.status !== 'READ' && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className='p-1 text-gray-400 transition-colors hover:text-emerald-600'
                                  title='Marcar como lida'
                                >
                                  <Eye className='h-4 w-4' />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className='p-1 text-gray-400 transition-colors hover:text-red-600'
                                title='Deletar'
                              >
                                <Trash className='h-4 w-4' />
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
              className='border-l border-gray-200 bg-gray-50 p-6'
            >
              <h3 className='mb-4 font-semibold text-gray-900'>Preferências</h3>

              <div className='space-y-4'>
                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>Canais de Notificação</h4>
                  <div className='space-y-2'>
                    {Object.entries(NOTIFICATION_CHANNELS).map(([key, label]) => (
                      <label key={key} className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={preferences[key?.toLowerCase()] || false}
                          onChange={e => handlePreferenceChange(key.toLowerCase(), e.target.checked)}
                          className='rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
                        />
                        <span className='ml-2 text-sm text-gray-700'>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>Frequência</h4>
                  <select
                    value={preferences.frequency || 'immediate'}
                    onChange={e => handlePreferenceChange('frequency', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                  >
                    <option value='immediate'>Imediata</option>
                    <option value='hourly'>A cada hora</option>
                    <option value='daily'>Diária</option>
                  </select>
                </div>

                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>Horário Silencioso</h4>
                  <label className='mb-2 flex items-center'>
                    <input
                      type='checkbox'
                      checked={preferences.quietHours?.enabled || false}
                      onChange={e =>
                        handlePreferenceChange('quietHours', {
                          ...preferences.quietHours,
                          enabled: e.target.checked
                        })
                      }
                      className='rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>Ativar</span>
                  </label>

                  {preferences.quietHours?.enabled && (
                    <div className='grid grid-cols-2 gap-2'>
                      <input
                        type='time'
                        value={preferences.quietHours?.start || '22:00'}
                        onChange={e =>
                          handlePreferenceChange('quietHours', {
                            ...preferences.quietHours,
                            start: e.target.value
                          })
                        }
                        className='rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
                      />
                      <input
                        type='time'
                        value={preferences.quietHours?.end || '08:00'}
                        onChange={e =>
                          handlePreferenceChange('quietHours', {
                            ...preferences.quietHours,
                            end: e.target.value
                          })
                        }
                        className='rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
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
  )
}

export default NotificationCenter
