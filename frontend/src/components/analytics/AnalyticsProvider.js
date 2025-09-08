import React, { createContext, useContext, useEffect, useState } from 'react'

// Google Analytics
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID

// Plausible Analytics
const PLAUSIBLE_DOMAIN = process.env.REACT_APP_PLAUSIBLE_DOMAIN || 'agroisync.com'

const AnalyticsContext = createContext()

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState({
    enabled: true,
    provider: 'google', // 'google', 'plausible', 'both'
    events: []
  })

  useEffect(() => {
    initializeAnalytics()
  }, [])

  const initializeAnalytics = () => {
    // Inicializar Google Analytics
    if (GA_MEASUREMENT_ID && analytics.provider !== 'plausible') {
      initializeGoogleAnalytics()
    }

    // Inicializar Plausible Analytics
    if (analytics.provider !== 'google') {
      initializePlausibleAnalytics()
    }
  }

  const initializeGoogleAnalytics = () => {
    // Carregar script do Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    // Configurar gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href
    })
  }

  const initializePlausibleAnalytics = () => {
    // Carregar script do Plausible
    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = PLAUSIBLE_DOMAIN
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }

  const trackEvent = (eventName, parameters = {}) => {
    if (!analytics.enabled) return

    const event = {
      name: eventName,
      parameters,
      timestamp: new Date().toISOString()
    }

    setAnalytics(prev => ({
      ...prev,
      events: [...prev.events, event]
    }))

    // Enviar para Google Analytics
    if (window.gtag && analytics.provider !== 'plausible') {
      window.gtag('event', eventName, parameters)
    }

    // Enviar para Plausible
    if (analytics.provider !== 'google') {
      window.plausible?.(eventName, {
        props: parameters
      })
    }
  }

  const trackPageView = (pageName, pagePath) => {
    if (!analytics.enabled) return

    const event = {
      name: 'page_view',
      parameters: {
        page_name: pageName,
        page_path: pagePath
      },
      timestamp: new Date().toISOString()
    }

    setAnalytics(prev => ({
      ...prev,
      events: [...prev.events, event]
    }))

    // Enviar para Google Analytics
    if (window.gtag && analytics.provider !== 'plausible') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: pagePath
      })
    }

    // Enviar para Plausible
    if (analytics.provider !== 'google') {
      window.plausible?.('pageview', {
        props: {
          page: pagePath
        }
      })
    }
  }

  const trackUserAction = (action, category, label, value) => {
    trackEvent('user_action', {
      action,
      category,
      label,
      value
    })
  }

  const trackBusinessEvent = (eventType, data) => {
    trackEvent('business_event', {
      event_type: eventType,
      ...data
    })
  }

  const trackError = (error, context) => {
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context
    })
  }

  const trackPerformance = (metric, value, unit) => {
    trackEvent('performance', {
      metric,
      value,
      unit
    })
  }

  const setUserProperties = (properties) => {
    if (window.gtag && analytics.provider !== 'plausible') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        user_properties: properties
      })
    }
  }

  const setAnalyticsEnabled = (enabled) => {
    setAnalytics(prev => ({
      ...prev,
      enabled
    }))
  }

  const setAnalyticsProvider = (provider) => {
    setAnalytics(prev => ({
      ...prev,
      provider
    }))
  }

  const getAnalyticsData = () => {
    return analytics
  }

  const clearAnalyticsData = () => {
    setAnalytics(prev => ({
      ...prev,
      events: []
    }))
  }

  const exportAnalyticsData = () => {
    const data = {
      analytics,
      exported_at: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const value = {
    analytics,
    trackEvent,
    trackPageView,
    trackUserAction,
    trackBusinessEvent,
    trackError,
    trackPerformance,
    setUserProperties,
    setAnalyticsEnabled,
    setAnalyticsProvider,
    getAnalyticsData,
    clearAnalyticsData,
    exportAnalyticsData
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider