import { useCallback } from 'react'
import { useAnalytics as useAnalyticsContext } from '../components/analytics/AnalyticsProvider'

export const useAnalytics = () => {
  const analytics = useAnalyticsContext()

  // Hook para rastrear cliques em botões
  const trackButtonClick = useCallback(
    (buttonName, location, details = {}) => {
      analytics.trackUserInteraction('button_click', buttonName, {
        location,
        ...details
      })
    },
    [analytics]
  )

  // Hook para rastrear formulários
  const trackFormSubmit = useCallback(
    (formName, success, details = {}) => {
      analytics.trackUserInteraction('form_submit', formName, {
        success,
        ...details
      })
    },
    [analytics]
  )

  // Hook para rastrear navegação
  const trackNavigation = useCallback(
    (from, to, method = 'click') => {
      analytics.trackUserInteraction('navigation', `${from}_to_${to}`, {
        method,
        from,
        to
      })
    },
    [analytics]
  )

  // Hook para rastrear busca
  const trackSearch = useCallback(
    (query, results, category = null) => {
      analytics.trackEvent('search', {
        search_term: query,
        results_count: results,
        category
      })
    },
    [analytics]
  )

  // Hook para rastrear visualização de produtos
  const trackProductView = useCallback(
    (productId, productName, category, price) => {
      analytics.trackEvent('view_item', {
        item_id: productId,
        item_name: productName,
        item_category: category,
        value: price,
        currency: 'BRL'
      })
    },
    [analytics]
  )

  // Hook para rastrear adição ao carrinho
  const trackAddToCart = useCallback(
    (productId, productName, quantity, price) => {
      analytics.trackEvent('add_to_cart', {
        item_id: productId,
        item_name: productName,
        quantity,
        value: price * quantity,
        currency: 'BRL'
      })
    },
    [analytics]
  )

  // Hook para rastrear início do checkout
  const trackBeginCheckout = useCallback(
    (items, totalValue) => {
      analytics.trackEvent('begin_checkout', {
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        value: totalValue,
        currency: 'BRL'
      })
    },
    [analytics]
  )

  // Hook para rastrear compra
  const trackPurchase = useCallback(
    (transactionId, items, totalValue, paymentMethod) => {
      analytics.trackConversion('purchase', totalValue, 'BRL')
      analytics.trackEvent('purchase', {
        transaction_id: transactionId,
        value: totalValue,
        currency: 'BRL',
        payment_method: paymentMethod,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      })
    },
    [analytics]
  )

  // Hook para rastrear cadastro
  const trackSignUp = useCallback(
    (method, userType) => {
      analytics.trackEvent('sign_up', {
        method,
        user_type: userType
      })
    },
    [analytics]
  )

  // Hook para rastrear login
  const trackLogin = useCallback(
    method => {
      analytics.trackEvent('login', {
        method
      })
    },
    [analytics]
  )

  // Hook para rastrear logout
  const trackLogout = useCallback(() => {
    analytics.trackEvent('logout')
  }, [analytics])

  // Hook para rastrear tempo na página
  const trackTimeOnPage = useCallback(
    (pageName, timeSpent) => {
      analytics.trackPerformance('time_on_page', timeSpent, 'seconds')
      analytics.trackEvent('time_on_page', {
        page_name: pageName,
        time_spent: timeSpent
      })
    },
    [analytics]
  )

  // Hook para rastrear scroll
  const trackScroll = useCallback(
    (pageName, scrollPercentage) => {
      analytics.trackUserInteraction('scroll', pageName, {
        scroll_percentage: scrollPercentage
      })
    },
    [analytics]
  )

  // Hook para rastrear download
  const trackDownload = useCallback(
    (fileName, fileType, fileSize) => {
      analytics.trackEvent('file_download', {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize
      })
    },
    [analytics]
  )

  // Hook para rastrear compartilhamento
  const trackShare = useCallback(
    (contentType, contentId, method) => {
      analytics.trackEvent('share', {
        content_type: contentType,
        content_id: contentId,
        method
      })
    },
    [analytics]
  )

  // Hook para rastrear erro de página
  const trackPageError = useCallback(
    (errorCode, errorMessage, pageUrl) => {
      analytics.trackError('page_error', errorMessage, {
        error_code: errorCode,
        page_url: pageUrl
      })
    },
    [analytics]
  )

  // Hook para rastrear erro de API
  const trackApiError = useCallback(
    (endpoint, errorCode, errorMessage) => {
      analytics.trackError('api_error', errorMessage, {
        endpoint,
        error_code: errorCode
      })
    },
    [analytics]
  )

  return {
    ...analytics,
    trackButtonClick,
    trackFormSubmit,
    trackNavigation,
    trackSearch,
    trackProductView,
    trackAddToCart,
    trackBeginCheckout,
    trackPurchase,
    trackSignUp,
    trackLogin,
    trackLogout,
    trackTimeOnPage,
    trackScroll,
    trackDownload,
    trackShare,
    trackPageError,
    trackApiError
  }
}

export default useAnalytics
