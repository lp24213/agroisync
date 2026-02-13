/**
 * AGROISYNC - Configuração do Sentry para Monitoramento
 *
 * Monitoramento de erros e performance em produção
 */

// Configuração do Sentry (apenas em produção)
export const sentryConfig = {
  dsn: process.env.REACT_APP_SENTRY_DSN || '',
  environment: process.env.NODE_ENV || 'development',
  enabled: process.env.NODE_ENV === 'production' && !!process.env.REACT_APP_SENTRY_DSN,

  // Configurações de performance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% em produção, 100% em dev

  // Configurações de replay de sessão
  replaysSessionSampleRate: 0.1, // 10% das sessões
  replaysOnErrorSampleRate: 1.0, // 100% quando há erro

  // Integrations
  integrations: [],

  // Filtros de erros
  ignoreErrors: [
    // Erros do navegador que não podemos controlar
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed',
    'Failed to fetch',
    'NetworkError',
    'AbortError',

    // Erros de extensões do navegador
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://',

    // Erros conhecidos que não precisam ser reportados
    'Loading chunk',
    'ChunkLoadError'
  ],

  // Filtrar eventos antes de enviar
  beforeSend(event, hint) {
    // Em desenvolvimento, apenas logar no console
    if (process.env.NODE_ENV !== 'production') {
      console.error('Sentry Event (não enviado em dev):', event);
      return null;
    }

    // Não enviar erros de localhost
    if (event.request?.url?.includes('localhost')) {
      return null;
    }

    return event;
  },

  // Filtrar transações de performance
  beforeSendTransaction(event) {
    // Em desenvolvimento, não enviar
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    return event;
  }
};

/**
 * Inicializar Sentry (mock para desenvolvimento)
 */
export const initSentry = async () => {
  // Apenas em produção e se DSN estiver configurado
  if (!sentryConfig.enabled) {
    console.log('ℹ️ Sentry desabilitado (dev ou DSN não configurado)');
    return {
      captureException: error => console.error('Mock Sentry Error:', error),
      captureMessage: message => console.log('Mock Sentry Message:', message),
      setUser: user => console.log('Mock Sentry User:', user),
      setTag: (key, value) => console.log('Mock Sentry Tag:', key, value)
    };
  }

  try {
    // Carregar Sentry dinamicamente apenas em produção
    const Sentry = await import('@sentry/react');

    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,
      tracesSampleRate: sentryConfig.tracesSampleRate,
      replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
      replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,
      ignoreErrors: sentryConfig.ignoreErrors,
      beforeSend: sentryConfig.beforeSend,
      beforeSendTransaction: sentryConfig.beforeSendTransaction,

      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'agroisync.com', /^\//]
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true
        })
      ]
    });

    console.log('✅ Sentry inicializado');
    return Sentry;
  } catch (error) {
    console.error('❌ Erro ao inicializar Sentry:', error);
    return null;
  }
};

/**
 * Helper para capturar exceções
 */
export const captureException = (error, context = {}) => {
  if (sentryConfig.enabled) {
    import('@sentry/react').then(Sentry => {
      Sentry.captureException(error, {
        extra: context
      });
    });
  }

  // Sempre logar no console em desenvolvimento
  console.error('Exception:', error, context);
};

/**
 * Helper para capturar mensagens
 */
export const captureMessage = (message, level = 'info', context = {}) => {
  if (sentryConfig.enabled) {
    import('@sentry/react').then(Sentry => {
      Sentry.captureMessage(message, {
        level,
        extra: context
      });
    });
  }

  console.log(`[${level.toUpperCase()}] ${message}`, context);
};

/**
 * Helper para setar usuário
 */
export const setUser = user => {
  if (sentryConfig.enabled && user) {
    import('@sentry/react').then(Sentry => {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name
      });
    });
  }
};

/**
 * Helper para setar contexto
 */
export const setContext = (name, context) => {
  if (sentryConfig.enabled) {
    import('@sentry/react').then(Sentry => {
      Sentry.setContext(name, context);
    });
  }
};

/**
 * Helper para adicionar breadcrumb
 */
export const addBreadcrumb = breadcrumb => {
  if (sentryConfig.enabled) {
    import('@sentry/react').then(Sentry => {
      Sentry.addBreadcrumb(breadcrumb);
    });
  }
};

export default {
  initSentry,
  captureException,
  captureMessage,
  setUser,
  setContext,
  addBreadcrumb,
  config: sentryConfig
};
