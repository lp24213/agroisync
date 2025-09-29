import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Link,
  Unlink,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Shield,
  CheckCircle,
  Copy
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

  const handleStatusUpdate = useCallback(status => {
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

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setSuccess('Copiado para a área de transferência!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const openExplorer = address => {
    const network = connectionStatus.currentNetwork;
    if (network && network.explorer) {
      window.open(`${network.explorer}/address/${address}`, '_blank');
    }
  };

  const getNetworkIcon = networkName => {
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

  const getNetworkColor = networkName => {
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

  const formatAddress = address => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance, symbol) => {
    if (balance === null || balance === undefined) return '0.00';
    return `${parseFloat(balance).toFixed(4)} ${symbol}`;
  };

  const renderNotConnected = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6 text-center'>
      <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
        <Wallet className='h-12 w-12 text-gray-400' />
      </div>

      <div>
        <h3 className='mb-2 text-xl font-semibold text-gray-900'>Conecte sua Carteira Web3</h3>
        <p className='text-gray-600'>Conecte sua carteira Metamask para acessar funcionalidades DeFi e cripto</p>
      </div>

      {!connectionStatus.metamaskAvailable && (
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center space-x-2'>
            <AlertTriangle className='h-5 w-5 text-yellow-600' />
            <span className='font-medium text-yellow-800'>Metamask não encontrado</span>
          </div>
          <p className='mt-1 text-sm text-yellow-700'>Instale a extensão Metamask para continuar</p>
          <a
            href='https://metamask.io/download/'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-2 inline-flex items-center space-x-1 text-sm text-yellow-800 hover:text-yellow-900'
          >
            <span>Baixar Metamask</span>
            <ExternalLink className='h-4 w-4' />
          </a>
        </div>
      )}

      <button
        onClick={handleConnectWallet}
        disabled={loading || !connectionStatus.metamaskAvailable}
        className='mx-auto flex items-center space-x-2 rounded-lg bg-emerald-600 px-8 py-3 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Link className='h-5 w-5' />}
        <span>{loading ? 'Conectando...' : 'Conectar Carteira'}</span>
      </button>

      <div className='rounded-lg bg-gray-50 p-4'>
        <h4 className='mb-2 font-medium text-gray-900'>Funcionalidades disponíveis:</h4>
        <ul className='space-y-1 text-sm text-gray-600'>
          <li>• Visualizar saldo da carteira</li>
          <li>• Operações DeFi (compra, venda, staking)</li>
          <li>• Integração com múltiplas redes</li>
          <li>• Histórico de transações</li>
        </ul>
      </div>
    </motion.div>
  );

  const renderConnected = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      {/* Header da Carteira */}
      <div className='rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20'>
              <Wallet className='h-6 w-6' />
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Carteira Conectada</h3>
              <p className='text-sm text-emerald-100'>{connectionStatus.currentNetwork?.name || 'Rede desconhecida'}</p>
            </div>
          </div>

          <button
            onClick={handleDisconnectWallet}
            className='rounded-lg p-2 transition-colors hover:bg-white hover:bg-opacity-20'
            title='Desconectar'
          >
            <Unlink className='h-5 w-5' />
          </button>
        </div>

        {/* Saldo */}
        {walletBalance && (
          <div className='text-center'>
            <p className='mb-1 text-sm text-emerald-100'>Saldo disponível</p>
            <p className='text-2xl font-bold'>{formatBalance(walletBalance.balance, walletBalance.symbol)}</p>
          </div>
        )}
      </div>

      {/* Informações da Conta */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h4 className='mb-4 font-semibold text-gray-900'>Informações da Conta</h4>

        <div className='space-y-4'>
          {/* Endereço */}
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Endereço:</span>
            <div className='flex items-center space-x-2'>
              <code className='rounded bg-gray-100 px-3 py-1 font-mono text-sm'>
                {formatAddress(connectionStatus.currentAccount)}
              </code>
              <button
                onClick={() => copyToClipboard(connectionStatus.currentAccount)}
                className='p-1 text-gray-400 transition-colors hover:text-gray-600'
                title='Copiar endereço'
              >
                <Copy className='h-4 w-4' />
              </button>
              <button
                onClick={() => openExplorer(connectionStatus.currentAccount)}
                className='p-1 text-gray-400 transition-colors hover:text-gray-600'
                title='Ver no explorador'
              >
                <ExternalLink className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Rede */}
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Rede:</span>
            <div className='flex items-center space-x-2'>
              <span className={`font-medium ${getNetworkColor(connectionStatus.currentNetwork?.name)}`}>
                {getNetworkIcon(connectionStatus.currentNetwork?.name)}
                {connectionStatus.currentNetwork?.name}
              </span>
            </div>
          </div>

          {/* Chain ID */}
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Chain ID:</span>
            <span className='rounded bg-gray-100 px-2 py-1 font-mono text-sm'>
              {connectionStatus.currentNetwork?.chainId || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h4 className='mb-4 font-semibold text-gray-900'>Ações Rápidas</h4>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <button
            onClick={loadWalletBalance}
            className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50'
          >
            <RefreshCw className='h-5 w-5 text-emerald-600' />
            <div className='text-left'>
              <div className='font-medium text-gray-900'>Atualizar Saldo</div>
              <div className='text-sm text-gray-500'>Sincronizar com a blockchain</div>
            </div>
          </button>

          <button
            onClick={() => window.open('https://metamask.io/', '_blank')}
            className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50'
          >
            <Shield className='h-5 w-5 text-blue-600' />
            <div className='text-left'>
              <div className='font-medium text-gray-900'>Gerenciar Carteira</div>
              <div className='text-sm text-gray-500'>Abrir Metamask</div>
            </div>
          </button>
        </div>
      </div>

      {/* Status de Segurança */}
      <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
        <div className='flex items-center space-x-2'>
          <CheckCircle className='h-5 w-5 text-green-600' />
          <span className='font-medium text-green-900'>Carteira Segura</span>
        </div>
        <p className='mt-1 text-sm text-green-700'>
          Sua carteira está conectada e segura. As chaves privadas permanecem em seu dispositivo.
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className='mx-auto max-w-2xl'>
      {/* Mensagens de Status */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4'
          >
            <div className='flex items-center space-x-2'>
              <XCircle className='h-5 w-5 text-red-600' />
              <span className='font-medium text-red-800'>Erro</span>
            </div>
            <p className='mt-1 text-sm text-red-700'>{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='mb-6 rounded-lg border border-green-200 bg-green-50 p-4'
          >
            <div className='flex items-center space-x-2'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              <span className='font-medium text-green-800'>Sucesso</span>
            </div>
            <p className='mt-1 text-sm text-green-700'>{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {connectionStatus.isConnected ? renderConnected() : renderNotConnected()}
    </div>
  );
};

export default Web3Wallet;
