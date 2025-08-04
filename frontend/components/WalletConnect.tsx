'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapter } from '../types/web3';

interface WalletConnectProps {
  onConnect?: (publicKey: string) => void;
  onDisconnect?: () => void;
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  className = '',
}) => {
  const { wallet, connected, connecting, connect, disconnect } = useWallet();
  const [isHovered, setIsHovered] = useState(false);

  // Safe type checking for wallet
  const isWalletValid = (wallet: any): wallet is WalletAdapter => {
    return wallet && 
           typeof wallet === 'object' && 
           'publicKey' in wallet &&
           'connected' in wallet &&
           'connecting' in wallet;
  };

  // Safe public key access
  const getPublicKeyString = (wallet: any): string | null => {
    if (isWalletValid(wallet) && 
        wallet.publicKey && 
        typeof wallet.publicKey.toString === 'function') {
      return wallet.publicKey.toString();
    }
    return null;
  };

  useEffect(() => {
    if (connected && wallet) {
      const publicKey = getPublicKeyString(wallet);
      if (publicKey && onConnect) {
        onConnect(publicKey);
      }
    } else if (!connected && onDisconnect) {
      onDisconnect();
    }
  }, [connected, wallet, onConnect, onDisconnect, getPublicKeyString]);

  const handleDisconnect = async () => {
    if (!wallet || !isWalletValid(wallet)) {
      console.error('Invalid wallet');
      return;
    }

    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatPublicKey = (publicKey: string): string => {
    if (publicKey.length <= 8) return publicKey;
    return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
  };

  const getWalletInfo = () => {
    if (!wallet || !isWalletValid(wallet)) {
      return { name: 'Unknown Wallet', publicKey: null };
    }

    const publicKey = getPublicKeyString(wallet);
    return {
      name: wallet.name || 'Unknown Wallet',
      publicKey: publicKey ? formatPublicKey(publicKey) : null,
    };
  };

  const { name, publicKey } = getWalletInfo();

  if (connected && publicKey) {
    return (
      <div className={`wallet-connected ${className}`}>
        <div className="wallet-info">
          <span className="wallet-name">{name}</span>
          <span className="wallet-address">{publicKey}</span>
        </div>
        <button
          onClick={handleDisconnect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`disconnect-btn ${isHovered ? 'hovered' : ''}`}
          disabled={connecting}
        >
          {connecting ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className={`wallet-connect ${className}`}>
      <WalletMultiButton
        disabled={connecting}
        className="connect-btn"
      >
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </WalletMultiButton>
    </div>
  );
};

export default WalletConnect;
