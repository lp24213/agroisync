'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWeb3 } from '../../contexts/Web3Context';
import { 
  Wallet, 
  ChevronDown, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  Settings,
  LogOut
} from 'lucide-react';

interface WalletConnectProps {
  className?: string;
  variant?: 'default' | 'compact' | 'full';
}

export function WalletConnect({ className = '', variant = 'default' }: WalletConnectProps) {
  const { connected: solanaConnected, wallet, disconnect: disconnectSolana } = useWallet();
  const { isConnected: ethConnected, account: ethAccount, connect: connectEth, disconnect: disconnectEth } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeChain, setActiveChain] = useState<'solana' | 'ethereum' | null>(null);

  useEffect(() => {
    if (solanaConnected) {
      setActiveChain('solana');
    } else if (ethConnected) {
      setActiveChain('ethereum');
    } else {
      setActiveChain(null);
    }
  }, [solanaConnected, ethConnected]);

  const handleCopyAddress = async () => {
    const address = solanaConnected ? wallet?.adapter.publicKey?.toString() : ethAccount;
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const handleDisconnect = () => {
    if (solanaConnected) {
      disconnectSolana();
    } else if (ethConnected) {
      disconnectEth();
    }
    setIsOpen(false);
  };

  const getShortAddress = (address: string | null | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (address: string | null | undefined, chain: 'solana' | 'ethereum') => {
    if (!address) return '#';
    if (chain === 'solana') {
      return `https://solscan.io/account/${address}`;
    } else {
      return `https://etherscan.io/address/${address}`;
    }
  };

  const getChainIcon = (chain: 'solana' | 'ethereum') => {
    return chain === 'solana' ? '🟣' : '🔷';
  };

  const getChainName = (chain: 'solana' | 'ethereum') => {
    return chain === 'solana' ? 'Solana' : 'Ethereum';
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        {!solanaConnected && !ethConnected ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">Connect</span>
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-white">
              {solanaConnected 
                ? getShortAddress(wallet?.adapter.publicKey?.toString())
                : getShortAddress(ethAccount)
              }
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 z-50"
            >
              <WalletMenuContent
                solanaConnected={solanaConnected}
                ethConnected={ethConnected}
                wallet={wallet}
                ethAccount={ethAccount}
                activeChain={activeChain}
                onCopyAddress={handleCopyAddress}
                onDisconnect={handleDisconnect}
                onClose={() => setIsOpen(false)}
                copied={copied}
                getShortAddress={getShortAddress}
                getExplorerUrl={getExplorerUrl}
                getChainIcon={getChainIcon}
                getChainName={getChainName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant
  if (variant === 'full') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400 text-sm">Choose your preferred blockchain network</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Solana Wallet */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🟣</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Solana</h4>
                  <p className="text-xs text-gray-400">Fast & low-cost transactions</p>
                </div>
              </div>
              {solanaConnected && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
            
            {solanaConnected ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-xs text-gray-400">Connected</span>
                  <span className="text-xs text-white font-mono">
                    {getShortAddress(wallet?.adapter.publicKey?.toString())}
                  </span>
                </div>
                <button
                  onClick={disconnectSolana}
                  className="w-full px-3 py-2 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <WalletMultiButton className="w-full btn-primary" />
            )}
          </div>

          {/* Ethereum Wallet */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔷</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Ethereum</h4>
                  <p className="text-xs text-gray-400">Wide ecosystem support</p>
                </div>
              </div>
              {ethConnected && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
            
            {ethConnected ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-xs text-gray-400">Connected</span>
                  <span className="text-xs text-white font-mono">
                    {getShortAddress(ethAccount)}
                  </span>
                </div>
                <button
                  onClick={disconnectEth}
                  className="w-full px-3 py-2 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectEth}
                className="w-full btn-primary"
              >
                Connect MetaMask
              </button>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {(solanaConnected || ethConnected) && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                Connected to {activeChain ? getChainName(activeChain) : 'wallet'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      {!solanaConnected && !ethConnected ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-3 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-white">
              {solanaConnected 
                ? getShortAddress(wallet?.adapter.publicKey?.toString())
                : getShortAddress(ethAccount)
              }
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 z-50"
            >
              <WalletMenuContent
                solanaConnected={solanaConnected}
                ethConnected={ethConnected}
                wallet={wallet}
                ethAccount={ethAccount}
                activeChain={activeChain}
                onCopyAddress={handleCopyAddress}
                onDisconnect={handleDisconnect}
                onClose={() => setIsOpen(false)}
                copied={copied}
                getShortAddress={getShortAddress}
                getExplorerUrl={getExplorerUrl}
                getChainIcon={getChainIcon}
                getChainName={getChainName}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface WalletMenuContentProps {
  solanaConnected: boolean;
  ethConnected: boolean;
  wallet: any;
  ethAccount: string | null;
  activeChain: 'solana' | 'ethereum' | null;
  onCopyAddress: () => void;
  onDisconnect: () => void;
  onClose: () => void;
  copied: boolean;
  getShortAddress: (address: string | null | undefined) => string;
  getExplorerUrl: (address: string | null | undefined, chain: 'solana' | 'ethereum') => string;
  getChainIcon: (chain: 'solana' | 'ethereum') => string;
  getChainName: (chain: 'solana' | 'ethereum') => string;
}

function WalletMenuContent({
  solanaConnected,
  ethConnected,
  wallet,
  ethAccount,
  activeChain,
  onCopyAddress,
  onDisconnect,
  onClose,
  copied,
  getShortAddress,
  getExplorerUrl,
  getChainIcon,
  getChainName
}: WalletMenuContentProps) {
  const address = solanaConnected ? wallet?.adapter.publicKey?.toString() : ethAccount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Wallet</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Connection Status */}
      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">
            Connected to {activeChain ? getChainName(activeChain) : 'wallet'}
          </span>
        </div>
      </div>

      {/* Address */}
      {address && (
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Address</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs">{getChainIcon(activeChain || 'solana')}</span>
              <span className="text-xs text-gray-400">{getChainName(activeChain || 'solana')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-white">{getShortAddress(address)}</span>
            <button
              onClick={onCopyAddress}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <a
          href={address ? getExplorerUrl(address, activeChain || 'solana') : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on Explorer</span>
        </a>
        
        <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Disconnect */}
      <div className="pt-2 border-t border-white/10">
        <button
          onClick={onDisconnect}
          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
} 