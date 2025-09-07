import React, { createContext, useContext, useState, // useEffect } from 'react';

const FeatureFlagsContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags deve ser usado dentro de um FeatureFlagsProvider');
  }
  return context;
};

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState({});
  const [// loading, // setLoading] = useState(true);

  // Feature flags padrão
  const // defaultFlags = {
    // Funcionalidades principais
    'FEATURE_MARKETPLACE': true,
    'FEATURE_AGROCONECTA': true,
    'FEATURE_CRYPTO': true,
    'FEATURE_MESSAGING': true,
    'FEATURE_ADMIN_PANEL': true,
    
    // Funcionalidades avançadas
    'FEATURE_AI_CHATBOT': true,
    'FEATURE_VOICE_CHAT': true,
    'FEATURE_IMAGE_ANALYSIS': true,
    'FEATURE_REAL_TIME_QUOTES': true,
    'FEATURE_WEATHER_WIDGET': true,
    'FEATURE_NEWS_FEED': true,
    
    // Integrações
    'FEATURE_STRIPE_PAYMENTS': true,
    'FEATURE_METAMASK_INTEGRATION': true,
    'FEATURE_NFT_MINTING': true,
    'FEATURE_STAKING': true,
    
    // UI/UX
    'FEATURE_DARK_MODE': true,
    'FEATURE_ANIMATIONS': true,
    'FEATURE_GLASSMORPHISM': true,
    'FEATURE_NEON_EFFECTS': true,
    
    // Analytics
    'FEATURE_ANALYTICS': true,
    'FEATURE_USER_TRACKING': true,
    'FEATURE_PERFORMANCE_MONITORING': true,
    
    // Segurança
    'FEATURE_2FA': true,
    'FEATURE_RATE_LIMITING': true,
    'FEATURE_SECURITY_LOGS': true,
    
    // Experimentais
    'FEATURE_BETA_FEATURES': false,
    'FEATURE_EXPERIMENTAL_UI': false,
    'FEATURE_ADVANCED_ANALYTICS': false,
    
    // Por ambiente
    'FEATURE_DEBUG_MODE': process.env.NODE_ENV === 'development',
    'FEATURE_MAINTENANCE_MODE': false
  };

  // Carregar feature flags
  // useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        // Em produção, carregar flags do servidor
        if (process.env.NODE_ENV === 'production') {
          const response = await fetch('/api/feature-flags');
          if (response.ok) {
            const serverFlags = await response.json();
            setFlags({ ...// defaultFlags, ...serverFlags });
          } else {
            setFlags(// defaultFlags);
          }
        } else {
          // Em desenvolvimento, usar flags padrão
          setFlags(// defaultFlags);
        }
      } catch (error) {
        console.error('Erro ao carregar feature flags:', error);
        setFlags(// defaultFlags);
      } finally {
        // setLoading(false);
      }
    };

    loadFeatureFlags();
  }, []);

  // Verificar se uma feature está habilitada
  const isEnabled = (flagName) => {
    return flags[flagName] === true;
  };

  // Verificar se múltiplas features estão habilitadas
  const areEnabled = (flagNames) => {
    return flagNames.every(flagName => flags[flagName] === true);
  };

  // Verificar se pelo menos uma feature está habilitada
  const isAnyEnabled = (flagNames) => {
    return flagNames.some(flagName => flags[flagName] === true);
  };

  // Obter valor de uma feature flag
  const getFlag = (flagName, defaultValue = false) => {
    return flags[flagName] !== undefined ? flags[flagName] : defaultValue;
  };

  // Atualizar feature flag (apenas para admin)
  const updateFlag = async (flagName, value) => {
    try {
      const response = await fetch('/api/feature-flags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          flagName,
          value
        })
      });

      if (response.ok) {
        setFlags(prev => ({
          ...prev,
          [flagName]: value
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar feature flag:', error);
      return false;
    }
  };

  // Obter todas as flags
  const getAllFlags = () => {
    return flags;
  };

  // Obter flags por categoria
  const getFlagsByCategory = (category) => {
    const categories = {
      'main': ['FEATURE_MARKETPLACE', 'FEATURE_AGROCONECTA', 'FEATURE_CRYPTO', 'FEATURE_MESSAGING'],
      'advanced': ['FEATURE_AI_CHATBOT', 'FEATURE_VOICE_CHAT', 'FEATURE_IMAGE_ANALYSIS'],
      'integrations': ['FEATURE_STRIPE_PAYMENTS', 'FEATURE_METAMASK_INTEGRATION', 'FEATURE_NFT_MINTING'],
      'ui': ['FEATURE_DARK_MODE', 'FEATURE_ANIMATIONS', 'FEATURE_GLASSMORPHISM'],
      'analytics': ['FEATURE_ANALYTICS', 'FEATURE_USER_TRACKING'],
      'security': ['FEATURE_2FA', 'FEATURE_RATE_LIMITING'],
      'experimental': ['FEATURE_BETA_FEATURES', 'FEATURE_EXPERIMENTAL_UI']
    };

    const categoryFlags = categories[category] || [];
    return categoryFlags.reduce((acc, flagName) => {
      acc[flagName] = flags[flagName];
      return acc;
    }, {});
  };

  const value = {
    flags,
    // loading,
    isEnabled,
    areEnabled,
    isAnyEnabled,
    getFlag,
    updateFlag,
    getAllFlags,
    getFlagsByCategory
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};