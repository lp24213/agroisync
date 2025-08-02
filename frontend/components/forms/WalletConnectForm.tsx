'use client';

import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWeb3 } from '@/hooks/useWeb3';
import { cn } from '@/lib/utils';

/**
 * WalletConnectForm Component - Premium wallet connection interface
 * 
 * @description A comprehensive wallet connection form with support for multiple
 * Solana wallets, animated transitions, and enhanced user experience.
 * 
 * @features
 * - Multi-wallet support (Phantom, Solflare, Slope, etc.)
 * - Animated connection states
 * - Error handling with user-friendly messages
 * - Connection status indicators
 * - Responsive design
 * - Performance optimized with React.memo
 * - TypeScript strict typing
 * - Accessibility compliant
 */

type WalletProvider = {
  name: string;
  icon: string;
  description: string;
  isInstalled?: boolean;
  downloadUrl?: string;
};

interface WalletConnectFormProps {
  /** Callback when wallet is successfully connected */
  onConnect?: (publicKey: string) => void;
  /** Callback when wallet is disconnected */
  onDisconnect?: () => void;
  /** Callback when connection fails */
  onError?: (error: Error) => void;
  /** Whether to show wallet selection */
  showWalletSelection?: boolean;
  /** Custom title for the form */
  title?: string;
  /** Custom description for the form */
  description?: string;
}

const WalletConnectForm = memo(({
  onConnect,
  onDisconnect,
  onError,
  showWalletSelection = true,
  title,
  description
}: WalletConnectFormProps = {}) => {
  const { isConnected, isConnecting, connect, disconnect, publicKey, error } = useWeb3();
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  // Supported wallets configuration
  const supportedWallets: WalletProvider[] = [
    {
      name: 'Phantom',
      icon: '👻',
      description: 'A friendly Solana wallet built for DeFi & NFTs',
      downloadUrl: 'https://phantom.app/'
    },
    {
      name: 'Solflare',
      icon: '☀️',
      description: 'Solflare is a non-custodial wallet for Solana',
      downloadUrl: 'https://solflare.com/'
    },
    {
      name: 'Slope',
      icon: '📱',
      description: 'Slope is a community-built wallet for Solana',
      downloadUrl: 'https://slope.finance/'
    },
    {
      name: 'Glow',
      icon: '✨',
      description: 'Simple and secure Solana wallet',
      downloadUrl: 'https://glow.app/'
    }
  ];

  // Handle wallet connection
  const handleConnect = useCallback(async (walletName?: string) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      const errorObj = error instanceof Error ? error : new Error('Erro ao conectar carteira');
      onError?.(errorObj);
    }
  }, [connect, onError]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(() => {
    disconnect();
    onDisconnect?.();
  }, [disconnect, onDisconnect]);

  // Handle successful connection
  useEffect(() => {
    if (isConnected && publicKey) {
      onConnect?.(publicKey);
    }
  }, [isConnected, publicKey, onConnect]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  }, [publicKey]);

  // Format public key for display
  const formatPublicKey = useCallback((key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }, []);

  // Connected state
  if (isConnected && publicKey) {
    return (
      <Card className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-agro-secondary to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
              <motion.span 
                className="text-white text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ✓
              </motion.span>
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <span className="text-white text-xs">🔗</span>
            </motion.div>
          </motion.div>

          {/* Connected Status */}
          <div>
            <motion.h2 
              className="text-2xl font-bold text-agro-light mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Carteira Conectada
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <button
                onClick={copyAddress}
                className="group px-4 py-2 bg-agro-dark/50 rounded-lg border border-agro-primary/20 hover:border-agro-primary/40 transition-all duration-200"
              >
                <p className="text-agro-light/80 text-sm group-hover:text-agro-light transition-colors">
                  {formatPublicKey(publicKey)}
                </p>
                <p className="text-agro-light/50 text-xs mt-1 group-hover:text-agro-light/70 transition-colors">
                  Clique para copiar
                </p>
              </button>
            </motion.div>
          </div>

          {/* Wallet Details Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="mb-4"
            >
              {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-agro-dark/30 rounded-lg border border-agro-primary/10 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-agro-light/60">Endereço Completo:</span>
                    </div>
                    <p className="text-agro-light font-mono text-xs break-all bg-agro-dark/50 p-2 rounded">
                      {publicKey}
                    </p>
                    <div className="flex justify-between">
                      <span className="text-agro-light/60">Status:</span>
                      <span className="text-agro-secondary font-semibold">Conectado</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Disconnect Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="w-full"
            >
              Desconectar Carteira
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    );
  }

  // Connection state
  return (
    <Card className="max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        {/* Connection Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-agro-primary to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-agro-primary/25">
            <motion.span 
              className="text-white text-3xl"
              animate={isConnecting ? { rotate: 360 } : {}}
              transition={isConnecting ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            >
              {isConnecting ? '⏳' : '🔗'}
            </motion.span>
          </div>
        </motion.div>

        {/* Title and Description */}
        <div>
          <motion.h2 
            className="text-2xl font-bold text-agro-light mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title || 'Conectar Carteira'}
          </motion.h2>
          <motion.p 
            className="text-agro-light/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {description || 'Conecte sua carteira Solana para começar a usar a plataforma'}
          </motion.p>
        </div>

        {/* Wallet Selection */}
        {showWalletSelection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <p className="text-sm text-agro-light/70 mb-3">Escolha sua carteira:</p>
            <div className="grid grid-cols-2 gap-3">
              {supportedWallets.map((wallet, index) => (
                <motion.button
                  key={wallet.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleConnect(wallet.name.toLowerCase())}
                  disabled={isConnecting}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-200',
                    'hover:border-agro-primary/50 hover:bg-agro-primary/5',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    selectedWallet === wallet.name.toLowerCase() 
                      ? 'border-agro-primary bg-agro-primary/10' 
                      : 'border-agro-light/20 bg-agro-dark/30'
                  )}
                >
                  <div className="text-2xl mb-1">{wallet.icon}</div>
                  <div className="text-sm font-medium text-agro-light">{wallet.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Connect Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleConnect()}
            loading={isConnecting}
            loadingText="Conectando..."
            disabled={isConnecting}
            fullWidth
            className="font-semibold"
          >
            {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
          </Button>
        </motion.div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Supported Wallets Info */}
        <motion.div 
          className="text-xs text-agro-light/50 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Carteiras suportadas:</p>
          <div className="flex justify-center gap-3">
            {supportedWallets.map((wallet) => (
              <span key={wallet.name} className="flex items-center gap-1">
                <span>{wallet.icon}</span>
                <span>{wallet.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
});

WalletConnectForm.displayName = 'WalletConnectForm';

export { WalletConnectForm };
export type { WalletConnectFormProps, WalletProvider };