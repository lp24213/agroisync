'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Button } from '../ui/Button';
import { Copy, CheckCircle, ExternalLink } from 'lucide-react';

interface WalletConnectFormProps {
  /** Callback when wallet is connected */
  onConnect?: (publicKey: string) => void;
  /** Callback when wallet is disconnected */
  onDisconnect?: () => void;
  /** Custom className */
  className?: string;
  /** Show disconnect button */
  showDisconnect?: boolean;
}

export const WalletConnectForm: React.FC<WalletConnectFormProps> = ({
  onConnect,
  onDisconnect,
  className = '',
  showDisconnect = true,
}) => {
  const { isConnected, isConnecting, connect, disconnect, publicKey, error } = useWeb3();
  const [copied, setCopied] = useState(false);

  // Safe type checking for publicKey
  const isPublicKeyValid = (key: any): key is string => {
    return typeof key === 'string' && key.length > 0;
  };

  useEffect(() => {
    if (isConnected && publicKey && isPublicKeyValid(publicKey)) {
      onConnect?.(publicKey);
    }
  }, [isConnected, publicKey, onConnect]);

  const handleCopyAddress = useCallback(async () => {
    if (publicKey && isPublicKeyValid(publicKey)) {
      try {
        await navigator.clipboard.writeText(publicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  }, [publicKey]);

  const formatPublicKey = useCallback((key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onDisconnect?.();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  if (isConnected && publicKey && isPublicKeyValid(publicKey)) {
    return (
      <div className={`wallet-connected-form ${className}`}>
        <div className="wallet-info">
          <div className="connection-status">
            <div className="status-indicator connected" />
            <span className="status-text">Connected</span>
          </div>
          
          <div className="address-section">
            <span className="address-label">Address:</span>
            <span className="address-value">{formatPublicKey(publicKey)}</span>
            <button
              onClick={handleCopyAddress}
              className="copy-button"
              title="Copy address"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="actions">
            <a
              href={`https://solscan.io/account/${publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </a>

            {showDisconnect && (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="disconnect-button"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wallet-connect-form ${className}`}>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="connect-button"
        size="lg"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      
      {error && (
        <div className="error-message">
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnectForm;