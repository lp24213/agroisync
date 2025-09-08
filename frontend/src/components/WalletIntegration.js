import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import metamaskService from '../services/metamaskService'
import phantomService from '../services/phantomService'

const WalletIntegration = () => {
  const [metamaskStatus, setMetamaskStatus] = useState({
    installed: false,
    connected: false,
    account: null,
    balance: null,
    chainId: null
  })

  const [phantomStatus, setPhantomStatus] = useState({
    installed: false,
    connected: false,
    publicKey: null,
    balance: null
  })

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkWalletStatus()
  }, [])

  // Verificar status das wallets
  const checkWalletStatus = async () => {
    // MetaMask
    const metamaskInstalled = metamaskService.isMetamaskInstalled()
    if (metamaskInstalled) {
      const accounts = await metamaskService.getAccounts()
      const connected = accounts.length > 0

      setMetamaskStatus(prev => ({
        ...prev,
        installed: metamaskInstalled,
        connected,
        account: connected ? accounts[0] : null
      }))

      if (connected) {
        try {
          const balance = await metamaskService.getBalance()
          const chainId = await metamaskService.getChainId()
          setMetamaskStatus(prev => ({
            ...prev,
            balance,
            chainId
          }))
        } catch (error) {
          console.error('Erro ao obter dados do MetaMask:', error)
        }
      }
    } else {
      setMetamaskStatus(prev => ({
        ...prev,
        installed: false
      }))
    }

    // Phantom
    const phantomInstalled = phantomService.isPhantomInstalled()
    if (phantomInstalled) {
      const status = phantomService.getConnectionStatus()

      setPhantomStatus(prev => ({
        ...prev,
        installed: phantomInstalled,
        connected: status.connected,
        publicKey: status.publicKey
      }))

      if (status.connected) {
        try {
          const balance = await phantomService.getBalance()
          setPhantomStatus(prev => ({
            ...prev,
            balance
          }))
        } catch (error) {
          console.error('Erro ao obter dados do Phantom:', error)
        }
      }
    } else {
      setPhantomStatus(prev => ({
        ...prev,
        installed: false
      }))
    }
  }

  // Conectar MetaMask
  const connectMetamask = async () => {
    setLoading(true)
    try {
      const result = await metamaskService.connect()
      setMetamaskStatus(prev => ({
        ...prev,
        connected: true,
        account: result.account,
        chainId: result.chainId
      }))

      // Obter saldo
      const balance = await metamaskService.getBalance()
      setMetamaskStatus(prev => ({
        ...prev,
        balance
      }))
    } catch (error) {
      console.error('Erro ao conectar MetaMask:', error)
    } finally {
      setLoading(false)
    }
  }

  // Desconectar MetaMask
  const disconnectMetamask = () => {
    metamaskService.disconnect()
    setMetamaskStatus(prev => ({
      ...prev,
      connected: false,
      account: null,
      balance: null,
      chainId: null
    }))
  }

  // Conectar Phantom
  const connectPhantom = async () => {
    setLoading(true)
    try {
      const result = await phantomService.connect()
      setPhantomStatus(prev => ({
        ...prev,
        connected: true,
        publicKey: result.publicKey
      }))

      // Obter saldo
      const balance = await phantomService.getBalance()
      setPhantomStatus(prev => ({
        ...prev,
        balance
      }))
    } catch (error) {
      console.error('Erro ao conectar Phantom:', error)
    } finally {
      setLoading(false)
    }
  }

  // Desconectar Phantom
  const disconnectPhantom = () => {
    phantomService.disconnect()
    setPhantomStatus(prev => ({
      ...prev,
      connected: false,
      publicKey: null,
      balance: null
    }))
  }

  // Copiar endereço
  const copyAddress = address => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Formatar endereço
  const formatAddress = address => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Obter nome da rede
  const getNetworkName = chainId => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet'
      case 137:
        return 'Polygon'
      case 56:
        return 'BSC'
      case 42161:
        return 'Arbitrum'
      default:
        return `Chain ID: ${chainId}`
    }
  }

  return (
    <div className='space-y-6'>
      <div className='mb-8 text-center'>
        <h2 className='text-gradient-agro mb-4 text-3xl font-bold'>Wallet Integration</h2>
        <p className='mx-auto max-w-2xl text-white/60'>
          Conecte suas wallets MetaMask e Phantom para acessar funcionalidades Web3 e realizar transações cripto de
          forma segura.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* MetaMask Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='card p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500'>
                <Wallet className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>MetaMask</h3>
                <p className='text-sm text-white/60'>Ethereum & EVM Chains</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {metamaskStatus.installed ? (
                <CheckCircle className='h-5 w-5 text-emerald-400' />
              ) : (
                <AlertCircle className='h-5 w-5 text-red-400' />
              )}
            </div>
          </div>

          {!metamaskStatus.installed ? (
            <div className='py-8 text-center'>
              <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-400' />
              <h4 className='mb-2 text-lg font-semibold text-white'>MetaMask não instalado</h4>
              <p className='mb-4 text-white/60'>Instale a extensão MetaMask para conectar sua wallet Ethereum.</p>
              <motion.a
                href='https://metamask.io/download/'
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-orange-600'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                Instalar MetaMask
              </motion.a>
            </div>
          ) : metamaskStatus.connected ? (
            <div className='space-y-4'>
              <div className='rounded-lg bg-black/30 p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Endereço:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyAddress(metamaskStatus.account)}
                    className='flex items-center space-x-1 text-emerald-400 transition-colors duration-300 hover:text-emerald-300'
                  >
                    {copied ? <CheckCircle className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                    <span className='text-sm'>{copied ? 'Copiado!' : formatAddress(metamaskStatus.account)}</span>
                  </motion.button>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Saldo:</span>
                  <span className='font-semibold text-white'>
                    {metamaskStatus.balance ? `${parseFloat(metamaskStatus.balance).toFixed(4)} ETH` : 'Carregando...'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Rede:</span>
                  <span className='font-semibold text-white'>
                    {metamaskStatus.chainId ? getNetworkName(metamaskStatus.chainId) : 'Carregando...'}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectMetamask}
                className='w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600'
              >
                Desconectar MetaMask
              </motion.button>
            </div>
          ) : (
            <div className='py-8 text-center'>
              <Wallet className='mx-auto mb-4 h-12 w-12 text-orange-400' />
              <h4 className='mb-2 text-lg font-semibold text-white'>Conectar MetaMask</h4>
              <p className='mb-4 text-white/60'>Clique no botão abaixo para conectar sua wallet MetaMask.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectMetamask}
                disabled={loading}
                className='rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors duration-300 hover:bg-orange-600 disabled:opacity-50'
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
          className='card p-6'
        >
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500'>
                <Wallet className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>Phantom</h3>
                <p className='text-sm text-white/60'>Solana Blockchain</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {phantomStatus.installed ? (
                <CheckCircle className='h-5 w-5 text-emerald-400' />
              ) : (
                <AlertCircle className='h-5 w-5 text-red-400' />
              )}
            </div>
          </div>

          {!phantomStatus.installed ? (
            <div className='py-8 text-center'>
              <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-400' />
              <h4 className='mb-2 text-lg font-semibold text-white'>Phantom não instalado</h4>
              <p className='mb-4 text-white/60'>Instale a extensão Phantom para conectar sua wallet Solana.</p>
              <motion.a
                href='https://phantom.app/'
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-600'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                Instalar Phantom
              </motion.a>
            </div>
          ) : phantomStatus.connected ? (
            <div className='space-y-4'>
              <div className='rounded-lg bg-black/30 p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Endereço:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyAddress(phantomStatus.publicKey)}
                    className='flex items-center space-x-1 text-emerald-400 transition-colors duration-300 hover:text-emerald-300'
                  >
                    {copied ? <CheckCircle className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                    <span className='text-sm'>{copied ? 'Copiado!' : formatAddress(phantomStatus.publicKey)}</span>
                  </motion.button>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Saldo:</span>
                  <span className='font-semibold text-white'>
                    {phantomStatus.balance ? `${parseFloat(phantomStatus.balance).toFixed(4)} SOL` : 'Carregando...'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-white/60'>Rede:</span>
                  <span className='font-semibold text-white'>Solana Mainnet</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectPhantom}
                className='w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600'
              >
                Desconectar Phantom
              </motion.button>
            </div>
          ) : (
            <div className='py-8 text-center'>
              <Wallet className='mx-auto mb-4 h-12 w-12 text-purple-400' />
              <h4 className='mb-2 text-lg font-semibold text-white'>Conectar Phantom</h4>
              <p className='mb-4 text-white/60'>Clique no botão abaixo para conectar sua wallet Phantom.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectPhantom}
                disabled={loading}
                className='rounded-lg bg-purple-500 px-6 py-3 text-white transition-colors duration-300 hover:bg-purple-600 disabled:opacity-50'
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
        className='card p-6'
      >
        <h3 className='mb-4 text-xl font-bold text-white'>Status das Wallets</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-2xl font-bold'>
              {metamaskStatus.installed ? '✅' : '❌'}
            </div>
            <div className='text-white/60'>MetaMask</div>
            <div className='text-sm text-white/40'>{metamaskStatus.installed ? 'Instalado' : 'Não instalado'}</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-2xl font-bold'>{phantomStatus.installed ? '✅' : '❌'}</div>
            <div className='text-white/60'>Phantom</div>
            <div className='text-sm text-white/40'>{phantomStatus.installed ? 'Instalado' : 'Não instalado'}</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-2xl font-bold'>
              {metamaskStatus.connected || phantomStatus.connected ? '🔗' : '🔌'}
            </div>
            <div className='text-white/60'>Conexão</div>
            <div className='text-sm text-white/40'>
              {metamaskStatus.connected || phantomStatus.connected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WalletIntegration
