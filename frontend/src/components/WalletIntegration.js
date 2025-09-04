import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import metamaskService from '../services/metamaskService';
import phantomService from '../services/phantomService';

const WalletIntegration = () => {
  const [metamaskStatus, setMetamaskStatus] = useState({
    installed: false,
    connected: false,
    account: null,
    balance: null,
    chainId: null
  });

  const [phantomStatus, setPhantomStatus] = useState({
    installed: false,
    connected: false,
    publicKey: null,
    balance: null
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkWalletStatus();
  }, []);

  // Verificar status das wallets
  const checkWalletStatus = async () => {
    // MetaMask
    const metamaskInstalled = metamaskService.isMetamaskInstalled();
    if (metamaskInstalled) {
      const accounts = await metamaskService.getAccounts();
      const connected = accounts.length > 0;
      
      setMetamaskStatus(prev => ({
        ...prev,
        installed: metamaskInstalled,
        connected,
        account: connected ? accounts[0] : null
      }));

      if (connected) {
        try {
          const balance = await metamaskService.getBalance();
          const chainId = await metamaskService.getChainId();
          setMetamaskStatus(prev => ({
            ...prev,
            balance,
            chainId
          }));
        } catch (error) {
          console.error('Erro ao obter dados do MetaMask:', error);
        }
      }
    } else {
      setMetamaskStatus(prev => ({
        ...prev,
        installed: false
      }));
    }

    // Phantom
    const phantomInstalled = phantomService.isPhantomInstalled();
    if (phantomInstalled) {
      const status = phantomService.getConnectionStatus();
      
      setPhantomStatus(prev => ({
        ...prev,
        installed: phantomInstalled,
        connected: status.connected,
        publicKey: status.publicKey
      }));

      if (status.connected) {
        try {
          const balance = await phantomService.getBalance();
          setPhantomStatus(prev => ({
            ...prev,
            balance
          }));
        } catch (error) {
          console.error('Erro ao obter dados do Phantom:', error);
        }
      }
    } else {
      setPhantomStatus(prev => ({
        ...prev,
        installed: false
      }));
    }
  };

  // Conectar MetaMask
  const connectMetamask = async () => {
    setLoading(true);
    try {
      const result = await metamaskService.connect();
      setMetamaskStatus(prev => ({
        ...prev,
        connected: true,
        account: result.account,
        chainId: result.chainId
      }));

      // Obter saldo
      const balance = await metamaskService.getBalance();
      setMetamaskStatus(prev => ({
        ...prev,
        balance
      }));

    } catch (error) {
      console.error('Erro ao conectar MetaMask:', error);
    } finally {
      setLoading(false);
    }
  };

  // Desconectar MetaMask
  const disconnectMetamask = () => {
    metamaskService.disconnect();
    setMetamaskStatus(prev => ({
      ...prev,
      connected: false,
      account: null,
      balance: null,
      chainId: null
    }));
  };

  // Conectar Phantom
  const connectPhantom = async () => {
    setLoading(true);
    try {
      const result = await phantomService.connect();
      setPhantomStatus(prev => ({
        ...prev,
        connected: true,
        publicKey: result.publicKey
      }));

      // Obter saldo
      const balance = await phantomService.getBalance();
      setPhantomStatus(prev => ({
        ...prev,
        balance
      }));

    } catch (error) {
      console.error('Erro ao conectar Phantom:', error);
    } finally {
      setLoading(false);
    }
  };

  // Desconectar Phantom
  const disconnectPhantom = () => {
    phantomService.disconnect();
    setPhantomStatus(prev => ({
      ...prev,
      connected: false,
      publicKey: null,
      balance: null
    }));
  };

  // Copiar endereço
  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formatar endereço
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Obter nome da rede
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 137: return 'Polygon';
      case 56: return 'BSC';
      case 42161: return 'Arbitrum';
      default: return `Chain ID: ${chainId}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-agro mb-4">
          Wallet Integration
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Conecte suas wallets MetaMask e Phantom para acessar funcionalidades Web3 
          e realizar transações cripto de forma segura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MetaMask Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">MetaMask</h3>
                <p className="text-white/60 text-sm">Ethereum & EVM Chains</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {metamaskStatus.installed ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>

          {!metamaskStatus.installed ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">MetaMask não instalado</h4>
              <p className="text-white/60 mb-4">
                Instale a extensão MetaMask para conectar sua wallet Ethereum.
              </p>
              <motion.a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Instalar MetaMask
              </motion.a>
            </div>
          ) : metamaskStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Endereço:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyAddress(metamaskStatus.account)}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {copied ? 'Copiado!' : formatAddress(metamaskStatus.account)}
                    </span>
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Saldo:</span>
                  <span className="text-white font-semibold">
                    {metamaskStatus.balance ? `${parseFloat(metamaskStatus.balance).toFixed(4)} ETH` : 'Carregando...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Rede:</span>
                  <span className="text-white font-semibold">
                    {metamaskStatus.chainId ? getNetworkName(metamaskStatus.chainId) : 'Carregando...'}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectMetamask}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Desconectar MetaMask
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Conectar MetaMask</h4>
              <p className="text-white/60 mb-4">
                Clique no botão abaixo para conectar sua wallet MetaMask.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectMetamask}
                disabled={loading}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Conectando...' : 'Conectar MetaMask'}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Phantom Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Phantom</h3>
                <p className="text-white/60 text-sm">Solana Blockchain</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {phantomStatus.installed ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>

          {!phantomStatus.installed ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Phantom não instalado</h4>
              <p className="text-white/60 mb-4">
                Instale a extensão Phantom para conectar sua wallet Solana.
              </p>
              <motion.a
                href="https://phantom.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Instalar Phantom
              </motion.a>
            </div>
          ) : phantomStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Endereço:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyAddress(phantomStatus.publicKey)}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {copied ? 'Copiado!' : formatAddress(phantomStatus.publicKey)}
                    </span>
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Saldo:</span>
                  <span className="text-white font-semibold">
                    {phantomStatus.balance ? `${parseFloat(phantomStatus.balance).toFixed(4)} SOL` : 'Carregando...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Rede:</span>
                  <span className="text-white font-semibold">Solana Mainnet</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectPhantom}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Desconectar Phantom
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Conectar Phantom</h4>
              <p className="text-white/60 mb-4">
                Clique no botão abaixo para conectar sua wallet Phantom.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectPhantom}
                disabled={loading}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Conectando...' : 'Conectar Phantom'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Status das Wallets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-emerald mb-2">
              {metamaskStatus.installed ? '✅' : '❌'}
            </div>
            <div className="text-white/60">MetaMask</div>
            <div className="text-sm text-white/40">
              {metamaskStatus.installed ? 'Instalado' : 'Não instalado'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-emerald mb-2">
              {phantomStatus.installed ? '✅' : '❌'}
            </div>
            <div className="text-white/60">Phantom</div>
            <div className="text-sm text-white/40">
              {phantomStatus.installed ? 'Instalado' : 'Não instalado'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-emerald mb-2">
              {(metamaskStatus.connected || phantomStatus.connected) ? '🔗' : '🔌'}
            </div>
            <div className="text-white/60">Conexão</div>
            <div className="text-sm text-white/40">
              {(metamaskStatus.connected || phantomStatus.connected) ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletIntegration;
