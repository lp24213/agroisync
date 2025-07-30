import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'agrotm.com'],
    }),
  ],
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    return event
  },
})

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