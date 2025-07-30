import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session tracking
  autoSessionTracking: true,
  
  // Error sampling
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Ignore specific errors
  ignoreErrors: [
    // Network errors
    'Network Error',
    'Failed to fetch',
    'Request timeout',
    'Connection refused',
    
    // Browser-specific errors
    'ResizeObserver loop limit exceeded',
    'Script error.',
    'Script error',
    
    // Wallet connection errors
    'User rejected the request',
    'User rejected the transaction',
    'User cancelled the operation',
    
    // Blockchain errors
    'Transaction failed',
    'Insufficient funds',
    'Gas estimation failed',
    
    // Third-party errors
    'Google Analytics',
    'Facebook Pixel',
    'Hotjar',
    
    // Development errors
    'React DevTools',
    'Redux DevTools',
    'Webpack DevTools'
  ],
  
  // Ignore specific URLs
  denyUrls: [
    // Development URLs
    /localhost/,
    /127\.0\.0\.1/,
    /0\.0\.0\.0/,
    
    // Browser extensions
    /chrome-extension/,
    /moz-extension/,
    /safari-extension/,
    
    // Analytics and monitoring
    /google-analytics/,
    /facebook\.com/,
    /hotjar\.com/,
    
    // CDN and static assets
    /cdn\./,
    /static\./,
    /assets\./
  ],
  
  // Before send function to filter events
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out specific error types
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception) {
        // Filter out network errors
        if (exception.type === 'NetworkError' || 
            exception.value?.includes('Network Error') ||
            exception.value?.includes('Failed to fetch')) {
          return null;
        }
        
        // Filter out user cancellation errors
        if (exception.value?.includes('User rejected') ||
            exception.value?.includes('User cancelled')) {
          return null;
        }
        
        // Filter out blockchain errors
        if (exception.value?.includes('Transaction failed') ||
            exception.value?.includes('Insufficient funds')) {
          return null;
        }
      }
    }
    
    // Add custom context
    event.tags = {
      ...event.tags,
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      platform: 'web'
    };
    
    // Add user context if available
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('agrotm_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          event.user = {
            id: userData.id,
            email: userData.email,
            wallet_address: userData.wallet_address
          };
        } catch (error) {
          // Ignore parsing errors
        }
      }
    }
    
    return event;
  },
  
  // Integrations
  integrations: [
    // Browser integrations
    new Sentry.BrowserTracing({
      // Routing instrumentation for Next.js
      routingInstrumentation: Sentry.nextjsRouterInstrumentation(),
      
      // Performance monitoring
      tracingOrigins: [
        'localhost',
        'agrotm.com',
        'staging.agrotm.com',
        'api.agrotm.com'
      ]
    }),
    
    // Session replay (only in production)
    ...(process.env.NODE_ENV === 'production' ? [
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
        maskAllInputs: true,
        blockClass: 'sentry-block',
        blockSelector: '[data-sentry-block]',
        maskTextClass: 'sentry-mask',
        maskTextSelector: '[data-sentry-mask]'
      })
    ] : [])
  ],
  
  // Transport options
  transport: Sentry.makeBrowserTransport,
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
  
  // Attach stack traces
  attachStacktrace: true,
  
  // Normalize URLs
  normalizeDepth: 3,
  
  // Max breadcrumbs
  maxBreadcrumbs: 50,
  
  // Send default PII
  sendDefaultPii: false,
  
  // Include local variables
  includeLocalVariables: true,
  
  // Instrumentation options
  instrumenter: 'sentry',
  
  // Profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Replay options
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 1.0,
  
  // Custom context
  initialScope: {
    tags: {
      platform: 'web',
      framework: 'nextjs',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0'
    },
    user: {
      ip_address: '{{auto}}'
    }
  }
});

// Custom error boundary
export function captureException(error: Error, context?: any) {
  Sentry.captureException(error, {
    contexts: {
      custom: context
    }
  });
}

// Custom message
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Set user context
export function setUser(user: {
  id: string;
  email?: string;
  wallet_address?: string;
  username?: string;
}) {
  Sentry.setUser(user);
}

// Set tag
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

// Set context
export function setContext(name: string, context: Record<string, any>) {
  Sentry.setContext(name, context);
}

