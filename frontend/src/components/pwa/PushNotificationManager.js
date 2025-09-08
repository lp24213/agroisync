import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  BellOff, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Zap,
  MessageSquare,
  Package,
  Truck,
  DollarSign
} from 'lucide-react'

const PushNotificationManager = ({ userId }) => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState({
    orders: true,
    deliveries: true,
    payments: true,
    messages: true,
    promotions: false,
    system: true
  })

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      checkPermission()
      checkSubscription()
    }
  }, [])

  const checkPermission = useCallback(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const checkSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (err) {
      console.error('Erro ao verificar assinatura:', err)
    }
  }, [])

  const requestPermission = async () => {
    setLoading(true)
    setError('')

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === 'granted') {
        await subscribeToNotifications()
      } else {
        setError('Permissão negada para notificações')
      }
    } catch (err) {
      setError('Erro ao solicitar permissão')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Gerar chave pública do VAPID
      const response = await fetch('/api/notifications/vapid-key')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error('Erro ao obter chave VAPID')
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: data.vapidKey
      })

      // Enviar assinatura para o servidor
      const saveResponse = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          subscription: subscription.toJSON(),
          settings
        })
      })

      const saveData = await saveResponse.json()

      if (saveData.success) {
        setIsSubscribed(true)
      } else {
        throw new Error(saveData.message)
      }
    } catch (err) {
      setError('Erro ao assinar notificações')
    }
  }

  const unsubscribeFromNotifications = async () => {
    setLoading(true)
    setError('')

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()

        // Notificar servidor
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        })

        setIsSubscribed(false)
      }
    } catch (err) {
      setError('Erro ao cancelar assinatura')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    setSettings(newSettings)

    if (isSubscribed) {
      try {
        await fetch('/api/notifications/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            settings: newSettings
          })
        })
      } catch (err) {
        console.error('Erro ao atualizar configurações:', err)
      }
    }
  }

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    updateSettings(newSettings)
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Permitido', color: 'text-green-600', icon: CheckCircle }
      case 'denied':
        return { text: 'Negado', color: 'text-red-600', icon: AlertCircle }
      default:
        return { text: 'Não solicitado', color: 'text-gray-600', icon: BellOff }
    }
  }

  const permissionStatus = getPermissionStatus()
  const StatusIcon = permissionStatus.icon

  if (!isSupported) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Notificações não suportadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Seu navegador não suporta notificações push
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-agro-emerald" />
          Notificações Push
        </h2>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-5 h-5 ${permissionStatus.color}`} />
          <span className={`text-sm font-medium ${permissionStatus.color}`}>
            {permissionStatus.text}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Status da assinatura */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Status da Assinatura
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSubscribed ? 'Recebendo notificações' : 'Não está recebendo notificações'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isSubscribed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-6">
        {!isSubscribed ? (
          <button
            onClick={requestPermission}
            disabled={loading || permission === 'denied'}
            className="w-full px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Configurando...</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Ativar Notificações</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={unsubscribeFromNotifications}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Desativando...</span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span>Desativar Notificações</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Configurações */}
      {isSubscribed && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configurações de Notificação
          </h3>
          <div className="space-y-4">
            {[
              { key: 'orders', label: 'Pedidos', icon: Package, description: 'Novos pedidos e atualizações' },
              { key: 'deliveries', label: 'Entregas', icon: Truck, description: 'Status de entregas' },
              { key: 'payments', label: 'Pagamentos', icon: DollarSign, description: 'Confirmações de pagamento' },
              { key: 'messages', label: 'Mensagens', icon: MessageSquare, description: 'Novas mensagens' },
              { key: 'promotions', label: 'Promoções', icon: Zap, description: 'Ofertas e promoções' },
              { key: 'system', label: 'Sistema', icon: Settings, description: 'Atualizações do sistema' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {setting.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[setting.key]}
                    onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-agro-emerald/20 dark:peer-focus:ring-agro-emerald/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-agro-emerald"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Privacidade e Segurança
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Suas notificações são criptografadas e processadas de forma segura. Você pode desativar a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PushNotificationManager