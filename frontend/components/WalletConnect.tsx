'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
// Type definition for WalletAdapter
interface WalletAdapter {
  name: string;
  icon: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
}

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
  const { isConnected, isConnecting, connect, disconnect } = useWeb3();
  const [isHovered, setIsHovered] = useState(false);

  // Mock wallet info for development
  const wallet = {
    name: 'Demo Wallet',
    publicKey: 'demo-public-key-123'
  };

  useEffect(() => {
    if (isConnected && wallet) {
      if (onConnect) {
        onConnect(wallet.publicKey);
      }
    } else if (!isConnected && onDisconnect) {
      onDisconnect();
    }
  }, [isConnected, wallet, onConnect, onDisconnect]);

  const handleDisconnect = async () => {
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

  const { name, publicKey } = wallet;

  if (isConnected && publicKey) {
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
          disabled={isConnecting}
        >
          {isConnecting ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className={`wallet-connect ${className}`}>
      <button
        onClick={connect}
        disabled={isConnecting}
        className="connect-btn"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default WalletConnect;
