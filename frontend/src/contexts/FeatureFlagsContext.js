import React, { createContext, useContext, useState, useEffect } from 'react'

const FeatureFlagsContext = createContext()

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error('useFeatureFlags deve ser usado dentro de um FeatureFlagsProvider')
  }
  return context
}

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFeatureFlags()
  }, [])

  const loadFeatureFlags = async () => {
    try {
      setLoading(true)
      setError(null)

      // Carregar flags do servidor
      const response = await fetch('/api/feature-flags')
      const data = await response.json()

      if (data.success) {
        setFlags(data.flags)
      } else {
        // Fallback para flags padrão
        setFlags(getDefaultFlags())
      }
    } catch (err) {
      console.error('Erro ao carregar feature flags:', err)
      setError(err.message)
      // Usar flags padrão em caso de erro
      setFlags(getDefaultFlags())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultFlags = () => ({
    // Funcionalidades principais
    blockchain: true,
    cryptoPayments: true,
    nftSupport: true,
    yieldFarming: false,
    defi: false,
    
    // Funcionalidades de negócio
    marketplace: true,
    freightTracking: true,
    priceAlerts: true,
    weatherIntegration: true,
    newsFeed: true,
    
    // Funcionalidades de comunicação
    messaging: true,
    videoChat: false,
    voiceMessages: false,
    
    // Funcionalidades de pagamento
    stripePayments: true,
    pixPayments: true,
    escrowPayments: true,
    cryptoPayments: true,
    
    // Funcionalidades de UI/UX
    darkMode: true,
    animations: true,
    pwaSupport: true,
    pushNotifications: true,
    
    // Funcionalidades experimentais
    aiRecommendations: false,
    pricePrediction: false,
    smartContracts: false,
    crossChain: false,
    
    // Funcionalidades de administração
    adminPanel: true,
    analytics: true,
    userManagement: true,
    contentModeration: true
  })

  const isEnabled = (flagName) => {
    return flags[flagName] === true
  }

  const isDisabled = (flagName) => {
    return flags[flagName] === false
  }

  const getFlag = (flagName, defaultValue = false) => {
    return flags[flagName] ?? defaultValue
  }

  const setFlag = (flagName, value) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: value
    }))
  }

  const toggleFlag = (flagName) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }))
  }

  const updateFlags = (newFlags) => {
    setFlags(prev => ({
      ...prev,
      ...newFlags
    }))
  }

  const resetFlags = () => {
    setFlags(getDefaultFlags())
  }

  const getEnabledFlags = () => {
    return Object.entries(flags)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key)
  }

  const getDisabledFlags = () => {
    return Object.entries(flags)
      .filter(([_, value]) => value === false)
      .map(([key, _]) => key)
  }

  const getFlagCount = () => {
    return {
      total: Object.keys(flags).length,
      enabled: getEnabledFlags().length,
      disabled: getDisabledFlags().length
    }
  }

  const exportFlags = () => {
    const data = {
      flags,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feature-flags-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importFlags = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          
          if (data.flags && typeof data.flags === 'object') {
            setFlags(data.flags)
            resolve(data.flags)
          } else {
            reject(new Error('Formato de arquivo inválido'))
          }
        } catch (err) {
          reject(new Error('Erro ao processar arquivo'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'))
      }
      
      reader.readAsText(file)
    })
  }

  const value = {
    flags,
    loading,
    error,
    isEnabled,
    isDisabled,
    getFlag,
    setFlag,
    toggleFlag,
    updateFlags,
    resetFlags,
    getEnabledFlags,
    getDisabledFlags,
    getFlagCount,
    exportFlags,
    importFlags,
    loadFeatureFlags
  }

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export default FeatureFlagsProvider