import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Zap,
  Star
} from 'lucide-react'

const PWAInstallPrompt = ({ onInstall, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [platform, setPlatform] = useState('desktop')

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('android')) {
      setPlatform('android')
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('ios')
    } else {
      setPlatform('desktop')
    }

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Escutar evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Escutar evento de instalação concluída
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsVisible(false)
      onInstall?.()
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)

    try {
      // Mostrar prompt de instalação
      deferredPrompt.prompt()
      
      // Aguardar resposta do usuário
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA instalado com sucesso')
      } else {
        console.log('Instalação do PWA rejeitada')
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'android':
        return <Smartphone className="w-6 h-6" />
      case 'ios':
        return <Smartphone className="w-6 h-6" />
      default:
        return <Monitor className="w-6 h-6" />
    }
  }

  const getPlatformText = () => {
    switch (platform) {
      case 'android':
        return 'Android'
      case 'ios':
        return 'iOS'
      default:
        return 'Desktop'
    }
  }

  if (isInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
      >
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">PWA Instalado!</p>
            <p className="text-sm opacity-90">
              O AgroSync foi instalado com sucesso
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-sm p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-agro-emerald/10 rounded-lg">
                {getPlatformIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Instalar App
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Para {getPlatformText()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="w-4 h-4" />
              <span>Acesso rápido e offline</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Seguro e confiável</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Star className="w-4 h-4" />
              <span>Experiência nativa</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 px-4 py-2 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Instalando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Instalar</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Agora não
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>Dica:</strong> Adicione o AgroSync à sua tela inicial para acesso rápido e funcionalidades offline.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PWAInstallPrompt