// Add breadcrumb
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

// Performance monitoring
export function startTransaction(name: string, operation: string) {
  return Sentry.startTransaction({
    name,
    op: operation
  });
}

// Custom performance monitoring
export function monitorPerformance<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: Parameters<T>) => {
    const transaction = startTransaction(name, 'function');
    const span = transaction?.startChild({
      op: 'function.call',
      description: name
    });
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          span?.finish();
          transaction?.finish();
        });
      } else {
        span?.finish();
        transaction?.finish();
        return result;
      }
    } catch (error) {
      span?.finish();
      transaction?.finish();
      captureException(error as Error);
      throw error;
    }
  }) as T;
}

// Blockchain transaction monitoring
export function monitorBlockchainTransaction(
  transactionHash: string,
  network: 'solana' | 'ethereum',
  operation: string
) {
  const transaction = startTransaction(`Blockchain ${operation}`, 'blockchain');
  const span = transaction?.startChild({
    op: 'blockchain.transaction',
    description: `${network} ${operation}`,
    data: {
      transaction_hash: transactionHash,
      network,
      operation
    }
  });
  
  return {
    finish: (success: boolean = true) => {
      span?.setStatus(success ? 'ok' : 'error');
      span?.finish();
      transaction?.finish();
    },
    setError: (error: Error) => {
      span?.setStatus('error');
      span?.setData('error', error.message);
      span?.finish();
      transaction?.finish();
      captureException(error);
    }
  };
}

// API call monitoring
export function monitorAPICall(
  endpoint: string,
  method: string,
  statusCode?: number
) {
  const transaction = startTransaction(`API ${method} ${endpoint}`, 'http');
  const span = transaction?.startChild({
    op: 'http.request',
    description: `${method} ${endpoint}`,
    data: {
      url: endpoint,
      method,
      status_code: statusCode
    }
  });
  
  return {
    finish: (success: boolean = true) => {
      span?.setStatus(success ? 'ok' : 'error');
      span?.finish();
      transaction?.finish();
    },
    setError: (error: Error) => {
      span?.setStatus('error');
      span?.setData('error', error.message);
      span?.finish();
      transaction?.finish();
      captureException(error);
    }
  };
}

// Wallet connection monitoring
export function monitorWalletConnection(walletType: string) {
  const transaction = startTransaction(`Wallet Connection`, 'wallet');
  const span = transaction?.startChild({
    op: 'wallet.connect',
    description: `Connect to ${walletType}`,
    data: {
      wallet_type: walletType
    }
  });
  
  return {
    finish: (success: boolean = true) => {
      span?.setStatus(success ? 'ok' : 'error');
      span?.finish();
      transaction?.finish();
    },
    setError: (error: Error) => {
      span?.setStatus('error');
      span?.setData('error', error.message);
      span?.finish();
      transaction?.finish();
      captureException(error);
    }
  };
}

// NFT minting monitoring
export function monitorNFTMint(tokenId: string, collection: string) {
  const transaction = startTransaction(`NFT Mint`, 'nft');
  const span = transaction?.startChild({
    op: 'nft.mint',
    description: `Mint NFT ${tokenId}`,
    data: {
      token_id: tokenId,
      collection
    }
  });
  
  return {
    finish: (success: boolean = true) => {
      span?.setStatus(success ? 'ok' : 'error');
      span?.finish();
      transaction?.finish();
    },
    setError: (error: Error) => {
      span?.setStatus('error');
      span?.setData('error', error.message);
      span?.finish();
      transaction?.finish();
      captureException(error);
    }
  };
}

// Staking monitoring
export function monitorStaking(amount: string, pool: string) {
  const transaction = startTransaction(`Staking`, 'staking');
  const span = transaction?.startChild({
    op: 'staking.stake',
    description: `Stake ${amount} in ${pool}`,
    data: {
      amount,
      pool
    }
  });
  
  return {
    finish: (success: boolean = true) => {
      span?.setStatus(success ? 'ok' : 'error');
      span?.finish();
      transaction?.finish();
    },
    setError: (error: Error) => {
      span?.setStatus('error');
      span?.setData('error', error.message);
      span?.finish();
      transaction?.finish();
      captureException(error);
    }
  };
}

export default Sentry; 