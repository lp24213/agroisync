import { useState, useEffect, useCallback } from 'react'
import { useAnalytics } from './useAnalytics'

export const usePWA = () => {
  const analytics = useAnalytics()
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [swRegistration, setSwRegistration] = useState(null)

  // Verificar se o app está instalado
  useEffect(() => {
    const checkInstalled = () => {
      // Verificar se está rodando como PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInApp = window.navigator.standalone === true
      setIsInstalled(isStandalone || isInApp)
    }

    checkInstalled()
    window.addEventListener('resize', checkInstalled)
    return () => window.removeEventListener('resize', checkInstalled)
  }, [])

  // Gerenciar evento de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      analytics.trackEvent('pwa_install_prompt_available')
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      analytics.trackEvent('pwa_installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [analytics])

  // Gerenciar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      analytics.trackEvent('pwa_online')
    }

    const handleOffline = () => {
      setIsOnline(false)
      analytics.trackEvent('pwa_offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [analytics])

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          setSwRegistration(registration)
          analytics.trackEvent('pwa_sw_registered')

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true)
                  analytics.trackEvent('pwa_update_available')
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
          analytics.trackError('pwa_sw_registration_failed', error.message)
        })
    }
  }, [analytics])

  // Instalar PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        analytics.trackEvent('pwa_install_accepted')
      } else {
        analytics.trackEvent('pwa_install_declined')
      }

      setDeferredPrompt(null)
      setIsInstallable(false)
      return outcome === 'accepted'
    } catch (error) {
      console.error('Error installing PWA:', error)
      analytics.trackError('pwa_install_error', error.message)
      return false
    }
  }, [deferredPrompt, analytics])

  // Atualizar PWA
  const updatePWA = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
      analytics.trackEvent('pwa_updated')
    }
  }, [swRegistration, analytics])

  // Adicionar à tela inicial (iOS)
  const addToHomeScreen = useCallback(() => {
    // Para iOS, mostrar instruções
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches

    if (isIOS && !isInStandaloneMode) {
      analytics.trackEvent('pwa_ios_instructions_shown')
      return 'ios'
    }

    return false
  }, [analytics])

  // Verificar recursos do PWA
  const getPWACapabilities = useCallback(() => {
    return {
      hasServiceWorker: 'serviceWorker' in navigator,
      hasPushManager: 'PushManager' in window,
      hasNotification: 'Notification' in window,
      hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      hasPeriodicSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype,
      hasWebShare: 'share' in navigator,
      hasWebShareTarget: 'serviceWorker' in navigator,
      hasFileHandling: 'serviceWorker' in navigator,
      hasProtocolHandling: 'serviceWorker' in navigator
    }
  }, [])

  // Compartilhar conteúdo
  const shareContent = useCallback(
    async data => {
      if (navigator.share) {
        try {
          await navigator.share(data)
          analytics.trackEvent('pwa_share_success', { type: data.type || 'unknown' })
          return true
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error)
            analytics.trackError('pwa_share_error', error.message)
          }
          return false
        }
      }
      return false
    },
    [analytics]
  )

  // Obter informações do dispositivo
  const getDeviceInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      isInApp: window.navigator.standalone === true
    }
  }, [])

  // Cache de recursos
  const cacheResources = useCallback(
    async urls => {
      if (swRegistration && swRegistration.active) {
        try {
          swRegistration.active.postMessage({
            type: 'CACHE_URLS',
            urls: urls
          })
          analytics.trackEvent('pwa_resources_cached', { count: urls.length })
          return true
        } catch (error) {
          console.error('Error caching resources:', error)
          analytics.trackError('pwa_cache_error', error.message)
          return false
        }
      }
      return false
    },
    [swRegistration, analytics]
  )

  // Limpar cache
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
        analytics.trackEvent('pwa_cache_cleared')
        return true
      } catch (error) {
        console.error('Error clearing cache:', error)
        analytics.trackError('pwa_cache_clear_error', error.message)
        return false
      }
    }
    return false
  }, [analytics])

  // Obter informações do cache
  const getCacheInfo = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        const cacheInfo = await Promise.all(
          cacheNames.map(async cacheName => {
            const cache = await caches.open(cacheName)
            const keys = await cache.keys()
            return {
              name: cacheName,
              size: keys.length,
              urls: keys.map(request => request.url)
            }
          })
        )
        return cacheInfo
      } catch (error) {
        console.error('Error getting cache info:', error)
        return []
      }
    }
    return []
  }, [])

  // Verificar conectividade
  const checkConnectivity = useCallback(async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      return response.ok
    } catch (error) {
      return false
    }
  }, [])

  // Sincronizar dados offline
  const syncOfflineData = useCallback(async () => {
    if (swRegistration) {
      try {
        await swRegistration.sync.register('background-sync')
        analytics.trackEvent('pwa_offline_sync_triggered')
        return true
      } catch (error) {
        console.error('Error triggering offline sync:', error)
        analytics.trackError('pwa_offline_sync_error', error.message)
        return false
      }
    }
    return false
  }, [swRegistration, analytics])

  return {
    // Estado
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    swRegistration,

    // Ações
    installPWA,
    updatePWA,
    addToHomeScreen,
    shareContent,
    cacheResources,
    clearCache,
    getCacheInfo,
    checkConnectivity,
    syncOfflineData,

    // Informações
    getPWACapabilities,
    getDeviceInfo
  }
}

export default usePWA
