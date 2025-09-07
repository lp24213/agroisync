import React, { createContext, useContext, // useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Google Analytics 4
const // GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Plausible Analytics
const // PLAUSIBLE_DOMAIN = process.env.REACT_APP_PLAUSIBLE_DOMAIN || 'agroisync.com';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar Google Analytics
  // useEffect(() => {
    if (// GA_MEASUREMENT_ID && !isInitialized) {
      // Carregar script do Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${// GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Configurar gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', // GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'language',
          'custom_parameter_2': 'user_type'
        }
      });

      setIsInitialized(true);
    }
  }, [// GA_MEASUREMENT_ID, isInitialized]);

  // Inicializar Plausible Analytics
  // useEffect(() => {
    if (// PLAUSIBLE_DOMAIN && !window.plausible) {
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-domain', // PLAUSIBLE_DOMAIN);
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  }, [// PLAUSIBLE_DOMAIN]);

  // Função para rastrear eventos
  const trackEvent = (eventName, parameters = {}) => {
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...parameters,
          language: i18n.language,
          timestamp: new Date().toISOString()
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible(eventName, {
          props: parameters
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, parameters);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Função para rastrear visualizações de página
  const trackPageView = (pageName, pagePath) => {
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('config', // GA_MEASUREMENT_ID, {
          page_title: pageName,
          page_location: window.location.origin + pagePath,
          page_path: pagePath,
          language: i18n.language
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible('pageview', {
          props: {
            page: pagePath,
            language: i18n.language
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Page View:', pageName, pagePath);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  // Função para rastrear conversões
  const trackConversion = (conversionType, value, currency = 'BRL') => {
    try {
      const eventName = `conversion_${conversionType}`;
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: `conv_${Date.now()}`,
          value: value,
          currency: currency,
          event_category: 'conversion',
          event_label: conversionType,
          language: i18n.language
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible(eventName, {
          props: {
            value: value,
            currency: currency,
            type: conversionType
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Conversion:', conversionType, value, currency);
      }
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  // Função para rastrear erros
  const trackError = (errorType, errorMessage, errorDetails = {}) => {
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: errorMessage,
          fatal: false,
          custom_parameter_1: errorType,
          custom_parameter_2: JSON.stringify(errorDetails)
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible('error', {
          props: {
            type: errorType,
            message: errorMessage,
            details: JSON.stringify(errorDetails)
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics Error:', errorType, errorMessage, errorDetails);
      }
    } catch (error) {
      console.error('Error tracking error:', error);
    }
  };

  // Função para rastrear performance
  const trackPerformance = (metricName, value, unit = 'ms') => {
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: metricName,
          value: value,
          event_category: 'performance',
          event_label: unit
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible('performance', {
          props: {
            metric: metricName,
            value: value,
            unit: unit
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance:', metricName, value, unit);
      }
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  };

  // Função para rastrear interações do usuário
  const trackUserInteraction = (interactionType, element, details = {}) => {
    try {
      const eventName = `user_interaction_${interactionType}`;
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'user_interaction',
          event_label: element,
          custom_parameter_1: interactionType,
          custom_parameter_2: JSON.stringify(details)
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible(eventName, {
          props: {
            type: interactionType,
            element: element,
            details: JSON.stringify(details)
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('// User Interaction:', interactionType, element, details);
      }
    } catch (error) {
      console.error('Error tracking // user interaction:', error);
    }
  };

  // Função para rastrear funil de conversão
  const trackFunnelStep = (funnelName, stepName, stepNumber, details = {}) => {
    try {
      const eventName = `funnel_${funnelName}_${stepName}`;
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'funnel',
          event_label: funnelName,
          custom_parameter_1: stepName,
          custom_parameter_2: stepNumber.toString(),
          custom_parameter_3: JSON.stringify(details)
        });
      }

      // Plausible Analytics
      if (window.plausible) {
        window.plausible(eventName, {
          props: {
            funnel: funnelName,
            step: stepName,
            step_number: stepNumber,
            details: JSON.stringify(details)
          }
        });
      }

      // Log local para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Funnel Step:', funnelName, stepName, stepNumber, details);
      }
    } catch (error) {
      console.error('Error tracking funnel step:', error);
    }
  };

  const value = {
    isInitialized,
    trackEvent,
    trackPageView,
    trackConversion,
    trackError,
    trackPerformance,
    trackUserInteraction,
    trackFunnelStep
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
