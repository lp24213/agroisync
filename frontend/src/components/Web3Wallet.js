import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Link, Unlink, Copy, ExternalLink, 
  RefreshCw, Shield,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const Web3Wallet = () => {
  const [connectionStatus, setConnectionStatus] = useState({});
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Verificar status inicial
    updateConnectionStatus();
    
    // Inscrever para atualizações
    const unsubscribe = cryptoService.subscribe(handleStatusUpdate);
    
    return () => unsubscribe();
  }, [handleStatusUpdate]);

  const updateConnectionStatus = () => {
    const status = cryptoService.getConnectionStatus();
    setConnectionStatus(status);
  };

  const handleStatusUpdate = useCallback((status) => {
    setConnectionStatus(status);
    if (status.isConnected) {
      loadWalletBalance();
    } else {
      setWalletBalance(null);
    }
  }, []);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await cryptoService.connectWallet();
      if (result.success) {
        setSuccess('Carteira conectada com sucesso!');
        await loadWalletBalance();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    cryptoService.disconnectWallet();
    setSuccess('Carteira desconectada');
    setWalletBalance(null);
  };

  const loadWalletBalance = async () => {
    if (!connectionStatus.isConnected) return;

    try {
      const balance = await cryptoService.getWalletBalance();
      if (balance.success) {
        setWalletBalance(balance);
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copiado para a área de transferência!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const openExplorer = (address) => {
    const network = connectionStatus.currentNetwork;
    if (network && network.explorer) {
      window.open(`${network.explorer}/address/${address}`, '_blank');
    }
  };

  const getNetworkIcon = (networkName) => {
    switch (networkName) {
      case 'Ethereum':
        return '🔵';
      case 'Binance Smart Chain':
        return '🟡';
      case 'Polygon':
        return '🟣';
      default:
        return '⚫';
    }
  };

  const getNetworkColor = (networkName) => {
    switch (networkName) {
      case 'Ethereum':
        return 'text-blue-600';
      case 'Binance Smart Chain':
        return 'text-yellow-600';
      case 'Polygon':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance, symbol) => {
    if (balance === null || balance === undefined) return '0.00';
    return `${parseFloat(balance).toFixed(4)} ${symbol}`;
  };

  const renderNotConnected = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
        <Wallet className="w-12 h-12 text-gray-400" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Conecte sua Carteira Web3
        </h3>
        <p className="text-gray-600">
          Conecte sua carteira Metamask para acessar funcionalidades DeFi e cripto
        </p>
      </div>

      {!connectionStatus.metamaskAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Metamask não encontrado
            </span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Instale a extensão Metamask para continuar
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-yellow-800 hover:text-yellow-900 text-sm mt-2"
          >
            <span>Baixar Metamask</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <button
        onClick={handleConnectWallet}
        disabled={loading || !connectionStatus.metamaskAvailable}
        className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
      >
        {loading ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Link className="w-5 h-5" />
        )}
        <span>
          {loading ? 'Conectando...' : 'Conectar Carteira'}
        </span>
      </button>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Funcionalidades disponíveis:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Visualizar saldo da carteira</li>
          <li>• Operações DeFi (compra, venda, staking)</li>
          <li>• Integração com múltiplas redes</li>
          <li>• Histórico de transações</li>
        </ul>
      </div>
    </motion.div>
  );

  const renderConnected = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header da Carteira */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Carteira Conectada</h3>
              <p className="text-emerald-100 text-sm">
                {connectionStatus.currentNetwork?.name || 'Rede desconhecida'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDisconnectWallet}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Desconectar"
          >
            <Unlink className="w-5 h-5" />
          </button>
        </div>

        {/* Saldo */}
        {walletBalance && (
          <div className="text-center">
            <p className="text-emerald-100 text-sm mb-1">Saldo disponível</p>
            <p className="text-2xl font-bold">
              {formatBalance(walletBalance.balance, walletBalance.symbol)}
            </p>
          </div>
        )}
      </div>

      {/* Informações da Conta */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Informações da Conta</h4>
        
        <div className="space-y-4">
          {/* Endereço */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Endereço:</span>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                {formatAddress(connectionStatus.currentAccount)}
              </code>
              <button
                onClick={() => copyToClipboard(connectionStatus.currentAccount)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copiar endereço"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => openExplorer(connectionStatus.currentAccount)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Ver no explorador"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rede */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Rede:</span>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${getNetworkColor(connectionStatus.currentNetwork?.name)}`}>
                {getNetworkIcon(connectionStatus.currentNetwork?.name)}
                {connectionStatus.currentNetwork?.name}
              </span>
            </div>
          </div>

          {/* Chain ID */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Chain ID:</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {connectionStatus.currentNetwork?.chainId || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={loadWalletBalance}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Atualizar Saldo</div>
              <div className="text-sm text-gray-500">Sincronizar com a blockchain</div>
            </div>
          </button>

          <button
            onClick={() => window.open('https://metamask.io/', '_blank')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Gerenciar Carteira</div>
              <div className="text-sm text-gray-500">Abrir Metamask</div>
            </div>
          </button>
        </div>
      </div>

      {/* Status de Segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-900">Carteira Segura</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Sua carteira está conectada e segura. As chaves privadas permanecem em seu dispositivo.
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mensagens de Status */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Erro</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Sucesso</span>
            </div>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {connectionStatus.isConnected ? renderConnected() : renderNotConnected()}
    </div>
  );
};

export default Web3Wallet;
