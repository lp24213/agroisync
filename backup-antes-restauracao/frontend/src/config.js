// @ts-check

/**
 * Configuração global do frontend
 */
export const config = {
  // API
  api: {
  // Use VITE_API_URL quando definido. Senão, use a origem atual + '/api' quando possível,
  // ou '/api' como fallback — NUNCA usar localhost em produção.
  url: import.meta.env.VITE_API_URL ?? (typeof window !== 'undefined' && window.location && window.location.origin ? `${window.location.origin}/api` : '/api'),
    version: import.meta.env.VITE_API_VERSION ?? 'v1'
  },
  
  // Feature flags
  features: {
    enableMarketplace: (import.meta.env.VITE_ENABLE_MARKETPLACE ?? 'true') === 'true',
    enableRealTimeChat: (import.meta.env.VITE_ENABLE_REALTIME_CHAT ?? 'true') === 'true',
    enableBlockchain: (import.meta.env.VITE_ENABLE_BLOCKCHAIN ?? 'false') === 'true'
  },
  
  // Turnstile
  turnstile: {
    siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY
  },
  
  // Upload
  upload: {
    cloudinaryName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    cloudinaryKey: import.meta.env.VITE_CLOUDINARY_API_KEY
  },
  
  // Analytics
  analytics: {
    googleId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    posthogToken: import.meta.env.VITE_POSTHOG_TOKEN,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN
  },
  
  // Local storage keys
  storage: {
    authToken: 'agroisync_auth_token',
    userData: 'agroisync_user_data',
    theme: 'agroisync_theme',
    language: 'agroisync_lang'
  }
};