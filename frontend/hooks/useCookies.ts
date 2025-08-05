import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function useCookies() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookie-consent');
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      setHasConsent(true);
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    setHasConsent(true);
  };

  const clearPreferences = () => {
    localStorage.removeItem('cookie-consent');
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
    setHasConsent(false);
  };

  const canUseAnalytics = () => {
    return hasConsent && preferences.analytics;
  };

  const canUseMarketing = () => {
    return hasConsent && preferences.marketing;
  };

  const canUseFunctional = () => {
    return hasConsent && preferences.functional;
  };

  return {
    preferences,
    hasConsent,
    updatePreferences,
    clearPreferences,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
  };
} 