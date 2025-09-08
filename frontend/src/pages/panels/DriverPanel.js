import React, { useState, useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Truck, MessageSquare, Bell, LogOut, Navigation, DollarSign, Package } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const DriverPanel = () => {
  // const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('freights')
  const [loading, setLoading] = useState(false)
  const [freights, setFreights] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({})
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    loadDriverData()
    getCurrentLocation()
  }, [])

  const loadDriverData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/driver/dashboard')
      const data = await response.json()

      if (data.success) {
        setFreights(data.freights)
        setMessages(data.messages)
        setNotifications(data.notifications)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do motorista:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
        }
      )
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600 dark:text-green-400'
      case 'on_route':
        return 'text-blue-600 dark:text-blue-400'
      case 'delivered':
        return 'text-purple-600 dark:text-purple-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Truck className="w-5 h-5 mr-2 text-agro-emerald" />
          Painel do Motorista
        </h2>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Status da localização */}
      {currentLocation && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Navigation className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Localização Atual
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fretes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalFreights || 0}
              </p>
            </div>
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mensagens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unreadMessages || 0}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notificações</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unreadNotifications || 0}
              </p>
            </div>
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receita</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalEarnings || 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'freights', name: 'Fretes', icon: Truck },
            { id: 'messages', name: 'Mensagens', icon: MessageSquare },
            { id: 'notifications', name: 'Notificações', icon: Bell }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-agro-emerald text-agro-emerald'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'freights' && (
        <div className="space-y-4">
          {freights.map((freight) => (
            <motion.div
              key={freight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {freight.product?.name || 'Produto'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {freight.origin} → {freight.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(freight.price)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(freight.createdAt)}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(freight.status)}`}>
                    <span className="text-sm font-medium">
                      {freight.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {message.sender?.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {message.sender?.name || 'Remetente'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.subject}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(message.createdAt)}
                  </p>
                  {!message.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ações rápidas */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Ações Rápidas
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/freights"
            className="px-4 py-2 bg-agro-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Ver Fretes
          </Link>
          <Link
            to="/messages"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Mensagens
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Perfil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DriverPanel