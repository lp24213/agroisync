import React, { createContext, useContext, useState, useEffect } from 'react';

const FeatureFlagsContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState({
    FEATURE_NEW_NAV: process.env.REACT_APP_FEATURE_NEW_NAV === 'on' || true,
    FEATURE_TICKER_B3: process.env.REACT_APP_FEATURE_TICKER_B3 === 'on' || true,
    FEATURE_HOME_GRAINS: process.env.REACT_APP_FEATURE_HOME_GRAINS === 'on' || true,
    USE_MOCK: process.env.REACT_APP_USE_MOCK === 'on' || false,
    TICKER_REFRESH_MS: parseInt(process.env.REACT_APP_TICKER_REFRESH_MS) || 15000,
    NEWS_LIMIT: parseInt(process.env.REACT_APP_NEWS_LIMIT) || 8,
    WEATHER_PROVIDER: process.env.REACT_APP_WEATHER_PROVIDER || 'default',
    IP_PROVIDER: process.env.REACT_APP_IP_PROVIDER || 'default'
  });

  const isEnabled = (flagName) => {
    return flags[flagName] === true;
  };

  const getValue = (flagName, defaultValue = null) => {
    return flags[flagName] !== undefined ? flags[flagName] : defaultValue;
  };

  const toggleFlag = (flagName) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const setFlag = (flagName, value) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: value
    }));
  };

  return (
    <FeatureFlagsContext.Provider value={{
      flags,
      isEnabled,
      getValue,
      toggleFlag,
      setFlag
    }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};
